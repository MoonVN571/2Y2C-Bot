const Discord = require("discord.js");
const client = new Discord.Client();

require('dotenv').config();

const config = {
  token: process.env.token
};

var mineflayer = require('mineflayer')
var waitUntil = require('wait-until');
var tpsPlugin = require('mineflayer-tps')(mineflayer)

var Scriptdb = require('script.db')
var fs = require('fs')
var a = require('./api');
var api = new a();

client.on('ready', () => {
    console.log('Bot online!');
    createBot()
});

function createBot () {
	const bot = mineflayer.createBot({
		host: '103.116.104.179',
		port: 25565,
        username: "mo0nbot",
		version: "1.12.2"
    });
    
    bot.loadPlugin(tpsPlugin) // Load the plugin

    var defaultChannel = "822027193293996032";

	// minecraft bot uptime
	var minutes = 0;
	var hours = 0;
	var totalSeconds = 0;
	function setTime() {
		totalSeconds += 300;
		hours = parseInt(totalSeconds / 3600);
		minutes  = parseInt((totalSeconds - (hours * 3600)) / 60);
	}

	bot.on('whisper', (username, message, rawMessage) => {
		if (username === bot.usermame) return;
		var newusername = username.replace(/_/ig, "\\_");

        var huyen = message.replace(/`/ig, "\\`")
		var duoi = huyen.replace(/_/ig, "\\_")
		var newmsg = duoi.replace("*", "\\*")

		if (newmsg === undefined) {
			newmsg = message;
		}

		if (newusername === undefined) {
			newusername = username;
		}

		const whisper = new Discord.MessageEmbed()
			.setDescription(`${newusername} whisper: ${newmsg}`)
			.setColor("0xFD00FF");

		client.channels.cache.get(defaultChannel).send(whisper);
		
	});
	
	var sending = false;
	bot.on("login", () => {
        totalSeconds = 0;
		setInterval(setTime, 5*60*1000);
        
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

		var i = 1;
        setInterval(() => {
			i++;
			console.log(i)
			Object.values(bot.players).forEach(player => addPlayTime(player.username));
			function addPlayTime(player) {
				console.log(player)
				let pt = new Scriptdb(`./data/playtime/${player}.json`);
				let playtime = pt.get('time')

				if (playtime === undefined) {
					pt.set('time', 10000);
				} else {
					pt.set('time', +playtime + 10000);
				}
			}
		}, 10 * 1000); // dcm

        // bot.chat("/register 43714371 43714371")
        bot.chat("/login 43714371")
		const wasjoined = new Discord.MessageEmbed()
			.setDescription(`☘️ Bot đã tham gia vào server. ☘️`)
			.setColor(0x15ff00); // xanh lam
			
		client.channels.cache.get(defaultChannel).send(wasjoined);
    });
    
	var check = false;
	bot._client.on('playerlist_header', data => {
		if(check) return;
		check = true;
		var footer = data.footer;
        var a = footer.toString().replace(/\{"text":"\\n§r|§e|§8|§f|"\}/ig, "")
		console.log(a)

		setInterval(() => {
			var formatMinutes;
			if(minutes == 0) {
				formatMinutes = "";
			} else {
				formatMinutes = minutes + " phút";
			}
		
			var format;
			if(hours == 0) {
				format =  formatMinutes;
			} else {
				format = hours + " giờ " + formatMinutes;
			}
			if(minutes == 0 && hours == 0) {
				format = " vài giây trước ";
			}
			
            try {
                client.channels.cache.get(defaultChannel).setTopic(a + " - Tham gia server từ " + format + " trước. ( ping - tps - online )")
            } catch (e) { }
        }, 5*60*1000);
	});

	bot.on('spawn', () => {
		setInterval(() => {
			bot.swingArm("left");
			bot.look(Math.floor(Math.random() * Math.floor("360")), 0, true, null);
		}, 1 * 60 * 1000);
    });

    var joinedLog = false;
	bot.on("playerJoined", (p) => {
		var username = p.username;
		var newUsername = username.replace(/_/ig, "\\_");

		if(username == bot.username) {
            joinedLog = true;
            return;
        }

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

        if(!joinedLog) return;

		var embed = new Discord.MessageEmbed()
			.setDescription(newUsername + " joined")
			.setColor('0xb60000');	

		client.channels.cache.get(defaultChannel).send(embed);
    });

	bot.on("playerLeft", (p) => {
		var username = p.username;
		var newUsername = username.replace(/_/ig, "\\_");

		if(username == bot.username) return;

        var d = new Date();
		var time = d.getTime();
		let seen = new Scriptdb(`./data/seen/${username}.json`);
		var data = seen.get('seen')

		if (data === undefined) {
			seen.set('seen', time);
		} else {
			seen.set('seen', time);
		}

		var embed = new Discord.MessageEmbed()
			.setDescription(newUsername + " left")
			.setColor('0xb60000');	

		client.channels.cache.get(defaultChannel).send(embed);
    });

    bot.on('message', message => {
        var msg = message.toString();
    });

    bot.on('message', msg => {
        var message = msg.toString();
		if (!(message.startsWith("<"))) {   
            var embed = new Discord.MessageEmbed()
                            .setDescription(message)
                            .setColor(0xb60000);
            
            if(message.endsWith("Đã thoát") || message.endsWith("Đã vào")) return;

            if(embed !== undefined) {
                client.channels.cache.get(defaultChannel).send(embed);
            }
            return;
        }

		var nocheck = msg.toString().split(' ')[0];
		var username = nocheck.replace(/<|>/ig, "");

        var log = msg.toString().replace(username, "");;
        var logger = log.replace("<> ", "");
        
		var color = "0x979797";
                
        const dauhuyen = logger.replace(/`/ig, "\\`");
		const dausao = dauhuyen.replace(/_/ig, "\\_");
        const s = dausao.replace("||", "\\||");
		const newLogger = s.replace("*", "\\*");
		var newUsername = username;
		
		var newUsername = username;
		if(username !== undefined) {
			newUsername = username.replace(/_/ig, "\\_");
		}

        if(logger.startsWith(">")) {
			color = "2EA711";
        }
        
		if(newLogger === undefined) {
			newLogger = logger;
		}
        
		// MAIN chat
		var chat = new Discord.MessageEmbed()
					.setDescription(`**<${newUsername}>** ${newLogger}`)
					.setColor(color);
		
        if(chat !== undefined) {
			client.channels.cache.get(defaultChannel).send(chat);
			color = "0x979797";
		}

        var bp = "!"

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
				bot.chat(`> <${args[0]}> ${dataMsgs}`);
			}, seconds * 1000);
		}

		if (cmd == 'check') {
			if(!args[0]) return;
			if(!args[0].match(regex)) return;

			if(name !== undefined) return;
			var list = Object.values(bot.players).map(p => p.username);
			
			setTimeout(() => {
				if(list.includes(name)) {
					bot.chat(`> ${name} đang hoạt động.`)
				} else {
					bot.chat(`> ${name} không hoạt động.`)
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
				bot.chat(`X: ${x} Y: ${y} Z: ${z}`);
			}, seconds * 1000);
		}

		if (cmd == "seen") {
			if(!args[0]) return;
			if(!args[0].match(regex)) return;

			let ls = new Scriptdb(`./data/seen/${args[0]}.json`);
			var seen = ls.get('seen')

			setTimeout(() => {
				if (seen === undefined) {
					bot.chat(`> Không tìm thấy người chơi.`);
					return;
				}

				var age = api.ageCalc(seen);
				bot.chat(`> Đã nhìn thấy ${args[0]} từ ${age} trước.`)
			}, seconds * 1000);
		}

		if(cmd == "joindate" || cmd == "jd") {
			if(!args[0]) return;
			if(!args[0].match(regex)) return;

			let fj = new Scriptdb(`./data/joindate/${args[0]}.json`);
			let firstjoin = fj.get('date')

			setTimeout(() => {
				if (firstjoin === undefined) {
					bot.chat(`> Không tìm thấy người chơi.`);
					return;
				}
				bot.chat(`> Lần đầu thấy ${args[0]} vào ${firstjoin}.`)
			}, seconds * 1000);
		}

		if(cmd == "playtime" || cmd == "pt") {
			if(args[0]) {
				if(!args[0].toString().match(regex)) return;
			} else {
				args[0] = username;
			}

			let pt = new Scriptdb(`./data/playtime/${args[0]}.json`);
			let playtime = pt.get('time')

			setTimeout(() => {
				if (playtime === undefined) return bot.chat(`> Không tìm thấy người chơi.`);
				
				var string = api.playtimeCalc(playtime);

				bot.chat(`> ${args[0]}: ${string}.`);
			}, 1 * 1000);
		}

        if (cmd == "ping") {
			if(args[0]) {
				if(!args[0].toString().match(regex)) return;
			} else {
				args[0] = username;
			}
			
			setTimeout(() => {
				try {
					var ping = bot.players[args[0]].ping;
					if(ping == 0) {
						bot.chat("> Server chưa ping người chơi này..");
					} else {
						if(user == username) {
							bot.chat("> Ping của bạn : " + bot.players[args[0]].ping + "ms.");
						} else {
							bot.chat("> " + args[0] + " : " + bot.players[args[0]].ping + "ms.");
						}
					}
				} catch (e) {
					bot.chat("> Không tìm thấy người chơi");
				}
			}, 1 * 1000);
		}

        if(cmd == "players") {
			var name = Object.values(bot.players).map(p => p.username);
			setTimeout(() => {
				bot.chat("> " + name.length + " đang chơi!");
			}, 1 * 1000);
		}

		if(cmd == "runtime") {
			setTimeout(() => {
				bot.chat("> " + api.uptimeCalc());
			}, seconds * 1000);
		}

        if (cmd == "rules") {
			setTimeout(() => {
				bot.chat(`> LUẬT: Tuyệt đối không HACK, CHEAT, lừa đảo, không SPAM, không PHÁ HOẠI. Báo cáo ngay với lệnh !report.`)
			}, 1 * 1000);
		}

		if(cmd == 'help') {
			setTimeout(() => {
				bot.chat('> Commands: https://mo0nbot.tk/')
			}, seconds * 1000);
		}
		
		if (cmd == "tps") {
			setTimeout(() => {
				bot.chat(`> TPS : ${bot.getTps()}`)
			}, seconds * 1000);
		}

		if (cmd == "discord") {
			setTimeout(() => {
				bot.chat(`> Link : http://discord.gg/yrNvvkqp6w`)
			}, seconds * 1000);
		}
    });

	bot.on('kicked', (reason, loggedIn) => {
		console.log(reason, loggedIn);

        var disconnected = new Discord.MessageEmbed()
                                .setDescription("Bot đã mất kết nối với lí do: **" + reason.toString() + "**.")
                                .setColor("F71319");
        
        client.channels.cache.get(defaultChannel).send(disconnected);
	});

    bot.on('end', () => {
		totalSeconds = 0;
        setTimeout(() => {
            if(joined) {
                var disconnected = new Discord.MessageEmbed()
                                        .setDescription("🏮 Bot đã mất kết nối. 🏮")
                                        .setColor("F71319");
                                        
                client.channels.cache.get(defaultChannel).send(disconnected);
            }
            waitUntil(60000, 25, function condition() {
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
        }, 3*1000)
   });

    client.on('message', msg => {
        const args = msg.content.slice("/".length).trim().split(/ +/g);
        const command = args.shift().toLowerCase();

        // control
        if (msg.author.bot) return; // return author is bot

        if (msg.channel.id == '822027193293996032') {
            if (msg.content.startsWith(">")) return;
            if (msg.content.startsWith("$")) return;

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

client.login(config.token).catch(err => console.log(err));
client.on("error", (e) => { console.error(e) });