exports.run = (bot, name, logger) => {
    if(logger.startsWith("!kit")) {
        var newLog = logger.replace('!kit', '')
        var args = newLog.split(',')
        
        if(args) {
            bot.whisper(username, `Bạn đã nhận được kit tên ${args}.`)
        } else {
            bot.whisper(username, `Bạn đã nhận được kit.`)
        }
    }
}