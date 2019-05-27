let api_res=require('../server&routers/API_response');
let dba=require('./database');


postnew=function (req , res) {
    const body = req.body
    if (body){
         if (body.game_id && body.rounds){
             const game_id = body.game_id;
             const rounds = body.rounds * 1;
             newRoom(game_id,rounds,()=>{
                 api_res.Ok(req , res ,true)
             });

         }

    }
};
newRoom=function(game_id,rounds,CB){
    let rooms=dba.getRooms();
    rooms.insert({
        id:game_id,
        rounds:rounds,
        players:[],
    });
    if (CB)CB();
};

exports.postnew=postnew;
exports.newRoom=newRoom;
