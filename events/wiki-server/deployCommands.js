module.exports = {
	name: "messageCreate",
	async execute(message, client) {
		// Update all commands and context menus
		if (message.content == "!deploy" && message.author.id == client.wikiServer.guild.ownerId) {
			let commandCount = 0;
			let contextMenuCount = 0;

			// Reset all commands
			client.wikiServer.guild.commands.set([]);

			// Slash commands
			client.commands.each((data) => {
				if (!data.global) {
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
					commandCount++;
				}
			});

			// Create context menus
			client.contextMenus.each((data) => {
				if (!data.global) {
					// Create wiki server context menus
					if (data.type.includes("MESSAGE")) {
						client.wikiServer.guild.commands.create({
							name: data.name,
							type: "MESSAGE"
						});
						contextMenuCount++;
					}
					if (data.type.includes("USER")) {
						client.wikiServer.guild.commands.create({
							name: data.name,
							type: "USER"
						});
						contextMenuCount++;
					}
				}
			});

			console.log(`Deployed ${commandCount} commands and ${contextMenuCount} context menus.`);
		} else if (message.content == "!deployglobal" && message.author.id == client.wikiServer.guild.ownerId) {
			let commandCount = 0;
			let contextMenuCount = 0;

			// Reset all commands
			client.application.commands.set([]);

			// Slash commands
			client.commands.each((data) => {
				if (data.global) {
					// Create global commands
					client.application.commands.create({
						name: data.name,
						description: data.description,
						options: data.options
					});
					commandCount++;
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
						contextMenuCount++;
					}
					if (data.type.includes("USER")) {
						client.application.commands.create({
							name: data.name,
							type: "USER"
						});
						contextMenuCount++;
					}
				}
			});

			console.log(`Deployed ${commandCount} global commands and ${contextMenuCount} global context menus.`);
		}
	}
};
