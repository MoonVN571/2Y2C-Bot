var Scriptdb = require('script.db');
var Discord = require('discord.js');

var abc = require("../../api")
var api = new abc();

module.exports = {
    name: "deaths",
	description: "Xem 5 tin nhắn của người chơi đã chết gần nhất",
	delay: 5,

    async execute(client, message, args) {
		if (!args[0]) return message.reply({embeds: [client.inputUsername]});

		var quotes = new Scriptdb(`./data/deaths/${args[0]}.json`)
		var deaths = quotes.get('deaths')
		var times = quotes.get('times')

		if(times == undefined || deaths == undefined) return message.reply({embeds: [client.userNotFound]});

		var msg0 = undefined;
		var msg1 = undefined;
		var msg2 = undefined;
		var msg3 = undefined;
		var msg4 = undefined;

		var time0 = undefined;
		var time1 = undefined;
		var time2 = undefined;
		var time3 = undefined;
		var time4 = undefined;
		
		if(times.toString().toString().includes(" | ")) {
			if(times.toString().split(" | ").length <= 5) {
				time0 = times.toString().split(" | ")[0]
				time1 = times.toString().split(" | ")[1]
				time2 = times.toString().split(" | ")[2]
				time3 = times.toString().split(" | ")[3]
				time4 = times.toString().split(" | ")[4]
				
				msg0 = deaths.toString().split(" | ")[0]
				msg1 = deaths.toString().split(" | ")[1]
				msg2 = deaths.toString().split(" | ")[2]
				msg3 = deaths.toString().split(" | ")[3]
				msg4 = deaths.toString().split(" | ")[4]
			} else {
				time0 = times.toString().split(" | ")[times.toString().split(" | ").length - 1]
				time1 = times.toString().split(" | ")[times.toString().split(" | ").length - 2]
				time2 = times.toString().split(" | ")[times.toString().split(" | ").length - 3]
				time3 = times.toString().split(" | ")[times.toString().split(" | ").length - 4]
				time4 = times.toString().split(" | ")[times.toString().split(" | ").length - 5]

				msg0 = deaths.toString().split(" | ")[deaths.toString().split(" | ").length - 1]
				msg1 = deaths.toString().split(" | ")[deaths.toString().split(" | ").length - 2]
				msg2 = deaths.toString().split(" | ")[deaths.toString().split(" | ").length - 3]
				msg3 = deaths.toString().split(" | ")[deaths.toString().split(" | ").length - 4]
				msg4 = deaths.toString().split(" | ")[deaths.toString().split(" | ").length - 5]
			}

			var data = `***${api.ageCalc(time0)} trước***: ${msg0}\n`
			+ `***${api.ageCalc(time1)} trước***: ${msg1}\n`
			+ `***${api.ageCalc(time2)} trước***: ${msg2}\n`
			+ `***${api.ageCalc(time3)} trước***: ${msg3}\n`
			+ `***${api.ageCalc(time4)} trước***: ${msg4}`
			
			if(time4 === undefined) {
				data = `***${api.ageCalc(time0)} trước***: ${msg0}\n`
				+ `***${api.ageCalc(time1)} trước***: ${msg1}\n`
				+ `***${api.ageCalc(time2)} trước***: ${msg2}\n`
				+ `***${api.ageCalc(time3)} trước***: ${msg3}`
			}

			if(time3 === undefined) {
				data = `***${api.ageCalc(time0)} trước***: ${msg0}\n`
				+ `***${api.ageCalc(time1)} trước***: ${msg1}\n`
				+ `***${api.ageCalc(time2)} trước***: ${msg2}`
			}

			if(time2 === undefined) {
				data = `***${api.ageCalc(time0)} trước***: ${msg0}\n`
				+ `***${api.ageCalc(time1)} trước***: ${msg1}`
			}

			if(time1 === undefined) {
				data = `***${api.ageCalc(time0)} trước***: ${msg0}`
			}

			var embed = new Discord.MessageEmbed()
									.setTitle(`Báo cáo của ${args[0]}`)
									.setDescription(`*Tổng số ghi nhận người này: ${deaths.toString().split(" | ").length}*\n`)
									.addField('*5 lần chết gần đây*', data + "\n")
									.setFooter(client.footer)
									.setTimestamp()
									.setColor(0x2EA711);

			message.reply({embeds: [embed]});
		} else {
			var embed = new Discord.MessageEmbed()
									.setTitle(`Báo cáo của ${args[0]}`)
									.setDescription(`*Tổng số ghi nhận người này: 1*\n`)
									.addField('*5 lần chết gần đây*', deaths + "\n")
									.setFooter(client.footer)
									.setTimestamp()
									.setColor(0x2EA711);

			messagereply({embeds: [embed]});
		}
	}
}