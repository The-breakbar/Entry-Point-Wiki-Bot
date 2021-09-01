const redis = require("../../utils/redisClient");

module.exports = {
	name: "unmute",
	description: "Unmute command for server staff",
	options: [{ name: "user", type: "USER", description: "A user ping, or their user id", required: true }],
	defaultPermission: false,
	permissions: ["621679404636176384", "718954666032889866", "621679757221822465"], // Wiki admin, Server mod, Wiki mod
	async execute(interaction, client) {
		// Defer reply
		await interaction.deferReply({ ephemeral: true });

		const member = interaction.options.getMember("user");

		// Only unmute if user is muted
		if (member.roles.cache.some((role) => role.name == "Muted")) {
			await redis.del(member.user.id);
			await member.roles.remove(member.guild.roles.cache.find((role) => role.name == "Muted"));
			await interaction.editReply({ content: `${member.user} was unmuted.` });
		} else {
			await interaction.editReply({ content: "The user is not muted." });
		}
	}
};
