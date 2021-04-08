module.exports = {
    name: "delete",
    description: "delete command.",
    aliases: [''],
    
    async execute(client, message, args) {
        if (!message.member.hasPermission('ADMINISRTATOR')) return message.channel.send("Không có quyền để dùng lệnh này.")

        var prefix = client.prefix;
            

        if(!args[0]) return message.channel.send("Cách dùng: " + prefix + "setup chat <tag hoặc nhập id kênh>");
		
		if(!args[1]) return message.channel.send("Cách dùng: " + prefix + "setup <chat hoặc commands> <tag hoặc nhập id kênh>");

        if(args[0] === 'chat') {
            var channel;
			channel = message.content.replace(/\D/g,'');
			if(channel === "") {
				channel = args[2];
			}

            var guild = message.guild.id;
            const data = new Scriptdb(`./data/guilds/setup-${guild}.json`);
            const checkdata = data.get('livechat')
            
            if(data == null) return;
            if(newdata == data) return message.channel.send("Không tìm thấy kênh.")

            if(channel !== "NaN") {
                message.channel.send("Bạn đã xoá chat tại channel: " + channel.toString())
            } else {
                message.channel.send("Bạn đã xoá chat tại channel: " + channel)
            }
        }
    }
}