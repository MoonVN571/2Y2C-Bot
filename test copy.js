// 2Y2C
const Discord = require("discord.js");
const client = new Discord.Client();

// Token
const token = require('dotenv').config();
const config = {
  token: process.env.token
};

// mc protocol ping
const mc = require("minecraft-protocol")
const prioQueue = require("minecraft-protocol")
const normalQueue = require("minecraft-protocol")
const topic = require("minecraft-protocol")
var waitUntil = require('wait-until');

const prefix = "$";

var mineflayer = require('mineflayer')
var tpsPlugin = require('mineflayer-tps')(mineflayer)
var delay = require('delay')
var db = require('quick.db');

// debugger
var debug = true;

// Sending message with error and catch
var debugMsg = true;

// Developer mode
var dev = false;

var clone = true;

// death message log
var deathLog = false;

// footer
const footer = "moonbot dev";

var defaultChannel;

// check channel debug
if(dev) { // 795135669868822528 main
	defaultChannel = '802454010400604161';
} else {
	defaultChannel = '795135669868822528';

	if(!clone) return
	defaultChannel = '802454010400604161';
}

if(deathLog) {
	console.log('Death Logger Mode True')
} else {
	console.log('Death Logger Mode: False')
}

// Show DEBUG status
if(debug) {
	console.log('DEBUG Mode: True')
} else {
	console.log('DEBUG Mode: False')
}

if(dev) {
	console.log('Developer Mode: True')
} else {
	console.log('Developer Mode: False')
}

if(debugMsg) {
	console.log('DEBUG Send Message Mode: True')
} else {
	console.log('DEBUG Send Message Mode: False')
}



client.on('ready', () => {
	console.log('Bot online!');
	client.user.setActivity('Minecraft', { type: 'PLAYING' });
	
});

// Create this bot
createBot()

function createBot () {
	const bot = mineflayer.createBot({
		host: '2y2c.org',
		port: 25565,
		username: '2y2cBot2',
		version: "1.12.2"
	});

	/// set default color embed
	var color = "0x979797";

	var lobby = false;

	bot.loadPlugin(tpsPlugin);

	bot.on('whisper', (username, message, rawMessage) => {
		// Time
		var today = new Date()
		let day = ("00" +today.getDate()).slice(-2)
		let month = ("00" +(today.getMonth()+1)).slice(-2)
		let years = ("00" + today.getFullYear()).slice(-2)
		let hours = ("00" + today.getHours()).slice(-2)
		let min = ("00" + today.getMinutes()).slice(-2)
		let sec = ("00" + today.getSeconds()).slice(-2)
		var date = day +'/'+month+'/'+years+' ' + hours + ':' + min;
		if(username === bot.usermame) return;
		console.log(`${date} | ${username}: ${message}`)
		bot.whisper(username, 'Bạn đã nhắn với bot. Tham gia: https://discord.gg/yrNvvkqp6w')

	});

	bot.on('login', () => {
		lobby = true;

		const queuejoined = new Discord.MessageEmbed()
					.setDescription(`**Bot đã tham gia hàng chờ!**`)
					.setColor("FFFB00");

		try {
			client.channels.cache.get(defaultChannel).send(queuejoined);
		} catch(e) {
			if(!debugMsg) return;
			console.log("JOINED THE SERVER MESSAGE ERROR ", e)
		}
		String.prototype.toHHMMSS = function () {
			var sec_num = parseInt(this, 10); // don't forget the second param
			var hours   = Math.floor(sec_num / 3600);
			var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
			var seconds = sec_num - (hours * 3600) - (minutes * 60);
		
			if (hours   < 10) {hours   = "0"+hours;}
			if (minutes < 10) {minutes = "0"+minutes;}
			if (seconds < 10) {seconds = "0"+seconds;}
			var time    = hours+'H '+minutes+'M '+seconds + 'S';
			return time;
		}
	
		/*
		if(command === "uptime") {
			var time = process.uptime();
			var uptime = (time + "").toHHMMSS();
			message.channel.send("Current uptime: " + uptime)
		} */
	})

	bot.on('message', message => {
		var newcolor = 'DB2D2D';
		var logger = message.toString()
		var embed = new Discord.MessageEmbed()
								.setDescription(logger)
								.setColor(color) // default
		try {
			if(!dev) {
				client.channels.cache.get('797426761142632450').send(embed);
			} else {
				client.channels.cache.get('802456011252039680').send(embed);
			}
		} catch(e) {
			if(!debugMsg) return;
				console.log("CHAT CLONE ERROR ", e)
		}

		if(logger === '2y2c đã full') return;

		if(logger === "Dự án quét sạch mọi block trên y119 (không tính đường cao tốc) vẫn đang được diễn ra trong diện tích 1000x1000 block với trung tâm là x:0 z:0 nether.") {
			newcolor = "0xb60000";
			deathmsg = logger;
		}

		if(logger.startsWith("[Broadcast]")) {
			newcolor = "0xb60000";
			deathmsg = logger;
		}
		
		if(logger === "Donate để duy trì server admin đang đói chết con *ĩ *ẹ.") {
			newcolor = '0xb60000';
			deathMsg = logger;
		}

		if(logger.startsWith("[Server]")) {
			newcolor = '0xb60000';
			deathMsg = logger;
		}
		
		if(logger === 'Đang vào 2y2c') {
			lobby = false;
			const joined = new Discord.MessageEmbed()
					.setDescription(`**Bot đang vào server chính!**`)
					.setColor("FFFB00");

			try {
				client.channels.cache.get(defaultChannel).send(joined);
			} catch(e) {
				if(!debugMsg) return;
				console.log("JOINED THE MAIN SERVER MSG ERROR ", e)
			}
		}

		if(logger === undefined) return; // return if msg is undefined
		if(logger === null) return; // return if null msg

		// return message on chat
		if(logger.includes('<') && logger.includes(">")) return;

		// suicide when see this
		if(logger === "You cannot chat until you move!") {
			bot.chat('/kill')
		}

		// value to embed
		var deathMsg;


		// kill Message
			if(logger.includes('chết cháy khi đánh với')) {
				var str = logger;
				var user = str.split(" ")[6];

				let data = db.get(`${user}_kills`);

				if(deathLog) {
					console.log(logger);
					console.log(user);
					console.log('--------------------')
				}

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

				if(deathLog) {
					console.log(logger);
					console.log(user);
					console.log('--------------------')
				}
				
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

				if(logger.includes('Zombie Villager')) {
					deathMsg = logger;
					return;
				}

				var str = logger;
				var user = str.split(" ")[12];
				
				if(deathLog) {
					console.log(logger);
					console.log(user);
					console.log('--------------------')
				}

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

				if(deathLog) {
					console.log(logger);
					console.log(user);
					console.log('--------------------')
				}
				
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
				
				if(deathLog) {
					console.log(logger);
					console.log(user);
					console.log('--------------------')
				}
				
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

				if(deathLog) {
					console.log(logger);
					console.log(user);
					console.log('--------------------')
				}
				
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
				
				if(deathLog) {
					console.log(logger);
					console.log(user);
					console.log('--------------------')
				}
				
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
				
				if(deathLog) {
					console.log(logger);
					console.log(user);
					console.log('--------------------')
				}
				
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
				
				if(deathLog) {
					console.log(logger);
					console.log(user);
					console.log('--------------------')
				}
				
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
				} else if (logger.includes('cá bạc')) {
					deathMsg = logger;
					return;
				} else if (logger.includes('Blaze')) {
					deathMsg = logger;
					return;
				}

				var str = logger;
				var user = str.split(" ")[5];

				if(deathLog) {
					console.log(logger);
					console.log(user);
					console.log('--------------------')
				}
				
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
			|| logger.includes('Chết')) {
				var user = logger.split(" ")[0];
				let data = db.get(`${user}_dead`);
				if(logger.inlucdes('Bạn đã nhận được')) {
					return;
				}
				if(deathLog) {
					console.log(logger);
					console.log(user);
					console.log('--------------------')
				}

				if(data === null) {
					db.set(`${user}_dead`, 1)
				} else {
					db.add(`${user}_dead`, 1)
				}

				deathMsg = logger;
			}
		
		// return error message
		if(deathMsg === undefined) return;

		// replace all _ with cancel \_
		var newDeathMsg2 = deathMsg.replace(/`/ig, "\\`")
		var newDeathMsg = newDeathMsg2.replace(/_/ig, "\\_")

		var embedDeath = new Discord.MessageEmbed()
							.setDescription(newDeathMsg)
							.setColor(newcolor) // default red

		try {
			client.channels.cache.get(defaultChannel).send(embedDeath);
			newcolor = "DB2D2D";
		} catch (e) {
			if(!debugMsg) return;
			console.log("CHAT MESSAGE ERROR", e)
		}
	})

	bot.on("playerJoined", (player) => {
		var username = player.username;
		var newUsername = username.replace(/_/ig, "\\_");

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
			if(!debugMsg) return;
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
			if(!debugMsg) return;
			console.log("LEAVE MESSAGE ERROR", e)
		}
	});

	bot.on('windowOpen', () => { // slot button mode cb
		if(debug) {
			console.log('Window open')
		}

		bot.clickWindow(4,0,0)
		delay(1000)
		bot.clickWindow(3,0,0)
		bot.clickWindow(7,0,0)
		bot.clickWindow(1,0,0)
	});

	bot.on('spawn', () => {
		setInterval(function() {
			topic.ping({"host": "2y2c.org"}, (err, result) =>{
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
						var players2 = 'unknwn';
					}

					var oldold = players.toString().replace(",§6Cựu binh: §l0", "");
					var old = oldold.toString().replace(",§6Cựu binh: §l1", "");
					var queue = old.toString().replace("§6Bình thường: §l", "");

					var prio = players2.toString().replace("2y2c §6Queue Size,§6Ưu Tiên: §l", "");
					var status = "Queue: " + queue + " - Prio: " + prio + " - TPS: " + bot.getTps();
					
					// Time
					var today = new Date()
					let day = ("00" +today.getDate()).slice(-2)
					let month = ("00" +(today.getMonth()+1)).slice(-2)
					let years = ("00" + today.getFullYear()).slice(-2)
					let hours = ("00" + today.getHours()).slice(-2)
					let min = ("00" + today.getMinutes()).slice(-2)
					let sec = ("00" + today.getSeconds()).slice(-2)
					var date = day +'/'+month+'/'+years+' ' + hours + ':' + min;
					
					try {
						client.channels.cache.get(defaultChannel).setTopic(status + ` - Online: ${result.players.online}` + ` | Đã cập nhật lại lúc: ${date}`)
					} catch (e) {
						if(!debugMsg) return;
						console.log("SET TOPIC ERROR", e)
					}
				}
			});
		}, 5*60*1000);

		setInterval(function() {
			bot.chat('/stats');
		}, 3*60*1000);

		setInterval(function() {
			bot.chat('> Tham gia discord của bot: https://discord.gg/yrNvvkqp6w')
		}, 5*60*1000);

		setInterval(function() {
			bot.chat('> Luyện tập crystal pvp tại: 2y2cpvp.sytes.net.')
		}, 11*60*1000);

		setInterval(function() {
			bot.chat('> Kiểm tra hàng chờ hiện tại: !queue')
		}, 16*60*1000);
		
		setInterval(function() {
			bot.chat('> Kiểm tra hàng chờ ưu tiên hiện tại: !prio')
		}, 23*60*1000);

		setInterval(function() {
			bot.chat('> !ping để xem ping hiên tại của bạn hoặc của người khác.')
		}, 42*60*1000);
	
		setInterval(function() {
			bot.chat('> !stats <name> xem chỉ số người khác.')
		}, 48*60*1000);

		setInterval(function() {
			bot.chat('> !kd <name> Xem số kill và death của ai đó.')
		}, 58*60*1000);
	});

	// Tablist content to show queue
	bot._client.on("playerlist_header", data => {
		//if(!dev) return;
		if(lobby) {
			var header = data.header;
			var s1 = header.replace(/\\n/ig, " ");
			var s2 = s1.replace(/ 2y2c  2y2c §bđã full /ig, "");
			var s3 = s2.replace(/§b|§l|§6/ig, "");
			var s4 = s3.replace(/{"text":"/ig, "");
			var s5 = s4.replace(/"}/ig, "");

			queueLog(s5);

		} else {
			var footer = data.footer;
			//console.log(footer)
			var s1 = footer.replace(/\\n/ig, " ");
			var s2 = s1.replace(/-/ig, "");
			var s3 = s2.replace(/§3|§d|§a\§r/ig, "");
			var s4 = s3.replace(/{"text":"/ig,"")
			// var tps = s4.split(" ")[1];
			// var online = s4.split(" ")[3];
			// var ping = s4.split(" ")[5];

			// replace all space to none
			var s5 = s4.replace(" ", "")

			// replace to space string
			var strTps = s5.replace("tps", " tps")
			var strPlayer = strTps.replace("players", " players ")
			var strGlobal = strPlayer.replace("ping", " ping ")

			// .. tps .. players .. ping
			var  tps = strGlobal.split(" ")[1];
			var player = strGlobal.split(" ")[2];
			var ping = strGlobal.split(" ")[3];
			
			var global = tps + " tps " + ping + " players - " + ping + " ping";

			// //setTimeout(function() {
				// console.log("tps " + tps + " online " + online + "ping " +ping)
				//console.log(s4)
			//}, 20000)
		}
		 
	})

	function queueLog(s5) {
		setTimeout(function() {
			if(!lobby) return;
			//if(!dev) return;
				try {
					var embed = new Discord.MessageEmbed()
									.setDescription(s5)
									.setColor("0xFFCE00")
					client.channels.cache.get(defaultChannel).send(embed);
				} catch (e) {
					if(!debugMsg) return;
					console.log("QUEUE MESSAGE ", e)
				}
			
		}, 10000);
	}

	bot.on('chat', function(username, logger) {
		var botPrefix = "!";

		if(dev) {
			botPrefix = "!!";
		} else {
			botPrefix = "!";
		}
		
		var newCmd;
		if(logger.startsWith(botPrefix)) {
			newCmd = logger.replace(".", "")
		}

		// coords
		if(newCmd === botPrefix + "coords") {
			bot.whisper(username, `Vị trí bot hiện tại: ${bot.entity.position}`)
		}

		// deaths
		if(logger.startsWith(botPrefix + "stats")) {

			var str = logger.replace(".", "");
			var args = str.split(" ")[1] || username;

			
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
				bot.chat(`> ${args}'s statistics - Kills: ${kills} | Deaths: ${die} | K/D Ratio : ${ratioFixed}`)
			}, 3*1000);
		}

		if(logger.startsWith(botPrefix + "kd")) {

			var str = logger.replace(".", "");
			var args = str.split(" ")[1] || username;

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
				bot.chat(`> ${args}'s statistics - Kills: ${kills} | Deaths: ${die} | K/D Ratio : ${ratioFixed}`)
			}, 3*1000);
			
		}

		// Help
		if(newCmd === botPrefix + "help") {
			bot.whisper(username, 'Xem tất cả lệnh tại: https://dicord.gg/yrNvvkqp6w')
		}

		// Discord
		if(newCmd === botPrefix + "discord") {
			bot.whisper(username, `Link server discord: dicord.gg/yrNvvkqp6w`)
		}

		if(newCmd === botPrefix + "time") {
			bot.whisper(username, `Thế giới đã tồn tại được ${bot.time.day} ngày.`)
		}
		
		// Kit
		if(logger.startsWith(botPrefix + "kit")) {

			var newLog = logger.replace('!kit', '')
			var args = newLog.split(',')
			
			if(logger === "!kit") {
				bot.whisper(username, `Bạn đã nhận được kit`)
				return;
			} else {
				bot.whisper(username, `Bạn đã nhận được kit tên ${args}`)
			}
		}

		// buykit
		if(newCmd === botPrefix + "buykit") {
			bot.whisper(username, 'Đéo có shop cho bạn, hãy tự tìm hiểu.')
		}

		// TPS
		if(newCmd === botPrefix + "tps") {
			bot.whisper(username, `Server TPS: ${bot.getTps()} (TPS sẽ chính xác nếu không có nhiều biến động.)`)
		}
		
		// Ping
		if(newCmd === botPrefix + "ping") {
			try {
				bot.chat("> Ping của người chơi " + username + " là " + bot.players[username].ping + "ms");
			} catch (E) {
				if(!debug) return;
				console.log("PING ERROR", E)
			}
		}

		// Ping other
		if(logger.startsWith(botPrefix + "ping")) {
			if(newCmd === botPrefix + "ping") {
				
			} else {
				var str = logger.replace(".", "");
				var user = str.split(" ")[1];
				// console.log(user)	
				try {
					bot.chat("> Ping của người chơi " + user + " là " + bot.players[user].ping + "ms");
				} catch (e) { 
					if(!debug) return;
					console.log("PING OTHER DEBUG ", e)
				}
			}
			
		}

		// Kill
		if(newCmd === botPrefix + "kill" || newCmd === botPrefix + 'suicide') {
			bot.chat('> Attemping /kill.')
			bot.chat('/kill')
		}
		
		// Prio
		if (newCmd === botPrefix + "prio") {
			prioQueue.ping({"host": "2y2c.org"}, (err, result) =>{
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
				var prio = players2.toString().replace("2y2c §6Queue Size,§6Ưu Tiên: §l", "");
				bot.whisper(username, `Hàng chờ ưu tiên hiện tại: ${prio}`)
			})

		}
		
		if (newCmd === botPrefix + "queue") {
			normalQueue.ping({"host": "2y2c.org"}, (err, result) =>{
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
				
				bot.whisper(username, `Hàng chờ bình thường hiện tại: ${queue}`)
				
			})
		}
		
		// Waiting for chat
		if(username === "CS") return;

		// cancel similar chat
		if(username === "similar" || logger === "message.") return;
		
		// anti afk
		if(username === "Name"
		|| username === "Kills"
		|| username === "Deaths"
		|| username === "Ratio"
		|| username === "Streak"
		|| username === "Elo") return;
		
		if(username === "Achievement") return;
		//if(username === "auth") return;

		// cancel uuid
		if(username === "UUID") return;
		if(username === "n") return;
		if(username === "c" || username === "d") return;
		if(username === "Broadcast") return;

		// restarts
		if(logger === "Server sẽ Restart sau 15 phút!")
			return client.channels.cache.get('795534684967665695').send("@everyone [AutoRestart] Server sẽ Restart sau 15 phút!");
		if(logger === "Server sẽ Restart sau 5 phút!")
			return client.channels.cache.get('795534684967665695').send("@everyone [AutoRestart] Server sẽ Restart sau 5 phút!");
		
		if(logger === "Server Restarting!") return client.channels.cache.get('795534684967665695').send("@everyone [AutoRestart] Server Restarting!");
		if(username === "AutoRestart") return;
		
		// check > msg
		if(logger.startsWith(">")) {
			color = "2EA711";
		}

		// new method msg
		if(username === "c" && logger === "vẫn đang được diễn ra trong diện tích 1000x1000 block với trung tâm là x:0 z:0 nether.") return;

		var str;

		// Command whisper
		if(logger === "Bạn đã nhắn với bot. Tham gia: https://discord.gg/yrNvvkqp6wyrNvvkqp6w"
		|| logger === "Đéo có shop cho bạn, hãy tự tìm hiểu."
		|| logger === 'Link server discord: dicord.gg/yrNvvkqp6w'
		|| logger === "Xem tất cả lệnh tại: https://dicord.gg/yrNvvkqp6w"
		|| logger === "Bạn phải nhập tên - !kd <name>"
		|| logger.includes('Hàng chờ bình thường hiện tại')
		|| logger.includes('Hàng chờ ưu tiên hiện tại')
		|| logger.includes('Bạn đã nhận được')
		|| logger.includes('Server TPS:')
		|| logger.includes("Vị trí bot hiện tại:")
		|| logger.includes('không tìm thấy')
		|| logger.includes('Thế giới đã tồn tại được')) {
			color = "0xFD00FF";
			str = "To ";
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

		var usernameFormatted;

		if(str === "To ") {
			usernameFormatted = `nhắn cho ${newUsername}:`;
		} else {
			usernameFormatted = `**<${newUsername}>**`;
		}

		// embed chat
		var chat = new Discord.MessageEmbed()
					.setDescription(`${usernameFormatted}  ${newLogger}`)
					.setColor(color);
		try {
			client.channels.cache.get(defaultChannel).send(chat);
			color = "0x979797";
		} catch(e) {
			console.log("CHAT MESSAGE ERROR MAIN", e)
		}

	});
		
	bot.on('end', function(reason) {
        waitUntil(180000, 25, function condition() {
          try {
			var today = new Date()
			let day = ("00" +today.getDate()).slice(-2)
			let month = ("00" +(today.getMonth()+1)).slice(-2)
			let years = ("00" + today.getFullYear()).slice(-2)
			let hours = ("00" + today.getHours()).slice(-2)
			let min = ("00" + today.getMinutes()).slice(-2)
			var date = day +'.'+month+'.'+years+' ' + hours + ':' + min;
			console.log(date + " | Bot ended, attempting to reconnect...");

			var reconnect = new Discord.MessageEmbed()
				.setDescription(`**Đang cố gắng kết nối lại với server!**`)
				.setColor("0xFFFB00");
				createBot()
			try {
				client.channels.cache.get(defaultChannel).send(reconnect);
			} catch (e) {
				console.log("ERROR AUTO RECONNECT", e);
			}
				return true;
           } catch (error) {
                console.log("Error: " + error);
                return false;
            }
        }, function done(result) { // show result
            console.log("Completed: " + result);
        });
   });

   client.on('message', msg => {

		// return user = bot
		if(msg.author.bot) return;
		
		if(dev) {
			if(msg.channel.id === "802456011252039680") {
				if(msg.author == client.user) return;
				bot.chat(msg.content);
			}
			// 2y2c dev
			if(msg.channel.id == '802454010400604161') {
				var user = msg.mentions.users.first();
	
				// return user tag
				if(user) return;
	
				if(msg.content.startsWith(">")) return;
				if(msg.content.startsWith(prefix)) return;
				
				var str = msg.content;
				var content = str.charAt(0).toUpperCase() + str.slice(1);

				if(!content) return;
				
				chat(content);
	
				function chat(content) {
					bot.chat(`> [DEV: ${msg.author.tag}] ${content}`);
				}
	
				const send = client.emojis.cache.find(emoji => emoji.name === "1505_yes");
				msg.react(send);
			}
			return;
		}

		// manage 2y2c-1
		if(msg.channel.id === '797426761142632450') {
			if(dev) return;
			if(msg.author == client.user) return;
			bot.chat(msg.content);
		}

		// chat main
		if(msg.channel.id == '795135669868822528') {
			var user = msg.mentions.users.first();

			// return user tag
			if(user) return;

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

	if(command === "stats") {
		var e = new Discord.MessageEmbed()
					.setDescription('Bạn cần nhập username để xem thông tin. - `' + prefix + 'deaths <name>`')
					.setColor('0xC51515')
					
		if (!args[0]) return message.channel.send(e)

		let kills = db.get(`${args[0]}_kills`);
		let deads = db.get(`${args[0]}_dead`);

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

	if(command === "kd") {
		var e = new Discord.MessageEmbed()
					.setDescription('Bạn cần nhập username để xem thông tin. - `' + prefix + 'kd <name>`')
					.setColor('C51515')

		if (!args[0]) return message.channel.send(e)

		let kills = db.get(`${args[0]}_kills`);
		let deads = db.get(`${args[0]}_dead`);

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
	
	if(command === "help") {
		var channel = client.channels.cache.get('795193962541481994').toString();

		const embed = new Discord.MessageEmbed()
					.setColor(0x000DFF)
					.setTitle('[Help Command]')
					.addField("*[Help Command]*", prefix + 'help - ``Mở bản này``', false)
					.addField("*[Status Command]*", prefix + 'status - ``Xem trạng thái của server hàng chờ, online``', false)
					.addField("*[Online Command]*", prefix + 'online - ``Xem số người online``', false)
					.addField("*[Queue Command]*", prefix + 'queue - ``Xem hàng chờ bình thường``', false)
					.addField("*[Priority Command]*", prefix + 'prio - ``Xem hàng chờ ưu tiên``', false)
					.addField("*[Stats Command]*", prefix + 'stats - ``Xem chỉ số của người chơi``', false)
					.addField("*[Stats Command]*", prefix + 'kd - ``Xem số KD của ai đó``', false)
					.addFields({ name: '\u200b', value: '\u200b', inline: false })
					.addFields({ name: "\u200b", value: "Xem tất cả lệnh trong **GAME** tại " + channel + " (click)", inline: false})
					.setFooter(footer)
					.setTimestamp();

		message.channel.send(embed).then(message => {
			message.delete({ timeout: 10000 });
		});

	}
	
	mc.ping({"host": "2y2c.org"}, (err, result) =>{
		if(err) {
			client.user.setActivity('server down!', { type: 'PLAYING' });
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
							.setTitle('[Queue Command]')
							.setDescription("Hàng chờ hiện tại: **" + queue + "**")
							.setFooter(footer)
							.setTimestamp();

				message.channel.send(embed).then(message => {
					message.delete({ timeout: 10000 });
				});

			}
			
			// Prio command
			if(command === "prio" || command === "p" || command === "priority") {

				const embed = new Discord.MessageEmbed()
							.setColor(0x000DFF)
							.setTitle('[Priority Command]')
							.setDescription("Hàng chờ ưu tiên hiện tại: **" + prio + "**")
							.setFooter(footer)
							.setTimestamp();

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