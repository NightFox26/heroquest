class Invitation{ 
    constructor(socket,heroChef,socketHeroChef,heroJoiner,socketHeroJoiner,idParty,slot){        
        this.heroChef           = heroChef;        
        this.socketHeroChef     = socketHeroChef;  
        this.heroJoiner         = heroJoiner;
        this.socketHeroJoiner   = socketHeroJoiner;        
        this.socket             = socket; 
        this.idParty            = idParty;  
        this.slot               = slot;  
        this.create();       
    }
    
    create(){        
        $("#tavernePage #invitationBox").append(`<div class="invitation invitation-${this.heroJoiner.id}"><div><img src="images/icon/${this.heroJoiner.type}.png" alt="hero icon"/></div><div><img src="images/icon/cup.png" alt="cup icon"/><img src="images/icon/arrow_right.png" width="50" alt="fleche icon"/></div><div><img src="images/icon/${this.heroChef.type}.png" alt="hero icon"/></div><p> ${this.heroJoiner.name} souhaite venir boire un verre à votre table !</p><button class="btn btn-yes"></button><button class="btn btn-no"></button></div>`);
        
         this.animation();
         this.bindingYes();
         this.bindingNo();
    }
    
    animation(){ 
        playCssAnim({elm:'.invitation:last',anim:"bounce"});
    }

    bindingYes(){        
        var $this = this;        
        $(document).on("click.invitationAccepted",`.invitation-${$this.heroJoiner.id} .btn-yes`,function(e){
            $(this).parents(".invitation").hide(500,function(){
                $this.socket.emit("invitation_accepted",
                    {   idParty         :$this.idParty,
                        slot            :$this.slot,
                        socketHeroChef  :$this.socketHeroChef,
                        heroChef        :$this.heroChef,
                        socketHeroJoiner:$this.socketHeroJoiner,
                        heroJoiner      :$this.heroJoiner,
                    })
                $(document).off(".invitationAccepted");
                $(`.invitation-${$this.heroJoiner.id}`).remove();
            })
        })
    }

    bindingNo(){        
        var $this = this;        
        $(document).on("click.invitationRefused",`.invitation-${$this.heroJoiner.id} .btn-no`,function(e){
            $(this).parents(".invitation").hide(500,function(){
                $this.socket.emit("invitation_refused",{socketHeroJoiner:$this.socketHeroJoiner,heroChef:$this.heroChef})
                $(document).off(".invitationRefused");
                $(`.invitation-${$this.heroJoiner.id}`).remove();
            })
        })   
    }

}