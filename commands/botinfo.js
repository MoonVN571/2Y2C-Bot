var os = require("os");

var a = require("../api");
var api = new a()

var mbTotal = ((os.totalmem())/1048576);
var mbFree = ((os.freemem())/1048576);

var currentMaxMem = parseInt(mbTotal);
var maxMemCalc = parseInt(currentMaxMem / 1000) + "G";


var currentMem = parseInt(currentMaxMem - mbFree);
var memCalc = parseInt(currentMem / 1000) + "G";

if(memCalc.split("G")[0] == 0) {
    memcalc = (currentMem) + "MB";
}

if(maxMemCalc.split("G")[0] == 0) {
    maxMemCalc = currentMaxMem + "MB";
}

var Discord = require('discord.js');

module.exports = {
    name: "botinfo",
    description: "botinfo command.",
    aliases: ['bi'],
    
    async execute(client, message, args) {
       var embed = new Discord.MessageEmbed()
                .addField("Thông tin", 
                          "-   **Tên bot:** moonbot#2342 ( ID: 768448728125407242 )\n"
                        + "-   **Người tạo:** Moonz#9801 ( ID: 425599739837284362 )\n"
                        + "-   **Ngày tạo bot:** 21/10/2020\n"
                        + "-   **Ngày tạo minecraft bot:** 5/1/2021\n"
                        + "-   **Bot:** " + require("../package.json").version + "\n"
                        + "-   **Mineflayer:** " + require("../node_modules/mineflayer/package.json").version + "\n"
                        + "-   **Discord.js:** " + require("discord.js").version
                        )
                .addField("System",
                          `-   **Platform:** ${os.type()}` + "\n"
                        + `-   **Uptime:** ${api.calc(os.uptime())}` + "\n"
                        + `-   **Ram:** ${memCalc} / ${maxMemCalc}\n`
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