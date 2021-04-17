module.exports = (bot) => {
    var pin1 = 4;
    var pin2 = 3;
    var pin3 = 7;
    var pin4 = 1;
    
    bot.clickWindow(pin1, 0, 0, null)
    bot.clickWindow(pin2, 0, 0, null) 
    bot.clickWindow(pin3, 0, 0, null)
    bot.clickWindow(pin4, 0, 0, null)
    
    setTimeout(() => { bot.chat('/2y2c') }, 10*1000)

    setTimeout(() => { bot.clickWindow(10,0,0); bot.verified = true; }, 12*1000);
}