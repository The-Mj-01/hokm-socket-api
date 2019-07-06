define(function(){
    "use strict";


   // var names = ["You", "Octavian", "Antony","la"];
    var names ;
    let myName;
    var   levels = [-1, 1, 2, 3];
    var location;
    var players;
    var room_id;
    var suit;
    var wasteCards=[];

    const STN =  {
        buttom: 0,
        left: 1,
        top: 2,
        right: 3,
    };
    const NTS =  {
        0: "bottom",
        1: "left",
        2: "top",
        3: "right",
    };

    function toName (number) {
        if (typeof number === 'number') return NTS[number];
        else return number
    }

     function toNum (name) {
        if (typeof name === 'string') return STN[name];
        else return name
    }

    return {
        setMyName:function(name){
            myName=name
        },
        getMyName:function(){
            return myName
        },
        getNames:function(){
          return names
        } ,
        levels: levels,
        sync: function(){
          /*  localStorage.setItem("names", JSON.stringify(names));
            localStorage.setItem("levels", JSON.stringify(levels));*/
        },
        setLocation:function (l) {
            l = toName(l);
            console.log('set' , l)
          location = l;
        },
        getLocation:function () {
            return location
        },
        getPlayers:function (array) {
            let me;
            let others= [];
            array.forEach((player)=>{
                player.location = toName(player.location)
                if (player.location === toName(location)) me = player;
                else others.push(player);
            });
            return{ me,others };
        },
        getLocOfPlayers:function (player){
            player.location = toName(player.location);
          if (player) {
              if (location === 'bottom') {
                  if (player.location === 'bottom') return 0;
                  if (player.location === 'left') return 1;
                  if (player.location === 'right') return 3;
                  if (player.location === 'top') return 2;
              } else if (location === 'left') {
                  if (player.location === 'bottom') return 3;
                  if (player.location === 'left') return 0;
                  if (player.location === 'right') return 2;
                  if (player.location === 'top') return 1;
              } else if (location === 'right') {
                  if (player.location === 'bottom') return 1;
                  if (player.location === 'left') return 2;
                  if (player.location === 'right') return 0;
                  if (player.location === 'top') return 3;
              } else if (location === 'top') {
                  if (player.location === 'bottom') return 2;
                  if (player.location === 'left') return 3;
                  if (player.location === 'right') return 1;
                  if (player.location === 'top') return 0;
              }
          }
        },
        getPlayersSaved:function () {
            return players;
        },
        setNames:function (namesOBJ) {
           // alert('set name');
            names=namesOBJ;
        },
        setRoom_id:function (x) {
            room_id=x
        },
        setSuit:function (x) {
            suit=x
        },
        getSuit:function(){
          return suit
        },
        getRoom_id:function () {
            return room_id
        },
        get:function () {
         return this
        },
        getWasteCards:function () {
            return wasteCards
        },
        setWasteCards:function (x) {
            wasteCards=x
        }


}});