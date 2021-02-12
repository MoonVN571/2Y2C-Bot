// Discord modules
const Discord = require("discord.js");
const client = new Discord.Client();

// env files
const token = require('dotenv').config();
const config = {
	token: process.env.token, // Discord token
	ip: process.env.ip // Server IP
};

// Minecraft protocol
const mc = require("minecraft-protocol");
const queue = require("minecraft-protocol");
const topic = require("minecraft-protocol");
const stt = require("minecraft-protocol");

const superagent = require("superagent")
var waitUntil = require('wait-until')
var mineflayer = require('mineflayer')
var delay = require('delay')
var db = require('quick.db');

// Some type
const footer = "moonbot 2021";
var prefix = "$";

// Developer mode
var dev = true;

if (dev) {
	console.log('Developer Mode: True')
	prefix = "dev$";
} else {
	console.log('Developer Mode: False')
}

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

	// create this bot
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
	}); // Start bot

	var color = "0x979797"; // color embed

	var lobby = true; // check if bot in lobby or else

	// uptime bot on server
	var minutes = 0;
	var hour = 0;
	var totalSeconds = 0;
	var seconds = 0;
	// minecraft bot uptime
	function setTime() {
		totalSeconds += 1;
		hour = parseInt(totalSeconds / 3600)
		minutes = parseInt((totalSeconds - (hour * 3600)) / 60);
		seconds = parseInt(totalSeconds % 60) 
		// console.log(hour + " " + minutes + " " + seconds)
	}

	// uptime bot on server
	var minutess = 0;
	var hourss = 0;
	var totalSecondss = 0;
	var secondss = 0;
	function setTime2() {
		totalSecondss += 300;
		hourss = parseInt(totalSecondss / 3600)
		minutess = parseInt((totalSecondss - (hourss * 3600)) / 60);
		secondss = parseInt(totalSecondss % 60)
	}

	/*
	 *
	 *					WINDOW_OPEN
	 *  
	 * 
	 */
	var isMainServer = false; // lan 2, check main server de disconnect neu nhu tab ccontent /= 2YOUNG
	var a = false;
	bot.on('windowOpen', () => { // slot button mode cb
		if(a) return;
		a = true;
		bot.clickWindow(4, 0, 0)
		delay(1000)
		bot.clickWindow(3, 0, 0)
		bot.clickWindow(7, 0, 0)
		bot.clickWindow(1, 0, 0)
	});

	/*
	 *
	 *					LOGIN
	 *  
	 * 
	 */
	var disconnectRequest = false;
	bot.on('login', () => {
		// uptime method
		totalSeconds = 0;
		setInterval(setTime, 1000);
		setInterval(setTime2, 5*60*1000);

		disconnectRequest = false;
		setInterval(function () {
			if(lobby) return;
			if (stats) return;
			stats = true;
			bot.swingArm("left");
			bot.look(Math.floor(Math.random() * Math.floor("360")), 0, true, null);
			// console.log("a")
			antiAFK()
		}, 1 * 60 * 1000);
		function antiAFK() {
			setTimeout(function () {
				stats = false;
			}, 10 * 1000);
		}

		if(!dev) {
			var str = "> Xem tất cả lệnh bot: !help | > Tham server luyện tập pvp: 2y2cpvp.sytes.net | > Nếu bạn cần kit, hãy ghé thăm shop qua lệnh: !buykit."
			var words = str.split(' | ');
			var random = words[Math.floor(Math.random() * words.length)];

			setInterval(function () {
				if (sending) return;
				sending = true;
				bot.chat(random);
				autoMsg();
			}, 20 * 60 * 1000);

			function autoMsg() {
				setTimeout(function () {
					sending = false;
				}, 1 * 60 * 1000);
			}
		}

		// Playtime
		setInterval(function () {
			if (lobby) return;
			Object.values(bot.players).map(player => addPlayTime(player.username));

			function addPlayTime(player) {
				let playtime = db.get(`${player}_playtime`);

				if (playtime === null) { // tao database playtime
					db.set(`${player}_playtime`, 10000);
				} else if (playtime < 2) { // do database nen se phai lam cai nay
					db.add(`${player}_playtime`, 9999);
				} else { // tao database va tinh thoi gian
					db.add(`${player}_playtime`, 10000);
				}
			}
		}, 10 * 1000);

		if (dev) {
			var today = new Date()
			let day = ("00" + today.getDate()).slice(-2)
			let month = ("00" + (today.getMonth() + 1)).slice(-2)
			let years = ("00" + today.getFullYear()).slice(-2)
			let hours = ("00" + today.getHours()).slice(-2)
			let min = ("00" + today.getMinutes()).slice(-2)
			var date = day + '.' + month + '.' + years + ' ' + hours + ':' + min;
			console.log(date + " | joined the server.")
		}

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
			client.channels.cache.get(defaultChannel).send(joined);
			client.channels.cache.get("806881615623880704").send(queuejoined);
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

		var embed = new Discord.MessageEmbed()
			.setDescription(logger)
			.setColor(color);

		if (dev) {
			if(logger !== undefined) {
				client.channels.cache.get("802456011252039680").send(embed)
			}
		} else {
			if(logger !== undefined) {
				client.channels.cache.get("797426761142632450").send(embed)
			}
		}

		// value to embed
		var deathMsg;

		if (logger === '2y2c đã full') return;

		if (logger === "Đang vào 2y2c") {
			setTimeout(() => {
				if (!isMainServer) {
					disconnectRequest = true;
					setTimeout(() => {
						bot.quit("fi")
					}, 5*1000);
				}
			}, 2 * 60 * 1000);

			setTimeout(() => { // delay before login
				lobby = false;
			}, 3 * 1000);

		}

		if (logger === undefined) return; // return if msg is undefined
		if (logger === null) return; // return if null msg

		var nocheck = message.toString().split(' ')[0]; // check username with format <>

		// return message on chat
		if (nocheck.startsWith('<') && nocheck.endsWith(">")) return;
		
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
			var lognoformat = cancelTwo.replace("*", "\*")

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

		if (logger.startsWith("[Server]")) {
			colorNotf = '0xb60000';
			notfMsg = logger;
		}

		if (logger.startsWith("[Broadcast]")) {
			colorNotf = "0xb60000";
			notfMsg = logger;
		}

		if (logger === "Donate để duy trì server admin đang đói chết con *ĩ *ẹ.") {
			colorNotf = '0xb60000';
			notfMsg = logger;
		}

		if (logger === " diễn đàn của server https://www.reddit.com/r/2y2c/.") {
			colorNotf = '0xb60000';
			notfMsg = logger;
		}
		if (logger === "server thường back up vào 1h sáng nên tps đsẽ tụt vào khoảng thời gian này.") {
			colorNotf = '0xb60000';
			notfMsg = logger;
		}

		// return error message
		if (notfMsg !== undefined) {
			var strn = notfMsg.replace("*", "\\*")
			var str = strn.replace(/`/ig, "\\`")
			var notf = str.replace(/_/ig, "\\_")

			var embedNotf = new Discord.MessageEmbed()
				.setDescription(notf)
				.setColor(colorNotf); // co set mau rieng tung loai, 0 anh huong

			client.channels.cache.get(defaultChannel).send(embedNotf);
			
		}

		// kill Message
		if (logger.includes('chết cháy khi đánh với')) {

			var str = logger;
			var user = str.split(" ")[6];
			if(user == "Zombie") {
				deathMsg = logger;
			} else {
				let data = db.get(`${user}_kills`);

				if (data === null) {
					db.set(`${user}_kills`, 1)
				} else {
					db.add(`${user}_kills`, 1)
				}
				deathMsg = logger;
			}
		}

		if (logger.includes('bị bắn chết bởi')) {
			var str = logger;
			var user = str.split(" ")[5];

			let data = db.get(`${user}_kills`);

			if (data === null) {
				db.set(`${user}_kills`, 1)
			} else {
				db.add(`${user}_kills`, 1)
			}
			deathMsg = logger;
		}

		if (logger.includes('nhảy con mẹ nó vào lava khi bị truy sát bởi')) {
			// if (logger.includes('Wither') || logger.includes('Sì-ke')
			// || logger.includes('cá')) {
			var str = logger;
			var user = str.split(" ")[12];
			var userSplit = str.split(" ")[13];
			if(user == "Sì-ke-le-từn" || user == "Wither" || user == "cá" && userSplit == "bạc") {
				deathMsg = logger;
			} else {
				let data = db.get(`${user}_kills`);

				if (data === null) {
					db.set(`${user}_kills`, 1)
				} else {
					db.add(`${user}_kills`, 1)
				}
				deathMsg = logger;
			}
		}

		if (logger.includes('chết chìm khi cố gắng thoát khỏi')) {
				var str = logger;
				var user = str.split(" ")[8];
			if(user == "Zombie") { 
				deathMsg = logger;
			} else {
				let data = db.get(`${user}_kills`);

				if (data === null) {
					db.set(`${user}_kills`, 1)
				} else {
					db.add(`${user}_kills`, 1)
				}
				deathMsg = logger;
			}
		}

		if (logger.includes('nổ banh xác bởi')) {
			var str = logger;
			var user = str.split(" ")[5];

			let data = db.get(`${user}_kills`);

			if (data === null) {
				db.set(`${user}_kills`, 1)
			} else {
				db.add(`${user}_kills`, 1)
			}
			deathMsg = logger;

		}

		if (logger.includes('đã bị đấm chết con mẹ nó bởi')) {
			var str = logger;
			var user = str.split(" ")[9];

			let data = db.get(`${user}_kills`);

			if (data === null) {
				db.set(`${user}_kills`, 1)
			} else {
				db.add(`${user}_kills`, 1)
			}
			deathMsg = logger;
		}

		if (logger.includes('té dập con mẹ nó mặt vì')) {
			var str = logger;
			var user = str.split(" ")[8];

			let data = db.get(`${user}_kills`);

			if (data === null) {
				db.set(`${user}_kills`, 1)
			} else {
				db.add(`${user}_kills`, 1)
			}
			deathMsg = logger;
		}

		if (logger.includes('chạy con mẹ nó vào lửa vì')) {
			var str = logger;
			var user = str.split(" ")[8];
			if(user == "PRIMED_TNT(?)") {
				deathMsg = logger;
			} else {
				let data = db.get(`${user}_kills`);

				if (data === null) {
					db.set(`${user}_kills`, 1)
				} else {
					db.add(`${user}_kills`, 1)
				}
				deathMsg = logger;
			}
		}

		if (logger.includes('bay con mẹ nó lên trời bởi')) {
			var str = logger;
			var user = str.split(" ")[8];
			if(user === "PRIMED_TNT(?)" || user == "ENDER_CRYSTAL(?)") {
				deathMsg = logger;
			} else {
				let data = db.get(`${user}_kills`);

				if (data === null) {
					db.set(`${user}_kills`, 1)
				} else {
					db.add(`${user}_kills`, 1)
				}
				deathMsg = logger;
			}
		}

		if (logger.includes('đã bị phản sát thương bởi')) {
			var str = logger;
			var user = str.split(" ")[7];
			if(user !== undefined) {

				let data = db.get(`${user}_kills`);

				if (data === null) {
					db.set(`${user}_kills`, 1)
				} else {
					db.add(`${user}_kills`, 1)
				}
			}
			deathMsg = logger;
			
		}

		if (logger.includes('đã bị giết bởi')) {
			var str = logger;
			var user = str.split(" ")[5];
			if(user == "Wither" || user == "cá" || user == "Zombie") {
				deathMsg = logger;
			} else {
				let data = db.get(`${user}_kills`);

				if (data === null) {
					db.set(`${user}_kills`, 1)
				} else {
					db.add(`${user}_kills`, 1)
				}
				deathMsg = logger;
			}
		}

		if (logger.includes('khô máu với')) {
			var str = logger;
			var user = str.split(" ")[4];
			if(user == "Wither") {
				deathMsg = logger;
			} else {
				let data = db.get(`${user}_kills`);

				if (data === null) {
					db.set(`${user}_kills`, 1)
				} else {
					db.add(`${user}_kills`, 1)
				}
				deathMsg = logger;
			}

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
			|| logger.includes('was')) {
			var user = logger.split(" ")[0];
			let data = db.get(`${user}_dead`);
			
			// !=
			if (logger === "Donate để duy trì server admin đang đói chết con *ĩ *ẹ." || logger.startsWith("[Server]")
			|| logger.startsWith("[Broadcast]")) {
				return;
			}else {
				// return essentials message with valid str
				if(logger.startsWith("[") && logger.includes(" -> me]")) return;

				// return messages
				if(logger.startsWith("nhắn cho")) return;
				// var splitLogger2 = logger.split(' ')[1];
				if(splitLogger2 == "nhắn:") return;
		
				// check first join
				var splitName = logger.split(' ')[0];
				var splitUsername = logger.split('vào');
				// if (splitUsername === splitName + " đã vào") return;

				if (data === null) {
					db.set(`${user}_dead`, 1)
				} else {
					db.add(`${user}_dead`, 1)
				}
				deathMsg = logger;
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

		client.channels.cache.get(defaultChannel).send(embedDeath);
	})

	/*
	 *
	 *				PLAYERs_JOIN
	 *  
	 * 
	 */
	bot.on("playerJoined", (player) => {
		var username = player.username;
		var newUsername = username.replace(/_/ig, "\\_");

		var today = new Date()
		let day = ("00" + today.getDate()).slice(-2)
		let month = ("00" + (today.getMonth() + 1)).slice(-2)
		let years = ("00" + today.getFullYear()).slice(-2)
		let hours = ("00" + today.getHours()).slice(-2)
		let min = ("00" + today.getMinutes()).slice(-2)
		var date = day + '.' + month + '.' + years + ' ' + hours + ':' + min;

		let firstjoin = db.get(`${username}_firstjoin`);

		if (firstjoin === null) {
			db.set(`${username}_firstjoin`, date)
		}

		if (username === "Ha_My" || username === "PhanThiHaMy") {
			if(dev) return;
			client.channels.cache.get("807048523027578890").send(username + " joined");
		}

		if (username === "0Channy" || username === "TheGreatWall") {
			if(dev) return;
			client.channels.cache.get("808927553314226186").send(username + " joined");
		}

		// move xuong vi newUsername de replace username khac
		if(username === "A_Andrew" ||  username === "TheGreatWall"
		|| username === "Huymouse" || username === "ZzEnderDragonz7") {
			if(dev) return;

			var embed = new Discord.MessageEmbed()
				.setDescription(newUsername + " joined")
				.setColor('0xb60000')
				
			client.channels.cache.get("807506107840856064").send(embed);
		}

		if (newUsername === undefined) {
			newUsername = username;
		}

		if (newUsername === bot.username) return;

		if (dev) return;
		var embed = new Discord.MessageEmbed()
			.setDescription(newUsername + " joined")
			.setColor('0xb60000');

		client.channels.cache.get(defaultChannel).send(embed);

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

		// move xuong vi newUsername de replace username khac
		if(username === "A_Andrew" || username === "TheGreatWall"
			|| username === "Huymouse" || username === "ZzEnderDragonz7") {
				if(dev) return;

				var embed = new Discord.MessageEmbed()
					.setDescription(newUsername + " left")
					.setColor('0xb60000')

				client.channels.cache.get("807506107840856064").send(embed);
		}

		var d = new Date();
		var time = d.getTime();
		let lastseen = db.get(`${username}_lastseen`);

		if (lastseen === null) {
			db.set(`${username}_lastseen`, time)
		} else {
			db.set(`${username}_lastseen`, time)
		}

		if (newUsername === bot.username) return;

		if (dev) return
		var embed = new Discord.MessageEmbed()
			.setDescription(newUsername + " left")
			.setColor('0xb60000')

		client.channels.cache.get(defaultChannel).send(embed);
	});

	/*
	 *
	 *				SPAWN
	 *  
	 * 
	 */
	var sending = false;
	var stats = false;
	bot.on('spawn', () => {
		// if (lobby) return;
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
			checktab();
			var header = data.header;
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
					

					var status = "Trong hàng chờ: " + q + " - Hàng chờ: " + queue;

					if(status === undefined) return;
						client.user.setActivity(status, { type: 'PLAYING' });
				}
			});

			var embed = new Discord.MessageEmbed()
								.setDescription(s7)
								.setColor("0xFFCE00");
				
			// if (!lobby) return;
			if(embed == undefined) return;
			client.channels.cache.get(defaultChannel).send(embed);
			
			function checktab() {
				setTimeout(() => {
					ontab = false;
				}, 20 * 1000);
			}
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
			returnStt();
			var footer = data.footer;
			var ss1 = footer.replace(/\\n/ig, " ");
			var ss2 = ss1.replace(/-/ig, "");
			var ss3 = ss2.replace(/§3|§d|§a|§r/ig, "");
			var ss4 = ss3.replace(/{"text":"/ig, "")

			// replace all space to none
			var ss5 = ss4.replace("    ", " ")
			var ss6 = ss5.replace("    ", " ")
			var tps = ss6.split(" ")[1];
			if (tps === undefined || tps === "§6Donate" || tps === "§6bạn") {
				tps = 0;
			}

			topic.ping({ "host": config.ip }, (err, result) => {
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

					var old = players.toString().replace(",§6Cựu binh: §l0", "");
					var queue = old.toString().replace("§6Bình thường: §l", "");

					var prio = players2.toString().replace("2y2c §6Queue Size,§6Ưu Tiên: §l", "");

					var status = "Hàng chờ: " + queue + " - Ưu tiên: " + prio + " - TPS: " + tps;
					if(status.startsWith("§6Donate")) return;
					client.user.setActivity(status, { type: 'PLAYING' });
				}
			});

			function returnStt() {
				setTimeout(() => {
					statusbot = false;
				}, 2 * 60 * 1000);
			}
		}, 5 * 1000);
	});
	/**
	 * 
	 * 									RESTART NOTIFY
	 * 
	 * 
	 */
	bot.on('chat', (username, msg) => {
		if(username === "AutoRestart") {
			var embed = new Discord.MessageEmbed()
								.setDescription("[AutoRestart] " + msg)
								.setColor("0xC51515");

			if(embed === undefined) return;
				client.channels.cache.get(defaultChannel).send(embed);

		}

		if (msg === "Server sẽ Restart sau 15 phút!") {
			if (dev) return;
			var embed = new Discord.MessageEmbed()
			.setDescription("[AutoRestart] " + msg)
			.setColor("0xC51515");

			client.channels.cache.get('795534684967665695').send("@everyone " + "[AutoRestart] " + msg);
			
		}

		if (msg === "Server sẽ Restart sau 5 phút!") {
			if (dev) return;
			var embed = new Discord.MessageEmbed()
							.setDescription("[AutoRestart] " + msg)
							.setColor("0xC51515");

			client.channels.cache.get('795534684967665695').send("@everyone " + "[AutoRestart] " + msg);

		}

		if (msg === "Server Restarting!") {
			if (dev) return;
			var embed = new Discord.MessageEmbed()
						.setDescription("[AutoRestart] " + msg)
						.setColor("0xC51515");

			client.channels.cache.get('795534684967665695').send("@everyone " + "[AutoRestart] " + msg);

		}
	});

	/*
	 *
	 *					MAIN SERVERS
	 *  
	 * 
	 */
	var onmain = false;
	bot._client.on("playerlist_header", data => {
		if(lobby) return;
		if (onmain) return;
		onmain = true;
		checktab(); // settimeout function to return

		var footer = data.footer;
		var ss1 = footer.replace(/\\n/ig, " ");
		var ss2 = ss1.replace(/-/ig, "");
		var ss3 = ss2.replace(/§3|§6|§d|§a|§r/ig, "");
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
		if(minutess < 1) {
			formatMinutes = "";
		} else {
			formatMinutes = minutess + " phút ";
		}
		var format;
		if(hourss < 1) {
			format =  formatMinutes;
		} else {
			format = hourss + " giờ" + formatMinutes;
		}
		if(minutess < 1 && hourss < 1) {
			format = "vài phút ";
		}
		var topics = ss8 + "\nĐã tham gia server từ " + format + "trước.";
		// console.log(topics)
		
		if(topics !== undefined) {
			client.channels.cache.get(defaultChannel).setTopic(topics);

		}
		
		function checktab() {
			setTimeout(() => {
				onmain = false;
			}, 5 * 60 * 1000);
		}
	});

	/*
	 *
	 *					CHAT_BOX_SERVERS
	 *  
	 * 
	 */
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
		//console.log(username)
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

		var bp;
		if (dev) {
			bp = "Dev!";
		} else {
			bp = "!";
		}

		var newCmd = logger;

		if (newCmd == bp + "coords" || newCmd == bp + "coordinate" || newCmd == bp + "xyz") {
			var posi = bot.entity.position;
			setTimeout(function () {
				bot.whisper(username, `> XYZ bot: ${posi}`);
			}, 2 * 1000);
		}

		if (logger.startsWith(bp + "seen")) {
			var args;

			var str = logger.replace(".", "");
			args = str.split(" ")[1];

			if (newCmd === bp + "seen") {
				args = username;
			}

			if(args == undefined) {
				args = username;
			}		

			var regex = /[a-z]|[A-Z]|[0-9]/i;
			if(!args.match(regex)) {
				args = username;
			}

			let lastseen = db.get(`${args}_lastseen`);
			var d = new Date();
			var time = d.getTime();

			var ticks = (time - lastseen); // tick de tinh second

			setTimeout(() => {
				if (lastseen === null) {
					bot.whisper(username, `> Chưa từng nhìn thấy ${args}.`);
					return;
				}

				var temp = ticks / 1000;
				var day = 0, hour = 0, minutes = 0;
				day = parseInt(temp / 86400)
				hour = parseInt(((temp - day * 86400) / 3600))
				minutes = parseInt(((temp - day * 86400 - hour * 3600)) / 60)
				var age;
				if (day > 0) {
					age = `${day} ngày`;
				} else if (day < 1) {
					age = `${hour} giờ ${minutes} phút`;
					if (hour < 1) {
						age = `${minutes} phút`;
					}
				}

				bot.whisper(username, `> Đã nhìn thấy ${args} từ ${age} trước.`)
			}, 2 * 1000);
		}

		if (logger.startsWith(bp + "joindate") || logger.startsWith(bp + "jd")) {
			var args;

			var str = logger.replace(".", "");
			args = str.split(" ")[1];

			if(args == undefined) {
				args = username;
			}		

			if(args == undefined) {
				args = username;
			}

			var regex = /[a-z]|[A-Z]|[0-9]/i;
			if(!args.match(regex)) {
				args = username;
			}

			if (newCmd === bp + "joindate" || newCmd === bp + "jd") {
				args = username;
			}
			let firstjoin = db.get(`${args}_firstjoin`);

			setTimeout(function () {
				if (firstjoin === null) {
					bot.whisper(username, `> ${args}: Chưa từng tham gia vào server.`);
					return;
				}
				bot.whisper(username, `> ${args} tham gia lúc ${firstjoin}.`)
			}, 2 * 1000);
		}

		if (logger.startsWith(bp + "playtime") || logger.startsWith(bp + "pt")) {
			var args;

			var str = logger.replace(".", "");
			args = str.split(" ")[1];

			if (newCmd === bp + "playtime" || newCmd === bp + "pt") {
				args = username;
			}
			
			if(args == undefined) {
				args = username;
			}		

			var regex = /[a-z]|[A-Z]|[0-9]/i;
			if(!args.match(regex)) {
				args = username;
			}

			let playtime = db.get(`${args}_playtime`);

			setTimeout(function () {
				if (playtime === null) {
					bot.whisper(username, `> ${args}: Chưa từng được tính thời gian.`)
					return;
				}

				var temp = playtime / 1000;
				var day = 0, hour = 0, minutes = 0;
				day = parseInt(temp / 86400)
				hour = parseInt(((temp - day * 86400) / 3600))
				minutes = parseInt(((temp - day * 86400 - hour * 3600)) / 60)
				var string;
				if( day < 1 ) {
					if(minutes > 0 && hour > 0 ) {
						string = hour + " giờ " + minutes + " phút";		
					}
					if(minutes < 1 && hour > 0) {
						string = hour + " giờ ";
					}
					if(minutes > 0 && hour < 1) {
						string = minutes + " phút";
					}
				} else {
					if(minutes > 0 && hour > 0 ) {
						string = day + " ngày " + hour + " giờ " + minutes + " phút";		
					}
					if(minutes < 1 && hour > 0) {
						string = day + " ngày " + hour + " giờ ";
					}
					if(minutes > 0 && hour < 1) {
						string = day + " ngày " + minutes + " phút";
					}
				}
	
				bot.whisper(username, `> ${args}: ${string}.`);
			}, 2 * 1000);
		}

		if (logger.startsWith(bp + "kd") || logger.startsWith(bp + "stats")) {
			var args;

			var str = logger.replace(".", "");
			args = str.split(" ")[1];

			if (newCmd === bp + "kd" || newCmd === bp + "stats") {
				args = username;
			}

			if(args == undefined) {
				args = username;
			}		

			var regex = /[a-z]|[A-Z]|[0-9]/i;
			if(!args.match(regex)) {
				args = username;
			}


			let die = db.get(`${args}_dead`);
			let kills = db.get(`${args}_kills`);

			var ratio = kills / die;
			var ratioFixed = ratio.toFixed(2);

			if (ratioFixed === "NaN" || ratioFixed === "Infinity") {
				ratioFixed = "0.00";
			}

			if (die === null) {
				die = 0;
			}

			if (kills === null) {
				kills = 0;
			}

			setTimeout(function () {
				bot.whisper(username, `> ${args}: [K: ${kills} - D: ${die} - Ratio: ${ratioFixed}]`)
			}, 2 * 1000);

		}

		if (newCmd === bp + "help") {
			setTimeout(function () {
				bot.whisper(username, '> !coords, !discord, !tps, !kill, !ping, !q, !stats, !jd, !playtime, !seen, !2bqueue, !players. Tham gia discord xem chi tiết!')
			}, 2 * 1000);
		}

		// TPS
		if (newCmd === bp + "tps") {
			var o = false;
			bot._client.on("playerlist_header", data => {
				if(lobby) {
					bot.whisper(username, "Không khả dụng ngay lúc này.")
					return;
				}
				if(o) return;
				o = true;
				setTimeout(() => {
					var footer = data.footer;
					var ss1 = footer.replace(/\\n/ig, " ");
					var ss2 = ss1.replace(/-/ig, "");
					var ss3 = ss2.replace(/§3|§d|§a|§r/ig, "");
					var ss4 = ss3.replace(/{"text":"/ig, "")

					// replace all space to none
					var ss5 = ss4.replace("    ", " ")
					var ss6 = ss5.replace("    ", " ")
					var tps = ss6.split(" ")[1];
					bot.whisper(username, "TPS: " + tps + " - TAB")
					
				}, 2*1000);
			});
			o = false;
			// setTimeout(function () {
			// 	bot.whisper(username, `> TPS theo thời gian thực : ${bot.getTps()}`)
			// }, 2 * 1000);
		}

		if (newCmd === bp + "discord") {
			setTimeout(function () {
				bot.whisper(username, `> Discord bot : https://discord.gg/yrNvvkqp6w`)
			}, 2 * 1000);
		}

		if (logger.startsWith(bp + "ping")) {
			if (logger === bp + "ping") {
				setTimeout(() => {
					try {
						bot.whisper(username, "> Ping của bạn : " + bot.players[username].ping + "ms");

					} catch (E) {
						bot.whisper(username, "> Không tìm thấy người chơi.");
						if (!dev) return;
						console.log("PING ERROR", E)
					}
				}, 2 * 1000);
			} else {
				var str = logger.replace(".", "");
				var user = str.split(" ")[1];
				
				if(user == undefined) {
					user = username;
				}

				if(!user.match(regex)) {
					user = username;
				}

				setTimeout(function () {
					try {
						bot.whisper(username, "> " + user + " : " + bot.players[user].ping + "ms");
					} catch (e) {
						if (!dev) return;
						console.log("PING OTHER DEBUG ", e)
					}
				}, 2 * 1000);
			}
		}

		// Kill
		if (newCmd === bp + "kill" || newCmd === bp + 'suicide') {
			if (dev) return;
			setTimeout(function () {
				bot.chat('/kill')
			}, 2 * 1000);
		}

		if (newCmd === bp + "queue" || newCmd === bp + "que" || newCmd === bp + "q" || newCmd === bp + "normalqueue" || newCmd === bp + "nq" || newCmd === bp + "prio" || newCmd === bp + "prioqueue") {
			queue.ping({ "host": config.ip }, (err, result) => {
				if (err) {
					bot.whisper(username, "> Không thể kiểm tra trạng thái của server.");
				}
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
						var players = 'unknwn';
						var players2 = 'unknown';
					}
				}
				var oldold = players.toString().replace(",§6Cựu binh: §l0", "");
				var old = oldold.toString().replace(",§6Cựu binh: §l1", "");
				var queue = old.toString().replace("§6Bình thường: §l", "");

				var prio = players2.toString().replace("2y2c §6Queue Size,§6Ưu Tiên: §l", "");

				setTimeout(function () {
					if (newCmd === bp + "prioqueue" || newCmd === bp + "prio") {
						if (prio < 1) {
							bot.whisper(username, `> Không có bất kì hàng chờ ưu tiên nào.`);
							return;
						}
						bot.whisper(username, `> Hàng chờ ưu tiên là ${prio}`);
					}

					if (newCmd === bp + "normalqueue" || newCmd === bp + "nq") {
						if (queue < 1) {
							bot.whisper(username, `> Không có bất kì hàng chờ nào.`);
							return;
						}

						bot.whisper(username, `> Hàng chờ bình thường là ${queue}`);
					}

					if (newCmd === bp + "q" || newCmd === bp + "queue" || newCmd === bp + "que") {
						bot.whisper(username, `> Hàng chờ bình thường là ${queue}, hàng chờ ưu tiên là ${prio}`);

					}
				}, 2 * 1000);

			});
		}

		if(newCmd === bp + "2bqueue" || newCmd === bp + "2bq") {
			superagent.get("https://2b2t.io/api/queue?last=true").end((err, data) => {
				let queue = data.body[0][1];
				if(err) {
					queue = "Error";
				}
				superagent.get("https://api.2b2t.dev/prioq").end((err, dataq) => {
					let prio = dataq.body[1];	
					if(err) {
						prio = "Error"
					}
					bot.whisper(username, "> Hàng chờ 2b2t là " + queue + ", hàng chờ ưu tiên là " + prio)
				});
			});
		}

		if(newCmd === bp + "buykit") {
			setTimeout(function () {
				bot.whisper(username, "> Revolution Shop : https://discord.gg/nzm2SnDBGX")
			}, 2 * 1000);

		}

		if(newCmd === bp + "quit") {
			if(!dev) return;
			bot.quit("")
			disconnectRequest = true;
		}

		if(newCmd === bp + "players") {
			var name = Object.values(bot.players).map(p => p.username);
			// console.log(name.length)
			setTimeout(function () {
				bot.whisper(username, "> Có " + name.length + " player đang online!");
			}, 2 * 1000);
		}

		if(newCmd === bp + "runtime") {
			setTimeout(function () {
				bot.whisper(username, "> Bot đã hoạt động từ " + hour + "h " + minutes + "	m " + seconds + "s trước.");
			}, 2 * 1000);
		}
		// check > msg
		if (logger.startsWith(">")) {
			color = "2EA711";
		}

		const dauhuyen = logger.replace(/`/ig, "\\`");
		const dausao = dauhuyen.replace(/_/ig, "\\_");
		const newLogger = dausao.replace("*", "\\*");
		var newUsername = username;
		if(username !== undefined) {
			newUsername = username.replace(/_/ig, "\\_");
		}
		
		if (newLogger === undefined) {
			newLogger = logger;
		}

		// MAIN chat
		var chat = new Discord.MessageEmbed()
			.setDescription(`**<${newUsername}>** ${newLogger}`)
			.setColor(color);
		try {
			client.channels.cache.get(defaultChannel).send(chat);
			color = "0x979797";
			msg = false;
		} catch (e) {
			if (!dev) return
			console.log("CHAT MESSAGE ERROR MAIN", e)
		}

	});

	/*
	 *
	 *						DISCONNECT_SERVERS
	 *  
	 * 
	 */

	// bot end 
	var isRestarting;
	var unknownReason = true;

	bot.on('kicked', (reason, loggedIn) => {
		console.log(reason, loggedIn);
		if (reason.text == "You are already connected to this proxy!") {
			console.log("Bot end for another is active!");
			process.exit();
		}
		// {"text":"","extra":[{"text":"2y2c "},{"text":"đang restart quay lại sau","color":"gold"}]}
		// var stro = reason.toString().replace(/{"text":"","extra":\[{"text":"2y2c "},{"text":"/ig, "").replace(/","color":"gold"}\]}/ig, "")
		// console.log(stro)
		if (reason.includes("đang restart quay lại sau")) { // nhớ xem string là gì
			isRestarting = true;
			unknownReason = false;
			// console.log("work")
		} else {
			isRestarting = false;
		}
	})

	/*
	 *
	 *					END_CONNECT_TO_SERVERS
	 *  
	 * 
	 */
	
	bot.on('end', () => {
		client.user.setActivity("");
		setTimeout(() => {
			if(isRestarting) {
				var reconnect = new Discord.MessageEmbed()
					.setDescription(`⚠️ Server đang restart hoặc đã crash. Bot sẽ vào lại server sau 5 phút! ⚠️`)
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
										.setDescription("Bot đã ngắt kết nối đến server. Vào lại sau 1 phút." + `\nĐã hoạt động từ ${hour}h ${minutes}m ${seconds}s trước.`)
										.setColor("F71319"); // cam

				var notf = new Discord.MessageEmbed()
										.setDescription("🏮 Bot đã ngắt kết nối đến server. 🏮")
										.setColor("F71319"); // cam

					client.channels.cache.get(defaultChannel).send(notf);
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
								.setDescription("Bot đã mất kết nối đến server. Vào lại sau 1 phút." + `\nĐã hoạt động từ ${hour}h ${minutes}m ${seconds}s trước.`)
								.setColor("F71319"); // cam

				var notf = new Discord.MessageEmbed()
										.setDescription("🏮 Bot đã mất kết nối đến server. 🏮")
										.setColor("F71319"); // cam
				setTimeout(() => {
					client.channels.cache.get(defaultChannel).send(notf);
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
		const user = msg.mentions.users.first();
		if (msg.author.bot) return; // return author is bot
		if (user) return;

		if (dev) {
			if (msg.channel.id === "802456011252039680") {
				if (msg.author == client.user) return;
				setTimeout(() => {
					bot.chat(msg.content);
				}, 1 * 1000);
			}
			if (msg.channel.id == '802454010400604161') {
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

				var str = content;
				var chat = str.charAt(0).toUpperCase() + str.substr(1, str.length);

				if(msg.content.startsWith("/")) return;
				setTimeout(() => {
					bot.chat(`> ${msg.author.tag} » ${chat}`);
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
					var correctContent = content.substr(3 + args[0].length, content.length + 1);
					bot.whisper(args[0], `[${msg.author.tag}] ${correctContent}`)
				}
			}

			if(command === "r") {
				if(!(msg.content.startsWith("/"))) {
					var correctContent = content.substr(2, content.length + 1);
					bot.chat(`/r [${msg.author.tag}] ${correctContent}`);
				}
			}

			var str = content;
			var chat = str.charAt(0).toUpperCase() + str.substr(1, str.length);

			setTimeout(() => {
				if(msg.content.startsWith("/")) return;
				bot.chat(`> ${msg.author.tag} » ${chat}`);
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

	var cmdChannel = client.channels.cache.get('795147809850130514').toString();

	var cmdonly = new Discord.MessageEmbed()
		.setDescription(`Hãy sang ${cmdChannel} nhé.`)
		.setColor("0xC51515");

	if (message.channel.id !== "795147809850130514" && message.author.id !== "425599739837284362") {
		setTimeout(() => {
			message.delete();
		}, 3000);
		message.channel.send(cmdonly).then(msg => { msg.delete({ timeout: 10000 }) })
	}

	if(command === "resetdata") {
		if(message.author.id === "425599739837284362") {
			let data = db.get(`${args[0]}`);
			if(data === null) {
				var embed = new Discord.MessageEmbed()
								.setDescription(`Data **${args[0]}** không tồn tại.`)
								.setColor("0xC51515");
			
			message.channel.send(embed).then(msg => { msg.delete({ timeout: 10000 }) })
			} else {
				db.set(`${args[0]}`, 0);
				var embed = new Discord.MessageEmbed()
									.setDescription(`Đã reset data **${args[0]}**`)
									.setColor("0xC51515");
				
				message.channel.send(embed).then(msg => { msg.delete({ timeout: 10000 }) })
			}
		} else {
			var embed = new Discord.MessageEmbed()
								.setDescription("Bạn không được phép sử dụng!")
								.setColor("0xC51515");
			
			message.channel.send(embed).then(msg => { msg.delete({ timeout: 10000 }) })
		}
	}

	if (command === "stats" || command === "kd") {
		var e = new Discord.MessageEmbed()
			.setDescription('Bạn cần nhập tên để xem thông tin. - `' + prefix + 'kd <name>`')
			.setColor('0xC51515')

		if (!args[0]) return message.channel.send(e)

		let kills = db.get(`${args[0]}_kills`);
		let deads = db.get(`${args[0]}_dead`);

		if (kills === null) {
			kills = 0;
		}

		if (deads === null) {
			deads = 0;
		}

		// alex, steve
		var ratio = kills / deads;
		var ratioFixed = ratio.toFixed(2);

		if (ratioFixed === "NaN" || ratioFixed === "Infinity") {
			ratioFixed = "0.00";
		}

		setTimeout(() => {
			var embed = new Discord.MessageEmbed()
				.setAuthor(`${args[0]}'s statistics`, `https://minotar.net/helm/${args[0]}`)
				.setURL(`https://namemc.com/` + args[0])
				.addField(`Kills`, `${kills}`, true)
				.addField(`Deaths`, `${deads}`, true )
				.addField(`K/D Ratio`, `${ratioFixed}`, true )
				.setThumbnail(`https://minotar.net/helm/${args[0]}`)
				.setColor(0x2EA711)
				.setFooter(footer)
				.setTimestamp();

			message.channel.send(embed)
		}, 1 * 1000);
	}

	if (command === "playtime" || command === "pt") {
		var e = new Discord.MessageEmbed()
			.setDescription('Bạn cần nhập tên để xem thông tin. - `' + prefix + 'pt <name>`')
			.setColor('0xC51515')

		if (!args[0]) return message.channel.send(e)

		let playtime = db.get(`${args[0]}_playtime`);

		setTimeout(() => {
			if (playtime === null) {
				playtime = `Chưa từng được tính thời gian.`;
				var nodata = new Discord.MessageEmbed()
					.setDescription(`${args[0]}: Chưa từng được tính thời gian.`)
					.setColor('0xC51515')

				message.channel.send(nodata);
				return;
			}

			var temp = playtime / 1000;
			var day = 0, hour = 0, minutes = 0;
			day = parseInt(temp / 86400)
			hour = parseInt(((temp - day * 86400) / 3600))
			minutes = parseInt(((temp - day * 86400 - hour * 3600)) / 60)

			var string;

			if( day < 1 ) {
				if(minutes > 0 && hour > 0 ) {
					string = hour + " giờ " + minutes + " phút";		
				}
				if(minutes < 1 && hour > 0) {
					string = hour + " giờ ";
				}
				if(minutes > 0 && hour < 1) {
					string = minutes + " phút";
				}
			} else {
				if(minutes > 0 && hour > 0 ) {
					string = day + " ngày " + hour + " giờ " + minutes + " phút";		
				}
				if(minutes < 1 && hour > 0) {
					string = day + " ngày " + hour + " giờ ";
				}
				if(minutes > 0 && hour < 1) {
					string = day + " ngày " + minutes + " phút";
				}

			}

			var embed = new Discord.MessageEmbed()
				.setDescription(`${args[0]}: ${string}`)
				.setColor(0x2EA711);

			message.channel.send(embed);
		}, 1 * 1000);
	}
	if (command === "seen") {
		let lastseen = db.get(`${args[0]}_lastseen`);

		var e = new Discord.MessageEmbed()
			.setDescription('Bạn cần nhập tên để xem thông tin. - `' + prefix + 'seen <name>`')
			.setColor('0xC51515')

		if (!args[0]) return message.channel.send(e)

		var d = new Date();
		var time = d.getTime();

		var ticks = time - lastseen;

		setTimeout(() => {
			if (lastseen === null) {
				var nodata = new Discord.MessageEmbed()
					.setDescription(`Chưa từng nhìn thấy ${args[0]}.`)
					.setColor('0xC51515')

				message.channel.send(nodata);
				return;
			}

			var temp = ticks / 1000;
			var day = 0, hour = 0, minutes = 0;
			day = parseInt(temp / 86400)
			hour = parseInt(((temp - day * 86400) / 3600))
			minutes = parseInt(((temp - day * 86400 - hour * 3600)) / 60)

			var age;
			if (day > 0) {
				age = `${day} ngày`;
			} else {
				age = `${hour} giờ ${minutes} phút`;
				if (hour < 1) {
					age = `${minutes} phút`;
				}
			}

			var embed = new Discord.MessageEmbed()
				.setDescription(`Đã nhìn thấy ${args[0]} từ ${age} trước.`)
				.setColor(0x2EA711);

			message.channel.send(embed);
		}, 1 * 1000);

	}

	if (command === "joindate" || command === "jd") {
		let firstjoin = db.get(`${args[0]}_firstjoin`);

		var e = new Discord.MessageEmbed()
			.setDescription('Bạn cần nhập tên để xem thông tin. - `' + prefix + 'jd <name>`')
			.setColor('0xC51515')

		if (!args[0]) return message.channel.send(e)

		setTimeout(() => {
			if (firstjoin === null) {
				var nodata = new Discord.MessageEmbed()
					.setDescription('Không tìm thấy người chơi.')
					.setColor('0xC51515')

				message.channel.send(nodata)
				return;
			}

			var embed = new Discord.MessageEmbed()
				.setDescription(`${args[0]}: ${firstjoin}`)
				.setColor(0x2EA711);

			message.channel.send(embed);
		}, 3 * 1000);
	}

	if (command === "2bq" || command === "2bqueue") {
		superagent.get("https://2b2t.io/api/queue?last=true").end((err, data) => {
			let queue = data.body[0][1];
			superagent.get("https://api.2b2t.dev/prioq").end((err, dataq) => {
				let prio = dataq.body[1];
				var queue = new Discord.MessageEmbed()
									.setDescription("Hàng chờ bình thường là " + queue + "\n Hàng chờ ưu tiên là " + prio)
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
				+ '!buykit - ``Ghé thăm shop.`` \n'
				+ '!players - ``Xem người chơi online.`` \n')
				.setFooter(footer)
				.setTimestamp();

			message.channel.send(ingamecmd);
		}
		if (args[0] === "check") {
			var check = new Discord.MessageEmbed()
				.setTitle("*[Check Command]*")
				.setColor(0x000DFF)
				.setDescription(prefix + 'kd - ``Xem chỉ số K/D.``'
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
								.addField("*[Ingame Command]*", "help, tps, coordinate, kill, ping, queue, prio, stats, joindate, playtime, seen, 2bqueue, buykit, players. (!)", false)
								.setFooter(footer)
								.setTimestamp();

			message.channel.send(embed);
		}
	}

	mc.ping({ "host": config.ip }, (err, result) => {
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

			var old = players.toString().replace(",§6Cựu binh: §l0", "");
			var queue = old.toString().replace("§6Bình thường: §l", "");

			var prio = players2.toString().replace("2y2c §6Queue Size,§6Ưu Tiên: §l", "");
			var status = "Queue: " + queue + " - Prio: " + prio + " - Online: " + result.players.online;

			// Queue command
			if (command === "queue" || command === "q" || command === "que" || command === "normalqueue") {
				const embed = new Discord.MessageEmbed()
					.setColor(0x000DFF)
					.setDescription(`Hàng chờ bình thường là ${queue}\n Hàng chờ ưu tiên là ${prio}.`)

				message.channel.send(embed).then(message => {
					message.delete({ timeout: 10000 });
				});

			}

			// Prio command
			if (command === "prio" || command === "p" || command === "prioqueue") {
				const embed = new Discord.MessageEmbed()
					.setColor(0x000DFF)
					.setDescription("Hàng chờ ưu tiên là " + prio + ".")

				message.channel.send(embed).then(message => {
					message.delete({ timeout: 10000 });
				});
			}

			// status command
			if (command === "status" || command === "stt") {
				const embed = new Discord.MessageEmbed()
					.setColor(0x000DFF)
					.setTitle('[Status Command]')
					.setDescription(status)
					.setFooter(footer)
					.setTimestamp();

				message.channel.send(embed).then(message => {
					message.delete({ timeout: 10000 });
				});
			}

			// online command
			if (command === "onl" || command === "online" || command === "o") {
				const embed = new Discord.MessageEmbed()
					.setColor(0x000DFF)
					.setTitle('[Online Command]')
					.setDescription("Số người chơi trong server: **" + result.players.online + "**")
					.setFooter(footer)
					.setTimestamp();

				message.channel.send(embed).then(message => {
					message.delete({ timeout: 10000 });
				});

			}
		}
	});
});

client.login(config.token).catch(err => console.log(err));
client.on("error", (e) => { console.error(e) });