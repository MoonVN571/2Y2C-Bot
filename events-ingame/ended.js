const start = require('../index.js');

var Discord = require('discord.js');
var Scriptdb = require('script.db');
var waitUntil = require('wait-until');

module.exports = (bot, client) => {
    client.user.setActivity("");

	console.log('---------- BOT ENDED ----------');

    totalSecondss = 0;

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

    function uptimeCalc() {
        const u = new Scriptdb(`./data.json`);
        let uptime = u.get('uptime');

        var d = new Date();
        var timenow = d.getTime();

        var ticks = timenow - uptime;
        var temp = ticks / 1000;
        var day = hours = 0, minutes = 0, seconds = 0;
        hours = parseInt(((temp - day * 86400) / 3600))
        minutes = parseInt(((temp - day * 86400 - hours * 3600)) / 60)
        seconds = parseInt(temp % 60)
        if(uptime === undefined) {
            hours = 0;
            minutes = 0;
            seconds = 0;
        }
        return `${hours}h ${minutes}m ${seconds}s`; 
    }

    setTimeout(() => {
        var log = new Discord.MessageEmbed()
                        .setDescription("Bot đã mất kết nối đến server. Kết nối lại sau 1 phút." + `\nĐã hoạt động từ ${uptimeCalc()} trước.`)
                        .setColor("F71319");

        var notf = new Discord.MessageEmbed()
                                .setDescription("🏮 Bot đã mất kết nối đến server. 🏮")
                                .setColor("F71319");
        
                                
        if(bot.botJoined) {
            setTimeout(() => {
                client.channels.cache.get(bot.defaultChannel).send(notf);
            
                setTimeout(() => {
                    var guild = client.guilds.cache.map(guild => guild.id);
                        setInterval(() => {
                            if (guild[0]) {
                                const line = guild.pop()
                                const data = new bot.Scriptdb(`./data/guilds/setup-${line}.json`);
                                const checkdata = data.get('livechat');

                                if(checkdata == undefined || guild == undefined) return;

                                try {
                                    client.channels.cache.get(checkdata).send(notf);
                                } catch(e) {}
                            }
                        }, 200);
                }, 1*100);

            }, 3*1000);

            if(bot.dev) {
                client.channels.cache.get("807045720699830273").send(log);
            } else {
                client.channels.cache.get("806881615623880704").send(log);
            }
        }

        waitUntil(60 * 1000, 50, function condition() {
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
    }, 2 * 1000);
    // setTimeout(() => {
    //     if(bot.isRestarting) {
    //         var reconnect = new Discord.MessageEmbed()
    //                             .setDescription(`⚠️ Server đang restart. Bot sẽ kết nối lại đến khi đã vào được server! ⚠️`)
    //                             .setColor("F71319");

    //         if(bot.dev) {
    //             if(bot.joined) {
    //                 if(!n) {
    //                     n = true;
    //                     client.channels.cache.get("807045720699830273").send(reconnect);
    //                 }
    //             }
    //         } else {
    //             if(bot.joined) {
    //                 if(!n) {
    //                     n = true;
    //                     client.channels.cache.get("806881615623880704").send(reconnect);
    //                 }
    //             }
    //         }

    //         bot.waitUntil(10000, 50, function condition() {
    //             try {
    //                 console.log("Recoonecting to the server.");
    //                 start.createBot()

    //                 return true;
    //             } catch (error) {
    //                 console.log("Error: " + error);
    //                 return false;
    //             }
    //         }, function done(result) {
    //             console.log("Completed: " + result);
    //         });
    //         return;
    //     } 

    //     if(bot.disconnectRequest) {
    //         var log = new Discord.MessageEmbed()
    //                                 .setDescription("Bot đã ngắt kết nối đến server. Kết nối lại sau 1 phút." + `\nĐã hoạt động từ ${bot.api.uptimeCalc()} trước.`)
    //                                 .setColor("F71319"); // cam

    //         var notf = new Discord.MessageEmbed()
    //                                 .setDescription("🏮 Bot đã ngắt kết nối đến server. 🏮")
    //                                 .setColor("F71319"); // cam

    //         client.channels.cache.get(bot.defaultChannel).send(notf);
            
    //         if(bot.dev) {
    //             if(bot.joined){
    //                 client.channels.cache.get("807045720699830273").send(log);
    //             }
    //         } else {
    //             if(bot.joined){
    //                 client.channels.cache.get("806881615623880704").send(log);
                    
    //                 setTimeout(() => {
    //                     var guild = client.guilds.cache.map(guild => guild.id);
    //                         setInterval(() => {
    //                             if (guild[0]) {
    //                                 const line = guild.pop()
    //                                 const data = new bot.Scriptdb(`./data/guilds/setup-${line}.json`);
    //                                 const checkdata = data.get('livechat');
                
    //                                 if(checkdata == undefined || guild == undefined) return;
                
    //                                 try {
    //                                     client.channels.cache.get(checkdata).send(notf);
    //                                 } catch(e) {  }
    //                             }
    //                         }, 200);
    //                 }, 1*100);
    //             }
    //         } 

    //         bot.waitUntil(60000, 30, function condition() {
    //             try {
    //                 console.log("Recoonecting to the server.");
    //                 start.createBot()
                    
    //                 return true;
    //             } catch (error) {
    //                 console.log("Error: " + error);
    //                 return false;
    //             }
    //         }, function done(result) {
    //             console.log("Completed: " + result);
    //         })
    //         return;
    //     }
            
    //     var log = new bot.Discord.MessageEmbed()
    //                     .setDescription("Bot đã mất kết nối đến server. Kết nối lại sau 1 phút." + `\nĐã hoạt động từ ${api.uptimeCalc()} trước.`)
    //                     .setColor("F71319");

    //     var notf = new bot.Discord.MessageEmbed()
    //                             .setDescription("🏮 Bot đã mất kết nối đến server. 🏮")
    //                             .setColor("F71319");
        
    //     setTimeout(() => {
    //         client.channels.cache.get(bot.defaultChannel).send(notf);
    //         setTimeout(() => {
    //             if(bot.dev) return;
    //             client.channels.cache.get("816695017858531368").send(notf);
    //         }, 1*100);
    //     }, 3*1000);

    //     if(bot.dev) {
    //         client.channels.cache.get("807045720699830273").send(log);
    //     } else {
    //         client.channels.cache.get("806881615623880704").send(log);
    //     }
        
    //     bot.waitUntil(60000, 30, function condition() {
    //         try {
    //             console.log("Recoonecting to the server.");
    //             start.createBot()
                
    //             return true;
    //         } catch (error) {
    //             console.log("Error: " + error);
    //             return false;
    //         }
    //     }, function done(result) {
    //         console.log("Completed: " + result);
    //     });
    // }, 3*1000)
}