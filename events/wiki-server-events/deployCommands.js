module.exports = {
	name: "messageCreate",
	async execute(message, client) {
		// Update all commands and context menus
		if (message.author.id == client.wikiServer.guild.ownerId && message.content == "!deploy") {
			// Reset all commands
			client.application.commands.set([]);
			client.wikiServer.guild.commands.set([]);

			// Slash commands
			client.commands.each((data) => {
				if (data.global) {
					// Create global commands
					client.application.commands.create({
						name: data.name,
						description: data.description,
						options: data.options,
						defaultPermission: data.defaultPermission
					});
				} else {
					// Create wiki server commands
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

			// Create context menus
			client.contextMenus.each((data) => {
				if (data.global) {
					// Create global context menus
					if (data.type.includes("MESSAGE")) {
						client.application.commands.create({
							name: data.name,
							type: "MESSAGE"
						});
					}
					if (data.type.includes("USER")) {
						client.application.commands.create({
							name: data.name,
							type: "USER"
						});
					}
				} else {
					// Create wiki server context menus
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

			console.log(`Deployed ${client.commands.size} commands and ${client.contextMenus.size} context menus.`);
		}
	}
};
