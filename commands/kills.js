exports.run = (bot, name, logger) => {

    if(logger.startsWith('!kills')) {
        var newLog = logger.replace('!kills', '')
        var args2 = newLog.split(' ')
        const args3 = args2.toString().replace(',', '')
        const args = args3.toString().replace('.', '')
        
        let count = db.get(`${args}_kills`);

        if(count === null) {
            bot.whisper(username, `Không tìm thấy ${args} trên data.`)
            return;
        } else {
            bot.whisper(username, `Người chơi ${args} đã giết ${count} người.`)
        }
    }
}