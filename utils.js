const Database = require('simplest.db');

/**
 * 
 * @param {Number} time Thời gian chưa được trừ lại ngày hiện tại 
 * @returns Trả về giây phút giờ ngày tháng năm
 */
function ageCalc(time) {
    var up = new Date(new Date().getTime() - new Date(time).getTime());

    let years = up.getUTCFullYear() - 1970;
    let months = up.getUTCMonth();
    let days = up.getUTCDate() - 2;
    let hours = up.getUTCHours();
    let minutes = up.getUTCMinutes();

    var string = "vài giây";
    if (hours == 0 && minutes > 0) string = minutes + " phút";
    if (hours > 0 && minutes == 0) string = hours + " giờ";
    if (hours > 0 && minutes > 0) string = hours + " giờ " + minutes + " phút";

    if (days > 0 && months > 0) string = months + " tháng " + days + " ngày ";
    if (days > 0 && months == 0) string = days + " ngày " + string;
    if (days == 0 && months > 0) string = months + " tháng";

    if (years > 0) string = years + " năm " + string;

    return string;
}

/**
 * 
 * @param {Number} temp Thời gian là tick
 * @returns Trả về ngày giờ phút giây
 */
function calc(temp) {
    var days = hours = 0, minutes = 0, seconds = 0;

    days = parseInt(temp / 86400);
    hours = parseInt(((temp - days * 86400) / 3600))
    minutes = parseInt(((temp - days * 86400 - hours * 3600)) / 60)
    seconds = parseInt(temp % 60)

    let string = "";
    if(seconds > 0) string = seconds + "S";
    if (hours == 0 && minutes > 0) string = minutes + "M";
    if (hours > 0 && minutes == 0) string = hours + "H";
    if (hours > 0 && minutes > 0) string = hours + "H " + minutes + "M";
    if (minutes > 0 && seconds > 0) string = minutes + "M " + seconds + "S";
    if (hours > 0 && seconds > 0) string = minutes + "M " + seconds + "S";
    
    if(days > 0) string = days + "D " + string;

    return string;
}

/**
 * 
 * @returns Trả về thời gian từ trước đó trừ trên database
 */
function uptimeCalc() {
    const data = new Database({ path: './data.json' });
    let ut = data.get('uptime');

    var ticks = Date.now() - ut;
    var temp = ticks / 1000;
    var day = hours = 0, minutes = 0, seconds = 0;
    if(ticks < 86400 * 1000) {
        hours = parseInt(((temp - day * 86400) / 3600))
        minutes = parseInt(((temp - day * 86400 - hours * 3600)) / 60)
        seconds = parseInt(temp % 60)
    }

    if(seconds < 0) seconds = 0;

    return hours + "h " + minutes + "m " + seconds + "s";
}

/**
 * 
 * @returns Tính thời gian bot đã ở trong queue
 */
function queueTime() {
    const data = new Database({ path: './data.json' });

    var end = data.get('queueEnd');
    var start = data.get('queueStart');
    let ticks = end - start;

    if (ticks <= 0 || end == undefined || start == undefined) return '0h 0m 0s';

    var temp = ticks / 1000;
    var day = hours = 0, minutes = 0, seconds = 0;
    hours = parseInt(((temp - day * 86400) / 3600))
    minutes = parseInt(((temp - day * 86400 - hours * 3600)) / 60)
    seconds = parseInt(temp % 60)

    return hours + "h " + minutes + "m " + seconds + "s";
}

/**
 * @returns Trả về thời gian của uptime để set topic trên tab
 */
function calcTime() {
    var d = uptimeCalc();
    var hours = d.split("h")[0]
    var minutes = d.split("h ")[1].split("m")[0];

    let format = "";
    if(hours == 0 && minutes > 0) format = minutes + " phút";
    if(hours > 0 && minutes == 0) format = hours + " giờ";
    if(hours > 0 && minutes > 0) format = hours + " giờ " + minutes + " phút";
    return format;
}

/**
 * 
 * @param {Number} time Thời gian đã chơi
 * @returns Trả về thời gian ngày giờ phút
 */
function playtimeCalc(time) {
    var correct = time;
    var temp = correct / 1000;
    var day = 0, hour = 0, minutes = 0;
    day = parseInt(temp / 86400)
    hour = parseInt(((temp - day * 86400) / 3600))
    minutes = parseInt(((temp - day * 86400 - hour * 3600)) / 60)
    var string;

    if (hours == 0 && minutes > 0) string = minutes + " phút";
    if (hours > 0 && minutes == 0) string = hours + " giờ";
    if (hours > 0 && minutes > 0) string = hours + " giờ " + minutes + " phút";

    if (day > 0) string = days + " ngày " + string;
    return string;
}

/**
 * 
 * @param {Number} Số để lấy ngày 
 * @returns DD-MM-YYYY
 */
function getDate(datetime) {
    return soKhong(new Date(datetime).getDate(), 2) +
        "-" + soKhong(new Date(datetime).getMonth() + 1, 2) +
        "-" + new Date(datetime).getFullYear();
}

/**
 * 
 * @param {Number} time Thời gian để lấy
 * @returns Trả về HH-MM-SS
 */
function getTime(time) {
    return soKhong(new Date(time).getHours(), 2) +
        ":" + soKhong(new Date(time).getMinutes(), 2) +
        ":" + soKhong(new Date(time).getSeconds(), 2);
}

/**
 * 
 * @param {Number} datetime Trả về DD-MM-YYYY HH:MM:SS
 * @returns 
 */
function getTimestamp(datetime) {
    return soKhong(new Date(datetime).getDate(), 2) +
        "-" + soKhong(new Date(datetime).getMonth() + 1, 2) +
        "-" + new Date(datetime).getFullYear() +
        " " +
        soKhong(new Date(datetime).getHours(), 2) +
        ":" + soKhong(new Date(datetime).getMinutes(), 2) +
        ":" + soKhong(new Date(datetime).getSeconds(), 2);
}

/**
 * 
 * @param {Number} value Số cần lấy
 * @param {Number} length Lấy số không bao lần
 * @returns Nếu soKhong(1, 2) thì trả về 01
 */
function soKhong(value, length) {
    return `${value}`.padStart(length, 0);
}

/**
 * Dọn data của file data.json
 */
function clean() {
    require('fs').unlink('./data.json', (err) => { });
}

function removeFormat(data) {
    const dauhuyen = data.replace(/`/ig, "\\`");
    const dausao = dauhuyen.replace(/_/ig, "\\_");
    const s = dausao.replace("||", "\\||");
    const newData = s.replace("*", "\\*");

    return newData;
}

module.exports = {
    ageCalc,
    calc,
    uptimeCalc,
    queueTime,
    calcTime,
    playtimeCalc,
    getTime,
    getDate,
    getTimestamp,
    removeFormat,
    clean
};
