var Scriptdb = require("script.db");

module.exports = {
    name: "stats",
    description: "stats command.",
    aliases: ['stats', 'kd'],
    
    async execute(bot, username, args) {
        if(args[0]) {
            if(!args[0].toString().match(bot.regex)) return;
        } else {
            args[0] = username;
        }
        
        const kd = new Scriptdb(`./data/kd/${args[0]}.json`);
        let die = kd.get('deaths');
        let kills = kd.get('kills');
        
		if (kills == undefined && deads == undefined) return message.channel.send(client.userNotFound);

        if(kills == undefined) kills = 0;
        if(die == undefined) deads = 0;

        var ratio = kills / die;
        var ratioFixed = ratio.toFixed(2);

        if (ratioFixed === "NaN" || ratioFixed === "Infinity") {
            ratioFixed = "0.00";
        }

        bot.whisper(username, `> ${args[0]}: [K: ${kills} - D: ${die} - K/D: ${ratioFixed}]`);
    }
}