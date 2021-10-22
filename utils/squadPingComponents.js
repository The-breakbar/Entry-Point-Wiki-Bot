const { MessageButton, MessageActionRow, MessageSelectMenu } = require("discord.js");

module.exports = {
	// Generate page 2 with appropriate select menus (missions/method/difficulties)
	page2(type) {
		let difficulties = type == "daily" ? ["Operative", "Elite", "Legend"] : ["Rookie", "Professional", "Operative", "Elite", "Legend"];
		const data = page2Data[type];
		let rows = [];

		const embed = {
			title: data.title,
			description: data.description,
			color: global.purple
		};

		if (data.missions) {
			rows.push(
				new MessageSelectMenu({
					customId: page2Data.selectMenu.mission.customId,
					placeholder: page2Data.selectMenu.mission.placeholder,
					options: data.missions.map((mission) => {
						return { label: mission, value: mission };
					}),
					maxValues: type == "stealth" ? 3 : type == "loud" ? 3 : 1
				})
			);
		}

		if (data.method) {
			rows.push(
				new MessageSelectMenu({
					customId: page2Data.selectMenu.method.customId,
					placeholder: page2Data.selectMenu.method.placeholder,
					options: data.method.map((method) => {
						return { label: method, value: method };
					})
				})
			);
		}

		rows.push(
			new MessageSelectMenu({
				customId: page2Data.selectMenu.difficulty.customId,
				placeholder: page2Data.selectMenu.difficulty.placeholder,
				options: difficulties.map((difficulty) => {
					return { label: difficulty, value: difficulty };
				}),
				maxValues: type == "nightheist" ? 1 : type == "freelanceheist" ? 1 : difficulties.length
			})
		);

		rows.push(
			new MessageButton({
				style: "PRIMARY",
				label: "Next",
				customId: "next"
			})
		);

		rows = rows.map((component) => new MessageActionRow({ components: [component] }));
		return { embeds: [embed], components: rows };
	},

	// Generate page 3 as an overview for selected options
	page3(data) {
		const { type, missions, method, difficulties } = data;
		const { title } = page3Data[type];

		let embed = {
			title: title,
			color: global.purple,
			fields: [],
			footer: {
				text: "Let people know if you have any additional info."
			}
		};

		if (missions) embed.fields.push({ name: `Mission${missions.length == 1 ? "" : "s"}`, value: missions.join(", "), inline: true });
		if (method) embed.fields.push({ name: "Method", value: method, inline: true });
		if (difficulties) embed.fields.push({ name: `Difficult${difficulties.length == 1 ? "y" : "ies"}`, value: difficulties.join(", "), inline: true });

		const button = new MessageButton({
			style: "SUCCESS",
			label: "Send ping",
			customId: "send"
		});

		return { embeds: [embed], components: [new MessageActionRow({ components: [button] })] };
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
				text: type == "daily" ? "Use the /dailychallenge command to check the current challenge." : undefined
			}
		};

		if (missions) embed.fields.push({ name: `Mission${missions.length == 1 ? "" : "s"}`, value: missions.join(", "), inline: true });
		if (method) embed.fields.push({ name: "Method", value: method, inline: true });
		if (difficulties) embed.fields.push({ name: `Difficult${difficulties.length == 1 ? "y" : "ies"}`, value: difficulties.join(", "), inline: true });

		const button = new MessageButton({
			style: "LINK",
			label: "Private server",
			url: "https://www.roblox.com/games/740581508/Entry-Point?privateServerLinkCode=SGuBUOpnHBdk_QEEM6DKCX3F69B7ER2X"
		});

		return { embeds: [embed], components: [new MessageActionRow({ components: [button] })] };
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
		color: "BLUE"
	},
	loud: {
		title: "Loud ping",
		color: "RED"
	},
	ironman: {
		title: "Ironman ping",
		color: "ORANGE"
	},
	shadowwar: {
		title: "Shadow War ping",
		color: "GREEN"
	},
	nightheist: {
		title: "Night Heist ping",
		color: "DARK_BLUE"
	},
	freelanceheist: {
		title: "Freelance Heist ping",
		color: "GOLD"
	},
	daily: {
		title: "Daily Challenge ping",
		color: global.purple
	}
};
