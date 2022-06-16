const Database = require('simplest.db');
const api = require("../../utils");
const { MessageEmbed } = require('discord.js');
module.exports = {
	name: "kills",
	description: "Xem 5 tin nhắn giết người mới nhất",
	delay: 5,

	async execute(client, message, args) {
        if (!args[0]) return message.provideUser();

		let quotes = new Database({path:`./data/kills/${args[0]}.json`})
		let deaths = quotes.get('kills')
		let times = quotes.get('times')

		if (!times || !deaths) return message.userNotFound();


		let arrDeath = deaths.split(" | ");
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