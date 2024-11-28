module.exports = {
	name: "messageCreate",
	async execute(message, client) {
		if (!(message.content == "!deploy" && message.author.id == client.wikiServer.guild.ownerId)) return;

		// Update commands
		client.commands.forEach(async (data) => {
			let commandData = {
				name: data.name,
				description: data.description,
				options: data.options
			};

			if (data.global) {
				let command = await client.application.commands.fetch().then((commands) => commands.find((cmd) => cmd.name == data.name));
				if (command) {
					command.edit(commandData);
					console.log(`Updated global command ${data.name}.`);
				} else {
					client.application.commands.create(commandData);
					console.log(`Created global command ${data.name}.`);
				}
			} else {
				let command = await client.wikiServer.guild.commands.fetch().then((commands) => commands.find((cmd) => cmd.name == data.name));
				if (command) {
					command.edit(commandData);
					console.log(`Updated server command ${data.name}.`);
				} else {
					client.wikiServer.guild.commands.create(commandData);
					console.log(`Created server command ${data.name}.`);
				}
			}
		});

		// Remove commands that are not in client.commands
		client.application.commands.fetch().then((commands) => {
			commands.forEach(async (command) => {
				if (!client.commands.find((data) => data.name == command.name)) {
					command.delete();
					console.log(`Deleted command ${command.name}.`);
				}
			});
		});
	}
};
