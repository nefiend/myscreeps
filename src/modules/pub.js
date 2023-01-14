function ResourceBlk(spawn_name) {
    this.data = Game.spawns[spawn_name].room.find(FIND_SOURCES);
    this.len = this.data.length;
    this.assign = new Array(this.len);
    for (var i = 0; i < this.len; i++) {
        this.assign[i] = 0;
    }
}

export const g_resource_ctl = new ResourceBlk("Spawn1");

for (var name in Game.creeps) {
    var tmp = Memory.creeps[name].pos;
    if (tmp != undefined) {
        g_resource_ctl.assign[tmp]++;
    }
}