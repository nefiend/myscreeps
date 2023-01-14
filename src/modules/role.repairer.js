// var Log = require('Log')
import { Log } from "./Log";

export const roleRepairer = {

    /** @param {Creep} creep **/
    run: function(creep) {

        // Log.debug("building is:" + creep.memory.repairing);
        // Log.debug("store is:" + creep.store[RESOURCE_ENERGY]);
        // Log.debug("room find construction is:" + creep.room.find(FIND_CONSTRUCTION_SITES));

        if(creep.memory.repairing && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.repairing = false;
            creep.say('🔄 harvest');
        }
        if(!creep.memory.repairing && creep.store.getFreeCapacity() == 0) {
            creep.memory.repairing = true;
            creep.say('🚧 repair');
        }

        if(creep.memory.repairing) {
            var targets = creep.room.find(FIND_STRUCTURES, {
                filter: object => object.hits < object.hitsMax
            });

            targets.sort((a,b) => a.hits - b.hits);

            if(targets.length > 0) {
                if(creep.repair(targets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0]);
                }
            }
        } else {
            var sources = creep.room.find(FIND_SOURCES);
            if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[0], {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        }
    }
};

// module.exports = roleRepairer;