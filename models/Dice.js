function MoveDice(nb){
    this.faces = 6;
    this.nb = nb;
    this.move = throwDice(this.nb,this.faces);
        
    function throwDice(nb,face){
        let results = 0;
        while(nb>0){
            results += Math.floor(Math.random() * (face) + 1);
            nb--;
        }
        return results;
    }
}

function AtkDice(nb){
    this.faces = ["skull","w_shield","skull","b_shield","w_shield","skull"];
    this.nb = nb;
    this.results = throwDice(this.nb,this.faces);
    this.atk    = countVal(this.results,"skull");
    this.w_def  = countVal(this.results,"w_shield");;
    this.b_def  = countVal(this.results,"b_shield");;
    
    function throwDice(nb,faces){
        let results = [];
        while(nb>0){
            results.push(faces[Math.floor(Math.random() * (faces.length))]);  
            nb--;
        }
        /*
        let div = document.getElementsByClassName("dices");
        div[0].innerHTML = results
        */
        return results;
    }
    
    function countVal(arr,val){ 
        return arr.filter(function(value) {
	           return value == val;
        }).length;        
    }
}


module.exports = {
    MoveDice,
    AtkDice
}