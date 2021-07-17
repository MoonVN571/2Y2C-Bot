var log =require('./log');

const Scriptdb = require('script.db');

module.exports = event;

function event() {
    var data = new Scriptdb('./data.json');
    
    this.getTPS = () => {
        log('set tps');
        var tps = data.get('startedTPS');
        setTimeout(() => { data.set('startedTPS', true) }, 5000);
        return tps;
    }

    this.getAuto = () => {
        log('get auto event');
        var me = data.get('startedAuto');
        return me;
    }

    this.setAuto = (boolean) => {
        log('set auto event');
        var auto = data.get('startedAuto');
        setTimeout(() => { data.set('startedME', boolean) }, 5000);
        return auto;
    }
}