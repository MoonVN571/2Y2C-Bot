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
const footer = "moonbot dev";
var prefix = "$";

// Developer mode
var dev = false;

// uptime server
var minutes;
var hours;
var totalSeconds = 0;

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
	if(!dev) {
		client.user.setActivity('Minecraft', { type: 'PLAYING' });
	} else {
		client.user.setActivity('Developer Mode', { type: 'PLAYING' });
	}

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

	bot.on('whisper', (username, message, rawMessage) => {
		if(username === bot.usermame) return;
		bot.whisper(username, 'Bạn đã nhắn với bot. Tham gia: https://discord.gg/yrNvvkqp6w')

	});

	// minecraft bot uptime
	function setTime() {
		totalSeconds += 600;
		hours = parseInt(totalSeconds / 3600);
		minutes = (totalSeconds - (hours * 3600)) / 60;
		if(hours === "NaH") {
			hours = "0";
		} else if (minutes === "NaH") {
			minutes = "0";
		}
	}

	// while connect to the server
	bot.on('login', () => {
		// uptime method
		totalSeconds = 0;
		setInterval(setTime, 10*60*1000);

		setInterval(function() {
			// Object.values(bot.players).forEach(player => addPlayTime(player.name));
			Object.values(bot.players).map(p => addPlayTime(p.username))

			function addPlayTime(player) {
				let playtime = db.get(`${player}_playtime`);

				if(playtime === null) { // tao database playtime
					db.set(`${player}_playtime`, 10000);
				} else if (playtime < 2) { // do database nen se phai lam cai nay
					db.add(`${player}_playtime`, 10001);
				} else { // tao database va tinh thoi gian
					db.add(`${player}_playtime`, 10000);
				}
			}
		}, 10*1000); 

		setInterval(function() {
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
					var status = "Queue: " + queue + " - Prio: " + prio + " - TPS: " + bot.getTps() + " - Online: " + result.players.online + " - Đã tham gia server từ " + hours + " giờ " + minutes + " phút trước.";

					try {
						client.channels.cache.get(defaultChannel).setTopic(status)
					} catch (e) {
						if(!dev) return;
						console.log("SET TOPIC ERROR", e)
					}
				}
			})
		}, 10*60*1000);

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

	})
	var uuid = 0;

	bot.on('message', message => {
		var newcolor = 'DB2D2D';
		var logger = message.toString()

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

		if(logger === '2y2c đã full') return;

		if(logger.startsWith('[UUID]')) {
			uuid++;
		}

		if(logger === "Dự án quét sạch mọi block trên y119 (không tính đường cao tốc) vẫn đang được diễn ra trong diện tích 1000x1000 block với trung tâm là x:0 z:0 nether.") {
			newcolor = "0xb60000";
			deathMsg = logger;
		}

		if(logger.startsWith("[Broadcast]")) {
			newcolor = "0xb60000";
			deathMsg = logger;
		}
		
		if(logger === "Dạo này nhà mạng Việt Nam bóp băng thông ra nước ngoài vào buổi tối nên ping sẽ cao hơn từ khoảng 8h tối đến 12h tối."){
			newcolor = "0xb60000";
			deathMsg = logger;
		}

		if(logger.startsWith("[Server]")) {
			newcolor = '0xb60000';
			deathMsg = logger;
		}
		
		if(logger === "Đang vào 2y2c") {
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

			if(logger === "Donate để duy trì server admin đang đói chết con *ĩ *ẹ.") {
				newcolor = '0xb60000';
				deathMsg = logger;
				return;
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
			|| logger.includes('khô')) {
				var user = logger.split(" ")[0];
				let data = db.get(`${user}_dead`);

				if(logger.includes("nhắn")) return;

				if(data === null) {
					db.set(`${user}_dead`, 1)
				} else {
					db.add(`${user}_dead`, 1)
				}

				deathMsg = logger;
			}
		
		// return error message
		if(deathMsg === undefined) return;

		var newDeathMsg2 = deathMsg.replace(/`/ig, "\\`")
		var newDeathMsg = newDeathMsg2.replace(/_/ig, "\\_")

		var embedDeath = new Discord.MessageEmbed()
							.setDescription(newDeathMsg)
							.setColor(newcolor)

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

		if(newUsername === undefined) {
			newUsername = username;
		}
		
		if(newUsername === bot.username) return;
 
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

		if(newUsername === undefined) {
			newUsername = username;
		}

		if(newUsername === bot.username) return;

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

	bot.on('windowOpen', () => { // slot button mode cb
		if(dev) {
			console.log('Window open')
		}

		bot.clickWindow(4, 0, 0)
		delay(1000)
		bot.clickWindow(3, 0, 0)
		bot.clickWindow(7, 0, 0)
		bot.clickWindow(1, 0, 0)
		
		bot.setQuickBarSlot(0)
		bot.activateItem()
	});

	var sending = false;
	var stats = false;
	bot.on('spawn', () => {
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
		
		var str = '> !fj Xem ngày người chơi lần đầu vào server. | > Tham gia bot discord tại : https://discord.gg/yrNvvkqp6w | > Server cho anh em luyện pvp : 2y2cpvp.sytes.net | > Kiểm tra hàng chờ hiện tại : !queue | > !ping để xem ping hiện tại của bạn hoặc ai đó | > !stats <name> xem chỉ số người khác | > !kd <name> Xem số kill và death của ai đó | > !time xem số ngày đã tồn tại của thế giới.';
		
		var words = str.split(' | ');

		var random = words[Math.floor(Math.random() * words.length)];
		
		setInterval(function() {
			if(sending) return;
			sending = true;
			autoMsg();
		}, 20*60*1000);

		function autoMsg() {
			setTimeout(function() {
				bot.chat(random)
				sending = false;
			}, 6*1000);
		}

	});
	var setQueue = false;
	bot.on("playerlist_header", data => {
		/*
			var footer = data.footer;
			var ss1 = footer.replace(/\\n/ig, " ");
			var ss2 = ss1.replace(/-/ig, "");
			var ss3 = ss2.replace(/§3|§d|§a|§r/ig, "");
			var ss4 = ss3.replace(/{"text":"/ig,"")

			// replace all space to none
			var ss5 = ss4.replace("    ", " ")
			var ss6 = ss5.replace("    ", " ")

			// .. tps .. players .. ping
			//console.log(ss6)
			const tps = ss6.split(" ")[1];
			const player = ss6.split(" ")[3];
			const ping = ss6.split(" ")[5];
			
			const topics = tps + " tps - " + player + " players - " + ping + " ping" + "\n- Đã tham gia server từ " + hours + " tiếng trước.";

		setInterval(function() {
			try {
				client.channels.cache.get(defaultChannel).setTopic(tps + " tps - " + player + " players - " + ping + " ping" + "\n- Đã tham gia server từ " + hours + " tiếng trước.", "suc")
			} catch (e) {
				if(!dev) return;
				console.log("SET TOPIC ERROR", e)
			}
			
		}, 10*60*1000); */
		/*
		if(setQueue) return;
		setQueue = true;
		var header = data.header;
		var s1 = header.replace(/\\n/ig, " ");
		var s2 = s1.replace(/ 2y2c  2y2c §bđã full /ig, "");
		var s3 = s2.replace(/§b|§l|§6/ig, "");
		var s4 = s3.replace(/{"text":"/ig, "");
		var s5 = s4.replace(/"}/ig, "");

		if(s5 === null) return;
		if(s5 === undefined) return;
		queueLog(s5);
		*/
	});

	function queueLog(s5) {
		setQueue = true;
		var embed = new Discord.MessageEmbed()
			.setDescription(s5)
			.setColor("0xFFCE00")

		setTimeout(function() {
			setQueue = false;
			try {
			client.channels.cache.get(defaultChannel).send(embed);
			} catch (e) {
			if(!dev) return;
			console.log("QUEUE MESSAGE ", e)
			}
			
		}, 10000); 
	} 

	bot.on('nonSpokenChat', (message) => {
		console.log(`Non spoken chat: ${message}`)
	})

	bot.on('chat', (username, logger) => {
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

		/*
		const playerNames = Object.values(bot.players).map(p => p.username)
		const s1 = playerNames.toString().replace(/,/ig, " ")
		var s3 = s2.toString();
		console.log(s1) */


		// coords
		if(newCmd === bp + "coords") {
			var posi = bot.entity.position;
			setTimeout(function() {
				bot.whisper(username, `Vị trí bot hiện tại: ${posi}`)
			}, 3*1000);
			isCommand = true;
		}

		if(logger.startsWith(bp + "firstjoin") || logger.startsWith(bp + "fj")) {
			isCommand = true;
			var args;

			var str = logger.replace(".", "");
			args = str.split(" ")[1];

			if(newCmd === bp + "fj" || newCmd === bp + "firstjoin") {
				args = username;
			}

			let firstjoin = db.get(`${args}_firstjoin`);

			if(firstjoin === null) {
				firstjoin = `Chưa từng tham gia vào server.`;
			}

			setTimeout(function() {
				bot.chat(`> ${args}: ${args_firstjoin}`)
			}, 5*1000);
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

			if(playtime === null) {
				playtime = `Chưa từng được tính thời gian.`;
			}
			
			setTimeout(function() {
				var pt = playtime/1000;
				var hourss = parseInt(pt / 3600);
				var days = parseInt((pt - (hourss * 1440)) / 3600);
				var minutess  =  parseInt((pt - (hourss * 3600)) / 60);
				bot.chat(`> ${args}: ${days} ngày ${hourss} giờ ${minutess} phút`)
			}, 5*1000);
		}

		if(logger.startsWith(bp + "stats")) {
			isCommand = true;
			var args;

			var str = logger.replace(".", "");
			args = str.split(" ")[1];
			if(newCmd === bp + "stats") {
				args = username;
			}

			if(args === "Maple") {
				setTimeout(function() {
					bot.chat(`> Maple: [Kills: 0 - Deaths: 0 - Ratio: None]`);
				}, 3*1000);
				return;
			}
			
			let die = db.get(`${args}_dead`);
			let kills = db.get(`${args}_kills`);

			var ratio = kills/die;
			var ratioFixed = ratio.toFixed(2);

			if(ratioFixed === "NaN" || ratioFixed === "Infinity") {
				ratioFixed = "None";
			}

			if(die === null) {
				die = 0;
			}

			if(kills === null) {
				kills = 0;
			}

			setTimeout(function() {
				bot.chat(`> ${args}: [Kills: ${kills} - Deaths: ${die} - Ratio: ${ratioFixed}]`)
			}, 5*1000);
		}

		if(logger.startsWith(bp + "kd")) {
			isCommand = true;
			var args;

			var str = logger.replace(".", "");
			args = str.split(" ")[1];

			if(args === "Maple") {
				setTimeout(function() {
					bot.chat(`> Maple: [Kills: 0 - Deaths: 0 - Ratio: None]`)
				}, 3*1000);
				return;
			}
			
			if(newCmd === bp + "kd") {
				args = username;
			}
			
			if(args === "Maple") {
				setTimeout(function() {
					bot.chat(`> Maple: [Kills: 0 - Deaths: 0 - Ratio: None]`)
				}, 3*1000);
				return;
			}
			
			let die = db.get(`${args}_dead`);
			let kills = db.get(`${args}_kills`);

			var ratio = kills/die;
			var ratioFixed = ratio.toFixed(2);

			if(ratioFixed === "NaN" || ratioFixed === "Infinity") {
				ratioFixed = "None";
			}

			if(die === null) {
				die = 0;
			}

			if(kills === null) {
				kills = 0;
			}

			setTimeout(function() {
				bot.chat(`> ${args}: [Kills: ${kills} - Deaths: ${die} - Ratio: ${ratioFixed}]`)
			}, 5*1000);
			
		}

		if(newCmd === bp + "help") {
			isCommand = true;
			setTimeout(function() {
				bot.whisper(username, 'Xem tất cả lệnh tại: https://dicord.gg/yrNvvkqp6w')
				}, 3*1000);
		}

		if(newCmd === bp + "time") {
			isCommand = true;
			setTimeout(function() {
				bot.whisper(username, `Thế giới đã tồn tại được ${bot.time.day} ngày.`)
			}, 3*1000);
		}

		// TPS
		if(newCmd === bp + "tps") {
			isCommand = true;
			setTimeout(function() {
				bot.whisper(username, `Server TPS: ${bot.getTps()} (Thông số không chắc chắn chính xác 100%!)`)
			}, 3*1000);
		}
		
		// Ping
		if(logger === bp + "ping.") {
			isCommand = true;
			try {
				setTimeout(function() {
					bot.chat("> " + username + ": " + bot.players[username].ping + "ms");
			}, 3*1000);
			} catch (E) {
				if(!dev) return;
				console.log("PING ERROR", E)
			}
		}

		// Ping other
		if(logger.startsWith(bp + "ping")) {
			isCommand = true;
			if(logger === bp + "ping.") {

			} else {
				var str = logger.replace(".", "");
				var user = str.split(" ")[1];

				try {
					bot.chat("> " + user + ": " + bot.players[user].ping + "ms");
				} catch (e) { 
					if(!dev) return;
					console.log("PING OTHER DEBUG ", e)
				}
			}
			
		}

		// Kill
		if(newCmd === bp + "kill" || newCmd === bp + 'suicide') {
			if(dev) return;
			isCommand = true;
			bot.chat('> Attemping /kill');
			setTimeout(function() {
				bot.chat('/kill')
			}, 3*1000);
		}
		
		if (newCmd === bp + "queue" | newCmd === bp + "q" || newCmd === bp + "normalqueue" || newCmd === bp + "nq" || newCmd === bp + "prio" || newCmd === bp + "prioqueue") {
			isCommand = true;
			queue.ping({"host": config.ip}, (err, result) =>{
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

				if(newCmd === bp + "prioqueue" || newCmd === bp + "prio") {
					if(prio < 1) {
						setTimeout(function() {
							bot.whisper(username, `Không có bất kì hàng chờ ưu tiên nào.`);
						}, 3*1000);
						return;
					}
					setTimeout(function() {
						bot.whisper(username, `Hàng chờ ưu tiên là ${prio}`);
					}, 3*1000);
				}

				if(newCmd === bp + "normalqueue" || newCmd === bp + "nq") {
					if(queue < 1) {
						setTimeout(function() {
							bot.whisper(username, `Không có bất kì hàng chờ nào.`);
						}, 3*1000);
						return;
					}
					bot.whisper(username, `Hàng chờ bình thường là ${queue}`);
				}

				if(newCmd === bp + "q" || newCmd === bp + "queue") {
					setTimeout(function() {
						bot.whisper(username, `Hàng chờ bình thường là ${queue}, hàng chờ ưu tiên là ${prio}`);
					}, 3*1000);
				}
				//bot.whisper(username, `Normal queue: ${queue} | Prio queue: ${prio}`)
				
			})
		}

		if(username === "0" && logger.includes("đã trở thành")) return;
		
		// Waiting for chat
		if(username === "CS" && logger.startsWith("Wait") && logger.includes("before sending another message!")) return;

		// cancel similar chat
		if(username === "similar" || logger === "message.") return;
		if(username === "PistonChat" && logger === "This player doesn't exist!") return;
		
		// anti afk
		if(username === "Name"
		|| username === "Kills"
		|| username === "Deaths"
		|| username === "Ratio"
		|| username === "Streak"
		|| username === "Elo") 
			return;
		
		if(username === "Achievement") return;
		if(username === "auth") return;

		if(username === "n") return;
		if(username === "ReadTimeoutException") return;

		// cancel uuid
		if(username === "UUID") return;
		
		if(username === "c" || username === "d") return;
		if(username === "Broadcast") return;

		// restarts
		if(logger === "Server sẽ Restart sau 15 phút!") {
			if(dev) return;
			client.channels.cache.get('795534684967665695').send("@everyone [AutoRestart] Server sẽ Restart sau 15 phút!");
		}
		if(logger === "Server sẽ Restart sau 5 phút!") {
			if(dev) return;
			client.channels.cache.get('795534684967665695').send("@everyone [AutoRestart] Server sẽ Restart sau 5 phút!");
		}
		if(logger === "Server sẽ Restart sau 5 giây!") {
			if(dev) return;
			client.channels.cache.get('795534684967665695').send("@everyone [AutoRestart] Server sẽ Restart sau 5 giây!");
		}
		if(username === "AutoRestart") return;
		
		// check > msg
		if(logger.startsWith(">")) {
			color = "2EA711";
		}

		// return broadcast
		if(username === "c" && logger === "vẫn đang được diễn ra trong diện tích 1000x1000 block với trung tâm là x:0 z:0 nether.") return;

		var msg = false;

		// Command whisper
		if(isCommand && logger === "Bạn đã nhắn với bot. Tham gia: https://discord.gg/yrNvvkqp6w"
		|| logger === "Xem tất cả lệnh tại: https://dicord.gg/yrNvvkqp6w"
		|| logger.startsWith('Hàng chờ bình thường hiện tại')
		|| logger.startsWith('Hàng chờ ưu tiên hiện tại')
		|| logger.startsWith('Bạn đã nhận được')
		|| logger.startsWith('Server TPS:')
		|| logger.startsWith("Vị trí bot hiện tại:")
		|| logger.startsWith('Thế giới đã tồn tại được')
		|| logger.startsWith('Hàng chờ bình thường là')
		|| logger.startsWith('Hàng chờ ưu tiên là')
		|| logger.startsWith('Không có bất kì hàng chờ')) {
			isCommand = false;
			color = "0xFD00FF";
			msg = true;
		}

		const dauhuyen = logger.replace(/`/ig, "\\`");
		const newLogger = dauhuyen.replace(/_/ig, "\\_");
		const newUsername = username.replace(/_/ig, "\\_");
		
		if(newLogger === undefined) {
			newLogger = logger;
		}

		if(newUsername === undefined) {
			newUsername = username;
		}

		// format username with whisper
		var usernameFormatted;

		if(msg) {
			usernameFormatted = `nhắn cho ${newUsername}:`;
		} else {
			usernameFormatted = `**<${newUsername}>**`;
		}

		// MAIN chat
		var chat = new Discord.MessageEmbed()
					.setDescription(`${usernameFormatted}  ${newLogger}`)
					.setColor(color);
		try {
			client.channels.cache.get(defaultChannel).send(chat);
			color = "0x979797";
		} catch(e) {
			if(!dev) return
			console.log("CHAT MESSAGE ERROR MAIN", e)
		}

	});
		
	bot.on('kicked', (reason, loggedIn) => {
		console.log(`${reason} - ${loggedIn}`);
	});

	bot.on('end', function(reason) {
        waitUntil(180000, 25, function condition() {
          totalSeconds = 0;
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

		if(msg.content === "!svtps") {
			msg.channel.send(bot.getTps())
		}
		/*
		if(msg.content === "!tps") {
			var d = new Date();
			var time = d.getMilliseconds();
			console.log(time)

			  let currentTime = parseInt(bot.time.age);
			  
			if (currentTime < 500)
				return;

			var timeOffset = Math.abs(1000 - (currentTime - currentTime)) + 1000;
			var svtps = Math.round(clamp(20 / (timeOffset / 1000), 0, 20) * 100) / 100;
			msg.channel.send('current tps : ' + svtps)

			function clamp(num, min, max) {
				return num <= min ? min : num >= max ? max : num;
			  }

			  /*
			  let time = parseInt(bot.time.age)
				const calcTps = []
				function run (bot) {
					time = parseInt(bot.time.age)
					setTimeout(() => {
					const diff = parseInt(bot.time.age) - time

					calcTps.push(diff)
					if (calcTps.length > 20) {
						calcTps.shift()
					}
					run(bot)
					}, 1000)
				}
				run(bot)

				bot.getTps = function () {
					return calcTps.filter(tps => tps === 20).length
				}
  
		} */

		if(dev) {
			if(msg.channel.id === "802456011252039680") {
				if(msg.author == client.user) return;
				bot.chat(msg.content);
			}
			if(msg.channel.id == '802454010400604161') {	
				if(msg.content.startsWith(">")) return;
				if(msg.content.startsWith(prefix)) return;
				
				var str = msg.content;
				var content = str.charAt(0).toUpperCase() + str.slice(1);

				if(!content) return;
				
				bot.chat(`> [DEV: ${msg.author.tag}] ${content}`);
	
				const send = client.emojis.cache.find(emoji => emoji.name === "1505_yes");
				msg.react(send);
			}
			return;
		}

		if(msg.channel.id === '797426761142632450') {
			if(msg.author == client.user) return;
			bot.chat(msg.content);
		}

		if(msg.channel.id == '795135669868822528') {
			if(msg.content.startsWith(">")) return;
			if(msg.content.startsWith(prefix)) return;
			
			var content = msg.content;

			if(!content) return;
			
			chat(content);

			function chat(content) {
				bot.chat(`> [${msg.author.tag}] ${content}`);
			}

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
	

	if(command === "uptime") {
		if(!dev) return;
		console.log(minutes + ":" + hours);
	}

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

			var zero = new Discord.MessageEmbed()
									.setDescription(`Số death của **${args[1]}** là **0**.`)
									.setColor("0xC51515");

			let death = db.get(`${args[1]}_kills`)

			if(death === null) return message.channel.send(zero);

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
			ratioFixed = "None";
		}
		if(args[0] === "Maple") {
			kills = 0;
			deads = 0;
		}

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
	
	}

	if(command === "playtime" || command === "pt") {
		var e = new Discord.MessageEmbed()
					.setDescription('Bạn cần nhập tên để xem thông tin. - `'+ prefix + 'pt <name>`')
					.setColor('0xC51515')
					
		if (!args[0]) return message.channel.send(e)

		let playtime = db.get(`${args[0]}_playtime`);

		if(playtime === null) {
			playtime = `Chưa từng được tính thời gian.`;
		}

		let name = db.get(`${args[0]}_playtime`);
		var pt = name/1000;
		var hourss = parseInt(pt / 3600);
		var days = parseInt((pt - (hourss * 1440)) / 3600);
		var minutess  =  parseInt((pt - (hourss * 3600)) / 60);

		var embed = new Discord.MessageEmbed()
						.setDescription(`${args[0]}: ${days} ngày ${hours} giờ ${minutess} phút`)
						.setColor(0x2EA711);

		message.channel.send(embed)
	}
	
	if(command === "firstjoin" || command === "fj") {
		let firstjoin = db.get(`${args[0]}_firstjoin`);
		
		var e = new Discord.MessageEmbed()
					.setDescription('Bạn cần nhập tên nguời chơi.')
					.setColor('0xC51515')
					

		if (!args[0]) return message.channel.send(e)


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
		
		message.channel.send(embed)
	}

	if(command === "help") {
		var channel = client.channels.cache.get('795193962541481994').toString();
		const embed = new Discord.MessageEmbed()
					.setColor(0x000DFF)
					.setTitle('[Help Command]')
					.addField("*[Discord Command]*", "\u200b", false)
					.addField("\u200b", prefix + 'status - ``Xem trạng thái của server hàng chờ, online``', false)
					.addField("\u200b", prefix + 'online - ``Xem số người online``', false)
					.addField("\u200b", prefix + 'queue - ``Xem hàng chờ của 2y2c``', false)
					.addField("\u200b", prefix + 'prio - ``Xem hàng chờ ưu tiên``', false)
					.addFields({ name: '\u200b', value: '\u200b', inline: false })
					.addField("*[Minecraft Command]*", "\u200b", false)
					.addField("\u200b", prefix + 'kd - ``Xem số KD của ai đó``', false)
					.addField("\u200b", prefix + 'pt - ``Xem thời gian chơi``', false)
					.addField("\u200b", prefix + 'reset - ``Reset số kd/stats``', false)
					.addFields({ name: '\u200b', value: '\u200b', inline: false })
					.addFields({ name: "\u200b", value: "Xem tất cả lệnh trong **GAME** tại " + channel + " (click)", inline: false})
					.setFooter(footer)
					.setTimestamp();
		message.channel.send(embed).then(message => {
			message.delete({ timeout: 10000 });
		});
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