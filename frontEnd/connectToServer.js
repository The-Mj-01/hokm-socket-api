import socket_io from './socket_io'
////import $ from './jquery-2.0.3.min'
import loadingPage from './loadingPage'
import loginPage from './loginPage'
import ui from './ui'
import game_core from './game_core'
import config from './config'
import Debug from './Debug'

let room;
let ns = {};
ns["/hokm"] = "hokm";
ns["/GlobalHokm"] = "globalHokm";
let nameSpace;
let socket = null;
let socket_ID = null;
const serverPort = 443;
const setIntervalTime = 15000;
let lastCOM;
let evenDisconnected = false;
let pingTimeStart = null;
let pinginterval = null;
let pingResp = true;
let token;


let pingTimeDom = $("#pingTime");
let globalGame = {
    id: null,
    userName: null,
    getMyData: function () {
        let pageURL = document.location.href;
        let url = new URL(pageURL);
        this.id = url.searchParams.get('id');
        this.userName = url.searchParams.get("userName") || "USER";
    }

};


const loginRoom = {
    hokm: function () {
        room = document.location.search.replace('?game=', '');
        config.setRoom_id(room);
        socket.emit('loginRoom', {socket_ID, room})
    },
    globalHokm: function () {

        socket.emit('singUpGlobalRoom', {id: globalGame.id, userName: globalGame.userName});
        loginPgae({loginData: false})
    }
};
const connectTOS = function (CB) {

    socket = socketConnect();

    window.socket = socket;

    socket.on("connect", onConnect);
    socket.on("disconnect", (r) => {
        pingTimeDom.html("Disconnected !");
        evenDisconnected = true;
        console.log("socket disconnect", r);
        Debug.log("disconnect")
    });
    socket.on('checkOK', (res) => {
        if (res) {
            loadingPage.load(false);
            loginPgae();
        }

    });
    socket.on('config', (mess) => {
        console.log('config', mess);
        config.setRoom_id(mess.room_id);
        config.setLocation(mess.location);
    });
    socket.on('GAME', (mess) => {
        console.log(mess);
        lastCOM = mess;
        game_core(mess);
        if (mess.mess_ID) socket.emit('_CALLBACK', mess.mess_ID);
        Debug.log("GAME", mess)

    });
    socket.on('connect_error', (error) => {
        console.log('connect_error', error)
    });
    socket.on('error', (error) => {
        console.log('error', error);
        Debug.log("socket error", error);
    });
    socket.on('connect_timeout', (error) => {
        console.log('connect_timeout', error)
    });
    socket.on('reconnect', (x) => {
        console.log('reconnect', x)
    });
    socket.on('reconnecting', (x) => {
        console.log('reconnecting', x)
    });
    socket.on('reconnect_error', (x) => {
        console.log('reconnect_error', x)
    });
    socket.on('reconnect_failed', (x) => {
        console.log('reconnect_failed', x)
    });
    socket.on('setSocketID', (id) => {
        socket_ID = id
    });
    socket.on('room_id', (room_id) => {
        room = room_id
    });
    socket.on('pongT', () => {
        pingResp = true;
        let newTime = new Date().getTime();
        let pingTime = newTime - pingTimeStart;
        updatePingDom(pingTime + " ms");
    });
    socket.on('errBOX', (res) => {
        ui.showMessage(res);
        loadingPage.load(false);
    });
    socket.on('debug', (m) => {
        console.log('deb', m);
        Debug.log("deb", m)
    });
    socket.on('token', (t) => {
        token = t;
    })
};

function getNameSpace() {
    nameSpace = ns[document.location.pathname];
    if (nameSpace === "hokm") {
        room = document.location.search.replace('?game=', '');
        if (!room) {
            loadingPage.load(false);
            ui.showMessage("شماره بازی وجود ندارد.");
            socket.disconnect();
            return
        }
        connectTOS()
    } else if (nameSpace === "globalHokm") {
        globalGame.getMyData();
        config.setMyName(globalGame.userName);
        connectTOS();
    }
}

function loginPgae(data) {
    loginPage(data);
}

function onConnect() {
    Debug.log("connected");
    pingTimeDom.html("Connected");
    if (token) socket.emit('token', token);
    else if (!evenDisconnected) loginRoom[nameSpace]();
    else alert("اتصال شما با سرور ناپایدار است.");
    window.gameEmitor = function (COM, res) {
        if (!socket.connected) return alert('اتصال شما با سرور قطع شده است');
        socket.emit('GAME', {
            COM,
            res
        });
    };
    loadingPage.errBoxRemove();
    if (pinginterval) clearInterval(pinginterval);
    pinginterval = setInterval(ping, setIntervalTime);

}

function socketConnect() {
    let pageURL = document.location;
    socket = socket_io(pageURL.host + `:${serverPort}/${nameSpace}`, {
        reconnection: true,
        reconnectionDelay: 200,
        reconnectionDelayMax: 1000,
        transports: ['websocket']
    });
    socket.heartbeatTimeout = 20000;
    return socket
}

function ping() {
    if (!pingResp) updatePingDom("Time Out!!");
    pingResp = false;
    pingTimeStart = new Date().getTime();
    socket.emit('pingT', true);
}

function updatePingDom(ping) {
    pingTimeDom.html(ping);
}

pingTimeDom.on('click', () => {
    window.socket.emit("debug");
    Debug.show()

});

export default function () {
    getNameSpace()
}

        

