const Partie     = require("../Partie");
const servFunc   = require("../../modules/functionServer");
const heroMng = require("./HeroMng")

let connection  = servFunc.getBdd();

function getPartieById(id,callBack){    
    connection.query('SELECT * FROM parties WHERE id= ?',[id], function (err, partie) {
        if (err) throw err; 
        var party = partie[0];
        if(party){
            heroMng.getHeroById(party.hero_1_id,(hero1)=>{
                heroMng.getHeroById(party.hero_2_id,(hero2)=>{
                    heroMng.getHeroById(party.hero_3_id,(hero3)=>{
                        heroMng.getHeroById(party.hero_4_id,(hero4)=>{
                            callBack(hydratePartie(party,hero1,hero2,hero3,hero4));
                        })
                    })
                })
            }) 
        }else{
            callBack(false);
        }
    });    
}

function getPartieByIdAndHero(id,heroId,callBack){    
    connection.query('SELECT * FROM parties WHERE id= ? AND hero_id= ?',[id,heroId], function (err, partie) {
        if (err) throw err;        
        callBack(hydratePartie(partie[0]));    
    });    
}

function getAllPartieByUserIdAndMode(hero_id,mode,callBack){    
    connection.query('SELECT * FROM parties WHERE hero_id= ? AND mode = ?',
                    [hero_id,mode],function (err, parties) {
        if (err) throw err;
        let allParty = []
        for( let party of parties){            
            allParty.push(hydratePartie(party));
        }     
        callBack(allParty);
    });    
}

function getAllPartieWithMe(hero_id,mode,callBack){    
    connection.query('SELECT * FROM parties WHERE (hero_1_id = ? OR hero_2_id = ? OR hero_3_id = ? OR hero_4_id = ? ) AND mode = ?', [hero_id,hero_id,hero_id,hero_id,mode],function (err, parties) {
        if (err) throw err;
        let allParty = []
        for( let party of parties){            
            allParty.push(hydratePartie(party));
        }     
        callBack(allParty);
    });    
}

function getAllPartiePlayingWithMe(hero_id,mode,callBack){    
    connection.query('SELECT * FROM parties WHERE (hero_1_id = ? OR hero_2_id = ? OR hero_3_id = ? OR hero_4_id = ? ) AND mode = ? AND status="playing"', [hero_id,hero_id,hero_id,hero_id,mode],function (err, parties) {
        if (err) throw err;
        let allParty = []
        for( let party of parties){            
            allParty.push(hydratePartie(party));
        }     
        callBack(allParty);
    });    
}

function getAllWaitingTables(userIdTavern,mode,callback){    
    connection.query('SELECT * FROM parties WHERE status= ? AND mode = ? AND hero_id IN ( ? )',
                    ["waiting",mode,userIdTavern], function (err, parties) {
        if (err) throw err;
        let allParties = []
        for( let partie of parties){
            allParties.push(hydratePartie(partie));  
        }     
        callback(allParties);
    });   
}

function insertPartieByUserId(name,hero,slots,mode,callback){
    stopAllPartiesWaitingByUserId(hero,()=>{
        let datas = {name,hero_id:hero.id,slots,mode,hero_1_id:hero.id}    
        connection.query('INSERT INTO parties SET ?',
                        datas, function (err,result) {
            if (err) throw err; 
            console.log("Une partie a été crée par "+hero.id+" !");
            callback(new Partie(result.insertId,name,hero.id,1,slots,mode,"waiting",hero.id))
        });
    })    
}


function stopAllPartiesWaitingByUserId(hero,callback){   
    connection.query('UPDATE parties SET status = "stopped" WHERE hero_id = ? AND status != "playing"',
    hero.id, function (err,result) {
        if (err) throw err;
        console.log("les partie en attente sont toute stoppé pour "+hero.name+" !");
        callback()
    });     
}

function stopAllPartiesByUserId(hero,callback){     
    connection.query('UPDATE parties SET hero_2_id=0 WHERE hero_2_id = ?', hero.id);
    connection.query('UPDATE parties SET hero_3_id=0 WHERE hero_3_id = ?', hero.id);
    connection.query('UPDATE parties SET hero_4_id=0 WHERE hero_4_id = ?', hero.id);    

    connection.query('UPDATE parties SET status = "stopped", hero_2_id=0, hero_3_id=0, hero_4_id=0 WHERE hero_id = ?',
    hero.id, function (err,result) {
        if (err) throw err;
        console.log("Toutes les partie sont toute stoppé pour "+hero.name+" !");
        callback()
    });     
}

function uppdatePartieStatusById(partie,newStatus,callback){      
    connection.query('UPDATE parties SET status = ? WHERE id = ?',
    [newStatus,partie.id], function (err,result) {
        if (err) throw err; 
        console.log("la partie id : "+partie.id+" vient de passer en : "+newStatus+" !");
        callback()
    });    
}

function uppdatePartieHeroById(idParty,slot,hero,callback){      
    connection.query('UPDATE parties SET hero_'+slot+'_id = ? WHERE id = ?',
    [hero.id,idParty], function (err,result) {
        if (err) throw err; 
        console.log("la partie id : "+idParty+" vient d'ajouter "+hero.name+" au slot "+slot+ "!");
        callback()
    });    
}

function removeartieHeroById(idParty,slot,callback){      
    connection.query('UPDATE parties SET hero_'+slot+'_id = 0 WHERE id = ?',
    [idParty], function (err,result) {
        if (err) throw err;         
        callback()
    });    
}

function stopPartieById(idPartie,callback){
    connection.query('UPDATE parties SET status = "stopped", hero_2_id = 0, hero_3_id = 0, hero_4_id = 0 WHERE id = ?',
    [idPartie], function (err,result) {
        if (err) throw err;         
        callback()
    });    
}


function hydratePartie(cols,hero1=null,hero2=null,hero3=null,hero4=null){
    let partie = new Partie();    
    for(attrib in cols){        
        let setter = "set"+attrib.charAt(0).toUpperCase() + attrib.slice(1); 
        // console.log(setter)       
        partie[setter](cols[attrib]);
    }
    partie.setHero_1(hero1);
    partie.setHero_2(hero2);
    partie.setHero_3(hero3);
    partie.setHero_4(hero4);
    return partie;    
}


module.exports = {
    getPartieById,
    getAllPartieByUserIdAndMode,
    getAllPartiePlayingWithMe,
    getAllPartieWithMe,
    insertPartieByUserId,
    getAllWaitingTables,
    stopAllPartiesWaitingByUserId,
    uppdatePartieStatusById,
    getPartieByIdAndHero,
    uppdatePartieHeroById,
    removeartieHeroById,
    stopAllPartiesByUserId,
    stopPartieById
}