const { MessageEmbed, MessageActionRow, MessageSelectMenu } = require("discord.js");
const pages = require("../utils/squadPingData.js");

// Build first page
const getFirstMessage = (page1, states) => {
	const embed = new MessageEmbed().setTitle(page1.embed.title).setDescription(page1.embed.description);
	const selectMenu = new MessageActionRow().addComponents(
		new MessageSelectMenu()
			.setCustomId(page1.selectMenu.customId)
			.setPlaceholder(page1.selectMenu.placeholder)
			.addOptions(page1.selectMenu.options.filter((option) => states[option.value]))
	);

	return { embeds: [embed], components: [selectMenu], ephemeral: true };
};

module.exports = {
	name: "squadping",
	description: "Ping for a squad if you need players or request a host for an expansion mission.",
	async execute(interaction, client) {
		await interaction.reply(getFirstMessage(pages[0], global.pingStates));
	}
};
