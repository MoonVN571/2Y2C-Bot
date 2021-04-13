var check = false;

var Scriptdb = require('script.db');

module.exports = (bot, client, data) => {
    var header = data.header;
    if(header.toString().includes("2YOUNG")) {
        bot.lobby = false;
    }
    
    if(check) return;
    check = true;

    setTimeout(() => { check = false }, 3 * 60 * 1000)

    if(bot.lobby) return;

    var footer = data.footer;
    var ss1 = footer.replace(/\\n/ig, " ");
    var ss2 = ss1.replace(/-/ig, "");
    var ss3 = ss2.replace(/§e|§c|§3|§6|§d|§a|§r/ig, "");
    var ss4 = ss3.replace(/{"text":"/ig, "")

    var ss5 = ss4.replace('    ', " - ")
    var ss6 = ss5.replace('    ', " - ")
    var ss7 = ss6.replace('    ', " - ")
    var ss8 = ss7.split('§7')[0]

    var status = ss8;

    if(ss8.startsWith(" *")) {
        status = ss8.replace(" *", "")
    }

    const dataa = new Scriptdb(`./data.json`);

    dataa.set('tab-content', status + " | " + Date.now());

    /*
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
    } */
}