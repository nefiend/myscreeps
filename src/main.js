// var roleHarvester = require('role.harvester');
// var roleUpgrader = require('role.upgrader');
// var roleBuilder = require('role.builder');
// var roleRepairer = require('role.repairer');
// var roleCarrier= require('role.carrier');
// var Log = require('Log')
// var g_resource_ctl = require('pub')

import { errorMapper } from './modules/errorMapper'
import { Log } from './modules/Log'
import { roleHarvester } from './modules/role.harvester'
import { roleUpgrader } from './modules/role.upgrader'
import { roleBuilder } from './modules/role.builder'
import { roleRepairer } from './modules/role.repairer'
import { roleCarrier } from './modules/role.carrier'
import { g_resource_ctl } from './modules/pub'
import { g_role, creator } from './modules/role.creator'

Log.debug("g_resource_ctl is data:"+g_resource_ctl.data+"len:"+g_resource_ctl.len+"assign:"+g_resource_ctl.assign)

// 游戏入口函数
export const loop = errorMapper(() => {
    /* 删除死亡creep的内存信息 */
    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            if (Memory.creeps[name].pos != undefined) {
                g_resource_ctl.assign[Memory.creeps[name].pos]--;
            }
            delete Memory.creeps[name];
        }
    }
    Log.debug(g_resource_ctl.assign);

    var rcl = Game.spawns['Spawn1'].room.controller.level;

    /* harverster */
    var role = 'harvester';
    var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == role);
    // Log.debug("harvester expect num is " + g_role['harvester'].expectNum)
    if(harvesters.length < g_role[role].expectNum) {
        creator.create(role)
        // var newName = 'harvester' + Game.time;
        // var idx = getArrayMinIdx(g_resource_ctl.assign);
        // var ret = Game.spawns['Spawn1'].spawnCreep(getHarversterType(Game.spawns['Spawn1'].room), newName,
        //     {memory: {role: 'harvester', pos : idx}});
        // if (ret == OK) {
        //     g_resource_ctl.assign[idx]++;
        //     Log.debug("harverster assign:" + g_resource_ctl.assign);
        // } else {
        //     Log.error("harverster spawn failed, ret="+ret);
        // }
    }

    /* builders */
    var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
    if(builders.length < g_role['builder'].expectNum && harvesters.length > 1) {
        creator.create('builder');
        // var newName = 'builder' + Game.time;
        // var ret = Game.spawns['Spawn1'].spawnCreep(getArmerByRoom(Game.spawns['Spawn1'].room), newName,
        //     {memory: {role: 'builder'}});
    }

    /* repairers */
    var repairers = _.filter(Game.creeps, (creep) => creep.memory.role == 'repairer');
    if(repairers.length < g_role['repairer'].expectNum && harvesters.length > 1) {
        creator.create('repairer');
        // var newName = 'repairer' + Game.time;
        // var ret = Game.spawns['Spawn1'].spawnCreep(getArmerByRoom(Game.spawns['Spawn1'].room), newName,
        //     {memory: {role: 'repairer'}});
    }

    /* upgraders */
    var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
    if(upgraders.length < g_role['upgrader'].expectNum && harvesters.length > 1) {
        creator.create('upgrader');
        // var newName = 'upgrader' + Game.time;
        // Game.spawns['Spawn1'].spawnCreep(getArmerByRoom(Game.spawns['Spawn1'].room), newName,
        //     {memory: {role: 'upgrader'}});
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
        // var newName = 'carrier' + Game.time;
        // Game.spawns['Spawn1'].spawnCreep(getCarryByRoom(Game.spawns['Spawn1'].room), newName,
        //     {memory: {role: 'carrier'}});
    }

    if(Game.spawns['Spawn1'].spawning) {
        var spawningCreep = Game.creeps[Game.spawns['Spawn1'].spawning.name];
        Game.spawns['Spawn1'].room.visual.text(
            '🛠️' + spawningCreep.memory.role,
            Game.spawns['Spawn1'].pos.x + 1,
            Game.spawns['Spawn1'].pos.y,
            {align: 'left', opacity: 0.8});
    }

    var tower = Game.getObjectById('63ba6e1c758fbda77246c39c');
    if(tower) {
        var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure) => structure.hits < structure.hitsMax && structure.structureType != STRUCTURE_WALL && structure.structureType != STRUCTURE_RAMPART
        });
        if(closestDamagedStructure) {
            console.log("tower repair!!!")
            tower.repair(closestDamagedStructure);
        }

        var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if(closestHostile) {
            console.log("tower attack!!!")
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