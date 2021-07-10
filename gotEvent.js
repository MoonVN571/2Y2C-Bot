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

    this.getME = () => {
        log('set msg event');
        var me = data.get('startedME');
        return me;
    }

    this.setME = (boolean) => {
        log('un set msg event');
        var me = data.get('startedME');
        // if(boolean) boolean = true;
        // if(!boolean) boolean = false;
        
        setTimeout(() => { data.set('startedME', boolean) }, 5000);
        return me;
    }
    
    this.getAuto = () => {
        log('set auto');
        var auto = data.get('startedAuto');
        setTimeout(() => { data.set('startedAuto', true); }, 5000);
        return auto;
    }
}