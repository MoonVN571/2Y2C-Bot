module.exports = (bot) => {
    bot.clickWindow(4, 0, 0, null)
    bot.clickWindow(3, 0, 0, null) 
    bot.clickWindow(7, 0, 0, null)
    bot.clickWindow(1, 0, 0, null)
    
    // if(bot.closeCount == 1) {
        setTimeout(() => { bot.chat('/2y2c') }, 10*1000)

        setTimeout(() => { bot.clickWindow(10,0,0) }, 12*1000);
    // }

    setTimeout(() => { if(bot.closeCount == 1)  { bot.quit(); bot.disconnectRequest = true; } }, 2 * 60 *1000)
}