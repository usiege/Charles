cc.Class({
    extends: cc.Component,

    properties: {
      kuan_chipsMus:{ 
        default: null,
        url: cc.AudioClip
        }, //薯片　
      kuan_JuiceMus:{ 
           default: null,
           url: cc.AudioClip
        }, //果汁
      kuan_popcornMus:{ 
            default: null,
            url: cc.AudioClip
        }, //爆米花
      lele_milkMus:{ 
            default: null,
            url: cc.AudioClip
        }, //牛奶
      lele_eggMus:{ 
            default: null,
            url: cc.AudioClip
        }, //鸡蛋
      lele_hamMus:{ 
            default: null,
            url: cc.AudioClip
        }, //火腿
    },

    onLoad: function () {
        var group_one,group_two,group_three,group_four,group_five,group_six,pointer,leaveX;//六组物品，
        var get_oneShdow,get_twoShdow,get_threeShdow,get_fourShdow,get_fiveShdow,get_sixShdow;//六组遮罩层
        var chipsMusStop,milkMusStop; //薯片停止，牛奶停止
        var getKuan_pao,getkuan_chips,getlele_pao,getlele_milk,kuan_juice,getlele_Egg,kuan_popcorn,getlele_Ham;
        var dBNode,playDrag,kuan_Anim,lele_Anim;//龙骨公共组
        this.leaveX = 2000;
        this.group_one = cc.find('Canvas/bottomGroup/group_one/touchBtn');
        this.group_two = cc.find('Canvas/bottomGroup/group_two/touchBtn');
        this.group_three = cc.find('Canvas/bottomGroup/group_three/touchBtn');
        this.group_four = cc.find('Canvas/bottomGroup/group_four/touchBtn');
        this.group_five = cc.find('Canvas/bottomGroup/group_five/touchBtn');
        this.group_six = cc.find('Canvas/bottomGroup/group_six/touchBtn');
        this.get_oneShdow = cc.find('Canvas/bottomGroup/group_one/shdow');
        this.get_twoShdow = cc.find('Canvas/bottomGroup/group_two/shdow');
        this.get_threeShdow = cc.find('Canvas/bottomGroup/group_three/shdow');
        this.get_fourShdow = cc.find('Canvas/bottomGroup/group_four/shdow');
        this.get_fiveShdow = cc.find('Canvas/bottomGroup/group_five/shdow');
        this.get_sixShdow = cc.find('Canvas/bottomGroup/group_six/shdow');
        this.pointer = cc.find('Canvas/zhiyin');
        this.gameMain();
    },
    gameMain: function(){
        this.clickMain();
    },
    clickMain: function(){
        let getWord = cc.find('Canvas/bottomGroup/group_one/word');
        let duihao_1 = cc.find('Canvas/yesGroup/duihao_1');
        this.group_one.on('touchstart',(ev) => {
            this.sisson_one();//气泡组，会话
            this.setPointer_one();//设置小手位置
            this.drag_KuanTalk();//龙骨公用组
            
            this.chipsMusStop = cc.audioEngine.play(this.kuan_chipsMus, false, 1);  
            getWord.opacity = duihao_1.opacity = 255; this.pointer.x = this.leaveX;
            // duihao_1.opacity = 255;
            duihao_1.runAction(cc.spawn(cc.scaleTo(1, 2), cc.scaleTo(1, 1)));

            getWord.on('touchstart',(ev) => {
                let getLets = "resources/audio/chips.mp3";
                let soundLets = cc.url.raw(getLets);
                cc.audioEngine.play(soundLets, false, 1);  
            });
             //点击薯片音效
             let chipsGoods = cc.find('Canvas/bottomGroup/group_one/chips');
             chipsGoods.on('touchstart',(ev) => {
               let getLets = "resources/audio/chips.mp3";
               let soundLets = cc.url.raw(getLets);
               cc.audioEngine.play(soundLets, false, 1);  
           });

        })
    },
    sisson_one:function(){
        this.group_one.destroy();
        this.get_oneShdow.destroy();

        this.getKuan_pao = cc.find('Canvas/drag_group/kuan_pao/kuan_pao');
        this.getkuan_chips = cc.find('Canvas/drag_group/kuan_pao/kuan_chips');
            this.getKuan_pao.opacity = 255;
            this.getKuan_pao.runAction(cc.spawn(cc.scaleTo(1, 2), cc.scaleTo(1, 1)));
            this.getkuan_chips.opacity = 255;
            this.getkuan_chips.runAction(cc.spawn(cc.scaleTo(1, 2), cc.scaleTo(2, 1)));
    },

    setPointer_one:function(){
        let getWord_two = cc.find('Canvas/bottomGroup/group_two/word');
        let duihao_2 = cc.find('Canvas/yesGroup/duihao_2');
        let interval = 6,repeat = 0, delay = 0;
            this.schedule(function() {
                this.pointer.x = -507; this.pointer.y = -478;
                this.group_two.on('touchstart',(ev) => {
                    this.unscheduleAllCallbacks(this.schedule);// 强制计时器停止
                    this.play_leleMus(); //播放乐乐音乐处理
                    this.removeMilkShdow(); //移除遮罩层,移除大宽文字，隐藏大宽气泡
                    this.milkSisson(); //牛奶会话
                    this.drag_LeleTalk();//乐乐龙骨
                    getWord_two.opacity = duihao_2.opacity = 255; this.pointer.x = this.leaveX; //小手离开舞台
    
                    duihao_2.runAction(cc.spawn(cc.scaleTo(1, 2), cc.scaleTo(1, 1)));
                    getWord_two.on('touchstart',(ev) => {
                        let getLets = "resources/audio/milk.mp3";
                        let soundLets = cc.url.raw(getLets);
                        cc.audioEngine.play(soundLets, false, 1);  
                    });
    
                    //点击牛奶音效
              let milkGoods = cc.find('Canvas/bottomGroup/group_two/milk');
              milkGoods.on('touchstart',(ev) => {
                let getLets = "resources/audio/milk.mp3";
                let soundLets = cc.url.raw(getLets);
                cc.audioEngine.play(soundLets, false, 1);  
                   });
            })
            }, interval, repeat, delay);
          
    },
    play_leleMus: function(){
        cc.audioEngine.stop(this.chipsMusStop); //声音停止
        this.milkMusStop = cc.audioEngine.play(this.lele_milkMus, false, 1);  //播放牛奶媒体
    },
    removeMilkShdow : function(){
        this.group_two.destroy();
        this.get_twoShdow.destroy();
        this.getKuan_pao.opacity = 0;this.getKuan_pao.scaleX = this.getKuan_pao.scaleY = 0.1;
        this.getkuan_chips.destroy();
    },
    milkSisson: function(){
        this.getlele_pao = cc.find('Canvas/drag_group/lele_pao/lele_pao');
        this.getlele_milk = cc.find('Canvas/drag_group/lele_pao/lele_milk');
            this.getlele_pao.opacity = 255;
            this.getlele_pao.runAction(cc.spawn(cc.scaleTo(1, 2), cc.scaleTo(1, 1)));
            this.getlele_milk.opacity = 255;
            this.getlele_milk.runAction(cc.spawn(cc.scaleTo(0.9, 0.9), cc.scaleTo(0.9, 0.9)));
            
            let inter = 5,rep = 0, del = 0;
            this.schedule(function() {
                 this.pointer.x = -172; this.pointer.y = -478;
                 this.clickJuice();
            }, inter, rep, del);
    },
    clickJuice: function(){
        let getWord_three = cc.find('Canvas/bottomGroup/group_three/word');
        let duihao_3 = cc.find('Canvas/yesGroup/duihao_3');
        this.group_three.on('touchstart',(ev) => {
            getWord_three.opacity = duihao_3.opacity = 255;
            this.chipsMusStop = cc.audioEngine.play(this.kuan_JuiceMus, false, 1);  
            
            this.sesson_Three();
            this.drag_KuanTalks();//龙骨公用组
            this.remove_juice_shdow();//移除果汁遮罩，果汁阴影,指引下一个

            duihao_3.runAction(cc.spawn(cc.scaleTo(1, 2), cc.scaleTo(1, 1)));
            getWord_three.on('touchstart',(ev) => {
                let getLets = "resources/audio/juice.mp3";
                let soundLets = cc.url.raw(getLets);
                cc.audioEngine.play(soundLets, false, 1);  
            });
            //点击果汁音效
            let juiceGoods = cc.find('Canvas/bottomGroup/group_three/juice');
            juiceGoods.on('touchstart',(ev) => {
              let getLets = "resources/audio/juice.mp3";
              let soundLets = cc.url.raw(getLets);
              cc.audioEngine.play(soundLets, false, 1);  
          });

        })
    },
    sesson_Three: function(){
        this.pointer.x = this.leaveX;
        this.getlele_milk.destroy();
        this.getlele_pao.opacity = 0;this.getlele_pao.scaleX = this.getlele_pao.scaleY = 0.1; //乐乐气泡隐藏
        this.getKuan_pao.opacity = 255; 
        this.getKuan_pao.runAction(cc.spawn(cc.scaleTo(1, 2), cc.scaleTo(1, 1)));
        this.kuan_juice = cc.find('Canvas/drag_group/kuan_pao/kuan_juice');
        this.kuan_juice.opacity = 255;
        this.kuan_juice.runAction(cc.spawn(cc.scaleTo(0.9, 0.9), cc.scaleTo(0.9, 0.9)));
    },
    remove_juice_shdow: function(){
        this.get_threeShdow.destroy();
        this.group_three.destroy();

        /* 165 -478 */
        let inter_ = 10,rep_ = 0, del_ = 0;
        this.schedule(function() {
             this.pointer.x = 165; this.pointer.y = -478;
             this.clickEgg();
// console.log(1);
        }, inter_, rep_, del_);

    },
    clickEgg: function(){
        let getWord_four = cc.find('Canvas/bottomGroup/group_four/word');
        let duihao_4 = cc.find('Canvas/yesGroup/duihao_4');
        this.group_four.on('touchstart',(ev) => {
            cc.audioEngine.play(this.lele_eggMus, false, 1);  
            getWord_four.opacity = duihao_4.opacity = 255;
            this.sesson_Four();//气泡操作，指引
            this.drag_LeleTalk();//龙骨动画　

            duihao_4.runAction(cc.spawn(cc.scaleTo(1, 2), cc.scaleTo(1, 1)));
            getWord_four.on('touchstart',(ev) => {
                let getLets = "resources/audio/eggs.mp3";
                let soundLets = cc.url.raw(getLets);
                cc.audioEngine.play(soundLets, false, 1);  
            });
            //点击鸡蛋音效
          let eggGoods = cc.find('Canvas/bottomGroup/group_four/egg');
          eggGoods.on('touchstart',(ev) => {
            let getLets = "resources/audio/eggs.mp3";
            let soundLets = cc.url.raw(getLets);
            cc.audioEngine.play(soundLets, false, 1);  
        });

        })
    },
    sesson_Four: function(){
        this.kuan_juice.destroy();
        this.getKuan_pao.opacity = 0;this.getKuan_pao.scaleX = this.getKuan_pao.scaleY = 0.1;
        this.pointer.x = this.leaveX;this.group_four.destroy();this.get_fourShdow.destroy();
        this.getlele_Egg = cc.find('Canvas/drag_group/lele_pao/lele_egg');
            this.getlele_pao.opacity = 255;
            this.getlele_pao.runAction(cc.spawn(cc.scaleTo(1, 2), cc.scaleTo(1, 1)));
            this.getlele_Egg.opacity = 255;
            this.getlele_Egg.runAction(cc.spawn(cc.scaleTo(0.9, 0.9), cc.scaleTo(0.9, 0.9)));
            let inter = 7,rep = 0, del = 0;
            this.schedule(function() {
                 this.pointer.x = 498; this.pointer.y = -478;
                 this.clickPopcorn();
            }, inter, rep, del);
    },
    clickPopcorn: function(){
        let getWord_five = cc.find('Canvas/bottomGroup/group_five/word');
        let duihao_5 = cc.find('Canvas/yesGroup/duihao_5');
        this.group_five.on('touchstart',(ev) => {

            cc.audioEngine.play(this.kuan_popcornMus, false, 1);  
            getWord_five.opacity = duihao_5.opacity = 255;
            this.sesson_Five();//气泡操作，指引
            this.drag_KuanTalk();//龙骨动画　

            duihao_5.runAction(cc.spawn(cc.scaleTo(1, 2), cc.scaleTo(1, 1)));
            getWord_five.on('touchstart',(ev) => {
                let getLets = "resources/audio/popcorn.mp3";
                let soundLets = cc.url.raw(getLets);
                cc.audioEngine.play(soundLets, false, 1);  
            });
     //点击爆米花音效
                let popcornGoods = cc.find('Canvas/bottomGroup/group_five/popcorn');
                popcornGoods.on('touchstart',(ev) => {
                  let getLets = "resources/audio/popcorn.mp3";
                  let soundLets = cc.url.raw(getLets);
                  cc.audioEngine.play(soundLets, false, 1);  
              });
        })
    },
    sesson_Five: function(){
        this.getlele_Egg.destroy();//乐乐鸡蛋文字销毁
        this.pointer.x = this.leaveX; this.get_fiveShdow.destroy();this.group_five.destroy();
        this.getlele_pao.opacity = 0;this.getlele_pao.scaleX = this.getlele_pao.scaleY = 0.1; //乐乐气泡隐藏
        this.kuan_popcorn = cc.find('Canvas/drag_group/kuan_pao/kuan_popcorn'); 
        this.getKuan_pao.opacity = 255; 
        this.getKuan_pao.runAction(cc.spawn(cc.scaleTo(1, 2), cc.scaleTo(1, 1)));
        this.kuan_popcorn.opacity = 255; 
        this.kuan_popcorn.runAction(cc.spawn(cc.scaleTo(1, 2), cc.scaleTo(1.5, 1)));

        let timer = 7,repeats = 0, delays = 0;
            this.schedule(function() {
                 this.pointer.x = 836; this.pointer.y = -478;
                 this.clickHam();
            }, timer, repeats, delays);
    },
    clickHam: function(){
        let getWord_six = cc.find('Canvas/bottomGroup/group_six/word');
        let duihao_6 = cc.find('Canvas/yesGroup/duihao_6');
        this.group_six.on('touchstart',(ev) => {

            cc.audioEngine.play(this.lele_hamMus, false, 1);  
            getWord_six.opacity = duihao_6.opacity = 255;
            this.sesson_Six();//气泡操作，指引
            this.drag_LeleTalks();//龙骨动画　

            duihao_6.runAction(cc.spawn(cc.scaleTo(1, 2), cc.scaleTo(1, 1)));
            getWord_six.on('touchstart',(ev) => {
                let getLets = "resources/audio/sausages.mp3";
                let soundLets = cc.url.raw(getLets);
                cc.audioEngine.play(soundLets, false, 1);  
            });
              //点击火腿音效
          let hamGoods = cc.find('Canvas/bottomGroup/group_six/ham');
          hamGoods.on('touchstart',(ev) => {
            let getLets = "resources/audio/sausages.mp3";
            let soundLets = cc.url.raw(getLets);
            cc.audioEngine.play(soundLets, false, 1);  
             });
        })
    },
    sesson_Six: function(){
        this.kuan_popcorn.destroy();//大宽爆米花文字销毁
        this.pointer.x = this.leaveX; this.get_sixShdow.destroy();this.group_six.destroy();this.getKuan_pao.destroy();

        this.getlele_pao = cc.find('Canvas/drag_group/lele_pao/lele_pao'); 
        this.getlele_pao.opacity = 255; 
        this.getlele_pao.runAction(cc.spawn(cc.scaleTo(1, 2), cc.scaleTo(1, 1)));
        
        this.getlele_Ham = cc.find('Canvas/drag_group/lele_pao/lele_ham'); 
        this.getlele_Ham.opacity = 255; 
        this.getlele_Ham.runAction(cc.spawn(cc.scaleTo(0.9, 2), cc.scaleTo(0.9, 0.9)));
        let u = 10;let i = 0;let o = 0;
        this.schedule((ev)=> {

            this.dBNode = cc.find("Canvas/drag_group/drag_bose");  
            this.playDrag = this.dBNode.getComponent("dragonBones.ArmatureDisplay");
            this.kuan_Anim = this.playDrag.animationName = "stop";    
            this.playDrag.playAnimation(this.kuan_Anim,0);   //播放龙骨
            this.loadWebScoket();

        }, u, i, o);
    },
    drag_KuanTalk: function(){
        this.dBNode = cc.find("Canvas/drag_group/drag_bose");  
        this.playDrag = this.dBNode.getComponent("dragonBones.ArmatureDisplay");
        this.kuan_Anim = this.playDrag.animationName = "kuan_talk";    
        this.playDrag.playAnimation(this.kuan_Anim,3);   //播放龙骨
    },
    drag_KuanTalks: function(){
        this.dBNode = cc.find("Canvas/drag_group/drag_bose");  
        this.playDrag = this.dBNode.getComponent("dragonBones.ArmatureDisplay");
        this.kuan_Anim = this.playDrag.animationName = "kuan_talk";    
        this.playDrag.playAnimation(this.kuan_Anim,4);   //播放龙骨
    },
    drag_LeleTalk: function(){
        this.dBNode = cc.find("Canvas/drag_group/drag_bose");  
        this.playDrag = this.dBNode.getComponent("dragonBones.ArmatureDisplay");
        this.lele_Anim = this.playDrag.animationName = "lele_talk";    
        this.playDrag.playAnimation(this.lele_Anim,2);   //播放龙骨
    },
    drag_LeleTalks: function(){
        this.dBNode = cc.find("Canvas/drag_group/drag_bose");  
        this.playDrag = this.dBNode.getComponent("dragonBones.ArmatureDisplay");
        this.lele_Anim = this.playDrag.animationName = "lele_talk";    
        this.playDrag.playAnimation(this.lele_Anim,3);   //播放龙骨
    },
    loadWebScoket: function(){

            let GETLELE = cc.find('Canvas/drag_group/lele_pao');
            GETLELE.destroy(); 
            // alert("游戏结束！");
        this.loadURL('backtoscene://back?over=1&error=0');
    },
    loadURL: function(url) {
        console.log("come here code");
        var iFrame;
        iFrame = document.createElement("iframe");
        iFrame.setAttribute("src", url);
        iFrame.setAttribute("style", "display:none;");
        iFrame.setAttribute("height", "0px");
        iFrame.setAttribute("width", "0px");
        iFrame.setAttribute("frameborder", "0");
        document.body.appendChild(iFrame);
    }
});
