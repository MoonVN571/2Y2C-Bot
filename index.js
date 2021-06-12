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
const Discord = require("discord.js");
const client = new Discord.Client();

// bot
var mineflayer = require('mineflayer');
var tpsPlugin = require('mineflayer-tps')(mineflayer);
const pathfinder = require('mineflayer-pathfinder').pathfinder;

// Node module
var fs = require('fs');
var Scriptdb = require('script.db');

// Module
const log = require('./log');
var abc = require("./api");
var api = new abc();

// env file need to hide
require('dotenv').config();

const config = {
	token: process.env.TOKEN,
	username: process.env.ign,
	devUsername: process.env.ignDev,
	footer: "moonbot 2021",
	prefix:  "$",
	devPrefix: "dev$",
	channel: "795135669868822528",
	devChannel: "802454010400604161",
	ingamePrefix: "!",
	ingamePrefixDev: "!",
	chatColor: "0x979797",
	chatColorHighlight: "0x2EA711",
	botEmbedColor: "0x000DFF",
	author: "425599739837284362"
};

// Value
let cooldown = new Set();
let antiSpam = new Set();

const dev = true;

var prefix = config.prefix;
var defaultChannel;
var usernameBot;

if (dev) {
	defaultChannel = config.devChannel;
	usernameBot = config.devUsername;
	prefix = config.devPrefix;
} else {
	defaultChannel = config.channel;
	usernameBot = config.username;
}

const footer = config.footer;
client.footer = footer;

const prefixSet = config.prefix;
client.prefix = prefixSet;


client.on('ready', () => {
	client.user.setActivity("RESTARTING", { type: 'PLAYING' });
	
	console.log('------------------------');
	console.log('       Moon Bot         ')
	console.log('------------------------');
	console.log('Guilds: ' + client.guilds.cache.size);
	console.log('Channels: ' + client.channels.cache.size);
	console.log('Total users: ' + client.guilds.cache.reduce((a, g) => a + g.memberCount, 0));
	console.log('------------------------');

	console.log('Bot started!');
	console.log('Developer: ' + dev.toString().replace(/t/, "T").replace(/f/, "F"));
	
	log("Ready to create bot");

	const data = new Scriptdb(`./data.json`);

	data.set('queueStart', null);
	data.set('queueEnd', null);

	data.set('tab-content', null);
	data.set('uptime', null);
	data.set('players', null);

	createBot();

	// blacklist guild
	setInterval(() => {
		client.guilds.cache.forEach((guild) => {
			fs.readFile("blacklists.txt",  (err, data) => {
				// console.log(data.toString().split("\r\n"))

				if(guild.id == data.toString().split("\r\n")) {
					const data = new Scriptdb(`./data/guilds/setup-${guild.id}.json`);
					const checkdata = data.get('livechat');

					if(checkdata == undefined || guild == undefined) return;
					
					try {
						client.channels.cache.get(checkdata).send("Guild của bạn là blacklist.");
					} catch(e) {}
				}
			});
		});
	}, 5 * 60 * 1000);
});





function createBot() {
	console.log('------------------------');
	log("Bot function started");
	
	const bot = mineflayer.createBot({
		host: "2y2c.org",
		port: 25565,
		username: usernameBot,
		version: "1.16.5"
	});

    bot.loadPlugin(tpsPlugin);
	bot.loadPlugin(pathfinder);
	
	var color = config.chatColor; // single channel
	var color2 = config.chatColor; // multi channel

	// Import
	bot.defaultChannel = defaultChannel; // Kenh mat dinh cua chat
	bot.dev = dev; // developer mode

	var lobby = true; // Bot in queue
	bot.lobby = lobby;

	var joined = false; // check bot is joined
	bot.joined = joined;

	var countPlayers = 0; // Join spam fix
	bot.countPlayers = countPlayers;
	
	const verifyEvent = require('./events-ingame/verify.js');
	bot.on('windowOpen', verifyEvent.bind(null, bot));

	const autoEvent = require('./events-ingame/auto.js');
	const JoinedServerEvent = require('./events-ingame/login.js');
	const playtimeEvent = require('./events-ingame/playtime.js');
	bot.once('login', autoEvent.bind(null, bot, client));
	bot.once('login', JoinedServerEvent.bind(null, bot, client));
	bot.once('login', playtimeEvent.bind(null, bot));

	const tpsEvent = require('./events-ingame/server-tps.js');
	bot.once('login', tpsEvent.bind(null, bot, client));

	bot.on('message', msg => {
		if (!(msg.toString().startsWith("<"))) return;
		var username = msg.toString().split(" ")[0].split("<")[1].split(">")[0];
		if(username.startsWith("[")) username = username.split("]")[1];
		logger = msg.toString().substr(msg.toString().split(" ")[0].length + 1);
	
		if (logger.startsWith(">")) color2 = config.chatColorHighlight;
	
		var bp = config.ingamePrefix;
		if (dev) bp = config.ingamePrefixDev;
		
		var chat = new Discord.MessageEmbed()
						.setDescription(`**<${api.removeFormat(username)}>** ${api.removeFormat(logger)}`)
						.setColor(color2);
	
		try {
			client.channels.cache.get(bot.defaultChannel).send(chat);
			color2 = "0x797979";
		} catch (e) {}

		// check if message start with > and change color
		var setLogger = `**<${api.removeFormat(username)}>** ${api.removeFormat(logger)}`;

		client.guilds.cache.forEach((guild) => {
			const data = new Scriptdb(`./data/guilds/setup-${guild.id}.json`);
			const checkdata = data.get('livechat');
	
			if(checkdata == undefined || guild == undefined) return;
					
			if(setLogger.split(" ")[1].startsWith(">")) color = config.chatColorHighlight;

			let embedChat = new Discord.MessageEmbed()
						.setDescription(setLogger)
						.setColor(color);

			if(dev) return;

			try {
				client.channels.cache.get(checkdata).send(embedChat);
				color = config.chatColor;
			} catch(e) {}
		});
	
		saveMsgsData(username, logger);
		function saveMsgsData(username, logger) {
			if(logger.startsWith(bp)) return;
			let messages = new Scriptdb(`./data/quotes/${username}.json`);
			let msgs = messages.get("messages")
			let times = messages.get("times")

			if(msgs == undefined) {
				messages.set("messages", logger)
				messages.set("times", Date.now())
			} else {
				messages.set("messages", logger + " | " + msgs)
				messages.set("times", times + " | " + Date.now())
			}
		}
	
		if(!logger.startsWith(bp)) return;
		const args = logger.slice(bp.length).split(/ +/);
		const cmdName = args.shift().toLowerCase();
	
		client.commands = new Discord.Collection();
	
		const cmds = require('fs').readdirSync(`./ingame-commands/`).filter(file => file.endsWith('.js'));
	
		for(const file of cmds){
			const cmd = require(`./ingame-commands/${file}`);
			
			client.commands.set(cmd.name, cmd);
		}
	
		const cmd = client.commands.get(cmdName)
			|| client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(cmdName));
	
		if(cmdName == "reload") {
			if(username == "MoonVN" || username == "MoonZ" || username == "MoonOnTop" || username == "MoonX" || username == bot.username || username == "MoonzVN") {
				if(!args[0]) return bot.whisper(username, "> Nhập tên lệnh cần reload.")
	
				const cmd = require(`./ingame-commands/${args[0]}.js`);
	
				delete require.cache[require.resolve(`./ingame-commands/${args[0]}.js`)];
	
				if(!cmd) return bot.whisper(username, "> Không tìm thấy tên lệnh này.")
				client.commands.delete(args[0])
				client.commands.set(args[0], cmd);
				
				bot.whisper(username, "> Reload thành công: " + args[0])
			} else {
				bot.whisper(username, "> Không thể sử dụng lệnh này.")
			}
		}
	
		if(cmdName == "sudo") {
			if(!args[0]) return bot.whisper(username, "Không tìm thấy nội dung.")
			
			if(username == "MoonVN" || username == "MoonZ" || username == "MoonOnTop" || username == "MoonX" || username == bot.username || username == "MoonzVN") {
				bot.chat(logger.substr(6));
				bot.whisper(username, "Đang thực hiện: " + logger.substr(6))
			}
		}
		
		if(!cmd) return;
	
		bot.regex = /[a-z]|[A-Z]|[0-9]/i;
		bot.logger = logger;

		setTimeout(() => {
			try {
				cmd.execute(bot, username, args);
			}catch(err){
				console.log(err);
			}
		}, 1* 1000);
	});

	const msgEvent = require(`./events-ingame/msg.js`);
	bot.on("message", msgEvent.bind(null, bot, client));

	const joinedEvent = require(`./events-ingame/join.js`);
	const leftEvent = require(`./events-ingame/left.js`);
	bot.on("playerJoined", joinedEvent.bind(null, bot, client));
	bot.on("playerLeft", leftEvent.bind(null, bot, client));

	const ServerStatusEvent = require(`./events-ingame/status-tab.js`);
	const mainEvent = require(`./events-ingame/main-tab.js`);
	const queueEvent = require(`./events-ingame/queue-tab.js`);
	bot._client.on("playerlist_header", ServerStatusEvent.bind(null, bot));
	bot._client.on("playerlist_header", mainEvent.bind(null, bot, client));
	bot._client.on("playerlist_header", queueEvent.bind(null, bot, client));

	const endedEvent = require('./events-ingame/ended.js');
	const kickedEvent = require('./events-ingame/kicked.js');
	bot.on('kicked', kickedEvent.bind(null, bot, client));
	bot.on('end', endedEvent.bind(null, bot, client));

	bot.on('error', err => { console.log(err)});
	bot._client.on('error',err => console.log(err));

	client.on('message', msg => {
		var message = msg;
		
		if (msg.author.bot) return;

		if (msg.channel.id === '797426761142632450') { // main
			if (msg.author == client.user) return;
			if(!dev) {
				setTimeout(() => {
					bot.chat(msg.content);
				}, 1 * 1000);
			}
			return;
		}

		if (msg.channel.id === '802456011252039680') {
			if (msg.author == client.user) return;
			if(dev) {
				setTimeout(() => {
					bot.chat(msg.content);
				}, 1 * 1000);
			}
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

			if(!chat.endsWith(".")) {
				chat = chat + ".";
			}

			setTimeout(() => {
				bot.chat(`> [${msg.author.tag}]  ${chat}`);

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

			const send = client.emojis.cache.find(emoji => emoji.name === "1505_yes");
			msg.react(send);
		}
	});
}

module.exports = { createBot };






client.commandss = new Discord.Collection();

const cmdss = fs.readdirSync(`./commands`).filter(file => file.endsWith('.js'));
for (const file of cmdss) {
	const cmd = require(`./commands/${file}`);

	client.commandss.set(cmd.name, cmd);
}

client.on("message", async message => {
	if(message.author.bot|| !message.content.startsWith(prefixSet) || message.author == client.user || message.channel.type == "dm") return;

	if(dev && message.guild.id !== "794912016237985802") return message.channel.send("Lệnh đã bị tắt tại nhóm này.");
	
    const args = message.content.slice(prefixSet.length).split(/ +/);
    const cmdName = args.shift().toLowerCase();

    const cmd = client.commandss.get(cmdName)
        || client.commandss.find(cmd => cmd.aliases && cmd.aliases.includes(cmdName));

	if(cmdName == "reload") {
		var noPerm = new Discord.MessageEmbed()
							.setDescription('Bạn phải là nhà phát triển để sử dụng lệnh này.')
							.setColor('0xC51515');

		if(message.author.id !== config.author)
		return message.channel.send(noPerm).then(msg => {
			msg.delete({ timeout: 10000 });
		});

		delete require.cache[require.resolve(`./commands/${args[0]}.js`)];

		const cmd = require(`./commands/${args[0]}`);
		client.commandss.set(cmd.name, cmd);

		var successful = new Discord.MessageEmbed()
							.setDescription(`Đã tải lại ${args[0]} thành công!`)
							.setColor(0x2EA711);

		message.channel.send(successful)
	}

	if(cmdName == "igreload" || cmdName == "igrl") {
		var noPerm = new Discord.MessageEmbed()
							.setDescription('Bạn phải là nhà phát triển để sử dụng lệnh này.')
							.setColor('0xC51515');

		if(message.author.id !== config.author)
		return message.channel.send(noPerm).then(msg => {
			msg.delete({ timeout: 10000 });
		});

		delete require.cache[require.resolve(`./ingame-commands/${args[0]}.js`)];

		const cmd = require(`./ingame-commands/${args[0]}`);
		client.commands.set(cmd.name, cmd);
		

		var successful = new Discord.MessageEmbed()
							.setDescription(`Đã tải lại ${args[0]} thành công!`)
							.setColor(0x2EA711);

		message.channel.send(successful);
	}

    if(!cmd) return;
	
	client.userNotFound = new Discord.MessageEmbed()
					.setDescription('Không tìm thấy người chơi.')
					.setColor('0xC51515');
	
	client.footer = footer;
	client.dev = dev;
	client.color = config.botEmbedColor;
	client.prefix = prefix;

	client.ping = client.ws.ping;
	
    try{
        cmd.execute(client, message, args);
    }catch(err) {
        console.log(err);
		console.log(err.toString());
    }
});

client.login(config.token).catch(err => console.log(err));
client.on("error", (e) => {
	console.error(e);
	var error = err.toString();
});