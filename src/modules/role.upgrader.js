// var roleHarvester = require('role.harvester')
import { roleHarvester } from "./role.harvester";

export const roleUpgrader = {

    /** @param {Creep} creep **/
    run: function(creep) {

        if(creep.memory.upgrading && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.upgrading = false;
            creep.say('🔄 harvest');
	    }
	    if(!creep.memory.upgrading && creep.store.getFreeCapacity() == 0) {
	        creep.memory.upgrading = true;
	        creep.say('⚡ upgrade');
	    }

	    if(creep.memory.upgrading) {
            if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ffffff'}});
            }
        }
        else {
            var targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_SPAWN || structure.structureType == STRUCTURE_CONTAINER) &&
                            structure.store.getUsedCapacity(RESOURCE_ENERGY) > 0;
                    }
            });
            const closest = creep.pos.findClosestByPath(targets);
            console.log(creep.name+" closest:"+closest);
            if (closest == undefined) {
                roleHarvester.run(creep);
            } else {
                if(creep.withdraw(closest, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(closest, {visualizePathStyle: {stroke: '#ffaa00'}});
                }
            }
        }
	}
};

// module.exports = roleUpgrader;