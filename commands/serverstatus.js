module.exports = {
    name: "serverstatus",
    description: "serverstatus command.",
    aliases: ['serverstatus'],
    
    async execute(client, message, args) {
        const embed = new client.Discord.MessageEmbed()
                        .setColor(0x000DFF)
                        .setDescription(client.api.getStatus());

        message.channel.send(embed);
    }
}