module.exports = {
    name: "mesasges",
    description: "messages command.",
    aliases: ['messages'],
    
    async execute(client, message, args) {
        if (!args[0]) return message.channel.send(client.userNotFound);

		let quotes = new client.Scriptdb(`./data/quotes/${args[0]}.json`)
		let messages = quotes.get('messages')
		let times = quotes.get('times')

		if(times == undefined || messages == undefined) return message.channel.send(client.userNotFound)

		var msg0 = messages.split(" | ")[1]
		var msg1 = messages.split(" | ")[2]
		var msg2 = messages.split(" | ")[3]	
		var msg3 = messages.split(" | ")[4]
		var msg4 = messages.split(" | ")[5]

		var time0 = times.split(" | ")[times.split(" | ").length - 1]
		var time1 = times.split(" | ")[times.split(" | ").length - 2]
		var time2 = times.split(" | ")[times.split(" | ").length - 3]
		var time3 = times.split(" | ")[times.split(" | ").length - 4]
		var time4 = times.split(" | ")[times.split(" | ").length - 5]
		
		var data = `***${client.api.ageCalc(time0)} trước***: ${msg0}\n***${client.api.ageCalc(time0)} trước***: ${msg1}\n***${client.api.ageCalc(time2)} trước***: ${msg2}\n***${client.api.ageCalc(time3)} trước***: ${msg3}\n***${client.api.ageCalc(time4)} trước***: ${msg4}\n`;
		if(time0 == undefined || msg0 == undefined) {
			data = `***${client.api.ageCalc(time0)} trước***: ${msg0}\n***${client.api.ageCalc(time0)} trước***: ${msg1}\n***${client.api.ageCalc(time2)} trước***: ${msg2}\n***${client.api.ageCalc(time3)} trước***: ${msg3}\n***${client.api.ageCalc(time4)} trước***: ${msg4}\n`
		}
		if(time1 == undefined || msg1 == undefined) {
			data = `***${client.api.ageCalc(time0)} trước***: ${msg1}\n***${client.api.ageCalc(time2)} trước***: ${msg2}\n***${client.api.ageCalc(time3)} trước***: ${msg3}\n***${client.api.ageCalc(time4)} trước***: ${msg4}\n`
		}
		if(time2 == undefined || msg2 == undefined) {
			data = `***${client.api.ageCalc(time2)} trước***: ${msg2}\n***${client.api.ageCalc(time3)} trước***: ${msg3}\n***${client.api.ageCalc(time4)} trước***: ${msg4}\n`
		}
		if(time3 == undefined || msg3 == undefined) {
			data = `***${client.api.ageCalc(time3)} trước***: ${msg3} \n***${client.api.ageCalc(time4)} trước***: ${msg4}\n`
		}
		if(time4 == undefined || msg4 == undefined) {
			data = `***${client.api.ageCalc(time4)} trước***: ${msg4}\n`
		}
		if (messages === undefined || times == undefined) return message.channel.send(client.userNotFound);

		var embed = new client.Discord.MessageEmbed()
								.setTitle(`${args[0]}'s messages`)
								.setDescription(`*Tổng tin nhắn đã gửi: ${messages.split(" | ").length}*\n`)
								.addField('*5 tin nhắn gần đây*', data)
								.setFooter(client.footer)
								.setTimestamp()
								.setColor(0x2EA711);


		message.channel.send(embed);
    }
}