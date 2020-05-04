const Partie     = require("../Partie");
const servFunc   = require("../../modules/functionServer");

let connection  = servFunc.getBdd();

function getPartieById(id,callBack){    
    connection.query('SELECT * FROM parties WHERE id= ?',[id], function (err, partie) {
        if (err) throw err;
        callBack(hydratePartie(partie[0]));    
    });    
}

// a tester et a finir
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

function insertPartieByUserId(name,hero_id,slots,mode,hero_name){
    let datas = {name,hero_id,slots,mode}    
    connection.query('INSERT INTO parties SET ?',
                    datas, function (err, row) {
        if (err) throw err; 
        console.log("Une partie a été crée par "+hero_name+" !");       
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
    insertPartieByUserId
}