const { MessageActionRow, MessageButton } = require("discord.js");

module.exports = {
	name: "privateserver",
	description: "Get the Wiki Private Server link.",
	async execute(interaction, client) {
		// Link Button
		const row = new MessageActionRow().addComponents(
			new MessageButton()
				.setStyle("LINK")
				.setLabel("Private Server")
				.setURL(
					"https://www.roblox.com/games/740581508/Entry-Point?privateServerLinkCode=SGuBUOpnHBdk_QEEM6DKCX3F69B7ER2X"
				)
		);

		// Reply with message
		await interaction.reply({ content: "Click to play:", components: [row] });
	}
};
