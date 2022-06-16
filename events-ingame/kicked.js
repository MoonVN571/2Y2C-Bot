const { MessageEmbed } = require('discord.js');
const log = require('../log');

module.exports = {
	name: 'kicked',
	once: false,
	async execute(bot, client, reason, loggedIn) {
        console.log(reason, loggedIn);
        if (reason.includes("You are already connected to this proxy!")) {
            console.log("Bot end for another is active!");
            process.exit();
        }
        
        if(reason == undefined) return;

        let message = [];

        let obj = JSON.parse(reason);

        await obj?.extra.forEach(d => {
            message.push(d.text);
        });

        message.push(d.text);
        
        var disconnected = new MessageEmbed()
            .setDescription(`Bot mất kết nối: ${message.join("\n")}`)
            .setColor("F71319");

        if(bot.dev) return;

        try {
            if(bot.joined) client.channels.cache.get(bot.defaultChannel).send({embeds: [disconnected]});
        } catch(e) {}
    }
}