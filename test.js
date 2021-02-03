// Discord modules
const Discord = require("discord.js");
const client = new Discord.Client();

// env files
const token = require('dotenv').config();
const config = {
	token: process.env.token, // Discord token
	ip: process.env.ip, // Server IP
};

// Minecraft protocol
const mc = require("minecraft-protocol");
const queue = require("minecraft-protocol");
const topic = require("minecraft-protocol");

var waitUntil = require('wait-until')
var mineflayer = require('mineflayer')
var tpsPlugin = require('mineflayer-tps')(mineflayer)
var delay = require('delay')
var db = require('quick.db');

// Some type
const footer = "moonbot 2021";
var prefix = "$";

// Developer mode
var dev = false;

if(dev) {
	console.log('Developer Mode: True')
	prefix = "dev$";
} else {
	console.log('Developer Mode: False')
}

var defaultChannel;
var devuser = "2y2cBot3";
if(dev) {
	defaultChannel = '802454010400604161';
	devuser = "mo0nbot2";
} else {
	defaultChannel = '795135669868822528';
	devuser = "mo0nbot";
}

client.on('ready', () => {
	console.log('Bot online!');

	// create this bot
	createBot()
});

function createBot () {
	const bot = mineflayer.createBot({
		host: config.ip,
		port: 25565,
		username: devuser,
		version: "1.12.2"
	}); // Start bot

	var color = "0x979797"; // color embed

	var lobby = true; // check if bot in lobby or else

	bot.loadPlugin(tpsPlugin); // load tps plugins mineflayer

	// uptime server
	var minutess = 0;
	var hourss = 0;
	var totalSeconds = 0;

	// minecraft bot uptime
	function setTime() {
		totalSeconds += 600;
		hourss = parseInt(totalSeconds / 3600);
		minutess = (totalSeconds - (hourss * 3600)) / 60;
		if(hourss === "NaH") {
			hourss = "0";
		} else if (minutess === "NaH") {
			minutess = "0";
		}
	}

	bot.chatAddPattern(/(.+) nhắn: (.+)/, 'whisper', '2y2c.org nhắn');

	bot.on('whisper', (username, message, rawMessage) => {
		if(username === bot.usermame) return;
		console.log(`${username}: ${message}`)
		var strName = username.replace(/_/, "\\_");
		var newusername = strName.replace("[Donator]", "");
		var huyen = message.replace(/`/, "\\`")
		var duoi = huyen.replace(/_/, "\\_")
		var sao = duoi.replace("*", "\*")
		var newmsg = sao.replace("**", "\**")
		
		if(newmsg === undefined) {
			newmsg = message;
		} else if(newusername === undefined) {
			newusername = username;
		}

		const whisper = new Discord.MessageEmbed()
					.setDescription(`${newusername} nhắn: ${newmsg}`)
					.setColor("0xFD00FF");

		try {
			client.channels.cache.get(defaultChannel).send(whisper);
		} catch(e) {
			if(!dev) return;
			console.log("Whisper MSG ", e)
		}
	}); 

	var isInLogin = false;
	bot.on('windowOpen', () => { // slot button mode cb
		if(dev) {
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

	// while connect to the server
	bot.on('login', () => {
		// uptime method
		totalSeconds = 0;
		setInterval(setTime, 10*60*1000);

		setInterval(function() {
			Object.values(bot.players).map(player => addPlayTime(player.username));
			//Object.values(bot.players).forEach(p => addPlayTime(p.username))

			function addPlayTime(player) {
				let playtime = db.get(`${player}_playtime`);

				if(playtime === null) { // tao database playtime
					db.set(`${player}_playtime`, 10000);
				} else if (playtime < 2) { // do database nen se phai lam cai nay
					db.add(`${player}_playtime`, 9999);
				} else { // tao database va tinh thoi gian
					db.add(`${player}_playtime`, 10000);
				}
			}
		}, 10*1000); 

		if(dev) {
			console.log("joined the server.")
		}

		const queuejoined = new Discord.MessageEmbed()
					.setDescription(`**Bot** đã tham gia hàng chờ!`)
					.setColor("FFFB00");

		try {
			client.channels.cache.get(defaultChannel).send(queuejoined);
		} catch(e) {
			if(!dev) return;
			console.log("JOINED THE SERVER MESSAGE ERROR ", e)
		}

	});

	bot.on('message', message => {
		var newcolor = 'DB2D2D';
		var logger = message.toString();
		
		// value to embed
		var deathMsg;

		var embed = new Discord.MessageEmbed()
								.setDescription(logger)
								.setColor(color);

		try {
			if(dev) {
				client.channels.cache.get("802456011252039680").send(embed) // test
			} else {
				client.channels.cache.get("797426761142632450").send(embed) // main
			}
			
		} catch (E) {
			if(!dev) return;
			console.log("ERR", E)
		}
		
		if(logger.startsWith("nhắn cho") || logger.startsWith("To")) {
			newcolor = "0xFD00FF";
			deathMsg = logger; 
		}

		if(logger === '2y2c đã full') return;
		
		if(logger === "Đang vào 2y2c") {
			setTimeout(() => {
				if(!isInLogin) {
					bot.quit("Restarting")
				}
			}, 30*1000)
			lobby = false;
			const joined = new Discord.MessageEmbed()
					.setDescription(`**Bot** đang vào server chính!`)
					.setColor("FFFB00");

			try {
				setTimeout(function() {
					client.channels.cache.get(defaultChannel).send(joined);
				}, 3*1000);
			} catch(e) {
				if(!dev) return;
				console.log("JOINED THE MAIN SERVER MSG ERROR ", e)
			}
			uuid = 0;
		}

		if(logger === undefined) return; // return if msg is undefined
		if(logger === null) return; // return if null msg

		// return message on chat
		if(logger.includes('<') && logger.includes(">")) return;

		// suicide when see this
		if(logger === "You cannot chat until you move!") {
			bot.chat('/kill')
		}


		// kill Message
			if(logger.includes('chết cháy khi đánh với')) {
				if(logger.includes('Zombie')) {
					deathMsg = logger;
					return;
				}

				var str = logger;
				var user = str.split(" ")[6];

				let data = db.get(`${user}_kills`);

				if(data === null) {
					db.set(`${user}_kills`, 1)
				} else {
					db.add(`${user}_kills`, 1)
				}
				deathMsg = logger;
			}

			if(logger.includes('bị bắn chết bởi')) {
				var str = logger;
				var user = str.split(" ")[5];

				let data = db.get(`${user}_kills`);
				
				if(data === null) {
					db.set(`${user}_kills`, 1)
				} else {
					db.add(`${user}_kills`, 1)
				}
				deathMsg = logger;
			}

			if (logger.includes('nhảy con mẹ nó vào lava khi bị truy sát bởi')) {
				if(logger.includes('Wither')) {
					deathMsg = logger;
					return;
				}

				if(logger.includes('Sì-ke')) {
					deathMsg = logger;
					return;
				}

				if(logger.includes('Zombie')) {
					deathMsg = logger;
					return;
				}

				var str = logger;
				var user = str.split(" ")[12];

				let data = db.get(`${user}_kills`);
				
				if(data === null) {
					db.set(`${user}_kills`, 1)
				} else {
					db.add(`${user}_kills`, 1)
				}
				deathMsg = logger;
				
			}

			if(logger.includes('chết chìm khi cố gắng thoát khỏi')) {
				if(logger.includes('Zombie')) {
					deathMsg = logger;
					return;
				}
				var str = logger;
				var user = str.split(" ")[8];
				
				let data = db.get(`${user}_kills`);
				
				if(data === null) {
					db.set(`${user}_kills`, 1)
				} else {
					db.add(`${user}_kills`, 1)
				}
				deathMsg = logger;

			}

			if(logger.includes('nổ banh xác bởi')) {
				var str = logger;
				var user = str.split(" ")[5];
				
				let data = db.get(`${user}_kills`);

				if(data === null) {
					db.set(`${user}_kills`, 1)
				} else {
					db.add(`${user}_kills`, 1)
				}
				deathMsg = logger;

			}

			if(logger.includes('đã bị đấm chết con mẹ nó bởi')) {
				var str = logger;
				var user = str.split(" ")[9];
				
				let data = db.get(`${user}_kills`);
				
				if(data === null) {
					db.set(`${user}_kills`, 1)
				} else {
					db.add(`${user}_kills`, 1)
				}
				deathMsg = logger;
			}

			if(logger.includes('té dập con mẹ nó mặt vì')) {
				var str = logger;
				var user = str.split(" ")[8];
				
				let data = db.get(`${user}_kills`);
				
				if(data === null) {
					db.set(`${user}_kills`, 1)
				} else {
					db.add(`${user}_kills`, 1)
				}
				deathMsg = logger;
			}

			if(logger.includes('chạy con mẹ nó vào lửa vì')) {
				var str = logger;
				var user = str.split(" ")[8];
				
				let data = db.get(`${user}_kills`);
				
				if(data === null) {
					db.set(`${user}_kills`, 1)
				} else {
					db.add(`${user}_kills`, 1)
				}
				deathMsg = logger;
			}

			if(logger.includes('bay con mẹ nó lên trời bởi')) {
				var str = logger;
				var user = str.split(" ")[8];
				
				let data = db.get(`${user}_kills`);
				
				if(data === null) {
					db.set(`${user}_kills`, 1)
				} else {
					db.add(`${user}_kills`, 1)
				}
				deathMsg = logger;

			}

			if(logger.includes('đã bị phản sát thương bởi')) {
				var str = logger;
				var user = str.split(" ")[7];

				let data = db.get(`${user}_kills`);
				
				if(data === null) {
					db.set(`${user}_kills`, 1)
				} else {
					db.add(`${user}_kills`, 1)
				}
				deathMsg = logger;

			}

			if(logger.includes('đã bị giết bởi')) {
				if(logger.includes('Zombie Pigman')) {
					deathMsg = logger;
					return;
				} else if(logger.includes('Wither')) {
					deathMsg = logger;
					return;
				} else if(logger.includes('Sì-ke')) {
					deathMsg = logger;
					return;
				} else if (logger.includes('cá')) {
					deathMsg = logger;
					return;
				}

				var str = logger;
				var user = str.split(" ")[5];
				
				let data = db.get(`${user}_kills`);
				
				if(data === null) {
					db.set(`${user}_kills`, 1)
				} else {
					db.add(`${user}_kills`, 1)
				}
				deathMsg = logger;

			}

			if(logger.includes('khô máu với')) {
				var str = logger;
				var user = str.split(" ")[4];
				
				let data = db.get(`${user}_kills`);
				
				if(data === null) {
					db.set(`${user}_kills`, 1)
				} else {
					db.add(`${user}_kills`, 1)
				}
				deathMsg = logger;

			}

			// listening death message
			if(logger.includes('Té')
			|| logger.includes('té')
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
			|| logger.includes('chạy')) {
				var user = logger.split(" ")[0];
				let data = db.get(`${user}_dead`);

				if(data === null) {
					db.set(`${user}_dead`, 1)
				} else {
					db.add(`${user}_dead`, 1)
				}

				deathMsg = logger;
			}
		
		// return error message
		if(deathMsg === undefined) return;

		if(logger.startsWith("[Server]")) {
			newcolor = '0xb60000';
			deathMsg = logger;
		}

		if(logger.startsWith("[Broadcast]")) {
			newcolor = "0xb60000";
			deathMsg = logger;
		}

		if(logger === "Donate để duy trì server admin đang đói chết con *ĩ *ẹ.") {
			newcolor = '0xb60000';
			deathMsg = logger;
		}

		if(logger === "diễn đàn của server https://www.reddit.com/r/2y2c/.") {
			newcolor = '0xb60000';
			deathMsg = logger;

		}

		var strnn = deathMsg.replace("**", "\\**")
		var strn = strnn.replace("*", "\\*")
		var str = strn.replace(/`/ig, "\\`")
		var newDeathMsg = str.replace(/_/ig, "\\_")

		if(newDeathMsg === undefined) {
			newDeathMsg = deathMsg;
		}

		var embedDeath = new Discord.MessageEmbed()
							.setDescription(newDeathMsg)
							.setColor(newcolor);

		try {
			client.channels.cache.get(defaultChannel).send(embedDeath);
			newcolor = "DB2D2D";
		} catch (e) {
			if(!dev) return;
			console.log("CHAT MESSAGE ERROR", e)
		}
	})

	bot.on("playerJoined", (player) => {
		var username = player.username;
		var newUsername = username.replace(/_/ig, "\\_");

		var today = new Date()
		let day = ("00" +today.getDate()).slice(-2)
		let month = ("00" +(today.getMonth()+1)).slice(-2)
		let years = ("00" + today.getFullYear()).slice(-2)
		let hours = ("00" + today.getHours()).slice(-2)
		let min = ("00" + today.getMinutes()).slice(-2)
		var date = day + '.' + month + '.' + years + ' ' + hours + ':' + min;

		let firstjoin = db.get(`${username}_firstjoin`);
		
		if(firstjoin === null) {
			db.set(`${username}_firstjoin`, date)
		}
		let lastseen = db.get(`${username}_firstjoin`);
		if(lastseen > 0) {
			db.set(`${username}_lastseen`, 0)
		}

		if(username === "Ha_My" || username === "PhanThiHaMy") {
			client.users.fetch("425599739837284362").then((user) => {
				user.send(`${username} joined`);
			});
		}

		if(newUsername === undefined) {
			newUsername = username;
		}
		
		if(newUsername === bot.username) return;
 
		if(dev) return;
		var embed = new Discord.MessageEmbed()
							.setDescription(newUsername + " joined")
							.setColor('0xb60000')

		try {
			client.channels.cache.get(defaultChannel).send(embed);
		} catch (e) {
			if(!dev) return;
			console.log("JOIN MESSAGE ERROR", e)
		}
	});

	bot.on("playerLeft", (player) => {
		var username = player.username;
		var newUsername = username.replace(/_/ig, "\\_");

		if(username === "Ha_My" || username === "PhanThiHaMy") {
			client.users.fetch("425599739837284362").then((user) => {
				user.send(`${username} left`);
			});
		}

		if(newUsername === undefined) {
			newUsername = username;
		}
		var d = new Date();
		var time = d.getTime();
		let lastseen = db.get(`${username}_lastseen`);

		if(lastseen === null) {
			db.set(`${username}_lastseen`, time)
		} else {
			db.set(`${username}_lastseen`, time)
		}

		if(newUsername === bot.username) return;

		if(dev) return
		var embed = new Discord.MessageEmbed()
							.setDescription(newUsername + " left")
							.setColor('0xb60000')
		try {
			client.channels.cache.get(defaultChannel).send(embed);
		} catch (e) {
			if(!dev) return;
			console.log("LEAVE MESSAGE ERROR", e)
		}
	});

	bot.on('message', msg => {
		// restarts
		if(msg === "[AutoRestart] Server sẽ Restart sau 15 phút!") {
			if(dev) return;
			client.channels.cache.get('795534684967665695').send("@everyone [AutoRestart] Server sẽ Restart sau 15 phút!");
		}
		if(msg === "[AutoRestart] Server sẽ Restart sau 5 phút!") {
			if(dev) return;
			client.channels.cache.get('795534684967665695').send("@everyone [AutoRestart] Server sẽ Restart sau 5 phút!");
		}
		if(msg === "[AutoRestart] Server sẽ Restart sau 5 Giây!") {
			if(dev) return;
			client.channels.cache.get('795534684967665695').send("@everyone [AutoRestart] Server sẽ Restart sau 5 giây!");
		}
	});


	var sending = false;
	var stats = false;
	bot.on('spawn', () => {
		if(lobby) return;
		setInterval(function() {
			if(stats) return;
			stats = true;
			// bot.chat('/stats');
			bot.swingArm("left");
			bot.look(Math.floor(Math.random() * Math.floor("360")), 0, true, null);
			antiAfk();
		}, 1*60*1000);

		function antiAfk() {
			setTimeout(function() {
				stats = false;
			}, 6*1000);
		}
		
		var str = '> Luyện tập crystal pvp tại : 2y2cpvp.sytes.net. | > !lastseen <name> xem lần cuối nhìn thấy người chơi online. | > !firstseen <name> xem ngày người chơi lần đầu tham gia vào server. | > Tham gia bot discord tại : https://discord.gg/yrNvvkqp6w | > !pt <name> xem thời gian đã chơi | > Kiểm tra hàng chờ hiện tại : !queue | > !ping để xem ping của bạn | > !stats <name> xem chỉ số người khác';
		
		var words = str.split(' | ');

		var random = words[Math.floor(Math.random() * words.length)];
		
		setInterval(function() {
			if(sending) return;
			sending = true;
			bot.chat(random)
			autoMsg();
		}, 20*60*1000);

		function autoMsg() {
			setTimeout(function() {
				sending = false;
			}, 6*1000);
		}

	});

	// queue servers
	var ontab = false;
	bot._client.on("playerlist_header", data => {
		if(!lobby) return;
		if(ontab) return;
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

		if(s7 === null) return;
		if(s7 === undefined) return;
		topic.ping({"host": config.ip}, (err, result) =>{
			if(result) {
				try {
					var players = [];
					for(i = 0; result.players.sample.length > i; i++) {
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
				var status = "Trong hàng chờ: " + currentQueue + "/" + prio + " - Queue: " + queue;

				try {
					client.user.setActivity(status, { type: 'PLAYING' });
				} catch (e) {
					if(!dev) return;
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
			if(!dev) return;
			console.log("QUEUE MESSAGE ", e)
		}

		function checktab() {
			setTimeout(() => {
				ontab = false;
			}, 10*1000);
		}
		
	});

	var statusbot = false;
	bot._client.on("playerlist_header", data => {
		if(statusbot) return;
		statusbot = true;
		returnStt();
		var footer = data.footer;
		var ss1 = footer.replace(/\\n/ig, " ");
		var ss2 = ss1.replace(/-/ig, "");
		var ss3 = ss2.replace(/§3|§d|§a|§r/ig, "");
		var ss4 = ss3.replace(/{"text":"/ig,"")

		// replace all space to none
		var ss5 = ss4.replace("    ", " ")
		var ss6 = ss5.replace("    ", " ")

		var tps = ss6.split(" ")[1];
		if(tps === undefined || tps === "§6Donate" || tps === "§6bạn") {
			tps = 0;
		}

		topic.ping({"host": config.ip}, (err, result) =>{
			if(result) {
				try {
					var players = [];
					for(i = 0; result.players.sample.length > i; i++) {
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
					if(!dev) return;
					console.log("SET TOPIC ERROR", e)
				}
			}
		});

		function returnStt() {
			setTimeout(() => {
				statusbot = false;
			}, 3*60*1000);
		}
	});

	// main servers
	var onmain = false;
	bot._client.on("playerlist_header", data => {
		if(lobby) return;
		if(onmain) return;
		onmain = true;
		checktab();

		var footer = data.footer;
		var ss1 = footer.replace(/\\n/ig, " ");
		var ss2 = ss1.replace(/-/ig, "");
		var ss3 = ss2.replace(/§3|§d|§a|§r/ig, "");
		var ss4 = ss3.replace(/{"text":"/ig,"")

		// replace all space to none
		var ss5 = ss4.replace("    ", " ")
		var ss6 = ss5.replace("    ", " ")

		const tps = ss6.split(" ")[1];
		const player = ss6.split(" ")[3];
		const ping = ss6.split(" ")[5];

		// check null & return
		if(tps === undefined || player === undefined || ping === undefined) return;
		
		var topics = tps + " tps - " + player + " players - " + ping + " ping" + " \nĐã tham gia server từ " + hourss + " giờ " +  minutess + " phút trước.";

		try {
			client.channels.cache.get(defaultChannel).setTopic(topics, "suc")
		} catch (e) {
			if(!dev) return;
			console.log("SET TOPIC ERROR", e)
		}

		function checktab() {
			setTimeout(() => {
				onmain = false;
			}, 10*60*1000);
		}
		
	});

	bot.on('nonSpokenChat', (message) => {
		console.log(`Non spoken chat: ${message}`)
	});

	bot.on('message', msg => {
		if(!(msg.toString().startsWith("<"))) return; // return message no <
		var nocheck = msg.toString().split(' ')[0];
		var username1 = nocheck.replace(/</ig, ""); // xoa < > format chat
		var username = username1.replace(/>/ig, "");
		//console.log(username)
		var log = msg.toString().replace(username, "");
		var logger = log.replace(/<> /ig, "")
		//console.log(`<${username}> ${logger}`)
		
		var bp;
		if(dev) {
			bp = "Dev!";
		} else {
			bp = "!";
		}
		
		// Check message if is command
		var isCommand;

		var newCmd;
		if(logger.startsWith(bp)) {
			newCmd = logger.replace(".", "")
			isCommand = true;
		}

		if(newCmd === bp + "coords" || newCmd === bp + "coordinate" || newCmd === bp + "xyz") {
			isCommand = true;
			var posi = bot.entity.position;
			setTimeout(function() {
				bot.whisper(username, `> Toạ độ: ${posi}`);
			}, 2*1000);
		}

		if(logger.startsWith(bp + "lastseen")) {
			isCommand = true;
			var args;

			var str = logger.replace(".", "");
			args = str.split(" ")[1];

			if(newCmd === bp + "lastseen") {
				args = username;
			}
			let lastseen = db.get(`${args}_lastseen`);
			var d = new Date();
			var time = d.getTime();

			var ticks = (time - lastseen); // tick de tinh second

			setTimeout(function() {
				if(lastseen === null) {
					bot.whisper(username, `> Chưa từng nhìn thấy ${args}.`);
					return;
				}

				if(lastseen < 1) {
					bot.whisper(username, `> Người chơi ${args} đang online.`);
					return;
				}

				var temp = ticks/1000;
				var day = 0, hour = 0, minutes = 0;       
				day = parseInt(temp/86400)
				hour = parseInt(((temp - day*86400)/3600))
				minutes = parseInt(((temp - day*86400 - hour*3600))/60)
				var age;
				if(day > 0) {
					age = `${day} ngày`;
				} else if(day < 1) {
					age = `${hour} giờ ${minutes} phút`;
					if (hour < 1) {
						age = `${minutes} phút`;
					}
				}

				bot.whisper(username, `> Đã nhìn thấy ${args} từ ${age} trước.`)
			}, 2*1000);
		}

		if(logger.startsWith(bp + "firstseen")) {
			isCommand = true;
			var args;

			var str = logger.replace(".", "");
			args = str.split(" ")[1];

			if(newCmd === bp + "firstseen") {
				args = username;
			}
			let firstjoin = db.get(`${args}_firstjoin`);

			setTimeout(function() {
				if(firstjoin === null) {
					bot.whisper(username, `> ${args}: Chưa từng tham gia vào server.`);
					return;
				}
				bot.whisper(username, `> ${args} tham gia lúc ${firstjoin}`)
			}, 2*1000);
		}

		if(logger.startsWith(bp + "playtime") || logger.startsWith(bp + "pt")) {
			isCommand = true;
			var args;

			var str = logger.replace(".", "");
			args = str.split(" ")[1];

			if(newCmd === bp + "playtime" || newCmd === bp + "pt") {
				args = username;
			}
			let playtime = db.get(`${args}_playtime`);
			
			setTimeout(function() {
				if(playtime === null) {
					bot.whisper(username, `> ${args}: Chưa từng được tính thời gian.`)
					return;
				}

				var temp = playtime/1000;
				var day = 0, hour = 0, minutes = 0;       
				day = parseInt(temp/86400)
				hour = parseInt(((temp - day*86400)/3600))
				minutes = parseInt(((temp - day*86400 - hour*3600))/60)
				var string;
				if(day > 1) {
					string = day + " ngày "+ hour + " giờ "+ minutes + " phút";
				} else {
					string = hour + " giờ " + minutes + " phút";
				}

				bot.whisper(username, `> ${args}: ${string}`)
			}, 2*1000);
		}

		if(logger.startsWith(bp + "kd") || logger.startsWith(bp + "stats")) {
			isCommand = true;
			var args;

			var str = logger.replace(".", "");
			args = str.split(" ")[1];
			
			if(newCmd === bp + "kd" || newCmd === bp + "stats") {
				args = username;
			}
			
			if(args === "Maple") {
				setTimeout(function() {
					bot.whisper(username, `> Maple: [K: 0 - D: 0 - Ratio: None]`)
				}, 2*1000);
				return;
			}
			
			let die = db.get(`${args}_dead`);
			let kills = db.get(`${args}_kills`);

			var ratio = kills/die;
			var ratioFixed = ratio.toFixed(2);

			if(ratioFixed === "NaN" || ratioFixed === "Infinity") {
				ratioFixed = "0.00";
			}

			if(die === null) {
				die = 0;
			}

			if(kills === null) {
				kills = 0;
			}

			setTimeout(function() {
				bot.whisper(username,`> ${args}: [K: ${kills} - D: ${die} - Ratio: ${ratioFixed}]`)
			}, 2*1000);
			
		}

		if(newCmd === bp + "help") {
			isCommand = true;
			setTimeout(function() {
				bot.whisper(username, '> !coords, !tps, !kill, !ping, !q, !stats,  !playtime, !firstseen, !lastseen')
			}, 2*1000);
		}

		// TPS
		if(newCmd === bp + "tps") {
			isCommand = true;
			setTimeout(function() {
				bot.whisper(username, `> Server TPS: ${bot.getTps()}`)
			}, 2*1000);
		}
		if(logger === bp + "ping.") {
			isCommand = true;
			setTimeout(function() {
				try {
						bot.whisper(username, "> Ping của bạn: " + bot.players[username].ping + "ms");
					
				} catch (E) {
					if(!dev) return;
					console.log("PING ERROR", E)
				}
			}, 2*1000);
		}

		// Ping other
		if(logger.startsWith(bp + "ping")) {
			isCommand = true;
			if(logger === bp + "ping.") {
				
			} else {
				var str = logger.replace(".", "");
				var user = str.split(" ")[1];

				setTimeout(function() {
					try {
						bot.whisper(username, "> " + user + ": " + bot.players[user].ping + "ms");
					} catch (e) { 
						if(!dev) return;
						console.log("PING OTHER DEBUG ", e)
					}
				}, 2*1000);
			}
		}

		// Kill
		if(newCmd === bp + "kill" || newCmd === bp + 'suicide') {
			if(dev) return;
			isCommand = true;
			setTimeout(function() {
				bot.chat('/kill')
			}, 2*1000);
		}
		
		if (newCmd === bp + "queue" || newCmd === bp + "que" || newCmd === bp + "q" || newCmd === bp + "normalqueue" || newCmd === bp + "nq" || newCmd === bp + "prio" || newCmd === bp + "prioqueue") {
			isCommand = true;
			queue.ping({"host": config.ip}, (err, result) =>{
				if(err) {
					bot.whisper(username, "> Không thể kiểm tra trạng thái của server.");
				}
				if(result) {
					try {
						var players = [];
						for(i = 0; result.players.sample.length > i; i++) {
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
				
				setTimeout(function() {
					if(newCmd === bp + "prioqueue" || newCmd === bp + "prio") {
						if(prio < 1) {
								bot.whisper(username, `> Không có bất kì hàng chờ ưu tiên nào.`);
							return;
						}
						bot.whisper(username, `> Hàng chờ ưu tiên là ${prio}`);
					}

					if(newCmd === bp + "normalqueue" || newCmd === bp + "nq") {
						if(queue < 1) {
							bot.whisper(username, `> Không có bất kì hàng chờ nào.`);
							return;
						}

						bot.whisper(username, `> Hàng chờ bình thường là ${queue}`);
					}

					if(newCmd === bp + "q" || newCmd === bp + "queue" || newCmd === bp + "que") {
							bot.whisper(username, `> Hàng chờ bình thường là ${queue}, hàng chờ ưu tiên là ${prio}`);
						
					}
				}, 2*1000);
				
			});
		}
		
		// check > msg
		if(logger.startsWith(">")) {
			color = "2EA711";
		}

		/*
		var msg = false;

		// Command whisper
		if(isCommand && logger.startsWith("> Toạ độ:")
		|| logger.startsWith("> Chưa từng nhìn thấy")
		|| logger.startsWith("> Người chơi")
		|| logger.startsWith("> Đã nhìn thấy")
		|| logger.endsWith("Chưa từng tham gia vào server.")
		|| logger.includes("tham gia lúc")
		|| logger.endsWith("Chưa từng được tính thời gian.")
		|| logger.includes("ngày") && logger.includes("giờ") && logger.includes("phút")
		|| logger.includes("[K:") && logger.startsWith(">")
		|| logger.startsWith("> !coords,")
		|| logger.startsWith("> Server TPS:")
		|| logger.endsWith("ms") && logger.startsWith(">") 
		|| logger.startsWith("> Không thể kiểm tra trạng thái của server.")
		|| logger.startsWith("> Không có bất kì hàng chờ ưu tiên nào.")
		|| logger.startsWith("> Không có bất kì hàng chờ ưu tiên nào.")
		|| logger.startsWith("> Hàng chờ ưu tiên là")
		|| logger.startsWith("> Không có bất kì hàng chờ nào.")
		|| logger.startsWith("> Hàng chờ bình thường là") ) {
			msg = true;
			color = "0xFD00FF";
			isCommand = false;
		} */

		/*
		if(username === "ReadTimeoutException" && logger === "null") {
			bot.quit("error");
			var reconnect = new Discord.MessageEmbed()
				.setDescription(`Lỗi đăng nhập!`)
				.setColor("0xFFFB00");
				createBot();
			try {
				client.channels.cache.get(defaultChannel).send(reconnect);
			} catch (e) {
				if(!dev) return;
				console.log("ERROR LOGIN LOG", e);
			}
			return;
		} */

		const dauhuyen = logger.replace(/`/ig, "\\`");
		const dausao = dauhuyen.replace(/_/ig, "\\_");
		const dausaohai = dausao.replace("**", "\\**");
		const newLogger = dausaohai.replace("*", "\*");
		const newUsername = username.replace(/_/ig, "\\_");
		
		if(newLogger === undefined) {
			newLogger = logger;
		}

		if(newUsername === undefined) {
			newUsername = username;
		}

		/*
		// format username with whisper
		var usernameFormatted;

		if(msg) {
			usernameFormatted = `nhắn cho ${newUsername}:`;
		} else {
			usernameFormatted = `**<${newUsername}>**`;
		} */

		// MAIN chat
		var chat = new Discord.MessageEmbed()
					.setDescription(`**<${newUsername}>** ${newLogger}`)
					.setColor(color);
		try {
			client.channels.cache.get(defaultChannel).send(chat);
			color = "0x979797";
			msg = false;
		} catch(e) {
			if(!dev) return
			console.log("CHAT MESSAGE ERROR MAIN", e)
		}

	});
	
	var onetimes = false;

	bot.on('kicked', (reason) => {
		if(reason.includes("You are already connected to this proxy!")) {
			console.log("Bot end for another is active!");
			process.exit();
		}
		//if(!dev) return;
		if(onetimes) return;
		ontimes = true;
		if(reason.includes("đang restart quay lại sau")) {
			var reconnect = new Discord.MessageEmbed()
							.setDescription(`Mất kết nối đến server!`)
							.setColor("0xFFFB00");
			
			try {
				client.channels.cache.get(defaultChannel).send(reconnect);
			} catch (e) {
				if(!dev) return;
				console.log("ERROR AUTO RECONNECT", e);
			}
		}
	})

	bot.on('end', () => {
		totalSeconds = 0;
        waitUntil(180000, 15, function condition() {
			try {
			var today = new Date()
			let day = ("00" +today.getDate()).slice(-2)
			let month = ("00" +(today.getMonth()+1)).slice(-2)
			let years = ("00" + today.getFullYear()).slice(-2)
			let hours = ("00" + today.getHours()).slice(-2)
			let min = ("00" + today.getMinutes()).slice(-2)
			var date = day + '.' + month + '.' + years + ' ' + hours + ':' + min
			console.log(date + " | Bot ended, attempting to reconnect...");

			var reconnect = new Discord.MessageEmbed()
				.setDescription(`**Bot** đang kết nối lại với server!`)
				.setColor("0xFFFB00");
				createBot();
			try {
				client.channels.cache.get(defaultChannel).send(reconnect);
			} catch (e) {
				if(!dev) return;
				console.log("ERROR AUTO RECONNECT", e);
			}
				return true;
			} catch (error) {
				console.log("Error: " + error);
				return false;
			}
		}, function done(result) {
			console.log("Completed: " + result);
        });
   });

   client.on('message', msg => {
		// control
		const user = msg.mentions.users.first();
		if(msg.author.bot) return; // return author is bot
		if(user) return;

		if(dev) {
			if(msg.channel.id === "802456011252039680") {
				if(msg.author == client.user) return;
				setTimeout(() => {
					bot.chat(msg.content);
				}, 1*1000);
			}
			if(msg.channel.id == '802454010400604161') {	
				if(msg.content.startsWith(">")) return;
				if(msg.content.startsWith(prefix)) return;
				
				var str = msg.content;
				var content = str.charAt(0).toUpperCase() + str.slice(1);

				if(!content) return;
				
				setTimeout(() => {
					bot.chat(`[DEV: ${msg.author.tag}] ${content}`);
				}, 1*1000);
	
				const send = client.emojis.cache.find(emoji => emoji.name === "1505_yes");
				msg.react(send);
			}
			return;
		}

		if(msg.channel.id === '797426761142632450') {
			if(msg.author == client.user) return;
			setTimeout(() => {
				bot.chat(msg.content);
			}, 1*1000);
		}

		if(msg.channel.id == '795135669868822528') {
			if(msg.content.startsWith(">")) return;
			if(msg.content.startsWith(prefix)) return;
			
			var content = msg.content;

			if(!content) return;
			
			setTimeout(() => {
				bot.chat(`> ${msg.author.tag} » ${content}`);
			}, 1*1000);

			const send = client.emojis.cache.find(emoji => emoji.name === "1505_yes");
			msg.react(send);
		}
   });
	
}



client.on("message", async message => {
	const args = message.content.slice(prefix.length).trim().split(/ +/g);
	const command = args.shift().toLowerCase();

	if(!message.content.startsWith(prefix) || message.author == client.user) return;

	var cmdChannel = client.channels.cache.get('795147809850130514').toString();

	var cmdonly = new Discord.MessageEmbed()
							.setDescription(`Hãy sang ${cmdChannel} nhé.`)
							.setColor("0xC51515")

	if(message.channel.id !== "795147809850130514" && message.author.id !== "425599739837284362") return message.channel.send(cmdonly).then(msg => { msg.delete({ timeout: 10000 })})
	


	if(command === "reset") {
		// cancel
		var cancelexecute = new Discord.MessageEmbed()
								.setDescription("Bạn không được phép sử dụng!")
								.setColor("0xC51515")

		// no perm
		if (message.author.id !== '425599739837284362') return message.channel.send(cancelexecute)

		var noargs = new Discord.MessageEmbed()
							.setDescription('Bạn cần nhập thông tin. `' + `${prefix}reset <type>` + ' <name>`')
							.setColor("0xC51515")

		if(!args[0]) return message.channel.send(noargs);

		if(args[0] === "kills") {
			var noname = new Discord.MessageEmbed()
									.setDescription('Bạn cần nhập tên. `' + `${prefix}reset kills` + ' <name>`')
									.setColor("0xC51515")

			// no name		
			if(!args[1]) return message.channel.send(noname);

			var zero = new Discord.MessageEmbed()
									.setDescription(`Số kill của ${args[1]} là 0.`)
									.setColor("0xC51515")

			let death = db.get(`${args[1]}_kills`)

			// null kills
			if(death === null) return message.channel.send(zero);

			db.set(`${args[1]}_kills`, 0);

			var embed = new Discord.MessageEmbed()
									.setDescription(`Đã reset kill của **${args[1]}**.`)
									.setColor("0x2EA711")

			message.channel.send(embed);

		} else if(args[0] === "deaths") {
			var noname = new Discord.MessageEmbed()
									.setDescription('Bạn cần nhập tên. `' + `${prefix}reset deaths` + ' <name>`')
									.setColor("0xC51515");

			// no name
			if(!args[1]) return message.channel.send(noname);

			var embed = new Discord.MessageEmbed()
									.setDescription(`Đã reset death của ${args[1]}.`)
									.setColor("0x2EA711");

			var zero = new Discord.MessageEmbed()
									.setDescription(`Số death của **${args[1]}** là **0**.`)
									.setColor("0xC51515");

			let death = db.get(`${args[1]}_deads`)

			// null death
			if(death === null) return message.channel.send(zero);
			
			db.set(`${args[1]}_deads`, 0);
			message.channel.send(embed);

		} else if(args[0] === "stats") {
			// no name
			var noname = new Discord.MessageEmbed()
									.setDescription('Bạn cần nhập tên. `' +  `${prefix}reset stats` + ' <name>`')
									.setColor("0xC51515");

			if(!args[1]) return message.channel.send(noname);

			var embed = new Discord.MessageEmbed()
									.setDescription(`Đã reset stats của **${args[1]}**.`)
									.setColor("0x2EA711");

			db.set(`${args[1]}_kills`, 0);
			db.set(`${args[1]}_deads`, 0);
			message.channel.send(embed);

		} else if(args[0] === "kd") {
			var noname = new Discord.MessageEmbed()
									.setDescription(`Bạn cần nhập tên.` + `${prefix}reset kd` + '<name>`')
									.setColor("0xC51515");

			if(!args[1]) return message.channel.send(noname);

			var embed = new Discord.MessageEmbed()
									.setDescription(`Đã reset kd của **${args[1]}**.`)
									.setColor("0x2EA711");

			db.set(`${args[1]}_kills`, 0);
			db.set(`${args[1]}_deads`, 0);
			message.channel.send(embed);

		}
	}

	if(command === "stats" || command === "kd") {
		var e = new Discord.MessageEmbed()
					.setDescription('Bạn cần nhập tên để xem thông tin. - `'+ prefix + 'kd <name>`')
					.setColor('0xC51515')
					
		if (!args[0]) return message.channel.send(e)

		let kills = db.get(`${args[0]}_kills`);
		let deads = db.get(`${args[0]}_deads`);

		if(kills === null) {
			kills = 0;
		}

		if(deads === null) {
			deads = 0;
		}

		// alex, steve
		var str = 'https://cdn.discordapp.com/attachments/799501137182720021/801345516721143818/Alex.png https://cdn.discordapp.com/attachments/799501137182720021/801345550120779786/Steve.png';
		var words = str.split(' ');
		var random = words[Math.floor(Math.random() * words.length)];
		var ratio = kills/deads;
		var ratioFixed = ratio.toFixed(2);


		if(ratioFixed === "NaN" || ratioFixed === "Infinity") {
			ratioFixed = "0.00";
		}
		if(args[0] === "Maple") {
			kills = 0;
			deads = 0;
		}

		setTimeout(() => {
			var embed = new Discord.MessageEmbed()
							.setAuthor(`${args[0]}'s statistics`, random)
							.addFields({ name: `Kills`, value: `${kills}`, inline: true})
							.addFields({ name: `Deaths`, value: `${deads}`, inline: true})
							.addFields({ name: `K/D Ratio`, value: `${ratioFixed}`, inline: true})
							.setThumbnail(random)
							.setColor(0x2EA711)
							.setFooter(footer)
							.setTimestamp();

			message.channel.send(embed)
		}, 3*1000);
	}

	if(command === "playtime" || command === "pt") {
		var e = new Discord.MessageEmbed()
					.setDescription('Bạn cần nhập tên để xem thông tin. - `'+ prefix + 'pt <name>`')
					.setColor('0xC51515')
					
		if (!args[0]) return message.channel.send(e)

		let playtime = db.get(`${args[0]}_playtime`);

		setTimeout(() => {
			if(playtime === null) {
				playtime = `Chưa từng được tính thời gian.`;
				var nodata = new Discord.MessageEmbed()
						.setDescription(`${args[0]}: Chưa từng được tính thời gian.`)
						.setColor('0xC51515')
						
				message.channel.send(nodata);
				return;
			}

			var temp = playtime/1000;
			var day = 0, hour = 0, minutes = 0;       
			day = parseInt(temp/86400)
			hour = parseInt(((temp - day*86400)/3600))
			minutes = parseInt(((temp - day*86400 - hour*3600))/60)
			var string = day + " ngày "+ hour + " giờ "+ minutes + " phút";

			var embed = new Discord.MessageEmbed()
							.setDescription(`${args[0]}: ${string}`)
							.setColor(0x2EA711);

			message.channel.send(embed);
		}, 3*1000);
	}
	if(command === "lastseen") {
		let lastseen = db.get(`${args[0]}_lastseen`);
		
		var e = new Discord.MessageEmbed()
					.setDescription('Bạn cần nhập tên để xem thông tin. - `'+ prefix + 'lastseen <name>`')
					.setColor('0xC51515')
					
		if (!args[0]) return message.channel.send(e)

		var d = new Date();
		var time = d.getTime();

		var ticks = time - lastseen;
		
		setTimeout(() => {
			if(lastseen === null) {
				var nodata = new Discord.MessageEmbed()
						.setDescription(`Chưa từng nhìn thấy ${args[0]}.`)
						.setColor('0xC51515')
						
				message.channel.send(nodata);
				return;
			}

			if(lastseen < 1) {
				var isonline = new Discord.MessageEmbed()
						.setDescription(`Người chơi ${args[0]} đang online.`)
						.setColor('0xC51515')
						
				message.channel.send(isonline)
				return;
			}

			var temp = ticks/1000;
			var day = 0, hour = 0, minutes = 0;       
			day = parseInt(temp/86400)
			hour = parseInt(((temp - day*86400)/3600))
			minutes = parseInt(((temp - day*86400 - hour*3600))/60)
			
			var age;
			if(day > 0) {
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
		}, 3*1000);

	}

	if(command === "firstseen") {
		let firstjoin = db.get(`${args[0]}_firstjoin`);
		
		var e = new Discord.MessageEmbed()
					.setDescription('Bạn cần nhập tên để xem thông tin. - `'+ prefix + 'firstseen <name>`')
					.setColor('0xC51515')

		if (!args[0]) return message.channel.send(e)

		setTimeout(() => {
			if(firstjoin === null) {
				var nodata = new Discord.MessageEmbed()
						.setDescription('Không tìm thấy người chơi.')
						.setColor('0xC51515')
						
				message.channel.send(nodata)
				return;
			}
			
			var embed = new Discord.MessageEmbed()
							.setDescription(`**${args[0]}**: ${firstjoin}`)
							.setColor(0x2EA711);
			
			message.channel.send(embed);
		}, 3*1000);
	}

	if(command === "help") {
		var noargs = new Discord.MessageEmbed()
									.setDescription('Bạn cần nhập loại lệnh. `' + prefix + "help <type>` ( type: discord, ingame-command, check, all)")
									.setColor(0x000DFF);
		
		if(!args[0]) return message.channel.send(noargs);

		if(args[0] == "discord") {
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

		if(args[0] === "ingame-command") {
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
											.addField("\u200b", '!stats - ``Xem chỉ số K/D.``', false)
											.addField("\u200b", '!pt - ``Xem thời gian bạn đã chơi.``', false)
											.addField("\u200b", '!firstseen - ``Xem ngày người chơi lần đầu tham gia server.``', false)
											.addField("\u200b", '!lastseen - ``Xem lần hoạt động gần nhất của người chơi.``', false)
											//.addField("\u200b", '! - ````', false)
											.addField('\u200b', '\u200b', false)
											.setFooter(footer)
											.setTimestamp();
											
			message.channel.send(ingamecmd);
		}
		if(args[0] === "check") {
			var check = new Discord.MessageEmbed()
											.setTitle("*[Check Command]*")
											.addField("\u200b", prefix + 'kd - ``Xem chỉ số K/D.``', false)
											.addField("\u200b", prefix + 'pt - ``Xem thời người chơi đã chơi.``', false)
											.addField("\u200b", prefix + 'firstseen - ``Xem ngày người chơi lần đầu tham gia server``', false)
											.addField("\u200b", prefix + 'lastseen - ``Xem lần hoạt động gần nhất của người chơi.``', false)
											//.addField("\u200b", '! - ````', false)
											.addField('\u200b', '\u200b', false)
											.setFooter(footer)
											.setTimestamp();
											
			message.channel.send(check);
		}
		if(args[0] == "all") {
			var embed = new Discord.MessageEmbed()
						.setColor(0x000DFF)
						.setTitle('[Help Command]')
						// .addFields({ name: '\u200b', value: '\u200b' })
						.addField("*[Discord Command]*", "\u200b", false)
						.addFields("\u200b", prefix + 'status - ``Xem trạng thái của server hàng chờ, online``', false)
						.addField("\u200b", prefix + 'online - ``Xem số người online``', false)
						.addField("\u200b", prefix + 'queue - ``Xem hàng chờ``', false)
						.addField("\u200b", prefix + 'prio - ``Xem hàng chờ ưu tiên``', false)
						.addField('\u200b', '\u200b', false)
						.addField("*[Minecraft Command]*", "\u200b", false)
						.addField("\u200b", prefix + 'kd - ``Xem chỉ số K/D.``', false)
						.addField("\u200b", prefix + 'pt - ``Xem thời người chơi đã chơi.``', false)
						.addField("\u200b", prefix + 'firstseen - ``Xem ngày người chơi lần đầu tham gia server``', false)
						.addField("\u200b", prefix + 'lastseen - ``Xem lần hoạt động gần nhất của người chơi.``', false)
						.addField('\u200b', '\u200b', false)
						.addField("*[Ingame Command]*", "\u200b", false)
						.addField("\u200b", '!help - ``Xem các lệnh có sẵn.``', false)
						.addField("\u200b", '!tps - ``Xem tps hiện tại của server.``', false)
						.addField("\u200b", '!coordinate - ``Xem toạ độ bot hiện tại.``', false)
						.addField("\u200b", '!kill - ``Thực hiện lệnh /kill cho bot.``', false)
						.addField("\u200b", '!ping - ``Xem ping của bạn, nhập tên để xem ping người khác.``', false)
						.addField("\u200b", '!prio - ``Xem hàng chờ ưu tiên hiện tại.``', false)
						.addField("\u200b", '!que - ``Xem hàng chờ và hàng chờ ưu tiên.``', false)
						.addField("\u200b", '!stats - ``Xem chỉ số K/D.``', false)
						.addField("\u200b", '!pt - ``Xem thời gian bạn đã chơi.``', false)
						.addField("\u200b", '!firstseen - ``Xem ngày người chơi lần đầu tham gia server.``', false)
						.addField("\u200b", '!lastseen - ``Xem lần hoạt động gần nhất của người chơi.``', false)
						.setFooter(footer)
						.setTimestamp();

			message.channel.send(embed);
		}
	} 
	
	mc.ping({"host": config.ip}, (err, result) =>{
		if(result) {
			try {
				var players = [];
				for(i = 0; result.players.sample.length > i; i++) {
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
			if(command === "queue" || command === "q") {
				const embed = new Discord.MessageEmbed()
							.setColor(0x000DFF)
							.setDescription("Hàng chờ hiện tại: **" + queue + "**")

				message.channel.send(embed).then(message => {
					message.delete({ timeout: 10000 });
				});

			}
			
			// Prio command
			if(command === "prio" || command === "p" || command === "priority") {
				const embed = new Discord.MessageEmbed()
							.setColor(0x000DFF)
							.setDescription("Hàng chờ ưu tiên hiện tại: **" + prio + "**")

				message.channel.send(embed).then(message => {
					message.delete({ timeout: 10000 });
				});
			}
			
			// status command
			if(command === "status" || command === "stt") {
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
			if(command === "onl" || command === "online" || command === "o") {
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