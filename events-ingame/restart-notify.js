module.exports = (bot, client, username, msg) => {
    var message = msg.toString();
    if(bot.dev) return;

    if(username !== "SERVER") return;

    if(message === "Server restarting in 15 minutes...") {
        if(!bot.restarts15m) {
            bot.restarts15m = true;
            client.channels.cache.get('803597345275117589').send("@everyone " + message);
        }
    }

    if(message === "Server restarting in 5 minutes...") {
        if(!bot.restarts5m) {
            bot.restarts5m = true;
            client.channels.cache.get('803597345275117589').send("@everyone " + message);
        }
    }
    
    if(message === "Server restarting in 15 seconds...") {
        client.channels.cache.get('803597345275117589').send("@everyone " + message);
    }

    if (message === "Server restarting...") {
        client.channels.cache.get('803597345275117589').send("Bot đã ngắt kết nối: " + msg);
    }
}