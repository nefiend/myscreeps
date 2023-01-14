import { Log } from "./Log";
import { g_resource_ctl } from "./pub";
import { roleRepairer } from "./role.repairer";

export const roleBuilder = {

    /** @param {Creep} creep **/
    run: function(creep) {

        // Log.debug("building is:" + creep.memory.building);
        // Log.debug("store is:" + creep.store[RESOURCE_ENERGY]);
        // Log.debug("room find construction is:" + creep.room.find(FIND_CONSTRUCTION_SITES));

        if(creep.memory.building && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.building = false;
            creep.say('🔄 harvest');
        }
        if(!creep.memory.building && creep.store.getFreeCapacity() == 0) {
            creep.memory.building = true;
            creep.say('🚧 build');
        }

        if(creep.memory.building) {
            var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
            const closest = creep.pos.findClosestByPath(targets);
            console.log(creep.name+" closest:"+closest);
            if(targets.length) {
                if(creep.build(closest) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(closest, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            } else {
                roleRepairer.run(creep);
            }
        } else {
            var targets = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_CONTAINER || structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) &&
                            structure.store.getUsedCapacity(RESOURCE_ENERGY) > 100;
                }
            })

            if (creep.memory.harverster && targets.length >= 1) {
                creep.memory.harverster = false;
            }
            if (!creep.memory.harverster && targets.length < 1) {
                creep.memory.harverster = true;
            }
            if (creep.memory.harverster) {
                const rsc = g_resource_ctl.data;
                console.log(creep.name+" haverstering");
                if(creep.harvest(rsc[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(rsc[0], {visualizePathStyle: {stroke: '#ffaa00'}});
                }

            } else {
                const closest = creep.pos.findClosestByPath(targets);
                console.log(creep.name+" "+closest);
                if(creep.withdraw(closest, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(closest, {visualizePathStyle: {stroke: '#ffaa00'}});
                }
            }
        }
    }
};
