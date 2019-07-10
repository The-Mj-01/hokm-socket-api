
define(['./socket/game_toWaste','./socket/newPlayer','./socket/gameStart','./socket/game_setHakem','./socket/game_newRound','./socket/game_setHokm','./socket/game_hokmSeted','./socket/game_setTurn','./socket/game_playerPickCard','./ui','./socket/test','./socket/game_teamScore'],
       (toWaste,            GAME_newPlayer,      GAME_start,         GAME_setHakem,            game_newRound,            game_setHokm ,          game_hokmSeted             ,game_setTurn                 ,playerPickCard,                ui     ,tset     ,teamScore   )=>{



    let routers={
        'newPlayer':GAME_newPlayer,
        'game_start':GAME_start,
        'setHakem':GAME_setHakem,
        'newRound':game_newRound,
        'setHokm':game_setHokm,
        'hokmSeted':game_hokmSeted,
        'setTurn':game_setTurn,
        'playerPickCard':playerPickCard,
        'toWaste':toWaste,
        'alert':(mess)=>{ui.showMessage(mess)},
        'test':tset,
        'teamScore':teamScore
    };
    return function (mess) {

        let COM;
        let res;
        if (mess.COM) COM=mess.COM;
        if (mess.res) res=mess.res;


        if (typeof routers[COM]==="function"){
            routers[COM](res);
        }
        //loadingPage.errBox('!!GAME START');
    };
});