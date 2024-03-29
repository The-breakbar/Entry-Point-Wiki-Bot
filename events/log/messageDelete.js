module.exports = {
	name: "messageDelete",
	async execute(message, client) {
		// Only log for wiki server
		if (message.guild != client.wikiServer.guild || message.author.bot) return;

		let { author, channel, content, attachments } = message;

		const embed = {
			color: global.colors.red,
			author: {
				name: author.tag,
				icon_url: author.displayAvatarURL()
			},
			description: `
				**Message sent by ${author} deleted in ${channel}**${content != "" ? "\n" + content : ""}${
				attachments.size > 0 ? "\n" + `[Attachment (.${attachments.first().url.split("/").slice(-1)[0].split(".").slice(-1)})](${attachments.first().url})` : ""
			}`,
			timestamp: new Date(),
			footer: {
				text: `ID: ${message.author.id}`
			}
		};

		await client.wikiServer.log.send({ embeds: [embed] });
	}
};
