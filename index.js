// Imports
const { Client, Intents, Collection } = require("discord.js");
const fs = require("fs");

// Configure client
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
client.commands = new Collection();
client.contextMenus = new Collection();

// Bind event handlers
const eventFiles = fs.readdirSync("./events").filter((file) => file.endsWith(".js"));
eventFiles.forEach((file) => {
	const event = require(`./events/${file}`);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args, client));
	} else {
		client.on(event.name, (...args) => event.execute(...args, client));
	}
});

// Get commands
const commandFiles = fs.readdirSync("./commands").filter((file) => file.endsWith(".js"));
commandFiles.forEach((file) => {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
});

// Get context menus
const contextMenus = fs.readdirSync("./context-menus").filter((file) => file.endsWith(".js"));
contextMenus.forEach((file) => {
	const contextMenu = require(`./context-menus/${file}`);
	client.contextMenus.set(contextMenu.name, contextMenu);
});

// Client login
client.login(process.env.TOKEN);
