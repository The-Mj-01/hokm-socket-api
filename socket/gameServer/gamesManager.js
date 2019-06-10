
const allGames = {};

createPrivate = function (room_id , roomData) {
    roomData.type="private";
    roomData.namespace="hokm";
    create(room_id , roomData)
};

createGlobal = function (room_id , roomData) {
    roomData.type="global";
    roomData.namespace="globalHokm";
    create(room_id , roomData)
};

function route(id , mess , client) {
    const room_id = mess.room_id;
    if (allGames[room_id]){
        try{
            if (typeof allGames[room_id].hook ==='function')allGames[room_id].hook(id,mess)
        }
        catch(e){
            console.log(e)
            client.emit("debug",{status:"ISR",err: JSON.parse(JSON.stringify(e)) })
        }
    }

}

removeGame = function (room_id) {
    if(allGames[room_id]) delete allGames[room_id];
};
exports.createPrivate = createPrivate;
exports.createGlobal = createGlobal;
exports.removeGame = removeGame;
exports.route = route;


const Game = require('./game/gameClass');
function create(room_id , roomData) {
    const game = new Game(room_id,null,roomData);
    allGames[room_id] = game;
    game.setStatus('start');
    game.run();
    return game
}






