const url = require('url');
var express = require('express'),
app = express(),
server  = require("http").createServer(app),
io = require("socket.io")(server),
bodyParser      = require('body-parser');
session = require("express-session")({
    secret: "my-secret",
    resave: true,
    saveUninitialized: true
}),
path            = require('path'),
eventEmitter    = require('events').EventEmitter,
moment          = require('moment');

app.use(session);
app.use(express.static(path.join(__dirname, '/public/')))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extend: true}));
app.use(require("./modules/flash")); 


//Mes fonctions
const color         = require("./modules/colorsTxt");
const configInit    = require("./config/configInit");
const servFunc      = require("./modules/functionServer");

//test de la connection a la BDD
servFunc.testBdd(server);

//compte le nb d'utilisateur connectés
servFunc.checkNbUser(io);

//Variables global
var userLogged      = new Map();
var usersInTaverne  = new Map();


/**************/
// LES ROUTES //
/**************/
app.get('/', function(req, res) {
    res.redirect('/login');
})

.get('/login', function(req, res) {
    const ctrl = require('./controller/loginController');
    ctrl.getLoginController(req,res);
})

.get('/logout', function(req, res) {  
    const ctrl = require('./controller/logoutController');
    ctrl.getLogoutController(req,res,userLogged); 
})

.post('/login', function(req, res) {
    const ctrl = require('./controller/loginController');
    ctrl.postLoginController(req,res,userLogged);
})

.get('/home', function(req, res) {
    const ctrl = require('./controller/homeController');
    ctrl.getHomeController(req,res);
})

.get('/taverne', function(req, res) {
    const ctrl = require('./controller/taverneController');
    ctrl.getTaverneController(req,res);  
})

.get('/taverne/getAllWaitingTables', function(req,res) {
    const ctrl = require('./controller/taverneController');
    ctrl.getAllWaitingTablesController(req,res,usersInTaverne); 
})

.get('/taverne/tyrannique', function(req, res) {
    const ctrl = require('./controller/taverneController');
    ctrl.getTaverneTyranniqueController(req,res); 
})   

.get('/taverne/classique', function(req, res) {
    const ctrl = require('./controller/taverneController');
    ctrl.getTaverneClassiqueController(req,res);  
})

.post('/newCroisade', function(req, res) {
    const ctrl = require('./controller/taverneController');
    ctrl.postTaverneNewCroisadeController(req,res);  
})

.post('/loadCroisade', function(req, res) {
    const ctrl = require('./controller/taverneController');
    ctrl.postTaverneLoadCroisadeController(req,res);
})

.get('/game/:gameMode/:etage', function(req, res) {    
    const ctrl = require('./controller/gameController');
    ctrl.getGameController(req,res); 
})

.get('*', function(req, res) {
    const ctrl = require('./controller/404Controller');
    ctrl.get404Controller(req,res);
})

server.listen(configInit.port, configInit.hostname, () => {    
    process.stdout.write('\033c');  //pour effacer la console  
    color.successTxt(`Le serveur tourne en local sur : http://${configInit.hostname}:${configInit.port}/`); 
    
    color.infoTxt("Connection par navigateur web : http://nightfox26.hopto.org:8000/");    
    color.errorTxt(".....");    
    color.astriaTxt("Bienvenue, je suis Astria l'IA de ce serveur.");    
    color.astriaTxt("je me met en attente ..."); 
    
    
    // var fox = new Hero("Nightfox26","Barbare");
    // var toto = new Hero("jean miche","Naim"); 
    // console.log(fox)
    // console.log(toto)    

    // fox.attack(toto, new Dice.AtkDice(2));
    // fox.moving(new Dice.MoveDice(2));
    
    // var fimir1 = new Monster("Fimir");
    // console.log(fimir1)
    // fimir1.moving()
        
    //servFunc.kickUser();
    //servFunc.debugObj(obj);
    //color.warningTxt(obj["person1"]["name"]);
});

// Websocket lié au contexte global du site
const ctrlGlobalSocket = require('./controller/socketController/globalsSocketController');
ctrlGlobalSocket.getGlobalSocketController(io);

// Websocket lié a la taverne
const ctrlTaverneSocket = require('./controller/socketController/taverneSocketController');
ctrlTaverneSocket.getTaverneSocketController(io,usersInTaverne);

// Websocket lié au boardgame
const ctrlGameSocket = require('./controller/socketController/gameSocketController');
ctrlGameSocket.getGameSocketController(io);
