// Imports
const { Client, Intents, Collection } = require("discord.js");
const { getJsFiles } = require("./utils/fileUtils");
const fs = require("fs");
const path = require("path");

// Configure client
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
client.commands = new Collection();
client.contextMenus = new Collection();

// Embed color used in various commands
global.purple = "#b33fe6";

// Get all event handlers
const globalEvents = getJsFiles("./events");
const commandEvents = getJsFiles("./events/command-events");
const wikiServerEvents = getJsFiles("./events/wiki-server-events");
const logEvents = getJsFiles("./events/log-events");
const allEvents = [...globalEvents, ...commandEvents, ...wikiServerEvents, ...logEvents];

// Bind event handlers
allEvents.forEach((file) => {
	const event = require(`./${file}`);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args, client));
	} else {
		client.on(event.name, (...args) => event.execute(...args, client));
	}
});

// Get commands
const globalCommands = getJsFiles("./commands");
const wikiServerCommands = getJsFiles("./commands/wiki-server-commands");
const allCommands = [...globalCommands, ...wikiServerCommands];

// Store commands in client
allCommands.forEach((file) => {
	const command = require(`./${file}`);
	client.commands.set(command.name, command);
});

// Get context menus
const globalContextMenus = getJsFiles("./context-menus");
const wikiServerContextMenus = getJsFiles("./context-menus/wiki-server-context-menus");
const allContextMenus = [...globalContextMenus, ...wikiServerContextMenus];

// Store context menus in client
allContextMenus.forEach((file) => {
	const contextMenu = require(`./${file}`);
	client.contextMenus.set(contextMenu.name, contextMenu);
});

// Client login
client.login(process.env.TOKEN);
