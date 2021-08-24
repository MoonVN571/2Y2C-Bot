module.exports = {
    name: "eval",
    dev: true,
    
    async execute(client, message, args) {
        let evaled;
        try {
            evaled = await eval(args.join(' '));
        } catch (err) {
            message.reply(err.toString());
        }
    }
}