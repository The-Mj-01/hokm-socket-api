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
          location=l;
        },
        getLocation:function () {
            return location
        },
        getPlayers:function (array) {
            let me,others=[],i=0;
            array.forEach(()=>{
                if (array[i].location===location)me=array[i];
                else others.push(array[i]);
                i++;
            });
            players={me,others};
            return players
        },
        getLocOfPlayers:function (player){
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