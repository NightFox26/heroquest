const socketGlobal = io();

$(function(){
    const heroId = $("#userId").text();

    //affiche le nombre total d'utilisateur connecté au jeu
    socketGlobal.on("nbUserLogged",(nb)=>{       
        $("footer .usersLogged span.nb").text(" : "+nb);
    })


    /****************************/
    /********* LETTERS **********/
    /****************************/
    //telecharge les lettres de l'utilisateur
    socketGlobal.emit("getAllLetters",heroId)
    socketGlobal.on("allLetters",(letters)=>{ 
        if(letters.id){
            new Letter(letters);
        }
    })
    socketGlobal.on("countLetterNotRead",(nb)=>{        
        if(nb>0){
            new Flash("Vous avez des lettres non lu dans votre boite de reception.", "happy");
            $("#btnLetterBox .counter").text("( "+nb+" )")
            playCssAnim({elm:'#btnLetterBox',anim:"bounce"});
        }else{
            $("#btnLetterBox .counter").text("")
        }
    })

    //Click sur une lettre
    $("#letterBox").on("click",".letter",function(){
        let idLetter = $(this).attr("data-letterId"); 
        $(this).parent().find(".notRead").text("");     
        socketGlobal.emit("readLetter",({idLetter,heroId}));
    })

    socketGlobal.on("readLetter",(letter)=>{        
        let mail = new Letter(letter,true);
        mail.hydrate();
        $("#letter").show(500);

    });

    //Click sur supprimer lettre
    $("#letter .btn-delete").click(function(){
        let idLetter = $(this).parents("#letter").attr("data-idLetter");       
        socketGlobal.emit("deleteLetter",idLetter)
    })

    socketGlobal.on("deleteLetter",(idLetter)=>{
        $("#letter").hide(200);
        $("#letterBox ul .rowLetter").remove();
        $("#letterBox ul hr").not(':first').remove();
        $("#letterBox ul .noLetters").show();
        new Flash("Ce parchemin a bien était supprimé.", "normal");
        socketGlobal.emit("getAllLetters",heroId)
    })
    /****************************************/


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