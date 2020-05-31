const configInit    = require("../config/configInit");
const color         = require("../modules/colorsTxt");
const servFunc      = require("../modules/functionServer");
const connectPlateau          = require("../game/connectPlateau");

function getGameController(req,res){    
    res.setHeader('Content-Type', 'text/html'); 
    if(req.session.user != undefined &&  req.session.user != ""){ 
        res.locals.user =  req.session.user ;
        res.locals.hero =  req.session.hero ;   
        res.locals.page =  "game";    
        let idPartie = req.params.idPartie;
        let gameMode = req.params.gameMode;
        
        connectPlateau.runPlateau(idPartie, res.locals.hero.id,(partie)=>{
            if(partie.id){
                color.infoTxt("lancement de la partie : "+ idPartie + " en mode "+gameMode); 
                res.render('game-normal.ejs', {gameMode,idPartie});
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


module.exports = {
    getGameController
}