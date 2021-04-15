var Discord = require('discord.js');
var Scriptdb = require('script.db');
var fs = require('fs');

module.exports = (bot, client, p) => {
    var username = p.username;
    var newUsername = username.replace(/_/ig, "\\_");

    if (username === "Ha_My" || username === "PhanThiHaMy") {
        if(bot.dev) return;
        client.channels.cache.get("807048523027578890").send(username + " left");
    }

    if (newUsername === undefined) {
        newUsername = username;
    }

    if(bot.countPlayers <= Object.values(bot.players).map(p => p.username).length) return;

    check(username, newUsername);
    function check(username, newUsername) {
        if(newUsername == undefined) {
            newUsername = username;
        }
        fs.readFileSync("special-join.txt",  (err, data) => {
            if (err) throw err;
            if(data.includes(username)) {
                if(bot.dev) return;
                var embed = new Discord.MessageEmbed()
                                        .setDescription(newUsername + " left")
                                        .setColor('0xb60000')

                if(bot.dev) return;
                client.channels.cache.get("807506107840856064").send(embed);
            }
        });
    }

    if(username == "MoonZ" || username == "LinhLinh" || username == "bachbach") {
        var embed = new Discord.MessageEmbed()
            .setDescription("[STAFF] " + newUsername + " left")
            .setColor('0xb60000')

        if(bot.dev) return;
        client.channels.cache.get("826280327998996480").send(embed);
    }

    var embed = new Discord.MessageEmbed()
                        .setDescription(newUsername + " left")
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