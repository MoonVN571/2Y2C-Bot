module.exports = {
    name: "tps",
    description: "Xem độ mượt của server",
    aliases: ['tps'],
    
    execute(bot, username, args) {
        bot.whisper(username, `> TPS : ${bot.getTps()}`)
    }
}