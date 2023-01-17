import { all } from "lodash";
import { Log } from "./Log";

export var allData = {
    screepsNum: 0,
    roomsNum: 0,
    rooms:[],
    sources: [],
    towers: [],
    show: function(){
        var str =`
            screepsNum = ${this.screepsNum}
            roomsNum = ${this.roomsNum}
            rooms = ${this.rooms}
            sources = ${this.sources}
            towers = ${this.towers}
            `;
        Log.error(str)
    }
}

// function ResourceBlk(spawn_name) {
//     this.data = Game.spawns[spawn_name].room.find(FIND_SOURCES);
//     this.len = this.data.length;
//     this.assign = new Array(this.len);
//     for (var i = 0; i < this.len; i++) {
//         this.assign[i] = 0;
//     }
// }

// export const g_resource_ctl = new ResourceBlk("Spawn1");

for (var name in Game.creeps) {
    allData.screepsNum++;
    allData.rooms = Game.rooms
}

for (var name in Game.rooms) {
    allData.roomsNum++;
    let data = Game.rooms[name].find(FIND_SOURCES);
    // Log.obj(data[0]);
    // Log.error(data[0].ticksToRegeneration);
    allData.sources = data;


    let towers = Game.rooms[name].find(FIND_STRUCTURES, {
        filter: {structureType: STRUCTURE_TOWER}
    });
    // Log.obj(data[0]);
    // Log.error(data[0].ticksToRegeneration);
    allData.towers = towers;
}
