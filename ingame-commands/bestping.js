module.exports = {
    name: "bestping",
    description: "Xem người chơi ping tốt nhất",
    aliases: ['bp'],
    
    execute(bot, username, args) {
        var oldArr = [];

        Object.values(bot.players).map(p => oldArr.push(p.ping + " " + p.username));

        var arr = [];
        
        oldArr.forEach(value => {
            if(value.split(" ")[0] !== "0") arr.push(value) 
        })

        arr.sort((a, b) => b.split(" ")[0] - a.split(" ")[0]);

        var after = arr.slice(arr.length - 1);

        bot.whisper(username, "> Ping thấp nhất là " + after.toString().split(" ")[1] + " với " + after.toString().split(" ")[0] +"ms.")
    }
}