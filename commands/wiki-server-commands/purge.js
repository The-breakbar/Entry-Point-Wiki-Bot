module.exports = {
	name: "purge",
	description: "Purge command for server staff",
	options: [
		{
			name: "count",
			type: "INTEGER",
			description: "Amount of messages to purge",
			required: true
		}
	],
	permissions: ["621679404636176384", "718954666032889866", "621679757221822465"],
	async execute(interaction, client) {
		await interaction.deferReply({ ephemeral: true });

		// Delete messages in channel
		let count = interaction.options.getInteger("count");
		count = Math.min(Math.max(count, 1), 100);
		await interaction.channel.bulkDelete(count);

		await interaction.editReply({ content: `Purged ${count} message${count == 1 ? "" : "s"}.` });
	}
};
