import loadingPage from './loadingPage'
import main from './main'
import config from './config'
import ui from './ui'
//import $ from './jquery-2.0.3.min'
import game from './game'

const cardDelay = 170;


let setHokmDOM = $('#setHokm');
let hokm_icon = $("#hokm_icon");
let room_id = config.getRoom_id();
let gameEnd_frame = $('#gameEnd');
let desk = $("#team-score");

$('#hokm_gish').click(() => {
    send_hokm('gish')
});
$('#hokm_del').click(() => {
    send_hokm('del')
});
$('#hokm_pik').click(() => {
    send_hokm('pik')
});
$('#hokm_khesht').click(() => {
    send_hokm('khesht')
});
let testBut = $("#testBut");
testBut.click(() => {
    window.socket.emit("getMyID", true);
});

function send_hokm(hokm) {
    if (window.socket.connected) {
        window.gameEmitor('setHokm', {hokm});
        setHokmDOM.removeClass('show').addClass('hide');
    }
}

const game_start = function (mess) {
    let location = {};
    loadingPage.errBoxRemove();
    loadingPage.load(false);
    let players = config.getPlayers(mess);
    location = players.me.location;
    if (location === 0) config.setNames([players.me.name, players.others[0].name, players.others[1].name, players.others[2].name]);
    if (location === 1) config.setNames([players.me.name, players.others[1].name, players.others[2].name, players.others[0].name]);
    if (location === 3) config.setNames([players.me.name, players.others[0].name, players.others[1].name, players.others[2].name]);
    if (location === 2) config.setNames([players.me.name, players.others[2].name, players.others[0].name, players.others[1].name]);
    main()

};
const game_setHakem = function (mess) {
    game.run.setStatus('setHakem', true);

    let hakem = config.getLocOfPlayers(mess.hakem);
    if (mess.roundOne) {
        const start = config.getLocOfPlayers(mess.start);
        for (let i = 0; i <= mess.i; i++) {
            let player = (start + i) % 4;
            game.run.moveCard.toPlayer(player, mess.cards[i]);
        }
    }
    setTimeout(() => {
        game.run.setHakem(hakem);
        ui.showMoveMess('حاکم: ' + mess.hakem.name)
    }, 1000);

};
const game_newRound = function (mess) {
    if (mess.mode === 'setHokm') {
        let cards = mess.hakemCards;
        let hakem = mess.hakem;
        game.run.setStatus('clearTable', true);
        let hakem_location = config.getLocOfPlayers(hakem);
        if (cards) {
            let i = 0;
            cards.forEach(() => {
                game.run.moveCard.toPlayer(hakem_location, cards[i]);
                i++
            })

        }
    } else if (mess.mode === 'allPlayers') {
        let cards = mess.cards;
        let hakem = mess.hakem;
        let hakem_location = config.getLocOfPlayers(hakem);
        if (cards) {

            let five = 0;
            let r = 0, newfive = 0;
            let i = 0;

            const moveA = () => {
                if (r === 3) newfive = 1;
                if (five === 5) {
                    five = newfive;
                    r++;
                }
                five++;
                const player = (hakem_location + r) % 4;
                if (!(r === 0 && newfive === 0)) game.run.moveCard.toPlayer(player, mess.cards[i]);
                i++;
                moveB()
            };

            const moveB = () => {
                setTimeout(() => {
                    if (i < cards.length) moveA();
                }, cardDelay)
            };

            moveA();

        }
    }
};
const game_setHokm = function (mess) {
    if (mess) {
        ui.hideMessage();
        const pos = config.getLocOfPlayers(mess);
        if (pos === 0) setHokmDOM.removeClass('hide').addClass('show');
    }
};
const game_hokmSeted = function (mess) {
    setHokmDOM.removeClass('show').addClass('hide');
    const x = {
        khesht: 'حکم خشت',
        pik: 'حکم پیک',
        del: 'حکم دل',
        gish: 'حکم گیشنیز'
    };
    hokm_icon.removeClass().addClass("hokm_icon").addClass(mess);
    ui.showMoveMess(x[mess])
};
const game_setTurn = function (mess) {
    ui.hideMessage();
    let players = game.run.getPlayers();
    players.forEach((player) => {
        player.display.setTurn(false);
    });
    if (mess.player) {
        let loc = config.getLocOfPlayers(mess.player);
        if (loc === 0) {
            ui.showMoveMess('نوبت شما');
            let yourCard = game.run.getPlayers()[0].row.cards;
            let suit = mess.suit;
            config.setSuit(suit);
            if (suit === 'notSet') {
                yourCard.forEach((card) => {
                    card.display.setSelectable(true)
                });
            } else {
                let i = 0;
                yourCard.forEach((card) => {
                    if (card.suit  === suit ) {
                        card.display.setSelectable(true);
                        i++
                    }
                    else card.display.grayScale(true);
                });
                if (i === 0) {
                    yourCard.forEach((card) => {
                        card.display.setSelectable(true);
                        card.display.grayScale(false);
                        card.adjustPos();

                    });
                }
            }
        } else players[loc].display.setTurn(true);

    }
};
const playerPickCard = function (mess) {
    let playerLoc = config.getLocOfPlayers({location: mess.location});

    let player = game.run.getPlayers()[playerLoc];
    let cards = player.row.cards;
    const [card] = cards.filter(c => c.id === mess.card.id);
    if (card) {
        let x = config.getWasteCards();
        x.push(cards);
        config.setWasteCards(x);
        game.run.moveCard.toTable(playerLoc, card)
    }
};
const toWaste = function (mess) {
    game.run.toWast();
    game.run.setStatus("endRound", true);
    game.run.setStatus("newRound", true);
};
const game_alert = function (mess) {
    loadingPage.load(false);
    ui.showMessage(mess)
};

function deskMove(x) {
    x ? desk.removeClass("hide").addClass("show") : desk.removeClass("show").addClass("hide")
}

const teamScore = function (mess) {
    function getOurTeam(loc) {
        if (loc === 2 || loc === 0) return {our: "topB", their: "rightL"};
        else if (loc === 3 || loc === 1) return {our: "rightL", their: "topB"};
    }

    function roundPrint(our, their) {
        $("#score-rounds").html("حریف " + their + " | " + our + " ما ")
    }

    function gamePrint(our, their) {
        $("#score-games").html("حریف " + their + " | " + our + " ما ")

    }

    let location = config.getLocation();
    let teamLoc = getOurTeam(location);
    let round = mess.round;
    let game = mess.game;
    roundPrint(round[teamLoc.our], round[teamLoc.their]);
    gamePrint(game[teamLoc.our], game[teamLoc.their]);
    deskMove(true);
    setTimeout(() => {
        deskMove(false)
    }, 3000)
};
const gameEnd = function (mess) {
    gameEnd_frame.removeClass("hide").addClass("show");
    deskMove(true);
    if (mess.player.name) ui.showMessage( `${mess.player.name}از بازی خارج شد`);
    // setTimeout(() => {
    //     ui.hideMessage()
    // }, 2000);
    window.socket.disconnect();
};
const game_newPlayer = function (mess) {
    ui.showMoveMess(`${mess.name} وارد بازی شد `);
    setTimeout(() => {
        ui.showMessage(`آنلاین ها: ${mess.length}`)
    }, 2000)
};
const game_leftPlayer = function (mess) {
    ui.showMoveMess(`${mess.name} از بازی خارج شد `);
    setTimeout(() => {
        ui.showMessage(`آنلاین ها: ${mess.length}`)
    }, 2000)
};
const chat = function (mess) {
    let playerLoc = config.getLocOfPlayers({location: mess.location});
    game.run.chatPlayer(playerLoc, mess.message)
};
const player_disconnect = function (mess) {
    let playerLoc = config.getLocOfPlayers({location: mess.location});
    game.run.chatPlayer(playerLoc, "آفلاین شد");
    const player = game.run.returnPlayer(playerLoc);
    player.display.offline(true);
};
const player_connect = function (mess) {
    let playerLoc = config.getLocOfPlayers({location: mess.location});
    game.run.chatPlayer(playerLoc, "آنلاین شد");
    const player = game.run.returnPlayer(playerLoc);
    player.display.offline(false);
};


let routers = {
    'game_start': game_start,
    'setHakem': game_setHakem,
    'newRound': game_newRound,
    'setHokm': game_setHokm,
    'hokmSeted': game_hokmSeted,
    'setTurn': game_setTurn,
    'playerPickCard': playerPickCard,
    'toWaste': toWaste,
    'alert': game_alert,
    'teamScore': teamScore,
    'gameEnd': gameEnd,
    'newPlayer': game_newPlayer,
    'leftPlayer': game_leftPlayer,
    'chat': chat,
    'player_disconnect': player_disconnect,
    'player_connect': player_connect

};
export default function (mess) {
    room_id = config.getRoom_id();
    let COM;
    let res;
    if (mess.COM) COM = mess.COM;
    if (mess.res) res = mess.res;
    if (typeof routers[COM] === "function") routers[COM](res);
};
