const { MessageButton } = require("discord.js");

module.exports = (member) => {
	let roles = {
		"Stealth Ping": false,
		"Loud Ping": false,
		"Ironman Ping": false,
		"Shadow War Ping": false,
		"Night Heist Ping": false,
		"Freelance Heist Ping": false,
		"Daily Challenge Ping": false
	};
	member.roles.cache.each((role) => {
		if (Object.keys(roles).includes(role.name)) {
			roles[role.name] = true;
		}
	});

	let buttons = [];
	Object.keys(roles).forEach((role) => {
		let status = roles[role];
		let button = new MessageButton()
			.setCustomId(role)
			.setLabel(`${status ? "Disable" : "Enable"} ${role}`)
			.setStyle(status ? "DANGER" : "SUCCESS");
		buttons.push(button);
	});

	return [buttons.slice(0, 4), buttons.slice(4)];
};
