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
const pingQueue = require("minecraft-protocol")
const prioQueue = require("minecraft-protocol")
const topic = require("minecraft-protocol")
var waitUntil = require('wait-until');

const prefix = "$";

var mineflayer = require('mineflayer')
var tpsPlugin = require('mineflayer-tps')(mineflayer)
var delay = require('delay')
var db = require('quick.db');

const footer = "moonbot dev";
const defaultChannel = '795135669868822528';

client.on('ready', () => {
	console.log('Bot online!');
	client.user.setActivity(prefix + 'help for commands!', { type: 'LISTENING' });
});

createBot()

function createBot () {
	const bot = mineflayer.createBot({
		host: '2y2c.org',
		port: 25565,
		username: '2y2cBot',
		version: "1.12.2"
	});

	/// set default color embed
	var color = "0x979797";

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
		bot.whisper(username, 'Tại sao bạn lại nhắn tin cho 1 con bot ? - Tham gia: https://discord.gg/yrNvvkqp6w')

	});
	
	bot.on('message', message => {
		var newcolor = 'DB2D2D';
		var logger = message.toString()
		var embed = new Discord.MessageEmbed()
								.setDescription(logger)
								.setColor(color) // default
		try {
			client.channels.cache.get('797426761142632450').send(embed);
		} catch(e) {
		
		}

		if(logger === '2y2c đã full') {
			const joined = new Discord.MessageEmbed()
					.setDescription(`**Joined the queue server!**`)
					.setColor("FFFB00");

			try {
				client.channels.cache.get(defaultChannel).send(joined);
			} catch(e) {
				console.log("JOINING ERROR", e)
			}
			return;
		}
		
		if(logger === 'Đang vào 2y2c') {
			const joined = new Discord.MessageEmbed()
					.setDescription(`**Joined the main server!**`)
					.setColor("FFFB00");

			try {
				client.channels.cache.get(defaultChannel).send(joined);
			} catch(e) {
				console.log("JOINING ERROR", e)
			}
			return;
		}

		// basic check
		if(logger === undefined) return; // return if msg is undefined
		if(logger === null) return; // return if null msg
		if(logger.includes(':')) return; // return chat because of :
		if(logger.includes('<') && logger.includes(">")) return;
		var deathMsg;

		// kill
		if(logger.includes('bị bắn chết bởi')) {
			var str = logger;
			var string = str.split(" ")[0];
			var user = str.substring('5', string);

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

			if(logger.includes('Zombie Villager')) {
				deathMsg = logger;
				return;
			}

			var str = logger;
			var string = str.split(" ")[0];
			var user = str.substring('12', string);
			
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
			var string = str.split(" ")[0];
			var user = str.substring('8', string);
			
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
			var string = str.split(" ")[0];
			var user = str.substring('5', string);
			
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
			var string = str.split(" ")[0];
			var user = str.substring('9', string);
			
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
			var string = str.split(" ")[0];
			var user = str.substring('8', string);
			
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
			var string = str.split(" ")[0];
			var user = str.substring('8', string);
			
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
			var string = str.split(" ")[0];
			var user = str.substring('7', string);

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
			}

			if(logger.includes('Wither')) {
				deathMsg = logger;
				return;
			}

			if(logger.includes('Sì-ke')) {
				deathMsg = logger;
				return;
			}

			var str = logger;
			var string = str.split(" ")[0];
			var user = str.substring('5', string);
			
			let data = db.get(`${user}_kills`);
			
			if(data === null) {
				db.set(`${user}_kills`, 1)
			} else {
				db.add(`${user}_kills`, 1)
			}
			deathMsg = logger;

		}

		if(logger === "You cannot chat until you move!") {
			bot.chat('/kill')
		}
		
		// deaths
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
			if(logger.includes('<') && logger.includes('>')) return;

			if(logger.includes('đã vào server lần đầu tiên')) {
				deathMsg = logger;
				return;
			}

			if(logger === "Donate để duy trì server admin đang đói chết con *ĩ *ẹ.") {
				return;
			}

			var user = logger.split(" ")[0];
			let data = db.get(`${user}_dead`);
			
			if(data === null) {
				db.set(`${user}_dead`, 1)
			} else {
				db.add(`${user}_dead`, 1)
			}
			deathMsg = logger;
		}

		if(deathMsg === undefined) return;
		var newDeathMsg = deathMsg.replace("_", "\\_")

		var embedDeath = new Discord.MessageEmbed()
							.setDescription(newDeathMsg)
							.setColor(newcolor) // default red

		// send to a channel private
		try {
			client.channels.cache.get(defaultChannel).send(embedDeath);
		} catch (e) {
			console.log("CHAT MESSAGE ERROR", e)
		}
	})

	bot.on("playerJoined", (player) => {
		var username = player.username;
		var newUsername = username.replace("_", "\\_");

		var embed = new Discord.MessageEmbed()
							.setDescription(newUsername + " joined")
							.setColor('0xb60000')
		try {
			client.channels.cache.get(defaultChannel).send(embed);
		} catch (e) {
			console.log("JOIN MESSAGE ERROR", e)
		}
		
	});

	bot.on("playerLeft", (player) => {
		var username = player.username;
		var newUsername = username.replace("_", "\\_");

		var embed = new Discord.MessageEmbed()
							.setDescription(newUsername + " left")
							.setColor('0xb60000')
		try {
			client.channels.cache.get(defaultChannel).send(embed);
		} catch (e) {
			console.log("LEAVE MESSAGE ERROR", e)
		}
	});

	bot.on('windowOpen', () => { // slot button mode cb
		console.log('Window open')
		bot.clickWindow(8,0,0)
		delay(1000)
		bot.clickWindow(7,0,0)
		bot.clickWindow(2,0,0)
		bot.clickWindow(6,0,0)
	});

	bot.on('spawn', () => {
		setInterval(function() {
			bot.chat('/stats');
		}, 3*60);

		setInterval(function() {
			bot.chat('> Tham gia discord của bot: https://discord.gg/yrNvvkqp6w')
		}, 15*60);

		setInterval(function() {
			bot.chat('> Luyện tập crystal tại 2y2cpvp.sytes.net cùng với những thằng trùm crystal pvp.')
		}, 20*60);

		setInterval(function() {
			bot.chat('> Kiểm tra hàng chờ hiện tại: !queue')
		}, 25*60);
		
		setInterval(function() {
			bot.chat('> Kiểm tra hàng chờ ưu tiên hiện tại: !prio')
		}, 30*60);

		setInterval(function() {
			bot.chat('> !ping để xem ping hiên tại của bạn.')
		}, 35*60);
	
		setInterval(function() {
			bot.chat('> !stats <name> xem chỉ số người khác.')
		}, 40*60);

		setInterval(function() {
			bot.chat('> !kd <name> Xem số kill và death của ai đó.')
		}, 45*60);

	});

	
	bot.on('chat', function(username, logger) {
		// coords
		if(logger.startsWith("!coords")) {
			bot.whisper(username, `Vị trí bot hiện tại: ${bot.entity.position}`)
		}

		// deaths
		if(logger.startsWith("!stats")) {
			if(logger === "!stats") {
				bot.whisper(username, 'Bạn cần nhập tên người dùng. - !stats <name>');
				return;
			}

			var newLog = logger.replace('!stats', '')
			var args2 = newLog.split(' ')
			const args3 = args2.toString().replace(',', '')
			const args = args3.toString().replace('.', '')
			
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

			bot.whisper(username, `Kills: ${kills} - Deaths: ${die} - K/D Ratio : ${ratioFixed}`)
			
		}
		if(logger.startsWith("!kd")) {
			if(logger === "!kd") {
				bot.whisper(username, 'Bạn cần nhập tên người dùng. - !kd <name>');
				return;
			}
			var newLog = logger.replace('!kd', '')
			var args2 = newLog.split(' ')
			const args3 = args2.toString().replace(',', '')
			const args = args3.toString().replace('.', '')
			
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

			bot.whisper(username, `Kills: ${kills} - Deaths: ${die} - K/D Ratio : ${ratioFixed}`)
			
		}

		// Help
		if(logger.startsWith("!help")) {
			bot.whisper(username, 'Xem tất cả lệnh tại: https://dicord.gg/yrNvvkqp6w')
		}

		// Discord
		if(logger.startsWith("!discord")) {
			bot.whisper(username, `Link server discord: dicord.gg/yrNvvkqp6w`)
		}

		if(logger.startsWith("!time")) {
			bot.whisper(username, `Thế giới đã tồn tại được ${bot.time.day} ngày.`)
		}
		
		// Kit
		if(logger.startsWith("!kit")) {
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
		if(logger.startsWith("!buykit")) {
			//bot.whisper(username, 'Bạn có thể ghé thăm shop: https://discord.gg/nzm2SnDBGX (Revolution Shop)')
			bot.whisper(username, 'Hiện tại shop revolution đang tạm đóng!')
		}

		// TPS
		if(logger.startsWith("!tps")) {
			bot.whisper(username, `Server TPS: ${bot.getTps()}`)
		}
		
		// Ping
		if(logger.startsWith("!ping")) {
			try {
				bot.chat("> Ping của người chơi " + username + " là " + bot.players[username].ping + "ms");
			} catch (E) {
				console.log("PING ERROR", E)
			}
		}

		// Ping other
		/*
		if(logger.startsWith("!pingother")) {
			var newLog = logger.replace('!pingother', '')
			var args = newLog.split(',')
						
			pingFunc();
			function pingFunc() {
				try {
					bot.chat("> " + args + "'s ping is: " + bot.players[args].ping);
				} catch (e) { 
					console.log("PING OTHER ERROR", e)
				}
			}
		} */
		
		// Health
		if(logger.startsWith("!health")) {
			bot.whisper(username, `Máu: ${bot.health}, Thức ăn: ${bot.food}`);
		}

		// Kill
		if(logger.startsWith("!kill") || logger.startsWith('!suicide')) {
			bot.chat('Attemping /kill on chat.')
			bot.chat('/kill')
		}
		
		// Prio
		if (logger.startsWith("!prio")) {
			pingQueue.ping({"host": "2y2c.org"}, (err, result) =>{
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
		
		if (logger.startsWith("!queue")) {
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
				var oldold = players.toString().replace(",§6Cựu binh: §l0", "");
				var old = oldold.toString().replace(",§6Cựu binh: §l1", "");
				var queue = old.toString().replace("§6Bình thường: §l", "");
				
				bot.whisper(username, `Hàng chờ bình thường hiện tại: ${queue}`)
				
			})
		}
		
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
				
				setInterval(function() {
					try {
						client.channels.cache.get(defaultChannel).setTopic(status + ` - Online: ${result.players.online}` + ` | Đã cập nhật lại lúc ${date}`)
					} catch (e) {
						console.log("SET TOPIC ERROR", e)
					}
				}, 60000)
			}
		});

		if(username === "whispers") return;
		
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
		
		if(username === "auth") return;

		// cancel uuid
		if(username === "UUID") return;
		
		if(username === "c" || username === "d" || username === "Broadcast") {
			color = '0xb60000';
		}
		
		if(username === "ReadTimeoutException") return;

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
		if(username === "i") return;

		var str = "";

		// Command whisper
		/*
		if(logger === "Tại sao bạn lại nhắn tin cho 1 con bot ? - Tham gia: https://discord.gg/yrNvvkqp6w"
		|| logger === "Bạn có thể ghé thăm shop: https://discord.gg/nzm2SnDBGX (Revolution Shop)"
		|| logger === "Hiện tại shop revolution đang tạm đóng!"
		|| logger === 'Link server discord: dicord.gg/yrNvvkqp6w'
		|| logger === "Xem tất cả lệnh tại: https://dicord.gg/yrNvvkqp6w"
		|| logger.includes('Hàng chờ bình thường hiện tại')
		|| logger.includes('Hàng chờ ưu tiên hiện tại')
		|| logger.includes('Bạn đã nhận được')
		|| logger.includes('Server TPS:')
		|| logger.includes('Máu:')
		|| logger.includes("Vị trí bot hiện tại:")
		|| logger.includes('Kills')
		|| logger.includes('không tìm thấy')
		|| logger.includes('Thế giới đã tồn tại được')) {
			color = "0xFD00FF";
			str = "To ";
		} */

		const dauhuyen = logger.replace('`', "\\`");
		const newLogger = dauhuyen.replace('_', "\\_");
		const newUsername = username.replace('_', "\\_");
		
		if(newLogger === undefined) {
			newLogger = logger;
		}

		if(newUsername === undefined) {
			newUsername = username;
		}

		var today = new Date()
		let day = ("00" +today.getDate()).slice(-2)
		let month = ("00" +(today.getMonth()+1)).slice(-2)
		let years = ("00" + today.getFullYear()).slice(-2)
		let hours = ("00" + today.getHours()).slice(-2)
		let min = ("00" + today.getMinutes()).slice(-2)
		var date = day +'.'+month+'.'+years+' ' + hours + ':' + min

		// embed chat
		var chat = new Discord.MessageEmbed()
					// '`' + date + '` '+ 
					.setDescription(`**<${newUsername}>**  ${newLogger}`)
					.setColor(color);
		try {
			client.channels.cache.get(defaultChannel).send(chat);
				color = "0x979797";
		} catch(e) {
			console.log("CHAT MESSAGE ERROR MAIN", e)
		}

	});
		
	bot.on('end', function(reason) {
        waitUntil(60000, 20, function condition() {
          try {
			var today = new Date()
			let day = ("00" +today.getDate()).slice(-2)
			let month = ("00" +(today.getMonth()+1)).slice(-2)
			let years = ("00" + today.getFullYear()).slice(-2)
			let hours = ("00" + today.getHours()).slice(-2)
			let min = ("00" + today.getMinutes()).slice(-2)
			var date = day +'.'+month+'.'+years+' ' + hours + ':' + min
			console.log(date + " | Bot ended, attempting to reconnect...");

			var reconnect = new Discord.MessageEmbed()
				.setDescription(`**Reconnecting to the server!**`)
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
            // Callback function that is only executed when condition is true or time allotted has elapsed
        }, function done(result) { // show result
            console.log("Connection attempt result was: " + result);
        });
   });

	bot.on('kicked', (reason, loggedIn) => { 
		console.log(reason, loggedIn);

		var reconnect = new Discord.MessageEmbed()
			.setDescription(`**I got kicked!**`)
			.setColor("0xFFFB00");

		setTimeout(function() {
			try {
				client.channels.cache.get(defaultChannel).send(reconnect);
			} catch(e) {
				console.log("CHAT MESSAGE ERROR", e)
			}
		}, 300000);
	});





	client.on("message", async message => {

		// control
		if(message.channel.id === '797426761142632450') {
			if(message.author == client.user) return;
			bot.chat(message.content);
		}

		if(message.channel.id == '795135669868822528') {
			var user = message.mentions.users.first();

			// return user = bot
			if(message.author.bot) return;
			if(user) return;

			if(message.content.startsWith(">")) return;
			if(message.content.startsWith(prefix)) return;
			
			var content = message.content;

			if(!content) return;
			
			chat(content);

			function chat(content) {
				bot.chat(`> [${message.author.tag}] ${content}`);
			}

			const send = client.emojis.cache.find(emoji => emoji.name === "1505_yes");
			message.react(send);
		}
			
		const args = message.content.slice(prefix.length).trim().split(/ +/g);
		const command = args.shift().toLowerCase();

		if(!message.content.startsWith(prefix) || message.author == client.user) return;

		if(command === "deaths") {
			var e = new Discord.MessageEmbed()
							.setDescription('Bạn cần nhập username để xem thông tin. - ' + prefix + 'deaths <name>`')
							.setColor('0x56FF00')
			
			if (!args[0]) return message.channel.send(e)
			let count = db.get(`${args[0]}_dead`);
			
			if(count === null) {
				var embed = new Discord.MessageEmbed()
								.setDescription(`Người chơi *${args[0]}* không tìm thấy trong dữ liệu.`)
								.setColor('0x56FF00')

				message.channel.send(embed)
			} else {
				var embed = new Discord.MessageEmbed()
								.setDescription(`Người chơi *${args[0]}* đã chết **${count}** lần.`)
								.setColor('0x56FF00')

				message.channel.send(embed)
			}
		}
		
		if (command === "kills") {
			var e = new Discord.MessageEmbed()
							.setDescription('Bạn cần nhập username để xem thông tin. - `' + prefix + 'deaths <name>`')
							.setColor('0x56FF00')

			if (!args[0]) return message.channel.send(e)
			
			let count = db.get(`${args[0]}_kills`);
			
			if(count === null) {
				var embed = new Discord.MessageEmbed()
								.setDescription(`Người chơi *${args[0]}* không tìm thấy trong dữ liệu.`)
								.setColor(0x56FF00)

				message.channel.send(embed)
			} else {
				var embed = new Discord.MessageEmbed()
								.setDescription(`Người chơi *${args[0]}* đã giết **${count}** lần.`)
								.setColor(0x56FF00)

				message.channel.send(embed)
			}
		}

		if(command === "stats") {
			var e = new Discord.MessageEmbed()
						.setDescription('Bạn cần nhập username để xem thông tin. - `' + prefix + 'deaths <name>`')
						.setColor('0x56FF00')
						
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
							.setColor(0x56FF00)
							.setFooter(footer)
							.setTimestamp();

			message.channel.send(embed)
		
		}

		if(command === "kd") {
			var e = new Discord.MessageEmbed()
						.setDescription('Bạn cần nhập username để xem thông tin. - `' + prefix + 'kd <name>`')
						.setColor('0x56FF00')
						
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
							.setColor(0x56FF00)
							.setFooter(footer)
							.setTimestamp();

			message.channel.send(embed)
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
				var status = "Queue: " + queue + " - Prio: " + prio + " - TPS: " + bot.getTps();

				// Help command
				if(command === "help") {

					const embed = new Discord.MessageEmbed()
								.setColor(0x000DFF)
								.setTitle('[Help Command]')
								.addField("*[Help Command]*", prefix + 'help', false)
								.addField("*[Status Command]*", prefix + 'status', false)
								.addField("*[Online Command]*", prefix + 'online', false)
								.addField("*[Queue Command]*", prefix + 'queue', false)
								.addField("*[Priority Command]*", prefix + 'prio', false)
								.addField("*[Stats Command]*", prefix + 'stats', false)
								.setFooter(footer)
								.setTimestamp();

					message.channel.send(embed).then(message => {
						message.delete({ timeout: 10000 });
					});

				}

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

					setTimeout(function() {
						message.delete()
					}, 10000)

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
	
}

client.login(config.token).catch(err => console.log(err));
client.on("error", (e) => { console.error(e) });