const [embed, getButtons] = require("../utils/togglePingsComponents.js");

module.exports = {
	name: "togglepings",
	description: "Enable or disable the ping roles for #squadboard",
	async execute(interaction, client) {
		// Reply with toggle menu
		await interaction.deferReply({ ephemeral: true });
		const rows = getButtons(interaction.member);
		await interaction.editReply({ embeds: [embed], components: rows, ephemeral: true });
	}
};
