const EventEmitter = require('events').EventEmitter;
const color = require("../modules/colorsTxt");

var jeu = new EventEmitter();
jeu.on("start_game",(msg)=>{
    color.warningTxt("tentative de demmarrage du jeu !");
})


const runPlateau = ()=>{
    jeu.emit('start_game');
    console.log("La partie demmarre !");
}

exports.runPlateau = runPlateau;

