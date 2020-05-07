const socketGlobal = io();

$(function(){

    //affiche le nombre total d'utilisateur connecté au jeu
    socketGlobal.on("nbUserLogged",(nb)=>{       
        $("footer .usersLogged span.nb").text(" : "+nb);
    })

    //remplie la fiche des persos
    $(document).on('click','.iconAvatar',function(){
        open_FichePerso();
        let typeMonster = $(this).attr("data-typeMonster");
        let idPerso = $(this).attr("data-idPerso");        
        socketGlobal.emit("getPersoFiche",{typeMonster:typeMonster,idPerso:idPerso});
    })

    socketGlobal.on("receivePersoFiche",(perso)=>{        
        $('#fichePerso .content').css("background-image",`url('../images/elements/${perso.type}.png')`);
        $('#fichePerso .icon').attr("src",`/images/icon/${perso.type}.png`);
        //si la fiche est pour un hero
        if(perso.player_id !== undefined){
            $('#fichePerso .name').text(perso.name);
            $('#fichePerso .desc').text(perso.desc);
            $('#fichePerso .move').text(perso.stats.moveDice);
        }else{
            $('#fichePerso .name').text(perso.stats.name);
            $('#fichePerso .desc').text(perso.stats.desc);
            $('#fichePerso .move').text(perso.stats.move);
        }
        $('#fichePerso .atk').text(perso.stats.atkDice);
        $('#fichePerso .def').text(perso.stats.defDice);
        $('#fichePerso .vie').text(perso.stats.hp);
        $('#fichePerso .esprit').text(perso.stats.mp);
    })
    /*******************************************************/
    
})