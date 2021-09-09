var { MessageEmbed } = require('discord.js');
var Scriptdb = require('script.db');
var fs = require('fs');
const api = require('../utils');

module.exports = {
	name: 'playerLeft',
	once: false,
	execute(bot, client, p) {
        var username = p.username;
        
        let lastseen = new Scriptdb(`./data/seen/${username}.json`);
        lastseen.set('seen', new Date().getTime());

        fs.readFile("special-join.txt",  (err, data) => {
            if (err) return console.log(err);

            if(data.toString().split("\r\n").indexOf(username) > -1) {                
                if(bot.dev) return;
                var embed = new MessageEmbed()
                                        .setDescription(api.removeFormat(username) + " đã thoát khỏi server.")
                                        .setColor('0xb60000')

                client.channels.cache.get("807506107840856064").send({embeds: [embed]});
            }
        });

        if(bot.countPlayers <= Object.values(bot.players).map(p => p.username).length) return;

        var embed = new MessageEmbed()
                    .setDescription(api.removeFormat(username) + " đã thoát khỏi server.")
                    .setColor(0xb60000);

        if(bot.dev) client.channels.cache.get("882849908892254230").send({embeds: [embed]});
        if(!bot.dev) client.channels.cache.get("882817156977410049").send({embeds: [embed]});

        if(bot.dev) return;

        client.guilds.cache.forEach((guild) => {
            const data = new Scriptdb(`./data/guilds/setup-${guild.id}.json`);
            const checkdata = data.get('connection');
    
            if(checkdata == undefined || guild == undefined) return;
            
            if(bot.dev) return;
            try {
                client.channels.cache.get(checkdata).send({embeds: [embed]});
            } catch(e) {}
        });
    }
}