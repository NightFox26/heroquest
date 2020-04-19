let express = require('express');
let app = express();
let path = require('path');
let bodyParser = require('body-parser');
let session = require('express-session');
const EventEmitter = require('events').EventEmitter;


const color = require("./modules/colorsTxt");
const configInit = require("./config/configInit");
const serverFunc = require("./modules/functionServer");
const game = require("./game/plateau");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extend: true}));
app.use(session({
    secret: 'fox26100',
    resave: false,
    saveUninitialized: true,
    cookie: {secrure: false}
}))


/**************/
// LES ROUTES //
/**************/
app.get('/', function(req, res) {
    res.redirect('/login');
})

.get('/login', function(req, res) {
    res.locals.loginError = req.session.loginError;
    req.session.loginError = undefined;

    serverFunc.checkAutoLogin(req);
    // if(configInit.autoLogin){
    //     req.session.user ="fox";
    // }else{
    //     req.session.user = undefined;
    // }
    
    res.setHeader('Content-Type', 'text/html');      
    res.render('connexion.ejs', {msg: "HeroQuest V2.0",urlWeb: configInit.urlWebSubscribe}); 
})

.post('/login', function(req, res) {
    res.setHeader('Content-Type', 'text/html');  
    if(req.body.username == "fox" && req.body.password == "123"){
        req.session.user = "fox";           
        color.successTxt(req.session.user + " vient de se connecter !");
        res.redirect('/home');
    }else{
        color.errorTxt("ALERT : "+req.body.username + " n'arrive pas à se connecter !");
        req.session.loginError = true;
        res.redirect('/login');
    }    
})

.get('/home', function(req, res) {
    res.setHeader('Content-Type', 'text/html'); 
    if(req.session.user != undefined &&  req.session.user != ""){
        res.locals.user =  req.session.user ;        
        let opt = {tyranModeUnlocked: configInit.tyranModeUnlocked,
                   gdxModeUnlocked: configInit.gdxModeUnlocked}         
        res.render('home.ejs', opt); 
    }else{
        res.redirect('/login');
    }
})

.get('/game/classique', function(req, res) {
    configInit.gameMode = "classique"    
    var opt = {gameMode: configInit.gameMode}
    res.setHeader('Content-Type', 'text/html');      
    res.redirect('/taverne');    
})

.get('/game/tyrannique', function(req, res) {
    configInit.gameMode = "tyrannique"
    var opt = {gameMode: configInit.gameMode}
    res.setHeader('Content-Type', 'text/html');      
    res.redirect('/taverne');  
})

.get('/taverne', function(req, res) {
    res.setHeader('Content-Type', 'text/html'); 
    if(req.session.user != undefined &&  req.session.user != ""){
        res.locals.user =  req.session.user ;   
        var opt = {gameMode: configInit.gameMode}
        res.render('taverne.ejs', opt); 
    }else{
        res.redirect('/login');
    }   
})

.get('/game/etage/:etage', function(req, res) {
    res.setHeader('Content-Type', 'text/html');      
    game.runPlateau();
    res.send('Vous êtes sur l\'etage : '+ req.params.etage);
    color.infoTxt("lancement de l\'etage : "+ req.params.etage); 
})

.use(express.static(path.join(__dirname, '/public/')))

app.listen(configInit.port, configInit.hostname, () => {    
    process.stdout.write('\033c');  //pour effacer la console  
    color.successTxt(`Le serveur tourne en local sur : http://${configInit.hostname}:${configInit.port}/`); 
    
    color.infoTxt("Connection par navigateur web : http://nightfox26.hopto.org:8000/");    
    color.errorTxt(".....");    
    color.astriaTxt("Bienvenue, je suis Astria l'IA de ce serveur.");    
    color.astriaTxt("je me met en attente ...");  
    
    //serverFunc.kickUser();
    //serverFunc.debugObj(obj);
    //color.warningTxt(obj["person1"]["name"]);
});