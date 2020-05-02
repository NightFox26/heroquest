
$(function () { 

    //permet d'initialiser les nouveau flash message sur une nouvelle page
    new Flash(null,null);  

    //chatBox draggable
    $("#chatBox").draggable({
        handle: ".chatHeader",
        containment: "parent"
    });
})