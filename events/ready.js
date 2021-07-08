var main = require('../index');

var e = require('../gotEvent');
var event = new e();

var a = require('../api');
var api = new a();

const log = require('../log');

const Topgg = require('@top-gg/sdk')
const { AutoPoster } = require('topgg-autoposter')
const express = require('express')

const { unlink  } = require('fs');
var Scriptdb = require('script.db');

const top = require('top.gg-core');

module.exports = {
	name: 'ready',
	once: false,
	execute(client) {
        const topgg = new top.Client(client.config.tggtoken);

        if(client.config.dev !== "true") {
            const app = express() // Your express app
            
            const webhook = new Topgg.Webhook(client.config.authtoken) // add your Top.gg webhook authorization (not bot token)
            
            AutoPoster(client.config.tggtoken, client).on('posted', () => console.log('Posted stats to Top.gg!'));
    
            app.post('/dblwebhook', webhook.listener(vote => {
                // vote is your vote object
                var user = client.users.cache.find(user => user.id === vote.user);
    
                client.channels.cache.get('861767070106255360').send("**" + user.tag + "** đã vote bot!");
            })) // attach the middleware
            
            app.listen(3000) // your port
        }
        /*
        topgg.post({ servers: client.guilds.cache.size }).then(console.log); //post only server count | returning: boolean
        
        topgg.post({
            servers: client.guilds.cache.size,
            shard: {
                id: client.shard.ids,
                count: client.shard.count
            }
        }).then(console.log) //with shard info | returning: boolean
        
        topgg.on('posted', data =>console.log(data)); */
    
        
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
    
        // unlink('./data.json', (err) => { if(err) console.log(err) });
    
        api.clean();
        event.setup();
        // main.run();
    
        // started notify
        client.guilds.cache.forEach((guild) => {
            const data = new Scriptdb(`./data/guilds/setup-${guild.id}.json`);
            const checkdata = data.get('livechat');
    
            if(checkdata == undefined || guild == undefined) return;
    
            try {
                client.channels.cache.get(checkdata).send({embed: {
                    description: "Đang khởi động lại bot.",
                    color: 0x15ff00
                }});
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
        }, 1 * 60 * 60 * 1000);
    
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