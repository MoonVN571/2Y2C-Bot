module.exports = {
    name: "discord",
    description: "Lấy link discord server bot",
    
    execute(bot, username, args) {
        bot.whisper(username, `> Discord : https://discord.gg/BMJ9T8Dqr4`);
    }
}