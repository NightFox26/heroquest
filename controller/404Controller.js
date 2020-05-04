const configInit    = require("../config/configInit");
const color         = require("../modules/colorsTxt");
const servFunc      = require("../modules/functionServer");

function get404Controller(req,res){    
    res.setHeader('Content-Type', 'text/html');    
    if(req.session.user){
        color.errorTxt(req.session.user.name+" a cherché a rejoindre une page inexistante !");
    }else{
        color.errorTxt("Un utilisateur non connecté a cherché a rejoindre une page inexistante !");
    }
    res.status(404);
    res.render('404.ejs',);    
}


module.exports = {
    get404Controller
}