// EVENT: interactionCreate
// Interacton handler for the togglepings command, updates menu with new buttons

const { MessageActionRow, MessageButton } = require("discord.js");

const embed = {
	color: global.purple,
	title: "Enable / Disable Ping Roles",
	description: `Enable or disable pings for specific mission types. Enabling a ping will give you a role and you will be pinged in <#650016486064390145> if somebody needs a squad for that mission type.
	
	Note: The Night Heist and Freelance Heist ping roles are for those who own the gamepasses and are able to host the missions for others.`
};

module.exports = {
	name: "interactionCreate",
	async execute(interaction, client) {
		// Check if interaction is from togglepings command
		const pingRole = interaction.customId;
		const validIds = ["Stealth Ping", "Loud Ping", "Ironman Ping", "Shadow War Ping", "Night Heist Ping", "Freelance Heist Ping", "Daily Challenge Ping"];
		if (!interaction.isButton()) return;
		if (!validIds.includes(pingRole)) return;

		const member = interaction.member;
		let added = false;
		let rows;

		if (member.roles.cache.some((role) => role.name == pingRole)) {
			// Remove role if user has it
			await member.roles.remove(member.guild.roles.cache.find((role) => role.name == pingRole)).then((updatedMember) => {
				rows = getButtons(updatedMember);
			});
		} else {
			// Add role if user doesn't have it
			added = true;
			await member.roles.add(member.guild.roles.cache.find((role) => role.name == pingRole)).then((updatedMember) => {
				rows = getButtons(updatedMember);
			});
		}

		// Update menu
		await interaction.update({ embeds: [embed], components: rows, ephemeral: true });
	}
};

const getButtons = (member) => {
	// Get current ping roles
	let memberRoles = {
		"Stealth Ping": false,
		"Loud Ping": false,
		"Ironman Ping": false,
		"Shadow War Ping": false,
		"Night Heist Ping": false,
		"Freelance Heist Ping": false,
		"Daily Challenge Ping": false
	};

	member.roles.cache.each((role) => {
		if (Object.keys(memberRoles).includes(role.name)) {
			memberRoles[role.name] = true;
		}
	});

	// Create buttons
	let buttons = [];
	Object.keys(memberRoles).forEach((role) => {
		const status = memberRoles[role];
		const button = {
			customId: role,
			label: `${status ? "Disable" : "Enable"} ${role}`,
			style: status ? "DANGER" : "SUCCESS"
		};
		buttons.push(new MessageButton(button));
	});

	// Return buttons in 2 rows
	return [new MessageActionRow({ components: buttons.slice(0, 4) }), new MessageActionRow({ components: buttons.slice(4) })];
};
