var check = false;

var Discord = require('discord.js');

var once = false;

var log = require('../log');

module.exports = (bot, client, data) => {
    if(check) return;
    check = true;

    setTimeout(() => {
        check = false;
    }, 20 * 1000);

    if(!bot.lobby) return;

    setTimeout(() => {
        check = false; 

        var header = data.header;
        if(header.includes("2YOUNG")) return;

        var s1 = header.toString().replace(/\\n/ig, " ");
        var s2 = s1.replace(/ 2y2c  2y2c §bđã full /ig, "");
        var s3 = s2.replace(/§b|§l|§6/ig, "");
        var s4 = s3.replace(/{"text":"/ig, "");
        var s5 = s4.replace(/"}/ig, "");
        var s6 = s5.replace("thời", " - Thời");
        var s7 = s6.replace("vị", "Vị");
        var getCurrentQueue = s7.replace("Vị trí của bạn: ", "");
        var currentQueue = getCurrentQueue.split(' ')[0];

        if(currentQueue == "None") return;
        if (s7 === undefined) return;

        var Scriptdb = require('script.db');
        const dataa = new Scriptdb(`./data.json`);

        var q = currentQueue + "/" + dataa.get('queue').split(" | ")[0];			

        var que = dataa.get('queue');
        if(que == undefined) {
            que = "None";
        } else {
            if(!que.split(" | ")) {
                que = 0;
            } else {
                que = que.split(" | ")[0];
            }
        }

        if(q == "") return;
        
        var status = "Vị trí hàng chờ: " + q + " - Chờ: " + que + " | $help";

        if(status === undefined) return;
            client.user.setActivity(status, { type: 'PLAYING' }).then(() => {
                log("Set status to bot queue stats");
            })
    
        if(s7 == null || s7 == "" || s7.includes("2YOUNG")) return;
        var embed = new Discord.MessageEmbed()
                            .setDescription(s7)
                            .setColor("0xFFCE00");
        
        if(!once) {
            once = true;
            var timeQ = new Scriptdb('./data.json')
            timeQ.set('queueStart', Date.now() + 20000);
        }

        if(!bot.joined) return;
        if(embed == undefined) return;
        if(bot.haveJoined) return;
        
        client.channels.cache.get(bot.defaultChannel).send(embed)

        if(bot.dev) return;
        
        client.guilds.cache.forEach((guild) => {
            const data = new Scriptdb(`./data/guilds/setup-${guild.id}.json`);
            const checkdata = data.get('livechat');

            if(checkdata == undefined || guild == undefined) return;
                        
            try {
                client.channels.cache.get(checkdata).send(embed);
            } catch(e) {}
        })
    }, 20 * 1000);
}