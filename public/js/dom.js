function playCssAnim(params) {
    $(params.elm).removeClass(params.anim).addClass(params.anim + ' animated').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
      $(this).removeClass(params.anim);
    });
};

$(function () { 

    //permet d'initialiser les nouveau flash message sur une nouvelle page
    new Flash(null,null);  

    //chatBox draggable
    $("#chatBox").draggable({
        handle: ".chatHeader",
        containment: "parent"
    });

})