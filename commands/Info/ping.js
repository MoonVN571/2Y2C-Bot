module.exports = {
    name: "ping",
    aliases: ['pong'],
    delay: 5,

    async execute(client, message, args) {
        message.reply("Đang ping... :ping_pong:").then(msg => {
            msg.edit({
                content: "Pong! :ping_pong:", embeds: [{
                    description: "Độ trễ tin nhắn: " + (msg.createdTimestamp - message.createdTimestamp) + "ms\nDộ trễ Bot: " + client.ws.ping + "ms",
                    color: client.config.DEF_COLOR
                }], allowedMentions: { repliedUser: false }
            });
        });
    }
}
