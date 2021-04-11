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
        if(header.includes("2YOUNG")) return;

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
    
        if(s7 == null || s7 == "" || s7.includes("2YOUNG")) return;
        var embed = new bot.Discord.MessageEmbed()
                            .setDescription(s7)
                            .setColor("0xFFCE00");
            
        if(embed == undefined) return;
        client.channels.cache.get(bot.defaultChannel).send(embed)

        setTimeout(() => {
            var guild = client.guilds.cache.map(guild => guild.id);
            setInterval(() => {
                if (guild[0]) {
                    const line = guild.pop()
                    const data = new bot.Scriptdb(`./data/guilds/setup-${line}.json`);
                    const checkdata = data.get('livechat');

                    if(guild == undefined || checkdata == undefined) return;
                    
                    try {
                        client.channels.cache.get(checkdata).send(embed);
                    } catch(e) {  }
                }
            }, 1000);
        }, 100)
    }, 10 * 1000);
}