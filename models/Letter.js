module.exports = class Letter{
    constructor(){
        this.id;
        this.title;
        this.content;
        this.date;
        this.readed;
        this.for_hero_id;
        this.from_hero_id;
        this.for_hero;
        this.from_hero;
    }

    setId(id){
        this.id = id;
    }

    setTitle(title){
        this.title = title;
    }

    setContent(content){
        this.content = content;
    }

    setDate(date){
        this.date = date;
    }

    setReaded(readed){
        this.readed = readed;
    }

    setFor_hero_id(hero_id){
        this.for_hero_id = hero_id;
    }

    setFrom_hero_id(hero_id){
        this.from_hero_id = hero_id;
    }

    setFor_hero(hero){
        this.for_hero = hero;
    }

    setFrom_hero(hero){
        this.from_hero = hero;
    }

}