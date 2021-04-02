var check = false;

module.exports = (bot, client, data) => {
    if(check) return;
    check = true;
    if(bot.debug) { console.log("Check current queue") }

    setTimeout(() => {
        check = false;
    }, 20 * 1000);

    if(!bot.lobby) return;

    setTimeout(() => {
        check = false; 

        var header = data.header;
        var s1 = header.toString().replace(/\\n/ig, " ");
        var s2 = s1.replace(/ 2y2c  2y2c §bđã full /ig, "");
        var s3 = s2.replace(/§b|§l|§6/ig, "");
        var s4 = s3.replace(/{"text":"/ig, "");
        var s5 = s4.replace(/"}/ig, "");
        var s6 = s5.replace("thời", " - Thời");
        var s7 = s6.replace("vị", "Vị");
        var getCurrentQueue = s7.replace("Vị trí của bạn: ", "");
        var currentQueue = getCurrentQueue.split(' ')[0];

        if(currentQueue == "None") return;
        if (s7 === undefined) return;

        var q = currentQueue + "/" + bot.api.getQueue();			
        var status = "Trong hàng chờ: " + q + " - Chờ: " + bot.api.getQueue();

        if(status === undefined) return;
            client.user.setActivity(status, { type: 'PLAYING' });
    

        var embed = new bot.Discord.MessageEmbed()
                            .setDescription(s7)
                            .setColor("0xFFCE00");
            
        if(embed == undefined) return;
        client.channels.cache.get(bot.defaultChannel).send(embed).then(() => {
            if(bot.dev) return;
            client.channels.cache.get("816695017858531368").send(embed)
        });
    }, 20 * 1000);
}