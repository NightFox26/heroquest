const configInit    = require("../config/configInit");
const color         = require("../modules/colorsTxt");
const servFunc      = require("../modules/functionServer");
const game          = require("../game/plateau");

function getGameController(req,res){    
    res.setHeader('Content-Type', 'text/html'); 
    if(req.session.user != undefined &&  req.session.user != ""){ 
        res.locals.user =  req.session.user ;
        res.locals.hero =  req.session.hero ;   
        res.locals.page =  "game";    
        game.runPlateau();    
        color.infoTxt("lancement de l\'etage : "+ req.params.etage + " en mode "+configInit.gameMode); 
        res.render('game-normal.ejs', {gameMode: configInit.gameMode, etage:req.params.etage});
    }else{
        req.sendFlash("angry","Vous devez vous connecter pour acceder au plateau de jeu !")
        res.redirect('/login');
    }   
}


module.exports = {
    getGameController
}