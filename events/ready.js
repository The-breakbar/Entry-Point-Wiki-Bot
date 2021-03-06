const { syncMuted } = require("../utils/muteUtils");
const { recentChanges } = require("../utils/recentChanges");

module.exports = {
	name: "ready",
	once: true,
	async execute(client) {
		// Fetch wiki server info
		client.wikiServer = {};
		client.wikiServer.guild = await client.guilds.fetch(global.wConfig.guild);
		client.wikiServer.reports = await client.wikiServer.guild.channels.cache.get(global.wConfig.channels.reports);
		client.wikiServer.log = await client.wikiServer.guild.channels.cache.get(global.wConfig.channels.log);
		client.wikiServer.editLog = await client.wikiServer.guild.channels.cache.get(global.wConfig.channels["wiki-edits"]);
		client.wikiServer.submitMeme = await client.wikiServer.guild.channels.cache.get(global.wConfig.channels["submitted-memes"]);

		// Sync unmutes on bot restart
		syncMuted(client);

		// Checks wiki for new edits periodically
		recentChanges(20000, client);

		// Set status, change status every hour
		const startingStatus = activities[Math.floor(Math.random() * activities.length)];
		client.user.setActivity(startingStatus[1], { type: startingStatus[0] });
		setInterval(() => {
			const randomStatus = activities[Math.floor(Math.random() * activities.length)];
			client.user.setActivity(randomStatus[1], { type: randomStatus[0] });
		}, 3600000);

		// Client has logged in
		console.log(`✅ Logged in as ${client.user.tag}, connected to ${client.guilds.cache.size} guilds`);
	}
};

// Playing / Watching / Listening to / Competing in
const activities = [
	["PLAYING", "Ironman legend stealth"],
	["PLAYING", "with a Thumper in the Shooting Range"],
	["PLAYING", "PvP Deathmatch completely alone"],
	["PLAYING", "Band Hero"],
	["PLAYING", "Notoriety"],
	["PLAYING", "Entry Point 2"],
	["PLAYING", "Entry Point 2: Electric Boogaloo"],
	["PLAYING", "The Freelancer Legend Loud"],
	["WATCHING", "@Xx_SparrowPlays_xX"],
	["WATCHING", "@PhoenixRising"],
	["WATCHING", "people die in Ironman"],
	["WATCHING", "Ryan Ross fall down a skyscraper"],
	["WATCHING", "the EP Wiki"],
	["WATCHING", "a legend stealth tutorial"],
	["WATCHING", "bars break"],
	["LISTENING", "Full Force"],
	["LISTENING", "the Cache alt track"],
	["LISTENING", "breakbar's commands"],
	["LISTENING", "the Gala speech"],
	["COMPETING", "a Shadow War 1v1"],
	["COMPETING", "Band Hero"]
];
