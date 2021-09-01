module.exports = {
	name: "interactionCreate",
	async execute(interaction, client) {
		// Check if interaction is "Close report" button
		if (!interaction.isButton()) return;
		if (interaction.customId != "close-report") return;

		// Update with closed report
		let embed = interaction.message.embeds[0];
		embed.setColor("GREEN");
		embed.setFooter(`Report closed by ${interaction.user.username}`);

		await interaction.update({ embeds: [embed], components: [] });
	}
};
