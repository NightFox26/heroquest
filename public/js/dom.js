function playCssAnim(params) {
    $(params.elm).removeClass(params.anim).addClass(params.anim + ' animated').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
      $(this).removeClass(params.anim);
    });
};

$(function () { 

    //permet d'initialiser les nouveau flash message sur une nouvelle page
    new Flash(null,null);  

    //les elements draggable
    $("#chatBox").draggable({
        handle: ".chatHeader",
        containment: "parent"
    });

    
    $("#newGameForm").draggable({
        handle: ".blackHeader",
        containment: "parent"
    });

    $("#loadGameForm").draggable({
        handle: ".blackHeader",
        containment: "parent"
    });

    $("#fichePerso").draggable({
        handle: ".blackHeader",
        containment: "parent"
    });

    /****************************/

})