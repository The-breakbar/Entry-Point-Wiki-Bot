const redis = require("redis");
const { promisify } = require("util");

// Connect to redis database which holds mute durations
const redisClient = redis.createClient({
	host: process.env.REDIS_HOST,
	port: process.env.REDIS_PORT,
	password: process.env.REDIS_PASSWORD
});

// Client events
redisClient.on("error", (error) => {
	console.error(error);
});

redisClient.on("ready", () => {
	redisClient.keys("*", (error, result) => {
		console.log(`Connected to Redis database, found ${result.length} active mutes`);
	});
});

// Promisify redis commands
const set = promisify(redisClient.set).bind(redisClient);
const del = promisify(redisClient.del).bind(redisClient);
const keys = promisify(redisClient.keys).bind(redisClient);
const get = promisify(redisClient.get).bind(redisClient);
const hmget = promisify(redisClient.hmget).bind(redisClient);

module.exports = {
	async mute(member, time) {
		let endTime = Date.now() + time;

		// Add mute in database
		await set(member.user.id, endTime);

		// Add muted role
		let mutedMember = member;
		if (!mutedMember.roles.cache.some((role) => role.name == "Muted")) {
			mutedMember = await member.roles.add(member.guild.roles.cache.find((role) => role.name == "Muted"));
		}

		// Set unmute timeout
		setTimeout(() => {
			get(mutedMember.user.id).then((resultTime) => {
				// Only unmute if mute hasn't been updated to a longer time
				if (resultTime <= endTime) {
					// Remove from database
					del(mutedMember.user.id);

					// Unmute
					if (mutedMember.roles.cache.some((role) => role.name == "Muted")) {
						mutedMember.roles.remove(mutedMember.guild.roles.cache.find((role) => role.name == "Muted"));
					}
				}
			});
		}, time);
	},
	// Get list of currently muted users
	async getMuted() {
		let dbKeys = await keys("*");

		let muteTimes;
		if (dbKeys.length > 1) muteTimes = await hmget(dbKeys);
		else if (dbKeys.length == 1) muteTimes = [await get(dbKeys[0])];

		return dbKeys.map((dbKey, index) => [dbKey, muteTimes[index]]);
	}
};
