module.exports = {
    name: "rules",
    description: "rules command.",
    aliases: ['rules', 'rule'],
    
    async execute(bot, username, args) {
        bot.whisper(username, `> LUẬT: Tuyệt đối không HACK, CHEAT, LỪA ĐẢO, SPAM, PHÁ HOẠI, DUPE dưới mọi hình thức. Báo cáo ngay với lệnh !report.`)
    }
}