module.exports = {
	name: "unlockjailbreak",
	description: "A special command for Financiers",
	defaultPermission: false,
	permissions: ["621679404636176384", "621679757221822465", "668198708776665102"], // Wiki Admin, Wiki Mod, Server Booster
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
