const { MessageActionRow, MessageButton } = require("discord.js");

const embed = {
	color: global.purple,
	description: "Click to play:"
};

const button = {
	style: "LINK",
	label: "Private Server",
	url: "https://www.roblox.com/games/740581508?privateServerLinkCode=07225942152546546599064025460286"
};

module.exports = {
	global: true,
	name: "privateserver",
	description: "Get the Wiki private server link",
	async execute(interaction, client) {
		// Reply with link
		await interaction.deferReply();
		const row = new MessageActionRow({ components: [new MessageButton(button)] });
		await interaction.editReply({ embeds: [embed], components: [row] });
	}
};
