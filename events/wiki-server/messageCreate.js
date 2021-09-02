const redis = require("../../utils/redisClient");
const { mute } = require("../../utils/muteUtils");
const { Collection } = require("discord.js");

let spamMessages = {};
let warnings = {};

let badWords = [];
redis.get("filter").then((badWordString) => {
	if (badWordString == null) {
		console.log("⚠️  Failed to get filter string");
	} else {
		badWords = badWordString.split(",").map((regexString) => {
			return new RegExp(regexString, "i");
		});
	}
});

module.exports = {
	name: "messageCreate",
	async execute(message, client) {
		// Handles message related processes in the wiki server
		if (message.guild != client.wikiServer.guild || message.author.bot) return;

		const authorId = message.author.id;
		const messageId = message.id;

		// Store message for spam detection
		if (spamMessages[authorId]) spamMessages[authorId].push(messageId);
		else spamMessages[authorId] = [messageId];

		// Warn/mute if more than 5 messages in 2 seconds
		if (spamMessages[authorId].length > 4) {
			if (warnings[authorId]) {
				let spamMessagesCopy = spamMessages[authorId].slice();
				delete spamMessages[authorId];
				delete warnings[authorId];

				// If user has been warned before, mute them for 6 hours
				await mute(message.member, 21600000);

				// Delete spammed messages
				let collectionToBeDeleted = new Collection();
				await Promise.all(spamMessagesCopy.map((messageDeleteId) => message.channel.messages.fetch(messageDeleteId))).then((response) => {
					response.forEach((messageToBeDeleted) => {
						collectionToBeDeleted.set(messageToBeDeleted.id, messageToBeDeleted);
					});
				});
				await message.channel.bulkDelete(collectionToBeDeleted);

				// Notify user of mute
				const embed = {
					color: global.purple,
					description: "You have been muted for 6 hours for spamming.",
					timestamp: new Date()
				};
				message.member.send({ embeds: [embed] }).catch((error) => console.error(error));

				// Log spam mute
				const logEmbed = {
					color: global.purple,
					description: `${message.member} was muted for 6 hours for spamming.`,
					timestamp: new Date()
				};
				client.wikiServer.log.send({ embeds: [logEmbed] }).catch((error) => console.error(error));
			} else {
				// Else send them a warning and reset counter
				let spamMessagesCopy = spamMessages[authorId].slice();
				warnings[authorId] = true;
				delete spamMessages[authorId];

				// Delete spammed messages
				let collectionToBeDeleted = new Collection();
				await Promise.all(spamMessagesCopy.map((messageDeleteId) => message.channel.messages.fetch(messageDeleteId))).then((response) => {
					response.forEach((messageToBeDeleted) => {
						collectionToBeDeleted.set(messageToBeDeleted.id, messageToBeDeleted);
					});
				});
				await message.channel.bulkDelete(collectionToBeDeleted);

				// Message user
				const embed = {
					color: global.purple,
					description: "Please do not spam messages."
				};
				message.member.send({ embeds: [embed] }).catch((error) => console.error(error));

				// Log spam warning
				const logEmbed = {
					color: global.purple,
					description: `${message.member} was warned for spamming.`,
					timestamp: new Date()
				};
				client.wikiServer.log.send({ embeds: [logEmbed] }).catch((error) => console.error(error));
			}
		} else {
			// Remove message from list after 2 seconds
			setTimeout(() => {
				if (spamMessages[authorId]) {
					const index = spamMessages[authorId].indexOf(messageId);
					if (index >= 0) {
						spamMessages[authorId].splice(index, 1);
						if (spamMessages[authorId].length == 0) {
							delete spamMessages[authorId];
						}
					}
				}
			}, 2000);
		}

		// // Filter for bad words
		// if (isBad) {
		// 	// handle bad word
		// } else {
		// 	// channel specific reacts
		// }
	}
};
