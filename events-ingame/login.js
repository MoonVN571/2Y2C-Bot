var check = false;
var stats = false;

module.exports = (bot, client) => {
    function setTime2() {
        bot.totalSecondss += 300;
        bot.hourss = parseInt(bot.totalSecondss / 3600)
        bot.minutess = parseInt((bot.totalSecondss - (bot.hourss * 3600)) / 60);
    }

    bot.oneNotf = false;

    if(check) return;
    check = true;

    setTimeout(() => { check = false; }, 1 * 60 * 1000)

    setInterval(setTime2, 5 * 60 * 1000);

    //    setInterval(() => { console.log(bot.hourss + " : " + bot.minutess)}, 3 * 1000)
        
    const uptime = new bot.Scriptdb(`./data.json`);
    let ut = uptime.get('uptime');

    bot.joined = true;

    if(ut === undefined) {
        var d = new Date();
        var time = d.getTime();
        uptime.set(`uptime`, time);
    } else {
        var d = new Date();
        var time = d.getTime();
        uptime.delete(`uptime`)
        uptime.set(`uptime`, time);
    }

    disconnectRequest = false;
    setInterval(() => {
        if(bot.lobby) return;
        if (stats) return;
        stats = true;
        bot.swingArm("left");
        bot.look(Math.floor(Math.random() * Math.floor("360")), 0, true, null);

        setTimeout(() => {
            stats = false;
        }, 10 * 1000);
    }, 1 * 60 * 1000);


    setInterval(() => {
        bot.fs.readFile("ads.txt", 'utf8', function (err, data) {
            if (err) throw err;
            const lines = data.split('\n');
            var random = lines[Math.floor(Math.random() * lines.length)];

            if (bot.sending) return;
            bot.sending = true;
            bot.chat(random);
        });

        setTimeout(() => {
            bot.sending = false;
        }, 1 * 60 * 1000);
    },  10 * 60 * 1000);

    const queuejoined = new bot.Discord.MessageEmbed()
                        .setDescription(`Bot đang vào server..`)
                        .setColor(0x15ff00);


    const joinedd = new bot.Discord.MessageEmbed()
                        .setDescription(`☘️ Bot đã tham gia vào server. ☘️`)
                        .setColor(0x15ff00);

    if(bot.dev) {
        client.channels.cache.get(bot.defaultChannel).send(joinedd);
        client.channels.cache.get("807045720699830273").send(queuejoined);
    } else {
        client.channels.cache.get(bot.defaultChannel).send(joinedd);
        
        setTimeout(() => {
            var guild = client.guilds.cache.map(guild => guild.id);
            setInterval(() => {
                if (guild[0]) {
                    const line = guild.pop()
                    const data = new bot.Scriptdb(`./data/guilds/setup-${line}.json`);
                    const checkdata = data.get('livechat');

                    if(checkdata == undefined || guild == undefined) return;

                    try {
                        client.channels.cache.get(checkdata).send(joinedd);
                    } catch(e) {  }
                }
            }, 200);
        }, 100)

        client.channels.cache.get("806881615623880704").send(queuejoined)
    }
}