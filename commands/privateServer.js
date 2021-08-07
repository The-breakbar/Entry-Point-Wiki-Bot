module.exports = {
	name: "privateserver",
	description: "Get the Wiki Private Server link",
	async execute(interaction, client) {
		await interaction.reply("Link");
	}
};
