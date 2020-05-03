function toggle_full_screen() {
    var elem = document.documentElement;
    if(document.fullscreenElement){
        closeFullscreen();
    }else{
        page_Fullscreen();
    }
}

function closeFullscreen() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.mozCancelFullScreen) {
        /* Firefox */
        document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
        /* Chrome, Safari and Opera */
        document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
        /* IE/Edge */
        document.msExitFullscreen();
    }
}

function page_Fullscreen() {
    var elem = document.documentElement;
    if (elem.requestFullscreen) {
        elem.requestFullscreen();
    } else if (elem.msRequestFullscreen) {
        elem.msRequestFullscreen();
    } else if (elem.mozRequestFullScreen) {
        elem.mozRequestFullScreen();
    } else if (elem.webkitRequestFullscreen) {
        elem.webkitRequestFullscreen();
    }
}

function showModalInfo(text, reward=null){      
    $(".modalBgFade").fadeIn(500,function(){
        $(".modal p.desc").html(text)
        $(".modal p.reward").hide()
        if(reward){
            $(".modal p.reward span").html(reward)
            $(".modal p.reward").show()
        }
        $(".modal").slideDown(300)
    });    
}

function closeModal(){      
    $(".modal").slideUp(300,function(){
        $(".modalBgFade").fadeOut(500)
    });    
}

function toggle_headerFooter(){
    $("nav, footer").fadeToggle(500);
}

function toggle_Chat(){
    $("#chatBox").fadeToggle(500);
    $("#chatBox input[name='message']").focus();
}

function closeChat(){
    $("#chatBox").fadeOut(500);
}

function toggle_NewGame(){
    $("#newGameForm").fadeToggle(500);
    $("#newGameForm input[name='game_name']").focus();
    if ($("#newGameForm").is(':visible')){
        closeLoadGame(0)
    }
}

function closeNewGame(time = 500){
    $("#newGameForm").fadeOut(time);
}

function toggle_LoadGame(){
    $("#loadGameForm").fadeToggle(500);
    if ($("#loadGameForm").is(':visible')){
        closeNewGame(0);
    }
}

function closeLoadGame(time = 500){
    $("#loadGameForm").fadeOut(time);
}

function open_FichePerso(){
    $("#fichePerso").hide(200,function(){
        $("#fichePerso").show(500);
    });
}

function closeFichePerso(time = 500){
    $("#fichePerso").fadeOut(time);
}