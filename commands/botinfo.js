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

// console.log("Tên bot: moonbot#2342 ( ID: 768448728125407242 )")
// console.log("Người tạo: Moonz#9801 ( ID: 425599739837284362 )")
// console.log("Ngày tạo bot: 21/10/2020")
// console.log("Ngày tạo minecraft bot: 5/1/2021")
// console.log("Phiên bản bot: " + require("./package.json").version)
// console.log("Phiên bản Mineflayer: " + require("./node_modules/mineflayer/package.json").version)
// console.log("Phiên bản discord.js: " + require("discord.js").version)

// console.log(`Ram: ${memCalc} / ${maxMemCalc}`);
// console.log(`Platform: ${os.type()}`);
// console.log(`System uptime: ${api.calc(os.uptime())}`);
// console.log("CPU: " + os.cpus()[0].model);
// console.log("Cores: " + os.cpus().length)
// console.log("Speed: " + os.cpus()[0].speed + "Mhz");

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
                        + "-   **Phiên bản bot:** " + require("../package.json").version + "\n"
                        + "-   **Phiên bản mineflayer:** " + require("../node_modules/mineflayer/package.json").version + "\n"
                        + "-   **Phiên bản discord.js:** " + require("discord.js").version
                        )
                .addField("System",
                          `-   **Platform:** ${os.type()}` + "\n"
                        + `-   **Uptime:** ${api.calc(os.uptime())}` + "\n"
                        + `-   **Ram:** ${memCalc} / ${maxMemCalc}\n`
                        + "-   **CPU:** " + os.cpus()[0].model + "\n"
                        + "-   **Cores:** " + os.cpus().length + "\n"
                        + "-   **Speed:** " + os.cpus()[0].speed + "Mhz"
                        )
                .setColor(0x000DFF)
                .setTimestamp()
                .setFooter(client.footer)
        message.channel.send(embed)
    }
}