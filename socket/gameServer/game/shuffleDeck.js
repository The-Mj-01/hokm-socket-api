function run() {
    let carddeck = [];
    for(let i = 0; i < 52; i++) {
        carddeck.push(i);
    }


    for(let i = 0; i < 52; i++){
        let ran = Math.floor(Math.random() * (52 - i));
        let tmp = carddeck[ran];
        carddeck[ran] = carddeck[51-i];
        carddeck[51 - i] = tmp;
    }
    
    return carddeck
}
module.exports=run;