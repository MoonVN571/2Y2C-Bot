const request = require('request');
var { MessageEmbed } = require('discord.js');

var apiNew = require('../api');
var api = new apiNew();

module.exports = {
    name: "2bseen",
    aliases: ['2blastseen'],
    
    async execute(client, message, args) {
        if (!args[0]) return message.channel.send(client.userNotFound);

        request('https://api.2b2t.dev/seen?username=' + args[0], function (error, response, body) {
            var data = JSON.parse(body)[0];

            if(data == undefined) return message.channel.send(client.userNotFound)

            let seen = data.seen;

            var toTime = new Date(seen);

            var age = api.ageCalc(toTime);

		    var embed = new MessageEmbed()
                        .setDescription(`2B2T: Đã thấy ${args[0]} từ ${age} trước.`)
                        .setColor(0x2EA711);

            message.channel.send(embed);
        })
    }
}