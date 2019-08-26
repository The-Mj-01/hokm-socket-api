
const allGames = {};
let globalGameNum = 0;
getGlobalName = () => `G_${globalGameNum}`;
exports.getPrivate = function (room_id , roomData) {
    if (allGames[room_id]) return allGames[room_id];
    roomData.type='private';
    return create(room_id , roomData)
};

exports.getGlobal = function (roomData = {}) {
    roomData.type='global';
    console.log(getGlobalName());
    if (allGames[getGlobalName()] && !allGames[getGlobalName()]._isGameStarted) return allGames[getGlobalName()];
    globalGameNum++;
    return create(getGlobalName() , roomData)
};

function route( client , mess) {
    const room_id = client.userData.room_id;
    if (allGames[room_id]){
        try{
            if (typeof allGames[room_id].hook ==='function')allGames[room_id].hook(client.id ,mess)
        }
        catch(e){
            console.log(e);
            client.emit("debug",{status:"ISR",err: JSON.parse(JSON.stringify(e)) })
        }
    }

}

removeGame = function (room_id) {
    if(allGames[room_id]) {
        allGames[room_id].removeListeners();
        delete allGames[room_id];

        console.log(`room_id removed`)
    }
};
exports.removeGame = removeGame;
exports.route = route;



const Game = require('./game/gameClass');
function create(room_id , roomData) {
    allGames[room_id] = new Game(room_id,roomData);
    return allGames[room_id]
}






