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
const { Client, Collection, MessageEmbed } = require("discord.js");
const client = new Client();

const { readdirSync } = require('fs');

var abc = require("./api");
var api = new abc();

var d = require("./gotEvent");
var event = new d();

var Scriptdb = require('script.db');
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
	dev: process.env.DEV
};

client.config = config;


if(config.dev == "true") {
    client.dev = true;
} else {
    client.dev = false;
}

client.footer = config.footer;

var prefixSet = config.prefix;

if (config.dev == "true") prefixSet = config.devPrefix;

client.prefixSet = prefixSet;

//§

client.on('ready', () => {
	client.user.setActivity("RESTARTING", { type: 'PLAYING' });
	
	setTimeout(() => client.user.setActivity("Idling", { type: 'PLAYING' }), 10 * 1000);

	console.log('------------------------');
	console.log('       Moon Bot         ')
	console.log('------------------------');
	console.log('Guilds: ' + client.guilds.cache.size);
	console.log('Channels: ' + client.channels.cache.size);
	console.log('Total users: ' + client.guilds.cache.reduce((a, g) => a + g.memberCount, 0));
	console.log('------------------------');

	console.log('Bot started!');
	console.log('Developer: ' + client.dev.toString().replace(/t/, "T").replace(/f/, "F"));
	
	log("Ready!");

	api.clean();

	event.setup();

	createBot();

	// started notify
	client.guilds.cache.forEach((guild) => {
		const data = new Scriptdb(`./data/guilds/setup-${guild.id}.json`);
		const checkdata = data.get('livechat');

		if(checkdata == undefined || guild == undefined) return;

		try {
			client.channels.cache.get(checkdata).send({embed: {
				description: "Đang khởi động lại bot.",
				color: 0x15ff00
			}});
		} catch(e) {}
	});

    if(config.dev == "true") return;

	// guild count
	client.channels.cache.get('856516410750664764').setName('Total Guilds: ' +  client.guilds.cache.size);
	client.channels.cache.get('856517492372668426').setName('Total Channels: ' +  client.channels.cache.size);
	client.channels.cache.get('856517721122406430').setName('Total Users: ' + client.guilds.cache.reduce((a, g) => a + g.memberCount, 0));
	setInterval(() => {
		client.channels.cache.get('856516410750664764').setName('Total Guilds: ' +  client.guilds.cache.size);
		client.channels.cache.get('856517492372668426').setName('Total Channels: ' +  client.channels.cache.size);
		client.channels.cache.get('856517721122406430').setName('Total Users: ' +  client.guilds.cache.reduce((a, g) => a + g.memberCount, 0));
	}, 1 * 60 * 60 * 1000);

	// restart since
    var today = new Date()
    let day = ("00" + today.getDate()).slice(-2)
    let month = ("00" + (today.getMonth() + 1)).slice(-2)
    let hours = ("00" + today.getHours()).slice(-2)
    let min = ("00" + today.getMinutes()).slice(-2)

    var date = hours + ':' + min + " " + day + '/' + month;
	client.channels.cache.get('856522329672515614').setName('Restart At: ' + date);
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
            if (msg.content.startsWith(prefixSet)) return;

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
                bot.chat(`> [${msg.author.tag}]  ${chat}`);
                
                const send = client.emojis.cache.find(emoji => emoji.name === "1505_yes");
                msg.react(send);

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

module.exports = {createBot};

client.commands = new Collection();

const cmds = readdirSync(`./commands`).filter(file => file.endsWith('.js'));
for (const file of cmds) {
	const cmd = require(`./commands/${file}`);

	client.commands.set(cmd.name, cmd);
}

client.on('message', message => {
	if(message.author.bot || !message.content.startsWith(prefixSet) || message.author == client.user || message.channel.type == "dm") return;

	const args = message.content.slice(prefixSet.length).split(/ +/);
	const cmdName = args.shift().toLowerCase();

	const cmd = client.commands.get(cmdName)
		|| client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(cmdName));

	if(!cmd) return;
	
	client.userNotFound = new MessageEmbed()
					.setDescription('Không tìm thấy người chơi.')
					.setColor('0xC51515');
	
	client.footer = config.footer;
	client.color = config.botEmbedColor;
	client.prefix = config.prefix;

	client.ping = client.ws.ping;
	
	try {
		cmd.execute(client, message, args);
	}catch(err) {
		console.log(cmdName);
		console.log(err);
		console.log(err.toString());
	}
});

client.on("error", (e) => {
	console.log(e);
	var error = err.toString();
	console.log('\n\n' + error);
});

client.on("guildCreate", function(guild){
    console.log(guild.name + " joined");
    log(guild.name + " joined");
});
client.on("guildDelete", function(guild){
    console.log(guild.name + " left");
    log(guild.name + " left");
});

client.login(config.token).catch(err => console.log(err));