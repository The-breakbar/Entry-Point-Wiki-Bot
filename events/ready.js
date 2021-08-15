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
		});

		// Bind context menus for wiki server
		client.contextMenus.each((data) => {
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
		});

		// Client has logged in
		console.log(`Logged in as ${client.user.tag}`);
	}
};
