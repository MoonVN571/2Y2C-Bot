const { MessageEmbed } = require('discord.js');
const api = require('../utils');
const { sendConnection } = require('../functions');

module.exports = {
	name: 'playerLeft',
	once: false,
    
	async execute(bot, client, p) {
        let username = p.username;
        if(bot.countPlayers > Object.values(bot.players).map(p => p.username).length) {
            var embed = new MessageEmbed()
                .setDescription(api.removeFormat(username) + " đã thoát khỏi server.")
                .setColor(0xb60000);

            sendConnection({ embeds: [embed], dev: client.dev });
        }
        
        let dataSeen = await seen.findOne({ username: username });
        if(!dataSeen) await seen.create({ username: username, seen: Date.now() });
        else {
            dataSeen.seen = Date.now();
            dataSeen.save();
        }

        checkOld();

        async function checkOld() {
            let svData = await server.findOne({})?.oldfag;
            if(svData.indexOf(username) < 0) return;

            let content = api.removeFormat(username) + " đã tham gia vào server.";
            if(before) content = "Bot đã vào server và " + api.removeFormat(username) + " đang online.";

            let embed = new MessageEmbed()
                .setDescription(content)
                .setColor(0xb60000);

            client.channels.cache.get("807506107840856064").send({ embeds: [embed] });
        }
    }
}