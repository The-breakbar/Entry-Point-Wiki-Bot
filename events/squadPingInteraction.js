const pages = require("../utils/squadPingData.js");
global.pingStates = {
	stealth: true,
	loud: true,
	ironman: true,
	shadowwar: true,
	nightheist: true,
	freelanceheist: true,
	daily: true
};

module.exports = {
	name: "interactionCreate",
	once: false,
	async execute(interaction, client) {
		// Bind event listeners and send first page
		client.on("interactionCreate", async (interaction) => {
			if (!(interaction.isSelectMenu() || interaction.isButton())) return;

			if (interaction.customId == "pingselect") {
				const value = interaction.values[0];
				switch (value) {
					case "stealth":
					case "loud":
						break;
					case "ironman":
						break;
					case "shadowwar":
						break;
					case "nightheist":
						break;
					case "freelanceheist":
						break;
					case "daily":
						break;
				}
			}
		});
	}
};
