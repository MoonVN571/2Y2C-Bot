/**
 *        MODULE INFO
 *    Đây là một module độc lập nhưng được làm lại
 * để hoạt động theo ý mình.
 * 
 * Tên module là log-to-file
 */


const fs = require('fs');

function appendZeroToLength(value, length) {
  return `${value}`.padStart(length, 0);
}

 function getDateAsText() {
  const now = new Date();
  const nowText = appendZeroToLength(
    appendZeroToLength(now.getUTCDate(), 2) + '-'
    + appendZeroToLength(now.getMonth() + 1, 2) + '-'
    + now.getUTCFullYear(), 4) + ' '
    + appendZeroToLength(now.getHours(), 2) + ':'
    + appendZeroToLength(now.getMinutes(), 2) + ':'
    + appendZeroToLength(now.getSeconds(), 2)
  return nowText;
}

function logToFile(text, file) {
  var d = new Date();
  var dataFormat = [d.getDate(),
  d.getMonth()+1,
  d.getFullYear()].join('-');
         
  const logText = "[" + getDateAsText() + '] '  + text + '\r\n';

  fs.appendFile('./logs/' + dataFormat + '.log', logText, 'utf8', function (error) {
    if (error) throw console.log("[" + getDateAsText() + '] ' + error);
  });
}

module.exports = logToFile;
