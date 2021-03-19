function API() { // goi cai nay la function sau do import
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
            } else if (day == 0) {
                age = `${hour} giờ ${minutes} phút`;
                if (hour == 0) {
                    age = `${minutes} phút`;
                    if(minutes == 0) {
                        age = `vài giây`
                    }
                }
            }

            var monthFormat = parseInt(day / 30)
            if(day > 30) {
                age = `${time} tháng`;
            }

            var yearFormat = parseInt(monthFormat / 12)
            if(time == 12) {
                age = `${yearFormat} năm`
            }
        }
        return age
    }

    this.playtimeCalc = (time) => {
        var correct = time / 3;
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

    var Scriptdb = require('script.db')
    this.uptimeCalc = () => {
        const u = new Scriptdb(`./data.json`);
        let uptime = u.get('uptime');

        var d = new Date();
        var timenow = d.getTime();

        var ticks = timenow - uptime;
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
        return `${hours}h ${minutes}m ${seconds}s`; 
    }
}

module.exports = API;
