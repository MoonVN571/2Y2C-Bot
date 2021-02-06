const Discord = require("discord.js");
const fs = require("fs");

const client = new Discord.Client();
const config = require("./config.json");
client.config = config;

client.footer = "moonbot dev";

var mineflayer = require('mineflayer')
// var tpsPlugin = require('mineflayer-tps')(mineflayer)


client.on('ready', () => {
	console.log('Bot online!');
	client.user.setActivity('Minecraft', { type: 'PLAYING' });
});

fs.readdir("./events/", (err, files) => {
  if (err) return console.error(err);
  
  files.forEach(file => {
    const event = require(`./events/${file}`);
    let eventName = file.split(".")[0];
    client.on(eventName, event.bind(null, client));
  });
});

fs.readdir("./events-bot/", (err, files) => {
  if (err) return console.error(err);
  
  files.forEach(file => {
    const event = require(`./events-bot/${file}`);
    let eventName = file.split(".")[0];
    client.on(eventName, event.bind(null, mineflayer));
  });
});

client.commands = new Discord.Collection();

fs.readdir("./commands/", (err, files) => {
  if (err) return console.error(err);

  files.forEach(file => {
    if (!file.endsWith(".js")) return;
    let props = require(`./commands/${file}`);
    let commandName = file.split(".")[0];
    console.log(`Loaded ${commandName}`);
    client.commands.set(commandName, props);
  });
});

client.igCommands = new Discord.Collection();

fs.readdir("./ingame-commands/", (err, files) => {
  if (err) return console.error(err);

  files.forEach(file => {
    if (!file.endsWith(".js")) return;
    let props = require(`./ingame-commands/${file}`);
    let commandName = file.split(".")[0];
    console.log(`Loaded ${commandName}`);
    client.igCommands.set(commandName, props);
  });
});

client.login(config.token);