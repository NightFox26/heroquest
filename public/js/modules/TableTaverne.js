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
        this.hero_1_id          = party.hero_1_id;
        this.hero_2_id          = party.hero_2_id;
        this.hero_3_id          = party.hero_3_id;
        this.hero_4_id          = party.hero_4_id;
        this.resetTable();
        this.create();       
    }

    create(){
        
        $("#tableTaverne h2 span").text(this.name);
        $("#tableTaverne .table").attr("data-idTable",this.id);
        
        this.socketGlobal.emit("getPersoFiche",{idPerso:this.hero_1_id});

        if(this.slots>1 && this.hero_2_id>0){
            this.socketGlobal.emit("getPersoFiche",{idPerso:this.hero_2_id});            
        }else if(this.slots>1 && this.hero_2_id==0){
            $("#tableTaverne #hero2").html('<img src="images/icon/rat.png" class="iconAvatar slot" alt="rat icon" data-idSlot="2" data-typeMonster="Rat">').show();
        }else{
            $("#tableTaverne #hero2").hide(); 
        }  
        
        if(this.slots>2 && this.hero_3_id>0){
            this.socketGlobal.emit("getPersoFiche",{idPerso:this.hero_3_id});
        }else if(this.slots>2 && this.hero_3_id==0){
            $("#tableTaverne #hero3").html('<img src="images/icon/rat.png" class="iconAvatar slot" alt="rat icon" data-idSlot="3" data-typeMonster="Rat">').show();
        }else{
            $("#tableTaverne #hero3").hide(); 
        }  

        if(this.slots>3 && this.hero_4_id>0){
            this.socketGlobal.emit("getPersoFiche",{idPerso:this.hero_4_id});
        }else if(this.slots>3 && this.hero_4_id==0){
            $("#tableTaverne #hero4").html('<img src="images/icon/rat.png" class="iconAvatar slot" alt="rat icon" data-idSlot="4" data-typeMonster="Rat">').show();
        }else{
            $("#tableTaverne #hero4").hide(); 
        }  
        
        this.socketGlobal.on("receivePersoFiche",(hero)=>{ 
            this.displayHero(hero);            
        })
    }

    displayHero(hero){
        console.log("new hero : "+hero.id)
                
        console.log("id_hero_2 "+this.hero_2_id)
        console.log("id_hero_3 "+this.hero_3_id)
        console.log("id_hero_4 "+this.hero_4_id)
       

        if(this.hero_1_id == hero.id){
            $("#tableTaverne #hero1").html('<img src="images/icon/'+hero.type+'.png" class="iconAvatar" alt="'+hero.type+' icon" data-idperso="'+hero.id+'" data-socket="'+this.socketHero+'">');
        }else if(this.hero_2_id == hero.id && this.hero_2_id != 0){
            $("#tableTaverne #hero2").html('<img src="images/icon/'+hero.type+'.png" class="iconAvatar" alt="'+hero.type+' icon" data-idperso="'+hero.id+'">').show();
        }else if(this.hero_3_id == hero.id && this.hero_3_id != 0){
            $("#tableTaverne #hero3").html('<img src="images/icon/'+hero.type+'.png" class="iconAvatar" alt="'+hero.type+' icon" data-idperso="'+hero.id+'">').show();
        }else if(this.hero_4_id == hero.id && this.hero_4_id != 0){
            $("#tableTaverne #hero4").html('<img src="images/icon/'+hero.type+'.png" class="iconAvatar" alt="'+hero.type+' icon" data-idperso="'+hero.id+'">').show();
        }
    }

    resetTable(){
        if(this.slots>1){
            $("#tableTaverne #hero2").html('<img src="images/icon/rat.png" class="iconAvatar slot" alt="rat icon" data-idSlot="2" data-typeMonster="Rat">').show();
        }else{
            $("#tableTaverne #hero2").hide(); 
        }

        if(this.slots>2){
            $("#tableTaverne #hero3").html('<img src="images/icon/rat.png" class="iconAvatar slot" alt="rat icon" data-idSlot="3" data-typeMonster="Rat">').show();
        }else{
            $("#tableTaverne #hero3").hide(); 
        }

        if(this.slots>3){
            $("#tableTaverne #hero4").html('<img src="images/icon/rat.png" class="iconAvatar slot" alt="rat icon" data-idSlot="4" data-typeMonster="Rat">').show();
        }else{
            $("#tableTaverne #hero4").hide(); 
        }
    }
}  