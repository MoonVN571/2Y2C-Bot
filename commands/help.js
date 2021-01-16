exports.run = (bot, username, logger) => {
    if(logger.startsWith("!help")) {
        bot.whisper(username, 'Một số lệnh bạn có thể sử dụng: !discord, !buykit,.. Xem đầy đủ lệnh tại: dicord.gg/yrNvvkqp6w')
    }
}