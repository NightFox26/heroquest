class Invitation{ 
    constructor(socket,heroSender,socketIdSender,heroInvited,socketIdInvited){        
        this.heroSender         = heroSender;
        this.heroInvited        = heroInvited;        
        this.socketIdSender     = socketIdSender;        
        this.socketIdInvited    = socketIdInvited;  
        this.socket             = socket;   
        this.create();       
    }
    
    create(){        
        $("#tavernePage #invitationBox").append(`<div class="invitation invitation-${this.heroSender.id}"><div><img src="images/icon/${this.heroSender.type}.png" alt="hero icon"/></div><div><img src="images/icon/cup.png" alt="cup icon"/><img src="images/icon/arrow_right.png" width="50" alt="fleche icon"/></div><div><img src="images/icon/${this.heroInvited.type}.png" alt="hero icon"/></div><p> ${this.heroSender.name} souhaite vous payer un verre a sa table !</p><button class="btn btn-yes"></button><button class="btn btn-no"></button></div>`);
        
         this.animation();
         this.bindingYes();
         this.bindingNo();
    }
    
    animation(){ 
        playCssAnim({elm:'.invitation:last',anim:"bounce"});
    }

    bindingYes(){        
        var $this = this;        
        $(document).on("click.invitationAccepted",`.invitation-${$this.heroSender.id} .btn-yes`,function(e){
            $(this).parents(".invitation").hide(500,function(){
                $this.socket.emit("invitation_accepted",
                    {   socketIdSender:$this.socketIdSender,
                        heroSender:$this.heroSender,
                        socketIdInvited:$this.socketIdInvited,
                        heroInvited:$this.heroInvited
                    })
                $(document).off(".invitationAccepted");
                $(`.invitation-${$this.heroSender.id}`).remove();
            })
        })
    }

    bindingNo(){        
        var $this = this;        
        $(document).on("click.invitationRefused",`.invitation-${$this.heroSender.id} .btn-no`,function(e){
            $(this).parents(".invitation").hide(500,function(){
                $this.socket.emit("invitation_refused",{socketIdSender:$this.socketIdSender,heroInvited:$this.heroInvited})
                $(document).off(".invitationRefused");
                $(`.invitation-${$this.heroSender.id}`).remove();
            })
        })   
    }

}