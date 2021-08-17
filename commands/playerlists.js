var Scriptdb = require('script.db');

module.exports = {
    name: "playerlist",
    aliases: ['playerlist', 'pl'],
    
    async execute(client, message, args) {
        let checkVote = new Scriptdb('./voted.json').get('users-' + new Date().getUTCDate() + (new Date().getUTCMonth()+1) + new Date().getUTCFullYear());

        if(!checkVote || checkVote.split(" ").indexOf(message.author.id) < 0) return message.channel.send("Bạn phải vote bot để sử dụng lệnh này.\n\nVote tại: https://top.gg/bot/768448728125407242/vote");

        var db = new Scriptdb('./data.json');

        var playerArray = db.get('players');

        if(playerArray == null) return message.channel.send("Bot chưa vào server hoặc server không hoạt động.");

        var count = playerArray.length;

        message.channel.send("Đang tính toán...").then(msg => {
            msg.edit("**PLAYER LIST**\n\nTrực tuyến: " + count + "\n\n**Players:** \n" + playerArray.join(', ')).then(msg => msg.delete({ timeout: 60000 }));
        });
    }
}