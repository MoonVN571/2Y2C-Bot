module.exports = {
    name: "rules",
    description: "rules command.",
    aliases: ['rules'],
    
    async execute(bot, username, args) {
        bot.whisper(username, `> LUẬT: Tuyệt đối không HACK, CHEAT, LỪA ĐẢO, SPAM, PHÁ HOẠI. Báo cáo ngay với lệnh !report.`)
    }
}