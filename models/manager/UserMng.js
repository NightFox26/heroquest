const userModels = require("../User");
const servFunc   = require("../../modules/functionServer");

let connection  = servFunc.getBdd();
connection .connect();


function getUserById(id,callBack){    
    connection.query('SELECT * FROM players WHERE id= ?',[id], function (err, row) {
        if (err) throw err;
        callBack(row[0]);
    });   
}

function getUserByEmailAndPass(mail,pass,callBack){    
    connection.query('SELECT * FROM players WHERE email= ? AND password = ?',
                    [mail,pass], function (err, row) {
        if (err) throw err; 
        callBack(row[0]);       
    });    
}

module.exports = {
    getUserById,
    getUserByEmailAndPass
}