var Api = require('../api');

const log = require('../log');

const Topgg = require('@top-gg/sdk')
const { AutoPoster } = require('topgg-autoposter')
const express = require('express')

const { Collection } = require('discord.js');

var Scriptdb = require('script.db');


module.exports = {
	name: 'ready',
    once: true,
    execute(client) {
        client.commands = new Collection();
        require('../handlers/command')(client);

        if(!client.dev) {
            const app = express()
            
            const webhook = new Topgg.Webhook(client.config.TOPGG_AUTH)
            
            AutoPoster(client.config.TOPGG_TOKEN, client).on('posted', () => console.log('Posted stats to Top.gg!'));
    
            app.post('/dblwebhook', webhook.listener(vote => {
                let data = new Scriptdb('./voted.json');
                
                if(!data.get("users-" + new Date().getUTCDate() + (new Date().getUTCMonth()+1) + new Date().getUTCFullYear())) {
                    data.set('users-' + new Date().getUTCDate() + (new Date().getUTCMonth()+1) + new Date().getUTCFullYear(), vote.user);
                } else {
                    data.set('users-' + new Date().getUTCDate() + (new Date().getUTCMonth()+1) + new Date().getUTCFullYear(), vote.user + " " + data.get('users-' + new Date().getUTCDate() + (new Date().getUTCMonth()+1) + new Date().getUTCFullYear()));
                }

                client.channels.cache.get('862215076698128396').send({embed: {
                    description: "**<@" + vote + ">** đã vote bot lúc: " + new Api().getTime(Date.now()),
                    color: client.config.DEF_COLOR
                }});
            }));

            app.listen(3000);
        }
    
        
        client.user.setActivity("RESTARTING", { type: 'PLAYING' });
        
        setTimeout(() => client.user.setActivity("Idling", { type: 'PLAYING' }), 10 * 1000);
    
        console.log('------------------------');
        console.log('       Moon Bot         ')
        console.log('------------------------');
        console.log('Guilds: ' + client.guilds.cache.size);
        console.log('Channels: ' + client.channels.cache.size);
        console.log('Total users: ' + client.guilds.cache.reduce((a, g) => a + g.memberCount, 0));
        console.log('------------------------');
    
        console.log('Bot started!');
        console.log('Developer: ' + client.dev.toString().replace(/t/, "T").replace(/f/, "F"));
        
        log("Ready!");
        
        new Api().clean();
        
        // started notify
        client.guilds.cache.forEach((guild) => {
            const data = new Scriptdb(`./data/guilds/setup-${guild.id}.json`);
            const checkdata = data.get('livechat');
    
            if(checkdata == undefined || guild == undefined) return;
    
            if(client.dev) return;

            try {
                client.channels.cache.get(checkdata).send({embeds: [{
                    description: "Đang khởi động lại bot.",
                    color: 0x15ff00
                }]});
            } catch(e) {}
        });
    
        if(client.dev) return;
    
        // guild count
        client.channels.cache.get('856516410750664764').setName('Total Guilds: ' +  client.guilds.cache.size);
        client.channels.cache.get('856517492372668426').setName('Total Channels: ' +  client.channels.cache.size);
        client.channels.cache.get('856517721122406430').setName('Total Users: ' + client.guilds.cache.reduce((a, g) => a + g.memberCount, 0));
        setInterval(() => {
            client.channels.cache.get('856516410750664764').setName('Total Guilds: ' +  client.guilds.cache.size);
            client.channels.cache.get('856517492372668426').setName('Total Channels: ' +  client.channels.cache.size);
            client.channels.cache.get('856517721122406430').setName('Total Users: ' +  client.guilds.cache.reduce((a, g) => a + g.memberCount, 0));
        }, 30 * 60 * 1000);
    
        // restart since
        var today = new Date()
        let day = ("00" + today.getDate()).slice(-2)
        let month = ("00" + (today.getMonth() + 1)).slice(-2)
        let hours = ("00" + today.getHours()).slice(-2)
        let min = ("00" + today.getMinutes()).slice(-2)
    
        var date = hours + ':' + min + " " + day + '/' + month;
        client.channels.cache.get('856522329672515614').setName('Restart At: ' + date);
    }
}