import { g_resource_ctl } from './pub'
import { Log } from './Log'

/** @param {Array} arr**/
function getArrayMinIdx(arr) {
    return arr.indexOf(Math.min.apply(null, arr));
}

function getHarversterType(room){
    var i;
    var armer = [CARRY,MOVE];
    var rcl = room.controller.level;

    for (i = 0; i < rcl; i++) {
        if (100 + 100 * (i + 1) > room.energyCapacityAvailable) {
            break;
        }
        armer.push(WORK);
    }
    return armer.sort();
}

function getArmerByRoom(room) {
    var i;
    var armer = [];
    var rcl = room.controller.level;

    for (i = 0; i < rcl; i++) {
        if (200 * (i + 1) > room.energyCapacityAvailable) {
            break;
        }
        armer.push.apply(armer, [WORK,CARRY,MOVE]);
    }

    return armer.sort();
}

function getCarryByRoom(room) {
    var i;
    var armer = [];
    var rcl = room.controller.level;

    for (i = 0; i < rcl; i++) {
        if (100 * (i + 1) > room.energyCapacityAvailable) {
            break;
        }
        armer.push.apply(armer, [CARRY,MOVE]);
    }
    return armer.sort();
}

export const g_role = {
    harvester: {
        expectNum: 4,
        getArmerType: function(room) {
            return getHarversterType(room);
        }
    },
    builder: {
        expectNum: 2,
        getArmerType: function(room) {
            return getArmerByRoom(room);
        }
    },
    upgrader: {
        expectNum: 2,
        getArmerType: function(room) {
            return getArmerByRoom(room);
        }
    },
    carrier: {
        expectNum: 2,
        getArmerType: function(room) {
            return getCarryByRoom(room);
        }
    },
    repairer: {
        expectNum: 1,
        getArmerType: function(room) {
            return getArmerByRoom(room);
        }
    }
}

export const creator = {
    /* 创建角色 */
    /** @param {String} role **/
    create: function(role) {
        var newName = role + Game.time;
        var idx = getArrayMinIdx(g_resource_ctl.assign);
        var armerType = g_role[role].getArmerType(Game.spawns['Spawn1'].room);

        var ret = Game.spawns['Spawn1'].spawnCreep(armerType, newName,
            role == 'harvester' ? {memory: {role: role, pos : idx}} : {memory: {role: role}});
        if (ret == OK && role == 'harvester') {
            g_resource_ctl.assign[idx]++;
            Log.debug("harverster assign:" + g_resource_ctl.assign);
        } else {
            Log.error(role+" spawn failed, ret="+ret);
            Log.error(role+" armer type is:"+armerType);
        }
    }
};