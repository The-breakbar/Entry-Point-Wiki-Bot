const { checkMute } = require("../../utils/muteUtils");

module.exports = {
	name: "guildMemberAdd",
	async execute(member, client) {
		// Only log for wiki server
		if (message.guild != client.wikiServer.guild) return;

		const embed = {
			color: "GREEN",
			author: {
				name: "Member joined",
				icon_url: member.user.displayAvatarURL()
			},
			description: `${member.user} ${member.user.tag}`,
			fields: [
				{
					name: "Account creation",
					value: `<t:${member.user.createdTimestamp}:R>`
				}
			],
			timestamp: new Date(),
			footer: {
				text: `ID: ${member.user.id}`
			}
		};

		// Check if user is supposed to be muted
		checkMute(member);

		await client.wikiServer.log.send({ embeds: [embed] });
	}
};
