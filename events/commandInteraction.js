module.exports = {
	name: "interactionCreate",
	once: false,
	async execute(interaction, client) {
		// Check if command is in available commands
		if (!interaction.isCommand()) return;
		if (!client.commands.has(interaction.commandName)) return;

		// Execute command, notify user on error
		try {
			let command = client.commands.get(interaction.commandName);
			if (command.channelWhitelist && !command.channelWhitelist.some((channelId) => command.channelId == channelId)) {
				await interaction.reply({
					content:
						"This command can not be used in this channel, check the command description to see where it can be used.",
					ephemeral: true
				});
			} else {
				await command.execute(interaction, client);
			}
		} catch (error) {
			console.error(error);
			const errorMessage = {
				content: `There was an error while executing the \`${interaction.commandName}\` command! Please send this message or a screenshot of it to <@${client.wikiServer.guild.ownerId}>.\n\`\`\`${error}\`\`\``,
				embeds: [],
				components: [],
				ephemeral: true
			};

			// Check if interaction deferred or replied to
			if (interaction.deferred || interaction.replied) {
				await interaction.followUp(errorMessage);
			} else {
				await interaction.reply(errorMessage);
			}
		}
	}
};
