const start = require('../index.js');

var n = false;
var check = false;

module.exports = (bot, client) => {
    client.user.setActivity("");

	console.log('---------- BOT ENDED ----------')
    
    if(check) return;
    check = true;

    setTimeout(() => { check = false; }, 2 * 60 * 1000)

    bot.checkJoined = false;
    totalSecondss = 0;

    const uptime = new bot.Scriptdb(`./data.json`);
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

    setTimeout(() => {
        if(!bot.lobby) { // se set cai nay sang false neu o trong sv chinh
            n = false;
        }
    }, 30 * 1000);

    setTimeout(() => {
        if(bot.isRestarting) {
            var reconnect = new bot.Discord.MessageEmbed()
                                .setDescription(`⚠️ Server đang restart. Bot sẽ kết nối lại đến khi đã vào được server! ⚠️`)
                                .setColor("F71319");

            if(bot.dev) {
                if(!n) {
                    client.channels.cache.get("807045720699830273").send(reconnect);
                    n = true;
                }
            } else {
                if(!n) {
                    client.channels.cache.get("806881615623880704").send(reconnect);
                    n = true;
                }
            }

            bot.waitUntil(60000, 300, function condition() {
                try {
                    console.log("Recoonecting to the server.");
                    start.createBot()

                    return true;
                } catch (error) {
                    console.log("Error: " + error);
                    return false;
                }
            }, function done(result) {
                console.log("Completed: " + result);
            });
            return;
        } 

        if(bot.disconnectRequest) {
            var log = new bot.Discord.MessageEmbed()
                                    .setDescription("Bot đã ngắt kết nối đến server. Kết nối lại sau 1 phút." + `\nĐã hoạt động từ ${bot.api.uptimeCalc()} trước.`)
                                    .setColor("F71319"); // cam

            var notf = new bot.Discord.MessageEmbed()
                                    .setDescription("🏮 Bot đã ngắt kết nối đến server. 🏮")
                                    .setColor("F71319"); // cam

            if(bot.joined) {
                client.channels.cache.get(bot.defaultChannel).send(notf);
                setTimeout(() => {
                    if(bot.dev) return
                    client.channels.cache.get("816695017858531368").send(notf);
                }, 1*100);
                if(bot.dev) {
                    client.channels.cache.get("807045720699830273").send(log);
                } else {
                    client.channels.cache.get("806881615623880704").send(log);
                } 
            }

            bot.waitUntil(60000, 30, function condition() {
                try {
                    console.log("Recoonecting to the server.");
                    start.createBot()
                    
                    return true;
                } catch (error) {
                    console.log("Error: " + error);
                    return false;
                }
            }, function done(result) {
                console.log("Completed: " + result);
            })
            return;
        }

        var log = new bot.Discord.MessageEmbed()
                        .setDescription("Bot đã mất kết nối đến server. Kết nối lại sau 1 phút." + `\nĐã hoạt động từ ${bot.api.uptimeCalc()} trước.`)
                        .setColor("F71319"); // cam

        var notf = new bot.Discord.MessageEmbed()
                                .setDescription("🏮 Bot đã mất kết nối đến server. 🏮")
                                .setColor("F71319"); // cam
        
        // if(bot.)
        setTimeout(() => {
            client.channels.cache.get(bot.defaultChannel).send(notf);
            setTimeout(() => {
                if(bot.dev) return;
                client.channels.cache.get("816695017858531368").send(notf);
            }, 1*100);
        }, 3*1000);

        if(bot.dev) {
            client.channels.cache.get("807045720699830273").send(log);
        } else {
            client.channels.cache.get("806881615623880704").send(log);
        }
        
        bot.waitUntil(60000, 30, function condition() {
            try {
                console.log("Recoonecting to the server.");
                start.createBot()
                
                return true;
            } catch (error) {
                console.log("Error: " + error);
                return false;
            }
        }, function done(result) {
            console.log("Completed: " + result);
        });
        

        bot.joined = false;
    }, 3*1000)
}