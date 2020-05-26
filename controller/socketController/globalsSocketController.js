const configInit    = require("../../config/configInit");
const color         = require("../../modules/colorsTxt");
const servFunc      = require("../../modules/functionServer");

const heroMng       = require("../../models/manager/HeroMng");
var Monster         = require("../../models/Monster");
const partieMng     = require("../../models/manager/PartieMng");
const letterMng     = require("../../models/manager/LetterMng");

function getGlobalSocketController(io){    
    io.on('connection', (socket) => {        

        //fiche perso
        socket.on("getPersoFiche",({typeMonster=undefined,idPerso=undefined})=>{
            envoiFichePerso(typeMonster,idPerso,socket)
        });

        //systeme de lettres
        socket.on("getAllLetters",(idHero)=>{
            letterMng.countNotRead(idHero,(nb)=>{                
                socket.emit("countLetterNotRead",nb)
            })

            letterMng.getAllLetterByHero(idHero,(letters)=>{
                socket.emit("allLetters",letters)
            })
        })

        socket.on("readLetter",({idLetter,heroId})=>{            
            letterMng.setReadedLetter(idLetter,(letter)=>{                
                letterMng.countNotRead(heroId,(nb)=>{                
                    socket.emit("countLetterNotRead",nb)
                })  
                letterMng.getLetterById(idLetter,(letter)=>{
                    socket.emit("readLetter",letter)
                })             
            })
        })

        socket.on("deleteLetter",(idLetter)=>{
            letterMng.deleteLetterById(idLetter,()=>{
                socket.emit("deleteLetter",idLetter);
            })
        })

        socket.on("sendLetter",({from_heroId,for_heroId,letter})=>{
            letterMng.addLetter(from_heroId,for_heroId,letter)            
        })

        
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