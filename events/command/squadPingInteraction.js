const { page2, page3, page4, validateInput } = require("../../utils/squadPingComponents.js");

// Global variables accessed for cooldown
global.pingStates = {
	stealth: true,
	loud: true,
	ironman: true,
	shadowwar: true,
	nightheist: true,
	freelanceheist: true,
	daily: true
};

// Cache for current squadping menus
let pingMessages = {};

module.exports = {
	name: "interactionCreate",
	async execute(i, client) {
		// Handles all interaction events related to the squad ping command
		if (!(i.isStringSelectMenu() || i.isButton())) return;
		if (!["pingselect", "mission", "method", "difficulty", "next", "send"].includes(i.customId)) return;

		// Interaction info
		const values = i.values;
		const id = i.message.id;
		const customId = i.customId;

		try {
			switch (customId) {
				// Selecting ping type on page 1
				case "pingselect":
					pingMessages[id] = { type: values[0] };
					// Skip mission/method/difficulty select if shadow war
					if (values[0] == "shadowwar") {
						await i.update(page3(pingMessages[id]));
					} else {
						await i.update(page2(values[0]));
					}
					break;

				// Selecting missions on page 2
				case "mission":
					pingMessages[id].missions = values;
					if (!i.defferred) await i.deferUpdate();
					break;

				// Selecting method on page 2
				case "method":
					pingMessages[id].method = values[0];
					if (!i.defferred) await i.deferUpdate();
					break;

				// Selecting difficulties on page 2
				case "difficulty":
					pingMessages[id].difficulties = values;
					if (!i.defferred) await i.deferUpdate();
					break;

				// Confirming page 2
				case "next":
					if (validateInput(pingMessages[id])) await i.update(page3(pingMessages[id]));
					break;

				// Confirming page 3
				case "send":
					// Check if ping can be sent
					if (global.pingStates[pingMessages[id].type]) {
						await i.update({
							content: "The ping has been successfully sent.",
							embeds: [],
							components: []
						});

						// Initiate cooldown
						const type = pingMessages[id].type;
						global.pingStates[type] = false;
						setTimeout(() => {
							global.pingStates[type] = true;
						}, 1800000);

						// Send squad ping
						let message = page4(pingMessages[id]);
						let pingMention;
						switch (type) {
							case "stealth":
								pingMention = `<@&${global.wConfig.roles["Stealth Ping"]}>`;
								break;
							case "loud":
								pingMention = `<@&${global.wConfig.roles["Loud Ping"]}>`;
								break;
							case "ironman":
								pingMention = `<@&${global.wConfig.roles["Ironman Ping"]}>`;
								break;
							case "shadowwar":
								pingMention = `<@&${global.wConfig.roles["Shadow War Ping"]}>`;
								break;
							case "freelanceheist":
								pingMention = `<@&${global.wConfig.roles["Freelance Heist Ping"]}>`;
								break;
							case "nightheist":
								pingMention = `<@&${global.wConfig.roles["Night Heist Ping"]}>`;
								break;
							case "daily":
								pingMention = `<@&${global.wConfig.roles["Daily Challenge Ping"]}>`;
								break;
						}
						message.content = `${pingMention} ${i.user}`;
						await i.channel.send(message).catch((error) => console.error(error));
					} else {
						await i.update({ content: "The ping could not be sent, it is still on cooldown.", embeds: [], components: [] });
					}
					break;
			}
		} catch (error) {
			// Catch any errors and notify users
			console.error(error);
			i.update({
				content: `There was an error while executing the command!`,
				embeds: [],
				components: [],
				ephemeral: true
			});
		}
	}
};
