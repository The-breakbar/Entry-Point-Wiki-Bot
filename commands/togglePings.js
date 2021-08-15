const { MessageActionRow } = require("discord.js");

module.exports = {
	name: "togglepings",
	description: "Enable or disable the ping roles for #squadboard",
	async execute(interaction, client) {
		await interaction.deferReply();
		const getButtons = require("../utils/pingRolesData.js");
		let components = new MessageActionRow().addComponents(getButtons(interaction.member));
		await interaction.editReply({ content: "Test", components: components, ephemeral: true });
	}
};
