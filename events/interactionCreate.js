module.exports = {
	name: "interactionCreate",
	once: false,
	async execute(interaction, client) {
		// Check if command is in available commands
		if (!interaction.isCommand()) return;
		if (!client.commands.has(interaction.commandName)) return;

		// Execute command, notify user on error
		try {
			await client.commands.get(interaction.commandName).execute(interaction, client);
		} catch (error) {
			console.error(error);
			await interaction.reply({
				content: `There was an error while executing the \`${interaction.commandName}\` command! Please send this message or a screenshot of it to <@${client.wikiServer.ownerId}>.\n\`\`\`${error}\`\`\``,
				ephemeral: true
			});
		}
	}
};
