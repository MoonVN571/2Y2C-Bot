var os = require("os");

var a = require("../api");
var api = new a()

var mbTotal = ((os.totalmem())/1048576);
var mbFree = ((os.freemem())/1048576);

var currentMaxMem = parseInt(mbTotal);
var currentMem = parseInt(currentMaxMem - mbFree);

var Discord = require('discord.js');

module.exports = {
    name: "botinfo",
    description: "botinfo command.",
    aliases: ['bi'],
    
    async execute(client, message, args) {
        var user = client.users.cache.get("425599739837284362");
        var bot = client.users.cache.get(client.user.id);

        var authorID = user.username + "#" + user.discriminator;
        var botID = bot.username + "#" + bot.discriminator;

       var embed = new Discord.MessageEmbed()
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
                        + "-   **Users:** " + client.guilds.cache.reduce((a, g) => a + g.memberCount, 0)
                        )
                .addField("System",
                          `-   **Platform:** ${os.type()}` + "\n"
                        + `-   **Uptime:** ${api.calc(os.uptime())}` + "\n"
                        + `-   **Ram:** ${currentMem}MB / ${currentMaxMem}MB\n`
                        + "-   **CPU:** " + os.cpus()[0].model + "\n"
                        + "-   **Cores:** " + os.cpus().length + "\n"
                        + "-   **Speed:** " + os.cpus()[0].speed + "MHz"
                        )
                .setColor(0x000DFF)
                .setTimestamp()
                .setFooter(client.footer)
        message.channel.send(embed)
    }
}