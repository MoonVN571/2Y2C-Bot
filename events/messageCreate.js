var { Client, Message, MessageEmbed, Permissions, Collection } = require('discord.js');
const cfDir = require('../config.json');
const api = require("../utils");
const timeout = new Collection();
const sendDelay = new Collection();
module.exports = {
    name: 'messageCreate',
    once: false,
    /**
     * 
     * @param {Client} client 
     * @param {Message} message 
     * @returns 
     */
    async execute(client, message) {
        if (message.author.bot || !message.content.startsWith(client.PREFIX) || message.author == client.user || message.channel.type == "dm" || !message.channel) return;

        const args = message.content.slice(client.PREFIX.length).trim().split(/ +/);
        const cmdName = args.shift().toLowerCase();

        const cmd = client.commands.get(cmdName)
            || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(cmdName));

        if (!cmd) return;
        if (cmd.dev && cfDir.DEVELOPERS != message.author.id) return;
        if(!message.guild.me.permissions.has(Permissions.FLAGS.SEND_MESSAGES) || !message.guild.me.permissionsIn(message.channel).has(Permissions.FLAGS.SEND_MESSAGES)) return;
        
        if (cmd.admin && !message.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) return;

        /*
        if (cmd.vote) {
            let checkVote = new Scriptdb('./voted.json').get(message.author.id);

            if ((!checkVote || Date.now() - checkVote > ms("2d")) && message.author.id !== cfDir.DEVELOPERS)
                return message.reply({ content: "Bạn phải vote bot để sử dụng lệnh này.\n\nVote tại: https://top.gg/bot/768448728125407242/vote", allowedMentions: { repliedUser: false } });
        } */

        if (cmd.delay) {
            if (timeout.get(`${message.author.id}.${cmd.name}`) - Date.now() < 0 || !timeout.get(`${message.author.id}.${cmd.name}`)) {
                timeout.delete(`${message.author.id}.${cmd.name}`);
                sendDelay.delete(`${message.author.id}`);
            }

            let calc = api.ageCalc(timeout.get(`${message.author.id}.${cmd.name}`) - Date.now());

            if (timeout.get(`${message.author.id}.${cmd.name}`) && calc && !sendDelay.get(`${message.author.id}`)) return message.reply({
                embeds: [{
                    description: `Hãy chờ \`\`${calc}\`\` để tiếp tục dùng lệnh này.`,
                    color: client.config.ERR_COLOR
                }]
            });

            if(sendDelay.get(`${message.author.id}`)) return;

            setTimeout(() => {
                timeout.delete(`${message.author.id}.${cmd.name}`)
                sendDelay.delete(`${message.author.id}`);
            }, cmd.delay * 1000);

            sendDelay.set(`${message.author.id}`, true);
            timeout.set(`${message.author.id}.${cmd.name}`, Date.now() + cmd.delay * 1000);
        }
        
        // client.sendLog(`[${new Date().toLocaleString('vi-VN')}] ${message.guild.name} - ${message.guildId} | ${message.channel.name} | ${message.author.tag} - ${message.author.id} : ${cmd.name}`);

        function userNotFound() {
            message.reply({
                embeds: [new MessageEmbed()
                    .setDescription('Không tìm thấy người chơi.')
                    .setColor('0xC51515')
                ], allowedMentions: { repliedUser: false }
            });
        }
        message.userNotFound = userNotFound;

        client.inputUsername = new MessageEmbed()
            .setDescription('Hãy nhập tên người dùng.')
            .setColor('0xC51515');
        
        try {
            cmd.execute(client, message, args);
        } catch (err) {
            console.log(cmdName);
            console.log(err);
        }
    }
}