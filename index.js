/**
 * 			MOON BOT 2Y2C
 * 
 * Mã nguồn cde được viết dựa trên cảm hứng từ server 2B2T. Ban đầu là
 * bot chỉ dự định dùng để xem hàng chờ của 2b2t. Bot minecraft được tạo
 * vào ngày 6/1/2021. Tất cả data của người chơi mà bot có thể đọc được đã
 * được lưu trên 1 VPS và chính là VPS chính để host bot.
 * 
 * Dự án này hiện tại không công khai. Tuy nhiên vẫn có 1-2 người có thể xem
 * được toàn bộ mã nguồn này.
 * 
 * Tuỳ thuộc vào dev. Nếu như không tiếp tục phát triển nữa thì có thể sẽ
 * public mã nguồn của bot.
 * 
 * Copyright © 2020 - 2021 Moon Bot
 */

const { Client, Intents, Collection } = require("discord.js");
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES], retryLimit: 3 });

const { readdirSync } = require('fs');

var mineflayer = require('mineflayer');
var tpsPlugin = require('mineflayer-tps')(mineflayer);
var { pathfinder } = require('mineflayer-pathfinder');

const log = require('./log');
const cfDir = require('./config.json');

var devMode = cfDir.DEV_MODE;
var prefix = cfDir.MAIN.DISCORD_PREFIX;

if (devMode) prefix = cfDir.DEV.DISCORD_PREFIX;

client.dev = devMode;
client.PREFIX = prefix;

require('dotenv').config();
require('./web-panel');
require('./handlers/event')(client);

const config = {
    DEF_COLOR: cfDir.COLORS.DISCORD.DEFAULT,
    ERR_COLOR: cfDir.COLORS.DISCORD.ERROR,
    PROCESS_COLOR: cfDir.COLORS.DISCORD.PROCESS,
    AUTHOR: cfDir.DEVELOPERS,
    TOPGG_TOKEN: process.env.TOPGG_TOKEN,
    TOPGG_AUTH: process.env.TOPGG_AUTH
}

function sendError(desc, error) {
    if(!error) return;
    client.channels.cache.get("886796482538266715").send(desc + "\n\n" + error);
}
client.sendError = sendError;

function sendLog(data) {
    if(!data) return;
    console.log(data);
    client.channels.cache.get("886800209399664640").send(`\`\`\`${data}\`\`\``);
}
client.sendLog = sendLog;


client.config = config;

client.on('ready', () => {
    setTimeout(createBot, 5 * 1000);
});

const notRepeat = new Set();
const delayCheck = new Set();

var defaultChannel = cfDir.MAIN.CHANNEL;
var usernameBot = cfDir.MAIN.USERNAME;
var igPrefix = cfDir.MAIN.IG_PREFIX;

if (devMode) {
    defaultChannel = cfDir.DEV.CHANNEL;
    usernameBot = cfDir.DEV.USERNAME;

    igPrefix = cfDir.DEV.IG_PREFIX;
}

function createBot() {
    console.log('------------------------');

    log("Creating bot and connect to the server...");

    const bot = mineflayer.createBot({
        host: "2y2c.org",
        port: 25565,
        username: usernameBot,
        version: "1.16.5"
    });

    bot.loadPlugin(tpsPlugin);
    bot.loadPlugin(pathfinder);

    bot.defaultChannel = defaultChannel;

    bot.dev = devMode;
    bot.prefix = igPrefix;

    var lobby = true; // Bot in queue
    bot.lobby = lobby;

    var joined = false; // check bot is joined
    bot.joined = joined;

    var haveJoined = false; // check da thay tin dang vao 2y2c chua
    bot.haveJoined = haveJoined;

    var countPlayers = 0;
    bot.countPlayers = countPlayers;

    // cmd  handler
    bot.commands = new Collection();

    const cmds = require('fs').readdirSync(`./ingame-commands/`).filter(file => file.endsWith('.js'));

    for (const file of cmds) {
        const cmd = require(`./ingame-commands/${file}`);

        bot.commands.set(cmd.name, cmd);
    }

    // event handler
    const eventFiles = readdirSync('./events-ingame').filter(file => file.endsWith('.js'));

    for (const file of eventFiles) {
        const event = require(`./events-ingame/${file}`);

        if (event.other && event.once) {
            bot._client.once(event.name, (...args) => event.execute(bot, client, ...args));
        } else if (event.other && !event.once) {
            bot._client.on(event.name, (...args) => event.execute(bot, client, ...args));
        } else {
            if (event.once) {
                bot.once(event.name, (...args) => event.execute(bot, client, ...args));
            } else {
                bot.on(event.name, (...args) => event.execute(bot, client, ...args));
            }
        }
    }

    // Only chat
    client.on('messageCreate', msg => {
        if (msg.author.bot || msg.author == client.user || msg.content.startsWith(prefix)) return;

        if (msg.channel.id === '797426761142632450') { // main
            if (devMode) return;

            setTimeout(() => {
                bot.chat(msg.content);
            }, 1 * 1000);
        }

        if (msg.channel.id === '802456011252039680') {
            if (devMode) return;

            bot.chat(msg.content);
        }

        if (msg.channel.id == defaultChannel) {
            if (msg.content.startsWith(">")) return;

            var content = msg.content;
            if (!content) return;

            let member = msg.guild.members.cache.get(msg.author.id);
            let role = msg.guild.roles.cache.find(r => r.name == "bypass chat");
            if (!member.roles.cache.get(role.id)) {
                if (msg.author.username.length + content.length > 88) return msg.reply("Rút ngắn tin nhắn của bạn lại để có thể gửi.");

                let regex = /[a-z]|[A-Z]|[0-9]/i;

                if (!msg.author.username.match(regex)) return msg.reply("Tên bạn có ký tự đặc biệt. Hãy đặt biệt danh");
            }

            var str = msg.content.split('\n')[0];
            var chat = str.charAt(0).toUpperCase() + str.substr(1);
            var fixes = content.charAt(0).toLowerCase();

            if (msg.content.includes("§") || !fixes) return msg.reply("Kí tự không hợp lệ.");

            if (!chat.endsWith(".")) chat = chat + ".";

            if (delayCheck.has('inQueue')) return;
            if (notRepeat.has(msg.content + " " + msg.author.id)) return;

            let tag = `${member.nickname !== null ? `${member.nickname}` : msg.author.tag}`;
            bot.chat(`[${tag}]  ${chat}`);

            const send = client.emojis.cache.find(emoji => emoji.name === "1505_yes");
            msg.react(send).catch();
        }
    });
}

client.on('messageCreate', msg => {
    if (msg.author.bot || msg.author == client.user || msg.content.startsWith(prefix) || !msg || !msg.channel) return;

    setTimeout(() => {
        try {
            if(!msg.channel.isText()) return;
            if (msg.channel.id == defaultChannel) {
                if (delayCheck.has('inQueue')) return msg.reply("Bạn phải chờ vài giây trước khi tiếp tục chat.");

                delayCheck.add('inQueue');
                setTimeout(() => delayCheck.clear(), 2 * 1000);

                if (notRepeat.has(msg.content + " " + msg.author.id)) return msg.reply("Bạn không được lập lại tin nhắn.");

                notRepeat.add(msg.content + " " + msg.author.id);
                setTimeout(() => notRepeat.delete(msg.content + " " + msg.author.id), 5 * 60 * 1000);
            }
            
        } catch(e) { console.log(e); }
    }, 2 * 1000);
});

module.exports = { createBot };
module.exports = client;

client.login(process.env.TOKEN).catch(err => console.log(err));
