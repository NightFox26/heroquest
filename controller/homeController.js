const configInit    = require("../config/configInit");
const color         = require("../modules/colorsTxt");
const servFunc      = require("../modules/functionServer");

function getHomeController(req,res){
    res.setHeader('Content-Type', 'text/html');     
    if(req.session.user != undefined &&  req.session.user != ""){
        res.locals.user =  req.session.user;                
        res.locals.hero =  req.session.hero;      
        res.locals.page =  "home";          
        let opt = {tyranModeUnlocked: configInit.tyranModeUnlocked,
                   gdxModeUnlocked: configInit.gdxModeUnlocked}         
        res.render('home.ejs', opt); 
    }else{
        req.sendFlash("angry","Vous devez vous connecter pour acceder a l'accueil !")
        res.redirect('/login');
    }
}


module.exports = {
    getHomeController
}