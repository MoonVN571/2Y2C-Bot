const { MessageEmbed, Permissions } = require('discord.js');
const { readdirSync, readdir } = require('fs');
const Scriptdb = require("script.db");
module.exports = {
    name: "help",
    description: "Xem lệnh hướng dẫn",
    aliases: ['help'],
    vote: true,
    delay: 5,

    async execute(client, message, args) {
        if (args[0]) {
            const cmdEmbed = new MessageEmbed().setColor(client.config.DEF_COLOR).setTimestamp();

            const getCMD = client.commands.get(args[0])
                || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(args[0]));

            if (!getCMD) return message.reply({
                embeds: [{
                    title: "Lỗi",
                    description: "Không tìm thấy lệnh bạn đã nhập.",
                    color: client.config.ERR_COLOR
                }], allowedMentions: { repliedUser: false }
            });

            if (getCMD.name) {
                readdirSync('./commands').forEach(dir => {
                    readdir(`./commands/${dir}`, async (err, files) => {
                        if (err) throw err;

                        if (files.find(f => f.split('.')[0] == getCMD.name)) {
                            const cmd = require(`../../commands/${dir}/${getCMD.name}`);

                            if (cmd.name) cmdEmbed.setTitle("Lệnh " + args[0]);
                            if (cmd.aliases) cmdEmbed.addField("Lệnh rút gọn", cmd.aliases.join(", "), true);
                            if (cmd.description) cmdEmbed.addField("Công dụng lệnh", cmd.description, true);

                            if (cmd.name) return await message.reply({ embeds: [cmdEmbed] });

                            if (!cmd.name || cmd.dev) return message.reply({
                                embeds: [{
                                    title: "Lỗi",
                                    description: "Không tìm thấy lệnh bạn đã nhập.",
                                    color: client.config.ERR_COLOR
                                }]
                            });

                            if (!cmd.admin && !message.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) return message.reply({
                                embeds: [{
                                    title: "Lỗi",
                                    description: "Bạn phải là admin để xem thông tin lệnh này.",
                                    color: client.config.ERR_COLOR
                                }], allowedMentions: { repliedUser: false }
                            });
                        }
                    });
                });
            } else {
                message.reply({
                    embeds: [{
                        title: "Lỗi",
                        description: "Không tìm thấy lệnh bạn đã nhập.",
                        color: client.config.ERR_COLOR
                    }]
                });
            }
            return;
        }

        let totalCommands = 0;
        readdirSync('./commands/').forEach(async dir => {
            const commands = readdirSync(`./commands/${dir}/`).filter(file => file.endsWith('.js'));

            commands.forEach((file) => {
                const pull = require(`../../commands/${dir}/${file}`);
                if (pull.name) totalCommands++;
            });
        });

        let totalIgCmd = 0;
        readdirSync('./ingame-commands/').forEach(cmd => {
            totalIgCmd++;
        });

        const defaultEmbed = new MessageEmbed()
            .setAuthor("Help Commands", message.guild.iconURL())
            .setDescription(`\u300B Hãy gõ **${client.PREFIX}help <tên lệnh>** để biết thêm thông tin!\n\u300BTổng **${totalCommands}** lệnh có sẵn và trong server có **${totalIgCmd}** lệnh.\u200b\n\u200b`)
            .setTimestamp()
            .setColor(client.config.DEF_COLOR)
            .setThumbnail(client.user.avatarURL())

        readdirSync('./commands/').forEach(async dir => {
            const commands = readdirSync(`./commands/${dir}/`).filter(file => file.endsWith('.js'));

            let cmds = [];
            commands.forEach((file) => {
                const pull = require(`../../commands/${dir}/${file}`);
                if (pull.name) cmds.push(pull.name);
            });

            defaultEmbed.addField(dir + ` [${cmds.length}]:`, "``" + cmds.join("``, ``") + "``");
        });

        await message.reply({ embeds: [defaultEmbed], allowedMentions: { repliedUser: false } }).then(() => {
            let data = new Scriptdb('./footer.json');
            if (!data.get("text")) return;
            message.channel.send(data.get("text"));
        });
    }
}