module.exports = (bot, logger) => {
    config =  {
        command: "tps",
        path: "tps.js",
        aliases: "tickpersecond, 1"
    }

    var o = false;
    bot._client.on("playerlist_header", data => {
        if(lobby) {
            bot.whisper(username, "Không khả dụng ngay lúc này.")
            return;
        }
        if(o) return;
        o = true;
        setTimeout(() => {
            var footer = data.footer;
            var ss1 = footer.replace(/\\n/ig, " ");
            var ss2 = ss1.replace(/-/ig, "");
            var ss3 = ss2.replace(/§3|§d|§a|§r/ig, "");
            var ss4 = ss3.replace(/{"text":"/ig, "")

            // replace all space to none
            var ss5 = ss4.replace("    ", " ")
            var ss6 = ss5.replace("    ", " ")
            var tps = ss6.split(" ")[1];
            bot.whisper(username, "TPS: " + tps + " - TAB")
            
        }, 2*1000);
    });
    o = false;


}