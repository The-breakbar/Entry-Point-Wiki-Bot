module.exports = {
	name: "interactionCreate",
	async execute(interaction, client) {
		// Check if context menu is in available context menus
		if (!interaction.isContextMenu()) return;
		if (!client.contextMenus.has(interaction.commandName)) return;

		try {
			// Execute context menu function
			const contextMenu = client.contextMenus.get(interaction.commandName);
			await contextMenu.execute(interaction, client);
		} catch (error) {
			// Notify user on error
			console.error(error);
			const errorMessage = {
				content: `There was an error while executing the \`${interaction.commandName}\` command! Please send this message or a screenshot of it to <@${client.wikiServer.guild.ownerId}>.\n\`\`\`${error.stack}\`\`\``,
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
		}
	}
};
