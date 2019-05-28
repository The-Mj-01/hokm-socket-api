
let listener={};

function route(id,mess) {
    let room_id = mess.room_id;

    if (room_id){
        if (typeof listener[room_id] ==='function')listener[room_id](id,mess)
    }

}
function newListenner(room_id,CB){
    listener[room_id] = CB
}
function removeListenner(room_id){
    try {
        if (listener[room_id]) delete listener[room_id]

    }
    catch (e) {
        console.log(e)
    }

}
exports.route=route;
exports.newListenner=newListenner;
exports.removeListenner=removeListenner;