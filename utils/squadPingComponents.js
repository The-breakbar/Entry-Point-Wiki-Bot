const { ButtonBuilder, ButtonStyle, ActionRowBuilder, StringSelectMenuBuilder } = require("discord.js");

module.exports = {
	// Generate page 2 with appropriate select menus (missions/method/difficulties)
	page2(type) {
		let difficulties = type == "daily" ? ["Operative", "Elite", "Legend"] : ["Rookie", "Professional", "Operative", "Elite", "Legend"];
		const data = page2Data[type];
		let rows = [];

		const embed = {
			title: data.title,
			description: data.description,
			color: global.colors.purple
		};

		if (data.missions) {
			rows.push(
				new StringSelectMenuBuilder()
					.setCustomId(page2Data.selectMenu.mission.customId)
					.setPlaceholder(page2Data.selectMenu.mission.placeholder)
					.addOptions(
						data.missions.map((mission) => {
							return { label: mission, value: mission };
						})
					)
					.setMaxValues(type == "stealth" ? 3 : type == "loud" ? 3 : 1)
			);
		}

		if (data.method) {
			rows.push(
				new StringSelectMenuBuilder()
					.setCustomId(page2Data.selectMenu.method.customId)
					.setPlaceholder(page2Data.selectMenu.method.placeholder)
					.addOptions(
						data.method.map((method) => {
							return { label: method, value: method };
						})
					)
			);
		}

		rows.push(
			new StringSelectMenuBuilder()
				.setCustomId(page2Data.selectMenu.difficulty.customId)
				.setPlaceholder(page2Data.selectMenu.difficulty.placeholder)
				.addOptions(
					difficulties.map((difficulty) => {
						return { label: difficulty, value: difficulty };
					})
				)
				.setMaxValues(type == "nightheist" ? 1 : type == "freelanceheist" ? 1 : difficulties.length)
		);

		rows.push(new ButtonBuilder().setStyle(ButtonStyle.Primary).setLabel("Next").setCustomId("next"));

		rows = rows.map((component) => new ActionRowBuilder().addComponents(component));
		return { embeds: [embed], components: rows };
	},

	// Generate page 3 as an overview for selected options
	page3(data) {
		const { type, missions, method, difficulties } = data;
		const { title } = page3Data[type];

		let embed = {
			title: title,
			color: global.colors.purple,
			fields: [],
			footer: {
				text: "Let people know if you have any additional info."
			}
		};

		if (missions) embed.fields.push({ name: `Mission${missions.length == 1 ? "" : "s"}`, value: missions.join(", "), inline: true });
		if (method) embed.fields.push({ name: "Method", value: method, inline: true });
		if (difficulties) embed.fields.push({ name: `Difficult${difficulties.length == 1 ? "y" : "ies"}`, value: difficulties.join(", "), inline: true });

		const button = new ButtonBuilder().setStyle(ButtonStyle.Success).setLabel("Send ping").setCustomId("send");

		return { embeds: [embed], components: [new ActionRowBuilder().addComponents(button)] };
	},

	// Generate page 4, final ping message (without ping)
	page4(data) {
		const { type, missions, method, difficulties } = data;
		const { title, color } = page3Data[type];

		let embed = {
			title: title,
			color: color,
			fields: [],
			footer: {
				text: "Use /togglepings to manage ping notifications."
			}
		};

		if (missions) embed.fields.push({ name: `Mission${missions.length == 1 ? "" : "s"}`, value: missions.join(", "), inline: true });
		if (method) embed.fields.push({ name: "Method", value: method, inline: true });
		if (difficulties) embed.fields.push({ name: `Difficult${difficulties.length == 1 ? "y" : "ies"}`, value: difficulties.join(", "), inline: true });

		const button = new ButtonBuilder()
			.setStyle(ButtonStyle.Link)
			.setLabel("Private server")
			.setURL("https://www.roblox.com/games/740581508?privateServerLinkCode=07225942152546546599064025460286");

		return { embeds: [embed], components: [new ActionRowBuilder().addComponents(button)] };
	},

	// Check if selected missions/method/difficulties are valid
	validateInput(data) {
		let output = false;
		const { type, missions, method, difficulties } = data;

		switch (type) {
			case "stealth":
			case "loud":
			case "nightheist":
				if (missions && difficulties) output = true;
				break;
			case "ironman":
				const legendStealth = method == "Stealth" && difficulties.includes("Legend");
				if (method && difficulties && !legendStealth) output = true;
				break;
			case "freelanceheist":
				if (missions && method && difficulties) {
					const setupLoud = missions[0] == "The Setup" && method == "Loud";
					const scoreStealth = missions[0] == "The Score" && method == "Stealth";
					if (!setupLoud && !scoreStealth) output = true;
				}
				break;
			case "daily":
				if (difficulties) output = true;
				break;
		}

		return output;
	}
};

const page2Data = {
	selectMenu: {
		mission: {
			customId: "mission",
			placeholder: "Select mission"
		},
		method: {
			customId: "method",
			placeholder: "Select method"
		},
		difficulty: {
			customId: "difficulty",
			placeholder: "Select difficulty"
		}
	},
	stealth: {
		title: "Select missions and difficulties",
		description: "Select up to 3 missions and any difficulties",
		missions: [
			"The Blacksite",
			"The Financier",
			"The Deposit",
			"The Lakehouse",
			"The Withdrawal",
			"The Scientist",
			"The SCRS",
			"Black Dusk",
			"The Killhouse",
			"The Auction",
			"The Gala",
			"The Cache",
			"The Setup",
			"The Lockup",
			"Concept"
		]
	},
	loud: {
		title: "Select missions and difficulties",
		description: "Select up to 3 missions and any difficulties",
		missions: [
			"The Blacksite",
			"The Financier",
			"The Deposit",
			"The Lakehouse",
			"The Withdrawal",
			"The Scientist",
			"The SCRS",
			"Black Dusk",
			"The Killhouse",
			"The Lockup",
			"The Score"
		]
	},
	ironman: {
		title: "Select method and difficulties",
		description: "You can select multiple difficulties. You can not ping for Legend Stealth Ironman.",
		method: ["Stealth", "Loud", "Mixed"]
	},
	nightheist: {
		title: "Select mission and difficulty",
		description: "This is for requesting a mission host, if you need a squad, please use the Stealth/Loud ping.",
		missions: ["The Auction", "The Gala", "The Cache"]
	},
	freelanceheist: {
		title: "Select mission and difficulty",
		description: "This is for requesting a mission host, if you need a squad, please use the Stealth/Loud ping. You can not ping for Setup loud/Score stealth.",
		missions: ["The Setup", "The Lockup", "The Score"],
		method: ["Stealth", "Loud"]
	},
	daily: {
		title: "Select difficulties",
		description: "You can select multiple difficulties."
	}
};

const page3Data = {
	stealth: {
		title: "Stealth ping",
		color: global.colors.blue
	},
	loud: {
		title: "Loud ping",
		color: global.colors.red
	},
	ironman: {
		title: "Ironman ping",
		color: global.colors.orange
	},
	shadowwar: {
		title: "Shadow War ping",
		color: global.colors.green
	},
	nightheist: {
		title: "Night Heist ping",
		color: global.colors.darkBlue
	},
	freelanceheist: {
		title: "Freelance Heist ping",
		color: global.colors.gold
	},
	daily: {
		title: "Daily Challenge ping",
		color: global.colors.purple
	}
};
