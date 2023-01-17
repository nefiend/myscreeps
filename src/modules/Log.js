/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('Log');
 * mod.thing == 'a thing'; // true
 */

const LOG_LEVEL = {
    DEBUG: 1,
    INFO:  2,
    WARN:  3,
    ERROR: 4
}

export const Log = {
    level: 0,
    debug: function(string){
        if (this.level <= LOG_LEVEL.DEBUG) {
            console.log("[DEBUG]:" + string);
        }
    },
    info: function(string){
        if (this.level <= LOG_LEVEL.INFO) {
            console.log("[INFO]:" + string);
        }
    },
    warning: function(string){
        if (this.level <= LOG_LEVEL.WARN) {
            console.log("[WARNING]:" + string);
        }
    },
    error: function(string){
        if (this.level <= LOG_LEVEL.ERROR) {
            console.log("[ERROR]:" + string);
        }
    },
    obj:function (obj){
        var description = "";
        for(var i in obj){
        var property=obj[i];
        description+=i+" = "+property+"\n";
        }
        console.log("[obj]:" + description);
    }

};


// module.exports = Log;