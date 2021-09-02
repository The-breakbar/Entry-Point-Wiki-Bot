const { MessageButton, MessageActionRow } = require("discord.js");

module.exports = {
	name: "Report message",
	type: ["MESSAGE"],
	async execute(interaction, client) {
		// Defer reply
		await interaction.deferReply({ ephemeral: true });

		// Create report embed
		const message = interaction.options.getMessage("message");
		const member = message.member;

		const embed = {
			title: `Report from ${interaction.member.displayName}`,
			description: `[Jump to message](${message.url})`,
			color: "RED",
			fields: [
				{
					name: member.displayName,
					value: message?.content == "" ? "Empty message" : message.content
				}
			],
			timestamp: new Date()
		};

		// Close report button
		const button = new MessageButton({
			style: "SUCCESS",
			label: "Close report",
			customId: "close-report"
		});

		// Send embed in #reports
		await client.wikiServer.reports.send({ embeds: [embed], components: [new MessageActionRow({ components: [button] })] });
		await interaction.editReply({ content: "Thank you, the message has been reported to server staff.", ephemeral: true });
	}
};
