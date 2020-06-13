$(function(){
    const socket = io('/game');

    const myId         = $("#userId").text();
    const idPartie     = $("#idPartie").text();

    socket.emit("joinGame",idPartie)
        
    //envois de message chat sur le canal "game" vers le serveur
    $("#chatBox form").submit(function(e){
        e.preventDefault();
        let canal = "game_"+idPartie;
        let msg = $(this).find("input[name='message']").val();

        $(this).find("input[name='message']").val("").focus();
        socket.emit('message', ({heroId:myId, msg, canal}));
    })

    //reception de message chat depuis le serveur
    socket.on('message', (msg)=>{ 
        let typeMsg = "general";
        let titleMsg = "partie "+idPartie;
              
        $("#chatBox .chatBody ul").append(`<li class="${typeMsg}"><div><small>${msg.dateTime}--${titleMsg}</small></div><img src='/images/icon/${msg.hero.type}BL.png' alt="icon hero"/> <span>${msg.hero.name} :</span>${msg.msg}</li>`);
        $("#chatBox .chatBody").animate({ scrollTop: $('#chatBox .chatBody ul').height()}, 1000);

        let counterMsg = Number($("#chatBtn span").text());
        counterMsg++;
        $("#chatBtn span").text(counterMsg)
        playCssAnim({elm:'#chatBtn',anim:"bounce"});
    });

    //verif du serveur de jeu
    setInterval(function(){
        console.log("runtime verif")
        socket.emit("runtimeChecking", {idPartie})
    },20000)

    
    
    
});