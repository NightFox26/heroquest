const Partie     = require("../Partie");
const servFunc   = require("../../modules/functionServer");

let connection  = servFunc.getBdd();

function getPartieById(id,callBack){    
    connection.query('SELECT * FROM parties WHERE id= ?',[id], function (err, partie) {
        if (err) throw err;
        callBack(hydratePartie(partie[0]));    
    });    
}

function getAllPartieByUserId(hero_id,callBack){    
    connection.query('SELECT * FROM parties WHERE hero_id= ?',
                    hero_id, function (err, parties) {
        if (err) throw err;
        let allParties = []
        for( let partie of parties){
            allParties.push(hydratePartie(partie));  
        }     
        callBack(allParties);
    });    
}

function getAllWaitingTables(userIdTavern,callback){
    connection.query('SELECT * FROM parties WHERE status= ? AND hero_id IN ( ? )',
                    ["waiting",userIdTavern], function (err, parties) {
        if (err) throw err;
        let allParties = []
        for( let partie of parties){
            allParties.push(hydratePartie(partie));  
        }     
        callback(allParties);
    });
}

function insertPartieByUserId(name,hero,slots,mode,callback){
    stopAllPartiesStatusByUserId(hero,()=>{
        let datas = {name,hero_id:hero.id,slots,mode,hero_1_id:hero.id}    
        connection.query('INSERT INTO parties SET ?',
                        datas, function (err,result) {
            if (err) throw err; 
            console.log("Une partie a été crée par "+hero.id+" !");
            callback(new Partie(result.insertId,name,hero.id,1,slots,mode,"waiting",hero.id))
        });
    })    
}


function stopAllPartiesStatusByUserId(hero,callback){      
    connection.query('UPDATE parties SET status = "stopped" WHERE hero_id = ?',
    hero.id, function (err,result) {
        if (err) throw err; 
        console.log("les partie sont toute stoppé pour "+hero.name+" !");
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


function hydratePartie(cols){
    let partie = new Partie();    
    for(attrib in cols){        
        let setter = "set"+attrib.charAt(0).toUpperCase() + attrib.slice(1); 
        // console.log(setter)       
        partie[setter](cols[attrib]);
    }
    return partie;
}


module.exports = {
    getPartieById,
    getAllPartieByUserId,
    insertPartieByUserId,
    getAllWaitingTables,
    stopAllPartiesStatusByUserId,
    uppdatePartieStatusById
}