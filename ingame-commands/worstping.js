module.exports = {
    name: "worstping",
    description: "Xem người chơi ping cao nhất",
    aliases: ['wp'],
    
    execute(bot, username, args) {
        var arr = Object.values(bot.players).map(p => p.ping + " " +p.username);

        arr.sort((a, b) => b.split(" ")[0] - a.split(" ")[0]);

        if(arr.length > 1) arr = arr.slice(0, 1);

        bot.whisper(username, "> Ping cao nhất là " + arr.toString().split(" ")[1] + " với " + arr.toString().split(" ")[0] +"ms.")
    }
}