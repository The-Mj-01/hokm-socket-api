const loki=require('lokijs');
let db;
let rooms;
function newDB() {
     db = new loki('hokm.db');
     rooms = db.addCollection('rooms');
    return {
        rooms:rooms
    };
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

