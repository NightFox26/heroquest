const configInit    = require("../../config/configInit");
const color         = require("../../modules/colorsTxt");
const servFunc      = require("../../modules/functionServer");
const heroMng       = require("../../models/manager/HeroMng");
const partieMng     = require("../../models/manager/PartieMng");

function getGameSocketController(io){    

    const io_game = io.of("/game")
    io_game.on('connection', (socket) => {        
        var ID_PARTIE = 0;
        
        //le joueur rejoint le canal de la partie
        socket.on("joinGame",(idPartie)=>{
            ID_PARTIE = idPartie;
            color.infoTxt('Un utilisateur se connecte au plateau de jeu' + ID_PARTIE);
            socket.join("game_"+ID_PARTIE)
        })

        //le server recoit un message
        socket.on('message', ({heroId,msg,canal="general"}) => { 
            heroMng.getHeroById(heroId,(hero)=>{                
                let dateTime = moment().format('DD/MM -- H:mm');
                console.log( dateTime+" --- "+hero.name+ " dit = "+msg) 
                io_game.to(canal).emit('message',{hero,msg,dateTime,canal})
            })
        });












        //Routine de verification de la partie
        socket.on("runtimeChecking",({idPartie})=>{
            partieMng.getPartieById(idPartie,(partie)=>{
                if(partie.status != "playing"){
                    io.emit("redirectToTaverne",idPartie)
                }
            })
        }) 

        socket.on('disconnect', (reason) => {
            color.errorTxt('un joueur quitte le plateau de jeu');
        });
    });
}



module.exports = {
    getGameSocketController
}