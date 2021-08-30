// Imports
const { Client, Intents, Collection } = require("discord.js");
const { getJsFiles } = require("./utils/fileUtils");

// Configure client
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_BANS] });
client.commands = new Collection();
client.contextMenus = new Collection();

// Embed color used in various commands
global.purple = "#b33fe6";

// Error logging
process.on("uncaughtException", (error) => console.error(error));

// Get all event handlers
const allEvents = [
	...getJsFiles("./events"),
	...getJsFiles("./events/command-events"),
	...getJsFiles("./events/wiki-server-events"),
	...getJsFiles("./events/log-events")
];

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
const allCommands = [...getJsFiles("./commands"), ...getJsFiles("./commands/wiki-server-commands")];

// Store commands in client
allCommands.forEach((file) => {
	const command = require(`./${file}`);
	client.commands.set(command.name, command);
});

// Get context menus
const allContextMenus = [...getJsFiles("./context-menus"), ...getJsFiles("./context-menus/wiki-server-context-menus")];

// Store context menus in client
allContextMenus.forEach((file) => {
	const contextMenu = require(`./${file}`);
	client.contextMenus.set(contextMenu.name, contextMenu);
});

// Client login
client.login(process.env.TOKEN);
