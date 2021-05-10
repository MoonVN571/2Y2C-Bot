var fs = require('fs');
var Scriptdb = require('script.db');
var Discord = require('discord.js');

var a = require('../api');
var api = new a();

module.exports = (bot, client) => {
    bot.once('spawn', () => {
        var hours = bot.hours;
        var minutes = bot.minutes;
        var totalSeconds = bot.totalSeconds;

        totalSeconds = 0;

        api.start();
        
        setInterval(() => {
            totalSeconds += 300;
            hours = parseInt(totalSeconds / 3600);
            minutes = parseInt((totalSeconds - (hours * 3600)) / 60);
            
            var get = new Scriptdb(`./data.json`).get('tab-content');
            if(get == undefined) return;
            
            var datas = get.toString().split("| ")[0];

            client.channels.cache.get(bot.defaultChannel).setTopic(datas + " - Đã vào server từ " + api.calcTime(hours, minutes) + "trước.");

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
                            client.channels.cache.get(checkdata).setTopic(datas + " - Đã vào server từ " + api.calcTime(hours, minutes) + "trước.")
                        } catch(e) {}
                    }
                }, 200);
            }, 300);
        }, 5 * 60 * 1000)
        
        setTimeout(() => {
            const uptime = new Scriptdb(`./data.json`);

            var d = new Date();
            uptime.set(`uptime`, d.getTime());
        }, 20 * 1000);

        setInterval(() => {
            if(bot.lobby) return;

            bot.swingArm("left");
            bot.look(Math.floor(Math.random() * Math.floor("360")), 0, true, null);
        }, 1 * 60 * 1000);

        setInterval(() => {
            fs.readFile("ads.txt", 'utf8', function (err, data) {
                if (err) throw err;
                const lines = data.split('\n');
                var random = lines[Math.floor(Math.random() * lines.length)];

                bot.chat(random);
            });
        },  10 * 60 * 1000);

        const queuejoined = new Discord.MessageEmbed()
                            .setDescription(`Bot đang vào server..`)
                            .setColor(0x15ff00);


        const joinedd = new Discord.MessageEmbed()
                            .setDescription(`☘️ Đang vào server.. ☘️`)
                            .setColor(0x15ff00);

        bot.joined = true;
        if(bot.dev) {
            client.channels.cache.get(bot.defaultChannel).send(joinedd);
            client.channels.cache.get("807045720699830273").send(queuejoined);
        } else {
            client.channels.cache.get(bot.defaultChannel).send(joinedd);
            
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
                        } catch(e) {}
                    }
                }, 200);
            }, 100)

            client.channels.cache.get("806881615623880704").send(queuejoined)
        }
    })
}