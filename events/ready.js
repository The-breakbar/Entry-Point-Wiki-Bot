module.exports = {
	name: "ready",
	once: true,
	execute(client) {
		// Fetch wiki server info
		client.wikiServer = {};
		client.wikiServer.guild = client.guilds.cache.get("621676630896672789");

		// Embed color
		global.purple = "#b33fe6";

		// Bind slash commands for wiki server
		client.wikiServer.guild.commands.set([]);
		client.commands.each((data) => {
			client.wikiServer.guild.commands.create({
				name: data.name,
				description: data.description,
				options: data.options,
				defaultPermission: data.defaultPermission
			});
		});

		// Client has logged in
		console.log(`Logged in as ${client.user.tag}`);
	}
};
