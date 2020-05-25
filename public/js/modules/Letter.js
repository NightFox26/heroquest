class Letter{
    constructor(letter,reading=null){
        this.infos = letter;
        if(!reading){
            this.addRowLetterBox();    
        }
    }

    addRowLetterBox(){  
        
        $("#letterBox ul .noLetters").hide();

        let date = new Date(this.infos.date);  
        let minutes = date.getMinutes() < 10? "0"+ date.getMinutes(): date.getMinutes();
        let theDate = date.getUTCDate()+"/"+date.getMonth()+"/"+date.getFullYear()+" à "+date.getHours()+":"+minutes;    
        let letterHtml = 
            `<li class="rowLetter">
                <div class="float-right">
                    <img src="/images/icon/${this.infos.from_hero.type}.png" alt="sender icon" class="sender iconAvatar" data-idperso="${this.infos.from_hero.id}">
                </div>
                <div>
                    <small class="date">le : ${theDate} <span class="notRead"> ${this.isReaded()}</span></small>
                </div>
                <button class="letter" data-letterId="${this.infos.id}"> 
                    <img src="/images/icon/scroll.png" alt="scroll icon">
                    <span class="title">${this.infos.title}</span>
                </button>               
            </li><hr>`;
    
        $("#letterBox ul").append(letterHtml);
    }

    isReaded(){
        if(this.infos.readed == 0){
            return "(Non lu)";
        }
        return '';
    }

    hydrate(){
        var $this = this;
        $("#letter").hide(200,function(){
            $("#letter").attr("data-idLetter",$this.infos.id);

            $("#letter .content h3").html(`<img src="/images/icon/${$this.infos.from_hero.type}.png" alt="${$this.infos.from_hero.type}" class="iconAvatar sender" data-idperso="${$this.infos.from_hero.id}"> ${$this.infos.title}`);
    
            $("#letter .content p").text(`${$this.infos.content}`);
    
            $("#letter .btn-answer").show();
            if($this.infos.from_hero.type == "IA"){
                $("#letter .btn-answer").hide();
            }

        }).fadeIn(500); 
    }
}