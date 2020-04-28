class PersAction {    
    moving(dice){
        console.log(this.nom+" peut se deplacer de  "+dice.move+" cases");
    }
    
    attack(pers,dice){
        console.log(pers.nom+" subit "+dice.atk+" pts de degats de la part de "+this.nom);
        pers.stats.hp -= dice.atk;
    }
}

class Barbare{  
    constructor(){
        this.hp = 8;
        this.mp = 2;
        this.atkDice = 3;
        this.defDice = 2;
        this.moveDice = 2;
    }    
}

class Elf{   
    constructor(){
        this.hp = 6;
        this.mp = 4;
        this.atkDice = 2;
        this.defDice = 2;
        this.moveDice = 2;
    }    
}

class Naim{    
    constructor(){
        this.hp = 7;
        this.mp = 3;
        this.atkDice = 2;
        this.defDice = 2;
        this.moveDice = 2;
    }  
}

class Magicien{   
    constructor(){
        this.hp = 4;
        this.mp = 6;
        this.atkDice = 1;
        this.defDice = 2;
        this.moveDice = 2;
    }    
}

module.exports = class Hero extends PersAction {    
    constructor(nom,type){
        super();
        this.nom = nom; 
        this.class = type;
        this.stats = eval(`new ${type}()`);        
    }
}
