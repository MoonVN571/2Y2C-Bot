var { MessageEmbed } = require('discord.js');
var Scriptdb = require('script.db');
var fs = require('fs');

var ap = require('../api');
var api = new ap();

const log = require('../log');

module.exports = {
	name: 'playerLeft',
	once: false,
	execute(bot, client, p) {
        var username = p.username;
        
        var d = new Date();
        var time = d.getTime();
        let lastseen = new Scriptdb(`./data/seen/${username}.json`);
        var ls = lastseen.get('seen')

        if (ls === undefined) {
            lastseen.set('seen', time);
        } else {
            lastseen.set('seen', time);
        }
        
        if(bot.countPlayers <= Object.values(bot.players).map(p => p.username).length) return;

        fs.readFile("special-join.txt",  (err, data) => {
            if (err) throw err;
            if(data.toString().split("\r\n").indexOf(username) > -1) {
                log("Oldfag name " + username + " left.");
                
                if(bot.dev) return;
                var embed = new MessageEmbed()
                                        .setDescription(api.removeFormat(username) + " left")
                                        .setColor('0xb60000')

                if(bot.dev) return;
                client.channels.cache.get("807506107840856064").send(embed);
            }
        });

        if(username == "MoonzVN" || username == "bach") {
            var embed = new MessageEmbed()
                .setDescription("[STAFF] " + username + " left")
                .setColor('0xb60000')

            if(!bot.dev)
            client.channels.cache.get("826280327998996480").send(embed); // shop staff join
        }

        var embed = new MessageEmbed()
                            .setDescription(api.removeFormat(username) + " left")
                            .setColor('0xb60000')

        client.channels.cache.get(bot.defaultChannel).send(embed);
        
        if(bot.dev) return;
    
        client.guilds.cache.forEach((guild) => {
            const data = new Scriptdb(`./data/guilds/setup-${guild.id}.json`);
            const checkdata = data.get('livechat');

            if(checkdata == undefined || guild == undefined) return;

            try { client.channels.cache.get(checkdata).send(embed); } catch(e) {}
        });
    }
}