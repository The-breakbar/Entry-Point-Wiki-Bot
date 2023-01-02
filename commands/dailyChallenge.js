const { getRemainingTime, readDailyStrings } = require("../utils/dailyService.js");

module.exports = {
	global: true,
	name: "dailychallenge",
	description: "Get the daily challenge",
	async execute(interaction, client) {
		// Defer reply
		await interaction.deferReply();

		// Get remaining challenge time
		let delta = getRemainingTime();
		const hours = Math.floor(delta / 3600) % 24;
		delta -= hours * 3600;
		const minutes = Math.floor(delta / 60) % 60;

		// Create embed
		let dailyStrings = readDailyStrings();
		let [, mission1, method1, , mod11, , mod21, , mod31] = dailyStrings[0].split(",");
		let [, mission2, method2, , mod12, , mod22, , mod32] = dailyStrings[1].split(",");

		const embed = {
			color: global.colors.purple,
			title: "Daily Challenge",
			fields: [
				{
					name: `${mission1} (${method1})`,
					value: `${mod11}, ${mod21}, ${mod31}`
				},
				{
					name: `${mission2} (${method2}) (Tomorrow)`,
					value: `${mod12}, ${mod22}, ${mod32}`
				}
			],
			footer: {
				text: `${hours} hour${hours != 1 ? "s" : ""} and ${minutes} minute${minutes != 1 ? "s" : ""} left until the next challenge.`
			}
		};

		await interaction.editReply({ embeds: [embed] });
	}
};
