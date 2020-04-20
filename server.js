let express         = require('express');
let app             = express();
let path            = require('path');
let bodyParser      = require('body-parser');
let session         = require('express-session');
const EventEmitter  = require('events').EventEmitter;

const color         = require("./modules/colorsTxt");
const configInit    = require("./config/configInit");
const servFunc      = require("./modules/functionServer");
const game          = require("./game/plateau");


//Models
/*
var userModels      = require("./models/User");
var diceModels      = require("./models/Dice");
var heroModels      = require("./models/Hero");
*/
const userMng = require("./models/manager/UserMng");
const heroMng = require("./models/manager/HeroMng");


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extend: true}));
app.use(session({
    secret: 'fox26100',
    resave: false,
    saveUninitialized: true,
    cookie: {secrure: false}
}))

app.use(require("./modules/flash"))

/**************/
// LES ROUTES //
/**************/
app.get('/', function(req, res) {
    res.redirect('/login');
})

.get('/login', function(req, res) {
    res.locals.loginError = req.session.loginError;
    req.session.loginError = undefined;    

    servFunc.checkAutoLogin(req);  
    res.setHeader('Content-Type', 'text/html');      
    res.render('connexion.ejs', {urlWeb: configInit.urlWebSubscribe}); 
})

.post('/login', function(req, res) {
    res.setHeader('Content-Type', 'text/html'); 
    userMng.getUserByEmailAndPass(req.body.mail, req.body.password,function(user){
        if(user){
            heroMng.getHeroByUserId(user.id,function(hero){
                req.session.user = user;  
                req.session.hero = hero;  
                req.sendFlash("success","Bonjour "+user.name)  
                req.sendFlash("info","Bienvenue au grand Hero "+hero.type+" "+hero.name)  
                color.successTxt(user.name + " vient de se connecter !");
                res.redirect('/home');
            })
        }else{
            color.errorTxt("ALERT : "+req.body.mail + " n'arrive pas à se connecter !");
            req.sendFlash("alert","Identifiants incorrect ! ")
            req.session.loginError = true;
            res.redirect('/login');
        }  
    });
})

.get('/home', function(req, res) {
    res.setHeader('Content-Type', 'text/html'); 
    if(req.session.user != undefined &&  req.session.user != ""){
        res.locals.user =  req.session.user;                
        res.locals.hero =  req.session.hero;                
        let opt = {tyranModeUnlocked: configInit.tyranModeUnlocked,
                   gdxModeUnlocked: configInit.gdxModeUnlocked}         
        res.render('home.ejs', opt); 
    }else{
        req.sendFlash("alert","Vous devez vous connecter pour acceder a l'accueil !")
        res.redirect('/login');
    }
})

.get('/game/classique', function(req, res) {
    configInit.gameMode = "classique"    
    var opt = {gameMode: configInit.gameMode}    
    req.sendFlash("normal","Le mode de jeu est reglé sur '"+configInit.gameMode+"'")    
    res.setHeader('Content-Type', 'text/html');      
    res.redirect('/taverne');    
})

.get('/game/tyrannique', function(req, res) {
    configInit.gameMode = "tyrannique"
    req.sendFlash("alert","Le mode de jeu est reglé sur '"+configInit.gameMode+"'")
    var opt = {gameMode: configInit.gameMode}
    res.setHeader('Content-Type', 'text/html');      
    res.redirect('/taverne');  
})

.get('/taverne', function(req, res) {
    res.setHeader('Content-Type', 'text/html'); 
    if(req.session.user != undefined &&  req.session.user != ""){
        res.locals.user =  req.session.user ;
        res.locals.hero =  req.session.hero ;

        res.sendFlash("info","Bienvenue a la taverne du 'Chien errant' "+req.session.hero.name)
        
        var opt = {gameMode: configInit.gameMode}
        res.render('taverne.ejs', opt); 
    }else{
        req.sendFlash("alert","Vous devez vous connecter pour acceder a la taverne !")
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
    
    /*
    var fox = new heroModels.Hero("Nightfox26",playerModels.Barbare);
    var toto = new heroModels.Hero("jean miche",playerModels.Naim); 
    fox.attack(toto, new diceModels.AtkDice(2));
    toto.moving(new diceModels.moveDice(2));
    */
    
    
    //servFunc.kickUser();
    //servFunc.debugObj(obj);
    //color.warningTxt(obj["person1"]["name"]);
});