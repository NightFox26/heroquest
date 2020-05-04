module.exports = class Partie{
    constructor(id = null,name = null,hero_id = null,etage = null,slots = null,mode = null){
        this.id         = id;
        this.name       = name;
        this.hero_id    = hero_id;
        this.etage      = etage;
        this.slots      = slots;
        this.mode       = mode;
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
}