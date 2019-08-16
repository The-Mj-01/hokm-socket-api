////import $ from './jquery-2.0.3.min'
import { setName } from './connectToServer'

let userName;
let location;
let forceStopDom = $("#forceStop");




function gameForceStop() {
    forceStopDom.click(forceStop);
    $(".forceStopIcon").removeClass('hide').addClass('show').click(() => {
        $(".stopFrame").removeClass('hide').addClass('show');
        $("#game-region").addClass('blur');

    });


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

export default function () {
        $('#login_page').removeClass("hide").addClass("show");
        $('#loginButton').click(() => {
            setName($('#userName').val())
        });
};


