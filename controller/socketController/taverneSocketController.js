const configInit    = require("../../config/configInit");
const color         = require("../../modules/colorsTxt");
const servFunc      = require("../../modules/functionServer");

const userMng   = require("../../models/manager/UserMng");
const heroMng   = require("../../models/manager/HeroMng");
const partieMng = require("../../models/manager/PartieMng");

function getTaverneSocketController(io,usersInTaverne,req){ 

    const io_taverne = io.of('/taverne'); 

    io_taverne.on('connection',function(socket,){         
        
        socket.on("userLoggedTavern", function({idUser,idPartie}){ 
            userMng.getUserByIdWithHero(idUser,(user)=>{ 
                color.infoTxt(user.player.name +' se connecte a la taverne');
                socket.broadcast.emit("newUserLogged", user.hero.name)       
                usersInTaverne.set(socket.id,{player:user.player,hero:user.hero}); 

                partieMng.stopAllPartiesStatusByUserId(user.hero,()=>{})

                if(idPartie){                    
                    partieMng.getPartieByIdAndHero(idPartie,user.hero.id,(partie)=>{
                        partieMng.uppdatePartieStatusById(partie,"waiting",()=>{})
                    })
                }

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

        socket.on('getParty', ({partyId,socketHeroChef}) => { 
            let hero =  usersInTaverne.get(socket.id).hero;
            partieMng.getPartieById(partyId,(party)=>{
                //console.log("J'envoie les infos de la table id "+partyId+" a "+hero.name);               
                socket.emit('infosParty',{party,socketHeroChef});
            })
        });
        
        socket.on('joinParty', ({socketHeroChef,idParty,idSlot}) => { 
            let heroJoiner =  usersInTaverne.get(socket.id).hero;
            if(usersInTaverne.get(socketHeroChef)){
                let heroChef = usersInTaverne.get(socketHeroChef).hero;
                
                color.infoTxt(heroJoiner.name +" souhaite rejoindre la table id : "+ idParty + " sur le slot "+ idSlot);
                
                let params = {  
                                idParty         :idParty,
                                idSlot          :idSlot,
                                heroChef        :heroChef,
                                socketHeroChef  :socketHeroChef,
                                heroJoiner      :heroJoiner,
                                socketHeroJoiner:socket.id
                            }        
                socket.to(socketHeroChef).emit('joinPartyRequest', params);
            }else{
                console.log("le chef de la table "+idParty+" a quitté la taverne !")
                socket.emit('chef_table_exited',idParty);
            }
        });
        
        
        socket.on('invitation_refused', ({socketHeroJoiner,heroChef}) => {         
            color.errorTxt(heroChef.name +" à refusé l'inviation !"); 
            socket.to(socketHeroJoiner).emit('invitation_refused', heroChef);      
        });
        
        socket.on('invitation_accepted', ({idParty,slot,socketHeroChef,heroChef,socketHeroJoiner,heroJoiner}) => { 
            partieMng.uppdatePartieHeroById(idParty,slot,heroJoiner,()=>{
                color.successTxt(heroChef.name +" à accepté que "+heroJoiner.name +" rejoigne sa table !");
                socket.to(socketHeroJoiner).emit('invitation_accepted', {socketHeroChef,heroChef});      
            })
        });

        /*
        socket.on('kick_table', (userKickedSocket) => { 
            let heroKicker =  usersInTaverne.get(socket.id).hero;        
            let heroKicked =  usersInTaverne.get(userKickedSocket).hero;        
            color.warningTxt(heroKicked.name +" à été kické de la table par "+heroKicker.name);
            socket.to(userKickedSocket).emit('kick_table',heroKicker);
        });
        */



        socket.on('disconnect', (reason) => {
            if(usersInTaverne.get(socket.id)){
                let user = usersInTaverne.get(socket.id);
                color.errorTxt(user.player.name + ' quitte la taverne'); 
                socket.broadcast.emit("userQuit", user.hero.name)         
                usersInTaverne.delete(socket.id); 

                partieMng.stopAllPartiesStatusByUserId(user.hero,()=>{})

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