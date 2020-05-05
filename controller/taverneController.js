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
        partieMng.getAllPartieByUserId(req.session.hero.id,(parties)=>{  
            if(req.query.idPartie>0){
                let partie = partieMng.getPartieById(req.query.idPartie,(partie)=>{
                    res.sendFlash("normal","Bravo pour cette nouvelle croisade ! On part quand ? ")
                    res.render('taverne.ejs', {gameMode: configInit.gameMode,partie:partie,parties:parties}); 
                })
            }else{
                res.sendFlash("happy","Bienvenue a la taverne du 'Chien errant' "+req.session.hero.name)
                res.render('taverne.ejs', {gameMode: configInit.gameMode,parties:parties}); 
            } 
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
    res.setHeader('Content-Type', 'application/json');        
    let idUserInTavern = servFunc.getAllIdHeroInTavern(usersInTaverne)
    partieMng.getAllWaitingTables(idUserInTavern,(tables)=>{
        res.end(JSON.stringify(tables));    
    }) 
}

function getTaverneTyranniqueController(req,res){
    configInit.gameMode = "tyrannique"
    req.sendFlash("surprised","Le mode de jeu est reglé sur '"+configInit.gameMode+"'")
    var opt = {gameMode: configInit.gameMode}
    res.setHeader('Content-Type', 'text/html');      
    res.redirect('/taverne');   
}

function postTaverneNewCroisadeController(req,res){
    res.setHeader('Content-Type', 'text/html');
    let mode = req.body.game_mode;
    let name = req.body.game_name;
    let slots = req.body.game_slots;
    let hero = req.session.hero;
    let hero_name = req.session.hero.name;
    partieMng.insertPartieByUserId(name,hero,slots,mode,(partie)=>{
        res.redirect('/taverne?idPartie='+partie.id); 
    })
}

function postTaverneLoadCroisadeController(req,res){
    res.setHeader('Content-Type', 'text/html');
    let mode = req.body.game_mode;      
    let partie_id = req.body.partie_id;
    partieMng.getPartieById(partie_id,(partie)=>{        
        let hero = req.session.hero;
        partieMng.stopAllPartiesStatusByUserId(hero,()=>{
            partieMng.uppdatePartieStatusById(partie,"waiting",()=>{
                res.redirect('/taverne?idPartie='+partie.id);
            })
        })        
    })
}


module.exports = {
    getTaverneController,
    getTaverneClassiqueController,
    getTaverneTyranniqueController,
    postTaverneNewCroisadeController,
    postTaverneLoadCroisadeController,
    getAllWaitingTablesController
}