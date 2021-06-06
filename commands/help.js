var { MessageEmbed } = require('discord.js');

module.exports = {
    name: "help",
    aliases: ['help'],
    
    async execute(client, message, args) {
        var prefix = client.prefix;
        var footer = client.footer;

        var noargs = new MessageEmbed()
                            .setDescription( 
                            "**Các loại lệnh:**" + 
                            "\n``discord`` - Xem các lệnh bot về thông số server." +
                            "\n``check`` - Xem các lệnh để kiểm tra thông tin của người chơi." +
                            "\n``ingame-commands`` - Xem các lệnh của bot ( trong game ) " +
                            "\n``all`` - Xem tất cả các lệnh. ( không chi tiết )\n\n" +
                            
                            "***Cách để xem:** " + prefix + "help **<LOẠI LỆNH>***")

                            .addField("\u200b", '\n\nBạn có thể thêm bot cho discord [tại đây](https://discord.com/api/oauth2/authorize?client_id=768448728125407242&permissions=8&scope=bot).')
                            .setFooter(footer)
                            .setColor(0x000DFF);

        if (!args[0]) return message.channel.send(noargs);

        if (args[0] == "discord") {
            var helpdiscord = new MessageEmbed()
                                .setColor(0x000DFF)
                                .setDescription(
                                    "***Các lệnh discord:**\n" +
                                prefix + 'status - ``Xem trạng thái của server hàng chờ, ưu tiên, trực tuyến.``\n' + 
                                prefix + 'queue - ``Xem thông số server.`` \n' +
                                prefix + 'prio - ``Xem thông số server.``\n' +
                                prefix + 'uptime - ``Xem thông số server.``\n' +
                                prefix + 'setup - ``Cài đặt bot cho livechat.``\n' +
                                prefix + 'delete - ``Xoá ivechat.``\n' +
                                prefix + 'reload - ``Reload lệnh bot ( dev only ).`` \n' +
                                prefix + 'serverstatus - ``Xem hàng chờ, ưu tiên và online.`` \n' +
                                prefix + 'botinfo - ``Xem thông tin bot.`` \n' +
                                prefix + 'botuptime - ``Xem uptime bot.`` \n'
                                )
                                .addField("\u200b", '\n\nBạn có thể thêm bot cho discord [tại đây](https://discord.com/api/oauth2/authorize?client_id=768448728125407242&permissions=8&scope=bot).')
                                .setFooter(footer)
                                .setTimestamp();

            message.channel.send(helpdiscord);
        }

        if (args[0] === "ingame-commands" || args[0] == "ig-cmds" || args[0] == "ic") {
            var ingamecmd = new MessageEmbed()
                                .setColor(0x000DFF)
                                .setDescription(
                                "***Các lệnh ingame:***\n" 
                                + '!help - ``Nhận liên kết đến website xem các lệnh.`` \n' 
                                + '!tps - ``Xem hiện tại tps server.`` \n'
                                + '!kill - ``Thực hiện lệnh /kill cho bot.`` \n' 
                                + '!ping - ``Xem ping của bạn, nhập tên để xem ping người khác.`` \n'
                                + '!prio - ``Xem hàng chờ ưu tiên.`` \n'
                                + '!queue - ``Xem hàng chờ và hàng chờ ưu tiên.`` \n'
                                + '!stats - ``Xem chỉ số K/D. ( Số lẩn chết hoạt động vào 13/1, Số kills hoạt động vào 15/1 )`` \n'
                                + '!joindate - ``Xem ngày người chơi lần đầu tham gia server. ( Hoạt động vào  28/1 )`` \n'
                                + '!playtime - ``Xem thời gian bạn đã chơi. ( Hoạt động vào  1/2 )`` \n'
                                + '!seen - ``Xem lần hoạt động gần nhất của người chơi. ( Hoạt động vào 2/2 )`` \n'
                                + '!2bqueue - ``Xem thông số hàng chờ 2b2t.`` \n'
                                + '!2bstats - ``Xem thông số player stats 2b2t.\n``'
                                + '!2bseen - ``Xem người chơi 2b2t hoạt động lần cuối.\n``'
                                + '!runtime - ``Xem thời gian bot đã ở trong server.`` \n'
                                + '!report - ``Báo cáo người chơi.`` \n'
                                + '!rules - ``Xem luật.`` \n'
                                + '!firstwords - ``Xem tin nhắn đầu tiên.`` \n'
                                + '!lastwords - ``Xem tin nhắn mới nhất.`` \n'
                                + '!follow - ``Cho bot đi theo bạn.`` \n'
                                + '!avoid - ``Tránh.`` \n'
                                + '!come - ``Di chuyển tới vị trí của bạn.`` \n'
                                + '!stop - ``Dừng bot.`` \n'
                                )
                                .addField("\u200b", '\n\nBạn có thể thêm bot cho discord [tại đây](https://discord.com/api/oauth2/authorize?client_id=768448728125407242&permissions=8&scope=bot).')
                                .setFooter(footer)
                                .setTimestamp();

            message.channel.send(ingamecmd);
        }

        if (args[0] === "check") {
            var check = new MessageEmbed()
                            .setColor(0x000DFF)
                            .setDescription("***Các lệnh check ( thông số ):***\n" +
                            prefix + 'kd - ``Xem chỉ số K/D.``'
                            + prefix + 'joindate - ``Xem ngày người chơi lần đầu tham gia server.`` \n'
                            + prefix + 'playtime - ``Xem thời người chơi đã chơi.`` \n'
                            + prefix + 'seen - ``Xem lần hoạt động gần nhất của người chơi.``\n'
                            + prefix + 'playerlist - ``Xem người chơi đang online.``\n'
                            + prefix + 'deaths - ``Xem các lần chết gần đây.``\n'
                            + prefix + 'kills - ``Xem các lần giết người gần đây.``\n'
                            + prefix + 'messages - ``Xem các tin nhắn gần đây.``\n'
                            + prefix + 'firstword - ``Xem tin nhắn đã gửi đầu tiên.``\n'
                            + prefix + 'lastword - ``Xem tin nhắn đã gửi cuối cùng.``\n'
                            + prefix + 'firstdeaths - ``Xem lần chết đầu tiên.``\n'
                            + prefix + 'lastdeaths - ``Xem số lần chết gần nhất.``\n'
                            + prefix + 'firstkills - ``Xem tin nhắn giết người đầu tiên.``\n'
                            + prefix + 'lastkills - ``Xem tin nhắn giết người gần đây.``\n'
                            + prefix + '2bstats - ``Xem K/D người chơi 2b2t.``\n'
                            + prefix + '2bseen - ``Xem lần cuối hoạt động người chơi 2b2t.``'
                            )
                            .setFooter(footer)
                            .setTimestamp();

            message.channel.send(check);
        }

        if (args[0] == "all") {
            var embed = new MessageEmbed()
                                .setColor(0x000DFF)
                                .addField("*Các lệnh trên discord*", "help*, status, queue, prioqueue, setup, serverstatus, invite, botinfo, botuptime, uptime. [Discord: $]", false)
                                .addField("*Kiểm tra thông số tại discord*", "stats, playtime, joindate, seen, playerlists, messages, deaths, kills, firstwords, lastwords, firstdeaths, lastdeaths, firstkills, lastkills 2bqueue, 2bstats, 2bseen. [Discord: $]", false)
                                .addField("*Các lệnh dùng trong server*", "help, tps, ping, queue, prio, stats, joindate, playtime, seen, 2bqueue, 2bstats, runtime, report, rules, avoid, come, follow, stop, firstwords, lastwords. [Ingame: !]", false)
                                .addField("\u200b", '\n\nBạn có thể thêm bot cho discord [tại đây](https://discord.com/api/oauth2/authorize?client_id=768448728125407242&permissions=8&scope=bot).')
                                .setFooter(footer)
                                .setTimestamp();

            message.channel.send(embed);
        }
    }
}