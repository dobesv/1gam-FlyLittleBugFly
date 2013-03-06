function loadSound(id, maxPlaying) {
    var path = 'sounds/'+id;
    if (pc.device.soundEnabled)
        pc.device.loader.add(new pc.Sound('sounds/'+id, path, ['ogg','mp3'], maxPlaying || 1));
};
function playSound(id, volume, loop) {
    if (!pc.device.soundEnabled) return;
    var sound = pc.device.loader.get(id+' sound').resource;
    sound.setVolume(volume || 1);
    sound.play(loop || false);
};
function loadImage(name) {
    var path = 'images/'+name;
    var id = 'images/'+name.replace(/\....$/, "");
    pc.device.loader.add(new pc.Image(id, path));
};
function getImage(name) {
    var id = name.replace(/\....$/, "");
    return pc.device.loader.get('images/'+id).resource;
}
function loadTileMap(name) {
    var id = name.replace(/\.tmx$/, "");
    pc.device.loader.add(new pc.DataResource('tilemaps/'+id, 'data/'+id+'.tmx'));
}
function getTileMap(name) {
    var id = name.replace(/\.tmx$/, "");
    return pc.device.loader.get('tilemaps/'+id).resource;
}