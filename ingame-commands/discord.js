module.exports = {
    name: "discord",
    description: "Lấy link discord server bot",
    
    execute(bot, username, args) {
        bot.whisper(username, `> Discord : http://discord.gg/yrNvvkqp6w`)
    }
}