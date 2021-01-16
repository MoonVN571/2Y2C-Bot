exports.run = (bot, name, logger) => {
    if(logger.startsWith("!tps")) {
        bot.whisper(username, `Server TPS: ${bot.getTps()}`)
    }
}