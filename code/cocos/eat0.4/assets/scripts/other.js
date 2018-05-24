cc.Class({
    extends: cc.Component,

    properties: {
    smallBell:cc.Node,
    smallBellMus:{ 
        default: null,
        url: cc.AudioClip
        },
    },

    onLoad: function () {
        var leaveX;
        this.leaveX = 2000;
        this.init();
    },
    init: function(){
        this.clickBell(); //play bell Mus 
    },
    clickBell: function(){
        this.smallBell.on('touchstart',(ev) => {
            cc.audioEngine.play(this.smallBellMus, false, 1);  
        })
    },
});
