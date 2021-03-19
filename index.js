const Discord = require("discord.js");
const client = new Discord.Client();

require('dotenv').config();

const config = {
	token: process.env.TOKEN,
	ip: process.env.ip
};

var delay = require('delay')

const superagent = require("superagent")
var waitUntil = require('wait-until')

var mineflayer = require('mineflayer')
var tpsPlugin = require('mineflayer-tps')(mineflayer)

const footer = "moonbot 2021";
var prefix = "$";

var fs = require('fs')
const Scriptdb = require('script.db');

var newAPI = require('./api');
var  api = new newAPI()

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
 *
 *				READY
 *  
 * 
 */
client.on('ready', () => {
	console.log('Bot online!');

	createBot()
});

/*
*
*				START_BOT
*  
* 
*/
function createBot() {
	const bot = mineflayer.createBot({
		host: config.ip,
		port: 25565,
		username: devuser,
		version: "1.12.2"
	});

	var color = "0x979797"; // color embed

	var lobby = true; // check if bot in lobby or else

    bot.loadPlugin(tpsPlugin)

	// uptime bot on server
	var minutess = 0;
	var hourss = 0;
	var totalSecondss = 0;
	function setTime2() {
		totalSecondss += 300;
		hourss = parseInt(totalSecondss / 3600)
		minutess = parseInt((totalSecondss - (hourss * 3600)) / 60);
	}

	/*
	 *
	 *					WINDOW_OPEN
	 *  
	 * 
	 */
	var isOpen = false;
	var isOpenCount = 0;
	bot.on('windowOpen', () => { // slot button mode cb
		isOpen = true;
		isOpenCount++;

		delay(10000)
		bot.clickWindow(4, 0, 0)
		delay(1000)
		bot.clickWindow(3, 0, 0)
		delay(1000)
		bot.clickWindow(7, 0, 0)
		delay(1000)
		bot.clickWindow(1, 0, 0)
	});

	/*
	 *
	 *					LOGIN
	 *  
	 * 
	 */
	var disconnectRequest = false;
	var sending = false;
	var stats = false;
	bot.on('login', () => {
		// uptime method
		totalSeconds = 0;
		totalSecondss = 0;
		setInterval(setTime2, 5 * 60 * 1000);
		
		const uptime = new Scriptdb(`./data.json`);
		let ut = uptime.get('uptime');

		if(ut === undefined) {
			var d = new Date();
			var time = d.getTime();
			uptime.set(`uptime`, time);
		} else {
			var d = new Date();
			var time = d.getTime();
			uptime.delete(`uptime`)
			uptime.set(`uptime`, time);
		}

		disconnectRequest = false;
		setInterval(() => {
			if(lobby) return;
			if (stats) return;
			stats = true;
			bot.swingArm("left");
			bot.look(Math.floor(Math.random() * Math.floor("360")), 0, true, null);
			antiAFK();
		}, 1 * 60 * 1000);

		function antiAFK() {
			setTimeout(() => {
				stats = false;
			}, 10 * 1000);
		}

		setInterval(() => {
			fs.readFile("ads.txt", 'utf8', function (err, data) {
				if (err) throw err;
				const lines = data.split('\n');
				var random = lines[Math.floor(Math.random() * lines.length)];

				if (sending) return;
				sending = true;
				bot.chat(random);
			});

			setTimeout(() => {
				sending = false;
			}, 1 * 60 * 1000);
		},  10 * 60 * 1000);

		// Playtime
		setInterval(() => {
			if (lobby) return;
			Object.values(bot.players).forEach(player => addPlayTime(player.username));
			
			function addPlayTime(player) {
				let pt = new Scriptdb(`./data/playtime/${player}.json`);
				let playtime = pt.get('time')

				if (playtime === undefined) {
					pt.set('time', 10000);
				} else {
					pt.set('time', playtime + 10000);
				}
			}
		}, 10 * 1000); // dcm

		const queuejoined = new Discord.MessageEmbed()
			.setDescription(`Bot đang vào server..`)
			.setColor(0x15ff00); // xanh lam


		const joined = new Discord.MessageEmbed()
			.setDescription(`☘️ Bot đã tham gia vào server. ☘️`)
			.setColor(0x15ff00); // xanh lam

		if(dev) {
			client.channels.cache.get(defaultChannel).send(joined);
			client.channels.cache.get("807045720699830273").send(queuejoined);
		} else {
			client.channels.cache.get(defaultChannel).send(joined).then(() => {
				client.channels.cache.get("816695017858531368").send(joined)
			});
			client.channels.cache.get("806881615623880704").send(queuejoined)
		}

	});

	/*
	 *
	 *						STATS_AND_LOG_ALL
	 *  
	 * 
	 */
	bot.on('message', message => {
		var newcolor = 'DB2D2D';
		var logger = message.toString();

		var nocheck = message.toString().split(' ')[0]; // check username with format <>
		// return message on chat
		if (nocheck.startsWith('<') && nocheck.endsWith(">")) return;
		var loggg = new Discord.MessageEmbed()
						.setDescription(logger);
						
		if(!dev) {
			client.channels.cache.get("797426761142632450").send(loggg);
		} else {
			client.channels.cache.get("802456011252039680").send(loggg);	
		}

		// auto disconnect 
		setTimeout(() => {
			if(lobby) {
				bot.quit()
				disconnectRequest = true;
			}
		}, 2 * 60  * 1000)		
		
		var notfMsg;
		var colorNotf;
		
		var splitLogger2 = logger.split(' ')[1];
		if(splitLogger2 == "nhắn:") {
			var firststr = logger.split(' ');
			var newlog = logger;
			var log = logger.split(' ')[0];
			if(firststr.toString().startsWith("[Donator]")) {
				var rl = log.toString().replace(/\[Donator\]/ig, "")
				newlog = rl + logger.substr(log.toString().length, logger.length + 2);
			} else {
				newlog = log + logger.substr(log.toString().length, logger.length + 2);
			}
			var cancelOne = newlog.replace(/_/ig, "\_")
			var cancelTwo = cancelOne.replace(/`/ig, "\`")
			var n = cancelTwo.replace("||", "\*")
			var lognoformat = n.replace("*", "\*")

			if(lognoformat === undefined) {
				logformat = newlog;
			}

			notfMsg = lognoformat;
			colorNotf = "0xFD00FF";
		}

		if (logger.startsWith("nhắn cho")) { // check bot send message			
			var type = logger.split(" ")[2]; // []
			var log; // logger

			if(type.startsWith("[Donator]")) {
				log = "nhắn cho " + type.replace(/\[Donator\]/ig, "") + " " + logger.substr(8 + type.length + 2, logger.length + 2);
			} else {
				log = logger;
			}
			if(type == "[2B2T]") {
				log = "nhắn cho " + type.replace(/\[2B2T\]/ig, "") + " " + logger.substr(8 + type.length + 2, logger.length + 2);
			}
			
			var cancelOne = log.replace(/_/ig, "\_")
			var cancelTwo = cancelOne.replace(/`/ig, "\`")
			var cancelThree = cancelTwo.replace("*", "\*")
			var lognoformat = cancelThree;
			if(lognoformat !== undefined) {
				notfMsg = lognoformat;
			}
			colorNotf = "0xFD00FF";
		}

		if(logger == "2y2c đã full") {
			setTimeout(() => {
				colorNotf = '0xb60000';
				notfMsg = logger;
			}, 3*1000);
		}

		if (logger == "Đang vào 2y2c"
		|| logger.startsWith("[Server]")
		|| logger.startsWith("Bad commands")
		|| logger.startsWith("2y2c:")
		|| logger.startsWith("[Broadcast]")
		|| logger === "Donate để duy trì server admin đang đói chết con *ĩ *ẹ."
		|| logger === " diễn đàn của server https://www.reddit.com/r/2y2c/."
		|| logger === "server thường back up vào 1h sáng nên tps đsẽ tụt vào khoảng thời gian này."
		|| logger == "The main server is down. We will be back soon!"
		|| logger == "Vote cho server tại https://minecraft-mp.com/server-s271071.") {
			colorNotf = '0xb60000';
			notfMsg = logger;
		}

		if(logger.startsWith("Kicked whilst connecting to")) {
			bot.quit("re")
			disconnectRequest = true;
			notfMsg = logger;
			colorNotf = '0xb60000';
		}

		if(logger === "Exception Connecting:ReadTimeoutException : null") {
			bot.quit("re")
			disconnectRequest = true;
			notfMsg = logger;
			colorNotf = '0xb60000';
		}

		// return error message
		if (notfMsg !== undefined) {
			var strn = notfMsg.replace(/\*/ig, "\\*")
			var str = strn.replace(/`/ig, "\\`")
			const s = str.replace("||", "\\||");
			var notf = s.replace(/_/ig, "\\_")

			var embedNotf = new Discord.MessageEmbed()
				.setDescription(notf)
				.setColor(colorNotf);

			if(embedNotf !== undefined) {
				setTimeout(() => {
					client.channels.cache.get("816695017858531368").send(embedNotf);
				}, 1*100);

				client.channels.cache.get(defaultChannel).send(embedNotf);
			}
		}

		// value to embed
		var deathMsg;

		// return essentials message with valid str
		if(logger.startsWith("[") && logger.includes(" -> me]")) return;

		// return messages
		if(logger.startsWith("nhắn cho")) return;
		if(splitLogger2 == "nhắn:") return;

		if (logger === '2y2c đã full') return;
		if (logger === 'Đang vào 2y2c') return;
		if (logger === undefined) return; // return if msg is undefined
		if (logger === null) return; // return if null msg

		if (logger === "Donate để duy trì server admin đang đói chết con *ĩ *ẹ." || logger.startsWith("[Server]")
				|| logger.startsWith("[Broadcast]")) return;

		if(logger.includes("Wither") || logger.includes("cá") || logger.includes("Zombie") || logger.includes("Magma Cube") || logger.includes("Ghast")
			|| user == "Enderman" || logger.includes("Wither")) {
				deathMsg = logger;
		} else {
			if (logger.includes('chết cháy khi đánh với')) {
				var str = logger;
				var user = str.split(" ")[6];
				
				saveKills(user)
				deathMsg = logger;
			}

			if (logger.includes('bị bắn bởi')) {
				var str = logger;
				var user = str.split(" ")[4];

				saveKills(user)
				deathMsg = logger;
			}

			if (logger.includes('đã bị đấm chết con mẹ nó bởi')) { // valid
				var str = logger;
				var user = str.split(" ")[9];

				saveKills(user)
				deathMsg = logger;
			}
			
			if (logger.includes('bị phản sát thương khi đánh')) {
				var str = logger;
				var user = str.split(" ")[7];
				
				saveKills(user)
				deathMsg = logger;
				
			}

			if (logger.includes('bị giết bởi') && !(logger.includes("một đám"))) {
				var str = logger;
				var user = str.split(" ")[4];

				saveKills(user)
				deathMsg = logger;
				
			}

			if (logger.includes('khô máu với')) {
				var str = logger;
				var user = str.split(" ")[4];

				saveKills(user)
				deathMsg = logger;
			}

		

			if (logger.includes('bị') && logger.includes("đẩy té mẹ ra khỏi game") || logger.includes("đá xuống lava")) {
				var str = logger;
				var user = str.split(" ")[2];
				
				saveKills(user)
				deathMsg = logger;

			}

			if (logger.includes('bị hội đồng bởi một đám')) {
				var str = logger;
				var user = str.split(" ")[7];
				var newUser = user;
				if(user.includes("'s")) {
					newUser = user.replace("'s", "")
				}
				saveKills(newUser)
				deathMsg = logger;
			}

			if (logger.includes('bị bởi một đám')) {
				var str = logger;
				var user = str.split(" ")[5];
				var newUser = user;
				if(user.includes("'s")) {
					newUser = user.replace("'s", "")
				}
				saveKills(newUser)
				deathMsg = logger;
			}

			if (logger.includes('giết') && logger.includes("bằng")) {
				var str = logger;
				var user = str.split(" ")[2];
				var killer = str.split(" ")[1];

				saveKills(killer)
				saveDead(user)
				deathMsg = logger;
			}

			// listening death message
			if (logger.includes('Té')
			|| logger.includes('té')
			|| logger.includes('trèo')
			|| logger.includes('chợt')
			|| logger.includes('đã')
			|| logger.includes('đéo')
			|| logger.includes('bị')
			|| logger.includes('chạy')
			|| logger.includes('nổ')
			|| logger.includes('đấm')
			|| logger.includes('nhảy')
			|| logger.includes('cháy')
			|| logger.includes('tự')
			|| logger.includes('died')
			|| logger.includes('chết')
			|| logger.includes('Chết')
			|| logger.includes('khô')
			|| logger.includes('đi')
			|| logger.includes('chạy')
			|| logger.includes('không')
			|| logger.includes('thế')
			|| logger.includes('was')
			|| logger.includes('tập')
			|| logger.includes('đập')
			|| logger.includes('bóp')
			|| logger.includes('đang')
			|| logger.includes('cứ')
			|| logger.includes('tưởng')) {
				var user = logger.split(" ")[0];

				saveDead(user)
				deathMsg = logger;
			}

			function saveDead(name) {
				const kd = new Scriptdb(`./data/kd/${name}.json`);
				var dead = kd.get('deaths');
				
				if(dead == undefined) {
					kd.set('deaths', 1);
				} else {
					kd.set('deaths', +dead + 1);
				}
			}

			function saveKills(name) {
				const kd = new Scriptdb(`./data/kd/${name}.json`);
				var kill = kd.get('kills');
				
				if(kill == undefined) {
					kd.set('kills', 1);
				} else {
					kd.set('kills', +kill + 1);
				}
			}
		}

		// return error message
		if (deathMsg === undefined) return;

		var strn = deathMsg.replace("*", "\\*")
		var str = strn.replace(/`/ig, "\\`")
		var newDeathMsg = str.replace(/_/ig, "\\_")

		if (newDeathMsg === undefined) {
			newDeathMsg = deathMsg;
		}

		var embedDeath = new Discord.MessageEmbed()
			.setDescription(newDeathMsg)
			.setColor(newcolor);

		setTimeout(() => {
			client.channels.cache.get("816695017858531368").send(embedDeath);
		}, 1*100);
		client.channels.cache.get(defaultChannel).send(embedDeath);
	})

	/*
	 *
	 *				PLAYERs_JOIN
	 *  
	 * 
	 */
	var botJoinCount = 0;	
	bot.on("playerJoined", (p) => {
		var username = p.username;
		var newUsername = username.replace(/_/ig, "\\_");

		var today = new Date()
		let day = ("00" + today.getDate()).slice(-2)
		let month = ("00" + (today.getMonth() + 1)).slice(-2)
		let years = ("00" + today.getFullYear()).slice(-2)
		let hours = ("00" + today.getHours()).slice(-2)
		let min = ("00" + today.getMinutes()).slice(-2)
		var date = day + '.' + month + '.' + years + ' ' + hours + ':' + min;

		const fj = new Scriptdb(`./data/joindate/${username}.json`);
		let firstjoin = fj.get('date');
		if (firstjoin === undefined) {
			fj.set(`date`, date)
		}

		if (username === "Ha_My" || username === "PhanThiHaMy") {
			if(dev) return;
			client.channels.cache.get("807048523027578890").send(username + " joined");
		}

		// return spam join message
		if(username == bot.username) {
			botJoinCount++;
		}
		
		var d = new Date();
		var time = d.getTime();
		let lastseen = new Scriptdb(`./data/seen/${username}.json`);
		var ls = lastseen.get('seen')

		if (ls === undefined) {
			lastseen.set('seen', time);
		} else {
			lastseen.set('seen', time);
		}

		// console.log(botJoinCount)
		if(isOpenCount < 2) {
			if(botJoinCount <= 3) {
				
				// botJoinCount = 4;
				return;
			}
		} else{
			if(botJoinCount <= 2) {

				// botJoinCount = 4;
				return;
			}
		}

		setTimeout(() => {
			if(botJoinCount == 2) {
				disconnectRequest = true;
				bot.quit();
			}
		}, 2*60*1000);

		if(botJoinCount > 3) {
			botJoinCount = 4;
		}
		// botJoinCount = 0;

		if(username == bot.username) return; // return bot join message

		if(username === "HomelessBaseBot") {
			setTimeout(() => {
				bot.chat("> HomelessBaseBot đã tham gia vào server!!")
			}, 1*1000)
		}

		if(username === "Tlaucherbot") {
			setTimeout(() => {
				bot.chat("> Tlaucherbot đã tham gia vào server!!")
			}, 1*1000)
		}

		if (newUsername === undefined) {
			newUsername = username;
		}

		fs.readFile("special-join.txt", 'utf8', function (err, data) {
			if (err) throw err;
			if(username.includes(data.split('\n'))) {
				if(dev) return;
				var embed = new Discord.MessageEmbed()
					.setDescription(newUsername + " joined")
					.setColor('0xb60000')

				client.channels.cache.get("807506107840856064").send(embed); // special channel
			}
		});
		
		
		var embed = new Discord.MessageEmbed()
			.setDescription(newUsername + " joined")
			.setColor('0xb60000');	

		client.channels.cache.get(defaultChannel).send(embed).then(() => {
			client.channels.cache.get("816695017858531368").send(embed)
		});
	});
	
	/*
	 *
	 *				PLAYERs_LEFT
	 *  
	 * 
	 */
	bot.on("playerLeft", (player) => {
		var username = player.username;
		var newUsername = username.replace(/_/ig, "\\_");

		if (username === "Ha_My" || username === "PhanThiHaMy") {
			if(dev) return;
			client.channels.cache.get("807048523027578890").send(username + " left");
		}

		if (newUsername === undefined) {
			newUsername = username;
		}

		fs.readFile("special-join.txt", 'utf8', function (err, data) {
			if (err) throw err;
			if(username.includes(data.split('\n'))) {
				if(dev) return;
				var embed = new Discord.MessageEmbed()
					.setDescription(newUsername + " left")
					.setColor('0xb60000')

				client.channels.cache.get("807506107840856064").send(embed); // special channel
			}
		});

		if(isOpenCount < 2) {
			if(botJoinCount <= 3) {
				
				// botJoinCount = 4;
				return;
			}
		} else{
			if(botJoinCount <= 2) {

				// botJoinCount = 4;
				return;
			}
		}

		var embed = new Discord.MessageEmbed()
							.setDescription(newUsername + " left")
							.setColor('0xb60000')

		client.channels.cache.get(defaultChannel).send(embed).then(() => {
			client.channels.cache.get("816695017858531368").send(embed)
		});
	});

	/*
	 *
	 *				QUEUE_SERVERS_TAB
	 *  
	 * 
	 */
	var ontab = false;
	bot._client.on("playerlist_header", data => {
		if(!lobby) return;
		setTimeout(() => {
			if (ontab) return;
			ontab = true;
			setTimeout(() => {
				ontab = false;
			}, 20 * 1000);
			var header = data.header;
			
			// sửa lỗi
			if(header.includes("2YOUNG")) {
				lobby = false;
				return;
			}

			var s1 = header.replace(/\\n/ig, " ");
			var s2 = s1.replace(/ 2y2c  2y2c §bđã full /ig, "");
			var s3 = s2.replace(/§b|§l|§6/ig, "");
			var s4 = s3.replace(/{"text":"/ig, "");
			var s5 = s4.replace(/"}/ig, "");
			var s6 = s5.replace("thời", " - Thời");
			var s7 = s6.replace("vị", "Vị");
			var getCurrentQueue = s7.replace("Vị trí của bạn: ", "");
			var currentQueue = getCurrentQueue.split(' ')[0];

			if(currentQueue == "None") return;
			if (s7 === undefined) return;

			// ping to set topic with tps
			stt.ping({ "host": config.ip }, (err, result) => {
				if (result) {
					try {
						var players = [];
						for (i = 0; result.players.sample.length > i; i++) {
							players.push(result.players.sample[i].name);
						}
						var players2 = players.splice(0, Math.ceil(players.length / 2));
						if (players == []) {
							players.push(players2);
							players2 = ".";
						}
					} catch {
						var players = 'unknown';
						var players2 = 'unknown';
					}

					var oldold = players.toString().replace(",§6Cựu binh: §l0", "");
					var old = oldold.toString().replace(",§6Cựu binh: §l1", "");
					var queue = old.toString().replace("§6Bình thường: §l", "");

					var prio = players2.toString().replace("2y2c §6Queue Size,§6Ưu Tiên: §l", "");

					var q = currentQueue + "/" + queue;
					

					var status = "Trong hàng chờ: " + q + " - Chờ: " + queue;

					if(status === undefined) return;
						client.user.setActivity(status, { type: 'PLAYING' });
				}
			});

			var embed = new Discord.MessageEmbed()
								.setDescription(s7)
								.setColor("0xFFCE00");
				
			// if (!lobby) return;
			if(embed == undefined) return;
			client.channels.cache.get(defaultChannel).send(embed).then(() => {
				client.channels.cache.get("816695017858531368").send(embed)
			});
			
		}, 5 * 1000);
	});

	/*
	 *
	 *					MAIN_SERVERS_TAB_STATUS
	 *  
	 * 
	 */
	var statusbot = false;
	bot._client.on("playerlist_header", data => {
		if(lobby) return;
		setTimeout(() => {
			if (statusbot) return;
			statusbot = true;

			var footer = data.footer;
			var ss1 = footer.replace(/\\n/ig, " ");
			var ss2 = ss1.replace(/-/ig, "");
			var ss3 = ss2.replace(/§c|§e|§3|§d|§a|§r/ig, "");
			var ss4 = ss3.replace(/{"text":"/ig, "")

			// replace all space to none
			var ss5 = ss4.replace("    ", " ")
			var ss6 = ss5.replace("    ", " ")
			var tps = ss6.split(" ")[1];
			if (tps === undefined || tps === "§6Donate" || tps === "§6bạn") {
				tps = 0;
			}

			var status = "TPS: " + tps + " - Chờ: " + api.getQueue() + " - Ưu Tiên: " + api.getPrio();
			// var status = "TPS: " + tps;
			if(status.startsWith("§6Donate")) return;
			client.user.setActivity(status, { type: 'PLAYING' });

			setTimeout(() => {
				statusbot = false;
			}, 2 * 60 * 1000);
		}, 5 * 1000);
	});
	/**
	 * 
	 * 									RESTART_NOTIFY
	 * 
	 * 
	 */
	bot.on('chat', (username, msg) => {
		// main chat
		if(username === "AutoRestart") {
			var embed = new Discord.MessageEmbed()
								.setDescription("[AutoRestart] " + msg)
								.setColor("0xC51515");

			client.channels.cache.get(defaultChannel).send(embed);
		}

		if (msg === "Server Restarting!") {
			restartingMsg = true;
			if (dev) return;
			var embed = new Discord.MessageEmbed()
						.setDescription("[AutoRestart] " + msg)
						.setColor("0xC51515");

			client.channels.cache.get('795534684967665695').send("@everyone " + "[AutoRestart] " + msg);

		}
	});

	/*
	 *
	 *					MAIN_SERVERS
	 *  
	 * 
	 */
	var onmain = false;
	bot._client.on("playerlist_header", data => {
		if(lobby) return;
		if (onmain) return;
		onmain = true;

		var footer = data.footer;
		var ss1 = footer.replace(/\\n/ig, " ");
		var ss2 = ss1.replace(/-/ig, "");
		var ss3 = ss2.replace(/§e|§c|§3|§6|§d|§a|§r/ig, "");
		var ss4 = ss3.replace(/{"text":"/ig, "")
		// console.log(ss4)
		var ss5 = ss4.replace('    ', " - ")
		var ss6 = ss5.replace('    ', " - ")
		var ss7 = ss6.replace('    ', " - ")
		var ss8 = ss7.split('§7')[0];
		// var ss9 = ss8.replace(" - ", " - ")
		
		isMainServer = true;
		// console.log(ss9)
		var formatMinutes;
		if(minutess == 0) {
			formatMinutes = "";
		} else {
			formatMinutes = minutess + " phút ";
		}
		var format;
		if(hourss == 0) {
			format =  formatMinutes;
		} else {
			format = hourss + " giờ " + formatMinutes;
		}
		if(minutess == 0 && hourss == 0) {
			format = "vài phút ";
		}
		var topics = ss8 + " - Tham gia server từ " + format + "trước.";
		const dataa = new Scriptdb(`./data.json`);
		dataa.set('tab-content', ss8 + " | " + Date.now());

		if(topics !== undefined) {
			client.channels.cache.get(defaultChannel).setTopic(topics).then(() => {				
				client.channels.cache.get("816695017858531368").setTopic(topics)
			});
		}
		
		setTimeout(() => {
			onmain = false;
		}, 5 * 60 * 1000);
		
	});

	/*
	 *
	 *					CHAT_BOX_SERVERS
	 *  
	 * 
	 */
	
	// bot end with restart
	var isRestarting = false;
	var restartingMsg = false;
	bot.on('message', msg => {
		// Start
		if (!(msg.toString().startsWith("<"))) return; // return message no <
		var nocheck = msg.toString().split(' ')[0];
		var username1 = nocheck.replace(/</ig, ""); // xoa < > format chat
		var username2 = username1.replace(/>/ig, "");
		var username;
		if (username2.startsWith("[2B2T]")) {
			username = username2.replace("[2B2T]", "")
		} else {
			if (username2.startsWith("[Donator]")) { // neu bat dau = [Donator] thi se replace di
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

		
		/**
		 * 
		 * 				Commands
		 * 
		 * 
		 */
		// check > msg
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
			setTimeout(() => {
				// console.log(guild[2])
				// const data = new Scriptdb(`./data/guilds/setup-${guild[2]}.json`);
				// const checkdata = data.get('livechat')
				// if(checkdata == undefined) {
				// 	guild.shift()
				// }
				// if(checkdata !== undefined) {
				// 	setTimeout(() => {
					client.channels.cache.get("816695017858531368").send(chat);
				// 	}, 3 * 1000 )
				// }
				
			}, 1*100);
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
			} else {
				messages.set("messages", logger + " | " + msgs)
				messages.set("times", times + " | " + Date.now())
			}
		}

		// const args = msg.content.slice("/".length).trim().split(/ +/g);
		// const command = args.shift().toLowerCase();

		var args = logger.slice(bp.length).trim().split(/ +/g);
		var cmd = args.shift().toLowerCase();
		
        var regex = /[a-z]|[A-Z]|[0-9]/i;
		if(!logger.startsWith(bp)) return;

		var seconds = 2;

		
		if(cmd == "quotes") {
			if(!args[0]) return;
			if(!args[0].match(regex)) return;

			let quotes = new Scriptdb(`./data/quotes/${args[0]}.json`);
			var messages = quotes.get("messages");
	
			let arrayMsgs = messages.split(" | ");
	
			var random = Math.floor(Math.random() * arrayMsgs.length  + 1);
	
			var dataMsgs = arrayMsgs[random];
	
			setTimeout(() => {
				bot.whisper(username, `> <${args[0]}> ${dataMsgs}`);
			}, seconds * 1000);
		}

		if (cmd == 'check') {
			if(!args[0]) return;
			if(!args[0].match(regex)) return;

			if(name !== undefined) return;
			var list = Object.values(bot.players).map(p => p.username);
			
			setTimeout(() => {
				if(list.includes(name)) {
					bot.whisper(username, `> ${name} đang hoạt động.`)
				} else {
					bot.whisper(username, `> ${name} không hoạt động.`)
				}
			}, 1 * 1000);
		}

		if (cmd === "coords" || cmd == "coordinate" || cmd == "xyz") {
			var pos = bot.entity.position;
			var str = pos.toString().split("(")[1].split(")")[0];
			var x = parseInt(str.split(" ")[0]);
			var y = parseInt(str.split(" ")[1]);
			var z = parseInt(str.split(" ")[2]);
	
			setTimeout(() => {
				bot.whisper(username, `X: ${x} Y: ${y} Z: ${z}`);
			}, seconds * 1000);
		}

		if (cmd == "seen") {
			if(!args[0]) return;
			if(!args[0].match(regex)) return;

			let ls = new Scriptdb(`./data/seen/${args[0]}.json`);
			var seen = ls.get('seen')

			setTimeout(() => {
				if (seen === undefined) {
					bot.whisper(username, `> Không tìm thấy người chơi.`);
					return;
				}

				var age = api.ageCalc(seen);
				bot.whisper(username, `> Đã nhìn thấy ${args[0]} từ ${age} trước.`)
			}, seconds * 1000);
		}

		if(cmd == "joindate" || cmd == "jd") {
			if(!args[0]) return;
			if(!args[0].match(regex)) return;

			let fj = new Scriptdb(`./data/joindate/${args[0]}.json`);
			let firstjoin = fj.get('date')

			setTimeout(() => {
				if (firstjoin === undefined) {
					bot.whisper(username, `> Không tìm thấy người chơi.`);
					return;
				}
				bot.whisper(username, `> Lần đầu thấy ${args[0]} vào ${firstjoin}.`)
			}, seconds * 1000);
		}

		if(cmd == "playtime" || cmd == "pt") {
			if(args[0]) {
				if(!args[0].match(regex)) return;
			} else {
				args[0] = username;
			}

			let pt = new Scriptdb(`./data/playtime/${args[0]}.json`);
			let playtime = pt.get('time')

			setTimeout(() => {
				if (playtime === undefined) return bot.whisper(username, `> Không tìm thấy người chơi.`);
				
				var string = api.playtimeCalc(playtime);

				bot.whisper(username, `> ${args[0]}: ${string}.`);
			}, 1 * 1000);
		}

		if (cmd == "kd" || cmd == "stats") {
			if(args[0]) {
				if(!args[0].toString().match(regex)) return;
			} else {
				args[0] = username;
			}
			

			const kd = new Scriptdb(`./data/kd/${args[0]}.json`);
			let die = kd.get('deaths');
			let kills = kd.get('kills');

			var ratio = kills / die;
			var ratioFixed = ratio.toFixed(2);

			if (ratioFixed === "NaN" || ratioFixed === "Infinity") {
				ratioFixed = "0.00";
			}

			if (die === undefined) {
				die = 0;
			}

			if (kills === undefined) {
				kills = 0;
			}

			setTimeout(() => {
				bot.whisper(username, `> ${args[0]}: [K: ${kills} - D: ${die} - K/D: ${ratioFixed}]`)
			}, seconds * 1000);
		}

		if (cmd == "kill" || cmd == 'suicide') {
			if (dev) return;
			setTimeout(() => {
				bot.chat('/kill');
			}, seconds * 1000);
		}

		if (cmd == "queue" || cmd == "que" || cmd == "q" || cmd == "normalqueue" || cmd == "nq" || cmd == "prio" || cmd == "prioqueue") {
			var prio = api.getPrio();
			var queue = api.getQueue();
			if (cmd == "prioqueue" || cmd == "prio") {
				if (prio == 0) {
					bot.whisper(username, `> Không có bất kì hàng chờ ưu tiên nào.`);
				} else {
					bot.whisper(username, `> Ưu tiên: ${prio}`);
				}
			}

			if (cmd == "normalqueue" || cmd == "nq") {
				if (queue == 0) {
					bot.whisper(username, `> Không có bất kì hàng chờ nào.`);
				} else {
					bot.whisper(username, `> Hàng chờ: ${queue}`);
				}
			}

			if (cmd == "q" || cmd == "queue" || cmd == "que") {
				bot.whisper(username, `> Hàng chờ: ${queue} - Ưu tiên: ${prio}`);

			}
		}

		if(cmd == "2bqueue" || cmd == "2bq") {
			superagent.get("https://2b2t.io/api/queue?last=true").end((err, data) => {
				let queue = data.body[0][1];
				if(err) {
					queue = "Error";
				}
				superagent.get("https://api.2b2t.dev/prioq").end((err, dataq) => {
					let prio = dataq.body[1];	
					if(err) {
						prio = "Error";
					}
					bot.whisper(username, "> Queue: " + queue + ", Prio queue: " + prio)
				});
			});
		}

		if (cmd == "ping") {
			if(args[0]) {
				if(!args[0].match(regex)) return;
			} else {
				args[0] = username;
			}
			
			setTimeout(() => {
				try {
					var ping = bot.players[args[0]].ping;
					if(ping == 0) {
						bot.whisper(username, "> Server chưa ping người chơi này..");
					} else {
						if(user == username) {
							bot.whisper(username, "> Ping của bạn : " + bot.players[args[0]].ping + "ms.");
						} else {
							bot.whisper(username, "> " + args[0] + " : " + bot.players[args[0]].ping + "ms.");
						}
					}
				} catch (e) {
					bot.whisper(username, "> Không tìm thấy người chơi");
				}
			}, 1 * 1000);
		}

		if(cmd == "buykit") {
			setTimeout(() => {
				bot.whisper(username, "SHOP : https://disord.gg/5Nh3tZB8nc");
				setTimeout(() => { 
				o = false;
				}, 5*1000);
			}, 1*1000);
		}

		if(cmd == "quit") {
			if(!dev) return;
			bot.quit();
			disconnectRequest = true;
		}

		if(cmd == "players") {
			var name = Object.values(bot.players).map(p => p.username);
			setTimeout(() => {
				bot.whisper(username, "> " + name.length + " đang chơi!");
			}, 1 * 1000);
		}

		if(cmd == "runtime") {
			setTimeout(() => {
				bot.whisper(username, "> " + api.uptimeCalc());
			}, seconds * 1000);
		}

		if (cmd == "report") {
			setTimeout(() => {
				if(!args[0]) return;
				if(args == bot.username) return bot.whisper(username, "Bạn không thể báo cáo staff của server.");	
				
				bot.whisper(username, `> Bạn đã báo cáo người chơi tên ${args[0]}, chờ lệnh xử lý từ ADMIN!`)
			}, 1 * 1000);
		}

		if (cmd == "rules") {
			setTimeout(() => {
				bot.whisper(username, `> LUẬT: Tuyệt đối không HACK, CHEAT, lừa đảo, không SPAM, không PHÁ HOẠI. Báo cáo ngay với lệnh !report.`)
			}, 1 * 1000);
		}

		if(cmd == 'help') {
			setTimeout(() => {
				bot.whisper(username, '> Commands: https://mo0nbot.tk/')
			}, seconds * 1000);
		}
		if (cmd == "tps") {
			setTimeout(() => {
				bot.whisper(username, `> TPS : ${bot.getTps()}`)
			}, seconds * 1000);
		}

		if (cmd == "discord") {
			setTimeout(() => {
				bot.whisper(username, `> Link : http://discord.gg/yrNvvkqp6w`)
			}, seconds * 1000);
		}
	});

	/*
	 *
	 *						DISCONNECT_SERVERS
	 *  
	 * 
	 */
	var unknownReason = true;
	bot.on('kicked', (reason, loggedIn) => {
		console.log(reason, loggedIn);
		if (reason.text == "You are already connected to this proxy!") {
			console.log("Bot end for another is active!");
			process.exit();
		}

		if (reason.includes("đang restart quay lại sau")) {
			isRestarting = true;
			unknownReason = false;
		}
		var embed = new Discord.MessageEmbed()
							.setDescription(`Bot mất kết nối: ` + reason.toString())
							.setColor("F71319");

		client.channels.cache.get(defaultChannel).send(embed).then(() => {
			client.channels.cache.get("816695017858531368").send(embed)
		});
	})

	/*
	 *
	 *					END_CONNECT_TO_SERVERS
	 *  
	 * 
	 */
	
	bot.on('end', () => {
		client.user.setActivity("");
		console.log('Bot ended')

		setTimeout(() => {
			if(restartingMsg) {
				var reconnect = new Discord.MessageEmbed()
									.setDescription(`Bot đã ngắt kết nối vì server restart. Bot sẽ vào lại sau 5 phút.\nĐã hoạt động từ ${api.uptimeCalc()} trước.`)
									.setColor("F71319");

				var notf = new Discord.MessageEmbed()
										.setDescription("🏮 Bot đã ngắt kết nối đến server. 🏮")
										.setColor("F71319"); // cam

				client.channels.cache.get(defaultChannel).send(notf);
				setTimeout(() => {
					client.channels.cache.get("816695017858531368").send(notf);
				}, 1*100);
				if(dev) {
					client.channels.cache.get("807045720699830273").send(reconnect);
				} else {
					client.channels.cache.get("806881615623880704").send(reconnect);
				}

				waitUntil(300000, 30, function condition() {
					try {
						var today = new Date()
						let day = ("00" + today.getDate()).slice(-2)
						let month = ("00" + (today.getMonth() + 1)).slice(-2)
						let years = ("00" + today.getFullYear()).slice(-2)
						let hours = ("00" + today.getHours()).slice(-2)
						let min = ("00" + today.getMinutes()).slice(-2)
						var date = day + '.' + month + '.' + years + ' ' + hours + ':' + min
						console.log(date + " | Bot ended, attempting to reconnect...");
						
						createBot(); // reconnect
						
						return true;
					} catch (error) {
						console.log("Error: " + error);
						return false;
					}
				}, function done(result) {
					console.log("Completed: " + result);
				});
				
				return;
			}

			if(isRestarting && !restartingMsg) {
				var reconnect = new Discord.MessageEmbed()
					.setDescription(`⚠️ Server đã crash. Bot sẽ kết nối lại server sau 5 phút! ⚠️`)
					.setColor("F71319");

				if(dev) {
					client.channels.cache.get("807045720699830273").send(reconnect);
				} else {
					client.channels.cache.get("806881615623880704").send(reconnect);
				}

				waitUntil(300000, 30, function condition() {
					try {
						var today = new Date()
						let day = ("00" + today.getDate()).slice(-2)
						let month = ("00" + (today.getMonth() + 1)).slice(-2)
						let years = ("00" + today.getFullYear()).slice(-2)
						let hours = ("00" + today.getHours()).slice(-2)
						let min = ("00" + today.getMinutes()).slice(-2)
						var date = day + '.' + month + '.' + years + ' ' + hours + ':' + min
						console.log(date + " | Bot ended, attempting to reconnect...");
						
						createBot(); // reconnect
						
						return true;
					} catch (error) {
						console.log("Error: " + error);
						return false;
					}
				}, function done(result) {
					console.log("Completed: " + result);
				});
				return;
			} 

			if(disconnectRequest) {
				var log = new Discord.MessageEmbed()
										.setDescription("Bot đã ngắt kết nối đến server. Bot sẽ vào lại sau 1 phút." + `\nĐã hoạt động từ ${api.uptimeCalc()} trước.`)
										.setColor("F71319"); // cam

				var notf = new Discord.MessageEmbed()
										.setDescription("🏮 Bot đã ngắt kết nối đến server. 🏮")
										.setColor("F71319"); // cam

				client.channels.cache.get(defaultChannel).send(notf);
				setTimeout(() => {
					client.channels.cache.get("816695017858531368").send(notf);
				}, 1*100);
				if(dev) {
					client.channels.cache.get("807045720699830273").send(log);
				} else {
					client.channels.cache.get("806881615623880704").send(log);
				} 

				waitUntil(60000, 30, function condition() {
					try {
						var today = new Date()
						let day = ("00" + today.getDate()).slice(-2)
						let month = ("00" + (today.getMonth() + 1)).slice(-2)
						let years = ("00" + today.getFullYear()).slice(-2)
						let hours = ("00" + today.getHours()).slice(-2)
						let min = ("00" + today.getMinutes()).slice(-2)
						var date = day + '.' + month + '.' + years + ' ' + hours + ':' + min
						console.log(date + " | Bot ended, attempting to reconnect...");
						
						createBot(); // reconnect
						
						return true;
					} catch (error) {
						console.log("Error: " + error);
						return false;
					}
				}, function done(result) {
					console.log("Completed: " + result);
				})
				return;
			}

			if(unknownReason) {
				var log = new Discord.MessageEmbed()
				.setDescription("Bot đã mất kết nối đến server. Bot sẽ vào lại sau 1 phút." + `\nĐã hoạt động từ ${api.uptimeCalc()} trước.`)
				.setColor("F71319"); // cam

				var notf = new Discord.MessageEmbed()
										.setDescription("🏮 Bot đã mất kết nối đến server. 🏮")
										.setColor("F71319"); // cam
				setTimeout(() => {
					client.channels.cache.get(defaultChannel).send(notf);
					setTimeout(() => {
						client.channels.cache.get("816695017858531368").send(notf);
					}, 1*100);
				}, 3*1000);
				if(dev) {
					client.channels.cache.get("807045720699830273").send(log);
				} else {
					client.channels.cache.get("806881615623880704").send(log);
				} 

				waitUntil(60000, 30, function condition() {
					try {
						var today = new Date()
						let day = ("00" + today.getDate()).slice(-2)
						let month = ("00" + (today.getMonth() + 1)).slice(-2)
						let years = ("00" + today.getFullYear()).slice(-2)
						let hours = ("00" + today.getHours()).slice(-2)
						let min = ("00" + today.getMinutes()).slice(-2)
						var date = day + '.' + month + '.' + years + ' ' + hours + ':' + min
						console.log(date + " | Bot ended, attempting to reconnect...");
						
						createBot(); // reconnect
						
						return true;
					} catch (error) {
						console.log("Error: " + error);
						return false;
					}
				}, function done(result) {
					console.log("Completed: " + result);
				});
				return;
			}
		}, 3*1000)
		
	});

	/*
	 *
	 *					CHAT_ON_DSICORD
	 *  
	 * 
	 */
	client.on('message', msg => {
		const args = msg.content.slice("/".length).trim().split(/ +/g);
		const command = args.shift().toLowerCase();

		// control
		if (msg.author.bot) return; // return author is bot

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
						var chat = str.charAt(0).toUpperCase() + str.substr(1, str.length);

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
				
				var log = chat.replace("<@!", "")
				var str = log.split(">")[0]; // get id
		
				var user = client.users.cache.find(user => user.id === str)

				if(u) {
					chat  = chat.replace("<@!", "").replace(">", user.username + "#" + user.discriminator).replace(str, "")
				}

				if(!chat.endsWith(".")) {
					chat = chat + ".";
				}

				setTimeout(() => {
					bot.chat(`> 『 ${msg.author.tag} 』 »  ${chat}`);
				}, 1 * 1000);

				const send = client.emojis.cache.find(emoji => emoji.name === "1505_yes");
				msg.react(send);
			}
			return;
		}

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
					var chat = str.charAt(0).toUpperCase() + str.substr(1, str.length);

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
			setTimeout(() => {
				bot.chat(`>『 ${msg.author.tag} 』»  ${chat}`);
			}, 1 * 1000);

			const send = client.emojis.cache.find(emoji => emoji.name === "1505_yes");
			msg.react(send);
		}
	});
}

/*
*
*				COMMAND_DISCORD
*  
* 
*/

client.on("message", async message => {
	const args = message.content.slice(prefix.length).trim().split(/ +/g);
	const command = args.shift().toLowerCase();

	if (!message.content.startsWith(prefix) || message.author == client.user) return;
	// client.guilds.cache.map(guild => guild.id)

	// if(message.channel.id !== )
	if (message.channel.id !== "795147809850130514" && message.author.id !== "425599739837284362") return;

	var userNotFound = new Discord.MessageEmbed()
					.setDescription('Không tìm thấy người chơi.')
					.setColor('0xC51515');

	if (command === "stats" || command === "kd") {
		if (!args[0]) return message.channel.send(userNotFound);

		const kd = new Scriptdb(`./data/kd/${args[0]}.json`);
		let deads = kd.get('deaths');
		let kills = kd.get('kills');

		if (kills === undefined) { kills = 0 }

		if (deads === undefined) { dead = 0 }

		// alex, steve
		var ratio = kills / deads;
		var ratioFixed = ratio.toFixed(2);

		if (ratioFixed === "NaN" || ratioFixed === "Infinity") {
			ratioFixed = "0.00";
		}

		setTimeout(() => {
			var embed = new Discord.MessageEmbed()
							.setAuthor(`${args[0]}'s statistics`, `https://minotar.net/helm/${args[0]}`, `https://namemc.com/` + args[0])
							.addField(`Kills`, `${kills}`, true)
							.addField(`Deaths`, `${deads}`, true )
							.addField(`K/D Ratio`, `${ratioFixed}`, true )
							.setThumbnail(`https://minotar.net/helm/${args[0]}`)
							.setColor(0x2EA711)
							.setFooter(footer, 'https://cdn.discordapp.com/avatars/768448728125407242/aa2ce1d9374de6fc0dd28d349ca135af.webp?size=1024')
							.setTimestamp();

			message.channel.send(embed);
		}, 1 * 1000);
	}

	if (command === "playtime" || command === "pt") {
		if (!args[0]) return message.channel.send(userNotFound);

		let pt = new Scriptdb(`./data/playtime/${args[0]}.json`);
		let playtime = pt.get('time')
		
		setTimeout(() => {
			if (playtime === undefined) return message.channel.send(userNotFound);

			var string = api.playtimeCalc(playtime);

			var embed = new Discord.MessageEmbed()
							.setDescription(`${args[0]}: ${string}`)
							.setColor(0x2EA711);

			message.channel.send(embed);
		}, 1 * 1000);
	}

	if(command == "uptime" || command == "tps") {
		var dataa = new Scriptdb(`./data.json`).get('tab-content').toString();
		var uptime = dataa.split(' - ')[3].split(" | ")[0].split("restart từ")[1].split("trước")[0];
		var tps = dataa.split(' ')[1];
		var players = dataa.split(' ')[4];
		var ping = dataa.split(" - ")[2].split(" ping")[0];
		var timepassed  = dataa.split(" | ")[1];

		var embed = new Discord.MessageEmbed()
							// .setDescription("*Thông số hiện tại của 2y2c.*\n")
							.setAuthor('Server Info','https://cdn.discordapp.com/attachments/795842485133246514/821669964673974282/communityIcon_14otnpwidot51.png')
							// .addField("\u200b", "\u200b", false)
							.addFields(
								{
									name: 'Server Uptime',
									value: uptime,
									inline: true
								},
								{
									name: 'Bot Uptime',
									value: api.uptimeCalc(),
									inline: true
								},
								{
									name: 'TPS',
									value: tps,
									inline: true
								},
								{
									name: 'Players',
									value: players + " players",
									inline: true
								},
								{
									name: 'Bot Ping',
									value: ping + " ping",
									inline: true
								},
								{
									name: 'Chờ - Ưu tiên',
									value: api.getQueue() + " - " + api.getPrio(),
									inline: true
								}
								)
							.setFooter('Kiểm tra lần cuối từ ' + api.ageCalc(timepassed) + " trước", 'https://cdn.discordapp.com/avatars/768448728125407242/aa2ce1d9374de6fc0dd28d349ca135af.webp?size=1024')
							.setTimestamp()

		message.channel.send(embed)
	}

	if(command == "lastmessages") {
		if (!args[0]) return message.channel.send(userNotFound)

		let quote = new Scriptdb(`./data/quotes/${args[0]}.json`)
		let msgs = quote.get('messages')
		let times = quote.get('times')
		var data = msgs.split(" | ")[0];
		var time = times.split(" | ")[0];

		if (msgs === undefined || times == undefined) return message.channel.send(userNotFound);

		var embed = new Discord.MessageEmbed()
							.setDescription(`**${api.ageCalc(time)}**: <${args[0]}> ${data}`)
							.setColor(0x2EA711);

		setTimeout(() => { msg.channel.send(embed) }, 1 * 1000);
	}

	if(command == "firstmessages") {
		if (!args[0]) return message.channel.send(userNotFound)

		let quote = new Scriptdb(`./data/quotes/${args[0]}.json`)
		let msgs = quote.get('messages')
		let times = quote.get('times')
		var data = msgs[msgs.split(" | ").length - 1];
		var time = times[times.split(" | ").length - 1];

		if (msgs === undefined || times == undefined) return message.channel.send(userNotFound);

		var embed = new Discord.MessageEmbed()
							.setDescription(`**${api.ageCalc(time)}**: <${args[0]}> ${data}`)
							.setColor(0x2EA711);

		setTimeout(() => { msg.channel.send(embed) }, 1 * 1000);
	}

	if(command == "messages") {
		if (!args[0]) return message.channel.send(userNotFound);

		let quotes = new Scriptdb(`./data/quotes/${args[0]}.json`)
		let messages = quotes.get('messages')
		let times = quotes.get('times')

		var msg0 = messages.split(" | ")[0]
		var msg1 = messages.split(" | ")[1]
		var msg2 = messages.split(" | ")[2]
		var msg3 = messages.split(" | ")[3]
		var msg4 = messages.split(" | ")[4]

		var time0 = times.split(" | ")[0]
		var time1 = times.split(" | ")[1]
		var time2 = times.split(" | ")[2]
		var time3 = times.split(" | ")[3]
		var time4 = times.split(" | ")[4]
		
		if (messages === undefined || times == undefined) return message.channel.send(userNotFound);

		var embed = new Discord.MessageEmbed()
								.setTitle(`${args[0]}'s messages`)
								.setDescription(`*Tổng tin nhắn đã gửi: ${messages.split(" | ").length}*\nHoạt động từ 16/03.\n\n`)
								.addField('*5 tin nhắn gần đây*', `***${api.ageCalc(time0)} trước***: ${msg0}\n***${api.ageCalc(time1)} trước***: ${msg1}\n***${api.ageCalc(time2)} trước***: ${msg2}\n***${api.ageCalc(time3)} trước***: ${msg3}\n***${api.ageCalc(time4)} trước***: ${msg4}\n`)
								.setFooter(footer)
								.setTimestamp()
								.setColor(0x2EA711);

		var fetching = new Discord.MessageEmbed()
							.setDescription("Đang tính toán...")
							.setColor(0x2EA711);

		message.channel.send(fetching).then(msg => {
			setTimeout(() => { msg.edit(embed) }, 1 * 1000)
		});
	}

	if (command === "seen") {
		if (!args[0]) return message.channel.send(userNotFound)

		let ls = new Scriptdb(`./data/seen/${args[0]}.json`);
		let seen = ls.get('seen')

		setTimeout(() => {
			if (seen === undefined) return message.channel.send(userNotFound);

			var age = api.ageCalc(seen);
			
			var embed = new Discord.MessageEmbed()
				.setDescription(`Đã nhìn thấy ${args[0]} từ ${age} trước.`)
				.setColor(0x2EA711);

			message.channel.send(embed);
		}, 1 * 1000);

	}

	if (command === "joindate" || command === "jd") {
		if (!args[0]) return message.channel.send(userNotFound);

		let fj = new Scriptdb(`./data/joindate/${args}.json`)
		let firstjoin = fj.get('date')

		if (firstjoin === undefined) return message.channel.send(userNotFound);

		setTimeout(() => {
			if (firstjoin === undefined) {
				var nodata = new Discord.MessageEmbed()
					.setDescription('Không tìm thấy người chơi.')
					.setColor('0xC51515')

				message.channel.send(nodata)
				return;
			}

			var embed = new Discord.MessageEmbed()
				.setDescription(`Lần đầu thấy ${args[0]} vào ${firstjoin}`)
				.setColor(0x2EA711);

			message.channel.send(embed);
		}, 3 * 1000);
	}

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
	}

	if (command === "2bq" || command === "2bqueue") {
		superagent.get("https://2b2t.io/api/queue?last=true").end((err, data) => {
			let queuequeue = data.body[0][1];
			superagent.get("https://api.2b2t.dev/prioq").end((err, dataq) => {
				let prio = dataq.body[1];
				var queue = new Discord.MessageEmbed()
									.setDescription("Hàng chờ: " + queuequeue + " - Ưu tiên: " + prio)
									.setColor(0x2EA711);
				message.channel.send(queue);
			});
		});
	}

	if (command === "help") {
		var noargs = new Discord.MessageEmbed()
			.setDescription('Bạn cần nhập loại lệnh. `' + prefix + "help <loại>`\n**Loại:** discord, ingame-command, check và all.\nLoại all là xem tất cả lệnh, còn lại là xem chi tiết")
			.setColor(0x000DFF);

		if (!args[0]) return message.channel.send(noargs);

		if (args[0] == "discord") {
			var helpdiscord = new Discord.MessageEmbed()
				.setTitle("*[Discord Command]*")
				.setColor(0x000DFF)
				.setDescription(prefix + 'status - ``Xem trạng thái của server hàng chờ, online``\n' + 
								prefix + 'online - ``Xem số người online`` \n' +
								prefix + 'queue - ``Xem hàng chờ`` \n' +
								prefix + 'prio - ``Xem hàng chờ ưu tiên``\n')
				.setFooter(footer)
				.setTimestamp();

			message.channel.send(helpdiscord);
		}

		if (args[0] === "ingame-command") {
			var ingamecmd = new Discord.MessageEmbed()
				.setTitle("*[Discord Command]*")
				.setColor(0x000DFF)
				.setDescription('!help - ``Xem các lệnh có sẵn.`` \n' +
				'!tps - ``Xem tps hiện tại của server.`` \n'
				+ '!coordinate - ``Xem toạ độ bot hiện tại.`` \n' 
				+ '!kill - ``Thực hiện lệnh /kill cho bot.`` \n' 
				+ '!ping - ``Xem ping của bạn, nhập tên để xem ping người khác.`` \n'
				+ '!prio - ``Xem hàng chờ ưu tiên hiện tại.`` \n'
				+ '!que - ``Xem hàng chờ và hàng chờ ưu tiên.`` \n'
				+ '!stats - ``Xem chỉ số K/D. ( Dead tính từ 13/1, Kil tính từ 15/1 )`` \n'
				+ '!joindate - ``Xem ngày người chơi lần đầu tham gia server. ( Tính từ 28/1 )`` \n'
				+ '!pt - ``Xem thời gian bạn đã chơi. ( Bắt đầu từ ngày 1/2 )`` \n'
				+ '!seen - ``Xem lần hoạt động gần nhất của người chơi. ( Tính từ 2/2 )`` \n'
				+ '!2bqueue - ``Xem hàng chờ hiện tại của 2b2t.`` \n'
				+ '!buykit - ``Nhận link discord để mua kit.`` \n'
				+ '!players - ``Xem người chơi online.`` \n'
				+ '!runtime - ``Xem thời gian bot đã ở trong server.`` \n'
				+ '!report - ``Báo cáo người chơi cho admin server.`` \n'
				+ '!kick - ``Kick 1 người chơi ra khỏi server..`` \n'
				+ '!ban - ``Ban 1 người nào đó bất kì.`` \n'
				+ '!ignore - ``Ẩn chat của người chơi.`` \n'
				+ '!ip - ``Check ip của người chơi bất kì đang được kết nối đến server.`` \n'
				+ '!gamemode - ``Thay đổi chế độ chơi hiện tại.`` \n'
				+ '!dupe - ``Dupe item của bạn.`` \n'
				+ '!rules - ``Xem luật của server.`` \n'
				// + '!order - ``Đặt hàng kit riêng.`` \n'
				)
				.setFooter(footer)
				.setTimestamp();

			message.channel.send(ingamecmd);
		}
		if (args[0] === "check") {
			var check = new Discord.MessageEmbed()
				.setTitle("*[Check Command]*")
				.setColor(0x000DFF)
				.setDescription(
				prefix + 'kd - ``Xem chỉ số K/D.``'
				+ prefix + 'jd - ``Xem ngày người chơi lần đầu tham gia server.`` \n'
				+ prefix + 'pt - ``Xem thời người chơi đã chơi.`` \n'
				+ prefix + 'seen - ``Xem lần hoạt động gần nhất của người chơi.`` \n')
				.setFooter(footer)
				.setTimestamp();

			message.channel.send(check);
		}

		if (args[0] == "all") {
			var embed = new Discord.MessageEmbed()
								.setColor(0x000DFF)
								.setTitle('[Help Command]')
								.addField("*[Discord Command]*", "help*, status, online, queue, prio. ($)", false)
								.addField("*[Check Command]*", "stats, playtime, joindate, seen. ($)", false)
								.addField("*[Ingame Command]*", "help, tps, coordinate, kill, ping, queue, prio, stats, joindate, playtime, seen, 2bqueue, buykit, players, runtime, report, kick, ban, ignore, gamemode, dupe, rules. (!)", false)
								.setFooter(footer)
								.setTimestamp();

			message.channel.send(embed);
		}
	}

	if (command === "queue" || command === "q" || command === "que" || command === "normalqueue") {
		const embed = new Discord.MessageEmbed()
			.setColor(0x000DFF)
			.setDescription(`Hàng chờ: ${queue} - Ưu tiên: ${prio}.`)

		message.channel.send(embed).then(message => {
			message.delete({ timeout: 10000 });
		});
	}

	if (command === "prio" || command === "p" || command === "prioqueue") {
		const embed = new Discord.MessageEmbed()
			.setColor(0x000DFF)
			.setDescription("Ưu tiên: " + prio)

		message.channel.send(embed).then(message => {
			message.delete({ timeout: 10000 });
		});
	}

	if (command === "status" || command === "stt") {
		const embed = new Discord.MessageEmbed()
			.setColor(0x000DFF)
			.setDescription(api.getStatus())

		message.channel.send(embed).then(message => {
			message.delete({ timeout: 10000 });
		});
	}

	if (command === "onl" || command === "online" || command === "o") {
		const embed = new Discord.MessageEmbed()
			.setColor(0x000DFF)
			.setTitle('[Online Command]')
			.setDescription("Online: " + api.getOnline())
			.setFooter(footer)
			.setTimestamp();

		message.channel.send(embed).then(message => {
			message.delete({ timeout: 10000 });
		});
	}
});

client.login(config.token).catch(err => console.log(err));
client.on("error", (e) => { console.error(e) });