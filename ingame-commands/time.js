exports.run = (bot, name, logger) => {
    if(logger.startsWith("!time")) {
        bot.whisper(username, `Thế giới đã tồn tại được ${bot.time.day} ngày.`)
    }
}