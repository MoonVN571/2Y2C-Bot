module.exports = {
    name: "tps",
    description: "tps command.",
    aliases: ['tps'],
    
    async execute(bot, username, args) {
        bot.whisper(username, `> TPS : ${bot.getTps()}`)
    }
}