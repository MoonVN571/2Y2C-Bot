var log =require('./log');

const Scriptdb = require('script.db');

module.exports = event;

function event() {
    var data = new Scriptdb('./data.json');

    var tps = data.get('startedTPS');
    var auto = data.get('startedAuto');

    this.started = () => {
        data.set('startedTPS', false);
        data.set('startedAuto', false);
    }
    
    this.getTPS = () => {
        log('set tps');
        return tps;
    }
    
    this.getAuto = () => {
        log('set auto');
        return auto;
    }
}