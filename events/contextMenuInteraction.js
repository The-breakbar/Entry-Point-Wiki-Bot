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
			try {
				// Notify user on error
				console.error(error);
				const errorMessage = {
					content: `There was an error while executing the \`${interaction.commandName}\` context menu!`,
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
