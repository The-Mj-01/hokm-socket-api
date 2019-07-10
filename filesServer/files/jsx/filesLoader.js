const urls = ['./files/img/carp.jpg', './files/img/club.png' , './files/img/crown.png' , './files/img/diamond.png' ,'./files/img/flip.png' ,'./files/img/heart.png' , './files/img/card/0.png', './files/img/card/1.png', './files/img/card/2.png', './files/img/card/3.png']
define([],()=>{
    urls.forEach((url)=>{
        console.log(url);
        const img = document.createElement('img');
        img.setAttribute('src' , url)
    })
})