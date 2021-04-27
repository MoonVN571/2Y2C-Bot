const prioo = require("minecraft-protocol");

function API() {
    this.ageCalc = (time) => {
        var d = new Date()
        var temp = (d.getTime() - time) / 1000;
        var year = 0, month = 0, day = 0, hour = 0, minutes = 0;
        day = parseInt(temp / 86400)
        month = parseInt(day / 30)
        year = parseInt(month / 12)
        hour = parseInt(((temp - day * 86400) / 3600))
        minutes = parseInt(((temp - day * 86400 - hour * 3600)) / 60)
    
        var age;
        if(month > 0) {
            age = `${month} tháng`
            if(month > 12) {
                age = `${year} năm`   
            }
        } else {
            if (day > 0) {
                age = `${day} ngày`;
                var weekFormat = parseInt(day / 7)
                if(weekFormat >= 1) {
                    age = `${weekFormat} tuần`
                }
            } else if (day == 0) {
                age = `${hour} giờ`;
                if (hour == 0) {
                    age = `${minutes} phút`;
                    if(minutes == 0) {
                        age = `vài giây`
                    }
                }
            }
        }
        return age;
    }

    this.calc = (time) => {
        var ticks = time;
        var temp = ticks;
        var days = hours = 0, minutes = 0, seconds = 0;
        
        days = parseInt(temp / 86400);
        hours = parseInt(((temp - days * 86400) / 3600))
        minutes = parseInt(((temp - days * 86400 - hours * 3600)) / 60)
        seconds = parseInt(temp % 60)

        return days + "d " + hours + "h " + minutes + "m " + seconds + "s";
    }
 
    this.uptimeCalc = () => {
        var Scriptdb = require('script.db');
        const uptime = new Scriptdb(`./data.json`);
        let ut = uptime.get('uptime');

        var d = new Date();
        var timenow = d.getTime();

        var ticks = timenow - ut;
        var temp = ticks / 1000;
        var day = hours = 0, minutes = 0, seconds = 0;
        hours = parseInt(((temp - day * 86400) / 3600))
        minutes = parseInt(((temp - day * 86400 - hours * 3600)) / 60)
        seconds = parseInt(temp % 60)
        if(uptime === undefined) {
            hours = 0;
            minutes = 0;
            seconds = 0;
        }
        return hours + "h " + minutes + "m " + seconds + "s";
    }


    this.calcTime = (hours, minutes) => {
        var formatMinutes;
        if(minutes == 0) {
            formatMinutes = "";
        } else {
            formatMinutes = minutes + " phút ";
        }

        var format;
        if(hours == 0) {
            format =  formatMinutes;
        } else {
            format = hours + " giờ " + formatMinutes;
        }

        if(minutes == 0 && hours == 0) {
            format = "vài giây ";
        }
        return format;
    }

    this.playtimeCalc = (time) => {
        var correct = time;
        var temp = correct / 1000;
        var day = 0, hour = 0, minutes = 0;
            day = parseInt(temp / 86400)
            hour = parseInt(((temp - day * 86400) / 3600))
            minutes = parseInt(((temp - day * 86400 - hour * 3600)) / 60)
            var string;
            if( day == 0 ) {
                if(minutes > 0 && hour > 0 ) {
                    string = hour + " giờ " + minutes + " phút";		
                }
                if(minutes == 0 && hour > 0) {
                    string = hour + " giờ";
                }
                if(minutes > 0 && hour == 0) {
                    string = minutes + " phút";
                }
            } else {
                if(minutes > 0 && hour > 0 ) {
                    string = day + " ngày " + hour + " giờ " + minutes + " phút";		
                }
                if(minutes == 0 && hour > 0) {
                    string = day + " ngày " + hour + " giờ";
                }
                if(minutes > 0 && hour == 0) {
                    string = day + " ngày " + minutes + " phút";
                }
            }
        return string;
    }

    this.playtimeCalcE = (time) => {
        var correct = time / 3;
        var temp = correct / 1000;
        var day = 0, hour = 0, minutes = 0;
            day = parseInt(temp / 86400)
            hour = parseInt(((temp - day * 86400) / 3600))
            minutes = parseInt(((temp - day * 86400 - hour * 3600)) / 60)
            var string;
            if( day == 0 ) {
                if(minutes > 0 && hour > 0 ) {
                    string = hour + " hours " + minutes + " minutes";		
                }
                if(minutes == 0 && hour > 0) {
                    string = hour + " hours";
                }
                if(minutes > 0 && hour == 0) {
                    string = minutes + " minutes";
                }
            } else {
                if(minutes > 0 && hour > 0 ) {
                    string = day + " days " + hour + " hours " + minutes + " minutes";		
                }
                if(minutes == 0 && hour > 0) {
                    string = day + " days " + hour + " hours";
                }
                if(minutes > 0 && hour == 0) {
                    string = day + " days " + minutes + " minutes";
                }
            }
        return string;
    }

    var queue = "0";
    var prio = "0";
    var online = "undefined";
    var status = "null";

    this.getQueue = () => {
        queuee.ping({ "host": "2y2c.org" }, (err, result) => {
            if (result) {
                try {
                    var players = [];
                    for (i = 0; result.players.sample.length > i; i++) {
                        players.push(result.players.sample[i].name);
                    }
                    var players2 = players.splice(0, Math.ceil(players.length / 2));
                    if (players == []) {
                        players.push(players2);
                        players2 = ".";
                    }
                } catch {
                    var players = 'Error';
                    var players2 = 'Error';
                }

                var old = players.toString().replace(",§6Cựu binh: §l0", "");
                queue = old.toString().replace("§6Bình thường: §l", "");
            }
        });
        return queue;
    }

    this.getPrio = () => {
        prioo.ping({ "host": "2y2c.org" }, (err, result) => {
            if (result) {
                try {
                    var players = [];
                    for (i = 0; result.players.sample.length > i; i++) {
                        players.push(result.players.sample[i].name);
                    }
                    var players2 = players.splice(0, Math.ceil(players.length / 2));
                    if (players == []) {
                        players.push(players2);
                        players2 = ".";
                    }
                } catch {
                    var players = 'Error';
                    var players2 = 'Error';
                }
                prio = players2.toString().replace("2y2c §6Queue Size,§6Ưu Tiên: §l", "");
            }
        });
        return prio;
    }

    this.getOnline = () => {
        onlinee.ping({ "host": "2y2c.org" }, (err, result) => {
            if (result) {
                try {
                    var players = [];
                    for (i = 0; result.players.sample.length > i; i++) {
                        players.push(result.players.sample[i].name);
                    }
                    var players2 = players.splice(0, Math.ceil(players.length / 2));
                    if (players == []) {
                        players.push(players2);
                        players2 = ".";
                    }
                } catch {
                    var players = 'Error';
                    var players2 = 'Error';
                }
                online = result.players.online;
            }
        });
        return online;
    }

    this.getStatus = () => {
        stt.ping({ "host": "2y2c.org" }, (err, result) => {
            if (result) {
                try {
                    var players = [];
                    for (i = 0; result.players.sample.length > i; i++) {
                        players.push(result.players.sample[i].name);
                    }
                    var players2 = players.splice(0, Math.ceil(players.length / 2));
                    if (players == []) {
                        players.push(players2);
                        players2 = ".";
                    }
                } catch {
                    var players = 'Error';
                    var players2 = 'Error';
                }
                prio = players2.toString().replace("2y2c §6Queue Size,§6Ưu Tiên: §l", "");
                online = result.players.online;
                var old = players.toString().replace(",§6Cựu binh: §l0", "");
                queue = old.toString().replace("§6Bình thường: §l", "");

                status = "Hàng chờ: " + queue + " - Ưu tiên: " + prio + " - Trực tuyến: " + result.players.online;
            }
        });
        return status;
    }
}

module.exports = API;
