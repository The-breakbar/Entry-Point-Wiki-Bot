// Imports
const { Client, Intents, Collection } = require("discord.js");
const { getJsFiles } = require("./utils/fileUtils");

// Store wiki server ids and embed color in global for ease of access, won't overwrite anything in the environment
global.wConfig = require("./config.json");
global.purple = "#b33fe6";

// Configure client
const client = new Client({
	intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_BANS],
	allowedMentions: {
		roles: [
			global.wConfig.roles["Stealth Ping"],
			global.wConfig.roles["Loud Ping"],
			global.wConfig.roles["Ironman Ping"],
			global.wConfig.roles["Shadow War Ping"],
			global.wConfig.roles["Freelance Heist Ping"],
			global.wConfig.roles["Night Heist Ping"],
			global.wConfig.roles["Daily Challenge Ping"]
		]
	}
});
client.commands = new Collection();
client.contextMenus = new Collection();

// Error logging
process.on("uncaughtException", (error) => console.error(error));

// Get all event handlers
const allEvents = [...getJsFiles("./events"), ...getJsFiles("./events/command"), ...getJsFiles("./events/wiki-server"), ...getJsFiles("./events/log")];

// Bind event handlers
allEvents.forEach((file) => {
	const event = require(`./${file}`);
	if (event.once) {
		client.once(event.name, (...args) => {
			try {
				event.execute(...args, client);
			} catch (error) {
				console.error(error);
			}
		});
	} else {
		client.on(event.name, (...args) => {
			try {
				event.execute(...args, client);
			} catch (error) {
				console.error(error);
			}
		});
	}
});

// Get commands
const allCommands = [...getJsFiles("./commands"), ...getJsFiles("./commands/wiki-server")];

// Store commands in client
allCommands.forEach((file) => {
	const command = require(`./${file}`);
	client.commands.set(command.name, command);
});

// Get context menus
const allContextMenus = [...getJsFiles("./context-menus"), ...getJsFiles("./context-menus/wiki-server")];

// Store context menus in client
allContextMenus.forEach((file) => {
	const contextMenu = require(`./${file}`);
	client.contextMenus.set(contextMenu.name, contextMenu);
});

// Client login
client.login(process.env.TOKEN);
