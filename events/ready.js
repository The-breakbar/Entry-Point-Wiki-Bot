module.exports = {
	name: "ready",
	once: true,
	execute(client) {
		// Fetch wiki server info
		client.wikiServer = {};
		client.wikiServer.guild = client.guilds.cache.get("621676630896672789");

		// Embed color
		global.purple = "#b33fe6";

		client.wikiServer.guild.commands.set([]);
		// Bind slash commands for wiki server
		client.commands.each((data) => {
			if (data.enabled) {
				client.wikiServer.guild.commands
					.create({
						name: data.name,
						description: data.description,
						options: data.options,
						defaultPermission: data.defaultPermission
					})
					.then((command) => {
						// Set role permissions
						if (data.permissions) {
							const permissions = data.permissions.map((roleId) => {
								return { id: roleId, type: "ROLE", permission: true };
							});
							command.permissions.set({ permissions });
						}
					});
			}
		});

		// Bind context menus for wiki server
		client.contextMenus.each((data) => {
			if (data.enabled) {
				// Message context menu
				if (data.type.includes("MESSAGE")) {
					client.wikiServer.guild.commands.create({
						name: data.name,
						type: "MESSAGE"
					});
				}
				if (data.type.includes("USER")) {
					client.wikiServer.guild.commands.create({
						name: data.name,
						type: "USER"
					});
				}
			}
		});

		// Set activity
		const activities = [
			["PLAYING", "Ironman legend stealth"],
			["PLAYING", "with a Thumper in the Shooting Range"],
			["PLAYING", "PvP Deathmatch completely alone"],
			["PLAYING", "Band Hero"],
			["PLAYING", "Notoriety"],
			["PLAYING", "Entry Point 2"],
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
			["COMPETING", "a Shadow War 1v1"]
		];
		const startingStatus = activities[Math.floor(Math.random() * activities.length)];
		client.user.setActivity(startingStatus[1], { type: startingStatus[0] });
		setInterval(() => {
			const randomStatus = activities[Math.floor(Math.random() * activities.length)];
			client.user.setActivity(randomStatus[1], { type: randomStatus[0] });
		}, 3600000);

		// Client has logged in
		console.log(`Logged in as ${client.user.tag}`);
	}
};
