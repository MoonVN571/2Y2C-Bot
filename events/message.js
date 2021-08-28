var { MessageEmbed, Permissions, Collection } = require('discord.js');
const Scriptdb = require('script.db');

const cfDir = require('../config.json');
const Api =  require("../api");
const ms = require('ms');

const timeout = new Collection();

module.exports = {
	name: 'messageCreate',
	once: false,
	execute(client, message) {
        if(message.author.bot || !message.content.startsWith(client.PREFIX) || message.author == client.user || message.channel.type == "dm") return;
        
        console.log(`[${new Date().toLocaleString()}] Guild: ${message.guild.name} || Channel: ${message.channel.name} || Usage: ${message.author.tag} - ${message.author.id}\nMessage: ${message.content}`);

        var args = message.content.slice(client.PREFIX.length).split(/ +/);
    
        if(args[0] == "") args = args.slice(1);
        if(!args.length) return;

        const cmdName = args.shift().toLowerCase();

        const cmd = client.commands.get(cmdName)
            || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(cmdName));

        if(!cmd) return;

        if(cmd.dev && cfDir.DEVELOPERS != message.author.id) return;

        if(cmd.admin && !message.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) return message.reply({embeds: [{
            title: "Không đủ quyền",
            description: "Bạn phải là ``ADMINISTRATOR`` để sử dụng lệnh này.",
            timestamp: new Date(),
            color: client.config.ERR_COLOR
        }]});

        if(cmd.vote) {
            let checkVote = new Scriptdb('./voted.json').get(message.author.id);

            if(!checkVote || Date.now() - checkVote > ms("2d") && message.author.id != cfDir.DEVELOPERS) 
                return message.channel.send("Bạn phải vote bot để sử dụng lệnh này.\n\nVote tại: https://top.gg/bot/768448728125407242/vote");
        }
        
        if(cmd.delay) {
            let cmdDelay = client.commands.get(cmdName);
            if(!cmdDelay) cmdDelay = client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(cmdName));

            if(timeout.get(`${message.author.id}.${cmdDelay.name}`) - Date.now() < 0 || !timeout.get(`${message.author.id}.${cmdDelay.name}`)) timeout.delete(`${message.author.id}.${cmdDelay.name}`); 

            let calc = new Api().calculate(timeout.get(`${message.author.id}.${cmdDelay.name}`) - Date.now());
            
            if(timeout.get(`${message.author.id}.${cmdDelay.name}`) && calc) return message.reply({embeds: [{
                description: `Hãy chờ \`\`${calc}\`\` để tiếp tục dùng lệnh này.`,
                color: client.config.ERR_COLOR
            }]});

            setTimeout(() => timeout.delete(`${message.author.id}.${cmdDelay.name}`), cmdDelay.delay * 1000);
            timeout.set(`${message.author.id}.${cmdDelay.name}`, Date.now() + cmdDelay.delay * 1000);
        }

        client.userNotFound = new MessageEmbed()
                        .setDescription('Không tìm thấy người chơi.')
                        .setColor('0xC51515');
            
        client.inputUsername = new MessageEmbed()
                        .setDescription('Hãy nhập tên người dùng.')
                        .setColor('0xC51515');
        try {
            cmd.execute(client, message, args);
        }catch(err) {
            console.log(cmdName);
            console.log(err);
        }
    }
}