var check = false;

var a = require('../api');
var api = new a();

module.exports = (bot, client, data) => {
    if(check) return;
    check = true;
    var header = data.header;
    if(header.toString().includes("2YOUNG")) {
        bot.lobby = false;
    }
    
    setTimeout(() => {
        check = false;
    }, 3 * 60 * 1000);

    if(bot.lobby) return;
    var footer = data.footer;
    
    setTimeout(() => {
        var ss1 = footer.replace(/\\n/ig, " ");
        var ss2 = ss1.replace(/-/ig, "");
        var ss3 = ss2.replace(/§c|§e|§3|§d|§a|§r/ig, "");
        var ss4 = ss3.replace(/{"text":"/ig, "")

        // replace all space to none
        var ss5 = ss4.replace("    ", " ")
        var ss6 = ss5.replace("    ", " ")
        var data = ss6.split(" ")[1];
        if (tps === undefined || tps === "§6Donate" || tps === "§6bạn") {
            tps = 0;
        }

        var tps = data;

        if(tps.startsWith("*")) {
            tps = data.replace("*", "")
        }

        var status = "TPS: " + tps + " - Chờ: " + + " - Ưu Tiên: " + + " | $help";
        if(status.startsWith("§6Donate")) return;
        client.user.setActivity(status, { type: 'PLAYING' });
    }, 5 * 1000)
}