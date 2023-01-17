import { errorMapper } from './modules/errorMapper'
import { Log } from './modules/Log'
import { roleHarvester } from './modules/role.harvester'
import { roleUpgrader } from './modules/role.upgrader'
import { roleBuilder } from './modules/role.builder'
import { roleRepairer } from './modules/role.repairer'
import { roleCarrier } from './modules/role.carrier'
import { g_resource_ctl } from './modules/pub'
import { g_role, creator } from './modules/role.creator'
import { allData } from './modules/data'

Log.debug("g_resource_ctl is data:"+g_resource_ctl.data+"len:"+g_resource_ctl.len+"assign:"+g_resource_ctl.assign)

Log.level = 4
// 游戏入口函数
export const loop = errorMapper(() => {
    /* 删除死亡creep的内存信息 */
    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            if (Memory.creeps[name].pos != undefined) {
                g_resource_ctl.assign[Memory.creeps[name].pos]--;
            }
            delete Memory.creeps[name];
            allData.screepsNum--;
        }
    }
    Log.debug(g_resource_ctl.assign);
    Log.debug("----screeps num:" + allData.screepsNum)
    allData.show();

    var rcl = Game.spawns['Spawn1'].room.controller.level;

    /* harverster */
    var role = 'harvester';
    var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == role);
    // Log.debug("harvester expect num is " + g_role['harvester'].expectNum)
    if(harvesters.length < g_role[role].expectNum) {
        creator.create(role);
    }

    /* builders */
    var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
    if(builders.length < g_role['builder'].expectNum && harvesters.length > 1) {
        creator.create('builder');
    }

    /* repairers */
    var repairers = _.filter(Game.creeps, (creep) => creep.memory.role == 'repairer');
    if(repairers.length < g_role['repairer'].expectNum && harvesters.length > 1) {
        creator.create('repairer');
    }

    /* upgraders */
    var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
    if(upgraders.length < g_role['upgrader'].expectNum && harvesters.length > 1) {
        creator.create('upgrader');
    }

    /* carriers */
    var carriers = _.filter(Game.creeps, (creep) => creep.memory.role == 'carrier');
    if(carriers .length < g_role['carrier'].expectNum &&
        harvesters.length > 1 &&
        Game.spawns['Spawn1'].room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return structure.structureType == STRUCTURE_CONTAINER;
            }
        }).length > 0) {
        creator.create('carrier');
    }

    if(Game.spawns['Spawn1'].spawning) {
        var spawningCreep = Game.creeps[Game.spawns['Spawn1'].spawning.name];
        Game.spawns['Spawn1'].room.visual.text(
            '🛠️' + spawningCreep.memory.role,
            Game.spawns['Spawn1'].pos.x + 1,
            Game.spawns['Spawn1'].pos.y,
            {align: 'left', opacity: 0.8});
    }

    for (let tower of allData.towers) {
        var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure) => structure.hits < structure.hitsMax && structure.structureType != STRUCTURE_WALL && structure.structureType != STRUCTURE_RAMPART
        });
        if(closestDamagedStructure) {
            Log.info("tower repair!!!")
            tower.repair(closestDamagedStructure);
        }

        var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if(closestHostile) {
            Log.info("tower attack!!!")
            tower.attack(closestHostile);
        }
    }

    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        if(creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }

        if(creep.memory.role == 'carrier') {
            roleCarrier.run(creep);
            // roleHarvester.run(creep);
        }

        if(creep.memory.role == 'builder') {
            if(harvesters.length >= g_role['harvester'].expectNum) {
                roleBuilder.run(creep);
            } else {
                roleHarvester.run(creep);
            }
        }

        if(creep.memory.role == 'upgrader') {
            if(harvesters.length >= g_role['harvester'].expectNum) {
                roleUpgrader.run(creep);
            } else {
                roleHarvester.run(creep);
            }
        }

        if(creep.memory.role == 'repairer') {
            if(harvesters.length >= g_role['harvester'].expectNum) {
                roleRepairer.run(creep);
            }
            // roleHarvester.run(creep);
        }

    }
})