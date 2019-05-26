let api_res=require('../server&routers/API_response');
let dba=require('./database');


postnew=function (req_data) {
    if (req_data.postData){
         if (req_data.postData.game_id && req_data.postData.rounds){
             let game_id=req_data.postData.game_id;
             let rounds=req_data.postData.rounds*1;
             newRoom(game_id,rounds,()=>{
                 api_res.Ok(req_data,true)
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
