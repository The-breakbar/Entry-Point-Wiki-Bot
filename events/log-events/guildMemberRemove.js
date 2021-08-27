module.exports = {
	name: "guildMemberRemove",
	async execute(member, client) {
		// Only log for wiki server
		if (message.guild != client.wikiServer.guild) return;

		const embed = {
			color: "RED",
			author: {
				name: "Member left",
				icon_url: member.user.displayAvatarURL()
			},
			description: `${member.user} ${member.user.tag}`,
			timestamp: new Date(),
			footer: {
				text: `ID: ${member.user.id}`
			}
		};

		await client.wikiServer.log.send({ embeds: [embed] });
	}
};
