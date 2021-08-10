const { MessageEmbed } = require("discord.js");
const fetch = require("node-fetch");

module.exports = {
	name: "dailychallenge",
	description: "Get the daily challenge.",
	async execute(interaction, client) {
		// Defer reply
		await interaction.deferReply();

		// Get daily challenge
		const response = await fetch(
			`https://entry-point.fandom.com/api.php?action=parse&format=json&page=Template%3ADailyChallenge&prop=wikitext&formatversion=2`
		)
			.then((response) => response.json())
			.catch((error) => console.error(error));
		let wikitext = response.parse.wikitext;

		// Parse wikitext
		const title = wikitext.split("|")[2].replace("{{Robux}}", "").trim();
		const modTitle1 = wikitext.split('class="challenge')[1].split(">")[1].split("<")[0].trim();
		const modTitle2 = wikitext.split('class="challenge')[2].split(">")[1].split("<")[0].trim();
		const modTitle3 = wikitext.split('class="challenge')[3].split(">")[1].split("<")[0].trim();
		const mod1 = wikitext.split("33%")[1].split("|")[1].trim();
		const mod2 = wikitext.split("33%")[2].split("|")[1].trim();
		const mod3 = wikitext.split("33%")[2].split("|")[2].trim();

		// Create embed
		const embed = new MessageEmbed()
			.setTitle(title)
			.addFields({ name: modTitle1, value: mod1 }, { name: modTitle2, value: mod2 }, { name: modTitle3, value: mod3 })
			.setColor(global.purple);

		// Reply
		await interaction.editReply({ embeds: [embed] });
	}
};
