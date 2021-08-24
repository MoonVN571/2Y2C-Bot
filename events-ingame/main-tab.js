var check = false;

var Scriptdb = require('script.db');
var log = require('../log');


module.exports = {
	name: 'playerlist_header',
	once: false,
    other: true,
	execute(bot, client, data) {
        if(check) return;
        check = true;
        var header = data.header;

        if(header.toString().includes("2YOUNG")) {
            bot.lobby = false;
        }
        
        setTimeout(() => {
            check = false;
        }, 60 * 1000);

        if(bot.lobby) return;
        var footer = data.footer;
        
        var ss1 = footer.replace(/\\n/ig, " ");
        var ss2 = ss1.replace(/-/ig, "");
        var ss3 = ss2.replace(/§c|§e|§3|§d|§a|§r/ig, "");
        var ss4 = ss3.replace(/{"text":"/ig, "")

        var ss5 = ss4.replace("    ", " ")
        var ss6 = ss5.replace("    ", " ")
        var data = ss6.split(" ")[1];
        if (tps === undefined || tps === "§6Donate" || tps === "§6bạn") tps = 0;

        var tps = data;

        if(tps.startsWith("*")) tps = data.replace("*", "")

        var dataa = new Scriptdb('./data.json');
        var queue = dataa.get('queue') || 0;
        var prio = dataa.get('prio') || 0;

        var headerr =  header.toString().split("§r§6")[1].split(/\\n/ig)[0];
        dataa.set('server-motd', headerr);

        if(queue == String) queue = queue.split(" ")[0];
        if(prio == String) prio = prio.split(" ")[0];

        var status = "TPS: " + tps + " - Queue: " + queue.split(" ")[0] + " - Prio: " + prio.split(" ")[0] + " | Prefix: $";
        if(status.startsWith("§6Donate")) return;
        
        client.user.setActivity(status, { type: 'PLAYING' });
        log("Set user status on main server");
    }
}