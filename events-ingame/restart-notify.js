module.exports = (bot, client, username, msg) => {
    var message = msg.toString();
    if(bot.dev) return;

    if(username !== "AutoRestart") return;

    if (message === "Server Restarting!") {
        client.channels.cache.get('803597345275117589').send("[AutoRestart] Server Restarting!");
    }
}