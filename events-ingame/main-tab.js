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
        }, 5 * 60 * 1000);

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
        var queue = dataa.get('queue');
        var prio = dataa.get('prio');

        if(queue == undefined) queue = -1;
        if(prio == undefined) prio = -1;

        var status = "TPS: " + tps + " - Queue: " + queue + " - Prio: " + prio + " | $help for cmds";
        if(status.startsWith("§6Donate")) return;
        
        client.user.setActivity(status, { type: 'PLAYING' });
        log("Set user status on main server");
    }
}