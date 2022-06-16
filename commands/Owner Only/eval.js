module.exports = {
    name: "eval",
    description: "Chạy code input",
    dev: true,
    
    async execute(client, message, args) {
        if(!args[0]) return;
        
        let evaled;
        try {
            evaled = await eval(args.join(' ').split("\n").join(" "));
            message.channel.send(`${evaled}`);
        } catch (err) {
            message.reply(err.toString());
        }
    }
}