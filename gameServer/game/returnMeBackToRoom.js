run = function (e , mess) {
    const { client , lastCOM } = mess;
    let index;
    e.commits.forEach((commit , i)=>{
        if (JSON.stringify(commit) === JSON.stringify(lastCOM)) index = i;
    });
    e.commits.forEach((commit , i)=>{
        if (i > index){
            client.emit('GAME' , commit)
        }
    })
};

module.exports = run;