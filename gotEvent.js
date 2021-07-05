var log =require('./log');

const Scriptdb = require('script.db');

module.exports = event;

function event() {
    var data = new Scriptdb('./data.json');

    this.setup = () => {
        data.set('startedTPS', false);
        data.set('startedME', false);
        data.set('startedAuto', false);
    }
    
    this.getTPS = () => {
        log('set tps');
        var tps = data.get('startedTPS');
        setTimeout(() => { data.set('startedTPS', true) }, 5000);
        return tps;
    }

    this.getME = () => {
        log('set msg event');
        var me = data.get('startedME');
        setTimeout(() => { data.set('startedME', true) }, 5000);
        return me;
    }
    
    this.getAuto = () => {
        log('set auto');
        var auto = data.get('startedAuto');
        setTimeout(() => { data.set('startedAuto', true); }, 5000);
        return auto;
    }
}