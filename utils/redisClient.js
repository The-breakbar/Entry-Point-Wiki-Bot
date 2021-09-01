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
		console.log(`✅ Connected to Redis database, found ${entries.length} database entr${entries.length > 1 ? "ies" : "y"}`);
	});
});

// Export commands
module.exports = { set, del, keys, get, mget };
