const memes = require("../utils/epMemeData");

module.exports = {
	global: true,
	name: "epmeme",
	description: "Get a random Entry Point meme",
	channelWhitelist: [global.wConfig.channels["trash-can"]],
	async execute(interaction, client) {
		// Reply with random meme file link
		await interaction.deferReply();
		await interaction.editReply({ content: memes[Math.floor(Math.random() * memes.length)] });
	}
};
