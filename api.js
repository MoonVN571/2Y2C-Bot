var Scriptdb = require('script.db');
var log = require('./log');

function API() {
    this.ageCalc = (time) => {
        log(new Date(+time).toLocaleString());
        log(new Date().toLocaleString());

        var year = 0, month = 0, day = 0, hour = 0, minute = 0;

        var up = new Date(new Date().getTime() - +time);
        var d = up.toLocaleDateString();
        var t = up.toLocaleTimeString();

        log(t);
        log(d);

        var dstr = d.split("/")[1];
        var mstr = d.split("/")[0];
        var ystr = d.split("/")[2];

        if(dstr >= 1) dstr = dstr - 1;
        if(mstr >= 1) mstr = mstr - 1;
        if(ystr == 1970) ystr = ystr - 1970;
        
        var hstr = parseInt(t.split(":")[0]);
        var minstr = parseInt(t.split(":")[1]);

        if(t.split(" ")[1] == "PM") hstr = hstr + 12;

        if(d.split("/")[0] == 1) hstr = hstr - 8;

        log(dstr, mstr, ystr, hstr, minstr);

        var year = ystr;
        var month = mstr;
        var day = dstr;
        var hour = hstr;
        var minute = minstr;

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

        log("API is: " + age);
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
        var data = new Scriptdb('./data.json');

        let ut = data.get('uptime');

        var ticks = Date.now() - ut;
        var temp = ticks / 1000;
        var day = hours = 0, minutes = 0, seconds = 0;
        hours = parseInt(((temp - day * 86400) / 3600))
        minutes = parseInt(((temp - day * 86400 - hours * 3600)) / 60)
        seconds = parseInt(temp % 60)

        if(hours > 24) return "0h 0m 0s";

        if(ut == undefined) {
            hours = 0;
            minutes = 0;
            seconds = 0;
        }
        return hours + "h " + minutes + "m " + seconds + "s";
    }

    this.queueTime = () => {
        var data = new Scriptdb('./data.json');

        var end = data.get('queueEnd');
        var start = data.get('queueStart');
        let ticks = end - start;

        if(ticks <= 0 || end == null || start == null) return '0h 0m 0s';

        var temp = ticks / 1000;
        var day = hours = 0, minutes = 0, seconds = 0;
        hours = parseInt(((temp - day * 86400) / 3600))
        minutes = parseInt(((temp - day * 86400 - hours * 3600)) / 60)
        seconds = parseInt(temp % 60)
        
        if(data.get('queueEnd') == undefined || hours == "NaN" || minutes == "NaN" || seconds == "NaN") {
            hours = 0;
            minutes = 0;
            seconds = 0;
        }
        return hours + "h " + minutes + "m " + seconds + "s";
    }


    this.calcTime = () => {
        var d = this.uptimeCalc();
        var h = d.split("h")[0]
        var m = d.split("h ")[1].split("m")[0];
        var hours = +h;
        var minutes = +m;
        
        var formatMinutes;
        if(minutes == 0) {
            formatMinutes = "";
        } else {
            formatMinutes = minutes + " phút";
        }

        var format;
        if(hours == 0) {
            format =  formatMinutes;
        } else {
            format = hours + " giờ " + formatMinutes;
        }

        if(minutes == 0 && hours == 0) format = "vài giây";
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

    this.clean = () => {
        var data = new Scriptdb('./data.json');
         
        data.deleteAll();
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
