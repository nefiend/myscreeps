import { g_resource_ctl } from './pub';

export const roleHarvester = {

    /** @param {Creep} creep **/
    run: function(creep) {
        var idx = creep.memory.pos;
        var sources = g_resource_ctl.data;
        if (idx == undefined) {
            idx = 1;
        }
        // console.log(creep.name+"go go go."+"source is "+sources);
        if(creep.store.getFreeCapacity() > 0) {
            if(creep.harvest(sources[idx]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[idx], {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        } else {
            var targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN || structure.structureType == STRUCTURE_CONTAINER) &&
                            structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                    }
            });
            console.log(creep.name+" "+targets);
            if(targets.length > 0) {
                const closest = creep.pos.findClosestByPath(targets);
                console.log(creep.name+" closest:"+closest);
                if(creep.transfer(closest, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(closest, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
        }
	}
};

