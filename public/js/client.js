$(function(){

    //gestion des flash messages
    $('.flash').first().delay(500).show('fast', function showNextOne() {
        $(this).next('.flash').delay(500).show('fast', showNextOne);
    });
    
    $('.flash').first().delay(5000).hide('slow', function hideNextOne() {
        $(this).next('.flash').delay(3000).hide('slow', hideNextOne);
    });
    /********************/ 
    
    
});