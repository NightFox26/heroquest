const userModels = require("../User");
const servFunc   = require("../../modules/functionServer");

let connection  = servFunc.getBdd();
connection .connect();

function getHeroById(id){    
    connection.query('SELECT * FROM heros WHERE id= ?',[id], function (err, row) {
        if (err) throw err;
        callBack(row[0]);    
    });    
}

function getHeroByUserId(userId,callBack){    
    connection.query('SELECT * FROM heros WHERE player_id= ?',
                    [userId], function (err, row) {
        if (err) throw err; 
        callBack(row[0]);       
    });    
}

module.exports = {
    getHeroById,
    getHeroByUserId
}