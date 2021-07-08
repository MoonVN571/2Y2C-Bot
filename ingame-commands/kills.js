var Scriptdb = require('script.db');

module.exports = {
    name: "deaths",
    aliases: [''],
    
    async execute(bot, username, args) {
        if(args[0]) {
            if(!args[0].toString().match(bot.regex)) return;
        } else {
            args[0] = username;
        }
        
        const data = new Scriptdb(`./data/kd/${args[0]}.json`);
        let kills = data.get('kills');
        
		if(kills == undefined) return bot.whisper(username, '> Người chơi này chưa giết người lần nào.');

        bot.whisper(username, '> ' + args[0] + ' đã giết ' + kills + ' lần.');
    }
}