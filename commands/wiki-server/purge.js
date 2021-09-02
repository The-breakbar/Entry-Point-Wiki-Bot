const { Collection } = require("discord.js");

module.exports = {
	name: "purge",
	description: "Purge command for server staff",
	options: [
		{
			name: "count",
			type: "INTEGER",
			description: "Amount of messages to purge",
			required: true
		},
		{
			name: "user",
			type: "USER",
			description: "If specified, will only purge messages from that user"
		}
	],
	defaultPermission: false,
	permissions: ["621679404636176384", "718954666032889866", "621679757221822465"], // Wiki admin, Server mod, Wiki mod
	async execute(interaction, client) {
		await interaction.deferReply({ ephemeral: true });

		const member = interaction.options.getMember("user");
		let count = interaction.options.getInteger("count");
		count = Math.min(Math.max(count, 1), 100);

		if (member) {
			// Delete messages of specific member, only checks last 100 messages
			let deletedMessageCount = 0;
			let messagesToDelete = new Collection();

			const currentMessages = await interaction.channel.messages.fetch({ limit: 100 });
			currentMessages.each((message) => {
				if (message.author.id == member.user.id && deletedMessageCount < count) {
					messagesToDelete.set(message.id, message);
					deletedMessageCount++;
				}
			});

			await interaction.channel.bulkDelete(messagesToDelete);
		} else {
			// Just bulk delete
			await interaction.channel.bulkDelete(count);
		}

		await interaction.editReply({ content: `Purged ${count} message${count == 1 ? "" : "s"}.` });
	}
};
