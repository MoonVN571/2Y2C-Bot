module.exports = {
    name: "reload",
    aliases: ['rl'],
    admin: true,

    async execute(bot, username, args) {
        if(!args[0]) return

        try {
            const cmd = require(`../ingame-commands/${args[0]}`);

            delete require.cache[require.resolve(`../ingame-commands/${args[0]}`)];

            if(!cmd) return bot.whisper(username, "> Không tìm thấy tên lệnh này.")
            bot.commands.delete(args[0]);
            bot.commands.set(args[0], cmd);
            
            bot.whisper(username, "> Reload thành công: " + args[0]);
        } catch(e) {
            console.log(e);
            bot.whisper(username, "> Không tìm thấy lệnh này.");
        }
    }
}