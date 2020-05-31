const configInit    = require("../config/configInit");
const color         = require("../modules/colorsTxt");
const servFunc      = require("../modules/functionServer");

const userMng   = require("../models/manager/UserMng");
const heroMng   = require("../models/manager/HeroMng");
const partieMng = require("../models/manager/PartieMng");

function getLoginController(req,res){
    res.locals.loginError = req.session.loginError;
    req.session.loginError = undefined;
    res.locals.page =  "login";
    servFunc.checkAutoLogin(req);  
    res.setHeader('Content-Type', 'text/html');      
    res.render('connexion.ejs', {urlWeb: configInit.urlWebSubscribe}); 
}

function postLoginController(req,res,userLogged){
    res.setHeader('Content-Type', 'text/html'); 
    userMng.getUserByEmailAndPass(req.body.mail, req.body.password,function(user){
        if(user){
            heroMng.getHeroByUserId(user.id,function(hero){
                req.session.user = user;  
                req.session.hero = hero;   
                partieMng.stopAllPartiesByUserId(req.session.hero,()=>{             
                    userLogged.set(user.id,user);          
                    req.sendFlash("happy","Bonjour "+user.name)                      
                    color.successTxt(user.name + " vient de se connecter !");
                    res.redirect('/home');
                })
            })
        }else{
            color.errorTxt("ALERT : "+req.body.mail + " n'arrive pas à se connecter !");
            req.sendFlash("angry","Identifiants incorrect ! ")
            req.session.loginError = true;
            res.redirect('/login');
        }  
    });
}

module.exports = {
    getLoginController,
    postLoginController
}