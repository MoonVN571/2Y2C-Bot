module.exports = (bot, client, p) => {
    var username = p.username;
    var newUsername = username.replace(/_/ig, "\\_");

    if(bot.debug) {
        console.log(username + " left")
    }

    if (username === "Ha_My" || username === "PhanThiHaMy") {
        if(bot.dev) return;
        client.channels.cache.get("807048523027578890").send(username + " left");
    }

    if (newUsername === undefined) {
        newUsername = username;
    }

    if(bot.countPlayers <= Object.values(bot.players).map(p => p.username).length) return;

    check(username, newUsername);
    function check(username, newUsername) {
        if(newUsername == undefined) {
            newUsername = username;
        }
        bot.fs.readFile("special-join.txt", 'utf8', (err, data) => {
            if (err) throw err;
            if(data.toString().split('\r\n').toString().includes(username)) {
                if(bot.dev) return;
                var embed = new client.Discord.MessageEmbed()
                                        .setDescription(newUsername + " left")
                                        .setColor('0xb60000')

                if(bot.dev) return;
                client.channels.cache.get("807506107840856064").send(embed); // special channel
            }
        });
    }

    if(username == "MoonZ" || username == "LinhLinh" || username == "bachbach") {
        var embed = new bot.Discord.MessageEmbed()
            .setDescription("[STAFF] " + newUsername + " left")
            .setColor('0xb60000')

        if(bot.dev) return;
        client.channels.cache.get("826280327998996480").send(embed);
    }

    var embed = new bot.Discord.MessageEmbed()
                        .setDescription(newUsername + " left")
                        .setColor('0xb60000')

    client.channels.cache.get(bot.defaultChannel).send(embed).then(() => {
        if(bot.dev) return;
        client.channels.cache.get("816695017858531368").send(embed)
    });
}