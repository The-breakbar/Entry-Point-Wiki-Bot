const { MessageEmbed, MessageActionRow, MessageSelectMenu } = require("discord.js");
const pages = require("../utils/squadPingData.js");

// Build first page
const getFirstMessage = (states) => {
	const embed = new MessageEmbed()
		.setTitle(pages[0].embed.title)
		.setDescription(pages[0].embed.description)
		.setColor(global.purple);
	const selectMenu = new MessageActionRow().addComponents(
		new MessageSelectMenu()
			.setCustomId(pages[0].selectMenu.customId)
			.setPlaceholder(pages[0].selectMenu.placeholder)
			.addOptions(pages[0].selectMenu.options.filter((option) => states[option.value]))
	);

	return { embeds: [embed], components: [selectMenu], ephemeral: true };
};

module.exports = {
	name: "squadping",
	description: "Ping for a squad if you need players or request a host for an expansion mission (#squadboard only)",
	channelWhitelist: ["650016486064390145"], // Squad board
	async execute(interaction, client) {
		await interaction.deferReply({ ephemeral: true });
		await interaction.editReply(getFirstMessage(global.pingStates));
	}
};
