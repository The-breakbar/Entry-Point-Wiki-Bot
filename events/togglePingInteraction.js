const { MessageActionRow } = require("discord.js");
const getButtons = require("../utils/pingRolesData.js");

module.exports = {
	name: "interactionCreate",
	async execute(interaction, client) {
		// Filter out other interactions
		if (!interaction.isButton()) return;
		if (
			![
				"Stealth Ping",
				"Loud Ping",
				"Ironman Ping",
				"Shadow War Ping",
				"Night Heist Ping",
				"Freelance Heist Ping",
				"Daily Challenge Ping"
			].includes(interaction.customId)
		)
			return;

		let member = interaction.member;
		let pingRole = interaction.customId;
		if (member.roles.cache.some((role) => role.name == pingRole)) {
			await member.roles.remove(member.guild.roles.cache.find((role) => role.name == pingRole));
		} else {
			await member.roles.add(member.guild.roles.cache.find((role) => role.name == pingRole));
		}

		let buttons = getButtons(interaction.member);
		let row1 = new MessageActionRow().addComponents(buttons[0]);
		let row2 = new MessageActionRow().addComponents(buttons[1]);
		await interaction.update({
			content: `Toggled ${interaction.customId}`,
			components: [row1, row2],
			ephemeral: true
		});
	}
};
