module.exports = {
	name: "guildMemberUpdate",
	async execute(oldMember, newMember, client) {
		// User was timed out
		if (oldMember.communicationDisabledUntilTimestamp == null && newMember.communicationDisabledUntilTimestamp) {
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

		// User had time-out removed
		if (oldMember.communicationDisabledUntilTimestamp && newMember.communicationDisabledUntilTimestamp == null) {
			const timeoutRemoveEmbed = {
				color: "RED",
				author: {
					name: "Time out removed",
					icon_url: oldMember.user.displayAvatarURL()
				},
				description: `${oldMember.user} ${oldMember.user.tag}`,
				timestamp: new Date(),
				footer: {
					text: `ID: ${oldMember.user.id}`
				}
			};

			await client.wikiServer.reports.send({ embeds: [timeoutRemoveEmbed] }).catch((error) => console.error(error));
		}
	}
};
