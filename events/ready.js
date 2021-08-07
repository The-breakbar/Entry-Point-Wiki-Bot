module.exports = {
	name: "ready",
	once: true,
	execute(client) {
		// Client has logged in
		console.log(`Logged in as ${client.user.tag}`);

		// Fetch wiki server info
		client.wikiServer = client.guilds.cache.get("621676630896672789");

		// Bind slash commands for wiki server
		client.wikiServer.commands.set([]);
		client.commands.each((data) => {
			client.wikiServer.commands.create({
				name: data.name,
				description: data.description,
				options: data.options,
				defaultPermission: data.defaultPermission
			});
		});
	}
};
