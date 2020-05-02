module.exports = class User{
    constructor(id = null,name = null,pass = null,mail = null,ip = null,subscribe_at = null){
        this.id             = id;
        this.name           = name;
        this.email          = mail;
        this.password       = pass;
        this.ip             = ip;
        this.subscribe_at   = subscribe_at;
    }

    setId(id){
        this.id = id;
    }

    setName(name){
        this.name = name;
    }

    setPassword(pass){
        this.password = pass;
    }

    setEmail(mail){
        this.email = mail;
    }

    setIp(ip){
        this.ip = ip;
    }

    setSubscribe_at(date){
        this.subscribe_at = date;
    }
}
