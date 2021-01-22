exports.run = (bot, name, logger) => {
    if(logger.startsWith("!ping")) {
        var newLog = logger.replace('!ping', '')
        //const args = newLog.split(',')
        var args = username;
        pingFunc(args);

        function pingFunc(args) {
            bot.chat("> Ping của " + args + " là " + bot.players[args].ping);
        }
    }

}