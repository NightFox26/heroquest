class TableTaverne{ 
    constructor(socketGlobal,socketHeroChef,party){  
        this.socketGlobal       = socketGlobal; 
        this.socketHero         = socketHeroChef;     
        this.id                 = party.id;
        this.name               = party.name;
        this.hero_id            = party.hero_id;
        this.etage              = party.etage;
        this.slots              = party.slots;
        this.mode               = party.mode;
        this.status             = party.status;
        this.hero_1             = party.hero_1;
        this.hero_2             = party.hero_2;
        this.hero_3             = party.hero_3;
        this.hero_4             = party.hero_4;        
        this.create();       
    }

    create(){        
        $("#tableTaverne h2 span").text(this.name);
        $("#tableTaverne .table").attr("data-idTable",this.id);
       
        $("#tableTaverne #hero1").html('<img src="images/icon/'+this.hero_1.type+'.png" class="iconAvatar" alt="'+this.hero_1.type+' icon" data-idperso="'+this.hero_1.id+'" data-socket="'+this.socketHero+'">');
        
        if(this.hero_2.id>0){
            $("#tableTaverne #hero2").html('<img src="images/icon/'+this.hero_2.type+'.png" class="iconAvatar" alt="'+this.hero_2.type+' icon" data-idperso="'+this.hero_2.id+'" >');
        }else if(this.slots>1 && this.hero_2.id==null){
            $("#tableTaverne #hero2").html('<img src="images/icon/rat.png" class="iconAvatar slot" alt="rat icon" data-idSlot="2" data-typeMonster="Rat">').show();
        }else{
            $("#tableTaverne #hero2").hide(); 
        }
        
        if(this.hero_3.id>0){
            $("#tableTaverne #hero3").html('<img src="images/icon/'+this.hero_3.type+'.png" class="iconAvatar" alt="'+this.hero_3.type+' icon" data-idperso="'+this.hero_3.id+'" >');
        }else if(this.slots>2 && this.hero_3.id==null){
            $("#tableTaverne #hero3").html('<img src="images/icon/rat.png" class="iconAvatar slot" alt="rat icon" data-idSlot="3" data-typeMonster="Rat">').show();
        }else{
            $("#tableTaverne #hero3").hide(); 
        }  

        if(this.hero_4.id>0){
            $("#tableTaverne #hero4").html('<img src="images/icon/'+this.hero_4.type+'.png" class="iconAvatar" alt="'+this.hero_4.type+' icon" data-idperso="'+this.hero_4.id+'" >');
        }else if(this.slots>3 && this.hero_4.id==null){
            $("#tableTaverne #hero4").html('<img src="images/icon/rat.png" class="iconAvatar slot" alt="rat icon" data-idSlot="4" data-typeMonster="Rat">').show();
        }else{
            $("#tableTaverne #hero4").hide(); 
        }          
    }
   
}  