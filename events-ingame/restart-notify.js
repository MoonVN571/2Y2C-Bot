module.exports = (bot, client, msg) => {
    var message = msg.toString();
    if(bot.dev) return;

    if(message === "[SERVER] Server restarting in 15 minutes...") {
        if(!bot.restarts15m) {
            bot.restarts15m = true;
            client.channels.cache.get('803597345275117589').send("@everyone " + message);
        }
    }

    if(message === "[SERVER] Server restarting in 5 minutes...") {
        if(!bot.restarts5m) {
            bot.restarts5m = true;
            client.channels.cache.get('803597345275117589').send("@everyone " + message);
        }
    }
    
    if( message === "[SERVER] Server restarting in 15 seconds...") {
        client.channels.cache.get('803597345275117589').send("@everyone " + message);
    }

    if (msg === "Server restarting...") {
        client.channels.cache.get('803597345275117589').send("Tin nhắn sau cùng server khởi động lại: " + msg);
    }
}