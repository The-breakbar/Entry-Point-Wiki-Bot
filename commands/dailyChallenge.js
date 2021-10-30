const fetch = require("node-fetch");

module.exports = {
	global: true,
	name: "dailychallenge",
	description: "Get the daily challenge",
	async execute(interaction, client) {
		// Defer reply
		await interaction.deferReply();

		// Get daily challenge
		const response = await fetch(`https://entry-point.fandom.com/api.php?action=parse&format=json&page=Template%3ADailyChallenge&prop=text&formatversion=2`).catch(
			(error) => console.error(error)
		);

		if (response?.ok) {
			const data = await response.json();
			let text = data.parse.text;

			// Parse text
			const title = text.split("</th>")[0].split(">").slice(-1)[0].split(" ").slice(-3).join(" ").split("\n")[0];
			const modTitle1 = text.split("challenge-")[1].split(">")[1].split("<")[0].trim();
			const modTitle2 = text.split("challenge-")[2].split(">")[1].split("<")[0].trim();
			const modTitle3 = text.split("challenge-")[3].split(">")[1].split("<")[0].trim();
			const mod1 = text.split("33%")[1].split(`">`)[1].split("\n")[0].trim().replaceAll("<br />", "\n");
			const mod2 = text.split("33%")[2].split(`">`)[1].split("\n")[0].trim().replaceAll("<br />", "\n");
			const mod3 = text.split("33%")[3].split(`">`)[1].split("\n")[0].trim().replaceAll("<br />", "\n");

			// Get remaining challenge time
			const now = new Date();
			let DST = false; // Check daylight saving time in EST (correct until 2026)
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

			// Create embed
			const embed = {
				color: global.purple,
				title: title,
				fields: [
					{
						name: modTitle1,
						value: mod1
					},
					{
						name: modTitle2,
						value: mod2
					},
					{
						name: modTitle3,
						value: mod3
					}
				],
				footer: {
					text: `${hours} hour${hours != 1 ? "s" : ""} and ${minutes} minute${minutes != 1 ? "s" : ""} left until the next challenge.`
				}
			};

			// Reply
			if (/unavailable/i.test(title)) {
				const errorEmbed = {
					color: global.purple,
					description: "The daily challenge command is currently unavailable.",
					footer: {
						text: `${hours} hour${hours != 1 ? "s" : ""} and ${minutes} minute${minutes != 1 ? "s" : ""} left until the next challenge.`
					}
				};
				await interaction.editReply({ embeds: [errorEmbed] });
			} else {
				await interaction.editReply({ embeds: [embed] });
			}
		} else {
			const errorEmbed = {
				color: global.purple,
				description: "There was an error while getting the daily challenge, please try again."
			};
			interaction.editReply({ embeds: [errorEmbed] });
		}
	}
};
