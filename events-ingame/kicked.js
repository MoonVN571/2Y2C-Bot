var Discord = require('discord.js');

module.exports = (bot, client, reason, loggedIn) => {
    console.log(reason, loggedIn);
    if (reason.includes("You are already connected to this proxy!")) {
        console.log("Bot end for another is active!");
        process.exit();
    }

    if(reason == undefined) return;

    var r =  reason.toString().replace(/\{"extra":\[{"text":"|"},{"color":"gold","text":"|"}\],"text":""|{"text":"|"}}/ig).toString().replace(/}|undefined|"|{color:gold,text:/ig, '').toString().replace(/{|color:gold,text:/ig, "");

    var embed = new Discord.MessageEmbed()
                        .setDescription(`Bot mất kết nối: ` + r)
                        .setColor("F71319");

    
    if(bot.dev) {
        console.log(r)
    }

    if(bot.dev) return;
    
    if(bot.joined) {
        client.channels.cache.get(bot.defaultChannel).send(embed).then(() => {
            client.channels.cache.get("816695017858531368").send(embed)
        });
    }
}