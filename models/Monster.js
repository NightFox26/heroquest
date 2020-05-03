
class MonstAction {    
    moving(){
        console.log(this.nom+" peut se deplacer de  "+this.stats.move+" cases");
    }
    
    attack(pers,dice){
        console.log(pers.nom+" subit "+dice.atk+" pts de degats de la part de "+this.nom);
        pers.stats.hp -= dice.atk;
    }
}

class Rat{
    constructor(){
        this.name = "Rat détrousseur";
        this.desc = "Généralement en avoir un à sa table est considéré comme un signe de faible sociabilité, alors en avoir trois ...";
        this.hp = 1;
        this.mp = 0;
        this.atkDice = 1;
        this.defDice = 1;
        this.move = 4;
    } 
}

class Squelette{
    constructor(){
        this.hp = 1;
        this.mp = 0;
        this.atkDice = 2;
        this.defDice = 2;
        this.move = 6;
    } 
}

class Zombie{
    constructor(){
        this.hp = 1;
        this.mp = 0;
        this.atkDice = 2;
        this.defDice = 3;
        this.move = 5;
    } 
}

class Momie{
    constructor(){
        this.hp = 2;
        this.mp = 0;
        this.atkDice = 3;
        this.defDice = 4;
        this.move = 4;
    } 
}

class Lutin{
    constructor(){
        this.hp = 1;
        this.mp = 1;
        this.atkDice = 2;
        this.defDice = 1;
        this.move = 10;
    } 
}

class Orc{
    constructor(){
        this.hp = 1;
        this.mp = 2;
        this.atkDice = 3;
        this.defDice = 2;
        this.move = 8;
    } 
}

class Fimir{
    constructor(){
        this.hp = 2;
        this.mp = 3;
        this.atkDice = 3;
        this.defDice = 3;
        this.move = 6;
    } 
}

class Chaos{
    constructor(){
        this.hp = 3;
        this.mp = 3;
        this.atkDice = 4;
        this.defDice = 4;
        this.move = 7;
    } 
}

class Gargouille{
    constructor(){
        this.hp = 3;
        this.mp = 4;
        this.atkDice = 4;
        this.defDice = 5;
        this.move = 6;
    } 
}


module.exports = class Monster extends MonstAction {    
    constructor(type, id=null){
        super();
        this.id         = id;
        this.type       = type;        
        this.stats = eval(`new ${type}()`);        
    }
}