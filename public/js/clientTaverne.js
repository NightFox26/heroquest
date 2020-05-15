$(function(){
    const socket = io('/taverne');
    let searchParams = new URLSearchParams(window.location.search)

    var myId = $("#userId").text();
    var idPartie =searchParams.get('idPartie');
          
    //previent le serveur qu'un utilisateur se connecte
    socket.emit("userLoggedTavern",({idUser:myId,idPartie:idPartie}));    

    //Affiche les utilisateurs connectés a la taverne
    socket.on('tavernLoggedUsers', (users) => {        
        $("#allPlayerSection .connectedUser").html("");        
        for(let user of (new Map(users))){ 
            $("#allPlayerSection .connectedUser").append('<li data-idUser="'+user[1].player.id+'" data-idHero="'+user[1].hero.id+'" data-socketId="'+user[0]+'"><img src="images/icon/'+user[1].hero.type+'.png" alt="'+user[1].hero.type+' icon" class="iconAvatar" data-idPerso="'+user[1].hero.id+'"><span class="playerName"> '+user[1].hero.name+'</span><div class="playersAction"><button class="btn letter"><img src="images/icon/letter.png" alt="icone lettre"></button><button class="btn drink" data-tableId=""><img src="images/icon/cup.png" alt="icone coupe"></button></div></li>');
            $("#allPlayerSection .notConnectedUser li[data-idUser='"+user[1].player.id+"']").remove()
        }
        $("#allPlayerSection .connectedUser li[data-idUser='"+myId+"'] .playersAction").remove()
    });

    //Affiche les utilisateurs non connectés a la taverne
    socket.on('tavernNotLoggedUsers', (users) => {        
        $("#allPlayerSection .notConnectedUser").html("");        
        for(let user of users){                            
            $("#allPlayerSection .notConnectedUser").append('<li data-idUser="'+user.player.id+'"><img src="images/icon/'+user.hero.type+'Bl.png" alt="'+user.hero.type+' icon" class="iconAvatar" data-idPerso="'+user.hero.id+'"><span class="playerName"> '+user.hero.name+'</span><div class="playersAction"><button class="btn letter"><img src="images/icon/letter.png" alt="icone lettre"></button><button class="btn drink"><img src="images/icon/cup.png" alt="icone coupe"></button></div></li>');
        }
    });

    //un nouvelle utilisateur se connecte a la taverne
    socket.on("newUserLogged",(heroName)=>{ 
        new Flash(heroName+" vient d'entrer dans la taverne !", "happy"); 
    })

    //un utilisateur quitte a la taverne
    socket.on("userQuit",(heroName)=>{          
        new Flash(heroName+" à quitté la taverne !", "sad"); 
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
        $("#chatBox .chatBody ul").append(`<li><div><small>${msg.dateTime}</small></div><img src='images/icon/${msg.hero.type}BL.png' alt="icon hero"/> <span>${msg.hero.name} :</span>${msg.msg}</li>`);
        $("#chatBox .chatBody").animate({ scrollTop: $('#chatBox .chatBody ul').height()}, 1000);

        let counterMsg = Number($("#chatBtn span").text());
        counterMsg++;
        $("#chatBtn span").text(counterMsg)
        playCssAnim({elm:'#chatBtn',anim:"bounce"});
    });

    //boucle de verification des nouvelles parties qui attendent des joueurs    
    setInterval(function(){
        $.get( "/taverne/getAllWaitingTables", function(tablesWaiting){           
            $(".connectedUser li .tableWaiting").remove();
            var idTablesWaiting = [];
            tablesWaiting.forEach(table => {
                $(".connectedUser li[data-idhero='"+table.hero_id+"'] .drink").attr("data-tableId",table.id).slideDown(500,function(){                    
                    playCssAnim({elm:$(this),anim:"bounce"}); 
                    idTablesWaiting.push(table.id);
                }) 
            });

            if($('#tableTaverne').is(':visible')){
                let idTable =$('#tableTaverne .table').attr("data-idtable");                 
                if(!idTablesWaiting.includes(parseInt(idTable))){
                    $('#tableTaverne').hide(500);
                } 
            }
        } )
    },4000)

    //boucle qui recharge la table pour voir les nouveaux joueurs dessus toutes les 3s si la table est ouverte
    setInterval(function(){
        if($('#tableTaverne').is(':visible')){
            let idTable =$('#tableTaverne .table').attr("data-idtable");            
            $(".drink[data-tableid='"+idTable+"']").trigger("click");
        }
    },3000)

    //envois une requete pour voir la table d'un joueur
    $(document).on("click",".drink",function(){ 
        let socketHeroChef = $(this).parents("li").attr("data-socketid");
        let partyId = $(this).attr("data-tableid");
        socket.emit('getParty', ({partyId,socketHeroChef}));
    })

    //reception des infos sur la table
    socket.on("infosParty",({party,socketHeroChef})=>{ 
        new TableTaverne(socketGlobal,socketHeroChef,party);
        $("#tableTaverne").show(500);      
    });

    //envois d'une demande pour rejoindre une table
    $(document).on("click",".table .slot",function(){ 
        let idSlot = $(this).attr("data-idSlot");
        let idParty = $(this).parents(".table").attr("data-idTable");
        let socketHeroChef = $(this).parents(".table").find("#hero1 img").attr("data-socket");
        socket.emit("joinParty",({socketHeroChef,idParty,idSlot}));       
    })    

    //reception d'invitation joueur depuis le server
    socket.on('joinPartyRequest', ({idParty,idSlot,heroChef,socketHeroChef,heroJoiner,socketHeroJoiner})=>{        
        new Flash(heroJoiner.name+" souhaite rejoindre votre table ! <br> Vous devriez accepter.", "happy");          
        new Invitation(socket,heroChef,socketHeroChef,heroJoiner,socketHeroJoiner,idParty,idSlot); 
    });

    
    //reception du refus d'invitation d'un utilisateur
    socket.on('invitation_refused', (heroChef)=>{        
        new Flash(heroChef.name+" ne souhaite pas trinquer avec vous .... ", "surprised");
        $("#tableTaverne").hide(500);
    });
   
    //reception de l'acceptation d'invitation d'un utilisateur
    socket.on('invitation_accepted', ({socketIdInvited,heroChef})=>{        
        new Flash(heroChef.name+" à accepté de trinquer avec vous ! ", "happy");
        // addPlayerToTable(socketIdInvited,heroInvited);
    });

    //reception du refus d'invitation d'un utilisateur
    socket.on('chef_table_exited', (idParty)=>{        
        new Flash("Le chef de table a quitté precipitamment la taverne .... ", "surprised");
        $("#tableTaverne").hide(500);
    });

     /*********** A REVOIR !!!!!! */
    //ajouter a ma table l'utilisateur qui m'a invité
    socket.on('join_table', ({socketIdSender,heroSender})=>{        
        new Flash("Vous rejoignez la table de "+heroSender.name, "normal");
        addPlayerToTable(socketIdSender,heroSender);
    });

    //Dire au serveur de Kicker un utilisateur de la table
    $(document).on("click",".selectCoequipier .btn-close",function(){        
        let userKickedSocket = $(this).parents(".selectCoequipier").attr("data-idSocket");
        let userClass = $(this).parents(".selectCoequipier").removeClass("selectCoequipier").attr("class");
        new Flash("Moi je l'aimé bien ce joueur... ", "sad"); 
        removePlayerToTable(userClass);     
        socket.emit("kick_table",userKickedSocket);
    })

    //On se fait kicker de la table
    socket.on('kick_table', (heroKicker)=>{        
        new Flash("Vous avez été kické de la table par "+heroKicker.name, "surprised"); 
        let heroClass = "hero-"+heroKicker.id;
        removePlayerToTable(heroClass);     
    });


    function addPlayerToTable(heroSocket,hero){
        $(".ratBox").hide(500);
        let rowPlayer = `<div class="selectCoequipier hero-${hero.id}" data-idSocket="${heroSocket}">
                        <input type="checkbox"><img src="images/icon/${hero.type}.png" alt="hero icon" class="iconAvatar" data-idPerso='${hero.id}'> <label class="playerName">${hero.name}</label>  
                        <button type="button" class="btn btn-close"></button> 
                    </div>`;
        $("#playersAtMyTable").append(rowPlayer);
    }

    function removePlayerToTable(userClass){        
        $(document).find("."+userClass).hide(500,function(){
            $(this).remove();
            if($(document).find(".selectCoequipier").length == 0){
                $(".ratBox").show(500);
            }
        });
    }

    /*********************************/
    
    
});