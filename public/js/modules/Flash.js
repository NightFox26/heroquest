class Flash{ 
    constructor(msg,type){
        this.id = $("#flashBox .flash").length;
        this.msg = msg;
        this.type = type;
        this.iaName = "Astria";
        this.deleteTime = 3000;
        this.create();       
    }
    
    create(){
        if(this.msg != null){
            $("#flashBox").append(`<div class="flash flash-${this.id} ${this.type}"><div class="iaIcon">${this.iaName} :</div><p class="message">'${this.msg}'</p></div>`);
        }
        this.animation();
    }
    
    animation(){ 
        let $this = this;

        if(this.msg == null) {
            $('.flash').first().delay(500).show('fast', function showNextOne() {
                $(this).next('.flash').delay(500).show('fast', showNextOne);
            });
        }else{
            $(`.flash-${this.id}`).show('fast');
        }    

        $('.flash').first().delay($this.deleteTime).hide('slow', function hideNextOne() {
            $(this).next('.flash').delay($this.deleteTime).hide('slow', hideNextOne);
            $(this).remove();
        });
    }
}