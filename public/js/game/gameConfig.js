$(function(){

    const SHOW_GRID         = 0;
    const SHOW_UNDER_FOG    = 1;


    if(SHOW_GRID){
        $("#gamePage .gridId").show();
        $("#gamePage .tiles").addClass("borderGrid");
    }

    if(SHOW_UNDER_FOG){
        $("#gamePage .tiles").removeClass("fog");
    }

    

});