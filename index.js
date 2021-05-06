const Discord = require("discord.js");
const client = new Discord.Client();

var Scriptdb = require("script.db")
var mineflayer = require('mineflayer') // bot minecraft
var tpsPlugin = require('mineflayer-tps')(mineflayer) // mineflayer plugin

var fs = require('fs');

const pathfinder = require('mineflayer-pathfinder').pathfinder
const footer = "moonbot 2021";
client.footer = footer;

var prefix = "$";
client.prefix = prefix;

require('dotenv').config();

const config = {
	token: process.env.TOKEN,
	ip: process.env.IP
};

var dev = true;

if (dev) {
	prefix = "dev$";
}

console.log('Developer Mode: ' + dev)

var defaultChannel;
var devuser = "mo0nbot";

if (dev) {
	defaultChannel = '802454010400604161';
	devuser = "mo0nbot2";
} else {
	defaultChannel = '795135669868822528';
	devuser = "mo0nbot";
}

var abc = require("./api")
var api = new abc();

/*
 *				READY
 */
client.on('ready', () => {
	console.log('---------- STARTING BOT ----------')
	console.log('Bot online!');

	if(!dev) {
		client.channels.cache.get('837220776284389438').send("Bot đã sẵn sàng");
	}
	
	api.start();

	client.user.setActivity("RESTARTING", { type: 'PLAYING' });
	
    console.log(`Ready to serve in ${client.channels.cache.size} channels on ${client.guilds.cache.size} servers, for a total of ${client.users.cache.size} users.`);
	
	createBot();
});

/*
 *				START_BOT
 */
function createBot() {
	console.log('---------- LOADING BOT ----------')
	const bot = mineflayer.createBot({
		host: config.ip,
		port: 25565,
		username: devuser,
		version: "1.16.4"
	});

    bot.loadPlugin(tpsPlugin);
	bot.loadPlugin(pathfinder);

	const DeathftNotifyEvent = require(`./events-ingame/death-notify.js`);
	const joinedEvent = require(`./events-ingame/join.js`);
	const leftEvent = require(`./events-ingame/left.js`);
	const queueEvent = require(`./events-ingame/queue-tab.js`);
	const mainEvent = require(`./events-ingame/main-tab.js`);
	const ServerStatusEvent = require(`./events-ingame/status-tab.js`);
	const verifyEvent = require('./events-ingame/verify.js');
	const playtimeEvent = require('./events-ingame/playtime.js');
	const JoinedServerEvent = require('./events-ingame/login.js');
	const kickedEvent = require('./events-ingame/kicked.js');
	const endedEvent = require('./events-ingame/ended.js');

	var color = "0x979797";
	var color2 = "0x979797";
	var lobby = true;

	// New
	var joined = false;
	var restartingMsg = false; // Tin nhắn restart, cho status bot
	var countPlayers = 0;
	var verified = false;

	// Uptimes
	var totalSeconds = 0;
	var hours = 0;
	var minutes = 0;

	// Import
	bot.restartingMsg = restartingMsg;
	bot.defaultChannel = defaultChannel; // Kenh mat dinh cua chat
	bot.dev = dev; // developer mode
	bot.lobby = lobby;
	bot.joined = joined;
	bot.countPlayers = countPlayers;
	bot.verified = verified; // check verify before disconnect

	bot.totalSeconds = totalSeconds;
	bot.hours = hours;
	bot.minutes = minutes;

	bot._client.on('error',err => console.log(err))

	bot.on('windowOpen', verifyEvent.bind(null, bot))

	bot.once('login', JoinedServerEvent.bind(null, bot, client))
	bot.once('login', playtimeEvent.bind(null, bot))

	bot.on('message', msg => {
		if (!(msg.toString().startsWith("<"))) return;

		var username = msg.toString().split(" ")[0].split("<")[1].split(">")[0];

		if(username.startsWith("[")) {
			username = username.split("]")[1]
		}

		logger = msg.toString().substr(msg.toString().split(" ")[0].length + 1);

		if (logger.startsWith(">")) {
			color2 = "2EA711";
		}
	
		const dauhuyen = logger.replace(/`/ig, "\\`");
		const dausao = dauhuyen.replace(/_/ig, "\\_");
		const s = dausao.replace("||", "\\||");
		const newLogger = s.replace("*", "\\*");

		var newUsername = username.replace(/_/ig, "\\_");
	
		var bp;
		if (dev) {
			bp = "!!";
		} else {
			bp = "!";
		}

		
		if (username === "Ha_My" || username == "PhanThiHaMy" || username == "_Mie_Cutee_") {
			if(bot.dev) return;
			client.channels.cache.get("839115042405482576").send("**<" + username + ">** " + logger);
		}
		
		var chat2 = new Discord.MessageEmbed()
						.setDescription(`**<${newUsername}>** ${newLogger}`)
						.setColor(color2);

		setTimeout(() => {
			var guild = client.guilds.cache.map(guild => guild.id);
			setInterval(() => {
				if (guild[0]) {
					const line = guild.pop()
					const data = new Scriptdb(`./data/guilds/setup-${line}.json`);
					const checkdata = data.get('livechat');

					if(checkdata == undefined || guild == undefined) return;
					
					if(logger.startsWith(">")) {
						color = "2EA711";
					}

					var chat = new Discord.MessageEmbed()
								.setDescription(`**<${newUsername}>** ${newLogger}`)
								.setColor(color);

					try {
						if(dev) return;
						if(chat == undefined) return;

						client.channels.cache.get(checkdata).send(chat)
						color = "0x797979";
					} catch(e) {}
				}
			}, 100);
		}, 100)

		if(chat2 !== undefined) {
			client.channels.cache.get(defaultChannel).send(chat2);
			color2 = "0x797979";
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


		if(!cmd) return;
	
		bot.regex = /[a-z]|[A-Z]|[0-9]/i;
	
		setTimeout(() => {
			try {
				cmd.execute(bot, username, args);
			}catch(err){
				console.log(err);
			}
		}, 1* 1000);
	});

	bot.on("message", DeathftNotifyEvent.bind(null, bot, client));
	bot.on("playerJoined", joinedEvent.bind(null, bot, client));
	bot.on("playerLeft", leftEvent.bind(null, bot, client));
	bot._client.on("playerlist_header", ServerStatusEvent.bind(null, bot, client));
	bot._client.on("playerlist_header", mainEvent.bind(null, bot, client));
	bot._client.on("playerlist_header", queueEvent.bind(null, bot, client));

	bot.on('kicked', kickedEvent.bind(null, bot, client));
	bot.on('end', endedEvent.bind(null, bot, client));
	bot.on('error', err => { console.log(err)})

	client.on('message', msg => {
		if (msg.author.bot) return;

		if(msg.content == prefix + "restart") {
			client.once('message', m => {
				if(m.author.id == "425599739837284362") {
					client.channels.cache.get('837220776284389438').send("Tiến hành khởi động lại..");
					
					setTimeout(() => { 
						bot.quit();
					}, 2 * 1000)
					setTimeout(() => {
						process.exit();
					}, 5 * 1000)
				}
			})
		}


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

		if(dev) return;

		if (msg.channel.id == defaultChannel) {
			if (msg.content.startsWith(">")) return;
			if (msg.content.startsWith(prefix)) return;

			var content = msg.content;
			
			if(!content) return;

			var str = msg.content.toString().split('\n')[0];
			var chat = str.charAt(0).toUpperCase() + str.substr(1);
			
			if(msg.content.startsWith("/")) return;
			if(msg.author.bot) return;

			var chatnew = chat;
			if(!chatnew.endsWith(".")) {
				chatnew = chatnew + ".";
			}

			setTimeout(() => {
				bot.chat(`> [${msg.author.tag}]  ${chatnew}`);
			}, 1 * 1000);

			const send = client.emojis.cache.find(emoji => emoji.name === "1505_yes");
			msg.react(send);
		}
	});
}

module.exports = { createBot };

/*
*				COMMAND_DISCORD
*/
client.commandss = new Discord.Collection();

const cmdss = fs.readdirSync(`./commands`).filter(file => file.endsWith('.js'));
for (const file of cmdss) {
	const cmd = require(`./commands/${file}`);

	client.commandss.set(cmd.name, cmd);
}

client.on("message", async message => {
	if(message.author.bot|| !message.content.startsWith(prefix) || message.author == client.user || message.channel.type == "dm") return;

    const args = message.content.slice(prefix.length).split(/ +/);
    const cmdName = args.shift().toLowerCase();

    const cmd = client.commandss.get(cmdName)
        || client.commandss.find(cmd => cmd.aliases && cmd.aliases.includes(cmdName));

	if(cmdName == "reload") {
		var noPerm = new Discord.MessageEmbed()
							.setDescription('Bạn phải là developer để sử dụng lệnh này.')
							.setColor('0xC51515');

		if(message.author.id !== "425599739837284362")
			return message.channel.send(noPerm).then(msg => {
				msg.delete({ timeout: 10000 });
			});

			delete require.cache[require.resolve(`./commands/${args[0]}.js`)];

		const cmd = require(`./commands/${args[0]}`);
		client.commandss.set(cmd.name, cmd);
		

		var successful = new Discord.MessageEmbed()
							.setDescription(`Đã tải lại command ${args[0]}.`)
							.setColor(0x2EA711);

		message.channel.send(successful)
	}

    if(!cmd) return;
	
	client.userNotFound = new Discord.MessageEmbed()
					.setDescription('Không tìm thấy người chơi.')
					.setColor('0xC51515');
	
	client.footer = footer;
	client.dev = dev;
	client.color = "0x000DFF";
	client.prefix = prefix;

    try{
        cmd.execute(client, message, args);
    }catch(err) {
        console.log(err);
    }
});

client.login(config.token).catch(err => console.log(err));
client.on("error", (e) => { console.error(e) });
