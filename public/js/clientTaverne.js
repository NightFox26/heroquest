$(function(){
    const socket = io('/taverne');
    var myId = $("#userId").text();
    
    //previent le serveur qu'un utilisateur se connecte
    socket.emit("userLoggedTavern",{id:myId});

    //Affiche les utilisateurs connectés a la taverne (sauf sois meme)
    socket.on('tavernLoggedUsers', (users) => {        
        $("#allPlayerSection .connectedUser").html("");
        for(let user of (new Map(users))){  
            $("#allPlayerSection .connectedUser").append('<li data-idUser="'+user[1].player.id+'"><img src="images/icon/'+user[1].hero.type+'.png" alt="'+user[1].hero.type+' icon" class="iconAvatar"><span class="playerName"> '+user[1].hero.name+'</span><div class="playersAction"><button class="btn"><img src="images/icon/letter.png" alt="icone lettre"></button><button class="btn"><img src="images/icon/cup.png" alt="icone coupe"></button></div></li>');
            $("#allPlayerSection .notConnectedUser li[data-idUser='"+user[1].player.id+"']").remove()
        }
        $("#allPlayerSection .connectedUser li[data-idUser='"+myId+"'] .playersAction").remove()
    });

    //Affiche les utilisateurs non connectés a la taverne
    socket.on('tavernNotLoggedUsers', (users) => {        
        $("#allPlayerSection .notConnectedUser").html("");        
        for(let user of users){                            
            $("#allPlayerSection .notConnectedUser").append('<li data-idUser="'+user.player.id+'"><img src="images/icon/'+user.hero.type+'Bl.png" alt="'+user.hero.type+' icon" class="iconAvatar"><span class="playerName"> '+user.hero.name+'</span><div class="playersAction"><button class="btn"><img src="images/icon/letter.png" alt="icone lettre"></button><button class="btn"><img src="images/icon/cup.png" alt="icone coupe"></button></div></li>');
        }
    });

    socket.on("newUserLogged",(heroName)=>{        
        $("#flashBox").append(flashMessageNewUser(heroName));
        animateFlashMessage();
    })

    //envois de message chat vers le serveur
    $("#chatBox form").submit(function(e){
        e.preventDefault();
        let msg = $(this).find("input[name='message']").val();
        $(this).find("input[name='message']").val("").focus();
        socket.emit('message', msg);
    })

    //reception de message chat depuis le serveur
    socket.on('message', (msg)=>{        
        $("#chatBox .chatBody ul").append(`<li><div><small>${msg.dateTime}</small></div> <span>${msg.hero} :</span>${msg.msg}</li>`);
        $("#chatBox .chatBody").animate({ scrollTop: $('#chatBox .chatBody ul').height()}, 1000);
    });


    function flashMessageNewUser(heroName){
        return `<div class="flash info"><p class="message"> ${heroName} vient d'entrer dans la taverne !</p></div>`;
    }





    
    
});