const covid19 = require('covid19-stats');

module.exports = {
    name: "covid",
    aliases: ['covid19', 'covid-19', 'coronavirus', 'corona'],
    
    async execute(bot, username, args) {
        let data = await covid19.getCountry('vietnam');

        var totalCase = Intl.NumberFormat().format(data.totalCases);
        var totalCaseDeaths = Intl.NumberFormat().format(data.totalDeaths);
        var newCase = Intl.NumberFormat().format(data.newCases);
        var newDeaths = Intl.NumberFormat().format(data.newDeaths);

        bot.whisper(username, "Việt Nam | COVID-19 | " + "Số ca: " + totalCase + " - Số ca mới: " + newCase + " - Số ca tử vong: " + totalCaseDeaths + " - Số ca tử vong mới: " + newDeaths)
    }
}