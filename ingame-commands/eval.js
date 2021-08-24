module.exports = {
    name: "eval",
    aliases: ['e'],
    admin: true,
    
    execute(bot, username, args) {
        let evaled;
        try {
            evaled = await eval(args.join(' '));
            bot.whisper(username, "Executed: " + args.join(" "));

            bot.once("mesasge", msg => a = msg.toString());
        } catch (err) {
            bot.whisper(username, `Err: ${err.toString()}`);
            console.log(err);
        }
    }
}