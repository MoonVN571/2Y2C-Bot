
const fs = require('fs');

fs.readFile('channels.txt', 'utf8', function(err, data) {
        
        
        // var queue = [];
        // queue.push(data)
        // console.log(data);
        // var i =queue.shift()
        // console.log(i)
})

fs.readFile("channels.txt", 'utf8', function (err, data) {
    if (err) throw err;
    const lines = data.split(/\r?\n/);
    setInterval(() => {
        if (lines[0]) {
            const line = lines.pop()
            if(line == "") return
            console.log(line)
        }
    }, 100)
});