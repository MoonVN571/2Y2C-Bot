/**
 * 			MOON BOT 2Y2C
 * 
 * Mã nguồn cde được viết dựa trên cảm hứng từ server 2B2T. Ban đầu là
 * bot chỉ dự định dùng để xem hàng chờ của 2b2t. Bot minecraft được tạo
 * vào ngày 6/1/2021. Tất cả data của người chơi mà bot có thể đọc được đã
 * được lưu trên 1 VPS và chính là VPS chính để host bot.
 * 
 * Dự án này hiện tại không công khai. Tuy nhiên vẫn có 1-2 người có thể xem
 * được toàn bộ mã nguồn này.
 * 
 * Tuỳ thuộc vào dev. Nếu như không tiếp tục phát triển nữa thì có thể sẽ
 * public mã nguồn của bot.
 * 
 * Copyright © 2020 - 2021 Moon Bot
 */

// Discord client
const { Client, Collection } = require("discord.js");
const client = new Client();

const { readdirSync  } = require('fs');

var d = require("./gotEvent");
var event = new d();

var mineflayer = require('mineflayer');
var tpsPlugin = require('mineflayer-tps')(mineflayer);
var {pathfinder} = require('mineflayer-pathfinder');

var cooldown = new Set();
var antiSpam = new Set();

const log = require('./log');

require('dotenv').config();

const config = {
	token: process.env.TOKEN,
	username: process.env.IGN,
	devUsername: process.env.IGN2,
	footer: process.env.FOOTER,
	prefix:  process.env.PREFIX,
	devPrefix: process.env.PREFIX2,
	channel: process.env.CHANNEL,
	devChannel: process.env.CHANNEL2,
	ingamePrefix: process.env.IGPREFIX,
	ingamePrefixDev: process.env.IGPREFIX2,
	chatColor: process.env.COLOR,
	chatColorHighlight: process.env.COLOR2LAI,
	botEmbedColor: process.env.BOTCOLOR,
	author: process.env.AUTHOR,
	dev: process.env.DEV,
    tggtoken: process.env.TOPGGTOKEN,
    authtoken: process.env.TOPGGAUTH
};

client.config = config;


if(config.dev == "true") {
    client.dev = true;
} else {
    client.dev = false;
}

client.footer = config.footer;
client.color = config.botEmbedColor;
client.prefix = config.prefix;

// module.exports.run = () => {
//     createBot(client);
// }
client.on('ready', () => {
    setTimeout(createBot, 5 * 1000);
});

function createBot() {
	console.log('------------------------');

    log("Bot function started");
    
    var defaultChannel;
    var usernameBot;

    if (config.dev == "true") {
        defaultChannel = config.devChannel;
        usernameBot = config.devUsername;
    } else {
        defaultChannel = config.channel;
        usernameBot = config.username;
    }
    
    const bot = mineflayer.createBot({
        host: "2y2c.org",
        port: 25565,
        username: usernameBot,
        version: "1.16.5"
    });

    bot.loadPlugin(tpsPlugin);
    bot.loadPlugin(pathfinder);

    // Import
    bot.defaultChannel = defaultChannel; // Kenh mat dinh cua chat

    if(config.dev == "true") {
        bot.dev = true;
    } else {
        bot.dev = false;
    }

    var lobby = true; // Bot in queue
    bot.lobby = lobby;

    var joined = false; // check bot is joined
    bot.joined = joined;

    var countPlayers = 0; // Join spam fix
    bot.countPlayers = countPlayers;

    bot.config = config;

    // cmd  handler
    bot.commands = new Collection();

    const cmds = require('fs').readdirSync(`./ingame-commands/`).filter(file => file.endsWith('.js'));

    for(const file of cmds){
        const cmd = require(`./ingame-commands/${file}`);
        
        bot.commands.set(cmd.name, cmd);
    }

    // event handler
    const eventFiles = readdirSync('./events-ingame').filter(file => file.endsWith('.js'));

    for (const file of eventFiles) {
        const event = require(`./events-ingame/${file}`);
        
        if(event.other && event.once) {
            bot._client.once(event.name, (...args) => event.execute(bot, client, ...args));
        } else  if(event.other && !event.once) {
            bot._client.on(event.name, (...args) => event.execute(bot, client, ...args));
        } else {
            if (event.once) {
                bot.once(event.name, (...args) => event.execute(bot, client, ...args));
            } else {
                bot.on(event.name, (...args) => event.execute(bot, client, ...args));
            }
        }
    }

    if(event.getME()) return;

    client.on('message', msg => {
        var message = msg;
        
        if (msg.author.bot) return;

        if (msg.channel.id === '797426761142632450') { // main
            if (msg.author == client.user) return;
            if(config.dev !== "false") return;
        
            setTimeout(() => {
                bot.chat(msg.content);
            }, 1 * 1000);
        }

        if (msg.channel.id === '802456011252039680') {
            if (msg.author == client.user) return;
            if(config.dev == "true") return; 
            
            setTimeout(() => {
                bot.chat(msg.content);
            }, 1 * 1000);
        }

        if (msg.channel.id == defaultChannel) {
            if (msg.content.startsWith(">")) return;
            if (msg.content.startsWith(config.prefix)) return;

            var content = msg.content;
            
            if(!content) return;

            if(cooldown.has("active")) return message.channel.send("Bạn cần chờ một chút chat tiếp tục.");

            // tranh lap lai content
            if(antiSpam.has(content)) {
                antiSpam.add(message.author.id);

                setTimeout(() => antiSpam.delete(message.author.id), 5 * 60 * 1000);
            }

            if(antiSpam.has(message.author.id)) return message.channel.send("Bạn đã tạm thời bị mute.");

            if(content.length > 88) return msg.channel.send("Rút ngắn tin nhắn của bạn lại để có thể gửi.");
            
            var str = msg.content.toString().split('\n')[0];
            var chat = str.charAt(0).toUpperCase() + str.substr(1);

            var fixes = content.charAt(0).toLowerCase();

            if(msg.content.includes("§" || !fixes && fixes == "")) return msg.channel.send("bug text");

            if(msg.author.bot) return;

            if(!chat.endsWith(".")) chat = chat + ".";

            setTimeout(() => {
                bot.chat(`[${msg.author.tag}]  ${chat}`);
                
                const send = client.emojis.cache.find(emoji => emoji.name === "1505_yes");
                msg.react(send).catch();

                // cooldown
                cooldown.add("active");
                antiSpam.add(content);

                setTimeout(() => {
                    cooldown.delete("active");
                }, 5 * 1000);

                setTimeout(() => {
                    antiSpam.delete(content);
                }, 1 * 60 * 1000);

            }, 1 * 1000);
        }
    });
}


module.exports = {createBot };

// event handler
const eventFiles = readdirSync('./events').filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
    const event = require(`./events/${file}`);
    
    if (event.once) {
        client.once(event.name, (...args) => event.execute(client, ...args));
    } else {
        client.on(event.name, (...args) => event.execute(client, ...args));
    }
}
  
client.commands = new Collection();

const cmds = readdirSync(`./commands`).filter(file => file.endsWith('.js'));
for (const file of cmds) {
    const cmd = require(`./commands/${file}`);

    client.commands.set(cmd.name, cmd);
}


client.login(config.token).catch(err => console.log(err));