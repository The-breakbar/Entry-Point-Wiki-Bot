const { MessageEmbed, MessageActionRow, MessageSelectMenu, MessageButton } = require("discord.js");
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
const getSecondMessage = (
	value,
	missionSelect = false,
	methodSelect = false,
	difficultySelect = false,
	missionSelectCount = 1
) => {
	// Text embed
	const embed = new MessageEmbed()
		.setTitle(pages[1].embed[value].title)
		.setDescription(pages[1].embed[value].description);

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
				.setMaxValues(missionSelectCount)
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
			if (method && difficulties) output = true;
			break;
		case "freelanceheist":
			if (missions && method && difficulties) output = true;
			break;
		case "daily":
			if (difficulties) output = true;
			break;
	}

	return output;
};

module.exports = {
	name: "interactionCreate",
	once: false,
	async execute(interaction, client) {
		if (!(interaction.isSelectMenu() || interaction.isButton())) return;
		if (!["pingselect", "mission", "method", "difficulty", "next"].includes(interaction.customId)) return;

		try {
			// First page ping select
			if (interaction.customId == "pingselect") {
				const value = interaction.values[0];
				pingMessages[interaction.message.id] = { type: value };

				switch (value) {
					case "stealth":
					case "loud":
						await interaction.update(getSecondMessage(value, true, false, true, 3));
						break;
					case "ironman":
						await interaction.update(getSecondMessage(value, false, true, true));
						break;
					case "shadowwar":
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
					interaction.deferUpdate();
				}
			} else if (interaction.customId == "method") {
				const values = interaction.values;
				pingMessages[interaction.message.id].method = values[0];
				if (!interaction.defferred) {
					interaction.deferUpdate();
				}
			} else if (interaction.customId == "difficulty") {
				const values = interaction.values;
				pingMessages[interaction.message.id].difficulties = values;
				if (!interaction.defferred) {
					interaction.deferUpdate();
				}
			} else if (interaction.customId == "next") {
				if (validateSecondPage(interaction.message.id)) {
					console.log(`Generating page 3 with this data: ${pingMessages[interaction.message.id]}`);
				}
			}
		} catch (error) {
			console.log(error);
			interaction.update({ content: `There was an error while executing the command.\n\`\`\`${error}\`\`\`` });
		}
	}
};
