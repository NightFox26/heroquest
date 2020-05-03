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
eventEmitter  = require('events').EventEmitter,
moment = require('moment');

app.use(session);
app.use(express.static(path.join(__dirname, '/public/')))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extend: true}));
app.use(require("./modules/flash")); 



const color         = require("./modules/colorsTxt");
const configInit    = require("./config/configInit");
const servFunc      = require("./modules/functionServer");
const game          = require("./game/plateau");

//Models
var User            = require("./models/User");
var Dice            = require("./models/Dice");
var Hero            = require("./models/Hero");
var Monster         = require("./models/Monster");

const userMng = require("./models/manager/UserMng");
const heroMng = require("./models/manager/HeroMng");

//test de la connection a la BDD
servFunc.testBdd(server);

var userLogged      = new Map();
var usersInTaverne  = new Map();
/**************/
// LES ROUTES //
/**************/
app.get('/', function(req, res) {
    res.redirect('/login');
})

.get('/login', function(req, res) {
    res.locals.loginError = req.session.loginError;
    req.session.loginError = undefined;
    res.locals.page =  "login";
    servFunc.checkAutoLogin(req);  
    res.setHeader('Content-Type', 'text/html');      
    res.render('connexion.ejs', {urlWeb: configInit.urlWebSubscribe}); 
})

.get('/logout', function(req, res) {    
    if(req.session.user != undefined &&  req.session.user != ""){
        req.session.loginError = undefined;
        color.errorTxt(req.session.user.name +" vient de se deconnecter !");        
        req.sendFlash("sad","Au revoir "+req.session.user.name+" ...")  
        userLogged.delete(req.session.user.id);            
        req.session.user = null; 
    }  
    res.redirect('/login');
})

.post('/login', function(req, res) {
    res.setHeader('Content-Type', 'text/html'); 
    userMng.getUserByEmailAndPass(req.body.mail, req.body.password,function(user){
        if(user){
            heroMng.getHeroByUserId(user.id,function(hero){
                req.session.user = user;  
                req.session.hero = hero;                
                userLogged.set(user.id,user);          
                req.sendFlash("happy","Bonjour "+user.name)  
                req.sendFlash("normal","Bienvenue au grand Hero "+hero.type+" "+hero.name)  
                color.successTxt(user.name + " vient de se connecter !");
                res.redirect('/home');
            })
        }else{
            color.errorTxt("ALERT : "+req.body.mail + " n'arrive pas à se connecter !");
            req.sendFlash("angry","Identifiants incorrect ! ")
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
        res.locals.page =  "home";          
        let opt = {tyranModeUnlocked: configInit.tyranModeUnlocked,
                   gdxModeUnlocked: configInit.gdxModeUnlocked}         
        res.render('home.ejs', opt); 
    }else{
        req.sendFlash("angry","Vous devez vous connecter pour acceder a l'accueil !")
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
    req.sendFlash("surprised","Le mode de jeu est reglé sur '"+configInit.gameMode+"'")
    var opt = {gameMode: configInit.gameMode}
    res.setHeader('Content-Type', 'text/html');      
    res.redirect('/taverne');  
})   

.get('/taverne', function(req, res) {
    res.setHeader('Content-Type', 'text/html'); 
    if(req.session.user != undefined &&  req.session.user != ""){
        res.locals.user =  req.session.user ;
        res.locals.hero =  req.session.hero ;      
        res.locals.page =  "taverne"; 
        res.sendFlash("happy","Bienvenue a la taverne du 'Chien errant' "+req.session.hero.name)
        res.render('taverne.ejs', {gameMode: configInit.gameMode}); 
    }else{
        req.sendFlash("angry","Vous devez vous connecter pour acceder a la taverne !")
        res.redirect('/login');
    }   
})

.post('/game-normal', function(req, res) {
    res.setHeader('Content-Type', 'text/html');
    let etage = 1;

    res.redirect('/game/normal/'+etage);  
})

.get('/game/:gameMode/:etage', function(req, res) {    
    res.setHeader('Content-Type', 'text/html'); 
    if(req.session.user != undefined &&  req.session.user != ""){ 
        res.locals.user =  req.session.user ;
        res.locals.hero =  req.session.hero ;    
        game.runPlateau();    
        color.infoTxt("lancement de l\'etage : "+ req.params.etage + " en mode "+configInit.gameMode); 
        res.render('game-normal.ejs', {gameMode: configInit.gameMode, etage:req.params.etage});
    }else{
        req.sendFlash("angry","Vous devez vous connecter pour acceder au plateau de jeu !")
        res.redirect('/login');
    }  
})

.get('*', function(req, res) {
    res.setHeader('Content-Type', 'text/html');    
    if(req.session.user){
        color.errorTxt(req.session.user.name+" a cherché a rejoindre une page inexistante !");
    }else{
        color.errorTxt("Un utilisateur non connecté a cherché a rejoindre une page inexistante !");
    }
    res.status(404);
    res.render('404.ejs',); 
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




servFunc.checkNbUser(io);
io.on('connection', (socket) => {
    socket.on("getPersoFiche",({typeMonster,idPerso})=>{
        if(typeMonster !== undefined){
            console.log("je souhaite les infos sur le "+typeMonster);
            socket.emit("receivePersoFiche",new Monster("Rat"))
        }else if(idPerso !== undefined){
            console.log("je souhaite les infos un heros qui a l'id : "+idPerso);
            heroMng.getHeroById(idPerso,(hero)=>{
                socket.emit("receivePersoFiche",hero)
            });
        }
    });
})

const io_game = io.of("/game")
var usersInGame = [];
io_game.on('connection', (socket) => {
    color.infoTxt('Un utilisateur se connecte au plateau');
    socket.on('disconnect', (reason) => {
        color.errorTxt(' quitte la home');
    });
});

const io_taverne = io.of('/taverne');  
io_taverne.on('connection',function(socket){ 
    
    socket.on("userLoggedTavern", function(idUser){
        userMng.getUserByIdWithHero(idUser.id,(user)=>{ 
            color.infoTxt(user.player.name +' se connecte a la taverne');
            socket.broadcast.emit("newUserLogged", user.hero.name)       
            usersInTaverne.set(socket.id,{player:user.player,hero:user.hero}); 
            userMng.getAllUsersWithHeros((allUsers)=>{                               
                io_taverne.emit('tavernNotLoggedUsers',allUsers);
                io_taverne.emit('tavernLoggedUsers',Array.from(usersInTaverne));
            });
        });
    })  
    
    socket.on('message', (msg) => { 
        let hero =  usersInTaverne.get(socket.id).hero;
        let dateTime = moment().format('DD/MM -- H:mm');
        console.log( dateTime+" --- "+hero.name+ " dit = "+msg)                  
        io_taverne.emit('message',{hero,msg,dateTime});
    });

    socket.on('invitation', (socketId) => { 
        let heroSender =  usersInTaverne.get(socket.id).hero;
        let heroInvited = usersInTaverne.get(socketId).hero;
        console.log(heroSender.name +" invite "+ heroInvited.name +" a sa table !");
        let params = {  heroSender:heroSender,
                        socketIdSender:socket.id,
                        heroInvited:heroInvited,
                        socketIdInvited:socketId,
                    }        
        socket.to(socketId).emit('invitation', params);
    });

    socket.on('invitation_refused', ({socketIdSender,heroInvited}) => {         
        color.errorTxt(heroInvited.name +" à refusé l'inviation !"); 
        socket.to(socketIdSender).emit('invitation_refused', heroInvited);      
    });

    socket.on('invitation_accepted', ({socketIdSender,heroSender,socketIdInvited,heroInvited}) => {         
        color.successTxt(heroInvited.name +" à accepté l'inviation !");
        socket.to(socketIdSender).emit('invitation_accepted', {socketIdInvited,heroInvited});        
        socket.emit('join_table', {socketIdSender,heroSender});        
    });

    socket.on('kick_table', (userKickedSocket) => { 
        let heroKicker =  usersInTaverne.get(socket.id).hero;        
        let heroKicked =  usersInTaverne.get(userKickedSocket).hero;        
        color.warningTxt(heroKicked.name +" à été kické de la table par "+heroKicker.name);
        socket.to(userKickedSocket).emit('kick_table',heroKicker);
    });



   socket.on('disconnect', (reason) => {
       if(usersInTaverne.get(socket.id)){
           color.errorTxt(usersInTaverne.get(socket.id).player.name + ' quitte la taverne'); 
           socket.broadcast.emit("userQuit", usersInTaverne.get(socket.id).hero.name)         
           usersInTaverne.delete(socket.id);   
           userMng.getAllUsersWithHeros((allUsers)=>{                    
               io_taverne.emit('tavernNotLoggedUsers',allUsers);
               io_taverne.emit('tavernLoggedUsers',Array.from(usersInTaverne));
           });
       }
    });
});

          





