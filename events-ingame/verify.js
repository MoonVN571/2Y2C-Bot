var n = false;
module.exports = (bot) => {
    if(n) return;
    n = true;
    // var pin1 = config.pin1;
    // var pin2 = config.pin2;
    // var pin3 = config.pin3;
    // var pin4 = config.pin4;

    var pin1 = 4;
    var pin2 = 3;
    var pin3 = 7;
    var pin4 = 1;

    setTimeout(() => { n = false; }, 1 * 60 * 1000)

    bot.clickWindow(pin1, 0, 0, null)
    bot.clickWindow(pin2, 0, 0, null) 
    bot.clickWindow(pin3, 0, 0, null)
    bot.clickWindow(pin4, 0, 0, null)
    
    setTimeout(() => { bot.chat('/2y2c') }, 10*1000)

    setTimeout(() => { bot.clickWindow(10,0,0) }, 12*1000);

    setTimeout(() => { if(bot.closeCount == 1)  { bot.quit(); bot.disconnectRequest = true; } }, 2 * 60 *1000)
}