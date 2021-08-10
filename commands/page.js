const { MessageActionRow, MessageButton } = require("discord.js");
const fetch = require("node-fetch");

module.exports = {
	name: "search",
	description: "Search for a wiki page.",
	options: [{ name: "query", type: "STRING", description: "Term to search for on the wiki.", required: true }],
	async execute(interaction, client) {
		// Defer reply
		await interaction.deferReply();

		// Make API call to wiki
		const query = interaction.options.getString("query");
		const response = await fetch(
			`https://entry-point.fandom.com/api.php?action=opensearch&format=json&search=${query}&namespace=0&limit=5&redirects=resolve`
		)
			.then((response) => response.json())
			.catch((error) => console.error(error));

		// Check for results
		if (response[1].length == 0) {
			await interaction.editReply({ content: `There were no search results for \`${query}\`` });
		} else {
			const links = response[3];
			const linkTitels = response[1];

			// Make button row
			const row = new MessageActionRow().addComponents(
				links.map((link, index) => {
					return new MessageButton().setStyle("LINK").setLabel(linkTitels[index]).setURL(link);
				})
			);

			// Reply with links
			await interaction.editReply({
				content: `Here are the search results for \`${query}\``,
				components: [row]
			});
		}
	}
};
