const { MessageActionRow } = require("discord.js");

module.exports = {
	enabled: true,
	name: "togglepings",
	description: "Enable or disable the ping roles for #squadboard",
	async execute(interaction, client) {
		await interaction.deferReply({ ephemeral: true });
		const getButtons = require("../utils/pingRolesData.js");
		let buttons = getButtons(interaction.member);
		let row1 = new MessageActionRow().addComponents(buttons[0]);
		let row2 = new MessageActionRow().addComponents(buttons[1]);
		await interaction.editReply({ content: "Test", components: [row1, row2], ephemeral: true });
	}
};
