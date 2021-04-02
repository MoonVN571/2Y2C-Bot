const Discord = require("discord.js");
const client = new Discord.Client();

const superagent = require("superagent") // queue 2b2t
var waitUntil = require('wait-until') // wait method
var mineflayer = require('mineflayer') // bot minecraft
var tpsPlugin = require('mineflayer-tps')(mineflayer) // mineflayer plugins

const pathfinder = require('mineflayer-pathfinder').pathfinder
const Movements = require('mineflayer-pathfinder').Movements

const {  GoalNear } = require('mineflayer-pathfinder').goals

var fs = require('fs')
const Scriptdb = require('script.db');
var newAPI = require('./api.js');
var api = new newAPI();

const footer = "moonbot 2021";
var prefix = "$";

require('dotenv').config();

const config = {
	token: process.env.TOKEN,
	ip: process.env.ip
};

var dev = true;
var debug = false;

if (dev) {
	prefix = "dev$";
}

console.log('Debug Mode: ' + debug)
console.log('Developer Mode: ' + dev)

const cmds = fs.readdirSync(`./ingame-commands`).filter(file => file.endsWith('.js'));

console.log('---------- LOADING INGAME COMMANDS ----------')
cmds.forEach(cmd => {
	console.log(`${cmd} loaded.`)
});

var defaultChannel;
var devuser = "mo0nbot";

if (dev) {
	defaultChannel = '802454010400604161';
	devuser = "mo0nbot2";
} else {
	defaultChannel = '795135669868822528';
	devuser = "mo0nbot";
}

var oneInterval = false; // 1 times interval bot 
var oneNotf = false; // thong bao bot reconnect failed 

/* TYPE ALL:
 *  READY: Fire on ready
 *  START_BOT: Call function bot
 *  WINDOW_OPEN: Authencate to the server
 *  LOGIN: Start some functions
 *  STATS_AND_LOG_ALL: Stats user and log all to discord in specific
 *  PLAYERs_JOIN: Count something
 *  PLAYERs_LEFT: Count something
 *  QUEUE_SERVERS_TAB: Log position and set status
 *  MAIN_SERVERS_TAB_STATUS: Set topic channel 
 *  CHAT_BOX_SERVERS: Command and chat log to specific channel
 *  DISCONNECT_SERVERS: Kicked reason
 *  END_CONNECT_TO_SERVERS: End connect to server and reconnect
 *  CHAT_ON_DSICORD: Link chat discord to server
 *  COMMAND_DISCORD: Discord bot commands
 */

/*
 *				READY
 */
client.on('ready', () => {
	console.log('---------- STARTING BOT ----------')
	console.log('Bot online!');

	const eventIngame = fs.readdirSync(`./events-ingame`).filter(file => file.endsWith('.js'));

	console.log('---------- LOADING EVENTS INGAME COMMANDS ----------')
	eventIngame.forEach(events => {
		console.log(`${events} loaded.`)
	})
	createBot()
});

var minutess = 0;
var hourss = 0;
var totalSecondss = 0;

/*
 *				START_BOT
 */
function createBot() {
	console.log('---------- LOADING BOT ----------')
	const bot = mineflayer.createBot({
		host: config.ip,
		port: 25565,
		username: devuser,
		version: "1.16.5"
	});

	var color = "0x979797";

	var lobby = true;

    bot.loadPlugin(tpsPlugin)
	bot.loadPlugin(pathfinder)

	var disconnectRequest = false;
	var joined = false;

	/*
	 *						STATS_AND_LOG_ALL
	 */
	const DeathftNotifyEvent = require(`./events-ingame/death-notify.js`);
	const joinedEvent = require(`./events-ingame/join.js`);
	const leftEvent = require(`./events-ingame/left.js`);
	const queueEvent = require(`./events-ingame/queue-tab.js`);
	const mainEvent = require(`./events-ingame/main-tab.js`);
	const restartEvent = require(`./events-ingame/restart-notify.js`);
	const ServerStatusEvent = require(`./events-ingame/status-tab.js`);
	const verifyEvent = require('./events-ingame/verify.js');
	const playtimeEvent = require('./events-ingame/playtime.js');
	const JoinedServerEvent = require('./events-ingame/login.js');
	const kickedEvent = require('./events-ingame/kicked.js');
	const endedEvent = require('./events-ingame/ended.js');

	bot.debug = debug;
	
	bot.dev = dev;
	bot.client = client;
	bot.Scriptdb = Scriptdb;
	bot.defaultChannel = defaultChannel;
	bot.Discord = Discord;
	bot.color = color;
	bot.api = api;
	bot.fs = fs;
	bot.waitUntil = waitUntil;
	bot.prefix = prefix;

	bot.cmds = cmds;

	bot.lobby = lobby;

	bot.minutess = minutess;
	bot.hourss = hourss;
	bot.totalSecondss = totalSecondss;

	bot.joined = joined;
	bot.oneInterval = oneInterval;

	// Join
	var countPlayers = 0;	
	bot.countPlayers = countPlayers;

	var closeCount = 0;
	bot.closeCount = closeCount;

	bot.oneNotf = oneNotf;
	
	bot.Movements = Movements;
	bot.GoalNear = GoalNear;

	bot.on('windowOpen', verifyEvent.bind(null, bot));

	bot.on('connect', JoinedServerEvent.bind(null, bot, client))
	bot.once('login', playtimeEvent.bind(null, bot))

	bot.on('windowClose', (window) => {
		if(!debug) return;
		console.log(window.title)
		closeCount++;
		console.log(closeCount)
	})

	bot.on('spawn', () => {
		if(debug) {
			setTimeout(() => {
			console.log(lobby)
			}, 20 * 1000)
		}
	})

	/*
	 *					CHAT_BOX_SERVERS
	 */
	 bot.on('message', (msg) => {
		if (!(msg.toString().startsWith("<"))) return;
		var nocheck = msg.toString().split(' ')[0];
		var username1 = nocheck.replace(/</ig, "");
		var username2 = username1.replace(/>/ig, "");
		var username;
		if (username2.startsWith("[2B2T]")) {
			username = username2.replace("[2B2T]", "")
		} else {
			if (username2.startsWith("[Donator]")) {
				username = username2.replace("[Donator]", "");
			} else {
				username = username2;
			}
		}

		var log = msg.toString().replace(username, "");
		var logger;
		if (log.startsWith("<[Donator]")) {
			logger = log.replace("<[Donator]> ", "")
		} else {
			if (log.startsWith("<[2B2T]")) {
				logger = log.replace("<[2B2T]> ", "")
	
			} else {
				logger = log.replace("<> ", "")
			}
		}
	
		if (logger.startsWith(">")) {
			color = "2EA711";
		}
	
		const dauhuyen = logger.replace(/`/ig, "\\`");
		const dausao = dauhuyen.replace(/_/ig, "\\_");
		const s = dausao.replace("||", "\\||");
		const newLogger = s.replace("*", "\\*");
		var newUsername = username;
	
		if(username !== undefined) {
			newUsername = username.replace(/_/ig, "\\_");
		}
		
		if (newLogger === undefined) {
			newLogger = logger;
		}
	
		var bp;
		if (dev) {
			bp = "dev!";
		} else {
			bp = "!";
		}

		// MAIN chat
		var chat = new Discord.MessageEmbed()
						.setDescription(`**<${newUsername}>** ${newLogger}`)
						.setColor(color);
		
		if(chat !== undefined) {
			// var guild = client.guilds.cache.map(guild => guild.id);
			if(!dev) {
				setTimeout(() => {
					// const data = new Scriptdb(`./data/guilds/setup-${guild[2]}.json`);
					// const checkdata = data.get('livechat')
					// if(checkdata == undefined) {
					// 	guild.shift()
					// }
	
					// if(checkdata !== undefined) {
						// setTimeout(() => {
						client.channels.cache.get("816695017858531368").send(chat);
						// client.channels.cache.get(checkdata).send(chat);
						// }, 3 * 1000 )
					// }
				}, 1*100);
			}
			client.channels.cache.get(defaultChannel).send(chat);
			color = "0x797979";
		}
	
		saveMsgsData(username, logger);
		function saveMsgsData(username, logger) {
			if(logger.startsWith(bp)) return;
			let messages = new Scriptdb(`./data/quotes/${username}.json`);
			let msgs = messages.get("messages")
			let times = messages.get("times")
			if(msgs == undefined) {
				messages.set("messages", logger)
				messages.set("times", Date.now())

				if(!debug) return;
				console.log(username + " saved: " + logger + " " + Date.now())
			} else {
				messages.set("messages", logger + " | " + msgs)
				messages.set("times", times + " | " + Date.now())

				if(!debug) return;
				console.log(logger + " " + Date.now())
			}
		}

		if(!logger.startsWith(bp)) return;
		const args = logger.slice(bp.length).split(/ +/);
		const cmdName = args.shift().toLowerCase();
	
		client.commands = new Discord.Collection();
	
		const cmds = require('fs').readdirSync(`./ingame-commands/`).filter(file => file.endsWith('.js'));
		// for(const file of cmds){
			for(const file of cmds){
				const cmd = require(`./ingame-commands/${file}`);
				
				client.commands.set(cmd.name, cmd);
			}
	
		const cmd = client.commands.get(cmdName)
			|| client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(cmdName));

		if(cmdName == "reload") {
			// if(username !== "MoonVN" || username !== "MoonZ" || username !== "MoonOnTop") return bot.whisper(username, "> Không thể sử dụng lệnh này.")
			if(!args[0]) return bot.whisper(username, "> Please type name of commands.")

			const cmd = require(`./ingame-commands/${args[0]}.js`);

			if(!cmd) return bot.whisper(username, "> Command not found.")
			client.commands.delete(args[0])
			client.commands.set(args[0], cmd);
			
			bot.whisper(username, "> reload success " + args[0])
			return;
		}

		if(!cmd) {
			if(!debug) return;
			return console.log(`\`${cmd}\` is not a valid command.`);
		}
	
		bot.regex = /[a-z]|[A-Z]|[0-9]/i;
		bot.Scriptdb = require('script.db');
		bot.api = api;
		bot.superagent = superagent;
		bot.disconnectRequest = disconnectRequest;
	
		setTimeout(() => {
			try {
				cmd.execute(bot, username, args);
			}catch(err){
				console.log(err);
			}
		}, 1* 1000);
	 });

	/*
	 * 			STATS
	 */
	bot.on("message", DeathftNotifyEvent.bind(null, bot, client));

	/*
	 *				PLAYERs_JOIN
	 */
	
	bot.on("playerJoined", joinedEvent.bind(null, bot, client));

	/*
	 *				PLAYERs_LEFT
	 */
	bot.on("playerLeft", leftEvent.bind(null, bot, client));

	/*
	 *					MAIN_SERVERS_TAB_STATUS
	 */
	 bot._client.on("playerlist_header", mainEvent.bind(null, bot, client));


	/*
	 *				QUEUE_SERVERS_TAB
	 */
	bot._client.on("playerlist_header", queueEvent.bind(null, bot, client));

	/**
	 * 					RESTART_NOTIFY
	 */
	 var restarts15m = false;
	 var restarts5m = false;
	 bot.restarts15m = restarts15m;
	 bot.restarts5m = restarts5m;
	bot.on("chat", restartEvent.bind(null, bot, client));

	/*
	 *
	 *					MAIN_SERVERS
	 *  
	 *  
	 */
	bot._client.on("playerlist_header", ServerStatusEvent.bind(null, bot, client));
	
	// bot end with restart
	var isRestarting = false;
	var restartingMsg = false;
	bot.isRestarting = isRestarting;
	bot.restartingMsg = restartingMsg;
	bot.on("chat", restartEvent.bind(null, bot, client));

	/*
	 *				DISCONNECT_SERVERS
	 */
	var unknownReason = true;
	bot.unknownReason = unknownReason;
	bot.on('kicked', kickedEvent.bind(null, bot, client));

	/*
	 *					END_CONNECT_TO_SERVERS
	 */
	bot.on('end', endedEvent.bind(null, bot, client));

	/*
	 *
	 *					CHAT_ON_DSICORD
	 *  
	 * 
	 */
	client.on('message', msg => {
		const args = msg.content.slice("/".length).trim().split(/ +/g);
		const command = args.shift().toLowerCase();

		if (msg.author.bot) return

		if (dev) {
			if (msg.channel.id === "802456011252039680") {
				if (msg.author == client.user) return;
				setTimeout(() => {
					bot.chat(msg.content);
				}, 1 * 1000);
			}
			if (msg.channel.id == '802454010400604161') {
				console.log(msg.content)

				if (msg.content.startsWith(">")) return;
				if (msg.content.startsWith(prefix)) return;

				var content = msg.content;
				
				if(!content) return;
				
				if(command === "w") {
					if((msg.content.startsWith("/"))) {
						var correctContent = content.substr(2, content.length + 1);
						var str = correctContent;
						var chat = str.charAt(0).toUpperCase() + str.substr(3, str.length);

						setTimeout(() => {
							bot.chat(`/r [${msg.author.tag}] ${chat}`);
						}, 1*1000);
					}
				}

				if(command === "r") {
					if((msg.content.startsWith("/"))) {
						var correctContent = content.substr(2, content.length + 1);
						var str = correctContent;
						var chat = str.charAt(0).toUpperCase() + str.substr(1, str.length);

						setTimeout(() => {
							bot.chat(`/r [${msg.author.tag}] ${chat}`);
						}, 1*1000);
					}
				}
				
				var str = msg.content.toString().split('\n')[0];
				var chat= str.charAt(0).toUpperCase() + str.substr(1, str.length);
				
				if(msg.content.startsWith("/")) return;
				if(msg.author.bot) return;
				  
				var u = msg.mentions.members.first();
				var str = chat.split(">")[0].split("<@!")[1]; 
		
				var user = client.users.cache.find(user => user.id === str)
				if(dev) {
					console.log(user)
				}
				
				var chatNew = chat;
				var chatNewNew = chatNew;
				if(u && user !== undefined) {
					try {
					chatNewNew  = chatNew.replace("<@!", "").replace(">", user.tag).replace(str, "")
					} catch(e) {
						console.log(e)
					}
				} else {
					chatNewNew = chatNew;
				}

				if(!chat.endsWith(".")) {
					chatNewNew = chatNewNew + ".";
				}

				setTimeout(() => {
					bot.chat(`『 dev: ${msg.author.tag} 』  ${chatNewNew}`);
				}, 1 * 1000);

				const send = client.emojis.cache.find(emoji => emoji.name === "1505_yes");
				msg.react(send);
			}
			return;
		}
		// trên là dev mode

		if (msg.channel.id === '797426761142632450') {
			if (msg.author == client.user) return;
			setTimeout(() => {
				bot.chat(msg.content);
			}, 1 * 1000);
		}

		if (msg.channel.id == '795135669868822528') {
			if (msg.content.startsWith(">")) return;
			if (msg.content.startsWith(prefix)) return;

			var content = msg.content;
			
			if(!content) return;
			
			if(command === "w") {
				if((msg.content.startsWith("/"))) {
					var correctContent = content.substr(2, content.length + 1);
					var str = correctContent;
					var chat = str.charAt(0).toUpperCase() + str.substr(3, str.length);

					setTimeout(() => {
						bot.chat(`/r [${msg.author.tag}] ${chat}`);
					}, 1*1000);
				}
			}

			if(command === "r") {
				if((msg.content.startsWith("/"))) {
					var correctContent = content.substr(2, content.length + 1);
					var str = correctContent;
					var chat = str.charAt(0).toUpperCase() + str.substr(3, str.length);

					setTimeout(() => {
						bot.chat(`/r [${msg.author.tag}] ${chat}`);
					}, 1*1000);
				}
			}

			var str = msg.content.toString().split('\n')[0];
			var chat= str.charAt(0).toUpperCase() + str.substr(1, str.length);
			
			if(msg.content.startsWith("/")) return;
			if(msg.author.bot) return;
				
			var u = msg.mentions.members.first();
			var log = chat.replace("<@!", "")
			var str = log.split(">")[0].split(" ")[1]; // get id
	
			var user = client.users.cache.find(user => user.id === str)

			var chatNew = chat;
			var chatNewNew = chatNew;
			if(u) {
				chatNewNew  = chatNew.replace("<@!", "").replace(">", user.tag).replace(str, "")
			}

			if(!chat.endsWith(".")) {
				chatNewNew = chatNewNew + ".";
			}

			setTimeout(() => {
				bot.chat(`> 『 ${msg.author.tag} 』  ${chatNewNew}`);
			}, 1 * 1000);

			const send = client.emojis.cache.find(emoji => emoji.name === "1505_yes");
			msg.react(send);
		}
	});
}

module.exports = { createBot };

/*
*
*				COMMAND_DISCORD
*  
* 
*/
client.commandss = new Discord.Collection();

const cmdss = fs.readdirSync(`./commands`).filter(file => file.endsWith('.js'));
for (const file of cmdss) {
	const cmd = require(`./commands/${file}`);

	client.commandss.set(cmd.name, cmd);
}

console.log('---------- LOADING DISCORD COMMANDS ----------')
cmdss.forEach(cmd => {
	console.log(`${cmd} loaded.`)
})

client.on("message", async message => {
    if(message.author.bot|| !message.content.startsWith(prefix) || message.author == client.user) return;

    const args = message.content.slice(prefix.length).split(/ +/);
    const cmdName = args.shift().toLowerCase();

    const cmd = client.commandss.get(cmdName)
        || client.commandss.find(cmd => cmd.aliases && cmd.aliases.includes(cmdName));

    if(!cmd) return console.log(`\`${cmd}\` is not a valid command.`);
	
	client.userNotFound = new Discord.MessageEmbed()
					.setDescription('Không tìm thấy người chơi.')
					.setColor('0xC51515');
	
	client.Discord = Discord;
	client.Scriptdb = Scriptdb;
	client.api = api;
	client.footer = footer;

    try{
        cmd.execute(client, message, args);
    }catch(err) {
        console.log(err);
    }

	// const args = message.content.slice(prefix.length).trim().split(/ +/g);
	// const command = args.shift().toLowerCase();

	// if (!message.content.startsWith(prefix) || message.author == client.user) return;
	// client.guilds.cache.map(guild => guild.id)

	// if(message.channel.id !== )
	// if (message.channel.id !== "795147809850130514" && message.author.id !== "425599739837284362") return;

	/*
	if(command === "setup") {
		if(!dev) return;

		if(!args[0]) return message.channel.send("Cách dùng: " + prefix + "setup chat <tag hoặc nhập id kênh>");
		
		if(!args[1]) return message.channel.send("Cách dùng: " + prefix + "setup <chat hoặc commands> <tag hoặc nhập id kênh>");

		if(args[0] === "chat") {
			// if(!args[2]) return message.channel.send("Cách dùng: " + prefix + "setup chat <tag hoặc nhập id kênh>");
			var channel;
			channel = message.content.replace(/\D/g,'');
			if(channel === "") {
				// message.channel.send("Bạn đã setup channel: " + args[2])
				channel = args[2];
			}

			var guild = client.guilds.cache.map(guild => guild.id);
			const data = new Scriptdb(`./data/guilds/setup-${guild}.json`);
			const checkdata = data.get('livechat')
			
			if(checkdata == undefined) {
				data.set('livechat', +channel); // nó sẽ ra 2 loại, 1 là id, 2 là tên channel đã setup
				if(channel !== "NaN") {
					message.channel.send("Bạn đã setup chat tại channel: " + channel.toString())
				} else {
					message.channel.send("Bạn đã setup chat tại channel: " + channel)
				}
			} else {
				return message.channel.send("Đã setup ròi. Cách xoá: " + prefix + "setup delete <chat hoặc stats, đã setup> <tag hoặc nhập kênh>")
			}
			
		}
	} */
});

client.login(config.token).catch(err => console.log(err));
client.on("error", (e) => { console.error(e) });