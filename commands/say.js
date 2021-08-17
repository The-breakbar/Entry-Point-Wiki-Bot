// COMMAND: say
// Make the bot say a message, simulate typing depending on message length, only for Elite Operatives and Server Boosters

// For typing event
let typingTarget = 0;

module.exports = {
	enabled: false,
	global: false,
	name: "say",
	description: "A special command for Elite Operatives and Financiers",
	options: [{ name: "message", type: "STRING", description: "What Wiki Bot should say", required: true }],
	defaultPermission: false,
	permissions: ["742452037043748965", "668198708776665102", "621679404636176384", "621679757221822465"], // Elite Operative, Server Booster, Wiki Admin, Wiki Mod
	// channelWhitelist = ["621749314787737605"], // #broom-closet
	async execute(interaction, client) {
		// Defer reply
		await interaction.deferReply({ ephemeral: true });

		// Parse user input
		let text = interaction.options.getString("message");
		let textLength = (text.length / 6) * 1000;
		let time = textLength > 10000 ? 10000 : textLength;

		// Return if message has ping
		if (text.includes("@")) {
			interaction.editReply({ content: "Please do not include any pings in your message.", ephemeral: true });
		} else {
			interaction.editReply({ content: "Your message is being sent.", ephemeral: true }).then(() => {
				// Update time until which it should type
				let finishTime = Date.now() + time;
				typingTarget = finishTime > typingTarget ? finishTime : typingTarget;

				// Start typing and then send message
				interaction.channel.sendTyping().then(() => {
					setTimeout(() => {
						interaction.channel
							.send(text)
							.then(() => {
								// Continue typing if still needed
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
