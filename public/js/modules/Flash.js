class Flash{    
    constructor(msg,type){        
            this.id = $("#flashBox .flash").length;
            this.msg = msg;
            this.type = type;
            this.create();       
    }
    
    create(){
        if(this.msg != null){
            $("#flashBox").append(`<div class="flash flash-${this.id} ${this.type}"><p class="message">${this.msg}</p></div>`);
        }
        this.animation();
    }
    
    animation(){ 
        if(this.msg == null) {
            $('.flash').first().delay(500).show('fast', function showNextOne() {
                $(this).next('.flash').delay(500).show('fast', showNextOne);
            });
        }else{
            $(`.flash-${this.id}`).show('fast');
        }    

        $('.flash').first().delay(3000).hide('slow', function hideNextOne() {
            $(this).next('.flash').delay(2500).hide('slow', hideNextOne);
            $(this).remove();
        });
    }
}