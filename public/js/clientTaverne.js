$(function(){
    const socket = io('/taverne');
    let searchParams = new URLSearchParams(window.location.search)

    var myId = $("#userId").text();
    var idPartie =searchParams.get('idPartie');
    var btnLaunchGame = $("#gameConfig .formSubmit a");

    
    //gestion du lancement de partie depuis la taverne
    $(btnLaunchGame).click(()=>{
        socket.emit("launchGame", idPartie);
    })
    
    socket.on("teleportToGame",(idPartie)=>{
        location.href = "/game/"+idPartie;
    })
    
          
    //previent le serveur qu'un utilisateur se connecte
    socket.emit("userLoggedTavern",({idUser:myId,idPartie:idPartie}));    

    //Affiche les utilisateurs connectés a la taverne
    socket.on('tavernLoggedUsers', (users) => {        
        $("#allPlayerSection .connectedUser").html("");        
        for(let user of (new Map(users))){ 
            $("#allPlayerSection .connectedUser").append('<li class="hero" data-idUser="'+user[1].player.id+'" data-idHero="'+user[1].hero.id+'" data-socketId="'+user[0]+'"><img src="images/icon/'+user[1].hero.type+'.png" alt="'+user[1].hero.type+' icon" class="iconAvatar" data-idPerso="'+user[1].hero.id+'"><span class="playerName"> '+user[1].hero.name+'</span><div class="playersAction"><button class="btn letter btn-writteLetter"></button><button class="btn drink" data-tableId=""><img src="images/icon/cup.png" alt="icone coupe"></button></div></li>');
            $("#allPlayerSection .notConnectedUser li[data-idUser='"+user[1].player.id+"']").remove()
        }
        $("#allPlayerSection .connectedUser li[data-idUser='"+myId+"'] .playersAction").remove()
    });

    //Affiche les utilisateurs non connectés a la taverne
    socket.on('tavernNotLoggedUsers', (users) => {        
        $("#allPlayerSection .notConnectedUser").html("");        
        for(let user of users){                            
            $("#allPlayerSection .notConnectedUser").append('<li class="hero" data-idUser="'+user.player.id+'"><img src="images/icon/'+user.hero.type+'Bl.png" alt="'+user.hero.type+' icon" class="iconAvatar" data-idPerso="'+user.hero.id+'"><span class="playerName"> '+user.hero.name+'</span><div class="playersAction"><button class="btn letter btn-writteLetter"></button></div></li>');
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

    //envois de message chat sur le canal "general" vers le serveur
    $("#chatBox form").submit(function(e){
        e.preventDefault();
        let msg = $(this).find("input[name='message']").val();
        $(this).find("input[name='message']").val("").focus();
        socket.emit('message', ({msg}));
    })

    //envois de message chat sur le canal "table" vers le serveur
    $(".tableChat form").submit(function(e){
        e.preventDefault();
        let msg = $(this).find("input[name='tableMsg']").val();
        let canal = $(this).attr("data-canal");
        $(this).find("input[name='tableMsg']").val("").focus();
        socket.emit('message', ({msg,canal}));
    })

    //reception de message chat depuis le serveur
    socket.on('message', (msg)=>{ 
        let typeMsg = "general";
        let titleMsg = "Toute la Taverne";
        if(msg.canal !== "general"){
            typeMsg="tableMsg";
            titleMsg = "chuchote pour la table";
        }      
        $("#chatBox .chatBody ul").append(`<li class="${typeMsg}"><div><small>${msg.dateTime}--${titleMsg}</small></div><img src='images/icon/${msg.hero.type}BL.png' alt="icon hero"/> <span>${msg.hero.name} :</span>${msg.msg}</li>`);
        $("#chatBox .chatBody").animate({ scrollTop: $('#chatBox .chatBody ul').height()}, 1000);

        let counterMsg = Number($("#chatBtn span").text());
        counterMsg++;
        $("#chatBtn span").text(counterMsg)
        playCssAnim({elm:'#chatBtn',anim:"bounce"});
    });

    //boucle de verification des nouvelles parties qui attendent des joueurs    
    setInterval(function(){
        $.get( "/taverne/getAllWaitingTables", function(tablesWaiting){ 
            if($('#tableTaverne').is(':hidden')){          
                $(".connectedUser li .drink").hide();
            }
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

    //boucle qui recharge la table coté joueur (a gauche)
    setInterval(function(){
        if($('#tableInvited').is(':visible')){
            let idTable =$('#tableInvited').attr("data-idTable");            
            $.get( "/taverne/getTableInfo",{id:idTable}, function(table){             
                updateTablePlayerSide(table);                
            })
        }

        if($('#gameConfig').is(':visible')){
            let idTable =$('#gameConfig').attr("data-idTable");            
            $.get( "/taverne/getTableInfo",{id:idTable}, function(table){ 
                updateTableChefSide(table)
            })
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
    socket.on('invitation_accepted', ({idParty,heroChef})=>{        
        new Flash(heroChef.name+" à accepté de trinquer avec vous ! ", "happy"); 
        $("#playerSection #gameConfig").remove();     
        $("#playerSection #tableInvited").show(500).attr("data-idTable",idParty)
        $("#playerSection #tableInvited .tableChat form").attr("data-canal",idParty)
    });

    //le chef de table a quitté la taverne
    socket.on('chef_table_exited', (idParty)=>{        
        new Flash("Le chef de table a quitté precipitamment la taverne .... ", "surprised");        
    });

    //Dire au serveur de Kicker un utilisateur de la table
    $(document).on("click",".kickUser",function(){        
        let idParty          = $(this).parents("#gameConfig").attr("data-idtable");
        let userKickedSocket = $(this).parents(".hero").find(".iconAvatar").attr("data-socketId");
        let userKickedSlot   = $(this).parents(".hero").find(".iconAvatar").attr("data-slot");
        new Flash("Moi je l'aimé bien ce joueur... ", "sad");
        socket.emit("kick_table",({idParty,userKickedSocket,userKickedSlot}));
    })

    //On se fait kicker de la table
    socket.on('kick_table', (heroKicker)=>{        
        new Flash("Vous avez été kické de la table par "+heroKicker.name, "surprised"); 
        $("#playerSection #tableInvited").hide(500);
    });
    
   
    function updateTablePlayerSide(table){
        if($("#playerSection #tableInvited").attr("data-idTable") == table.id){
            
            $("#playerSection #gameConfig").hide(500);     
            $("#playerSection #tableInvited .hero").html("") ;

            if(table.status == "stopped"){ 
                $("#playerSection #tableInvited").hide(500);
                return;
            }
            
            addPlayerInTableLeftSide(table.hero_1,1)
            addPlayerInTableLeftSide(table.hero_2,2)
            addPlayerInTableLeftSide(table.hero_3,3)
            addPlayerInTableLeftSide(table.hero_4,4)
        }
    }

    function updateTableChefSide(table){        
        if($("#playerSection #gameConfig").attr("data-idTable") == table.id){

            $("#playerSection #tableInvited").hide(500);
            $("#playerSection #gameConfig .hero").html('<img src="images/icon/rat.png" class="iconAvatar rat" alt="rat icon" data-typeMonster="Rat">') ;
                 
            if(table.status == "stopped"){            
                $("#playerSection #gameConfig").hide(500);                
                return;
            }            
            
            addPlayerInChefTableLeftSide(table.hero_2,2)
            addPlayerInChefTableLeftSide(table.hero_3,3)
            addPlayerInChefTableLeftSide(table.hero_4,4)
        }
    }

    function addPlayerInTableLeftSide(hero,hero_place){
        if(hero.id > 0){           
            $("#playerSection #tableInvited #hero_"+hero_place).html(`<img src="/images/icon/${hero.type}.png" alt="icon joueur" class="iconAvatar" data-idperso="${hero.id}"> <span>${hero.name}</span>`);
        }
    }

    function addPlayerInChefTableLeftSide(hero,hero_place){
        if(hero.id > 0){   
            let socketId = $(".connectedUser li[data-idhero='"+hero.id+"']").attr("data-socketid");  

            $("#playerSection #gameConfig #rat_"+hero_place).html(`<div><img src="/images/icon/${hero.type}.png" alt="icon joueur" class="iconAvatar" data-socketId="${socketId}" data-slot="${hero_place}" data-idperso="${hero.id}"> <button class="btn kickUser">Expulser</button></div>`);
        }
    }

    
    
    
});