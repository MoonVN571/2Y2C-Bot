var log =require('./log');

const Scriptdb = require('script.db');

module.exports = event;

function event() {    
    this.getTPS = () => {
        log('set tps');
        var data = new Scriptdb('./data.json');

        var tps = data.get('startedTPS');
        setTimeout(() => { data.set('startedTPS', true) }, 5000);
        return tps;
    }

    this.getAuto = () => {
        log('get auto event');
        var data = new Scriptdb('./data.json');

        var me = data.get('startedAuto');
        return me;
    }

    this.setAuto = (boolean) => {
        log('set auto event');
        var data = new Scriptdb('./data.json');

        setTimeout(() => { data.set('startedAuto', boolean) },5000);
        return boolean;
    }
}