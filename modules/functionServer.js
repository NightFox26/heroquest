const color = require("./colorsTxt");
const configInit = require("../config/configInit");

//pour poser des question dans la console du serveur
const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});

function debugObj(obj){
    // exemple d'objet :
    /*
    const obj = {
        name: 'joe',
        age: 35,
        person1: {
          name: 'Tony',
          age: 50,
          person2: {
            name: 'Albert',
            age: 21,
            person3: {
              name: 'Peter',
              age: 23
            }
          }
        }
      }
    */
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

function checkAutoLogin(req){
  if(configInit.autoLogin){
      req.session.user ="fox";
  }else{
      req.session.user = undefined;
  }
}

module.exports = {
    kickUser,
    debugObj,
    checkAutoLogin
}