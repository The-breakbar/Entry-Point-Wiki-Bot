module.exports = {
	global: true,
	name: "links",
	description: "Get a list of useful Entry Point related links",
	async execute(interaction, client) {
		// Reply with embed
		await interaction.deferReply();
		await interaction.editReply({ embeds: [linkEmbed] });
	}
};

const linkEmbed = {
	color: global.purple,
	title: "Useful links",
	description: `
	[Play Entry Point](https://www.roblox.com/games/740581508/Entry-Point)
	[Private Server](https://www.roblox.com/games/740581508?privateServerLinkCode=07225942152546546599064025460286)
	[Entry Point Wiki](https://entry-point.fandom.com/wiki/Entry_Point_Wiki)
	[Entry Point Merch](https://www.amazon.com/stores/page/C2FE1530-D7DA-4BD6-86C5-00DC5F582A39)
	[Freefall Softworks Group](https://www.roblox.com/groups/4061796/Freefall-Softworks)
	[Speedrun Leaderboards](https://www.speedrun.com/rblx_entrypoint/levels)
	[Entry Point Wiki Discord](https://discord.gg/wacqqFb)
	[EEPC Discord](https://discord.com/invite/xNyXSPV)
	[Halcyon and Phoenix Safehouse](https://www.roblox.com/games/6523072186/Halcyon-and-Phoenix-Safehouse)
	[Halcyon and Phoenix Picnic](https://www.roblox.com/games/4701103583/Halcyon-and-Phoenix-Enemies-for-Life-Picnic-2020)
	[r/entrypoint](https://www.reddit.com/r/entrypoint/)
	[r/freefallsoftworks](https://www.reddit.com/r/FreefallSoftworks/)
	`
};
