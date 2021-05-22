module.exports = {
    name: "ping",
    aliases: ['pong'],
    
    async execute(client, message, args) {
        message.channel.send("Pinging...").then(msg => {
            msg.edit("Độ trể bot: " + (msg.createdTimestamp - message.createdTimestamp) + "ms\nDộ trể API: " + client.ping)
        });
    }
}
