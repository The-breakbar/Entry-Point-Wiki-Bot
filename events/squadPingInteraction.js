const { MessageEmbed, MessageActionRow, MessageSelectMenu } = require("discord.js");
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

// Build second page message
const getSecondMessage = (
	page2,
	value,
	missionSelect = false,
	methodSelect = false,
	difficultySelect = false,
	missionSelectCount = 1
) => {
	// Text embed
	const embed = new MessageEmbed().setTitle(page2.embed[value].title).setDescription(page2.embed[value].description);

	// Generate select menus if needed
	let difficulties = ["Rookie", "Professional", "Operative", "Elite", "Legend"];
	let rows = [];

	// Mission select
	if (missionSelect) {
		rows.push(
			new MessageSelectMenu()
				.setCustomId(page2.selectMenu.mission.customId)
				.setPlaceholder(page2.selectMenu.mission.placeholder)
				.addOptions(
					page2.embed[value].missions.map((mission) => {
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
				.setCustomId(page2.selectMenu.method.customId)
				.setPlaceholder(page2.selectMenu.method.placeholder)
				.addOptions(
					page2.embed[value].method.map((method) => {
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
				.setCustomId(page2.selectMenu.difficulty.customId)
				.setPlaceholder(page2.selectMenu.difficulty.placeholder)
				.addOptions(
					difficultiesList.map((difficulty) => {
						return { label: difficulty, value: difficulty };
					})
				)
				.setMaxValues(difficultiesList.length)
		);
	}

	// Return complete message
	rows = rows.map((selectMenu) => new MessageActionRow().addComponents(selectMenu));
	return { embeds: [embed], components: rows, ephemeral: true };
};

module.exports = {
	name: "interactionCreate",
	once: false,
	async execute(interaction, client) {
		// Bind event listeners to react to pages
		client.on("interactionCreate", async (interaction) => {
			if (!(interaction.isSelectMenu() || interaction.isButton())) return;

			if (interaction.customId == "pingselect") {
				const value = interaction.values[0];
				switch (value) {
					case "stealth":
					case "loud":
						await interaction.update(getSecondMessage(pages[1], value, true, false, true, 3));
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
