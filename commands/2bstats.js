var superagent = require('superagent');
var Discord = require('discord.js');

module.exports = {
    name: "2bstats",
    aliases: ['2bkd'],
    
    async execute(client, message, args) {
        if (!args[0]) return message.channel.send(client.userNotFound);

        superagent.get("https://api.2b2t.dev/stats?username=" + args[0]).end((err, data) => {
            if(data.body[0] == undefined) return message.channel.send(client.userNotFound)

            let joins = data.body[0].joins
            let leaves = data.body[0].leaves
            let deads = data.body[0].deaths
            let kills = data.body[0].kills

            if (kills === undefined) { kills = 0 }

            if (deads === undefined) { deads = 0 }

            var ratio = kills / deads;
            var ratioFixed = ratio.toFixed(2);

            if (ratioFixed === "NaN" || ratioFixed === "Infinity") {
                ratioFixed = "0.00";
            }

            var embed = new Discord.MessageEmbed()
                            .setAuthor(`${args[0]}'s statistics`, `https://minotar.net/helm/${args[0]}`, `https://namemc.com/${args[0]}`)
                            .addField(`Kills`, `${kills}`, true)
                            .addField(`Deaths`, `${deads}`, true)
                            .addField(`K/D Ratio`, `${ratioFixed}`, true)
                            .addField(`Joins`, `${joins}`, true)
                            .addField(`Leaves`, `${leaves}`, true)
                            .setThumbnail(`https://minotar.net/armor/bust/${args[0]}`)
                            .setColor(0x2EA711)
                            .setFooter("API by LoLRiTTeR Bot", 'https://images-ext-2.discordapp.net/external/OWsrCus2cCb9txmasSQQ8UqxrkbIxM2f1VotLB8aX14/https/cdn.discordapp.com/avatars/521791765989031957/6e34a1a33d255339aa45c731637a51f8.png')
                            .setTimestamp();

            message.channel.send(embed);
		});
    }
}