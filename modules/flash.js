module.exports = function(req,res,next){   
    const conf = require("../config/configInit");
    
    if(req.session.flash){
        res.locals.flash = req.session.flash;
        req.session.flash = undefined;
    }
    
    req.sendFlash = function(type, msg){        
        if(req.session.flash === undefined){        
            req.session.flash = [];
        }
        req.session.flash.push({type:type,message:msg,iaName:conf.IA_name});
    }

    res.sendFlash = function(type, msg){        
        if( res.locals.flash === undefined){        
            res.locals.flash = [];
        }
        res.locals.flash.push({type:type,message:msg,iaName:conf.IA_name});      
    }
    next();
}