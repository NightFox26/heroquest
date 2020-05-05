const color       = require("./colorsTxt");
const configInit  = require("../config/configInit");


//pour poser des question dans la console du serveur
const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});

function debugObj(obj){    
    console.log(JSON.stringify(obj, null, 2))
}

function kickUser(){
    readline.question(`Kicker l'utilisateur ?`, name => {
    var name = `${name}`;
        readline.question(`sur serveur ?`, idServeur => {
            var id = `${idServeur}`;
            color.infoTxt('kick de '+name+" sur serveur : "+id);
            readline.close()
        }); 
    });
}

function testBdd(server){
    getBdd().connect((err)=>{
        if(err){ color.errorTxt("bdd not connected !"); color.errorTxt("Le serveur va stopper !"); server.close();}
        else{ color.successTxt("La base de donnée est connectée !")}
    }); 
}

function getBdd(){
  const mysql = require('mysql');  
  return mysql.createConnection(require("../config/db"));  
}

function checkAutoLogin(req){
  if(configInit.autoLogin){
      req.session.user ="fox";
  }else{
      req.session.user = undefined;
  }
}

function checkNbUser(io){
    if(configInit.countUserOnSite){
        setInterval(()=>{            
            io.emit("nbUserLogged",io.engine.clientsCount);
        },5000)       
    }
}

function substrateArrayUser(arr, arrToRemove){    
    for(let i=arr.length-1; i>=0; i--){        
        for(let j=0; j<arrToRemove.length; j++){
            if(arr[i] && (arr[i].player.id === arrToRemove[j].player.id)){                
                arr.splice(i, 1);
            }
        }
    }
    return arr;
}

function getAllIdHeroInTavern(usersInTaverne){
    var herosId = [];
    for(let user of usersInTaverne){
        herosId.push(user[1].hero.id)
    }
    return herosId;
}

module.exports = {
    kickUser,
    debugObj,
    checkAutoLogin,
    getBdd,
    checkNbUser,
    substrateArrayUser,
    testBdd,
    getAllIdHeroInTavern   
}