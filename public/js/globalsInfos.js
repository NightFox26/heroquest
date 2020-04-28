$(function(){
    const socket = io();

    //affiche le nombre total d'utilisateur connecté au jeu
    socket.on("nbUserLogged",(nb)=>{       
        $("footer .usersLogged span.nb").text(" : "+nb);
    })
})