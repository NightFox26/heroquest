const configInit        = require("../config/configInit");
const color             = require("../modules/colorsTxt");
const servFunc          = require("../modules/functionServer");
const connectPlateau    = require("../game/connectPlateau");
const partieMng         = require("../models/manager/PartieMng");

function getGameController(req,res){    
    res.setHeader('Content-Type', 'text/html'); 
    if((req.session.user != undefined &&  req.session.user != "") || configInit.testGame){ 

        if(configInit.testGame){
            res.locals.user =  {id:1,name:"thierry",type:"Magicien"};
            res.locals.hero =  {id:1,name:"Nightfox26",type:"Magicien"};
        }else{
            res.locals.user =  req.session.user ;
            res.locals.hero =  req.session.hero ;
        }
        res.locals.page =  "game";    
        let idPartie = req.params.idPartie;        
        
        connectPlateau.runPlateau(idPartie, res.locals.hero.id,(partie)=>{
            if(partie.id){
                let gameMode = partie.mode;
                color.infoTxt("lancement de la partie : "+ idPartie + " en mode "+gameMode); 

                partieMng.getAllPartiePlayingWithMe(res.locals.hero.id,gameMode,(partiesPlayingWithMe)=>{
                    res.render('game.ejs', {gameMode,idPartie,partiesPlayingWithMe});
                });

            }else{
                res.locals.page =  "404";    
                color.errorTxt(partie);
                res.render('404.ejs');
            }
        })
    }else{
        req.sendFlash("angry","Vous devez vous connecter pour acceder au plateau de jeu !")
        res.redirect('/login');
    }   
}

function teleportPlayersToGameBord(){

}

module.exports = {
    getGameController
}