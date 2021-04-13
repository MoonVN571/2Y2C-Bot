var Scriptdb = require('script.db');

module.exports = {
    name: "delete",
    description: "delete command.",
    aliases: [''],
    
    async execute(client, message, args) {
        if (!message.member.hasPermission('ADMINISRTATOR')) return message.channel.send("Không có quyền để dùng lệnh này.");

        var prefix = client.prefix;
            
        if(!args[0]) return message.channel.send("Cách dùng: " + prefix + "delete chat <tag hoặc nhập id kênh>");
		
		if(!args[1] || args[1] !== "chat") return message.channel.send("Cách dùng: " + prefix + "delete <chat hoặc commands> <tag hoặc nhập id kênh>");

        if(args[0] === 'chat') {
            var channel;
			channel = message.content.replace(/\D/g,'');
			if(channel === "") {
				channel = args[2];
			}

            var guild = message.guild.id;
            const data = new Scriptdb(`./data/guilds/setup-${guild}.json`);
            
            if(data == null) return message.channel.send("Không tìm thấy kênh đã setup.");
            if(newdata == data) return message.channel.send("Không tìm thấy kênh.");

            if(channel !== "NaN") {
                message.channel.send("Bạn đã xoá chat tại channel: " + args[1]);
                data.delete('livechat');
            } else {
                message.channel.send("Bạn đã xoá chat tại channel: " + channel);
                data.delete('livechat');
            }
        }
    }
}