const api = require('./utils');
const fs = require('fs');

function logToFile(text) {
    const logText = "[" + api.getTimestamp(Date.now()) + '] ' + text + '\r\n';
    console.log(logText);

    fs.appendFile('./logs/' + api.getDate(Date.now()) + '.log', logText, 'utf8', function (error) {
        if (error) console.log("[" + api.getTimestamp(Date.now()) + '] ' + error);
    });
}

module.exports = logToFile;