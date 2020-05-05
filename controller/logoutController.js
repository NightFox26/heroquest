const configInit    = require("../config/configInit");
const color         = require("../modules/colorsTxt");
const servFunc      = require("../modules/functionServer");

const partieMng = require("../models/manager/PartieMng");

function getLogoutController(req,res,userLogged){
    color.errorTxt(req.session.user.name +" vient de se deconnecter !"); 
    if(req.session.user != undefined &&  req.session.user != ""){
        partieMng.stopAllPartiesStatusByUserId(req.session.hero,()=>{            
            req.session.loginError = undefined;                   
            req.sendFlash("sad","Au revoir "+req.session.user.name+" ...")  
            userLogged.delete(req.session.user.id);            
            req.session.user = null; 
        })
    }  
    res.redirect('/login');
}

module.exports = {
    getLogoutController
}