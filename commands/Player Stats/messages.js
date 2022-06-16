const Database = require('simplest.db');
const api = require("../../utils");
const { MessageEmbed } = require('discord.js');
module.exports = {
	name: "messages",
	description: "Xem 5 tin nhắn gần đây",
	aliases: ['msgs'],
	delay: 5,

	async execute(client, message, args) {
        if (!args[0]) return message.provideUser();

		let quotes = new Database({path:`./data/quotes/${args[0]}.json`});
		let messages = quotes.get('messages');
		let times = quotes.get('times');

		if (!times || !messages) return message.userNotFound();

		let arrDeath = messages.split(" | ");
		let arrTime = times.split(" | ");

		let data = `
*${api.ageCalc(arrTime[arrDeath.length - 1])}* ${arrDeath[arrDeath.length - 1]}
*${api.ageCalc(arrTime[arrDeath.length - 2])}* ${arrDeath[arrDeath.length - 2]}
*${api.ageCalc(arrTime[arrDeath.length - 3])}* ${arrDeath[arrDeath.length - 3]}
*${api.ageCalc(arrTime[arrDeath.length - 4])}* ${arrDeath[arrDeath.length - 4]}
*${api.ageCalc(arrTime[arrDeath.length - 5])}* ${arrDeath[arrDeath.length - 5]}
		`

		try {
			let embed = new MessageEmbed()
				.setTitle(`Báo cáo của ${args[0]}`)
				.setDescription(`*Tổng số ghi nhận người này: ${Intl.NumberFormat().format(arrDeath.length)}*\n`)
				.addField('*5 lần chết gần đây*', data)
				.setTimestamp()
				.setColor("BLUE");

			message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
		} catch(e) {
			console.log(e);
			message.botError();
		}
	}
}