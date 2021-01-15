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

const prefix = "$";

var mineflayer = require('mineflayer')
var tpsPlugin = require('mineflayer-tps')(mineflayer)
var delay = require('delay')
var db = require('quick.db');

const footer = "2Y2C Bot 2021";
const defaultChannel = '795135669868822528';

client.on('ready', () => {
	console.log('Bot online!');
	client.user.setActivity(prefix + 'help for commands!', { type: 'LISTENING' });
});

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
		var newUsername = username.toString().replace("_", "\_");
		// Time
		var today = new Date()
		let day = ("00" +today.getDate()).slice(-2)
		let month = ("00" +(today.getMonth()+1)).slice(-2)
		let years = ("00" + today.getFullYear()).slice(-2)
		let hours = ("00" + today.getHours()).slice(-2)
		let min = ("00" + today.getMinutes()).slice(-2)
		let sec = ("00" + today.getSeconds()).slice(-2)
		var date = day +'/'+month+'/'+years+' ' + hours + ':' + min;

		console.log(`I received a message from ${newUsername}: ${message} (${date})`)
		bot.whisper(username, 'Bạn đã chat với bot. Tham gia: discord.gg/yrNvvkqp6w')

	});
	
	bot.on('message', message => {
		var logger = message.toString()

		// basic check
		if(logger === undefined) return;
		if(logger.includes(':')) return;
		
		if(logger.includes('Té')
		|| logger.includes('chợt')
		|| logger.includes('đã')
		|| logger.includes('đéo')
		|| logger.includes('bị')
		|| logger.includes('chạy')
		|| logger.includes('nổ')
		|| logger.includes('đấm')
		|| logger.includes('nhảy')
		|| logger.includes('cháy')) {
			var first = logger.split(" ")[0];

			let name = db.get(`${first}_dead`);
			
			if(name === null) {
				db.set(`${first}_dead`, 1)
			} else {
				db.add(`${first}_dead`, 1)
			}
		}
	})

	bot.on("login", () => {
		const joined = new Discord.MessageEmbed()
				.setDescription(`**Bot joined the server!**`)
				.setColor("FFFB00");

		try {
			client.channels.cache.get(defaultChannel).send(joined);
		} catch(e) {
		
		}
	});

	bot.on('windowOpen', () => { // slot button mode cb
		console.log('Window open')
		bot.clickWindow(8,0,0)
		delay(1000)
		bot.clickWindow(7,0,0)
		delay(1000)
		bot.clickWindow(2,0,0)
		delay(1000)
		bot.clickWindow(6,0,0)
	});

	bot.on('spawn', () => {
		setInterval(function() {
			chat();
			function chat() {
				bot.chat('> Chat với server tại discord: https://discord.gg/yrNvvkqp6w')
			}
		}, 300000);

		setInterval(function() {
			ads()
			function ads() {
				bot.chat('> Bạn muốn luyện pvp crystal? Tham gia: 2y2cpvp.sytes.net')
			}
		}, 600000);

		setInterval(function() {
			prioqueue()
			function prioqueue() {
				bot.chat('> Bạn có thể xem hàng chờ bằng lệnh !queue hoặc hàng chờ ưu tiên với lệnh !prio')
			}
		}, 900000);
		
		setInterval(function() {
			ping()
			function ping() {
				bot.chat('> Xem ping của bạn: !ping')
			}
		}, 1200000);
		
		setInterval(function() {
			restart()
			function restart() {
				bot.chat('> Thông báo server restart tại: discord.gg/yrNvvkqp6w')
			}
		}, 1500000);
		
		setInterval(function() {
			buykit()
			function buykit() {
				bot.chat('> Bạn muốn mua kit dùng: !buykit')
			}
		}, 1800000);
		
		setInterval(function() {
			coords()
			function coords() {
				bot.chat('> Xem toạ độ của bot: !coords')
			}
		}, 2100000);

		setInterval(function() {
			coords()
			function coords() {
				bot.chat('> Xem số ngày của world server: !time')
			}
		}, 2400000);

		setInterval(function() {
			notf()
			function notf() {
				bot.chat('> Nếu bạn dùng lệnh mà không thấy bot trả lời, có thể bạn đã chat quá nhanh./ Lưu ý')
			}
		}, 2700000);
		
	})
	// PROJECTS
	/*
	bot.on("message", (jsonMsg, position) => {
		//console.log(jsonMsg.toString()) 797426761142632450
		if(jsonMsg === undefined) return;

		try {
				client.channels.cache.get('797426761142632450').send(jsonMsg.toString());
			} catch(e) {
			
			}
	}) */
	bot._client.on("playerlist_footer", data => {
		// const newData = data.replace('-', '');
		console.log(data)
		// console.log(newData)
	})
	
	bot.on('chat', function(username, logger) {
		// coords
		if(logger.startsWith("!coords")) {
			posFunc(username);
			function posFunc (username) {
				bot.whisper(username, `Vị trí bot ${bot.entity.position}`)
			}
		}

		if(logger.startsWith("!deaths")) {
			var newLog = logger.replace('!deaths', '')
			var args2 = newLog.split(' ')
			const args3 = args2.toString().replace(',', '')
			const args = args3.toString().replace('.', '')
			
			let count = db.get(`${args}_dead`);

			if(count === null) {
				bot.whisper(username, `Không tìm thấy ${args} trên data.`)
				return;
			} else {
				bot.whisper(username, `Người chơi ${args} đã chết ${count} lần.`)
			}
		}

		// Help
		if(logger.startsWith("!help")) {
			bot.whisper(username, 'Một số lệnh bạn có thể sử dụng: !discord, !buykit,.. Xem đầy đủ lệnh tại: dicord.gg/yrNvvkqp6w')
		}

		// Discord
		if(logger.startsWith("!discord")) {
			bot.whisper(username, `Link server discord: dicord.gg/yrNvvkqp6w`)
		}

		// Time
		if(logger.startsWith("!time")) {
			bot.whisper(username, `Thế giới đã tồn tại được ${bot.time.day} ngày.`)
		}
		
		// Kit
		if(logger.startsWith("!kit")) {
			var newLog = logger.replace('!kit', '')
			var args = newLog.split(',')
			
			if(args) {
				bot.whisper(username, `Bạn đã nhận được kit tên ${args}.`)
			} else {
				bot.whisper(username, `Bạn đã nhận được kit.`)
			}
		}

		// buykit
		if(logger.startsWith("!buykit")) {
			bot.whisper(username, 'Bạn có thể ghé thăm shop server: discord.gg/nzm2SnDBGX (Revolution Shop)')
		}

		// TPS
		if(logger.startsWith("!tps")) {
			bot.whisper(username, `Server TPS: ${bot.getTps()}`)
		}
		
		// Ping
		if(logger.startsWith("!ping")) {
			var newLog = logger.replace('!ping', '')
			//const args = newLog.split(',')
			var args = username;
			pingFunc(args);

			function pingFunc(args) {
				bot.chat("> Ping của " + args + " là " + bot.players[args].ping + " | Lệnh dành cho mấy thằng lồn để chứng minh mình ping cao.");
			}
		}

		// Ping other
		/*
		if(logger.startsWith("!pingother")) {
			var newLog = logger.replace('!pingother', '')
			var args2 = newLog.split(' ')
			const args = args2.toString().replace(',', '')
			
			pingFunc(args);
			function pingFunc(args) {
				try {
					bot.chat("> " + args + "'s ping is: " + bot.players[args[0]].ping);
				} catch { 
				
				}
			}
		} */
		
		// Ping
		if(logger.startsWith("!botping")) {
			pingFunc();

			function pingFunc() {
					bot.chat(">  Ping của bot hiện tại: " + bot.player.ping);
			}
		}
		
		// Health
		if(logger.startsWith("!health")) {
			health();

			function health() {
					bot.whisper(username, `Máu: ${bot.health}, Thức ăn: ${bot.food}`);
			}
		}

		// Kill
		if(logger.startsWith("!kill") || logger.startsWith('!suicide')) {
			killFunc();
			function killFunc() {
				bot.chat('/suicide')
				bot.chat('Trying /suicide')
			}
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
						var players = '.';
						var players2 = '.';
					}
				}

				var replacestring2 = players2;
				var prio = replacestring2.toString().replace("2y2c §6Queue Size,§6Ưu Tiên: §l", "");
				
				chat(username)

				function chat(username) {
					bot.whisper(username, `Hàng chờ ưu tiên hiện tại: ${prio}`)
				}
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
						var players = '.';
						var players2 = '.';
					}
				}
				var replacestring = players;
				var old = players.toString().replace(",§6Cựu binh: §l0", "");
				var queue = old.toString().replace("§6Bình thường: §l", "");
				
				chat(username)

				function chat(username) {
					bot.whisper(username, `Hàng chờ bình thường hiện tại: ${queue}`)
				}
			})
		}
		
		// Set topic
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
					var players = '.';
					var players2 = '.';
				}

				var replacestring = players;
				var replacestring2 = players2;

				var oldold = players.toString().replace(",§6Cựu binh: §l0", "");
				var old = oldold.toString().replace(",§6Cựu binh: §l1", "");
				var queue = old.toString().replace("§6Bình thường: §l", "");

				var prio = replacestring2.toString().replace("2y2c §6Queue Size,§6Ưu Tiên: §l", "");
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
						client.channels.cache.get(defaultChannel).setTopic(status + ` - Online: ${result.players.online}` + ` | Đã update lúc ${date}`)
					} catch (e) {
						
					}
				}, 60000)
			}
		});

		
		// hide suicide, broadcast
		if(username === "2Y2C" || username === "Broadcast") return;
		if(username === "whispers") return;
		
		// Waiting for chat
		if(username === "CS") { /*
			color = "0xFF5A00";
			var second = logger.replace(/Wait/, "")
			var second2 = second.replace(/before sending another message!/, "")
			const joined = new Discord.MessageEmbed()
							.setDescription(`Cần chờ ${second2} để lập lại từ đó.`)
							.setColor(color);
			try {
				client.channels.cache.get(defaultChannel).send(joined);
			} catch(e) {
			
			}
			return;
		} else {
			// return default color
			color = "0x979797";
			*/
			return;
		}

		// cancel similar chat
		if(username === "similar" || logger === "message.") return;
		
		// anti afk
		if(username === "Name"
		|| username === "Kills"
		|| username === "Deaths"
		|| username === "Ratio"
		|| username === "Streak"
		|| username === "Elo") return;
		
		// auth kick
		if(username === "auth") return;

		if(logger === "Control passed.") {
			const joined = new Discord.MessageEmbed()
							.setDescription(`**Bot joined the main server!**`)
							.setColor("FFFB00");

			// joining wile see UUID
			try {
				client.channels.cache.get(defaultChannel).send(joined);
			} catch(e) {
			
			}

			setInterval(function() {
				bot.chat('/stats');
			}, 180000);
		}

		// Phải để sau
		if(username === "UUID") return;
		
		// return 1 cái gì đó thông báo
		if(username === "c") return;
		
		if(username === "ReadTimeoutException") return;

		// restarts
		if(logger === "Server sẽ Restart sau 15 phút!")
			return client.channels.cache.get('795534684967665695').send("@everyone Server sẽ Restart sau 15 phút!");
		if(logger === "Server sẽ Restart sau 5 phút!")
			return client.channels.cache.get('795534684967665695').send("@everyone Server sẽ Restart sau 5 phút!");
		
		if(logger === "Server Restarting!") return client.channels.cache.get('795534684967665695').send("@everyone Server Restarting!");
		if(username === "AutoRestart") return;
		
		// check > msg
		if(logger.startsWith(">")) {
			color = "0x56FF00";
		}
		
		// Command whisper
		if(logger === "Bạn đã chat với bot. Tham gia: discord.gg/yrNvvkqp6w"
		|| logger === "Bạn sẽ chờ ít nhất 20 giây để bot tính toán tps chính xác."
		|| logger === "Bạn có thể ghé thăm shop server: discord.gg/nzm2SnDBGX (Revolution Shop)"
		|| logger === 'Link server discord: dicord.gg/yrNvvkqp6w'
		|| logger === "Một số lệnh bạn có thể sử dụng: !discord, !buykit,... Xem đầy đủ lệnh tại: dicord.gg/yrNvvkqp6w"
		|| logger.includes('Hàng chờ bình thường hiện tại')
		|| logger.includes('Hàng chờ ưu tiên hiện tại')
		|| logger.includes('Bạn đã nhận được')
		|| logger.includes('Server TPS:')
		|| logger.includes('Máu:')) {
			color = "0xFD00FF";
		}

		var dauhuyen = logger.toString().replace("`", "\`");
		var newLogger = dauhuyen.replace("_", "\_");
	
		var newUsername = username.toString().replace("_", "\_");
	
		var today = new Date()
		let day = ("00" +today.getDate()).slice(-2)
		let month = ("00" +(today.getMonth()+1)).slice(-2)
		let years = ("00" + today.getFullYear()).slice(-2)
		let hours = ("00" + today.getHours()).slice(-2)
		let min = ("00" + today.getMinutes()).slice(-2)
		var date = day +'.'+month+'.'+years+' ' + hours + ':' + min

		// embed chat
		var chat = new Discord.MessageEmbed()
					.setDescription('`' + date + '` '+ `**${newUsername}:**  ${newLogger}`)
					.setColor(color);
		try {
			client.channels.cache.get(defaultChannel).send(chat);
				color = "0x979797";

		} catch(e) {
		
		}
	});
	
	// do it
	client.on("message", async message => {
		/*
		if(message.channel.id === '798718511777579038') {
			bot.chat(message.content);
		} */

		if(message.channel.id === defaultChannel) {
			var user = message.mentions.users.first();

			// return user = bot
			if(message.author.bot) return;
			if(user) return;
			if(message.content.startsWith(">")) return;
			if(message.content.startsWith(prefix)) return;
			
			if(message.content === "!tps") return message.channel.send('> Server TPS: **' + bot.getTps() + "**");

			var content = message.content;

			if(!content) return;

			chatFunc(content);
			
			function chatFunc(content) {
				bot.chat(`> [${message.author.tag}] ${content}`);
			}

			const send = client.emojis.cache.find(emoji => emoji.name === "1505_yes");
			message.react(send)
			
		}
			
		const args = message.content.slice(prefix.length).trim().split(/ +/g);
		const command = args.shift().toLowerCase();
		
		if(command === "deaths") {

			if (!args[0]) return message.channel.send('nhap ten username')
			
			let count = db.get(`${args[0]}_dead`);
			
			if(count === null) {
				message.channel.send(`Người chơi ${args[0]} không tìm thấy trong data. (Sẽ là embed sau)`)
			} else {
				message.channel.send(`${args[0]} đã chết ${count} lần. (Sẽ làm embed sau)`)
			}
		}

		if(!message.content.startsWith(prefix) || message.author == client.user) return;
		
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
					var players = '.';
					var players2 = '.';
				}

				// Variable
				var replacestring = players;
				var replacestring2 = players2;

				// Replace
				var old = players.toString().replace(",§6Cựu binh: §l0", "");
				var queue = old.toString().replace("§6Bình thường: §l", "");

				var prio = replacestring2.toString().replace("2y2c §6Queue Size,§6Ưu Tiên: §l", "");
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
								.addField("*[Update Command]*", prefix + 'update ( only owner )', false)
								.setFooter(footer)
								.setTimestamp();

					message.channel.send(embed).then(message => {
						message.delete({ timeout: 10000 });
					});

					setTimeout(function() {
						message.delete()
					}, 10000)

				}

				// Queue command
				if(command === "queue" || command === "q") {

					const embed = new Discord.MessageEmbed()
								.setColor(0x000DFF)
								.setTitle('[Queue Command]')
								.setDescription("Hàng chờ hiện tại: " + queue)
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
								.setDescription("Hàng chờ ưu tiên hiện tại: " + prio)
								.setFooter(footer)
								.setTimestamp();

					message.channel.send(embed).then(message => {
						message.delete({ timeout: 10000 });
					});

					setTimeout(function() {
						message.delete()
					}, 10000)

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

					setTimeout(function() {
						message.delete()
					}, 10000)

				}
				
				// online command
				if(command === "onl" || command === "online" || command === "o") {

					const embed = new Discord.MessageEmbed()
								.setColor(0x000DFF)
								.setTitle('[Online Command]')
								.setDescription("Số người chơi trong server: " + result.players.online)
								.setFooter(footer)
								.setTimestamp();

					message.channel.send(embed).then(message => {
						message.delete({ timeout: 10000 });
					});

					setTimeout(function() {
						message.delete()
					}, 10000)
				}

			}

		});
	
	});
	
	bot.on('error', err => console.log(err))
	bot.on('end', createBot)
	
	bot.on('kicked', (reason, loggedIn) => { 
		console.log(reason, loggedIn);

		var reconnect = new Discord.MessageEmbed()
			.setDescription(`**Reconnecting to the server!**`)
			.setColor("0xFFFB00");

		setTimeout(function() { 
			createBot()

			try {
				client.channels.cache.get('795135669868822528').send(reconnect);
			} catch(e) { }

		}, 300000);
	});
	
}
createBot()

// Login with token
client.login(config.token).catch(err => console.log(err));
client.on("error", (e) => { console.error(e) });