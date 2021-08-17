// COMMAND: privateserver
// Send a link to the Entry Point Wiki private server

const { MessageActionRow, MessageButton } = require("discord.js");

const embed = {
	color: global.purple,
	description: "Click to play:"
};

const button = {
	style: "LINK",
	label: "Private Server",
	url: "https://www.roblox.com/games/740581508/Entry-Point?privateServerLinkCode=SGuBUOpnHBdk_QEEM6DKCX3F69B7ER2X"
};

module.exports = {
	enabled: false,
	global: false,
	name: "privateserver",
	description: "Get the Wiki private server link",
	async execute(interaction, client) {
		// Reply with link
		await interaction.deferReply();
		const row = new MessageActionRow({ components: [new MessageButton(button)] });
		await interaction.editReply({ embeds: [embed], components: [row] });
	}
};
