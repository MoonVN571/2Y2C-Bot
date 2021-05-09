var Discord = require('discord.js');
var Scriptdb = require('script.db');
var fs = require('fs');

var ap = require('../api');
var api = new ap();

module.exports = (bot, client, p) => {
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
    
    if (username === "Ha_My" || username == "PhanThiHaMy" || username == "_Mie_Cutee_") {
        if(bot.dev) return;
        client.channels.cache.get("807048523027578890").send(username + " left");
    }
    
    if(bot.countPlayers <= Object.values(bot.players).map(p => p.username).length) return;

    fs.readFile("special-join.txt",  (err, data) => {
        if (err) throw err;
        if(data.toString().split("\r\n").indexOf(username) > -1) {
            if(bot.dev) return;
            var embed = new Discord.MessageEmbed()
                                    .setDescription(api.removeFormat(username) + " left")
                                    .setColor('0xb60000')

            if(bot.dev) return;
            client.channels.cache.get("807506107840856064").send(embed);
        }
    });

    if(username == "MoonZ" || username == "bachbach") {
        var embed = new Discord.MessageEmbed()
            .setDescription("[STAFF] " + username + " left")
            .setColor('0xb60000')

        if(!bot.dev)
        client.channels.cache.get("826280327998996480").send(embed);
    }

    var embed = new Discord.MessageEmbed()
                        .setDescription(api.removeFormat(username) + " left")
                        .setColor('0xb60000')

    client.channels.cache.get(bot.defaultChannel).send(embed)
    
    if(bot.dev) return;
    setTimeout(() => {
        var guild = client.guilds.cache.map(guild => guild.id);
        setInterval(() => {
            if (guild[0]) {
                const line = guild.pop()
                const data = new Scriptdb(`./data/guilds/setup-${line}.json`);
                const checkdata = data.get('livechat');

                if(guild == undefined || checkdata == undefined) return;

                try {
                    client.channels.cache.get(checkdata).send(embed);
                } catch(e) {}
            }
        }, 200);
    }, 100)
}