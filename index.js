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

var dev = false;
var prefix;

if(config.dev == "true") {
    dev = true;
    prefix = config.devPrefix
} else {
    dev = false;
    prefix = config.prefix
}

client.dev = dev;
client.prefix = prefix;
client.footer = config.footer;
client.color = config.botEmbedColor;


client.on('ready', () => {
    setTimeout(createBot, 5 * 1000);

});

// const mongoose = require('mongoose')

// mongoose.connect('mongodb+srv://Moon:t.FW_!76LGnKVSr@cluster0.nthgz.mongodb.net/data', {
//     userUnifiedTopology: true,
//     useNewUrlParser: true
// }).then(console.log("connected"))

function createBot() {
	console.log('------------------------');

    log("Bot function started");
    
    var defaultChannel;
    var usernameBot;
    var igPrefix;

    if (config.dev == "true") {
        defaultChannel = config.devChannel;
        usernameBot = config.devUsername;

        igPrefix = config.ingamePrefixDev;
    } else {
        defaultChannel = config.channel;
        usernameBot = config.username;

        igPrefix = config.ingamePrefix;
    }
    
    const bot = mineflayer.createBot({
        host: "2y2c.org",
        port: 25565,
        username: usernameBot,
        version: "1.16.5"
    });

    bot.loadPlugin(tpsPlugin);
    bot.loadPlugin(pathfinder);

    bot.defaultChannel = defaultChannel; // Kenh mat dinh cua chat

    bot.dev = dev;
    bot.config = config;
    bot.prefix = igPrefix;


    var lobby = true; // Bot in queue
    bot.lobby = lobby;

    var joined = false; // check bot is joined
    bot.joined = joined;

    var haveJoined = false; // check da thay tin dang vao 2y2c chua
    bot.haveJoined = haveJoined; 

    var countPlayers = 0; // Join spam fix
    bot.countPlayers = countPlayers;

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

    var delayed = false;

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

            if(delayed) return;
            delayed = true;

            setTimeout(() => delayed = false, 5 * 1000);

            var content = msg.content;
            
            if(!content) return;

            let role = message.guild.roles.cache.find(r => r.name == "bypass chat");
            if(!member.roles.cache.get(role.id)) {
                if(cooldown.has("active")) return message.channel.send("Bạn cần chờ một chút chat tiếp tục.");

                // tranh lap lai content
                if(antiSpam.has(msg.content + msg.author.id)) {
                    antiSpam.add(message.author.id);

                    setTimeout(() => antiSpam.delete(message.author.id), 5 * 60 * 1000);
                }

                if(antiSpam.has(message.author.id)) return message.channel.send("Bạn đã tạm thời bị mute.");

                if(content.length > 88) return msg.channel.send("Rút ngắn tin nhắn của bạn lại để có thể gửi.");
                
                let regex = /[a-z]|[A-Z]|[0-9]/i;

                if(!message.author.username.toString().match(regex)) return msg.channel.send("Tên bạn có ký tự đặc biệt. Hãy đặt biệt danh");
            }

            var str = msg.content.toString().split('\n')[0];
            var chat = str.charAt(0).toUpperCase() + str.substr(1);

            var fixes = content.charAt(0).toLowerCase();

            if(str == "") return msg.channel.send("Nhập tin nhắn đê.");

            if(msg.content.includes("§" || !fixes && fixes == "")) return msg.channel.send("bug text");

            if(msg.author.bot) return;

            if(!chat.endsWith(".")) chat = chat + ".";

            setTimeout(() => {
                let member = message.guild.member(message.author.id);

                let tag = `${member.nickname !== null ? `${member.nickname}` : message.author.tag}`;
                bot.chat(`[${tag}]  ${chat}`);
                
                const send = client.emojis.cache.find(emoji => emoji.name === "1505_yes");
                msg.react(send).catch();

                // cooldown
                cooldown.add("active");
                antiSpam.add(msg.content + msg.author.id);

                setTimeout(() => {
                    cooldown.delete("active");
                }, 5 * 1000);

                setTimeout(() => {
                    antiSpam.delete(msg.content + msg.author.id);
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