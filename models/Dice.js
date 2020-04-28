class MoveDice{    
    constructor(nb){
        this.faces = 6;
        this.move = this.throwDice(nb);
    }
    
    throwDice(nb){
        let results = 0;
        while(nb>0){
            results += Math.floor(Math.random() * (this.faces) + 1);
            nb--;
        }
        return results;
    }
}

class AtkDice{
    constructor(nb){
        this.faces = ["skull","w_shield","skull","b_shield","w_shield","skull"]; 
        this.results = this.throwDice(nb,this.faces);
        this.atk    = this.countVal(this.results,"skull");
        this.w_def  = this.countVal(this.results,"w_shield");
        this.b_def  = this.countVal(this.results,"b_shield");
    }    
    
    throwDice(nb,faces){
        let results = [];
        while(nb>0){
            results.push(faces[Math.floor(Math.random() * (faces.length))]);  
            nb--;
        }
        // let div = document.getElementsByClassName("dices");
        // div[0].innerHTML = results
        return results;
    }
    
    countVal(arr,val){ 
        return arr.filter(function(value) {
	           return value == val;
        }).length;        
    }
}


module.exports = {
    MoveDice,
    AtkDice
}