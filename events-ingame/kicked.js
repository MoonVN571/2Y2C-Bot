var { MessageEmbed } = require('discord.js');

const log = require('../log');

module.exports = {
	name: 'kicked',
	once: false,
	execute(bot, client, reason, loggedIn) {
        console.log(reason, loggedIn);
        if (reason.includes("You are already connected to this proxy!")) {
            console.log("Bot end for another is active!");
            process.exit();
        }
        
        if(reason == undefined) return;

        var r =  reason.toString().replace(/\{"extra":\[{"text":"|"},{"color":"gold","text":"|"}\],"text":""|{"text":"|"}}/ig).toString().replace(/}|undefined|"|{color:gold,text:/ig, '').toString().replace(/{|color:gold,text:/ig, "");

        var disconnected = new MessageEmbed()
                            .setDescription(`Bot mất kết nối: ` + r)
                            .setColor("F71319");

        if(bot.dev) return;
        
        log('Bot disconnected with: ' + reason)

        if(bot.joined) client.channels.cache.get(bot.defaultChannel).send({embeds: [disconnected]});
    }
}