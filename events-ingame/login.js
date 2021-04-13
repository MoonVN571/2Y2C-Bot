var check = false;
var stats = false;

var hours = 0;
var minutes = 0;
var totalSeconds = 0;

var stats = false;
var sending = false;

var fs = require('fs');
var Discord = require('discord.js');
var Scriptdb = require('script.db');

var a = require("../api");
var api = new a();

module.exports = (bot, client) => {
    if(check) return;
    check = true;
    function setTime2() {
        totalSeconds += 300;
        hours = parseInt(totalSeconds / 3600);
        minutes = parseInt((totalSeconds - (hours * 3600)) / 60);

        var data = new Scriptdb(`./data.json`).get('tab-content').toString().split("    | ")[0];

        client.channels.cache.get(bot.defaultChannel).setTopic(data + api.calcTime(hours, minutes) + "trước.");
        setTimeout(() => {
            var guild = client.guilds.cache.map(guild => guild.id);
            setInterval(() => {
                if (guild[0]) {
                    const line = guild.pop()
                    const data = new Scriptdb(`./data/guilds/setup-${line}.json`);
                    const checkdata = data.get('livechat');

                    if(guild == undefined || checkdata == undefined) return;
                    
                    try {
                        if(bot.dev) return;
                        client.channels.cache.get(checkdata).setTopic(data)
                    } catch(e) {}
                }
            }, 200);
        }, 100);
    }

    setInterval(setTime2, 5 * 60 * 1000);

    const uptime = new Scriptdb(`./data.json`);
    let ut = uptime.get('uptime');

    if(ut === undefined) {
        var d = new Date();
        var time = d.getTime();
        uptime.set(`uptime`, time);
    } else {
        var d = new Date();
        var time = d.getTime();
        uptime.delete(`uptime`)
        uptime.set(`uptime`, time);
    }

    setTimeout(() => { check = false; }, 30 * 1000)

    bot.disconnectRequest = false;
    
    setInterval(() => {
        if (stats) return;
        stats = true;

        bot.swingArm("left");
        bot.look(Math.floor(Math.random() * Math.floor("360")), 0, true, null);

        setTimeout(() => {
            stats = false;
        }, 10 * 1000);
    }, 1 * 60 * 1000);

    setInterval(() => {
        fs.readFile("ads.txt", 'utf8', function (err, data) {
            if (err) throw err;
            const lines = data.split('\n');
            var random = lines[Math.floor(Math.random() * lines.length)];

            if (sending) return;
            sending = true;
            bot.chat(random);
        });

        setTimeout(() => {
            sending = false;
        }, 1 * 60 * 1000);
    },  10 * 60 * 1000);

    const queuejoined = new Discord.MessageEmbed()
                        .setDescription(`Bot đang vào server..`)
                        .setColor(0x15ff00);


    const joinedd = new Discord.MessageEmbed()
                        .setDescription(`☘️ Bot đã tham gia vào server. ☘️`)
                        .setColor(0x15ff00);

    bot.once('spawn', () => {
        bot.joined = true;

        if(bot.dev) {
            client.channels.cache.get(bot.defaultChannel).send(joinedd);
            client.channels.cache.get("807045720699830273").send(queuejoined);
        } else {
            client.channels.cache.get(bot.defaultChannel).send(joinedd);
            client.channels.cache.get("806881615623880704").send(queuejoined);

            setTimeout(() => {
                var guild = client.guilds.cache.map(guild => guild.id);
                setInterval(() => {
                    if (guild[0]) {
                        const line = guild.pop()
                        const data = new Scriptdb(`./data/guilds/setup-${line}.json`);
                        const checkdata = data.get('livechat');

                        if(checkdata == undefined || guild == undefined) return;

                        try {
                            client.channels.cache.get(checkdata).send(joinedd);
                        } catch(e) {  }
                    }
                }, 200);
            }, 100)
        }
    })
}