module.exports = function(req,res,next){

    
    if(req.session.flash){
        res.locals.flash = req.session.flash;
        req.session.flash = undefined;
    }
    
    req.sendFlash = function(type, msg){        
        if(req.session.flash === undefined){        
            req.session.flash = [];
        }
        req.session.flash.push({type:type,message:msg});
    }

    res.sendFlash = function(type, msg){        
        if( res.locals.flash === undefined){        
            res.locals.flash = [];
        }
        res.locals.flash.push({type:type,message:msg});      
    }
    next();
}