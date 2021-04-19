module.exports = (bot, client, username, msg) => {
    var message = msg.toString();
    if(bot.dev) return;

    if(username !== "AutoRestart") return;

    if (message === "Server Restarting!") {
        client.channels.cache.get('795534684967665695').send("@everyone " + message);
    }
}