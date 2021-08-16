const { MessageActionRow, MessageButton, MessageEmbed } = require("discord.js");

module.exports = {
	// enabled: true,
	name: "privateserver",
	description: "Get the Wiki private server link",
	async execute(interaction, client) {
		await interaction.deferReply();
		// Link Button
		const row = new MessageActionRow().addComponents(
			new MessageButton()
				.setStyle("LINK")
				.setLabel("Private Server")
				.setURL(
					"https://www.roblox.com/games/740581508/Entry-Point?privateServerLinkCode=SGuBUOpnHBdk_QEEM6DKCX3F69B7ER2X"
				)
		);

		// Embed
		const embed = new MessageEmbed().setColor(global.purple).setDescription("Click to play:");

		// Reply with message
		await interaction.editReply({ embeds: [embed], components: [row] });
	}
};
