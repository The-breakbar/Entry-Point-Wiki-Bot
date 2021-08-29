const redis = require("redis");
const { promisify } = require("util");

// Connect to redis database which holds mute durations
const redisClient = redis.createClient({
	host: process.env.REDIS_HOST,
	port: process.env.REDIS_PORT,
	password: process.env.REDIS_PASSWORD
});

// Promisify redis commands
const set = promisify(redisClient.set).bind(redisClient);
const del = promisify(redisClient.del).bind(redisClient);
const keys = promisify(redisClient.keys).bind(redisClient);
const get = promisify(redisClient.get).bind(redisClient);
const mget = promisify(redisClient.mget).bind(redisClient);

// Client events
redisClient.on("error", (error) => {
	console.error(error);
});

redisClient.on("ready", () => {
	keys("*").then((entries) => {
		console.log(`Connected to Redis database, found ${entries.length} database entr${entries.length > 1 ? "ies" : "y"}:`);
		console.table(entries);
	});
});

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
		unmuteTimeout(mutedMember, endTime, time);
	},

	// On bot restart, reinitialize unmutes for muted users
	async syncMuted(mutedMembers) {
		const now = Date.now();

		// Get all mute entries from database
		let mutedIds = await keys("[0-9]*");
		let muteTimes;
		if (mutedIds.length > 1) muteTimes = await mget(mutedIds);
		else if (mutedIds.length == 1) muteTimes = [await get(mutedIds[0])];
		// If there are no mute values, unmute all members
		else {
			mutedMembers.each((mutedMember) => {
				unmute(mutedMember);
			});
		}

		if (muteTimes) {
			// Set unmute time for each database entry if user is muted
			mutedIds.forEach((id, index) => {
				const mutedMember = mutedMembers.get(id);
				const mutedId = id;
				const endTime = muteTimes[index];
				if (mutedMember) {
					// If mute is already over, unmute immediately
					if (now > endTime) {
						// Remove from database
						del(mutedId);

						unmute(mutedMember);
					} else {
						// Set unmute timeout
						unmuteTimeout(mutedMember, endTime, endTime - now);
					}
				} else {
					// If user isn't muted delete db value
					del(id);
				}
			});
		}

		console.log(`Successfully synced ${mutedIds.length} mute${mutedIds.length == 1 ? "" : "s"}`);
	},

	// Check if new member is supposed to be muted
	checkMute(member) {
		const now = Date.now();
		const newMember = member;
		const endTime = get(newMember.user.id);

		if (endTime) {
			unmuteTimeout(newMember, endTime, endTime - now);
		}
	}
};

const unmute = (member) => {
	if (member.roles.cache.some((role) => role.name == "Muted")) {
		member.roles.remove(member.guild.roles.cache.find((role) => role.name == "Muted"));
	}
};

const unmuteTimeout = (member, endTime, time) => {
	setTimeout(() => {
		get(member.user.id).then((resultTime) => {
			// Only unmute if mute hasn't been updated to a longer time
			if (resultTime <= endTime) {
				// Remove from database
				del(member.user.id);

				unmute(member);
			}
		});
	}, time);
};
