module.exports = {
    name: "help",
    description: "help command.",
    aliases: ['help'],
    
    async execute(client, message, args) {
        var prefix = client.prefix;
        var footer = client.footer;

        var noargs = new client.Discord.MessageEmbed()
                            // .setDescription('Xem thông tin chi tiết các lệnh: `' + prefix + "help <loại>`\n\n**Loại:** discord, ingame-command, check và all.\nLoại all là xem tất cả lệnh, còn lại là xem chi tiết")
                            .setDescription( 
                            "*Sử dụng " + prefix + "help **<LOẠI LỆNH>***" +
                            "\n\n**Các loại lệnh:**" + 
                            "\n``discord`` - Xem các lệnh bot về thông số server." +
                            "\n``check`` - Xem các lệnh để kiểm tra thông tin của người chơi." +
                            "\n``ingame-command`` - Xem các lệnh của bot ( trong game) " +
                            "\n``all`` - Xem tất cả các lệnh. ( không chi tiết )")
                            .setColor(0x000DFF);

        if (!args[0]) return message.channel.send(noargs);

        if (args[0] == "discord") {
            var helpdiscord = new client.Discord.MessageEmbed()
                .setTitle("*[Discord Command]*")
                .setColor(0x000DFF)
                .setDescription(prefix + 'status - ``Xem trạng thái của server hàng chờ, ưu tiên, trực tuyến.``\n' + 
                                prefix + 'queue - ``Xem thông số server.`` \n' +
                                prefix + 'prio - ``Xem thông số server.``\n' +
                                prefix + 'uptime - ``Xem thông số server.``' +
                                prefix + 'setup - Cài đặt livechat.')
                .setFooter(footer)
                .setTimestamp();

            message.channel.send(helpdiscord);
        }

        if (args[0] === "ingame-command") {
            var ingamecmd = new client.Discord.MessageEmbed()
                .setColor(0x000DFF)
                .setDescription("***Các lệnh bot:***\n" 
                + '!help - ``Xem các lệnh có sẵn.`` \n' 
                + '!tps - ``Xem tps hiện tại của server.`` \n'
                + '!coordinate - ``Xem toạ độ bot hiện tại.`` \n' 
                + '!kill - ``Thực hiện lệnh /kill cho bot.`` \n' 
                + '!ping - ``Xem ping của bạn, nhập tên để xem ping người khác.`` \n'
                + '!prio - ``Xem hàng chờ ưu tiên hiện tại.`` \n'
                + '!que - ``Xem hàng chờ và hàng chờ ưu tiên.`` \n'
                + '!stats - ``Xem chỉ số K/D. ( Dead tính từ 13/1, Kil tính từ 15/1 )`` \n'
                + '!joindate - ``Xem ngày người chơi lần đầu tham gia server. ( Tính từ 28/1 )`` \n'
                + '!pt - ``Xem thời gian bạn đã chơi. ( Bắt đầu từ ngày 1/2 )`` \n'
                + '!seen - ``Xem lần hoạt động gần nhất của người chơi. ( Tính từ 2/2 )`` \n'
                + '!2bqueue - ``Xem hàng chờ hiện tại của 2b2t.`` \n'
                + '!buykit - ``Nhận link discord để mua kit.`` \n'
                + '!players - ``Xem người chơi online.`` \n'
                + '!runtime - ``Xem thời gian bot đã ở trong server.`` \n'
                + '!report - ``Báo cáo người chơi cho admin server.`` \n'
                + '!rules - ``Xem luật của server.`` \n'
                )
                .setFooter(footer)
                .setTimestamp();

            message.channel.send(ingamecmd);
        }
        if (args[0] === "check") {
            var check = new client.Discord.MessageEmbed()
                .setColor(0x000DFF)
                .setDescription("***Các lệnh xem chỉ số:***\n" +
                prefix + 'kd - ``Xem chỉ số K/D.``'
                + prefix + 'jd - ``Xem ngày người chơi lần đầu tham gia server.`` \n'
                + prefix + 'pt - ``Xem thời người chơi đã chơi.`` \n'
                + prefix + 'seen - ``Xem lần hoạt động gần nhất của người chơi.`` \n')
                .setFooter(footer)
                .setTimestamp();

            message.channel.send(check);
        }

        if (args[0] == "all") {
            var embed = new client.Discord.MessageEmbed()
                                .setColor(0x000DFF)
                                .setTitle('[Help Command]')
                                .addField("*[Discord Command]*", "help*, status, online, queue, prio. ($)", false)
                                .addField("*[Check Command]*", "stats, playtime, joindate, seen, uptime. ($)", false)
                                .addField("*[Ingame Command]*", "help, tps, coordinate, kill, ping, queue, prio, stats, joindate, playtime, seen, 2bqueue, buykit, runtime, report, rules. (!)", false)
                                .setFooter(footer)
                                .setTimestamp();

            message.channel.send(embed);
        }
    }
}