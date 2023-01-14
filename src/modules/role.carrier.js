import { g_resource_ctl } from './pub';

export const roleCarrier = {

    /** @param {Creep} creep **/
    run: function(creep) {
        if(creep.memory.transfering && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.transfering = false;
            creep.say('🔄 withdraw');
        }
        if(!creep.memory.transfering && creep.store.getFreeCapacity() == 0) {
            creep.memory.transfering = true;
            creep.say('🚧 transfer');
        }

        if(!creep.memory.transfering) {
            var dropped = creep.room.find(FIND_DROPPED_RESOURCES);
            const closest = creep.pos.findClosestByPath(dropped);
            if (closest) {
                if(creep.pickup(closest) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(closest, {visualizePathStyle: {stroke: '#ffaa00'}});
                }
            } else {
                var targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_CONTAINER) &&
                                structure.store.getUsedCapacity(RESOURCE_ENERGY) > 0;
                    }
                })

                const closest = creep.pos.findClosestByPath(targets);
                console.log(creep.name+" "+closest);
                if(creep.withdraw(closest, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(closest, {visualizePathStyle: {stroke: '#ffaa00'}});
                }
            }
        } else {
            var targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN || structure.structureType == STRUCTURE_TOWER || Structure.structureType == STRUCTURE_STORAGE) &&
                            structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                    }
            });
            // console.log(creep.name+" "+targets);
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
