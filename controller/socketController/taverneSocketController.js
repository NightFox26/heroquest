const configInit    = require("../../config/configInit");
const color         = require("../../modules/colorsTxt");
const servFunc      = require("../../modules/functionServer");

const userMng   = require("../../models/manager/UserMng");
const heroMng   = require("../../models/manager/HeroMng");
const partieMng = require("../../models/manager/PartieMng");

function getTaverneSocketController(io,usersInTaverne){ 

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

        socket.on('getParty', ({partyId,heroChefSocket}) => { 
            let hero =  usersInTaverne.get(socket.id).hero;
            partieMng.getPartieById(partyId,(party)=>{
                console.log("J'envoie les infos de la table id "+partyId+" a "+hero.name);               
                socket.emit('infosParty',{party,heroChefSocket});
            })
        });

        
        socket.on('joinParty', ({heroChefSocket,idTable,idSlot}) => { 
            let heroSender =  usersInTaverne.get(socket.id).hero;
            let heroChef = usersInTaverne.get(heroChefSocket).hero;
            
            color.infoTxt(heroSender.name +" souhaite rejoindre la table id : "+ idTable + " sur le slot "+ idSlot);
            
            let params = {  heroSender:heroSender,
                            socketIdSender:socket.id,
                            heroChef:heroChef,
                            heroChefSocket:heroChefSocket,
                        }        
            socket.to(heroChefSocket).emit('joinPartyRequest', params);
        });
        
        /*
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
        */



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
}

module.exports = {
    getTaverneSocketController
}