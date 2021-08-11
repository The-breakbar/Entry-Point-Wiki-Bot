let typingTarget = 0;

module.exports = {
	name: "say",
	description: "A special command for Elite Operatives and Server Boosters",
	options: [{ name: "message", type: "STRING", description: "What Wiki Bot should say", required: true }],
	defaultPermission: false,
	permissions: ["742452037043748965", "668198708776665102", "621679404636176384", "621679757221822465"], // Elite Operative, Server Booster, Wiki Admin, Wiki Mod
	//channelWhitelist = ["621749314787737605"],
	async execute(interaction, client) {
		let text = interaction.options.getString("message");
		let textLength = (text.length / 6) * 1000;
		let time = textLength > 10000 ? 10000 : textLength;
		if (text.includes("@")) {
			interaction.reply({ content: "Please do not include any pings in your message.", ephemeral: true });
		} else {
			interaction.reply({ content: "Your message is being sent.", ephemeral: true }).then(() => {
				let finishTime = Date.now() + time;
				typingTarget = finishTime > typingTarget ? finishTime : typingTarget;
				interaction.channel.sendTyping().then(() => {
					setTimeout(() => {
						interaction.channel
							.send(text)
							.then(() => {
								if (Date.now() < typingTarget) {
									interaction.channel.sendTyping();
								}
							})
							.catch((error) => console.error(error));
					}, time);
				});
			});
		}
	}
};
