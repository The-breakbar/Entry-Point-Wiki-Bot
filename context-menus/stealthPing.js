module.exports = {
	name: "Toggle Stealth Ping",
	type: ["MESSAGE", "USER"],
	async execute(interaction, client) {
		await interaction.deferReply({ ephemeral: true });
		await interaction.editReply({ content: "Toggled Stealth ping role.", ephemeral: true });
	}
};
