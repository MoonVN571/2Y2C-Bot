var check = false;

module.exports = (bot, client, data) => {
    var header = data.header;
    if(header.toString().includes("2YOUNG")) {
        bot.lobby = false;
    }
    
    if(check) return;
    check = true;

    setTimeout(() => { check = false }, 3 * 60 * 1000)

    if(bot.lobby) return;

    if(bot.debug) { console.log("Check server data") }

    var footer = data.footer;
    var ss1 = footer.replace(/\\n/ig, " ");
    var ss2 = ss1.replace(/-/ig, "");
    var ss3 = ss2.replace(/§e|§c|§3|§6|§d|§a|§r/ig, "");
    var ss4 = ss3.replace(/{"text":"/ig, "")

    var ss5 = ss4.replace('    ', " - ")
    var ss6 = ss5.replace('    ', " - ")
    var ss7 = ss6.replace('    ', " - ")
    var ss8 = ss7.split('§7')[0];
    
    var formatMinutes;
    if(bot.minutess == 0) {
        formatMinutes = "";
    } else {
        formatMinutes = bot.minutess + " phút ";
    }

    var format;
    if(bot.hourss == 0) {
        format =  formatMinutes;
    } else {
        format = bot.hourss + " giờ " + formatMinutes;
    }

    if(bot.minutess == 0 && bot.hourss == 0) {
        format = "vài giây ";
    }

    var topics = ss8 + " - Tham gia server từ " + format + "trước.";
    const dataa = new bot.Scriptdb(`./data.json`);

    dataa.set('tab-content', ss8 + " | " + Date.now());

    if(topics !== undefined) {
        client.channels.cache.get(bot.defaultChannel).setTopic(topics)
        setTimeout(() => {
			var guild = client.guilds.cache.map(guild => guild.id);
			setInterval(() => {
				if (guild[0]) {
					const line = guild.pop()
					const data = new bot.Scriptdb(`./data/guilds/setup-${line}.json`);
					const checkdata = data.get('livechat');

                    if(guild == undefined || checkdata == undefined) return;
                    
					try {
                        client.channels.cache.get(checkdata).setTopic(topics)
					} catch(e) {  }
				}
			}, 200);
		}, 100)
    }
}