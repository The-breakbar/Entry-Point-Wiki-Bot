const { MessageActionRow, MessageButton } = require("discord.js");
const fetch = require("node-fetch");

module.exports = {
	global: true,
	name: "search",
	description: "Search for a wiki page",
	options: [{ name: "query", type: "STRING", description: "Term to search for on the wiki", required: true }],
	async execute(interaction, client) {
		// Defer reply
		await interaction.deferReply();

		// Make API call to wiki
		const query = interaction.options.getString("query");
		const queryDisplay = query.length > 50 ? query.slice(0, 50) + "..." : query;
		await fetch(`https://entry-point.fandom.com/api.php?action=opensearch&format=json&search=${query}&namespace=0&limit=5&redirects=resolve`)
			.then((fetchReponse) => {
				const response = fetchReponse.json();
				// Check for results
				if (response[1].length == 0) {
					const failEmbed = {
						color: global.purple,
						description: `There were no search results for "${queryDisplay}"`
					};
					await interaction.editReply({ embeds: [failEmbed] });
				} else {
					// Parse response
					const links = response[3];
					const linkTitels = response[1];

					const row = new MessageActionRow({
						components: links.map((link, index) => {
							return new MessageButton({
								style: "LINK",
								label: linkTitels[index],
								url: link
							});
						})
					});

					const embed = {
						color: global.purple,
						description: `Search results for "${queryDisplay}"`
					};

					// Reply with links
					await interaction.editReply({ embeds: [embed], components: [row] });
				}
			})
			.catch((error) => {
				// If fetch fails
				console.error(error);
				const errorEmbed = {
					color: global.purple,
					description: "There was an error while searching, please try again."
				};
				await interaction.editReply({ embeds: [errorEmbed] });
			});
	}
};
