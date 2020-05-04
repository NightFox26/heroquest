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
}

module.exports = {
    getTaverneSocketController
}