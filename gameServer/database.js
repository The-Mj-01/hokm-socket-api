const loki=require('lokijs');
var db;
var rooms;
function newDB() {
     db = new loki('hokm.db');
     rooms = db.addCollection('rooms');
    let a={
        rooms:rooms
    };
    return a

}
function getRooms() {
return rooms;
}
function getRoomsUpdate() {
    return db.getCollection('rooms');
}
exports.newDB=newDB;
exports.getRooms=getRooms;
exports.getRoomsUpdate=getRoomsUpdate;

