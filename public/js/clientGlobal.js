const socketGlobal = io();

$(function(){
    const heroId = $("#userId").text();
    const idPartie = $("#idPartie").text();

    //affiche le nombre total d'utilisateur connecté au jeu
    socketGlobal.on("nbUserLogged",(nb)=>{       
        $("footer .usersLogged span.nb").text(" : "+nb);
    })


    /****************************/
    /********* LETTERS **********/
    /****************************/
    //telecharge les lettres de l'utilisateur
    let newLetterCount = 0;    
    socketGlobal.emit("getAllLetters",heroId)

    setInterval(()=>{        
        $("#letterBox ul").html("")
        socketGlobal.emit("getAllLetters",heroId)
    },30000)

    socketGlobal.on("allLetters",(letters)=>{         
        if(letters.id){
            new Letter(letters);
        }
    })
    socketGlobal.on("countLetterNotRead",(nb)=>{        
        if(nb>0){
            if(nb>newLetterCount){                    
                new Flash("Vous avez des lettres non lu dans votre boite de reception.", "happy");
            }
            $("#btnLetterBox .counter").text("( "+nb+" )")
            playCssAnim({elm:'#btnLetterBox',anim:"bounce"});
            newLetterCount = nb;
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
        let mail = new Letter(letter,"reading");        
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
    
    //click sur ecrire une lettre
    $(document).on("click",".btn-writteLetter",function(){ 
        let heroId = $(this).parents(".hero").find(".iconAvatar").attr("data-idperso");   
        let heroName = $(this).parents(".hero").find(".playerName").text().trim();
        let heroIcon = $(this).parents(".hero").find(".iconAvatar").attr("src");
        
        $("#sendLetter input[name='heroName']").val(heroName);
        $("#sendLetter input[name='heroId']").val(heroId);
        $("#sendLetter h3 .iconAvatar").attr("src",heroIcon);
        $("#sendLetter h3 .iconAvatar").attr("data-idperso",heroId);
        $("#sendLetter h3 .heroName").text(heroName);
        $("#sendLetter").show(500);
    });

    //envoyer une lettre
    $("#letterForm").submit(function(e){
        e.preventDefault();
        let heroName = $(this).find("input[name='heroName']").val();
        let for_heroId = $(this).find("input[name='heroId']").val();
        let from_heroId = heroId;
        let letter = {'title': $(this).find("input[name='title']").val(),
                      'content': $(this).find("textarea").val()}

        
        $("#sendLetter").hide(150,function(){
            new Flash("Ce parchemin a bien était envoyer à "+heroName+" !", "happy");
            if(heroId == 4){
                new Flash("Heyyy mais c'est une lettre pour moi ??", "angry");
            }
           socketGlobal.emit("sendLetter",{from_heroId,for_heroId,letter})
        });
    });
    /****************************************/


    /*******************************/
    /********* Fiche Hero **********/
    /*******************************/
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


    /*******************************/
    /******FERMETURE DE PARTIE**** */
    /*******************************/
    $("footer .gamePartie .btn-delete").click(function(){
        let idPartie = $(this).parents(".gamePartie").attr("data-partieid");   
        socketGlobal.emit("closingGame", {idPartie});
    })
    
    // forcer la redirection vers taverne
    socketGlobal.on("redirectToTaverne",(idGame)=>{ 
        $("footer .gamePartie[data-partieid='"+idGame+"']").remove();      
        if(idPartie == idGame){
            alert("La partie vient d'etre stoppé !");
            location.href = "/taverne";
        }
    })
})