var Discord = require('discord.js');
var Scriptdb = require('script.db');
var fs=  require('fs');

var checkOnly = false;

module.exports = (bot, client, p) => {
    bot.countPlayers++;
    var username = p.username;
    var newUsername = username.replace(/_/ig, "\\_");

    if(!checkOnly) {
        checkOnly = true;
        setTimeout(() => {
            if(bot.verified) return;
            bot.quit();
        }, 3 * 60 * 1000);   
    }

    var today = new Date()
    let day = ("00" + today.getDate()).slice(-2)
    let month = ("00" + (today.getMonth() + 1)).slice(-2)
    let years = ("00" + today.getFullYear()).slice(-2)
    let hours = ("00" + today.getHours()).slice(-2)
    let min = ("00" + today.getMinutes()).slice(-2)
    var date = day + '.' + month + '.' + years + ' ' + hours + ':' + min;

    let fj = new Scriptdb(`./data/joindate/${username}.json`);
    let firstjoin = fj.get('date');
    if (firstjoin === undefined) {
        fj.set(`date`, date)
    }

    if (username === "Ha_My" || username == "PhanThiHaMy") {
        if(bot.dev) return;
        bot.client.channels.cache.get("807048523027578890").send(username + " joined");
    }
    
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

    check(username);
    function check(username) {
        var newUsername = username.replace(/_/ig, "\\_");
        
        fs.readFile("special-join.txt", 'utf8', (err, data) => {
            if (err) throw err;
            if(data.includes(username)) {
                if(bot.dev) return;
                var embed = new Discord.MessageEmbed()
                    .setDescription(newUsername + " joined")
                    .setColor('0xb60000');

                client.channels.cache.get("807506107840856064").send(embed);
            }
        });
    }
    
    if(username == "MoonZ" || username == "LinhLinh" || username == "bachbach") {
        var embed = new Discord.MessageEmbed()
            .setDescription("[STAFF] " + newUsername + " joined")
            .setColor('0xb60000')

        if(bot.dev) return;
        client.channels.cache.get("826280327998996480").send(embed);
    }
    
    var embed = new Discord.MessageEmbed()
                        .setDescription(newUsername + " joined")
                        .setColor('0xb60000');	

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
                    if(embed !== undefined) {
                        client.channels.cache.get(checkdata).send(embed);
                    }
                } catch(e) {}
            }
        }, 200);
    }, 100)
}