const User          = require("../User");
const Hero          = require("../Hero");
const HeroMng       = require("./HeroMng");
const servFunc      = require("../../modules/functionServer");
let connection      = servFunc.getBdd(); 

function getAllUsers(callBack){    
    connection.query('SELECT * FROM players ', function (err, users) {
        if (err) throw err;
        callBack(users);
    });   
}

function getAllUsersWithHeros(callBack){   
    getAllUsers((users)=>{ 
        for( let user of users){
            var usrs = [];
            HeroMng.getHeroByUserId(user.id,(hero)=>{                
                usrs.push({"player": hydrateUser(user),
                          "hero": hero});
                callBack(usrs)
            })
        }
    });   
}

function getUserById(id,callBack){    
    connection.query('SELECT * FROM players WHERE id= ?',[id], function (err, user) {
        if (err) throw err;
        callBack(hydrateUser(user[0]));
    });   
}

function getUserByIdWithHero(id,callBack){    
    getUserById(id,(user)=>{          
        HeroMng.getHeroByUserId(user.id,(hero)=>{
            callBack({"player": user,
                      "hero": hero
            });
        })
    }) 
}

function getUserByEmailAndPass(mail,pass,callBack){ 
    connection.query('SELECT * FROM players WHERE email= ? AND password = ?',
                    [mail,pass], function (err, user) {
        if (err) throw err; 
        if(user[0]){
            callBack(hydrateUser(user[0]));
        }else{
            callBack(null)
        }             
    });    
}

function hydrateUser(cols){
    let user = new User();    
    for(attrib in cols){        
        let setter = "set"+attrib.charAt(0).toUpperCase() + attrib.slice(1); 
        // console.log(setter)       
        user[setter](cols[attrib]);
    }
    return user;
}

module.exports = {
    hydrateUser,
    getUserById,
    getUserByIdWithHero,
    getUserByEmailAndPass,
    getAllUsers,
    getAllUsersWithHeros
}