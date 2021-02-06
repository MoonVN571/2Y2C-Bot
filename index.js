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
var tpsPlugin = require('mineflayer-tps')(mineflayer)
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
 *  START BOT: Call function bot
 *  WHISPERS: Whisper chat event
 *  WINDOW OPEN: Authencate to the server
 *  LOGIN: Start some functions
 *  STATS AND LOG ALL: Stats user and log all to discord in specific
 *  PLAYERs JOIN: Count something
 *  PLAYERs LEFT: Count something
 *  QUEUE SERVERS TAB: Log position and set status
 *  MAIN SERVERS TAB STATUS: Set topic channel 
 *  CHAT BOX SERVERS: Command and chat log to specific channel
 *  DISCONNECT SERVERS: Kicked reason
 *  END CONNECT TO SERVERS: End connect to server and reconnect
 *  CHAT ON DSICORD: Link chat discord to server
 *  COMMAND DISCORD: Discord bot commands
 */


/*
 *
 *										READY
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
*												START BOT
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

	bot.loadPlugin(tpsPlugin); // load tps plugins mineflayer

	// uptime bot on server
	var minutess = 0;
	var hourss = 0;
	var totalSeconds = 0;

	// minecraft bot uptime
	function setTime() {
		totalSeconds += 600;
		hourss = parseInt(totalSeconds / 3600);
		minutess = (totalSeconds - (hourss * 3600)) / 60;
		if (hourss === "NaH") {
			hourss = "0";
		} else if (minutess === "NaH") {
			minutess = "0";
		}
	}

	bot.chatAddPattern(/(.+) nhắn: (.+)/, 'whisper', '2y2c.org nhắn');
	bot.chatAddPattern(/(.+) whisper: (.+)/, 'whisper', '2y2c.org whisper');

	/*
	 *
	 *							WHISPERS
	 *  
	 * 
	 */
	bot.on('whisper', (username, message, rawMessage) => {
		if (username === bot.usermame) return;
		console.log(`${username}: ${message}`)
		var strName = username.replace(/_/ig, "\\_");
		var newusername;
		if(strName.startsWith("[Donator]")) {
			newusername = strName.replace("[Donator]", "");
		}
		if(strName.startsWith("[2B2T]")) {
			newusername = strName.replace("[2B2T]", "");
		}
		var huyen = message.replace(/`/ig, "\\`")
		var duoi = huyen.replace(/_/ig, "\\_")
		var sao = duoi.replace("*", "\*")
		var newmsg = sao.replace("**", "\**")

		if (newmsg === undefined) {
			newmsg = message;
		}

		if (newusername === undefined) {
			newusername = username;
		}

		const whisper = new Discord.MessageEmbed()
			.setDescription(`${newusername} nhắn: ${newmsg}`)
			.setColor("0xFD00FF");

		try {
			client.channels.cache.get(defaultChannel).send(whisper);
		} catch (e) {
			if (!dev) return;
			console.log("Whisper MSG ", e)
		}
	});

	/*
	 *
	 *					WINDOW OPEN
	 *  
	 * 
	 */
	var isInLogin = false; // check lan 1
	var isMainServer = false; // lan 2, check main server de disconnect neu nhu tab ccontent /= 2YOUNG
	bot.on('windowOpen', () => { // slot button mode cb
		if (dev) {
			console.log('Window open')
		}
		isInLogin = true;

		bot.clickWindow(4, 0, 0)
		delay(1000)
		bot.clickWindow(3, 0, 0)
		bot.clickWindow(7, 0, 0)
		bot.clickWindow(1, 0, 0)

		bot.setQuickBarSlot(0)
		bot.activateItem()
	});

	/*
	 *
	 *														LOGIN
	 *  
	 * 
	 */
	// while connect to the server
	bot.on('login', () => {
		// uptime method
		totalSeconds = 0;
		setInterval(setTime, 10 * 60 * 1000);

		setInterval(function () {
			if (lobby) return;
			Object.values(bot.players).map(player => addPlayTime(player.username));
			//Object.values(bot.players).forEach(p => addPlayTime(p.username))

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
			console.log("joined the server.")
		}

		const queuejoined = new Discord.MessageEmbed()
			.setDescription(`**Bot** đã tham gia hàng chờ!`)
			.setColor("FFFB00");

		try {
			if(dev) {
				client.channels.cache.get("807045720699830273").send(queuejoined);
			} else {
				client.channels.cache.get("806881615623880704").send(queuejoined);
			}
			
		} catch (e) {
			if (!dev) return;
			console.log("JOINED THE SERVER MESSAGE ERROR ", e)
		}

	});

	/*
	 *
	 *														STATS AND LOG ALL
	 *  
	 * 
	 */
	bot.on('message', message => {
		var newcolor = 'DB2D2D';
		var logger = message.toString();

		// value to embed
		var deathMsg;

		var embed = new Discord.MessageEmbed()
			.setDescription(logger)
			.setColor(color);

		try {
			if (dev) {
				client.channels.cache.get("802456011252039680").send(embed) // gui tat ca tin nhan vao dev ( dev all chat )
			} else {
				client.channels.cache.get("797426761142632450").send(embed) // gui tat ca tin nhan vao main ( main all chat )
			}

		} catch (E) {
			if (!dev) return;
			console.log("ERR", E)
		}

		if (logger === '2y2c đã full') return;

		if (logger === "Đang vào 2y2c") {
			setTimeout(() => {
				if (!isInLogin && !isMainServer) {
					// bot.quit("login error")
					// console.log("quit")
				}
			}, 2 * 60 * 1000);

			setTimeout(() => { // delay before login
				lobby = false;
			}, 5 * 1000);

			const joined = new Discord.MessageEmbed()
				.setDescription(`**Bot** đang vào server chính!`)
				.setColor("FFFB00");

			try {
				setTimeout(function () {
					if(dev) {
						client.channels.cache.get("807045720699830273").send(joined);
					} else {
						client.channels.cache.get("806881615623880704").send(joined);
					}
				}, 1 * 1000);
			} catch (e) {
				if (!dev) return;
				console.log("JOINED THE MAIN SERVER MSG ERROR ", e)
			}
			uuid = 0;
		}

		if (logger === undefined) return; // return if msg is undefined
		if (logger === null) return; // return if null msg

		var nocheck = message.toString().split(' ')[0]; // check username with format <>
		// return message on chat
		if (nocheck.startsWith('<') && nocheck.endsWith(">")) return;
		
		var splitLogger = logger.split(' ')[0];
		if (logger.startsWith("nhắn cho") || splitLogger === "To") { // check bot send message
			var checkBySplit = logger.split(' ')[2];
			var newStr;
			if(checkBySplit.startsWith("[Donator]")) {
				newStr = checkBySplit.replace("[Donator]", "") 
			}

			if(checkBySplit.startsWith("[2B2T]")) {
				newStr = checkBySplit.replace("[2B2T]", "") 
			}

			newcolor = "0xFD00FF";
			deathMsg = logger;
		}
		if (logger.startsWith("[Server]")) {
			newcolor = '0xb60000';
			deathMsg = logger;
		}

		if (logger.startsWith("[Broadcast]")) {
			newcolor = "0xb60000";
			deathMsg = logger;
		}

		if (logger === "Donate để duy trì server admin đang đói chết con *ĩ *ẹ.") {
			newcolor = '0xb60000';
			deathMsg = logger;
		}

		if (logger === "diễn đàn của server https://www.reddit.com/r/2y2c/.") {
			newcolor = '0xb60000';
			deathMsg = logger;

		}
		if (logger === "server thường back up vào 1h sáng nên tps đsẽ tụt vào khoảng thời gian này.") {
			newcolor = '0xb60000';
			deathMsg = logger;

		}

		var splitLogger2 = logger.split(' ')[1];
		// console.log(splitLogger2)
		if(splitLogger2 === "nhắn:") return;

		// suicide when see this
		if (logger === "You cannot chat until you move!") {
			bot.chat('/kill')
		}


		// kill Message
		if (logger.includes('chết cháy khi đánh với')) {
			if (logger.includes('Zombie')) {
				deathMsg = logger;
				return;
			}

			var str = logger;
			var user = str.split(" ")[6];

			let data = db.get(`${user}_kills`);

			if (data === null) {
				db.set(`${user}_kills`, 1)
			} else {
				db.add(`${user}_kills`, 1)
			}
			deathMsg = logger;
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
			if (logger.includes('Wither')) {
				deathMsg = logger;
				return;
			}

			if (logger.includes('Sì-ke')) {
				deathMsg = logger;
				return;
			}

			if (logger.includes('Zombie')) {
				deathMsg = logger;
				return;
			}

			var str = logger;
			var user = str.split(" ")[12];

			let data = db.get(`${user}_kills`);

			if (data === null) {
				db.set(`${user}_kills`, 1)
			} else {
				db.add(`${user}_kills`, 1)
			}
			deathMsg = logger;

		}

		if (logger.includes('chết chìm khi cố gắng thoát khỏi')) {
			if (logger.includes('Zombie')) {
				deathMsg = logger;
				return;
			}
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

			let data = db.get(`${user}_kills`);

			if (data === null) {
				db.set(`${user}_kills`, 1)
			} else {
				db.add(`${user}_kills`, 1)
			}
			deathMsg = logger;
		}

		if (logger.includes('bay con mẹ nó lên trời bởi')) {
			var str = logger;
			var user = str.split(" ")[8];
			if(user === "PRIMED_TNT(?)") {
				deathMsg = logger;
				return
			}

			let data = db.get(`${user}_kills`);

			if (data === null) {
				db.set(`${user}_kills`, 1)
			} else {
				db.add(`${user}_kills`, 1)
			}
			deathMsg = logger;

		}

		if (logger.includes('đã bị phản sát thương bởi')) {
			var str = logger;
			var user = str.split(" ")[7];

			let data = db.get(`${user}_kills`);

			if (data === null) {
				db.set(`${user}_kills`, 1)
			} else {
				db.add(`${user}_kills`, 1)
			}
			deathMsg = logger;

		}

		if (logger.includes('đã bị giết bởi')) {
			if (logger.includes('Zombie Pigman')) {
				deathMsg = logger;
				return;
			} else if (logger.includes('Wither')) {
				deathMsg = logger;
				return;
			} else if (logger.includes('Sì-ke')) {
				deathMsg = logger;
				return;
			} else if (logger.includes('cá')) {
				deathMsg = logger;
				return;
			}

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

		if (logger.includes('khô máu với')) {
			var str = logger;
			var user = str.split(" ")[4];

			let data = db.get(`${user}_kills`);

			if (data === null) {
				db.set(`${user}_kills`, 1)
			} else {
				db.add(`${user}_kills`, 1)
			}
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
			|| logger.includes('không')) {
			var user = logger.split(" ")[0];
			let data = db.get(`${user}_dead`);
	
			if (data === null) {
				db.set(`${user}_dead`, 1)
			} else {
				db.add(`${user}_dead`, 1)
			}

			deathMsg = logger;
		}

		// return error message
		if (deathMsg === undefined) return;

		var strnn = deathMsg.replace("**", "\\**")
		var strn = strnn.replace("*", "\\*")
		var str = strn.replace(/`/ig, "\\`")
		var newDeathMsg = str.replace(/_/ig, "\\_")

		if (newDeathMsg === undefined) {
			newDeathMsg = deathMsg;
		}


		var embedDeath = new Discord.MessageEmbed()
			.setDescription(newDeathMsg)
			.setColor(newcolor);

		try {
			client.channels.cache.get(defaultChannel).send(embedDeath);
			newcolor = "DB2D2D";
		} catch (e) {
			if (!dev) return;
			console.log("CHAT MESSAGE ERROR", e)
		}
	})

	/*
	 *
	 *														PLAYERS JOIN
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

		db.set(`${username}_lastseen`, 1)

		if (username === "Ha_My" || username === "PhanThiHaMy") {
			if (dev) return;
			try {
				client.channels.cache.get("807048523027578890").send(username + " joined");
			} catch (e) {
				if (!dev) return;
				console.log("JOIN MESSAGE ERROR", e)
			}
		}

		if (newUsername === undefined) {
			newUsername = username;
		}

		// move xuong vi newUsername de replace username khac
		if(username === "A_Andrew" || username === "0Channy" || username === "TheGreatWall"
		|| username === "Ha_My" || username === "MoonVN" || username === "Huymouse" || username === "ZzEnderDragonz7") {
			var embed = new Discord.MessageEmbed()
				.setDescription(newUsername + " joined")
				.setColor('0xb60000')
				
			try {
				client.channels.cache.get("807506107840856064").send(embed);
			} catch (e) {
				if (!dev) return;
				console.log("JOIN MESSAGE ERROR", e)
			}
		}

		if (newUsername === bot.username) return;

		if (dev) return;
		var embed = new Discord.MessageEmbed()
			.setDescription(newUsername + " left")
			.setColor('0xb60000')

		try {
			client.channels.cache.get(defaultChannel).send(embed);
		} catch (e) {
			if (!dev) return;
			console.log("JOIN MESSAGE ERROR", e)
		}
	});
	
	/*
	 *
	 *								PLAYERS LEFT
	 *  
	 * 
	 */
	bot.on("playerLeft", (player) => {
		var username = player.username;
		var newUsername = username.replace(/_/ig, "\\_");

		if (username === "Ha_My" || username === "PhanThiHaMy") {
			if (dev) return;
			try {
				client.channels.cache.get("807048523027578890").send(username + " left");
			} catch (e) {
				if (!dev) return;
				console.log("JOIN MESSAGE ERROR", e)
			}
		}

		if (newUsername === undefined) {
			newUsername = username;
		}

		// move xuong vi newUsername de replace username khac
		if(username === "A_Andrew" || username === "0Channy" || username === "TheGreatWall"
		|| username === "Ha_My" || username === "MoonVN" || username === "Huymouse" || username === "ZzEnderDragonz7") {
			var embed = new Discord.MessageEmbed()
				.setDescription(newUsername + " joined")
				.setColor('0xb60000')
				
			try {
				client.channels.cache.get("807506107840856064").send(embed);
			} catch (e) {
				if (!dev) return;
				console.log("JOIN MESSAGE ERROR", e)
			}
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
		try {
			client.channels.cache.get(defaultChannel).send(embed);
		} catch (e) {
			if (!dev) return;
			console.log("LEAVE MESSAGE ERROR", e)
		}
	});

	/*
	 *
	 *														SPAWN
	 *  
	 * 
	 */
	var sending = false;
	var stats = false;
	bot.on('spawn', () => {
		// if (lobby) return;
		setInterval(function () {
			if (stats) return;
			stats = true;
			bot.swingArm("left");
			bot.look(Math.floor(Math.random() * Math.floor("360")), 0, true, null);
			antiAfk();
		}, 1 * 60 * 1000);

		function antiAfk() {
			setTimeout(function () {
				stats = false;
			}, 30 * 1000);
		}

		if(dev) return;
		var str = ' | > !lastseen <name> xem lần cuối nhìn thấy người chơi online. | > Kiểm tra hàng chờ 2b2t : !2bqueue | > Nếu bạn muốn mua kit, kiểm tra ngay : !buykit | > !firstseen <name> xem ngày người chơi lần đầu tham gia vào server. | > Tham gia bot discord tại : https://discord.gg/yrNvvkqp6w | > !pt <name> xem thời gian đã chơi | > Kiểm tra hàng chờ hiện tại : !queue | > !ping để xem ping của bạn | > !stats <name> xem chỉ số người khác.';
		var words = str.split(' | ');
		var random = words[Math.floor(Math.random() * words.length)];

		setInterval(function () {
			if (sending) return;
			sending = true;
			bot.chat(random)
			autoMsg();
		}, 20 * 60 * 1000);

		function autoMsg() {
			setTimeout(function () {
				sending = false;
			}, 1 * 60 * 1000);
		}

	});

	/*
	 *
	 *														QUEUE SERVERS TAB
	 *  
	 * 
	 */
	var ontab = false;
	bot._client.on("playerlist_header", data => {
		// var e = true;
		// setTimeout(() => {
		// 	e = false;
		// }, 3 * 1000);
		// if (e) return; // wait function

		if (!lobby) {
			queueIsGone = true;
			return;
		}
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

		if (s7 === null) return;
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
				if(currentQueue == "None") {
					currentQueue = "-1";
				}
				var status = "Trong hàng chờ: " + currentQueue + "/" + queue + " - Queue: " + queue;

				try {
					client.user.setActivity(status, { type: 'PLAYING' });
				} catch (e) {
					if (!dev) return;
					console.log("SET STT ERROR", e)
				}
			}
		});

		try {
			var embed = new Discord.MessageEmbed()
				.setDescription(s7)
				.setColor("0xFFCE00")

			client.channels.cache.get(defaultChannel).send(embed);
		} catch (e) {
			if (!dev) return;
			console.log("QUEUE MESSAGE ", e)
		}

		function checktab() {
			setTimeout(() => {
				ontab = false;
			}, 20 * 1000);
		}

	});

	/*
	 *
	 *														MAIN SERVERS TAB STATUS
	 *  
	 * 
	 */
	var statusbot = false;
	bot._client.on("playerlist_header", data => {
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
				var status = "Queue: " + queue + " - Prio: " + prio + " - TPS: " + tps;

				try {
					client.user.setActivity(status, { type: 'PLAYING' });
				} catch (e) {
					if (!dev) return;
					console.log("SET TOPIC ERROR", e)
				}
			}
		});

		function returnStt() {
			setTimeout(() => {
				statusbot = false;
			}, 1 * 60 * 1000);
		}
	});
	/**
	 * 
	 * 									RESTART NOTIFY
	 * 
	 * 
	 */
	bot.on('chat', (username, message) => {
		var log;
		if (message === "Server sẽ Restart sau 15 phút!") {
			if (dev) return;
			log = message;
			try {
				client.channels.cache.get('795534684967665695').send("@everyone " + message);
			} catch(e) { }
		}
		if (message === "Server sẽ Restart sau 5 phút!") {
			if (dev) return;
			log = message;
			try {
				client.channels.cache.get('795534684967665695').send("@everyone " + message);
			} catch(e) { }
		}
		if (message === "Server Restarting!") {
			if (dev) return;
			log = message;
			try {
				client.channels.cache.get('795534684967665695').send("@everyone " + message);
			} catch(e) { }
			
		}

		if(log === undefined) return;
		if(log === null) return;

		// value to embed
		var embed = new Discord.MessageEmbed()
		.setDescription(log)
		.setColor("0xC51515");

		try {
			client.channels.cache.get("795135669868822528").send(embed) // gui tat ca tin nhan vao dev ( dev all chat )

		} catch (E) {
			if (!dev) return;
			console.log("RES", E)
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
		// if(lobby) return;
		// Base header modified
		var header = data.header;
		// console.log(header)

		var str1 = header.replace(/{"text":"/ig, "")
		var str2 = str1.replace(/"}/ig, "")
		var str3 = str2.replace(/\\n/ig, " ")
		var str = str3.replace(/§r|§6|§7|§8|§l|§r|§o|-|§d|§3/ig, "")
		var space = str.replace("    ", "");

		var strReturn = space.split(' ')[0];
		if (strReturn === "2YOUNG") {
			isMainServer = true;
		}

		if (lobby) return;
		if (onmain) return;
		onmain = true;
		checktab(); // settimeout function to return

		var footer = data.footer;
		var ss1 = footer.replace(/\\n/ig, " ");
		var ss2 = ss1.replace(/-/ig, "");
		var ss3 = ss2.replace(/§3|§d|§a|§r/ig, "");
		var ss4 = ss3.replace(/{"text":"/ig, "")
		// console.log(ss4)
		var ss5 = ss4.replace('    ', " - ")
		var ss6 = ss5.replace('    ', " - ")
		var ss7 = ss6.replace('    ', " - ")
		var ss8 = ss7.split('§7')[0];

		var topics = ss8 + "\nĐã tham gia server từ " + hourss + " giờ " + minutess + " phút trước.";
		try {
			client.channels.cache.get(defaultChannel).setTopic(topics)
		} catch (e) {
			if (!dev) return;
			console.log("SET TOPIC ERROR", e)
		}

		function checktab() {
			setTimeout(() => {
				onmain = false;
			}, 10 * 60 * 1000);
		}
	});

	/*
	 *
	 *					CHAT BOX SERVERS
	 *  
	 * 
	 */
	bot.on('message', msg => {
		if (msg === "[AutoRestart] Server sẽ Restart sau 15 phút!") {
			if (dev) return;
			var embed = new Discord.MessageEmbed()
							.setDescription(msg)
							.setColor("0xC51515");
			try {
				client.channels.cache.get('795534684967665695').send("@everyone " + message);
				client.channels.cache.get(defaultChannel).send(embed);
			} catch(e) { }
		}
		if (msg === "[AutoRestart] Server sẽ Restart sau 5 phút!") {
			if (dev) return;
			var embed = new Discord.MessageEmbed()
							.setDescription(message)
							.setColor("0xC51515");
			try {
				client.channels.cache.get('795534684967665695').send("@everyone " + message);
				client.channels.cache.get(defaultChannel).send(embed);
			} catch(e) { }
		}
		if (msg === "[AutoRestart] Server Restarting!") {
			if (dev) return;
			var embed = new Discord.MessageEmbed()
							.setDescription(msg)
							.setColor("0xC51515");
			try {
				client.channels.cache.get('795534684967665695').send("@everyone " + message);
				client.channels.cache.get(defaultChannel).send(embed);
			} catch(e) { }
			
		}

		// Start
		if (!(msg.toString().startsWith("<"))) return; // return message no <
		var nocheck = msg.toString().split(' ')[0];
		var username1 = nocheck.replace(/</ig, ""); // xoa < > format chat
		var username2 = username1.replace(/>/ig, "");
		var username;
		if (username2.startsWith("[2B2T]")) {
			logger = username2.replace("[2B2T]", "")
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

		// console.log(`<${username}> ${logger}`)

		var bp;
		if (dev) {
			bp = "Dev!";
		} else {
			bp = "!";
		}

		var newCmd;
		if (logger.startsWith(bp) && logger.endsWith(".")) {
			newCmd = logger.replace(".", "")
		} else {
			newCmd = logger;
		}

		if (newCmd == bp + "coords" || newCmd == bp + "!coordinate" || newCmd == bp + "xyz") {
			var posi = bot.entity.position;
			setTimeout(function () {
				bot.whisper(username, `> Toạ độ: ${posi}`);
			}, 2 * 1000);
		}

		if (logger.startsWith(bp + "lastseen")) {
			var args;

			var str = logger.replace(".", "");
			args = str.split(" ")[1];

			if (newCmd === bp + "lastseen") {
				args = username;
			}
			let lastseen = db.get(`${args}_lastseen`);
			var d = new Date();
			var time = d.getTime();

			var ticks = (time - lastseen); // tick de tinh second

			bot.whisper(username, "Thông số được tính từ ngày 02/02") // info
			setTimeout(() => {
				if (lastseen === null) {
					bot.whisper(username, `> Chưa từng nhìn thấy ${args}.`);
					return;
				}

				if (lastseen < 2) {
					bot.whisper(username, `> Người chơi ${args} đang online.`);
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

		if (logger.startsWith(bp + "firstseen")) {
			var args;

			var str = logger.replace(".", "");
			args = str.split(" ")[1];

			if (newCmd === bp + "firstseen") {
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
			} else {
				// check args la username
				var array = Object.values(bot.players).map(player => player.username);
				var check = array.find(element => element == args);
				if(check === undefined) {
					args = username;
				} else {
				}
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

			if (args === "Maple") {
				setTimeout(function () {
					bot.whisper(username, `> Maple: [K: 0 - D: 0 - Ratio: 0.00]`)
				}, 2 * 1000);
				return;
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
			isCommand = true;
			setTimeout(function () {
				bot.whisper(username, '> !coords, !discord, !tps, !kill, !ping, !q, !stats, !firstseen, !playtime, !lastseen, !2bqueue')
			}, 2 * 1000);
		}

		// TPS
		if (newCmd === bp + "tps") {
			isCommand = true;
			setTimeout(function () {
				bot.whisper(username, `> TPS: ${bot.getTps()}`)
			}, 2 * 1000);
		}

		if (newCmd === bp + "discord") {
			isCommand = true;
			setTimeout(function () {
				bot.whisper(username, `> Discord Bot: https://discord.gg/yrNvvkqp6w`)
			}, 2 * 1000);
		}

		if (logger === bp + "ping.") {
			isCommand = true;
			setTimeout(function () {
				try {
					bot.whisper(username, "> Ping của bạn: " + bot.players[username].ping + "ms");

				} catch (E) {
					if (!dev) return;
					console.log("PING ERROR", E)
				}
			}, 2 * 1000);
		}

		// Ping other
		if (logger.startsWith(bp + "ping")) {
			isCommand = true;
			if (logger === bp + "ping.") {

			} else {
				var str = logger.replace(".", "");
				var user = str.split(" ")[1];

				setTimeout(function () {
					try {
						bot.whisper(username, "> " + user + ": " + bot.players[user].ping + "ms");
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
			isCommand = true;
			setTimeout(function () {
				bot.chat('/kill')
			}, 2 * 1000);
		}

		if (newCmd === bp + "queue" || newCmd === bp + "que" || newCmd === bp + "q" || newCmd === bp + "normalqueue" || newCmd === bp + "nq" || newCmd === bp + "prio" || newCmd === bp + "prioqueue") {
			isCommand = true;
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
				superagent.get("https://api.2b2t.dev/prioq").end((err, dataq) => {
					let prio = dataq.body[1];
					bot.whisper(username, "Hàng chờ 2b2t là " + queue + ", hàng chờ ưu tiên là " + prio)
				});
			});
		}

		if(newCmd === bp + "buykit") {
			setTimeout(function () {
				bot.whisper(username, "Revolution Shop : https://discord.gg/vaADQJWTsC")
			}, 2 * 1000);

		}

		// check > msg
		if (logger.startsWith(">")) {
			color = "2EA711";
		}

		const dauhuyen = logger.replace(/`/ig, "\\`");
		const dausao = dauhuyen.replace(/_/ig, "\\_");
		const dausaohai = dausao.replace("**", "\\**");
		const newLogger = dausaohai.replace("*", "\*");
		const newUsername = username.replace(/_/ig, "\\_");

		if (newLogger === undefined) {
			newLogger = logger;
		}

		if (newUsername === undefined) {
			newUsername = username;
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
	 *														DISCONNECT SERVERS
	 *  
	 * 
	 */
	var onetimes = false;
	bot.on('kicked', (reason) => {
		console.log(reason);
		client.user.setActivity("");

		/*
		if(reason.text == "login error") {
			var reconnect = new Discord.MessageEmbed()
				.setDescription(`Bot đã ngắt kết nối đến server. Vào lại sau 3 phút.`)
				.setColor("0xFFFB00");

			try {
				if(dev) {
					client.channels.cache.get("807045720699830273").send(reconnect);
				} else {
					client.channels.cache.get("806881615623880704").send(reconnect);
				}
			} catch (e) {
				if (!dev) return;
				console.log("ERROR SEND IN4 Kicked", e);
			}
			return;
		} */

		if (reason.text == "You are already connected to this proxy!") {
			console.log("Bot end for another is active!");
			process.exit();
			
		}

		if (reason.text == "You have lost connection to the server!") {
			var reconnect = new Discord.MessageEmbed()
				.setDescription(`Bot đã mất kết nối. Vào lại sau 3 phút.\nĐã hoạt động ${hourss} giờ ${minutess} phút trước.`)
				.setColor("0xFFFB00");

			try {
				if(dev) {
					client.channels.cache.get("807045720699830273").send(reconnect);
				} else {
					client.channels.cache.get("806881615623880704").send(reconnect);
				}
			} catch (e) {
				if (!dev) return;
				console.log("ERROR SEND IN4 Kicked", e);
			}
			totalSeconds = 0; // set total second = 0
			return;
		}

		if (reason.includes("đang restart quay lại sau")) { // nhớ xem string là gì
			var reconnect = new Discord.MessageEmbed()
				.setDescription(`Server đang restart hoặc crash. Đã hoạt động ${hourss} giờ ${minutess} phút trước.`)
				.setColor("0xFFFB00");

			try {
				if(dev) {
					client.channels.cache.get("807045720699830273").send(reconnect);
				} else {
					client.channels.cache.get("806881615623880704").send(reconnect);
				}
			} catch (e) {
				if (!dev) return;
				console.log("ERROR SEND IN4 Kicked", e);
			}
			totalSeconds = 0; // set total second = 0
		}
	})

	/*
	 *
	 *														END CONNECT TO SERVERS
	 *  
	 * 
	 */
	bot.on('end', () => {
		// totalSeconds = 0; // set total second = 0
		waitUntil(180000, 30, function condition() {
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
	});

	/*
	 *
	 *														CHAT ON DSICORD
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
					if(!(msg.content.startsWith("/"))) return;
					var correctContent = content.substr(2 + args[0].length, content.length + 2);

					bot.whisper(args[0], `[${msg.author.tag}] ${correctContent}`)
				}

				if(command === "r") {
					if(!(msg.content.startsWith("/"))) return;
					var correctContent = content.substr(2, content.length + 1);

					bot.chat(`/r [${msg.author.tag}] ${correctContent}`);
				}

				setTimeout(() => {
					bot.chat(`> [${msg.author.tag}] ${content}`);
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
				if(!(msg.content.startsWith("/"))) return;
				var correctContent = content.substr(2 + args[0].length, content.length + 1);

				bot.whisper(args[0], `[${msg.author.tag}] ${correctContent}`)
			}

			if(command === "r") {
				if(!(msg.content.startsWith("/"))) return;
				var correctContent = content.substr(2, content.length + 1);

				bot.chat(`/r [${msg.author.tag}] ${correctContent}`);
			}

			setTimeout(() => {
				if(msg.content.startsWith("/")) return;
				bot.chat(`> [Discord] ${msg.author.tag} » ${content}`);
			}, 1 * 1000);

			const send = client.emojis.cache.find(emoji => emoji.name === "1505_yes");
			msg.react(send);
		}
	});

}


/*
*
*										COMMAND DISCORD
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

		if (args[0] === "Maple") {
			kills = 0;
			deads = 0;
		}

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
	if (command === "lastseen") {
		let lastseen = db.get(`${args[0]}_lastseen`);

		var e = new Discord.MessageEmbed()
			.setDescription('Bạn cần nhập tên để xem thông tin. - `' + prefix + 'lastseen <name>`')
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

			if (lastseen < 2) {
				var isonline = new Discord.MessageEmbed()
					.setDescription(`Người chơi ${args[0]} đang online.`)
					.setColor('0xC51515')

				message.channel.send(isonline)
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

	if (command === "firstseen") {
		let firstjoin = db.get(`${args[0]}_firstjoin`);

		var e = new Discord.MessageEmbed()
			.setDescription('Bạn cần nhập tên để xem thông tin. - `' + prefix + 'firstseen <name>`')
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

	if (command === "help") {
		var noargs = new Discord.MessageEmbed()
			.setDescription('Bạn cần nhập loại lệnh. `' + prefix + "help <loại>`\nCác loại: discord, ingame-command, check và all\nLoại all là xem tất cả lệnh, còn lại là xem chi tiết")
			.setColor(0x000DFF);

		if (!args[0]) return message.channel.send(noargs);

		if (args[0] == "discord") {
			var helpdiscord = new Discord.MessageEmbed()
				.setTitle("*[Discord Command]*")
				.setColor(0x000DFF)
				.addField("\u200b", prefix + 'status - ``Xem trạng thái của server hàng chờ, online``', false)
				.addField("\u200b", prefix + 'online - ``Xem số người online``', false)
				.addField("\u200b", prefix + 'queue - ``Xem hàng chờ``', false)
				.addField("\u200b", prefix + 'prio - ``Xem hàng chờ ưu tiên``', false)
				.addField('\u200b', '\u200b', false)
				.setFooter(footer)
				.setTimestamp();

			message.channel.send(helpdiscord);
		}
		if (command === "2bq" || command === "2bqueue") {
			superagent.get("https://2b2t.io/api/queue?last=true").end((err, data) => {
				let queue = data.body[0][1];
				superagent.get("https://api.2b2t.dev/prioq").end((err, dataq) => {
					let prio = dataq.body[1];
					var queue = new Discord.MessageEmbed()
										.setDescription("Hàng chờ bình thường là " + queue + ", hàng chờ ưu tiên là " + prio)
										.setColor(0x2EA711);
					message.channel.send(queue);
				});
			});
		}

		if (args[0] === "ingame-command") {
			var ingamecmd = new Discord.MessageEmbed()
				.setTitle("*[Discord Command]*")
				.setColor(0x000DFF)
				.addField("\u200b", '!help - ``Xem các lệnh có sẵn.``', false)
				.addField("\u200b", '!tps - ``Xem tps hiện tại của server.``', false)
				.addField("\u200b", '!coordinate - ``Xem toạ độ bot hiện tại.``', false)
				.addField("\u200b", '!kill - ``Thực hiện lệnh /kill cho bot.``', false)
				.addField("\u200b", '!ping - ``Xem ping của bạn, nhập tên để xem ping người khác.``', false)
				.addField("\u200b", '!prio - ``Xem hàng chờ ưu tiên hiện tại.``', false)
				.addField("\u200b", '!que - ``Xem hàng chờ và hàng chờ ưu tiên.``', false)
				.addField("\u200b", '!stats - ``Xem chỉ số K/D. ( Dead tính từ 13/1, Kil tính từ 15/1 )``', false)
				.addField("\u200b", '!firstseen - ``Xem ngày người chơi lần đầu tham gia server. ( Tính từ 28/1 )``', false)
				.addField("\u200b", '!pt - ``Xem thời gian bạn đã chơi. ( Bắt đầu từ ngày 1/2 )``', false)
				.addField("\u200b", '!lastseen - ``Xem lần hoạt động gần nhất của người chơi. ( Tính từ 2/2 )``', false)
				.addField("\u200b", '!2bqueue - ``Xem hàng chờ hiện tại của 2b2t.``', false)
				// .addField("\u200b", '! - ````', false)
				.addField('\u200b', '\u200b', false)
				.setFooter(footer)
				.setTimestamp();

			message.channel.send(ingamecmd);
		}
		if (args[0] === "check") {
			var check = new Discord.MessageEmbed()
				.setTitle("*[Check Command]*")
				.setColor(0x000DFF)
				.addField("\u200b", prefix + 'kd - ``Xem chỉ số K/D.``', false)
				.addField("\u200b", prefix + 'firstseen - ``Xem ngày người chơi lần đầu tham gia server.``', false)
				.addField("\u200b", prefix + 'pt - ``Xem thời người chơi đã chơi.``', false)
				.addField("\u200b", prefix + 'lastseen - ``Xem lần hoạt động gần nhất của người chơi.``', false)
				// .addField("\u200b", '! - ````', false)
				.addField('\u200b', '\u200b', false)
				.setFooter(footer)
				.setTimestamp();

			message.channel.send(check);
		}
		if (args[0] == "all") {
			var embed = new Discord.MessageEmbed()
				.setColor(0x000DFF)
				.setTitle('[Help Command]')
				// .addFields({ name: '\u200b', value: '\u200b' })
				.addField("*[Discord Command]*", "help*, status, online, queue, prio. ($)", false)
				.addField("*[Minecraft Command]*", "stats, playtime, firstseen, lastseen, 2bqueue. ($)", false)
				.addField("*[Ingame Command]*", "help, tps, coordinate, kill, ping, queue, prio, stats, firstseen, playtime, lastseen, 2bqueue. (!)", false)
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
			if (command === "queue" || command === "q") {
				const embed = new Discord.MessageEmbed()
					.setColor(0x000DFF)
					.setDescription("Hàng chờ hiện tại: **" + queue + "**")

				message.channel.send(embed).then(message => {
					message.delete({ timeout: 10000 });
				});

			}

			// Prio command
			if (command === "prio" || command === "p" || command === "priority") {
				const embed = new Discord.MessageEmbed()
					.setColor(0x000DFF)
					.setDescription("Hàng chờ ưu tiên hiện tại: **" + prio + "**")

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