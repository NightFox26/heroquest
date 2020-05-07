module.exports = class Partie{
    constructor(id = null,name = null,hero_id = null,etage = null,slots = null,mode = null,status=null,hero_1_id=null,hero_2_id=null,hero_3_id=null,hero_4_id=null){
        this.id         = id;
        this.name       = name;
        this.hero_id    = hero_id;
        this.etage      = etage;
        this.slots      = slots;
        this.mode       = mode;
        this.status     = status;
        this.hero_1_id  = hero_1_id;
        this.hero_2_id  = hero_2_id;
        this.hero_3_id  = hero_3_id;
        this.hero_4_id  = hero_4_id;
    }

    setId(id){
        this.id = id;
    }

    setName(name){
        this.name = name;
    }

    setHero_id(hero_id){
        this.hero_id = hero_id;
    }

    setEtage(etage){
        this.etage = etage;
    }

    setSlots(slots){
        this.slots = slots;
    }

    setMode(mode){
        this.mode = mode;
    }

    setStatus(status){
        this.status = status;
    }

    setHero_1_id(hero_1){
        this.hero_1_id = hero_1;        
    }

    setHero_2_id(hero_2){        
        this.hero_2_id = hero_2; 
    }

    setHero_3_id(hero_3){
        this.hero_3_id = hero_3; 
    }

    setHero_4_id(hero_4){
        this.hero_4_id = hero_4; 
    }
}