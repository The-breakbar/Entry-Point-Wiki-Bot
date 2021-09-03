module.exports = {
	name: "guildMemberRemove",
	async execute(member, client) {
		// Only log for wiki server
		if (member.guild != client.wikiServer.guild) return;

		const userRoles = [...member.roles.cache.values()]
			.filter((role) => role.name != "@everyone")
			.map((role) => `${role}`)
			.join(" ");

		const embed = {
			color: "RED",
			author: {
				name: "Member left",
				icon_url: member.user.displayAvatarURL()
			},
			description: `${member.user} ${member.user.tag}`,
			fields: [
				{
					name: "Roles",
					value: userRoles.length == 0 ? "No roles" : userRoles
				}
			],
			timestamp: new Date(),
			footer: {
				text: `ID: ${member.user.id}`
			}
		};

		await client.wikiServer.log.send({ embeds: [embed] });
	}
};
