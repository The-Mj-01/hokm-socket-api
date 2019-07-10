////import $ from './jquery-2.0.3.min'
import loadingPage from './loadingPage'
import config from './config'
import ui from './ui'

let userName;
let location;
let room = config.getRoom_id();
let forceStopDom = $("#forceStop");

function loadingPageX() {
    $('#login_page').removeClass('show').addClass('hide');
    ui.showMessage("تا رسیدن بقیه بازیکن ها صبر کنید.");
    loadingPage.load(true);
    gameForceStop();

}

function send() {
    if (userName) {
        let socket = window.socket;
        socket.emit('loginRoomStart', {room_id: room, userName: userName, location: location});
        socket.on('LoginOk', (location) => {
            config.setLocation(location);
            loadingPageX();
        })
    }
}

function gameForceStop() {
    forceStopDom.click(forceStop);
    $(".forceStopIcon").removeClass('hide').addClass('show').click(() => {
        $(".stopFrame").removeClass('hide').addClass('show');
        $("#game-region").addClass('blur');

    });

    $("#forceStopCancel").click(() => {
        $(".stopFrame").removeClass('show').addClass('hide');
        $("#game-region").removeClass('blur');

    })
}

function forceStop() {
    let room_id = config.getRoom_id();
    window.socket.emit('GAME', {
        room_id: room_id,
        COM: "forceStop",
        res: {
            name: userName,
            location: location,
        }
    });
    $(".stopFrame").removeClass('show').addClass('hide');
}

export default function (data) {
    room = config.getRoom_id();
    if (data) {
        if (data.loginData === false) {
            userName = config.getMyName();
            loadingPageX()
        }
    } else {
        $("#login_page").removeClass("hide").addClass("show");
        location = "auto";
        userName = null;
        $('#loginButton').click(function () {
            userName = $('#userName').val();
            send()
        });



    }

};


