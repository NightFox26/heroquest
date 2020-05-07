const Hero = require("../Hero");
const servFunc   = require("../../modules/functionServer");

let connection  = servFunc.getBdd();

function getHeroById(id,callBack){    
    connection.query('SELECT * FROM heros WHERE id= ?',[id], function (err, hero) {
        if (err) throw err;
        callBack(hydrateHero(hero[0]));    
    });    
}

function getHeroByUserId(userId,callBack){    
    connection.query('SELECT * FROM heros WHERE player_id= ?',
                    [userId], function (err, hero) {
        if (err) throw err; 
        callBack(hydrateHero(hero[0]));       
    });    
}

function hydrateHero(cols){
    let hero = new Hero();
    if(cols)  {
        for(attrib in cols){        
            let setter = "set"+attrib.charAt(0).toUpperCase() + attrib.slice(1); 
            // console.log(setter)       
            hero[setter](cols[attrib]);
        }
        hero.setStats(cols["type"]);
    }  
    return hero;
}

module.exports = {
    hydrateHero,
    getHeroById,
    getHeroByUserId
}