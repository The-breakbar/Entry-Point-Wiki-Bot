const { MessageActionRow, MessageButton } = require("discord.js");

module.exports = [
	{
		color: global.purple,
		title: "Enable / Disable Ping Roles",
		description: `Enable or disable pings for specific mission types. Enabling a ping will give you a role and you will be pinged in <#650016486064390145> if somebody needs a squad for that mission type.
		
		Note: The Night Heist and Freelance Heist ping roles are for those who own the gamepasses and are able to host the missions for others.`
	},
	(member) => {
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
	}
];
