const configInit    = require("../config/configInit");
const color         = require("../modules/colorsTxt");
const servFunc      = require("../modules/functionServer");

function getLogoutController(req,res,userLogged){
    if(req.session.user != undefined &&  req.session.user != ""){
        req.session.loginError = undefined;
        color.errorTxt(req.session.user.name +" vient de se deconnecter !");        
        req.sendFlash("sad","Au revoir "+req.session.user.name+" ...")  
        userLogged.delete(req.session.user.id);            
        req.session.user = null; 
    }  
    res.redirect('/login');
}

module.exports = {
    getLogoutController
}