const { ButtonBuilder, ButtonStyle, ActionRowBuilder } = require("discord.js");

const embed = {
	color: global.colors.purple,
	description: "Click to play:"
};

const button = new ButtonBuilder()
	.setStyle(ButtonStyle.Link)
	.setLabel("Private Server")
	.setURL("https://www.roblox.com/games/740581508?privateServerLinkCode=07225942152546546599064025460286");

const row = new ActionRowBuilder().addComponents(button);

module.exports = {
	global: true,
	name: "privateserver",
	description: "Get the wiki private server link",
	async execute(interaction, client) {
		// Reply with link
		await interaction.deferReply();
		await interaction.editReply({ embeds: [embed], components: [row] });
	}
};
