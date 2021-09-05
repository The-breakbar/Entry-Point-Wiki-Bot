module.exports = {
	name: "submitmeme",
	description: "Submit a meme for the /epmeme command",
	options: [{ name: "url", type: "STRING", description: `Discord link of the meme file (right-click on image and "Copy link")`, required: true }],
	async execute(interaction, client) {
		await interaction.deferReply({ ephemeral: true });

		const url = interaction.options.getString("url");
		if (/https?:\/\//.test(url)) {
			await client.wikiServer.submitMeme.send({ content: url }).catch((error) => console.error(error));
			await interaction.editReply({ content: "Thank you for your submission!" });
		} else {
			await interaction.editReply({
				content: `Please submit the meme in the form of a discord url (send the meme in any channel, right-click on the image and "Copy link").`
			});
		}
	}
};
