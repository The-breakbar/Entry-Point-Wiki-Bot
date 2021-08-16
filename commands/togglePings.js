const { MessageActionRow, MessageEmbed } = require("discord.js");

module.exports = {
	enabled: true,
	name: "togglepings",
	description: "Enable or disable the ping roles for #squadboard",
	async execute(interaction, client) {
		await interaction.deferReply({ ephemeral: true });
		const getButtons = require("../utils/togglePingsData.js");
		let buttons = getButtons(interaction.member);
		let row1 = new MessageActionRow().addComponents(buttons[0]);
		let row2 = new MessageActionRow().addComponents(buttons[1]);
		let embed = new MessageEmbed()
			.setColor(global.purple)
			.setTitle("Enable / Disable Ping Roles")
			.setDescription(
				`Enable or disable pings for specific mission types. Enabling a ping will give you a role and you will be pinged in <#650016486064390145> if somebody needs a squad for that mission type.\n\nNote: The Night Heist and Freelance Heist ping roles are for those who own the gamepasses and are able to host the missions for others.`
			);
		await interaction.editReply({ embeds: [embed], components: [row1, row2], ephemeral: true });
	}
};
