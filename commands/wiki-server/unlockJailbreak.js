module.exports = {
	name: "unlockjailbreak",
	description: "A special command for Financiers",
	defaultPermission: false,
	permissions: [global.wConfig.roles["The Financiers"], global.wConfig.roles["Wiki Administrator"], global.wConfig.roles["Wiki Moderator"]],
	async execute(interaction, client) {
		// Reply with gif
		await interaction.deferReply();

		const embed = {
			color: global.purple,
			title: `${interaction.member.displayName} has unlocked Jailbreak!`,
			image: {
				url: "https://cdn.discordapp.com/attachments/880536394399891476/880545645608464424/meme60.gif"
			}
		};

		await interaction.editReply({ embeds: [embed] });
	}
};
