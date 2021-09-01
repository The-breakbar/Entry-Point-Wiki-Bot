const { MessageActionRow, MessageSelectMenu } = require("discord.js");

module.exports = {
	name: "squadping",
	description: "Ping for a squad if you need players or request a host for an expansion mission (#squadboard only)",
	channelWhitelist: ["650016486064390145"], // Squad board
	async execute(interaction, client) {
		await interaction.deferReply({ ephemeral: true });

		// Create first page, include ping types which aren't on cooldown
		const embed = {
			title: pageData.title,
			description: pageData.description,
			color: global.purple
		};

		const row = new MessageActionRow({
			components: [
				new MessageSelectMenu({
					customId: pageData.customId,
					placeholder: pageData.placeholder,
					options: pageData.options.filter((option) => {
						return global.pingStates[option.value];
					})
				})
			]
		});

		await interaction.editReply({ embeds: [embed], components: [row], ephemeral: true });
	}
};

const pageData = {
	title: "Select ping type",
	description:
		"Please select what you want to ping for. The expansion pings are for requesting a host, if you can host and just need a squad, please use the Stealth/Loud ping.",
	customId: "pingselect",
	placeholder: "Select ping type",
	options: [
		{
			label: "Stealth ping",
			description: "For any stealth mission (including expansions)",
			value: "stealth"
		},
		{
			label: "Loud ping",
			description: "For any loud mission (including expansions)",
			value: "loud"
		},
		{
			label: "Ironman ping",
			description: "For Ironman",
			value: "ironman"
		},
		{
			label: "Shadow War ping",
			description: "For Shadow War in the private server",
			value: "shadowwar"
		},
		{
			label: "Night Heist ping",
			description: "Request a host for a Night Heist mission",
			value: "nightheist"
		},
		{
			label: "Freelance Heist ping",
			description: "Request a host for a Freelance Heist mission",
			value: "freelanceheist"
		},
		{
			label: "Daily Challenge ping",
			description: "For the daily challenge",
			value: "daily"
		}
	]
};
