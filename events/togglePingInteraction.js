const { MessageActionRow, MessageEmbed } = require("discord.js");
const getButtons = require("../utils/togglePingsData.js");

module.exports = {
	name: "interactionCreate",
	async execute(interaction, client) {
		// Filter out other interactions
		if (!interaction.isButton()) return;
		if (
			![
				"Stealth Ping",
				"Loud Ping",
				"Ironman Ping",
				"Shadow War Ping",
				"Night Heist Ping",
				"Freelance Heist Ping",
				"Daily Challenge Ping"
			].includes(interaction.customId)
		)
			return;

		let member = interaction.member;
		let pingRole = interaction.customId;
		let added = false;
		let buttons;
		if (member.roles.cache.some((role) => role.name == pingRole)) {
			await member.roles
				.remove(member.guild.roles.cache.find((role) => role.name == pingRole))
				.then((updatedMember) => {
					buttons = getButtons(updatedMember);
				});
		} else {
			added = true;
			await member.roles.add(member.guild.roles.cache.find((role) => role.name == pingRole)).then((updatedMember) => {
				buttons = getButtons(updatedMember);
			});
		}

		let row1 = new MessageActionRow().addComponents(buttons[0]);
		let row2 = new MessageActionRow().addComponents(buttons[1]);
		let embed = new MessageEmbed()
			.setColor(global.purple)
			.setTitle("Enable / Disable Ping Roles")
			.setDescription(
				`Enable or disable pings for specific mission types. Enabling a ping will give you a role and you will be pinged in <#650016486064390145> if somebody needs a squad for that mission type.\n\nNote: The Night Heist and Freelance Heist ping roles are for those who own the gamepasses and are able to host the missions for others.`
			)
			.addField(interaction.customId, `${added ? "Added" : "Removed"} the ${interaction.customId} role.`);
		await interaction.update({
			embeds: [embed],
			components: [row1, row2],
			ephemeral: true
		});
	}
};
