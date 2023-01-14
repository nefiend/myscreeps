/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('Log');
 * mod.thing == 'a thing'; // true
 */

export const Log = {
    flag: 0,
    debug: function(string){
        console.log("[DEBUG]:" + string);
    },
    warning: function(string){
        console.log("[WARNING]:" + string);
    },
    error: function(string){
        console.log("[ERROR]:" + string);
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