// COMMAND: unlockjailbreak
// Send a gif of Wren dancing, only for Server Boosters

module.exports = {
	enabled: true,
	global: false,
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
				url: "https://cdn.discordapp.com/attachments/630879753448062986/666655767822073895/acbb6381acff10af1be6f389b7f81a52.gif"
			}
		};

		await interaction.editReply({ embeds: [embed] });
	}
};
