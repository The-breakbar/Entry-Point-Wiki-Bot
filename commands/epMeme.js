const memes = require("../utils/epMemeData");

module.exports = {
	// enabled: true,
	name: "epmeme",
	description: "Get a random Entry Point meme",
	async execute(interaction, client) {
		await interaction.deferReply();
		await interaction.editReply({ content: memes[Math.floor(Math.random() * memes.length)] });
	}
};
