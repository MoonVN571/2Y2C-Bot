var Scriptdb = require('script.db');

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

    this.removeFormat = (data) => {
		const dauhuyen = data.replace(/`/ig, "\\`");
		const dausao = dauhuyen.replace(/_/ig, "\\_");
		const s = dausao.replace("||", "\\||");
		const newData = s.replace("*", "\\*");

        return newData;
    }
}

module.exports = API;
