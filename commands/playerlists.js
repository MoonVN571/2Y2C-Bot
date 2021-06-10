var Scriptdb = require('script.db');

module.exports = {
    name: "playerlist",
    aliases: ['playerlist', 'pl'],
    
    async execute(client, message, args) {
        var db = new Scriptdb('./data.json');

        var playerArray = db.get('players');

        if(playerArray == null) return message.channel.send("Bot chưa vào server hoặc server không hoạt động.");

        var count = playerArray.length;

        message.channel.send("Đang tính toán...").then(msg => {
            msg.edit("**PLAYER LIST**\n\nTrực tuyến: " + count + "\n\n**Players:** \n" + playerArray.join(', ')).then(msg => msg.delete({ timeout: 60000 }));
        });
    }
}