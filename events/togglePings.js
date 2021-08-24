const { embed, getButtons } = require("../utils/togglePingsComponents.js");

module.exports = {
	name: "interactionCreate",
	async execute(interaction, client) {
		// Check if interaction is from togglepings command
		const pingRole = interaction.customId;
		const validIds = ["Stealth Ping", "Loud Ping", "Ironman Ping", "Shadow War Ping", "Night Heist Ping", "Freelance Heist Ping", "Daily Challenge Ping"];
		if (!interaction.isButton()) return;
		if (!validIds.includes(pingRole)) return;

		const member = interaction.member;
		let rows;

		if (member.roles.cache.some((role) => role.name == pingRole)) {
			// Remove role if user has it
			await member.roles.remove(member.guild.roles.cache.find((role) => role.name == pingRole)).then((updatedMember) => {
				rows = getButtons(updatedMember);
			});
		} else {
			// Add role if user doesn't have it
			await member.roles.add(member.guild.roles.cache.find((role) => role.name == pingRole)).then((updatedMember) => {
				rows = getButtons(updatedMember);
			});
		}

		// Update menu
		await interaction.update({ embeds: [embed], components: rows, ephemeral: true });
	}
};
