const configInit    = require("../../config/configInit");
const color         = require("../../modules/colorsTxt");
const servFunc      = require("../../modules/functionServer");

const heroMng       = require("../../models/manager/HeroMng");
var Monster         = require("../../models/Monster");

function getGlobalSocketController(io){    
    io.on('connection', (socket) => {

        socket.on("getPersoFiche",({typeMonster=undefined,idPerso=undefined})=>{
            envoiFichePerso(typeMonster,idPerso,socket)
        });
    })
}

function envoiFichePerso(typeMonster,idPerso,socket){
    if(typeMonster !== undefined){
        console.log("je souhaite les infos sur le "+typeMonster);
        socket.emit("receivePersoFiche",new Monster("Rat"))
    }else if(idPerso !== undefined){
        console.log("je souhaite les infos un heros qui a l'id : "+idPerso);
        heroMng.getHeroById(idPerso,(hero)=>{
            socket.emit("receivePersoFiche",hero)
        });
    }  
}


module.exports = {
    getGlobalSocketController
}