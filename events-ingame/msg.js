var Discord = require('discord.js');
var Scriptdb = require("script.db");

var a = require('../api');
var api = new a();

module.exports = (bot, client, message) => { 
	var newcolor = 'DB2D2D';
	var logger = message.toString();
	var nocheck = message.toString().split(' ')[0];
	
	if(bot.dev) {
		client.channels.cache.get("802456011252039680").send(logger);
	} else {
		client.channels.cache.get("797426761142632450").send(logger);	
	}

	if (nocheck.startsWith('<') && nocheck.endsWith(">")) return;

	var notfMsg;
	var colorNotf;
	
    if (logger === "[AutoRestart] Server Restarting!") {
		if(bot.dev) return;
        client.channels.cache.get('795534684967665695').send("@everyone " + logger);
    }

	var checkWhisper = logger.split(' ')[1];

	if(checkWhisper == "nhắn:") {
		var toLog = logger

		if(logger.startsWith("[")) {
			toLog = toLog.split("]")[1];
		}

		api.removeFormat(toLog);
		
		notfMsg = toLog;
		colorNotf = "0xFD00FF";
	}


	if (logger.startsWith("nhắn cho")) {
		var log = logger;

		if(logger.split(" ")[2].startsWith("[")) {
			log = "nhắn cho " + logger.split("]")[1];
		}

		api.removeFormat(log);

		notfMsg = log;
		colorNotf = "0xFD00FF";
	}

	if(logger == "2y2c đã full") {
		var fully = new Discord.MessageEmbed()
					.setDescription("2y2c đã full")
					.setColor(0xb60000);
		
		setTimeout(() => {
			var guild = client.guilds.cache.map(guild => guild.id);
			setInterval(() => {
				if (guild[0]) {
					const line = guild.pop()
					const data = new Scriptdb(`./data/guilds/setup-${line}.json`);
					const checkdata = data.get('livechat');
	
					if(guild == undefined || checkdata == undefined) return;
	
					try {
						if(bot.dev) return;
						client.channels.cache.get(checkdata).send(fully);
					} catch(e) {}
				}
			}, 200);

			client.channels.cache.get(bot.defaultChannel).send(fully);
		}, 1000)
		return;
	}

	if(logger == "Đang vào 2y2c") {
        var timeQ = new Scriptdb('./data.json')
        timeQ.set('queueEnd', Date.now());

		var quetime = new Discord.MessageEmbed()
					.setDescription(`Trong hàng chờ được ${api.queueTime()}.`)
					.setColor(0xeeee00);

		if(bot.dev) {
			client.channels.cache.get("807045720699830273").send(quetime);
		} else {
			client.channels.cache.get("806881615623880704").send(quetime);
		}

		var fully = new Discord.MessageEmbed()
					.setDescription("Đang vào 2y2c")
					.setColor(0xb60000);

		setTimeout(() => {
			var guild = client.guilds.cache.map(guild => guild.id);
			var i = setInterval(() => {
				if (guild[0]) {
					const line = guild.pop()
					const data = new Scriptdb(`./data/guilds/setup-${line}.json`);
					const checkdata = data.get('livechat');
	
					if(guild == undefined || checkdata == undefined) return;
	
					try {
						if(bot.dev) return;
						client.channels.cache.get(checkdata).send(fully);
					} catch(e) {}
				} else
				clearInterval(i);
			}, 200);

			client.channels.cache.get(bot.defaultChannel).send(fully);
		}, 1500);
	}

	if(logger == "Could not connect to a default or fallback server, please try again later: io.netty.channel.AbstractChannel$AnnotatedConnectException"
	|| logger == "Exception Connecting:ReadTimeoutException : null") {
		bot.quit()
	
	}

	if (logger == "đang vào 2y2c..."
	|| logger.startsWith("[Server]")
	|| logger.startsWith("[AutoRestart]")
	|| logger.startsWith("[Broadcast]")
	|| logger == "Unknown command"
	|| logger === "Donate để duy trì server admin đang đói chết con *ĩ *ẹ."
	|| logger === " diễn đàn của server https://www.reddit.com/r/2y2c/."
	|| logger === "server thường back up vào 1h sáng nên tps đsẽ tụt vào khoảng thời gian này."
	|| logger == "The main server is down. We will be back soon!"
	|| logger == "Vote cho server tại https://minecraft-mp.com/server-s271071."
	|| logger == "Những ai muốn xài hack của bản 1.12 cho server hãy đọc phần #cách-chơi-cơ-bản trong discord 2y2c."
	|| logger == " dùng lệnh/2y2c  để vào server."
	|| logger == "Please log-in in order to use the chat or any commands!"
	|| logger == "[LP] Permissions data for your user was not loaded during the pre-login stage - unable to continue. Please try again later. If you are a server admin, please check the console for any errors."
	|| logger == "Donate bằng thẻ cào để duy trì server, dùng lệnh /napthe và lệnh /muarank.") {
		colorNotf = '0xb60000';
		notfMsg = logger;
	}

	if(notfMsg !== undefined) {
		var notf = api.removeFormat(notfMsg)

		var embedNotf = new Discord.MessageEmbed()
							.setDescription(notf)
							.setColor(colorNotf);

		if(embedNotf !== undefined) {
			if(logger.startsWith("[Broadcast]") && logger.includes("vừa")) { // donators
				if(bot.dev) return;
				setTimeout(() => {  client.channels.cache.get("838711105278705695").send(embedNotf); }, 150)
			}

			client.channels.cache.get(bot.defaultChannel).send(embedNotf);

			if(!bot.dev) {
				setTimeout(() => {
					var guild = client.guilds.cache.map(guild => guild.id);
					var i = setInterval(() => {
						if (guild[0]) {
							const line = guild.pop()
							const data = new Scriptdb(`./data/guilds/setup-${line}.json`);
							const checkdata = data.get('livechat');

							if(checkdata == undefined || guild == undefined) return;

							try {
								client.channels.cache.get(checkdata).send(embedNotf);
							} catch(e) {}
						} else
						clearInterval(i);
					}, 200);
				}, 100);
			}
		}
	}

	var deathMsg;

	if(logger.startsWith("nhắn cho")) return;
	if(checkWhisper == "nhắn:") return;

	if (logger === '2y2c đã full') return;
	if (logger === 'Đang vào 2y2c') return;
	if (logger === 'đang vào 2y2c...') return;
	if (logger === undefined || logger == "null") return;

	if (logger === "Donate để duy trì server admin đang đói chết con *ĩ *ẹ." || logger.startsWith("[Server]")
			|| logger.startsWith("[Broadcast]") || logger == "Những ai muốn xài hack của bản 1.12 cho server hãy đọc phần #cách-chơi-cơ-bản trong discord 2y2c.") return;


	if (logger.includes('chết cháy khi đánh với')) {
		var str = logger;
		var user = str.split(" ")[6];
		
		saveKills(user, logger)
		deathMsg = logger;
	}

	if (logger.includes('bị bắn bởi')) {
		var str = logger;
		var user = str.split(" ")[4];

		saveKills(user, logger)
		deathMsg = logger;
	}
	
	if (logger.includes('bị phản sát thương khi đánh')) {
		var str = logger;
		var user = str.split(" ")[7];
		
		saveKills(user, logger)
		deathMsg = logger;
	}

	if (logger.includes('bị giết bởi') && !(logger.includes("một đám"))) {
		var str = logger;
		var user = str.split(" ")[4];

		saveKills(user, logger)
		deathMsg = logger;
	} 

	if (logger.includes('khô máu với')) {
		var str = logger;
		var user = str.split(" ")[4];

		saveKills(user, logger)
		deathMsg = logger;
	}

	if (logger.includes('bị') && logger.includes("đẩy té mẹ ra khỏi game") || logger.includes("đá xuống lava")) {
		var str = logger;
		var user = str.split(" ")[2];
		
		saveKills(user, logger)
		deathMsg = logger;
	}

	if (logger.includes('bị hội đồng bởi một đám')) {
		var str = logger;
		var user = str.split(" ")[7];
		var newUser = user;
		if(user.includes("'s")) {
			newUser = user.replace("'s", "")
		}
		saveKills(newUser, logger)
		deathMsg = logger;
	}

	if (logger.includes('bị bởi một đám')) {
		var str = logger;
		var user = str.split(" ")[5];
		var newUser = user;
		if(user.includes("'s")) {
			newUser = user.replace("'s", "")
		}
		saveKills(newUser, logger)
		deathMsg = logger;
	} 

	if (logger.includes('giết') && logger.includes("bằng")) {
		var str = logger;
		var user = str.split(" ")[2];
		var killer = str.split(" ")[1];

		saveKills(killer, logger)
		saveDead(user, logger)
		deathMsg = logger;
	}

	if (logger.includes("nổ banh xác")) {
		var str = logger;
		var user = str.split(" ")[4];
		var killer = str.split(" ")[0];

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
	|| logger.includes('tưởng')) {
		var user = logger.split(" ")[0];

		saveDead(user, logger);
		deathMsg = logger;
	}

	function saveDead(name, logger) {
		const death = new Scriptdb(`./data/kd/${name}.json`);
		var data = death.get('deaths');

		// deaths msg
		const d = new Scriptdb(`./data/deaths/${name}.json`);
		logger = logger.replace("/", "\/");
		if(d.get('deaths') == undefined) {
			d.set('deaths', logger);
			d.set('times', Date.now());
		} else {
			d.set('deaths', d.get('deaths') + " | " + logger);
			d.set('times', d.get('times') + " | " + Date.now());
		}

		if(data == undefined) {
			death.set('deaths', 1);
		} else {
			death.set('deaths', +data + 1);
		}
	}

	function saveKills(name, logger) {
		const kill = new Scriptdb(`./data/kd/${name}.json`);
		var data = kill.get('kills');

		// phai o day moi dung :v
		if(name == "Piglin" || name == "Zombie"  || name == "Zombified" || name == "Drowned" || name == "Phantom" || name == "Enderman") return;

		// kills msg
		logger = logger.replace("/", "\/");
		const k = new Scriptdb(`./data/kills/${name}.json`);
		if(k.get('kills') == undefined) {
			k.set('deaths', logger);
			k.set('times', Date.now());
		} else {
			k.set('deaths', k.get('deaths') + " | " + logger);
			k.set('times', k.get('times') + " | " + Date.now());
		}
		
		if(data == undefined) {
			kill.set('kills', 1);
		} else {
			kill.set('kills', +data + 1);
		}
	}

	if(deathMsg == undefined) return;
	
	var embedDeath = new Discord.MessageEmbed()
							.setDescription(api.removeFormat(deathMsg))
							.setColor(newcolor);

	if(embedDeath == undefined) return;
	if(!bot.dev) {
		setTimeout(() => {
			var guild = client.guilds.cache.map(guild => guild.id);
			setInterval(() => {
				if (guild[0]) {
					const line = guild.pop()
					const data = new Scriptdb(`./data/guilds/setup-${line}.json`);
					const checkdata = data.get('livechat');
					
                    if(guild == undefined || checkdata == undefined) return;

					try {
						client.channels.cache.get(checkdata).send(embedDeath);
					} catch(e) {}
				}
			}, 200);
		}, 200)
	}
	client.channels.cache.get(bot.defaultChannel).send(embedDeath);
}