const Canvas = require('canvas')
const { MessageAttachment } = require('discord.js')
const Database = require('simplest.db')
module.exports = {
    name: "tab",
    description: "Xem tab của server",
    aliases: ['2i'],
    delay: 5,
    vote: true,

    async execute(client, message, args) {
        const canvas = Canvas.createCanvas(1927, 1080);

        const background = await Canvas.loadImage('./pictures/tab.jpg')
        const context = canvas.getContext('2d');

        context.drawImage(background, 0, 0, canvas.width, canvas.height);



        const playerFrame = await Canvas.loadImage('./pictures/player-render.png');

        const pingFrame = await Canvas.loadImage('./pictures/ping-5.png');

        context.globalAlpha = 0.1;

        var num = 0;

        context.globalAlpha = 0.8;
        // await context.drawImage(playerFrame, 160, 190+num, 150, 25 );

        const data = new Database({path:'./data.json'});

        var arr = data.get("players");

        var motd = data.get("server-motd");

        var status = data.get('tab-content');

        if (!motd) motd = '';

        if (!status) status = '';

        if (!arr) return message.reply("Bot chưa kết nối vào server!");

        arr = arr.sort()

        status = status.split("trước")[0] + "trước";

        status = status.split(" tps")[0].replace(/ /g, "") + status.split("tps")[1];


        Canvas.registerFont('./font/NotoSansTC-Regular.otf', {
            family: 'NotoSansTC',
            weight: 'normal',
            style: "normal"
        });

        context.font = '20px NotoSansTC'


        context.fillStyle = '#FFD728';
        context.fillText(motd, canvas.width / 2 - context.measureText(motd).width / 2, 150);

        context.fillStyle = '#00AAAA';
        context.fillText(status, canvas.width / 2 - context.measureText(status).width / 2, 950);


        /*
        var num = 0;

        for(var index = 0; index <= 21; index++) {
            arr.pop();

            context.globalAlpha = 0.8;
            context.drawImage(playerFrame, 160, 190+num, 150, 26 );
            context.drawImage(pingFrame, 275, 190+num, 30, 25 );
            num = num+32;

            context.fillStyle = '#ffffff';
            
            context.rotate(0);
            context.fillText(arr[arr.length -2] ? arr[arr.length -2] : "", 160, 180+num, 1000);

            context.save();
        }

        var num2 = 0;

        for(var index = 0; index <= 21; index++) {
            arr.pop();

            context.globalAlpha = 0.8;
            context.drawImage(playerFrame, 330, 190+num2, 150, 26 );
            context.drawImage(pingFrame, 445, 190+num2, 30, 25 );

            num2 = num2+32;

            context.fillStyle = '#ffffff';
            
            context.rotate(0);
            context.fillText(arr[arr.length -2] ? arr[arr.length -2] : "", 330, 180+num2, 1000);
            context.save();
        } */

        var num3 = 0;

        for (var index = 0; index <= 21; index++) {
            arr.pop();

            context.globalAlpha = 0.8;
            context.drawImage(playerFrame, 500, 190 + num3, 150, 26);
            if (arr[arr.length - 2]) context.drawImage(pingFrame, 615, 190 + num3, 30, 25);

            num3 = num3 + 32;

            context.fillStyle = '#ffffff';

            context.rotate(0);
            context.fillText(arr[arr.length - 2] ? arr[arr.length - 2] : "", 500, 180 + num3, 1000);
            context.save();
        }


        var num4 = 0;

        for (var index = 0; index <= 21; index++) {
            arr.pop();

            context.globalAlpha = 0.8;
            context.drawImage(playerFrame, 675, 190 + num4, 150, 26);
            if (arr[arr.length - 2]) context.drawImage(pingFrame, 790, 190 + num4, 30, 25);

            num4 = num4 + 32;

            context.fillStyle = '#ffffff';

            context.rotate(0);
            context.fillText(arr[arr.length - 2] ? arr[arr.length - 2] : "", 675, 180 + num4, 1000);
            context.save();
        }


        var num5 = 0;

        for (var index = 0; index <= 21; index++) {
            arr.pop();

            context.globalAlpha = 0.8;
            context.drawImage(playerFrame, 840, 190 + num5, 150, 26);
            if (arr[arr.length - 2]) context.drawImage(pingFrame, 955, 190 + num5, 30, 25);

            num5 = num5 + 32;

            context.fillStyle = '#ffffff';

            context.rotate(0);
            context.fillText(arr[arr.length - 2] ? arr[arr.length - 2] : "", 840, 180 + num5, 1000);
            context.save();
        }


        var num6 = 0;

        for (var index = 0; index <= 21; index++) {
            arr.pop();

            context.globalAlpha = 0.8;
            context.drawImage(playerFrame, 1005, 190 + num6, 150, 26);
            if (arr[arr.length - 2]) context.drawImage(pingFrame, 1120, 190 + num6, 30, 25);

            num6 = num6 + 32;

            context.fillStyle = '#ffffff';

            context.rotate(0);
            context.fillText(arr[arr.length - 2] ? arr[arr.length - 2] : "", 1005, 180 + num6, 1000);
            context.save();
        }


        var num7 = 0;

        for (var index = 0; index <= 21; index++) {
            arr.pop();

            context.globalAlpha = 0.8;
            context.drawImage(playerFrame, 1175, 190 + num7, 150, 26);
            if (arr[arr.length - 2]) context.drawImage(pingFrame, 1290, 190 + num7, 30, 25);

            num7 = num7 + 32;

            context.fillStyle = '#ffffff';

            context.rotate(0);
            context.fillText(arr[arr.length - 2] ? arr[arr.length - 2] : "", 1175, 180 + num7, 1000);
            context.save();
        }

        /*
        var num8 = 0;

        for(var index = 0; index <= 21; index++) {
            arr.pop();

            context.globalAlpha = 0.8;
            context.drawImage(playerFrame, 1350, 190+num8, 150, 26 );
            if(arr[arr.length -2]) context.drawImage(pingFrame, 1465, 190+num8, 30, 25 );

            num8 = num8+32;

            context.fillStyle = '#ffffff';
            
            context.rotate(0);
            context.fillText(arr[arr.length -2] ? arr[arr.length -2] : "", 1350, 180+num8, 1000);
            context.save();
        }

        var num9 = 0;

        for(var index = 0; index <= 21; index++) {
            arr.pop();

            context.globalAlpha = 0.8;
            context.drawImage(playerFrame, 1525, 190+num9, 150, 26 );
            if(arr[arr.length -2]) context.drawImage(pingFrame, 1640, 190+num9, 30, 25 );

            num9 = num9+32;

            context.fillStyle = '#ffffff';
            
            context.rotate(0);
            context.fillText(arr[arr.length -2] ? arr[arr.length -2] : "", 1525, 180+num9, 1000);
            context.save();
        } */



        const attachment = new MessageAttachment(canvas.toBuffer(), "tab.png")

        const fileContents = new Buffer(attachment.attachment, 'base64')
        require('fs').writeFile("./image.png", fileContents, (err) => {
            if (err) return console.error(err)
        })
        await message.reply({ files: [attachment], allowedMentions: { repliedUser: false } });
        // context.font = applyText(canvas, "dak");
        // context.fillStyle = '#ffffff';
        // context.fillText("2Y2C", canvas.width / 2, 31);

    }
}
