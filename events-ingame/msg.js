const { MessageEmbed, Client, Message } = require('discord.js');
const Database = require("simplest.db");
const api = require('../utils');
const log = require('../log');
const { sendLivechat, sendRestart } = require('../functions');
require('dotenv').config();
module.exports = {
	name: 'message',
	once: false,
	/**
	 * 
	 * @param {import('mineflayer').Bot} bot 
	 * @param {Client} client 
	 * @param {Message} message 
	 * @returns 
	 */
	execute(bot, client, message) {
		var color = 0xFD00FF; // cam // 0xFD00FF red
		var logger = message.toString();

		if (logger.startsWith('<') && logger.split(" ")[0].endsWith(">")) return;

		// Dev log
		if(bot.dev) client.channels.cache.get("802456011252039680").send(logger);
		if(!bot.dev) client.channels.cache.get("797426761142632450").send(logger);
		
		if (logger === "[AutoRestart] Server Restarting!" && !bot.dev) sendRestart(client.dev);

		var checkWhisper = logger.split(' ')[1];
		if(checkWhisper == "nhắn:") color = 0xFD00FF;
		if (logger.startsWith("nhắn cho")) color = 0xFD00FF;

		if(logger == "Đang vào 2y2c") {
			bot.haveJoined = true; // check da thay chat dang vao 2y2c chua va tat queue

			svData.queueEnd = Date.now();
			svData.save();

			setTimeout(() => {
				if(bot.lobby) bot.quit();
			}, 1 * 60 * 1000);

			let quetime = new MessageEmbed()
				.setDescription(`Trong hàng chờ được ${api.queueTime()}.`)
				.setColor(0xeeee00);

			if(bot.dev) client.channels.cache.get("807045720699830273").send({embeds: [quetime]});
			else client.channels.cache.get("806881615623880704").send({embeds: [quetime]});
		}

		if(logger == "2y2c đã full") {
			let svData = new Database({path: './data.json'});
			svData.set('queueStart',Date.now());
		}

		if(logger == "đang vào 2y2c...") {
			let svData = new Database({path: './data.json'});
			svData.set('uptime',Date.now());
		}

		
		let deathsRegex = /^([^ ]*) (?:Tập bơi trong lava|nghĩ rằng cậu ấy bơi được hoài|té đập con mẹ nó mặt|bú cu tự sát|đang tập Crystal PvP!|đang leo lên thì té khỏi|té con mẹ nó ra khỏi game|chết ngạt vì đéo biết bơi) ([^ ]*)(.*)$/;
		let killBeforeRegex = /^([^ ]*) (?:đã giết) ([^ ]*)(.*)$/;
		let killAfterRegex = /^([^ ]*) (?:bị giết bởi|bị giết bởi|bị phản sát thương khi đánh vào giáp của) ([^ ]*)(.*)$/;

		if(logger.match(deathsRegex)) {
			let playerList = Object.values(bot.players).map(d => d.username);
			let username = logger.replace(deathsRegex, '');

			color = 0xDB2D2D;

			if(playerList.indexOf(username) > -1) {
				saveDead(username, logger);
			}
		}

		if(logger.match(killBeforeRegex)) {
			let playerList = Object.values(bot.players).map(d => d.username);
			let usernameList = logger.replace(killAfterRegex, ' | ').split(" | ");

			color = 0xDB2D2D;

			if(playerList.indexOf(usernameList[1]) > -1) saveDead(usernameList[1], logger);
			if(playerList.indexOf(usernameList[0]) > -1) saveKills(usernameList[0], logger);
		}

		if(logger.match(killAfterRegex)) {
			let playerList = Object.values(bot.players).map(d => d.username);
			let usernameList = logger.replace(killAfterRegex, ' | ').split(" | ");

			color = 0xDB2D2D;

			if(playerList.indexOf(usernameList[0]) > -1) saveDead(usernameList[0], logger);
			if(playerList.indexOf(usernameList[1]) > -1) saveKills(usernameList[1], logger);
		}

		let mainEmbed = new MessageEmbed()
				.setDescription(api.removeFormat(logger))
				.setColor(color);

		sendLivechat({embeds: [mainEmbed], dev: client.dev});

		async function saveDead(name, logger) {
			try {
				// console.log(name + "\n" + logger)

				let regex = /[a-z]|[A-Z]|[0-9]/i;
				if(!name.match(regex)) return; // check regex

				var users = Object.values(bot.players).map(p => p.username);
				if(users.indexOf(name) < 0) return;
				// console.log("save dead " + name);
				log("Try to save death " + name);
				const data = new Database({path: `./data/deaths/${name}.json`});

				if(data.get('deaths') == undefined) {
					data.set('deaths', logger);
					data.set('times', Date.now());
				} else {
					data.set('deaths', data.get('deaths') + " | " + logger);
					data.set('times', data.get('times') + " | " + Date.now());
				}

				const kd = new Database({path:`./data/kd/${name}.json`});
				kd.number.add('deaths', 1);
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
				const k = new Database({path:`./data/kills/${name}.json`});
				if(!k.get('kills')) {
					log("new kill msg " + name);
					k.set('deaths', logger);
					k.set('times', Date.now());
				} else {
					log("save kill msg " + name);
					k.set('deaths', k.get('deaths') + " | " + logger);
					k.set('times', k.get('times') + " | " + Date.now());
				}
				
				const kd = new Database({path:`./data/kd/${name}.json`});
				kd.number.add('kills', 1);
			} catch(e) {
				log("Error to save kill " + name);
				console.log(e);
				console.log(logger);
				console.log(name);
			}
		}

		console.log(logger);

		var embedDeath = new MessageEmbed()
			.setDescription(api.removeFormat(logger))
			.setColor(color);
		

		sendLivechat({embeds: [embedDeath], dev: client.dev});
	}
}