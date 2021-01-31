const Discord = require("discord.js");
const mc = require("minecraft-protocol")

exports.run = (client, message) => {
    var channel = client.channels.cache.get('795193962541481994').toString();
    var prefix = client.prefix;

    const embed = new Discord.MessageEmbed()
                .setColor(0x000DFF)
                .setTitle('[Help Command]')
                .addField("*[Help Command]*", prefix + 'help - ``Mở bản này``', false)
                .addField("*[Status Command]*", prefix + 'status - ``Xem trạng thái của server hàng chờ, online``', false)
                .addField("*[Online Command]*", prefix + 'online - ``Xem số người online``', false)
                .addField("*[Queue Command]*", prefix + 'queue - ``Xem hàng chờ bình thường``', false)
                .addField("*[Priority Command]*", prefix + 'prio - ``Xem hàng chờ ưu tiên``', false)
                .addField("*[Stats Command]*", prefix + 'stats - ``Xem chỉ số của người chơi``', false)
                .addField("*[Stats Command]*", prefix + 'kd - ``Xem số KD của ai đó``', false)
                .addFields({ name: '\u200b', value: '\u200b', inline: false })
                .addFields({ name: "\u200b", value: "Xem tất cả lệnh trong **GAME** tại " + channel + " (click)", inline: false})
                .setFooter(client.footer)
                .setTimestamp();

    message.channel.send(embed);
}