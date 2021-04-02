module.exports = {
    name: "check",
    description: "check command.",
    aliases: ['check'],
    
    async execute(bot, username, args) {
        if(!args[0]) return;
        if(!args[0].match(bot.regex)) return;

        var list = Object.values(bot.players).map(p => p.username);
        
        if(list.includes(args[0])) {
            bot.whisper(username, `> ${args[0]} đang hoạt động.`)
        } else {
            bot.whisper(username, `> ${args[0]} không hoạt động.`)
        }
    }
}