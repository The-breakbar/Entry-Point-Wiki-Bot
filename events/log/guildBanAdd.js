module.exports = {
	name: "guildBanAdd",
	async execute(ban, client) {
		if (ban.guild != client.wikiServer.guild) return;

		const embed = {
			color: "RED",
			author: {
				name: "Member banned",
				icon_url: ban.user.displayAvatarURL()
			},
			description: `${ban.user} ${ban.user.tag}`,
			fields: [
				{
					name: "Reason",
					value: ban.reason ? ban.reason : "No reason specified"
				}
			],
			timestamp: new Date(),
			footer: {
				text: `ID: ${ban.user.id}`
			}
		};

		await client.wikiServer.log.send({ embeds: [embed] }).catch((error) => console.error(error));
	}
};
