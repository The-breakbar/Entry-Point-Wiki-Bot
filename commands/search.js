const { MessageActionRow, MessageButton, MessageEmbed } = require("discord.js");
const fetch = require("node-fetch");

module.exports = {
	enabled: true,
	name: "search",
	description: "Search for a wiki page.",
	options: [{ name: "query", type: "STRING", description: "Term to search for on the wiki", required: true }],
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
			const failEmbed = new MessageEmbed()
				.setColor(global.purple)
				.setDescription(`There were no search results for "${query.length > 50 ? query.slice(0, 50) + "..." : query}"`);
			await interaction.editReply({ embeds: [failEmbed] });
		} else {
			const links = response[3];
			const linkTitels = response[1];

			// Make button row
			const row = new MessageActionRow().addComponents(
				links.map((link, index) => {
					return new MessageButton().setStyle("LINK").setLabel(linkTitels[index]).setURL(link);
				})
			);

			const embed = new MessageEmbed()
				.setColor(global.purple)
				.setDescription(`Search results for "${query.length > 50 ? query.slice(0, 50) + "..." : query}"`);

			// Reply with links
			await interaction.editReply({
				embeds: [embed],
				components: [row]
			});
		}
	}
};
