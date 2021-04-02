module.exports = {
    name: "seen",
    description: "seen ommand.",
    aliases: ['seen'],
    
    async execute(bot, username, args) {
        if(!args[0]) return;
        if(!args[0].match(bot.regex)) return;

        let ls = new bot.Scriptdb(`./data/seen/${args[0]}.json`);
        var seen = ls.get('seen');

        if (seen === undefined) return bot.whisper(username, `> Không tìm thấy người chơi.`);

        var age = bot.api.ageCalc(seen);
        bot.whisper(username, `> Bot đã thấy ${args[0]} từ ${age} trước.`);
    }
}