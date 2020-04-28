const userModels    = require("../User");
const HeroMng       = require("./HeroMng");
const servFunc      = require("../../modules/functionServer");

let connection  = servFunc.getBdd();
connection .connect();

function getAllUsers(callBack){    
    connection.query('SELECT * FROM players ', function (err, rows) {
        if (err) throw err;
        callBack(rows);
    });   
}

function getAllUsersWithHeros(callBack){    
    connection.query('SELECT p.id, p.name AS player, p.email, p.ip, p.subscribe_at, h.id AS hero_id, h.name AS Hero,h.type, h.player_id FROM players AS p INNER JOIN heros AS h ON p.id=h.player_id', function (err, rows) {
        if (err) throw err;

        var users = [];
        for( let user of rows){
            users.push({"player": {'id':user.id,
                                  'name':user.player,
                                  'mail':user.email,
                                  'ip':user.ip},
                        "hero": {
                                  'id':user.hero_id,
                                  'name':user.Hero,
                                  'type':user.type
                        }
                    })
        }
        callBack(users);
    });   
}


function getUserById(id,callBack){    
    connection.query('SELECT * FROM players WHERE id= ?',[id], function (err, row) {
        if (err) throw err;
        callBack(row[0]);
    });   
}

function getUserByIdWithHero(id,callBack){    
    connection.query('SELECT * FROM players WHERE id= ?',[id], function (err, user) {
        if (err) throw err;
        HeroMng.getHeroByUserId(user[0].id,(hero)=>{
            callBack({"player": {'id':user[0].id,
                                'name':user[0].name,
                                'mail':user[0].email,
                                'ip':user[0].ip},
                      "hero": {
                                'id':hero.id,
                                'name':hero.name,
                                'type':hero.type
                    }
            });
        })
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
    getUserByIdWithHero,
    getUserByEmailAndPass,
    getAllUsers,
    getAllUsersWithHeros
}