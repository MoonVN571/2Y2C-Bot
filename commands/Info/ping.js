module.exports = {
    name: "ping",
    aliases: ['pong'],
    delay: 5,

    async execute(client, message, args) {
        
        message.channel.send({embeds: [{
            description: "Đang lấy thông tin của bot...",
            color: "BLUE"
        }], allowedMentions: {repliedUser: false}}).then(msg => {
            message.reply({
                embeds: [{
                    title: "THÔNG TIN ĐỘ TRỄ",
                    fields: [
                        {
                            name: "Bot Latency",
                            value: (msg.createdTimestamp - message.createdTimestamp) + "ms",
                            inline:true
                        },
                        {
                            name: "API Latency",
                            value: client.ws.ping + 'ms',
                            inline: true
                        }
                    ],
                    color: "BLUE"
                }], allowedMentions: { repliedUser: false }
            });
        });
    }
}
