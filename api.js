var Scriptdb = require('script.db');

function API() {
    this.ageCalc = (time) => {
        const date =  new Date();
        const dateSince = new Date(+time);
        
        var year = dateSince.getFullYear() - date.getFullYear(),
        month = dateSince.getMonth() - date.getMonth(),
        day = dateSince.getDate() - date.getDate(),
        hour = dateSince.getHours() - date.getHours(),
        minute = dateSince.getMinutes() - date.getMinutes();

        if(year.toString().startsWith('-'))
            year = year.toString().split('-')[1]

        if(month.toString().startsWith('-'))
            month = month.toString().split('-')[1]

        if(day.toString().startsWith('-'))
            day = day.toString().split('-')[1]

        if(hour.toString().startsWith('-'))
            hour = hour.toString().split('-')[1]

        if(minute.toString().startsWith('-'))
            minute = minute.toString().split('-')[1]
        
        // console.log(year, month, day, hour, minute)
        // year = 0
        // month = 0
        // day = 1
        // hour = 0
        // minute = 1
        var age;
        if(year > 0) {
            if(month > 0) {
                if(day > 0) {
                    age = `${year} năm ${month} tháng ${day} ngày`
                } else {
                    age = `${year} năm ${month} tháng`
                }
            } else {
                if(day > 0) {
                    age = `${year} năm ${day} ngày`
                } else {
                    age = `${year} năm`
                }
            }
        } else { // year < 0
            if(month > 0) {
                if(day > 0) {
                    age = `${month} tháng ${day} ngày`
                } else {
                    age = `${month} tháng`
                }
            } else { // month < 0
                if(day > 0) {
                    if(hour > 0) {
                        age = `${day} ngày ${hour} giờ`
                        if(minute > 0) {
                            age = `${day} ngày ${hour} giờ ${minute} phút`
                        } else {
                            age = `${day} ngày ${hour} giờ`
                        }
                    } else { // hour < 0
                        if(hour > 0) {
                            if(minute > 0) {
                                age = `${day} ngày ${hour} giờ ${minute} phút`
                            } else {
                                age = `${day} ngày ${hour} giờ`
                            }
                        } else { // hour < 0
                            if(minute > 0) {
                                age = `${day} ngày ${minute} phút`
                            } else {
                                age = `${day} ngày`
                            }
                        }
                    }
                } else { // day < 0
                    if(hour > 0) {
                        if(minute > 0) {
                            age = `${hour} giờ ${minute} phút`
                        } else {
                            age = `${hour} giờ`
                        }
                    } else { // hour < 0
                        if(minute > 0) {
                            age = `${minute} phút`
                        } else {
                            age = `vài giây`
                        }
                    }
                }
            }
        }

        age = age + " ";

        if(year == "NaN" || month == "NaN" || day== "NaN" || hour == "NaN" || minute== "NaN" )
            age = null;

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

    this.queueTime = () => {
        const data = new Scriptdb(`./data.json`);
        let ticks = data.get('queueEnd') - data.get('queueStart');

        var temp = ticks / 1000;
        var day = hours = 0, minutes = 0, seconds = 0;
        hours = parseInt(((temp - day * 86400) / 3600))
        minutes = parseInt(((temp - day * 86400 - hours * 3600)) / 60)
        seconds = parseInt(temp % 60)
        if(data.get('queueEnd') == undefined) {
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
