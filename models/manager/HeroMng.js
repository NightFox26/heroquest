const Hero = require("../Hero");
const servFunc   = require("../../modules/functionServer");

let connection  = servFunc.getBdd();

function getHeroById(id,callBack){    
    connection.query('SELECT * FROM heros WHERE id= ?',[id], function (err, hero) {
        if (err) throw err;
        callBack(hydrateHero(hero[0]));    
    });    
}
function getMultipleHerosById(hero1_id,hero2_id=null,hero3_id=null,hero4_id=null,callback){
    let herosId = [hero1_id,hero2_id,hero3_id,hero4_id];
    connection.query('SELECT * FROM heros WHERE id IN ( ? ) ORDER BY FIELD(id, ? )',[herosId,herosId], function (err, heros) {
        if (err) throw err;        
        callback(   hydrateHero(heros[0]),
                    hydrateHero(heros[1]),
                    hydrateHero(heros[2]),
                    hydrateHero(heros[3])
                );    
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
    getHeroByUserId,
    getMultipleHerosById
}