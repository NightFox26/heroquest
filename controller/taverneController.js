const configInit    = require("../config/configInit");
const color         = require("../modules/colorsTxt");
const servFunc      = require("../modules/functionServer");

const partieMng = require("../models/manager/PartieMng");

function getTaverneController(req,res){
    res.setHeader('Content-Type', 'text/html'); 
    if(req.session.user != undefined &&  req.session.user != ""){
        res.locals.user =  req.session.user ;
        res.locals.hero =  req.session.hero ;      
        res.locals.page =  "taverne"; 
        var gameMode = configInit.gameMode;
        partieMng.getAllPartieByUserIdAndMode(req.session.hero.id,gameMode,(parties)=>{  
            partieMng.getAllPartiePlayingWithMe(req.session.hero.id,gameMode,(partiesPlayingWithMe)=>{
                if(req.query.idPartie>0){
                    partieMng.getPartieByIdAndHero(req.query.idPartie,req.session.hero.id,(partie)=>{                    
                        if(partie.id!=null){
                            res.sendFlash("normal","Bravo pour cette nouvelle croisade ! On part quand ? ")
                            res.render('taverne.ejs', {gameMode,partie,parties,partiesPlayingWithMe}); 
                        }else{
                            res.sendFlash("angry","Cette partie ne vous appartient pas !!!! ")
                            res.render('taverne.ejs', {gameMode,parties,partiesPlayingWithMe}); 
                        }
                    })
                }else{
                    res.sendFlash("happy","Bienvenue a la taverne du 'Chien errant' "+req.session.hero.name)
                    res.render('taverne.ejs', {gameMode,parties,partiesPlayingWithMe}); 
                } 
            })
        })
    }else{
        req.sendFlash("angry","Vous devez vous connecter pour acceder a la taverne !")
        res.redirect('/login');
    }
}

function getTaverneClassiqueController(req,res){    
    configInit.gameMode = "classique"    
    var opt = {gameMode: configInit.gameMode}    
    req.sendFlash("normal","Le mode de jeu est reglé sur '"+configInit.gameMode+"'")    
    res.setHeader('Content-Type', 'text/html');      
    res.redirect('/taverne');    
}

function getAllWaitingTablesController(req,res,usersInTaverne){  
    if(req.session.user != undefined &&  req.session.user != ""){     
        res.setHeader('Content-Type', 'application/json');        
        let idUserInTavern = servFunc.getAllIdHeroInTavern(usersInTaverne)    
        partieMng.getAllWaitingTables(idUserInTavern,configInit.gameMode,(tables)=>{
            res.end(JSON.stringify(tables));   
        }) 
    }else{
        req.sendFlash("angry","Vous devez vous connecter pour acceder a la taverne !")
        res.redirect('/login');
    }    
}

function getTableInfoController(req,res){  
    if(req.session.user != undefined &&  req.session.user != ""){     
        res.setHeader('Content-Type', 'application/json');
        let idTable = req.query.id;       
        partieMng.getPartieById(idTable,(table)=>{
            res.end(JSON.stringify(table));   
        }) 
    }else{
        req.sendFlash("angry","Vous devez vous connecter pour acceder a la taverne !")
        res.redirect('/login');
    }    
}

function getTaverneTyranniqueController(req,res){
    configInit.gameMode = "tyrannique"
    req.sendFlash("surprised","Le mode de jeu est reglé sur '"+configInit.gameMode+"'")
    var opt = {gameMode: configInit.gameMode}
    res.setHeader('Content-Type', 'text/html');      
    res.redirect('/taverne');   
}

function postTaverneNewCroisadeController(req,res){
    if(req.session.user != undefined &&  req.session.user != ""){
        res.setHeader('Content-Type', 'text/html');
        let mode = req.body.game_mode;
        let name = req.body.game_name;
        let slots = req.body.game_slots;
        let hero = req.session.hero;
        let hero_name = req.session.hero.name;
        partieMng.insertPartieByUserId(name,hero,slots,mode,(partie)=>{
            res.redirect('/taverne?idPartie='+partie.id); 
        })
    }else{
        req.sendFlash("angry","Vous devez vous connecter pour acceder a la taverne !")
        res.redirect('/login');
    } 
}

function postTaverneLoadCroisadeController(req,res){
    if(req.session.user != undefined &&  req.session.user != ""){
        res.setHeader('Content-Type', 'text/html'); 
        console.log("id partie = "+req.body.partie_id)   
        let partie_id = req.body.partie_id;
        res.redirect('/taverne?idPartie='+partie_id);
    }else{
        req.sendFlash("angry","Vous devez vous connecter pour acceder a la taverne !")
        res.redirect('/login');
    }    
}


module.exports = {
    getTaverneController,
    getTaverneClassiqueController,
    getTaverneTyranniqueController,
    postTaverneNewCroisadeController,
    postTaverneLoadCroisadeController,
    getAllWaitingTablesController,
    getTableInfoController
}