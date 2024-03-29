const { ApplicationCommandOptionType } = require("discord.js");
const { mute } = require("../../utils/muteUtils");

module.exports = {
	disabled: true,
	name: "mute",
	description: "Mute command for server staff",
	options: [
		{
			name: "user",
			type: ApplicationCommandOptionType.User,
			description: "A user ping, or their user id",
			required: true
		},
		{
			name: "length",
			type: ApplicationCommandOptionType.String,
			description: "A number and a letter (m = minute, h = hour, d = day) e.g. 15m / 6h / 1d",
			required: true
		}
	],
	async execute(interaction, client) {
		const member = interaction.options.getMember("user");
		const muteLength = interaction.options.getString("length");

		// Check if mute length is valid
		if (/^([1-9]|[1-9][0-9])[dhm]$/.test(muteLength.trim())) {
			// Parse mute length
			const type = muteLength.slice(-1);
			const timeNumber = muteLength.slice(0, muteLength.length == 2 ? 1 : 2);

			let time;
			switch (type) {
				case "m":
					time = timeNumber * 1000 * 60;
					break;
				case "h":
					time = timeNumber * 1000 * 60 * 60;
					break;
				case "d":
					time = timeNumber * 1000 * 60 * 60 * 24;
					break;
			}

			const typeText = type == "m" ? "minute" : type == "h" ? "hour" : "day";
			const embed = {
				description: `Muted ${member.user} for ${timeNumber} ${typeText}${timeNumber == 1 ? "" : "s"}.`,
				color: global.colors.purple,
				timestamp: new Date()
			};
			const muteEmbed = {
				description: `You have been muted for ${timeNumber} ${typeText}${timeNumber == 1 ? "" : "s"}.`,
				color: global.colors.purple,
				timestamp: new Date()
			};

			await mute(member, time);
			await interaction.reply({ embeds: [embed] });
			await member.send({ embeds: [muteEmbed] }).catch((error) => console.error(error));

			// Log command usage
			await client.wikiServer.reports.send({ embeds: [embed] }).catch((error) => console.error(error));
		} else {
			await interaction.reply({ content: "Invalid mute length, see description for proper usage (e.g. 15m / 6h / 1d).", ephemeral: true });
		}
	}
};
