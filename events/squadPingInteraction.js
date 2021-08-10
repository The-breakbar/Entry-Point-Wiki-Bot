const {
	MessageEmbed,
	MessageActionRow,
	MessageSelectMenu,
	MessageButton,
	BaseGuildVoiceChannel
} = require("discord.js");
const pages = require("../utils/squadPingData.js");
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

let pingMessages = {};

// Build second page message
const getSecondMessage = (value, missionSelect = false, methodSelect = false, difficultySelect = false) => {
	// Text embed
	const embed = new MessageEmbed()
		.setTitle(pages[1].embed[value].title)
		.setDescription(pages[1].embed[value].description)
		.setColor(global.purple);

	// Generate select menus if needed
	let difficulties = ["Rookie", "Professional", "Operative", "Elite", "Legend"];
	let rows = [];

	// Mission select
	if (missionSelect) {
		rows.push(
			new MessageSelectMenu()
				.setCustomId(pages[1].selectMenu.mission.customId)
				.setPlaceholder(pages[1].selectMenu.mission.placeholder)
				.addOptions(
					pages[1].embed[value].missions.map((mission) => {
						return { label: mission, value: mission };
					})
				)
				.setMaxValues(value == "stealth" ? 3 : value == "loud" ? 3 : 1)
		);
	}

	// Method select (for ironman and freelance heist)
	if (methodSelect) {
		rows.push(
			new MessageSelectMenu()
				.setCustomId(pages[1].selectMenu.method.customId)
				.setPlaceholder(pages[1].selectMenu.method.placeholder)
				.addOptions(
					pages[1].embed[value].method.map((method) => {
						return { label: method, value: method };
					})
				)
		);
	}

	// Difficulty select
	if (difficultySelect) {
		let difficultiesList = value == "daily" ? difficulties.slice(2) : difficulties;
		rows.push(
			new MessageSelectMenu()
				.setCustomId(pages[1].selectMenu.difficulty.customId)
				.setPlaceholder(pages[1].selectMenu.difficulty.placeholder)
				.addOptions(
					difficultiesList.map((difficulty) => {
						return { label: difficulty, value: difficulty };
					})
				)
				.setMaxValues(value == "nightheist" ? 1 : value == "freelanceheist" ? 1 : difficultiesList.length)
		);
	}

	// Next button
	rows.push(new MessageButton().setCustomId("next").setLabel("Next").setStyle("PRIMARY"));

	// Return complete message
	rows = rows.map((selectMenu) => new MessageActionRow().addComponents(selectMenu));
	return { embeds: [embed], components: rows, ephemeral: true };
};

// Check if second page inputs are valid
const validateSecondPage = (id) => {
	let output = false;
	let type = pingMessages[id].type;
	let missions = pingMessages[id].missions;
	let method = pingMessages[id].method;
	let difficulties = pingMessages[id].difficulties;

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
};

const getThirdMessage = (id, isPing) => {
	let type = pingMessages[id].type;
	let missions = pingMessages[id].missions;
	let method = pingMessages[id].method;
	let difficulties = pingMessages[id].difficulties;

	// Ping message
	let embed = new MessageEmbed();
	if (isPing) {
		embed.setTitle(pages[2][type].title).setColor(pages[2][type].color);
		if (type == "daily") {
			embed.setFooter("Use the /dailychallenge command to check the current challenge.");
		}
	} else {
		embed
			.setTitle(`Confirm ${pages[2][type].title}?`)
			.setColor(global.purple)
			.setFooter("Let people know if you have any additional info.");
	}
	let fields = [];
	if (missions) {
		fields.push({ name: `Mission${missions.length == 1 ? "" : "s"}`, value: missions.join("\n"), inline: true });
	}
	if (method) {
		fields.push({ name: "Method", value: method, inline: true });
	}
	if (difficulties) {
		fields.push({
			name: `Difficult${difficulties.length == 1 ? "y" : "ies"}`,
			value: difficulties.join("\n"),
			inline: true
		});
	}
	embed.addFields(fields);

	// Button
	const row = new MessageActionRow();
	if (isPing) {
		row.addComponents(
			new MessageButton()
				.setStyle("LINK")
				.setLabel("Private Server")
				.setURL(
					"https://www.roblox.com/games/740581508/Entry-Point?privateServerLinkCode=SGuBUOpnHBdk_QEEM6DKCX3F69B7ER2X"
				)
		);
	} else {
		row.addComponents(new MessageButton().setCustomId("send").setLabel("Send ping").setStyle("SUCCESS"));
	}

	return { embeds: [embed], components: [row] };
};

const getPing = (id, author) => {
	const type = pingMessages[id].type;
	pingStates[type] = false;
	setTimeout(() => {
		global.pingStates[type] = true;
	}, 1800000);
	let message = getThirdMessage(id, true);
	message.content = `Ping ${author}`; // Add ping ids
	return message;
};

module.exports = {
	name: "interactionCreate",
	once: false,
	async execute(interaction, client) {
		if (!(interaction.isSelectMenu() || interaction.isButton())) return;
		if (!["pingselect", "mission", "method", "difficulty", "next", "send"].includes(interaction.customId)) return;

		try {
			// First page ping select
			if (interaction.customId == "pingselect") {
				const value = interaction.values[0];
				pingMessages[interaction.message.id] = { type: value };

				switch (value) {
					case "stealth":
					case "loud":
						await interaction.update(getSecondMessage(value, true, false, true));
						break;
					case "ironman":
						await interaction.update(getSecondMessage(value, false, true, true));
						break;
					case "shadowwar":
						await interaction.update(getThirdMessage(interaction.message.id, false));
						break;
					case "nightheist":
						await interaction.update(getSecondMessage(value, true, false, true));
						break;
					case "freelanceheist":
						await interaction.update(getSecondMessage(value, true, true, true));
						break;
					case "daily":
						await interaction.update(getSecondMessage(value, false, false, true));
						break;
				}
			} else if (interaction.customId == "mission") {
				const values = interaction.values;
				pingMessages[interaction.message.id].missions = values;
				if (!interaction.defferred) {
					await interaction.deferUpdate();
				}
			} else if (interaction.customId == "method") {
				const values = interaction.values;
				pingMessages[interaction.message.id].method = values[0];
				if (!interaction.defferred) {
					await interaction.deferUpdate();
				}
			} else if (interaction.customId == "difficulty") {
				const values = interaction.values;
				pingMessages[interaction.message.id].difficulties = values;
				if (!interaction.defferred) {
					await interaction.deferUpdate();
				}
			} else if (interaction.customId == "next") {
				if (validateSecondPage(interaction.message.id)) {
					await interaction.update(getThirdMessage(interaction.message.id, false));
				}
			} else if (interaction.customId == "send") {
				if (global.pingStates[pingMessages[interaction.message.id].type]) {
					await interaction.update({
						content: "The ping has been successfully sent.",
						components: []
					});
					await interaction.followUp(getPing(interaction.message.id, interaction.user));
				} else {
					await interaction.update({ content: "The ping could not be sent, it is still on cooldown.", components: [] });
				}
			}
		} catch (error) {
			console.log(error);
			interaction.update({
				content: `There was an error while executing the command.\n\`\`\`${error}\`\`\``,
				embeds: [],
				components: [],
				ephemeral: true
			});
		}
	}
};
