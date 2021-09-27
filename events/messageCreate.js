var { Client, Message, MessageEmbed, Permissions, Collection } = require('discord.js');
const Scriptdb = require('script.db');
const cfDir = require('../config.json');
const api = require("../utils");
const ms = require('ms');

const timeout = new Collection();
module.exports = {
    name: 'messageCreate',
    once: false,
    /**
     * 
     * @param {Client} client 
     * @param {Message} message 
     * @returns 
     */
    execute(client, message) {
        if (message.author.bot || !message.content.startsWith(client.PREFIX) || message.author == client.user || message.channel.type == "dm" || !message.channel || !message.channel.isText()) return;

        client.sendLog(`[${new Date().toLocaleString()}] ${message.guild.name} | ${message.channel.name} | ${message.author.tag} - ${message.author.id}\nMessage: ${message.content}`);
        var args = message.content.slice(client.PREFIX.length).split(/ +/);

        if (args[0] == "") args = args.slice(1);
        if (!args.length) return;

        const cmdName = args.shift().toLowerCase();

        const cmd = client.commands.get(cmdName)
            || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(cmdName));

        if (!cmd) return;

        if (cmd.dev && cfDir.DEVELOPERS != message.author.id) return;

        if(!message.guild.me.permissions.has(Permissions.FLAGS.SEND_MESSAGES) || !message.guild.me.permissionsIn(message.channel).has(Permissions.FLAGS.SEND_MESSAGES)) {
            client.sendError(`${message.guild.name} - ${message.guildId}  - No perm to chatting`);
            message.author.send("Hãy cấp quyền cho mình chat!").catch(err => {
                console.log(err);
                client.sendError(`${message.guild.name} - ${message.guildId} : Không thể gửi tin nhắn cho author.\n${err.message || err.toString()}\n\n${err}`);
            });
            return;
        }

        if (cmd.admin && !message.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) return message.reply({
            embeds: [{
                title: "Không đủ quyền",
                description: "Bạn phải là ``ADMINISTRATOR`` để sử dụng lệnh này.",
                timestamp: new Date(),
                color: client.config.ERR_COLOR
            }]
        });

        /*
        if (cmd.vote) {
            let checkVote = new Scriptdb('./voted.json').get(message.author.id);

            if ((!checkVote || Date.now() - checkVote > ms("2d")) && message.author.id !== cfDir.DEVELOPERS)
                return message.reply({ content: "Bạn phải vote bot để sử dụng lệnh này.\n\nVote tại: https://top.gg/bot/768448728125407242/vote", allowedMentions: { repliedUser: false } });
        } */

        if (cmd.delay) {
            let cmdDelay = client.commands.get(cmdName);
            if (!cmdDelay) cmdDelay = client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(cmdName));

            if (timeout.get(`${message.author.id}.${cmdDelay.name}`) - Date.now() < 0 || !timeout.get(`${message.author.id}.${cmdDelay.name}`)) timeout.delete(`${message.author.id}.${cmdDelay.name}`);

            let calc = api.ageCalc(timeout.get(`${message.author.id}.${cmdDelay.name}`) - Date.now());

            if (timeout.get(`${message.author.id}.${cmdDelay.name}`) && calc) return message.reply({
                embeds: [{
                    description: `Hãy chờ \`\`${calc}\`\` để tiếp tục dùng lệnh này.`,
                    color: client.config.ERR_COLOR
                }]
            });

            setTimeout(() => timeout.delete(`${message.author.id}.${cmdDelay.name}`), cmdDelay.delay * 1000);
            timeout.set(`${message.author.id}.${cmdDelay.name}`, Date.now() + cmdDelay.delay * 1000);
        }

        
        if(cfDir.USERS_BLACKLISTS.indexOf(message.author.id) > -1) return message.reply({content: "Bạn nằm trong sách đen của bot!", allowedMentions: { repliedUser: false }});
        if(cfDir.GUILDS_BLACKLISTS.indexOf(message.guild.id) > -1) return message.reply({content: "Server này nằm trong sách đen của bot!", allowedMentions: { repliedUser: false }});

        function userNotFound() {
            message.reply({
                embeds: [new MessageEmbed()
                    .setDescription('Không tìm thấy người chơi.')
                    .setColor('0xC51515')
                ], allowedMentions: { repliedUser: false }
            });
        }

        function provideUser() {
            message.reply({
                embeds: [new MessageEmbed()
                    .setDescription('Cung cấp người cần xem thông tin.')
                    .setColor('0xC51515')
                ], allowedMentions: { repliedUser: false }
            });
        }

        message.userNotFound = userNotFound;
        message.provideUser = provideUser;

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