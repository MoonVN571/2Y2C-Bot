module.exports = {
    name: "coords",
    description: "coords command.",
    aliases: ['coords', 'xyz', 'coordinate'],
    
    async execute(bot, username, logger, args) {
        var pos = bot.entity.position;
        var str = pos.toString().split("(")[1].split(")")[0];
        var x = parseInt(str.split(" ")[0]);
        var y = parseInt(str.split(" ")[1]);
        var z = parseInt(str.split(" ")[2]);

        bot.whisper(username, `> X: ${x} Y: ${y} Z: ${z}`);
    }
}