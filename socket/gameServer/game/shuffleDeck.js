function run() {
    let carddeck = [];
    for(var i = 0; i < 52; i++) {
        carddeck.push(i);
    }


    for(i = 0; i < 52; i++){
        var ran = Math.floor(Math.random() * (52 - i));
        var tmp = carddeck[ran];
        carddeck[ran] = carddeck[51-i];
        carddeck[51 - i] = tmp;
    }
    
    return carddeck
}
module.exports=run;