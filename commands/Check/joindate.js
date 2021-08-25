var Scriptdb = require('script.db');
var { MessageEmbed } = require('discord.js');

var a = require("../../api")
var api = new a();

module.exports = {
    name: "joindate",
    description: "Xem ngày người chơi vào server",
    aliases: ['jd'],
    delay: 5,
    
    async execute(client, message, args) {
		if (!args[0]) return message.reply({embeds: [client.inputUsername]});

		let fj = new Scriptdb(`./data/joindate/${args}.json`);
		let firstjoin = fj.get('date');

		if (firstjoin === undefined) return message.reply({embeds: [client.userNotFound]});


        var t = firstjoin.split(" ")[1];

        var date = firstjoin.replace('/', '-').replace(".", "-").replace('.2', '-202').replace("/2", '-202')

        var day = date.split("-")[0]
        var month = date.split("-")[1]
        var year = date.split("-")[2].split(" ")[0];

        var datee = year + '-' + month + '-' + day + "T" + t.replace(" ", "T") + ":55.506Z";

        var tick = new Date(datee).getTime();

        var embed = new MessageEmbed()
                        .setDescription(`${args[0]}: ${firstjoin} (${api.ageCalc(tick)} trước)`)
                        .setColor(0x2EA711)
                        .setFooter("Dữ liệu chỉ lưu sau 28/1/2021");
        
        message.reply({embeds: [embed]});
    }
}