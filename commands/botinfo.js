var os = require("os");

var a = require("../api");
var api = new a()

var { MessageEmbed } = require('discord.js');

module.exports = {
    name: "botinfo",
    description: "botinfo command.",
    aliases: ['bi'],
    
    async execute(client, message, args) {
        var user = client.users.cache.get("425599739837284362");
        var bot = client.users.cache.get(client.user.id);

        var authorID = user.username + "#" + user.discriminator;
        var botID = bot.username + "#" + bot.discriminator;

       var embed = new MessageEmbed()
                .addField("Thông tin", 
                          "-   **Tên bot:** None\n"
                        + "-   **Người tạo:** None\n"
                        + "-   **Ngày tạo bot:** Calculating\n"
                        + "-   **Bot game tạo vào:** Calculating\n\n"

                        + "-   **Moon bot:** Runner Test\n"
                        + "-   **Minecraft bot:** Proccessing\n"
                        + "-   **Discord bot:** Unknown"
                        )
                .addField("Bot stats", 
                        "-   **Guilds:** None\n"
                        + "-   **Channels:**  None\n"
                        + "-   **Users:** None\n"
                        + "-   **Ping:** Pinging...\n"
                        + "-   **API Ping:** Pinging..." 
                        )
                .addField("System",
                          `-   **Platform:** ${os.type()}` + "\n"
                        + `-   **Window Uptime:** ${api.calc(os.uptime())}` + "\n"
                        + `-   **Ram Usage:** Caculating...\n`
                        + "-   **CPU Process:** Testing...\n"
                        + "-   **CPU Cores:** Unknown\n"
                        + "-   **CPU Speed:** Unknown"
                        )
                .setColor(0x000DFF)
                .setTimestamp()
                .setFooter(client.footer);

        message.channel.send(embed).then(msg => {
                var embed = new MessageEmbed()
                        .addField("Thông tin", 
                                "-   **Tên bot:** " + botID + " - ID: 768448728125407242\n"
                                + "-   **Người tạo:** " + authorID + " - ID: 425599739837284362\n"
                                + "-   **Ngày tạo bot:** 21/10/2020\n"
                                + "-   **Bot game tạo vào:** 5/1/2021\n\n"

                                + "-   **Moon bot:** " + require("../package.json").version + "\n"
                                + "-   **Minecraft bot:** " + require("../node_modules/mineflayer/package.json").version + " (mineflayer)\n"
                                + "-   **Discord bot:** " + require("discord.js").version
                                )
                        .addField("Bot stats", 
                                "-   **Guilds:** " + client.guilds.cache.size + "\n"
                                + "-   **Channels:** " + client.channels.cache.size + "\n"
                                + "-   **Users:** " + client.guilds.cache.reduce((a, g) => a + g.memberCount, 0) + "\n"
                                + "-   **Ping:** " + client.ping + "ms\n"
                                + "-   **API Ping:** " + (msg.createdTimestamp - message.createdTimestamp) + "ms" 
                                )
                        .addField("System",
                                        `-   **Platform:** ${os.type()}` + "\n"
                                + `-   **Window Uptime:** ${api.calc(os.uptime())}` + "\n"
                                + `-   **Ram Usage:** ${((process.memoryUsage().heapUsed / 1024) / 1024).toFixed(2)} MB\n`
                                + "-   **CPU Process:** " + os.cpus()[0].model + "\n"
                                + "-   **CPU Cores:** " + os.cpus().length + "\n"
                                + "-   **CPU Speed:** " + os.cpus()[0].speed + "MHz"
                        )
                        .setColor(0x000DFF)
                        .setTimestamp()
                        .setFooter(client.footer);

                msg.edit(embed);
        })
    }
}