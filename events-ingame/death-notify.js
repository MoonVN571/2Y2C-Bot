module.exports = (bot, client, message) => { 
	
	var newcolor = 'DB2D2D';
	var logger = message.toString();

	var nocheck = message.toString().split(' ')[0]; // check username with format <>
	// return message on chat
	if (nocheck.startsWith('<') && nocheck.endsWith(">")) return;
	var loggg = new bot.Discord.MessageEmbed()
					.setDescription(logger);
					
	if(!bot.dev) {
		client.channels.cache.get("797426761142632450").send(loggg);
	} else {
		client.channels.cache.get("802456011252039680").send(loggg);	
	}

	if(bot.debug) { console.log(logger) }

	var notfMsg;
	var colorNotf;
	
	var splitLogger2 = logger.split(' ')[1];
	if(splitLogger2 == "nhắn:") {
		var firststr = logger.split(' ');
		var newlog = logger;
		var log = logger.split(' ')[0];
		if(firststr.toString().startsWith("[Donator]")) {
			var rl = log.toString().replace(/\[Donator\]/ig, "")
			newlog = rl + logger.substr(log.toString().length, logger.length + 2);
		} else {
			newlog = log + logger.substr(log.toString().length, logger.length + 2);
		}
		var cancelOne = newlog.replace(/_/ig, "\_")
		var cancelTwo = cancelOne.replace(/`/ig, "\`")
		var n = cancelTwo.replace("||", "\*")
		var lognoformat = n.replace("*", "\*")

		if(lognoformat === undefined) {
			logformat = newlog;
		}

		notfMsg = lognoformat;
		colorNotf = "0xFD00FF";
	}

	if (logger.startsWith("nhắn cho")) { // check bot send message			
		var type = logger.split(" ")[2]; // []
		var log; // logger

		if(type.startsWith("[Donator]")) {
			log = "nhắn cho " + type.replace(/\[Donator\]/ig, "") + " " + logger.substr(8 + type.length + 2, logger.length + 2);
		} else {
			log = logger;
		}
		if(type == "[2B2T]") {
			log = "nhắn cho " + type.replace(/\[2B2T\]/ig, "") + " " + logger.substr(8 + type.length + 2, logger.length + 2);
		}
		
		var cancelOne = log.replace(/_/ig, "\_")
		var cancelTwo = cancelOne.replace(/`/ig, "\`")
		var cancelThree = cancelTwo.replace("*", "\*")
		var lognoformat = cancelThree;
		
		if(lognoformat !== undefined) {
			notfMsg = lognoformat;
		}
		colorNotf = "0xFD00FF";
	}

	if(logger == "2y2c đã full") {
		bot.checkJoined = true;
		setTimeout(() => {
		var fully = new bot.Discord.MessageEmbed()
					.setDescription("2y2c đã full")
					.setColor(0xb60000);

		client.channels.cache.get(bot.defaultChannel).send(fully);
		}, 300);
	}

	if (logger == "Đang vào 2y2c"
	|| logger == "đang vào 2y2c..."
	|| logger.startsWith("[Server]")
	|| logger.startsWith("[SERVER]")
	|| logger.startsWith("Bad command")
	|| logger.startsWith("[Broadcast]")
	|| logger === "Donate để duy trì server admin đang đói chết con *ĩ *ẹ."
	|| logger === " diễn đàn của server https://www.reddit.com/r/2y2c/."
	|| logger === "server thường back up vào 1h sáng nên tps đsẽ tụt vào khoảng thời gian này."
	|| logger == "The main server is down. We will be back soon!"
	|| logger == "Vote cho server tại https://minecraft-mp.com/server-s271071."
	|| logger == "Những ai muốn xài hack của bản 1.12 cho server hãy đọc phần #cách-chơi-cơ-bản trong discord 2y2c."
	|| logger == " dùng lệnh/2y2c  để vào server.") {
		colorNotf = '0xb60000';
		notfMsg = logger;
	}

	if(logger == "The main server is down. We will be back soon!") {
		disconnectRequest = true;
		bot.quit();
	}

	if(logger.startsWith("Kicked whilst connecting to")) {
		bot.quit("re")
		disconnectRequest = true;
		notfMsg = logger;
		colorNotf = '0xb60000';
	}

	if(logger === "Exception Connecting:ReadTimeoutException : null") {
		bot.quit("re")
		disconnectRequest = true;
		notfMsg = logger;
		colorNotf = '0xb60000';
	}

	if(bot.debug) { console.log(notfMsg) }
	if(notfMsg !== undefined) {
		var strn = notfMsg.replace(/\*/ig, "\\*")
		var str = strn.replace(/`/ig, "\\`")
		const s = str.replace("||", "\\||");
		var notf = s.replace(/_/ig, "\\_")

		var embedNotf = new bot.Discord.MessageEmbed()
							.setDescription(notf)
							.setColor(colorNotf);

		if(embedNotf !== undefined) {
			if(!bot.dev) {
				setTimeout(() => {
					var guild = client.guilds.cache.map(guild => guild.id);
					setInterval(() => {
						if (guild[0]) {
							const line = guild.pop()
							const data = new bot.Scriptdb(`./data/guilds/setup-${line}.json`);
							const checkdata = data.get('livechat');

							if(checkdata == undefined || guild == undefined) return;

							try {
								client.channels.cache.get(checkdata).send(embedNotf);
							} catch(e) {  }
						}
					}, 200);
				}, 100)
			}
			setTimeout(() => {
				client.channels.cache.get(bot.defaultChannel).send(embedNotf);
			}, 400)
		}
	}
	

	var deathMsg;

	// return essentials message with valid str
	if(logger.startsWith("[") && logger.includes(" -> me]")) return;

	// return messages
	if(logger.startsWith("nhắn cho")) return;
	if(splitLogger2 == "nhắn:") return;

	if (logger === '2y2c đã full') return;
	if (logger === 'Đang vào 2y2c') return;
	if (logger === 'đang vào 2y2c...') return;
	if (logger === undefined) return;
	if (logger === null) return;

	if (logger === "Donate để duy trì server admin đang đói chết con *ĩ *ẹ." || logger.startsWith("[Server]")
			|| logger.startsWith("[Broadcast]") || logger == "Những ai muốn xài hack của bản 1.12 cho server hãy đọc phần #cách-chơi-cơ-bản trong discord 2y2c.") return;


	if (logger.includes('chết cháy khi đánh với')) {
		var str = logger;
		var user = str.split(" ")[6];
		
		saveKills(user)
		deathMsg = logger;
	}

	if (logger.includes('bị bắn bởi')) {
		var str = logger;
		var user = str.split(" ")[4];

		saveKills(user)
		deathMsg = logger;
	}

	if (logger.includes('đã bị đấm chết con mẹ nó bởi')) { // valid
		var str = logger;
		var user = str.split(" ")[9];

		saveKills(user)
		deathMsg = logger;
	}
	
	if (logger.includes('bị phản sát thương khi đánh')) {
		var str = logger;
		var user = str.split(" ")[7];
		
		saveKills(user)
		deathMsg = logger;
	}

	if (logger.includes('bị giết bởi') && !(logger.includes("một đám"))) {
		var str = logger;
		var user = str.split(" ")[4];

		saveKills(user)
		deathMsg = logger;
	}

	if (logger.includes('khô máu với')) {
		var str = logger;
		var user = str.split(" ")[4];

		saveKills(user)
		deathMsg = logger;
	}

	if (logger.includes('bị') && logger.includes("đẩy té mẹ ra khỏi game") || logger.includes("đá xuống lava")) {
		var str = logger;
		var user = str.split(" ")[2];
		
		saveKills(user)
		deathMsg = logger;
	}

	if (logger.includes('bị hội đồng bởi một đám')) {
		var str = logger;
		var user = str.split(" ")[7];
		var newUser = user;
		if(user.includes("'s")) {
			newUser = user.replace("'s", "")
		}
		saveKills(newUser)
		deathMsg = logger;
	}

	if (logger.includes('bị bởi một đám')) {
		var str = logger;
		var user = str.split(" ")[5];
		var newUser = user;
		if(user.includes("'s")) {
			newUser = user.replace("'s", "")
		}
		saveKills(newUser)
		deathMsg = logger;
		

	}

	if (logger.includes('giết') && logger.includes("bằng")) {
		var str = logger;
		var user = str.split(" ")[2];
		var killer = str.split(" ")[1];

		saveKills(killer)
		saveDead(user)
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

		saveDead(user)
		deathMsg = logger;
	}

	function saveDead(name) {
		const kd = new bot.Scriptdb(`./data/kd/${name}.json`);
		var dead = kd.get('deaths');
		
		if(dead == undefined) {
			kd.set('deaths', 1);
		} else {
			kd.set('deaths', dead + 1);
		}
	}

	function saveKills(name) {
		const kd = new bot.Scriptdb(`./data/kd/${name}.json`);
		var kill = kd.get('kills');

		if(name == "Piglin" || name == "Zombie"  || name == "Zombified" || name == "Cave" || name == "Drowned") return;
		
		if(kill == undefined) {
			kd.set('kills', 1);
		} else {
			kd.set('kills', kill + 1);
		}
	}

	if(deathMsg == undefined) return;
	
	var strn = deathMsg.replace("*", "\\*")
	var str = strn.replace(/`/ig, "\\`")
	var newDeathMsg = str.replace(/_/ig, "\\_")

	if (newDeathMsg === undefined) {
		newDeathMsg = deathMsg;
	}

	var embedDeath = new bot.Discord.MessageEmbed()
							.setDescription(newDeathMsg)
							.setColor(newcolor);

	if(embedDeath == undefined) return;
	if(!bot.dev) {
		setTimeout(() => {
			var guild = client.guilds.cache.map(guild => guild.id);
			setInterval(() => {
				if (guild[0]) {
					const line = guild.pop()
					const data = new bot.Scriptdb(`./data/guilds/setup-${line}.json`);
					const checkdata = data.get('livechat');
					
                    if(guild == undefined || checkdata == undefined) return;

					try {
						client.channels.cache.get(checkdata).send(embedDeath);
					} catch(e) {  }
				}
			}, 200);
		}, 100)
	}
	client.channels.cache.get(bot.defaultChannel).send(embedDeath);
}