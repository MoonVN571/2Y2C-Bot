const Scriptdb = require('script.db');
const api = require("../../utils");
const { MessageEmbed } = require('discord.js');
module.exports = {
	name: "messages",
	description: "Xem 5 tin nhắn gần đây",
	aliases: ['msgs'],
	delay: 5,

	async execute(client, message, args) {
        if (!args[0]) return message.provideUser();

		let quotes = new Scriptdb(`./data/quotes/${args[0]}.json`)
		let messages = quotes.get('messages')
		let times = quotes.get('times')

		if (!times || !messages) return message.userNotFound();

		var msg0;
		var msg1;
		var msg2;
		var msg3;
		var msg4;

		var time0;
		var time1;
		var time2;
		var time3;
		var time4;

		if (times.toString().includes(" | ")) {
			if (times.split(" | ").length <= 5) {
				time0 = times.split(" | ")[0]
				time1 = times.split(" | ")[1]
				time2 = times.split(" | ")[2]
				time3 = times.split(" | ")[3]
				time4 = times.split(" | ")[4]

				msg0 = messages.split(" | ")[0]
				msg1 = messages.split(" | ")[1]
				msg2 = messages.split(" | ")[2]
				msg3 = messages.split(" | ")[3]
				msg4 = messages.split(" | ")[4]
			} else {
				time0 = times.split(" | ")[times.split(" | ").length - 1]
				time1 = times.split(" | ")[times.split(" | ").length - 2]
				time2 = times.split(" | ")[times.split(" | ").length - 3]
				time3 = times.split(" | ")[times.split(" | ").length - 4]
				time4 = times.split(" | ")[times.split(" | ").length - 5]

				msg0 = messages.split(" | ")[0]
				msg1 = messages.split(" | ")[1]
				msg2 = messages.split(" | ")[2]
				msg3 = messages.split(" | ")[3]
				msg4 = messages.split(" | ")[4]
			}

			console.log(time0, time1, time2, time3, time4)

			var data = `***${api.ageCalc(time0)} trước***: ${msg0}\n`
				+ `***${api.ageCalc(time1)} trước***: ${msg1}\n`
				+ `***${api.ageCalc(time2)} trước***: ${msg2}\n`
				+ `***${api.ageCalc(time3)} trước***: ${msg3}\n`
				+ `***${api.ageCalc(time4)} trước***: ${msg4}`

			if (time4 === undefined) {
				data = `***${api.ageCalc(time0)} trước***: ${msg0}\n`
					+ `***${api.ageCalc(time1)} trước***: ${msg1}\n`
					+ `***${api.ageCalc(time2)} trước***: ${msg2}\n`
					+ `***${api.ageCalc(time3)} trước***: ${msg3}`
			}

			if (time3 === undefined) {
				data = `***${api.ageCalc(time0)} trước***: ${msg0}\n`
					+ `***${api.ageCalc(time1)} trước***: ${msg1}\n`
					+ `***${api.ageCalc(time2)} trước***: ${msg2}`
			}

			if (time2 === undefined) {
				data = `***${api.ageCalc(time0)} trước***: ${msg0}\n`
					+ `***${api.ageCalc(time1)} trước***: ${msg1}`
			}

			if (time1 === undefined) {
				data = `***${api.ageCalc(time0)} trước***: ${msg0}`
			}

			var embed = new MessageEmbed()
				.setTitle(`Tin nhắn ${args[0]}`)
				.setDescription(`*Tổng tin nhắn đã gửi: ${messages.split(" | ").length}*\n`)
				.addField('*5 tin nhắn gần đây*', data)
				.setTimestamp()
				.setColor(0x2EA711);

			message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
		} else {
			var embed = new MessageEmbed()
				.setTitle(`Tin nhắn ${args[0]}`)
				.setDescription(`*Tổng tin nhắn đã gửi: ${messages.split(" | ").length}*\n`)
				.addField('*5 tin nhắn gần đây*', `***${api.ageCalc(times)} trước:*** ${messages}`)
				.setTimestamp()
				.setColor(0x2EA711);

			message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
		}
	}
}