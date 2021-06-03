module.exports = (bot) => {
    var v = process.env.PIN;
    
    bot.clickWindow(v.split(" ")[0], 0, 0, null)
    bot.clickWindow(v.split(" ")[1], 0, 0, null) 
    bot.clickWindow(v.split(" ")[2], 0, 0, null)
    bot.clickWindow(v.split(" ")[3], 0, 0, null)
    
    setTimeout(() => { bot.chat('/2y2c'); }, 15*1000);

    setTimeout(() => { bot.clickWindow(10,0,0) }, 20*1000);

    setTimeout(() => { bot.chat("/kill") }, 25*1000);
}