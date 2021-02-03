const Discord = require("discord.js");
const client = new Discord.Client();

const token = require('dotenv').config();

const queue = require("minecraft-protocol");
const topic = require("minecraft-protocol");

const config = {
  token: process.env.token
};

var db = require('quick.db');

var mineflayer = require('mineflayer');
var tpsPlugin = require('mineflayer-tps')(mineflayer);
var waitUntil = require('wait-until');

client.on('ready', () => {
    console.log('Bot online!');
    createBot()
});

function createBot () {
	const bot = mineflayer.createBot({
		host: '2y2cpvp.sytes.net',
		port: 25565,
        username: "mo0nbot",
		version: "1.12.2"
	});
	
	bot.loadPlugin(tpsPlugin); // load tps plugins mineflayer

	// minecraft bot uptime
	var minutes = 0;
	var hours = 0;
	var totalSeconds = 0;
	function setTime() {
		totalSeconds += 600;
		hours = parseInt(totalSeconds / 3600);
		minutes  = parseInt((totalSeconds - (hours * 3600)) / 60);
		if(hours === "NaH") {
			hours = "0";
		} else if (minutes === "NaH") {
			minutes = "0";
		}
	}

	bot.on("login", () => {
        console.log("joined the server!")

		bot.chat('/login 43714371');
		
		setInterval(function() {
		    Object.values(bot.players).forEach(player => addPlayTime(player.username));
			
			function addPlayTime(player) {
				let playtime = db.get(`${player}_playtime`);

				if(playtime === null) { // tao database playtime
					db.set(`${player}_playtime`, 10000);
				} else {
					db.add(`${player}_playtime`, 10000);
				}
			}
		}, 10*1000);

        totalSeconds = 0;
		setInterval(setTime, 10*60*1000);

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
					
					try {
						client.channels.cache.get("806361095576879194").setTopic(bot.getTps() + " tps - " + bot.player.ping + " ping - " + result.players.online + " players \nĐã vào server " + hours + " giờ " + minutes + " phút trước.")
					} catch (e) {
						console.log("SET TOPIC ERROR", e)
					}
				}
			});
        }, 10*60*1000);
    });
    
    var check = false;
	bot._client.on("playerlist_header", data => {
        if(check) return;
        check = true;
        out();
        var footer = data.footer;
        var replaceall = footer.replace(/§c|§e|§3|§d|-|§r|§a|§6|\\n|§b/ig, "");
        var repfirst = replaceall.replace(/{"text":"  /ig, "");
        var repend = repfirst.replace(/"}/ig, "")
        var reptps = repend.replace(" tps  ", " tps - ")
        var repping = reptps.replace(/ ping  /ig, " ping - ")
        var players = repping.replace(/ players  /ig, " players - ")

        var cpu = players.replace("CPU", " \nCPU")
        var ram = cpu.replace("  RAM", " - RAM")

        var topics = ram + "\nĐã tham gia từ " + hours + " giờ " + minutes + " phút trước.";
        // console.log(topics)
		try {
			client.channels.cache.get("806361095576879194").setTopic(topics, "suc")
		} catch (e) {
			console.log("SET TOPIC ERROR", e)
        }
        
        function out() {
            setTimeout(() => {
                check = false;
            }, 10*60*1000);
        }
    });
    
	var stats = false;
	var sending = false;
	bot.on('spawn', () => {

		setInterval(function() {
            if(stats) return;
            stats = true;
			bot.swingArm("left");
			bot.look(Math.floor(Math.random() * Math.floor("360")), 0, true, null);
			antiAfk();
		}, 1*60*1000);

		function antiAfk() {
			setTimeout(function() {
				stats = false;
			}, 10*1000);
		}

		var str = '> Tham gia bot discord tại : https://discord.gg/yrNvvkqp6w | > Kiểm tra hàng chờ 2y2c : !q | > Xem tất cả lệnh : !help';
		
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
			client.channels.cache.get("806361095576879194").send(embed);
		} catch (e) {
			// console.log("JOIN MESSAGE ERROR", e)
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
			client.channels.cache.get("806361095576879194").send(embed);
		} catch (e) {
			// console.log("LEAVE MESSAGE ERROR", e)
		}
	});

    bot.on('message', msg => {
		var logger = msg.toString();
		var color = 0xDB2D2D;
		
		var log;
		if(logger.startsWith("<") && logger.includes(">")) return;

		if(logger.startsWith("[2Y2C PVP]")) {
			log = logger;
			color = "0xb60000";
		}

		if(logger.startsWith("[Server]")) {
			log = logger;
			color = "0xb60000";
		}

		if(logger.includes("đã")) {
			if(logger.startsWith("[+]")) return;
			if(logger.startsWith("[-]")) return;
			if(logger === "IP của bạn đã bị thay đổi và phiên đăng nhập của bạn đã hết hạn!") return;
			if(logger === "Phiên đăng nhập đã được kết nối trở lại.") return;
			log = logger;
		}

		if(log === null) return;
		if(log === undefined) return;

        // MAIN chat
		var chat = new Discord.MessageEmbed()
						.setDescription(`${log}`)
						.setColor(color);
        try {
            client.channels.cache.get("806361095576879194").send(chat);
            color = "0xDB2D2D";
        } catch(e) {
            // console.log("CHAT MESSAGE ERROR MAIN", e)
        }
    });

    bot.on('chat', (username, logger) => {

		var bp = "!";
		// Check message if is command
		var isCommand;

		var newCmd;
		if(logger.startsWith(bp)) {
			newCmd = logger.replace(".", "")
		}

		var color = "0x979797";

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
				var string = day + " ngày "+ hour + " giờ "+ minutes + " phút";
				bot.chat(`> ${args}: ${string}`)
			}, 2*1000);
		}

		if(newCmd === bp + "help") {
			isCommand = true;
			setTimeout(function() {
				bot.whisper(username, 'Các lệnh: !q, !ping, !help, !kill, !stats (sắp có)')
				}, 3*1000);
		}

		if(logger === bp + "ping") {
			isCommand = true;
			try {
				setTimeout(function() {
					bot.chat("> " + username + ": " + bot.players[username].ping + "ms");
				}, 3*1000);
			} catch (E) {
				console.log("PING ERROR", E)
			}
		}

		if(newCmd === bp + "tps") {
			isCommand = true;
			var tps = bot.getTps();
			if(bot.getTps() > 19) {
				tps = "20*";
			}
			setTimeout(function() {
				bot.whisper(username, `TPS: ${tps}`)
			}, 3*1000);
		}

		if(logger.startsWith(bp + "ping")) {
			isCommand = true;
			if(logger === bp + "ping") {

			} else {
				var str = logger.replace(".", "");
				var user = str.split(" ")[1];

				try {
					setTimeout(function() {
						bot.chat("> " + user + ": " + bot.players[user].ping + "ms");
					}, 3*1000);
				} catch (e) { 
					if(!dev) return;
					console.log("PING OTHER DEBUG ", e)
				}
			}
			
		}

        if(newCmd === bp + "queue" | newCmd === bp + "q" || newCmd === bp + "normalqueue" || newCmd === bp + "nq" || newCmd === bp + "prio" || newCmd === bp + "prioqueue") {
			isCommand = true;
			queue.ping({"host": "2y2c.org"}, (err, result) =>{
				if(err) {
					setTimeout(function() {
						bot.whisper(username, `Lỗi.`);
					}, 3*1000);

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
				
					var prioplayer = players2;
					var queueplayer = players;
					var oldold = queueplayer.toString().replace(",§6Cựu binh: §l0", "")
					var old = oldold.toString().replace(",§6Cựu binh: §l1", "")
					var queue = old.toString().replace("§6Bình thường: §l", "")

					var prio = prioplayer.toString().replace("2y2c §6Queue Size,§6Ưu Tiên: §l", "")

					if(newCmd === bp + "prioqueue" || newCmd === bp + "prio") {
						if(prio < 1) {
							setTimeout(function() {
								bot.whisper(username, `Không có bất kì hàng chờ ưu tiên nào.`);
							}, 3*1000);
							return;
						}
						setTimeout(function() {
							bot.whisper(username, `Hàng chờ ưu tiên của 2Y2C là ${prio}`);
						}, 3*1000);
					}

					if(newCmd === bp + "normalqueue" || newCmd === bp + "nq") {
						if(queue < 1) {
							setTimeout(function() {
								bot.whisper(username, `Không có bất kì hàng chờ nào.`);
							}, 3*1000);
							return;
						}
						bot.whisper(username, `Hàng chờ bình thường của 2y2c là ${queue}`);
					}

					if(newCmd === bp + "q" || newCmd === bp + "queue") {
						setTimeout(function() {
							bot.whisper(username, `Hàng chờ bình thường của 2y2c là ${queue} và hàng chờ ưu tiên là ${prio}`);
						}, 3*1000);
					}
				}
				
			});
		}

        const dauhuyen = logger.replace(/`/ig, "\\`");
		const newLogger = dauhuyen.replace(/_/ig, "\\_");
		const newUsername = username.replace(/_/ig, "\\_");
        
        if(username === "UUIDSpoofFix" || username === "UUID") return;
        if(username === "PVP") return;
		if(username === "2Y2C") return;
		if(username === "Server") return;
		if(username === "discord" && logger === "Moonz#9801") return;

		if(logger.startsWith(">")) {
			color = "00FF00";
		}

		var msg = false;
		if(isCommand && logger.startsWith('Hàng chờ bình thường của 2y2c là')
		|| logger.startsWith('Hàng chờ ưu tiên cuả 2y2c là')
		|| logger.startsWith('Không có bất kì hàng chờ')
		|| logger.startsWith('Các lệnh')
		|| logger.startsWith('TPS:')
		|| logger.startsWith("Lỗi.")) {
			isCommand = false;
			color = "0xFD00FF";
			msg = true;

		}
        
		if(newLogger === undefined) {
			newLogger = logger;
		}

		if(newUsername === undefined) {
			newUsername = username;
		}
		
		var usernameFormatted;

		if(msg) {
			usernameFormatted = `To ${newUsername}:`;
		} else {
			usernameFormatted = `**<${newUsername}>**`;
		}
        
		// MAIN chat
		var chat = new Discord.MessageEmbed()
					.setDescription(`${usernameFormatted} ${newLogger}`)
					.setColor(color);
		try {
			client.channels.cache.get("806361095576879194").send(chat);
			color = "0x979797";
		} catch(e) {
			//console.log("CHAT MESSAGE ERROR MAIN", e)
		}
        
    });

	bot.on('kicked', (reason, loggedIn) => {
		console.log(`${reason} - ${loggedIn}`);
	});

    bot.on('end', function(reason) {
        totalSeconds = 0;
        waitUntil(120000, 25, function condition() {
		try {
			var today = new Date()
			let day = ("00" +today.getDate()).slice(-2)
			let month = ("00" +(today.getMonth()+1)).slice(-2)
			let years = ("00" + today.getFullYear()).slice(-2)
			let hours = ("00" + today.getHours()).slice(-2)
			let min = ("00" + today.getMinutes()).slice(-2)
			var date = day +'.'+month+'.'+years+' ' + hours + ':' + min;
			console.log(date + " | Bot ended, attempting to reconnect...");
			createBot();
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
        // control
        const user = msg.mentions.users.first();
        if(msg.author.bot) return;
        if(user) return;

        if(msg.channel.id == '806361095576879194') {
            if(msg.content.startsWith(">")) return;
            
            var content = msg.content;

            if(!content) return;
            
            chat(content);

            function chat(content) {
                bot.chat(`[${msg.author.tag}] ${content}`);
            }

            const send = client.emojis.cache.find(emoji => emoji.name === "1505_yes");
            msg.react(send);
        }
    });
}

client.login(config.token).catch(err => console.log(err));
client.on("error", (e) => { console.error(e) });