module.exports = {
	name: "guildMemberUpdate",
	async execute(oldMember, newMember, client) {
		// Only log for wiki server
		if (oldMember.guild != client.wikiServer.guild) return;

		// User was timed out
		if (oldMember.communicationDisabledUntilTimestamp == null && newMember.communicationDisabledUntilTimestamp) {
			// Format timeout length
			let length = newMember.communicationDisabledUntilTimestamp - Date.now();
			length = Math.round((length / (60 * 60 * 1000)) * 100) / 100;

			const timeoutAddEmbed = {
				color: "RED",
				author: {
					name: "Time out",
					icon_url: oldMember.user.displayAvatarURL()
				},
				description: `${oldMember.user} ${oldMember.user.tag}`,
				fields: [
					{
						name: "Length",
						value: length == 1 ? `${length} hour` : `${length} hours`
					}
				],
				timestamp: new Date(),
				footer: {
					text: `ID: ${oldMember.user.id}`
				}
			};

			await client.wikiServer.reports.send({ embeds: [timeoutAddEmbed] }).catch((error) => console.error(error));
		}
	}
};
