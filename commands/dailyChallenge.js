const { MessageEmbed } = require("discord.js");
const fetch = require("node-fetch");

module.exports = {
	name: "dailychallenge",
	description: "Get the daily challenge",
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

		// Get remaining challenge time
		const now = new Date();
		// Check daylight saving time in EST (correct until 2026)
		let DST = false;
		const year = now.getUTCFullYear();
		const dstStart = new Date(`March 1, ${year} 02:00:00 EST`);
		const dstEnd = new Date(`November 1, ${year} 02:00:00 EST`);
		dstStart.setDate(dstStart.getDate() + (14 - dstStart.getDay()));
		dstEnd.setDate(dstEnd.getDate() + (7 - dstEnd.getDay()));
		if (now >= dstStart && now <= dstEnd) {
			DST = true;
		}
		// Get remaining time until EST midnight
		const wantedTime = new Date(now);
		wantedTime.setUTCHours(DST ? 4 : 5, 0, 0, 0);
		if (wantedTime < now) {
			wantedTime.setDate(wantedTime.getDate() + 1);
		}
		let delta = Math.round((wantedTime - now) / 1000);
		const hours = Math.floor(delta / 3600) % 24;
		delta -= hours * 3600;
		const minutes = Math.floor(delta / 60) % 60;
		delta -= minutes * 60;
		const seconds = delta;

		// Create embed
		const embed = new MessageEmbed()
			.setTitle(title)
			.addFields({ name: modTitle1, value: mod1 }, { name: modTitle2, value: mod2 }, { name: modTitle3, value: mod3 })
			.setFooter(
				`${hours} hour${hours != 1 ? "s" : ""} and ${minutes} minute${
					minutes != 1 ? "s" : ""
				} left until next challenge.`
			)
			.setColor(global.purple);

		// Reply
		await interaction.editReply({ embeds: [embed] });
	}
};