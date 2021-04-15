var Scriptdb = require('script.db');

var a = require('../api');
var api = new a();

module.exports = {
    name: "playtime",
    description: "playtime command.",
    aliases: ['pt', 'playtime'],
    
    async execute(bot, username, args) {
        if(args[0]) {
            if(!args[0].toString().match(bot.regex)) return;
        } else {
            args[0] = username;
        }

        let pt = new Scriptdb(`./data/playtime/${args[0]}.json`);
        let playtime = pt.get('time')

        if (playtime === undefined) return bot.whisper(username, `> Không tìm thấy người chơi.`);
        
        var string = api.playtimeCalc(playtime);

        bot.whisper(username, `> ${args[0]}: ${string}.`);
    }
}