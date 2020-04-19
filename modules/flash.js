module.exports = function(req,res,next){
    if(res.locals.flash === undefined){        
        res.locals.flash = [];
    }

    res.sendFlash = function(type, msg){        
        res.locals.flash.push({type:type,message:msg})
    }
    next()
}