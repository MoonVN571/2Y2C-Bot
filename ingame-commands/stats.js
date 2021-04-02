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
        
        const kd = new bot.Scriptdb(`./data/kd/${args[0]}.json`);
        let die = kd.get('deaths');
        let kills = kd.get('kills');

        var ratio = kills / die;
        var ratioFixed = ratio.toFixed(2);

        if (ratioFixed === "NaN" || ratioFixed === "Infinity") {
            ratioFixed = "0.00";
        }

        if (die === undefined) {
            die = 0;
        }

        if (kills === undefined) {
            kills = 0;
        }

        bot.whisper(username, `> ${args[0]}: [K: ${kills} - D: ${die} - K/D: ${ratioFixed}]`);
    }
}