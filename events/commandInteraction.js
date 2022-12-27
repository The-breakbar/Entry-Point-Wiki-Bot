module.exports = {
	name: "interactionCreate",
	async execute(interaction, client) {
		// Check if command is in available commands
		if (!interaction.isCommand()) return;
		if (!client.commands.has(interaction.commandName)) return;

		// Catch command execution error
		try {
			// Execute command
			const command = client.commands.get(interaction.commandName);
			await command.execute(interaction, client);
		} catch (error) {
			console.log(error);

			// Catch incase interaction isn't valid anymore
			try {
				// Notify user on error
				const errorMessage = {
					content: `There was an error while executing the \`${interaction.commandName}\` command!`,
					embeds: [],
					components: [],
					ephemeral: true
				};

				// Check if interaction has been deferred or replied to
				if (interaction.deferred || interaction.replied) {
					await interaction.followUp(errorMessage);
				} else {
					await interaction.reply(errorMessage);
				}
			} catch (error) {
				console.error(error);
			}
		}
	}
};
