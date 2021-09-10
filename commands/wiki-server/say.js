// For typing event
let typingTarget = 0;

module.exports = {
	name: "say",
	description: "A special command for Elite Operatives and Financiers",
	options: [
		{ name: "message", type: "STRING", description: "What Wiki Bot should say", required: true },
		{ name: "reply-url", type: "STRING", description: "Link of the message to reply to (right-click, copy message link)", required: false }
	],
	defaultPermission: false,
	permissions: [
		global.wConfig.roles["Elite Operative"],
		global.wConfig.roles["The Financiers"],
		global.wConfig.roles["Wiki Administrator"],
		global.wConfig.roles["Wiki Moderator"]
	],
	// channelWhitelist = ["621749314787737605"], // #broom-closet
	async execute(interaction, client) {
		// Defer reply
		await interaction.deferReply({ ephemeral: true });

		// Parse user input
		let text = interaction.options.getString("message");
		let textLength = (text.length / 3) * 1000;
		let time = textLength > 10000 ? 10000 : textLength;

		// Parse user input for replies
		let replyLink = interaction.options.getString("reply-url");
		let replyId;
		if (replyLink) replyId = replyLink.split("/").pop();

		// Return if message has ping
		if (text.includes("@")) {
			interaction.editReply({ content: "Please do not include any pings in your message.", ephemeral: true });
		} else if (replyId && (!/^\d+$/.test(replyId) || !interaction.channel.messages.cache.has(replyId))) {
			interaction.editReply({ content: "Couldn't find message to reply to.", ephemeral: true });
		} else {
			interaction.editReply({ content: "Your message is being sent.", ephemeral: true }).then(() => {
				// Update time until which it should type
				let finishTime = Date.now() + time;
				typingTarget = finishTime > typingTarget ? finishTime : typingTarget;

				// Start typing and then send message
				interaction.channel.sendTyping().then(() => {
					setTimeout(() => {
						// Reply if link is specified
						if (replyId) {
							interaction.channel.messages.cache
								.get(replyId)
								.reply(text)
								.then(() => {
									// Continue typing if still needed
									if (Date.now() < typingTarget) {
										interaction.channel.sendTyping();
									}
								})
								.catch((error) => console.error(error));
						} else {
							// Else just send message
							interaction.channel
								.send(text)
								.then(() => {
									// Continue typing if still needed
									if (Date.now() < typingTarget) {
										interaction.channel.sendTyping();
									}
								})
								.catch((error) => console.error(error));
						}
					}, time);
				});
			});

			// Log command usage
			const embed = {
				title: `/say command`,
				color: global.purple,
				description: `${interaction.member.user} - ${text}`,
				timestamp: new Date()
			};
			client.wikiServer.log.send({ embeds: [embed] }).catch((error) => console.error(error));
		}
	}
};
