var { MessageEmbed, Client, Message } = require('discord.js');
var Scriptdb = require("script.db");
var a = require('../api');
var api = new a();
var log = require('../log');
require('dotenv').config();
module.exports = {
	name: 'message',
	once: false,
	/**
	 * 
	 * @param {*} bot 
	 * @param {Client} client 
	 * @param {Message} message 
	 * @returns 
	 */
	execute(bot, client, message) {
		var newcolor = 'DB2D2D';
		var logger = message.toString();
		var nocheck = message.toString().split(' ')[0];
		
		if (nocheck.startsWith('<') && nocheck.endsWith(">")) return;

		if(bot.dev) client.channels.cache.get("802456011252039680").send(logger);
		if(!bot.dev) client.channels.cache.get("797426761142632450").send(logger);

		var notfMsg;
		var colorNotf;
		
		if (logger === "[AutoRestart] Server Restarting!" && !bot.dev) {
			const client2 = new Client();
			client2.login(process.env.TOKEN);
			client2.on('ready', () => {
				client.channels.cache.get('795534684967665695').send("@here " + logger);
				
				client2.guilds.cache.forEach((guild) => {
					const data = new Scriptdb(`./data/guilds/setup-${guild.id}.json`);
					const checkdata = data.get('restart-role');
					const channel = data.get('restart');
					if(checkdata == undefined || guild == undefined) return;
					try {
						let role = client.guild.cache.get(guild.id).roles.cache.get(checkdata);
						if(!role) return;

						if(bot.dev) return;
						
						if(client.channels.cache.get(channel)) client.channels.cache.get(channel).send({content: role.toString() + " " + logger, allowedMentions: {repliedUser: true}});
					} catch(e) {console.log(e)}
				});
			});
		}
		var checkWhisper = logger.split(' ')[1];
		if(checkWhisper == "nhắn:") {
			var toLog = logger

			if(logger.startsWith("[")) toLog = toLog.split("]")[1];
			
			api.removeFormat(toLog);
			
			notfMsg = toLog;
			colorNotf = "0xFD00FF";
		}


		if (logger.startsWith("nhắn cho")) {
			if(logger.split(" ")[2].startsWith("[")) loggger = "nhắn cho " + logger.split("]")[1];

			notfMsg = api.removeFormat(logger);
			colorNotf = "0xFD00FF";
		}

		if(logger == "Đang vào 2y2c") {
			bot.haveJoined = true; // check da thay chat dang vao 2y2c chua va tat queue
			let data = new Scriptdb('./data.json');

			data.set('queueEnd', Date.now());

			setTimeout(() => {
				var quetime = new MessageEmbed()
							.setDescription(`Trong hàng chờ được ${api.queueTime()}.`)
							.setColor(0xeeee00);

				if(bot.dev) {
					client.channels.cache.get("807045720699830273").send({embeds: [quetime]});
				} else {
					client.channels.cache.get("806881615623880704").send({embeds: [quetime]});
				}
			}, 20 * 1000);
		}


		if(logger == "2y2c đã full") {
			let data = new Scriptdb('./data.json');
			data.set('queueStart', Date.now());
		}

		if(logger == "đang vào 2y2c...") {
			setTimeout(() => {
				let data = new Scriptdb('./data.json');
				data.set("uptime", 60000 + Date.now());
			}, 60 * 1000);
		}

		if (logger =="đang vào 2y2c..."
		|| logger == "Đang vào 2y2c"
		|| logger =="2y2c đã full"
		|| logger.startsWith("[Server]")
		|| logger.startsWith("[AutoRestart]")
		|| logger.startsWith("[Broadcast]")
		|| logger.startsWith("!")
		|| logger == "Unknown command"
		|| logger === " diễn đàn của server https://www.reddit.com/r/2y2c/."
		|| logger === "server thường back up vào 1h sáng nên tps đsẽ tụt vào khoảng thời gian này."
		|| logger == "The main server is down. We will be back soon!"
		|| logger == "Vote cho server tại https://minecraft-mp.com/server-s271071."
		|| logger == "Những ai muốn xài hack của bản 1.12 cho server hãy đọc phần #cách-chơi-cơ-bản trong discord 2y2c."
		|| logger == " dùng lệnh/2y2c  để vào server."
		|| logger == "Like fanpage cho Channy nhé:  https://fb.me/ChannyMinecraft ."
		|| logger == "Please log-in in order to use the chat or any commands!"
		|| logger == "[LP] Permissions data for your user was not loaded during the pre-login stage - unable to continue. Please try again later. If you are a server admin, please check the console for any errors."
		|| logger == "Donate bằng thẻ cào để duy trì server, dùng lệnh /napthe và lệnh /muarank.") {
			if(logger == "2y2c đã full") {
				colorNotf = '0xb60000';
				notfMsg = logger;
				return;
			}
			
			colorNotf = '0xb60000';
			notfMsg = logger;
		}

		if(notfMsg !== undefined) {
			var notf = api.removeFormat(notfMsg)

			var embedNotf = new MessageEmbed()
								.setDescription(notf)
								.setColor(colorNotf);

			if(logger.startsWith("[Broadcast]") && logger.includes("vừa")) {
				if(bot.dev) return;
				client.channels.cache.get("838711105278705695").send({embeds: [embedNotf]});
			}

			if(embedNotf) client.channels.cache.get(bot.defaultChannel).send({embeds:[embedNotf]});

			if(!bot.dev) {
				client.guilds.cache.forEach((guild) => {
					const data = new Scriptdb(`./data/guilds/setup-${guild.id}.json`);
					const checkdata = data.get('livechat');
			
					if(checkdata == undefined || guild == undefined) return;

					try { client.channels.cache.get(checkdata).send({embeds: [embedNotf]}); } catch(e) {}
				});
			}
		}

		var deathMsg;

		if(logger.startsWith("nhắn cho")
		|| checkWhisper == "nhắn:") return;

		if (logger === '2y2c đã full'
		|| logger === 'Đang vào 2y2c'
		|| logger === 'đang vào 2y2c...') return;

		if (!logger) return;

		if (logger.startsWith("[Server]") || logger.startsWith("[Broadcast]")) return;

		if (logger.includes('chết cháy khi đánh với')) {
			var user = logger.split(" ")[6];
			
			saveKills(user, logger)
			deathMsg = logger;
		}

		if (logger.includes('bị bắn bởi')) {
			var user = logger.split(" ")[4];

			saveKills(user, logger)
			deathMsg = logger;
		}
		
		if (logger.includes('bị phản sát thương khi đánh')) {
			var user = logger.split(" ")[7];
			
			saveKills(user, logger)
			deathMsg = logger;
		}

		if (logger.includes('bị giết bởi') && !(logger.includes("một đám"))) {
			var user = logger.split(" ")[4];

			saveKills(user, logger)
			deathMsg = logger;
		}

		if (logger.includes('bị') && logger.includes("đẩy té mẹ ra khỏi game") || logger.includes("đá xuống lava")) {
			var user = logger.split(" ")[2];
			
			saveKills(user, logger)
			deathMsg = logger;
		}

		if (logger.includes('bị hội đồng bởi một đám')) {
			var user = logger.split("'s")[0].split(" ")[1];

			saveKills(user, logger)
			deathMsg = logger;
		}

		if (logger.includes('giết') && logger.includes("bằng")) {
			let user = logger.split(" ")[2];
			let killer = logger.split(" ")[0];

			saveKills(killer, logger)
			saveDead(user, logger)
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
		|| logger.includes('tập')
		|| logger.includes('đập')
		|| logger.includes('bóp')
		|| logger.includes('đang')
		|| logger.includes('cứ')
		|| logger.includes('tưởng')
		|| logger.includes('Đập')
		|| logger.includes('chết')) {
			var user = logger.split(" ")[0];

			saveDead(user, logger);
			deathMsg = logger;
		}

		async function saveDead(name, logger) {
			try {
				// console.log(name + "\n" + logger)

				let regex = /[a-z]|[A-Z]|[0-9]/i;
				if(!name.match(regex)) return; // check regex

				var users = await Object.values(bot.players).map(p => p.username);
				if(users.indexOf(name) < 0) return;
				// console.log("save dead " + name);
				log("Try to save death " + name);
				const d = new Scriptdb(`./data/deaths/${name}.json`);

				if(d.get('deaths') == undefined) {
					d.set('deaths', logger);
					d.set('times', Date.now());
				} else {
					d.set('deaths', d.get('deaths') + " | " + logger);
					d.set('times', d.get('times') + " | " + Date.now());
				}

				const death = new Scriptdb(`./data/kd/${name}.json`);
				var data = death.get('deaths');

				if(data == undefined) {
					death.set('deaths', 1);
				} else {
					death.set('deaths', +data + 1);
				}
			} catch(e) {
				log("Error to save dead " + name);
				console.log(e);
				console.log(logger);
				console.log(name);
			}
		}

		async function saveKills(name, logger) {
			try {
				// console.log(name + "\nlog: " + logger);
				let regex = /[a-z]|[A-Z]|[0-9]/i;
				if(!name.match(regex)) return;

				var users = await Object.values(bot.players).map(p => p.username);
				if(users.indexOf(name) < 0) return;
				// console.log("Saved " + name);
				log("try to save kill " + name);
				const k = new Scriptdb(`./data/kills/${name}.json`);
				if(k.get('kills') == undefined) {
					log("new kill msg " + name);
					k.set('deaths', logger);
					k.set('times', Date.now());
				} else {
					log("save kill msg " + name);
					k.set('deaths', k.get('deaths') + " | " + logger);
					k.set('times', k.get('times') + " | " + Date.now());
				}
				
				const kill = new Scriptdb(`./data/kd/${name}.json`);
				var data = kill.get('kills');

				if(data == undefined) {
					kill.set('kills', 1);
				} else {
					kill.set('kills', +data + 1);
				}
			} catch(e) {
				log("Error to save kill " + name);
				console.log(e);
				console.log(logger);
				console.log(name);
			}
		}

		if(!deathMsg) return;
		
		var embedDeath = new MessageEmbed()
					.setDescription(api.removeFormat(deathMsg))
					.setColor(newcolor);
		
		try{
			client.channels.cache.get(bot.defaultChannel).send({embeds: [embedDeath]});
		} catch(e) {}
		
		if(bot.dev) return;
		
		client.guilds.cache.forEach((guild) => {
			const data = new Scriptdb(`./data/guilds/setup-${guild.id}.json`);
			const checkdata = data.get('livechat');

			if(checkdata == undefined || guild == undefined) return;

			try { client.channels.cache.get(checkdata).send({embeds: [embedDeath]}); } catch(e) {}
		});
	}
}