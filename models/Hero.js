function PersoAction(){
    this.moving = function(dice){
        console.log(this.nom+" peut se deplacer de  "+dice.move+" cases");
    }
    
    this.attack = function(perso,dice){
        console.log(perso.nom+" subit "+dice.atk+" pts de degats de la part de "+this.nom);
        perso.hp -= dice.atk;
    }
}
function Barbare(){   
    this.hp = 8;
    this.mp = 2;
    this.moveDice = 2;
    this.atkDice = 3;
    this.defDice = 2;
}

function Elf(){   
    this.hp = 6;
    this.mp = 4;
    this.moveDice = 2;
    this.atkDice = 2;
    this.defDice = 2;
}

function Naim(){    
    this.hp = 7;
    this.mp = 3;
    this.moveDice = 2;
    this.atkDice = 2;
    this.defDice = 2;
}

function Magicien(){    
    this.hp = 5;
    this.mp = 5;
    this.moveDice = 2;
    this.atkDice = 1;
    this.defDice = 2;
}

function Hero(nom,type){
    this.name = nom;  
    this.type =  type.name;
    PersoAction.call(this);
    type.call(this);
}

module.exports = {
    Hero,
    Barbare,
    Elf,
    Naim,
    Magicien
}
