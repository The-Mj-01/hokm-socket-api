var names;
let myName;
var levels = [-1, 1, 2, 3];
var location;
var players;
var room_id;
var suit;
var wasteCards = [];

const STN = {
    buttom: 0,
    left: 1,
    top: 2,
    right: 3,
};
const NTS = {
    0: "bottom",
    1: "left",
    2: "top",
    3: "right",
};

export default {
    setMyName: function (name) {
        myName = name
    },
    getMyName: function () {
        return myName
    },
    getNames: function () {
        return names
    },
    levels: levels,
    sync: function () {
        /*  localStorage.setItem("names", JSON.stringify(names));
          localStorage.setItem("levels", JSON.stringify(levels));*/
    },
    setLocation: function (l) {
        location = l;
    },
    getLocation: function () {
        return location
    },
    getPlayers: function (array) {
        let me;
        let others = [];
        array.forEach((player) => {
            if (player.location === location) me = player;
            else others.push(player);
        });
        return {me, others};
    },
    getLocOfPlayers: function (player) {
            if (location === 0) {
                if (player.location === 0) return 0;
                if (player.location === 1) return 1;
                if (player.location === 3) return 3;
                if (player.location === 2) return 2;
            } else if (location === 1) {
                if (player.location === 0) return 3;
                if (player.location === 1) return 0;
                if (player.location === 3) return 2;
                if (player.location === 2) return 1;
            } else if (location === 3) {
                if (player.location === 0) return 1;
                if (player.location === 1) return 2;
                if (player.location === 3) return 0;
                if (player.location === 2) return 3;
            } else if (location === 2) {
                if (player.location === 0) return 2;
                if (player.location === 1) return 3;
                if (player.location === 3) return 1;
                if (player.location === 2) return 0;
            }

    },
    getPlayersSaved: function () {
        return players;
    },
    setNames: function (namesOBJ) {
        // alert('set name');
        names = namesOBJ;
    },
    setRoom_id: function (x) {
        room_id = x
    },
    setSuit: function (x) {
        suit = x
    },
    getSuit: function () {
        return suit
    },
    getRoom_id: function () {
        return room_id
    },
    get: function () {
        return this
    },
    getWasteCards: function () {
        return wasteCards
    },
    setWasteCards: function (x) {
        wasteCards = x
    }
}


