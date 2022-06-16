module.exports = {
    name: "bestping",
    description: "Xem người chơi ping tốt nhất",
    aliases: ['bp'],
    
    execute(bot, username, args) {
        let arr = Object.values(bot.players).map(p => p.ping + " " + p.username).filter(d => d.split(" ")[0] !== "0");

        arr.sort((a, b) => b.split(" ")[0] - a.split(" ")[0]);

        let after = arr.slice(arr.length - 1);
        bot.whisper(username, "> Ping thấp nhất là " + after.toString().split(" ")[1] + " với " + after.toString().split(" ")[0] +"ms.");
    }
}