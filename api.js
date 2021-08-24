var Scriptdb = require('script.db');
var log = require('./log');

function API() {
    /**
     * locate: Vietnam, quoc_te
     */
    this.ageCalc = (time, quoc_te) => {
        log(new Date(+time).toLocaleString());
        log(new Date().toLocaleString());

        log(new Date(+time).getTime() +"old")
        log(new Date().getTime() +"now")

        var year = 0, month = 0, day = 0, hour = 0, minute = 0;

        var up = new Date(new Date().getTime() - new Date(+time).getTime());
        var d = up.toLocaleDateString();
        var t = up.toLocaleTimeString();

        log(t +"time");
        log(d +"d");

        if(!quoc_te) {
            var dstr = d.split("/")[1];
            var mstr = d.split("/")[0];
            var ystr = d.split("/")[2];
        } else {
            var dstr = d.split("/")[0];
            var mstr = d.split("/")[1];
            var ystr = d.split("/")[2];    
        }
        if(dstr >= 1) dstr = dstr - 1;
        if(mstr >= 1) mstr = mstr - 1;
        if(ystr == 1970) ystr = ystr - 1970;

        if(ystr > 1970) mstr = parseInt((ystr - 1970) * 12) + (mstr + 1);

        var hstr = parseInt(t.split(":")[0]);
        var minstr = parseInt(t.split(":")[1]);

        if(t == "Invalid Date") return "không rõ";

        if(t.split(" ")[1] == "PM") hstr = hstr + 12;
        
        if(d.split("/")[0] == 1) hstr = hstr - 8;
        if(hstr <= 0) hstr = 0;

        log(dstr +"d");
        log(mstr +"m");
        log(hstr +"h");
        log(minstr +"min");
        var year = parseInt(mstr/12);
        var month = mstr - (year * 12);
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

        return days + " ngày " + hours + " giờ " + minutes + " phút " + seconds + " giây";
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

        if(ticks <= 0 || end == undefined || start == undefined) return '0h 0m 0s';

        var temp = ticks / 1000;
        var day = hours = 0, minutes = 0, seconds = 0;
        hours = parseInt(((temp - day * 86400) / 3600))
        minutes = parseInt(((temp - day * 86400 - hours * 3600)) / 60)
        seconds = parseInt(temp % 60)
        
        if(hours == "NaN" || minutes == "NaN" || seconds == "NaN") {
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

    this.getDate = (datetime) => {
        return this.soKhong(new Date(datetime).getDate(), 2) + 
        "/" + this.soKhong(new Date(datetime).getMonth() + 1, 2) + 
        "/" + new Date(datetime).getFullYear();
    }

    this.getTime = (time) => {
        return this.soKhong(new Date(time).getHours(), 2) + 
        ":" + this.soKhong(new Date(time).getMinutes(), 2) + 
        ":" + this.soKhong(new Date(time).getSeconds(), 2);
    }

    this.getTimestamp = (datetime) => {
        return this.soKhong(new Date(datetime).getDate(), 2) + 
        "/" + this.soKhong(new Date(datetime).getMonth() + 1, 2) + 
        "/" + new Date(datetime).getFullYear() + 
        " " + 
        this.soKhong(new Date(datetime).getHours(), 2) + 
        ":" + this.soKhong(new Date(datetime).getMinutes(), 2) + 
        ":" + this.soKhong(new Date(datetime).getSeconds(), 2);
    }

    this.calculate = time => {
        let temp = time / 1000;
        var day = 0, hour = 0, minutes = 0, seconds = 0;
        days = parseInt(temp / 86400);
        hour = parseInt(((temp - days * 86400) / 3600))
        minutes = parseInt(((temp - days * 86400 - hour * 3600)) / 60)
        seconds = parseInt(temp % 60)
    
        var string;
        if( day == 0 ) {
            if(minutes > 0 && hour > 0 ) {
                string = hour + " giờ " + minutes + " phút";
                if(seconds > 0) string = hour + " giờ " + minutes + " phút " + seconds + " giây";		
            }
            if(minutes == 0 && hour > 0) {
                string = hour + " giờ";
                if(seconds > 0) string = hour + " giờ " + seconds + " giây"
            }
            if(minutes > 0 && hour == 0) {
                string = minutes + " phút";
                if(seconds > 0) string = minutes + " phút " +  seconds + " giây";
            }

            if(minutes == 0 && hour == 0) string = seconds + " giây";
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
    
    this.soKhong = (value, length) => {
        return `${value}`.padStart(length, 0);
    }

    this.clean = () => {
        require('fs').unlink('./data.json', (err) => { if(err) console.log("Sảy ra lỗi khi xoá file data.json") });
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
