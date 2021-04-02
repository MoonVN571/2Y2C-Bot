module.exports = {
    name: "joindate",
    description: "joindate command.",
    aliases: ['jd', 'joindate'],
    
    async execute(bot, username, args) {
        if(!args[0]) return;
        if(!args[0].match(bot.regex)) return;

        let fj = new bot.Scriptdb(`./data/joindate/${args[0]}.json`);
        let firstjoin = fj.get('date');

        if (firstjoin === undefined) return bot.whisper(username, `> Không tìm thấy người chơi.`);
        
        bot.whisper(username, `> Bot đã thấy ${args[0]} lần đầu vào ${firstjoin}.`)
    }
}