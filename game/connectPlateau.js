const EventEmitter = require('events').EventEmitter;
const partieMng = require("../models/manager/PartieMng");
const color = require("../modules/colorsTxt");

var jeu = new EventEmitter();
jeu.on("start_game",(partie_id)=>{
    color.successTxt("La partie "+partie_id+" demmarre !");
})

const runPlateau = (idPartie,heroId,cb)=>{
    partieMng.getPartieById(idPartie,(partie)=>{    
        if( partie.hero_1_id == heroId ||
            partie.hero_2_id == heroId ||
            partie.hero_3_id == heroId ||
            partie.hero_4_id == heroId ){
                partieMng.uppdatePartieStatusById(partie,"playing",()=>{  
                    jeu.emit('start_game',partie.id);
                    
                    cb(partie);
                })                
        } else {
            cb("le hero " +heroId+" n'appartient pas a la partie "+idPartie);
        }
    })
}

exports.runPlateau = runPlateau;

