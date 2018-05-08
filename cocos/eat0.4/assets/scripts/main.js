cc.Class({
    extends: cc.Component,
    properties: {
        letCheckMus:{ 
            default: null,
            url: cc.AudioClip
            },
        next_Btn:cc.Node,
        door:cc.Node,
        bgMus: { 
            default: null,
            url: cc.AudioClip
            }, // 背景音乐
        preloadMus: { 
                default: null,
                url: cc.AudioClip
                },         // 音乐媒体
        openDoorMus:{ 
                    default: null,
                    url: cc.AudioClip
                    },
    },
    onLoad: function () {
        if (cc._renderType === cc.game.RENDER_TYPE_CANVAS) {
            cc.renderer.enableDirtyRegion(false);
        }
        cc.director.preloadScene("game_01", function () {
            cc.log("Next scene preloaded");
        });
        var moveTo_1,moveTo_2,moveTo_3,moveTo_4,setTween_1,setTween_2,moveToBg_1,moveTo_orange;//tween 动画坐标
        var leaveStage,getGuide,getChips,getPopcorn,getMilk,getEgg,getHam,getJuice,getStick,getSticks,moveToKnife_1,moveToKnife_2,getBoomNode,getMilkNode;//离开舞台坐标，引导小手，薯片，爆米花，牛奶，鸡蛋，火腿，果汁，魔法棒,魔法棒2场景,小刀运动轨迹
        var dragonBoneNode,displayDrag,dragNode,disDrag,getShade//龙骨
        this.leaveStage = 2000;
        //薯片移动位置
        this.moveTo_1 = cc.moveTo(1,cc.p(-94,179));
        this.moveTo_2 = cc.moveTo(1,cc.p(-94,-204));
        //爆米花移动位置
        this.moveTo_3 = cc.moveTo(1,cc.p(0,179));
        this.moveTo_4 = cc.moveTo(1,cc.p(0,-204));
        //牛奶移动位置
        this.moveTo_5 = cc.moveTo(1,cc.p(94,179));
        this.moveTo_6 = cc.moveTo(1,cc.p(94,-204));
        //goodjob
        this.setTween_1 = cc.moveTo(2,cc.p(0,0)).easing(cc.easeBounceInOut());
        this.setTween_2 = cc.moveTo(2,cc.p(0,-2000)).easing(cc.easeBounceInOut());
        //移动背景
        this.moveToBg_1 = cc.moveTo(3,cc.p(-1024,0));
        //橘子掉落
        this.moveTo_orange = cc.moveTo(2,cc.p(156,-239));

        this.moveToKnife_1 = cc.moveTo(0.5,cc.p(225,-88));
        this.moveToKnife_2 = cc.moveTo(0.5,cc.p(299,-111));
        //入口
        this.getShade = cc.find('Canvas/backGroup/shade');
        this.gameInit();
        Global.backNode = cc.audioEngine.playEffect(this.bgMus,true,0.2); //背景音乐
    },
    gameInit: function(){
        // this.clickChips(); 
        this.beginGame();
        
        // this.click_Pig();
    },
    beginGame: function(){
        // this.openDoor(); //开门效果
            this.next_Btn.on('touchstart',(ev) => {   
                // this.getShade = cc.find('Canvas/backGroup/shade');
                // let shade1 = cc.find('Canvas/backGroup/shade1');
                // shade1.x = this.leaveStage;
                cc.audioEngine.play(this.openDoorMus, false, 1);   // 播放开门跟大宽与乐乐对话
                let interv_al = 3,repe_at = 0, del_ay = 0;
                this.schedule(function() {
                    // this.getShade.x = -5;this.getShade.y = 435;
                cc.audioEngine.playEffect(this.preloadMus,false); // 播放开门跟大宽与乐乐对话
            }, interv_al, repe_at, del_ay)
                let moveBg = cc.find('Canvas/begin');
                  moveBg.destroy();     //销毁说明界面
                  this.clickChips(); 　//点击薯片效果
                  this.openDoor(); //开门效果
                // console.clear(); 
            })
        },
    openDoor: function(){
            let left_door = cc.find('Canvas/backGroup/door/left_door');
            let right_door = cc.find('Canvas/backGroup/door/right_door');
            // this.getShade = cc.find('Canvas/backGroup/shade');
            let interv_al = 1,repe_at = 0, del_ay = 0;
            this.schedule(function() {
                left_door.runAction(cc.moveTo(1,cc.p(-144,22))); 
                right_door.runAction(cc.moveTo(1,cc.p(141,22))); 
            }, interv_al, repe_at, del_ay)
    
            let interval = 2,repeat = 0, delay = 0;
            //进门后切换龙骨
            this.schedule(function() {
                this.getShade.x = -5;this.getShade.y = 450;
                // this.getShade.x = 2000;
                
                let dragonBoneNode = cc.find("Canvas/backGroup/dragonBose");  
                let displayDrag = dragonBoneNode.getComponent("dragonBones.ArmatureDisplay");
                let anim = displayDrag.animationName = "stop";  //停止   
                displayDrag.playAnimation(anim,0);   //播放龙骨
    
                let getShopCart = cc.find('Canvas/article/giftGroup/shopCart');
                getShopCart.opacity = 255;
    
                getShopCart.runAction(cc.moveTo(1,cc.p(0,-182))); 
    
            }, interval, repeat, delay)

            // let getShade = cc.find('Canvas/backGroup/shade');
            this.getShade.on('touchstart',(ev) => {
                this.getShade.x = this.leaveStage;
                cc.audioEngine.play(this.openDoorMus, false, 1);  
                left_door.runAction(cc.sequence(cc.moveTo(1,cc.p(-416,22)),cc.moveTo(1,cc.p(-144,22)))); 
                right_door.runAction(cc.sequence(cc.moveTo(1,cc.p(415,22)),cc.moveTo(1,cc.p(141,22))));    // .repeatForever();
                // this.shadeDoor(); //防止狂点门处理
                let interv_als = 3,repe_ats = 0, del_ays = 0;
                this.schedule(function() {
                    this.getShade.x = -5;
                }, interv_als, repe_ats, del_ays)
            })
        },
        // shadeDoor: function(){
        //     this.getShade = cc.find('Canvas/backGroup/shade');
        //     this.getShade.x = 0;
        //     let interv_al = 2,repe_at = 0, del_ay = 0;
        //     this.schedule(function() {
        //         this.getShade.x = this.leaveX;
        //     }, interv_al, repe_at, del_ay)
        // },

//点击薯片遮罩层，薯片动画，
    clickChips: function(){

        this.dragScenePublic();
        let _anim_ = this.disDrag.animationName = "in";    
        this.disDrag.playAnimation(_anim_,1);   //播放龙骨

        //乐乐说话龙骨
        let i = 10,r = 0, d = 0;
        this.schedule(function() {
        this.dragScenePublic();
        let anim_2 = this.disDrag.animationName = "lele_talk";    
        this.disDrag.playAnimation(anim_2,3);   //播放龙骨
    }, i, r, d);
        //大宽说话龙骨
    let ia = 4,ra = 0, da = 0;
    this.schedule(function() {
        this.dragScenePublic();
        let anim_1 = this.disDrag.animationName = "kuan_talk";    
        this.disDrag.playAnimation(anim_1,3);   //播放龙骨
    }, ia, ra, da);
        //提示圈出现
        let interva = 16,repea = 0, dela = 0;
        this.schedule(function() {

            this.dragScenePublic();
            let anim_2 = this.disDrag.animationName = "stop";    
            this.disDrag.playAnimation(anim_2,0);   //播放龙骨

        let findChips_shape = cc.find('Canvas/article/articleJump/chips_shape');
            this.getChips = cc.find('Canvas/article/articleJump/chips');
            this.getGuide = cc.find('Canvas/zhiyin');
            this.getGuide.opacity = 255;
                findChips_shape.on('touchstart',(ev) => {
                    this.getGuide.x = this.leaveStage; //小手离开舞台
                        let finished = cc.callFunc((ev)=>{
                        this.removeShdow();
                        },this);
                    findChips_shape.x = this.leaveStage; //遮罩层离开舞台
                    // this.getChips.runAction(cc.sequence(this.moveTo_1,this.moveTo_2,finished));  //薯片飞入购物车
                    let bezier = [cc.p(50, 500 / 2), cc.p(100, -300 / 2), cc.p(-94,-204)]; // 最高点，最低点，球初始位置
                    let bezierTo = cc.bezierTo(1, bezier); // during时间
                    this.getChips.runAction(cc.sequence(bezierTo,finished));
                })
            }, interva, repea, dela);
    },
    dragScenePublic: function(){
        this.dragNode = cc.find("Canvas/backGroup/dragonBose");  
        this.disDrag = this.dragNode.getComponent("dragonBones.ArmatureDisplay");
    },
//移除薯片黑色遮罩层，显示单词
    removeShdow: function(){
            let getWord = cc.find('Canvas/bottomGroup/group_one/word');
            let findShdow = cc.find('Canvas/bottomGroup/group_one/shdow');
            // let duihao_1 = cc.find('Canvas/yesGroup/duihao_1');
                findShdow.destroy();
                getWord.opacity  = 255;

                //点击单词音效
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
                })

                this.clickPopcorn();
    },
//点击爆米花遮罩层，爆米花动画，
    clickPopcorn: function(){
//计时器结束后小手再次出现
       

        this.getPopcorn = cc.find('Canvas/article/articleJump/popcorn');
        let findPopcorn_shape = cc.find('Canvas/article/articleJump/popcorn_shape');
        let interval = 3,repeat = 0, delay = 0;
        this.schedule((ev)=> {
            this.getGuide.x = -548;this.getGuide.y = 183; //小手在爆米花位置
        }, interval, repeat, delay);
            findPopcorn_shape.on('touchstart',(ev) => {

                

                this.unscheduleAllCallbacks(this.schedule);
                // this.unschedule(this.schedule);
                this.getShade.x = -5;this.getShade.y = 450;

                this.getGuide.x = this.leaveStage; //小手离开舞台
                let finished = cc.callFunc((ev)=>{
                    this.removeShdow_Pop();
                },this);
            findPopcorn_shape.x = this.leaveStage; //遮罩层离开舞台
            // this.getPopcorn.runAction(cc.sequence(this.moveTo_3,this.moveTo_4,finished));  //爆米花飞入购物车

            let bezier = [cc.p(50, 500 / 2), cc.p(100, -300 / 2), cc.p(0,-204)]; // 最高点，最低点，球初始位置
            let bezierTo = cc.bezierTo(1, bezier); // during时间
            this.getPopcorn.runAction(cc.sequence(bezierTo,finished)); //执行不断重复

        })
       
    },
    removeShdow_Pop: function(){
//(要吃健康的东西)大宽两次，乐乐两次音乐放置位置
        let getLets = "resources/audio/super_Talk_2.mp3";
        let soundLets = cc.url.raw(getLets);
        cc.audioEngine.play(soundLets, false, 1);  

        let getWord = cc.find('Canvas/bottomGroup/group_two/word');
        let findShdow = cc.find('Canvas/bottomGroup/group_two/shdow');
        // let duihao_2 = cc.find('Canvas/yesGroup/duihao_2');
            findShdow.destroy();
            getWord.opacity = 255;
            //点击单词音效 
            getWord.on('touchstart',(ev) => {
                let getLets = "resources/audio/popcorn.mp3";
                let soundLets = cc.url.raw(getLets);
                cc.audioEngine.play(soundLets, false, 1);  
            });
            //点击爆米花音效
            let popcornGoods = cc.find('Canvas/bottomGroup/group_two/popcorn');
            popcornGoods.on('touchstart',(ev) => {
              let getLets = "resources/audio/popcorn.mp3";
              let soundLets = cc.url.raw(getLets);
              cc.audioEngine.play(soundLets, false, 1);  
          })
        //   let _t_ = 4,_r_ = 0, _d_ = 0;
        //   this.schedule(function() {
            this.dragScenePublic();
            let anim_1 = this.disDrag.animationName = "kuan_talk";    
            this.disDrag.playAnimation(anim_1,14);   //播放龙骨
        // }, _t_, _r_, _d_);
            let t_ = 18,r_ = 0, d_ = 0;
            this.schedule(function() {
            this.dragScenePublic();
            let anim_2 = this.disDrag.animationName = "lele_talk";    
            this.disDrag.playAnimation(anim_2,9);   //播放龙骨
        }, t_, r_, d_);

        let t_i = 28,r_i = 0, d_i = 0;
        this.schedule(function() {
            this.showSceneGroup();
        }, t_i, r_i, d_i);
    },
    //显示其他四样物品
    showSceneGroup: function(){

        this.dragScenePublic();
        let anim_2 = this.disDrag.animationName = "stop";    
        this.disDrag.playAnimation(anim_2,0);   //播放龙骨
        let getGroup_1 = cc.find('Canvas/bottomGroup/group_one');
        let getGroup_2 = cc.find('Canvas/bottomGroup/group_two');
        let getGroup_3 = cc.find('Canvas/bottomGroup/group_three');
        let getGroup_4 = cc.find('Canvas/bottomGroup/group_four');
        let getGroup_5 = cc.find('Canvas/bottomGroup/group_five');
        let getGroup_6 = cc.find('Canvas/bottomGroup/group_six');
           
        getGroup_1.runAction(cc.moveTo(1,cc.p(-62,46)));  //薯片组移动
        getGroup_2.runAction(cc.moveTo(1,cc.p(277,46)));  //薯片组移动

        getGroup_3.opacity = getGroup_4.opacity = getGroup_5.opacity = getGroup_6.opacity = 255;
        getGroup_3.runAction(cc.spawn(cc.scaleTo(1, 2), cc.scaleTo(1, 1)));
        getGroup_4.runAction(cc.spawn(cc.scaleTo(1, 2), cc.scaleTo(1.5, 1)));
        getGroup_5.runAction(cc.spawn(cc.scaleTo(1, 2), cc.scaleTo(2, 1)));
        getGroup_6.runAction(cc.spawn(cc.scaleTo(1, 2), cc.scaleTo(2.5, 1)));
        this.clickMilk(); 
    },
    //点击牛奶触发 
    clickMilk: function(){
//计时器结束后小手再次出现
        

        this.getMilk = cc.find('Canvas/article/articleJump/milk');
        let findMilk_shape = cc.find('Canvas/article/articleJump/milk_shape');
        findMilk_shape.on('touchstart',(ev) => {

            this.unscheduleAllCallbacks(this.schedule);
            // this.unschedule(this.schedule);
            this.getShade.x = -5;this.getShade.y = 450;
            this.getGuide.x = this.leaveStage; //小手离开舞台
            let finished = cc.callFunc((ev)=>{
            this.removeShdow_Milk();
            },this);
            findMilk_shape.x = this.leaveStage; //遮罩层离开舞台 
            // this.getMilk.runAction(cc.sequence(this.moveTo_5,this.moveTo_6,finished));  //牛奶飞入购物车
            let bezier = [cc.p(50, 500 / 2), cc.p(100, -300 / 2), cc.p(94,-204)]; // 最高点，最低点，球初始位置
            let bezierTo = cc.bezierTo(1, bezier); // during时间
            this.getMilk.runAction(cc.sequence(bezierTo,finished)); //执行不断重复

        })
        let interval = 3,repeat = 0, delay = 0;
        this.schedule(function() {
            this.getGuide.x = -576;this.getGuide.y = 404; //小手在牛奶位置
            // this.clickMilk();     
        }, interval, repeat, delay)
    },
    removeShdow_Milk: function(){
        let getWord = cc.find('Canvas/bottomGroup/group_three/word');
        let findShdow = cc.find('Canvas/bottomGroup/group_three/shdow');
        findShdow.destroy();
        getWord.opacity = 255;
        //点击单词音效
        getWord.on('touchstart',(ev) => {
            let getLets = "resources/audio/milk.mp3";
            let soundLets = cc.url.raw(getLets);
            cc.audioEngine.play(soundLets, false, 1);  
        });
          //点击牛奶音效
          let milkGoods = cc.find('Canvas/bottomGroup/group_three/milk');
          milkGoods.on('touchstart',(ev) => {
            let getLets = "resources/audio/milk.mp3";
            let soundLets = cc.url.raw(getLets);
            cc.audioEngine.play(soundLets, false, 1);  
        });

        this.clickEgg();
    },
    clickEgg: function(){
//计时器结束后小手再次出现
       

        this.getEgg = cc.find('Canvas/article/articleJump/egg');
        let findEgg_shape = cc.find('Canvas/article/articleJump/egg_shape');
        findEgg_shape.on('touchstart',(ev) => {

            // this.unscheduleAllCallbacks(this.schedule);
            this.unschedule(this.schedule);
            this.getShade.x = -5;this.getShade.y = 450;
            this.getGuide.x = this.leaveStage; //小手离开舞台
            let finished = cc.callFunc((ev)=>{
            this.removeShdow_Egg();
            },this);
            findEgg_shape.x = this.leaveStage; //遮罩层离开舞台
            // this.getEgg.runAction(cc.sequence(this.moveTo_5,this.moveTo_6,finished));  //鸡蛋飞入购物车
            let bezier = [cc.p(50, 500 / 2), cc.p(100, -300 / 2), cc.p(94,-204)]; // 最高点，最低点，球初始位置
            let bezierTo = cc.bezierTo(1, bezier); // during时间
            this.getEgg.runAction(cc.sequence(bezierTo,finished)); //执行不断重复

        })
        let interval = 3,repeat = 0, delay = 0;
        this.schedule((ev) => {
            this.getGuide.x = 758;this.getGuide.y = 76; //小手在鸡蛋位置
            // this.clickEgg();     
        }, interval, repeat, delay)
    },
    removeShdow_Egg: function(){
        let getWord = cc.find('Canvas/bottomGroup/group_four/word');
        let findShdow = cc.find('Canvas/bottomGroup/group_four/shdow');
        findShdow.destroy();
        getWord.opacity = 255;
        //点击单词音效
        getWord.on('touchstart',(ev) => {
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


        this.clickHam();
    },
    clickHam: function(){
//计时器结束后小手再次出现
      

        this.getHam = cc.find('Canvas/article/articleJump/ham');
        let findHam_shape = cc.find('Canvas/article/articleJump/ham_shape');
        findHam_shape.on('touchstart',(ev) => {

            this.unscheduleAllCallbacks(this.schedule);
            // this.unschedule(this.schedule);
            this.getShade.x = -5;this.getShade.y = 450;
            this.getGuide.x = this.leaveStage; //小手离开舞台
                let finished = cc.callFunc((ev)=>{
                        this.removeShdow_Ham();
                },this);
                findHam_shape.x = this.leaveStage; //遮罩层离开舞台
            // this.getHam.runAction(cc.sequence(this.moveTo_3,this.moveTo_4,finished));  //火腿飞入购物车
            let bezier = [cc.p(50, 500 / 2), cc.p(100, -300 / 2), cc.p(0,-204)]; // 最高点，最低点，球初始位置
            let bezierTo = cc.bezierTo(1, bezier); // during时间
            this.getHam.runAction(cc.sequence(bezierTo,finished)); //执行不断重复

        })
        let interval = 3,repeat = 0, delay = 0;
        this.schedule((ev)=> {
            this.getGuide.x = 707;this.getGuide.y = 362; //小手在火腿位置   
        }, interval, repeat, delay)
    },
    removeShdow_Ham: function(){
        let getWord = cc.find('Canvas/bottomGroup/group_five/word');
        let findShdow = cc.find('Canvas/bottomGroup/group_five/shdow');
            findShdow.destroy();
            getWord.opacity = 255;
            //点击单词音效
            getWord.on('touchstart',(ev) => {
                let getLets = "resources/audio/sausages.mp3";
                let soundLets = cc.url.raw(getLets);
                cc.audioEngine.play(soundLets, false, 1);  
            });

            //点击火腿音效
          let hamGoods = cc.find('Canvas/bottomGroup/group_five/ham');
          hamGoods.on('touchstart',(ev) => {
            let getLets = "resources/audio/sausages.mp3";
            let soundLets = cc.url.raw(getLets);
            cc.audioEngine.play(soundLets, false, 1);  
        });

            this.clickJuice();
    },
    clickJuice: function(){
//计时器结束后小手再次出现
       
        this.getJuice = cc.find('Canvas/article/articleJump/juice');
            let findJuice_shape = cc.find('Canvas/article/articleJump/juice_shape');
                findJuice_shape.on('touchstart',(ev) => {

                    this.unscheduleAllCallbacks(this.schedule);
                    // this.unschedule(this.schedule);
                    this.getShade.x = -5;this.getShade.y = 450;
                    this.getGuide.x = this.leaveStage; //小手离开舞台
                        let finished = cc.callFunc((ev)=>{
                            this.removeShdow_Juice(); 
                        },this);
                       findJuice_shape.x = this.leaveStage; //遮罩层离开舞台
                    // this.getJuice.runAction(cc.sequence(this.moveTo_1,this.moveTo_2,finished));  //果汁飞入购物车
                    let bezier = [cc.p(50, 500 / 2), cc.p(100, -300 / 2), cc.p(-94,-204)]; // 最高点，最低点，球初始位置
                    let bezierTo = cc.bezierTo(1, bezier); // during时间
                    this.getJuice.runAction(cc.sequence(bezierTo,finished)); //执行不断重复
            })
            let interval = 3,repeat = 0, delay = 0;
            this.schedule((ev)=> {
                this.getGuide.x = -783;this.getGuide.y = 66; //小手在果汁位置  
            }, interval, repeat, delay)
    },
//移除果汁遮罩层，停止小手动画，
    removeShdow_Juice: function(){
//物品都点完乐乐大宽对话(大宽2，乐乐1，大宽1，乐乐1，大宽1)
        let getLets = "resources/audio/super_Talk_3.mp3";
        let soundLets = cc.url.raw(getLets);
        cc.audioEngine.play(soundLets, false, 1);  

        let getWord = cc.find('Canvas/bottomGroup/group_six/word');
        let findShdow = cc.find('Canvas/bottomGroup/group_six/shdow');
        findShdow.destroy();
        getWord.opacity = 255;
        //点击单词音效
        getWord.on('touchstart',(ev) => {
            let getLets = "resources/audio/juice.mp3";
            let soundLets = cc.url.raw(getLets);
            cc.audioEngine.play(soundLets, false, 1);  
        });
        //点击果汁音效
        let juiceGoods = cc.find('Canvas/bottomGroup/group_six/juice');
        juiceGoods.on('touchstart',(ev) => {
          let getLets = "resources/audio/juice.mp3";
          let soundLets = cc.url.raw(getLets);
          cc.audioEngine.play(soundLets, false, 1);  
      });

//计时器结束后小手再次出现

            this.dragScenePublic();
            let anim_2 = this.disDrag.animationName = "kuan_talk";    
            this.disDrag.playAnimation(anim_2,3);   //播放龙骨

            let i = 9,r = 0, d = 0;
            this.schedule(function() {
                this.dragScenePublic();
                let anim_2 = this.disDrag.animationName = "lele_talk";    
                this.disDrag.playAnimation(anim_2,2);   //播放龙骨
            }, i, r, d)

            let iq = 12,rq = 0, dq = 0;
            this.schedule(function() {
                this.dragScenePublic();
                let anim_2 = this.disDrag.animationName = "kuan_talk";    
                this.disDrag.playAnimation(anim_2,3);   //播放龙骨
            }, iq, rq, dq)

            let iqa = 15,rqa = 0, dqa = 0;
            this.schedule(function() {
                this.dragScenePublic();
                let anim_2 = this.disDrag.animationName = "lele_talk";  
                this.disDrag.playAnimation(anim_2,1);   //播放龙骨
            }, iqa, rqa, dqa)

            let iqaa = 19,rqaa = 0, dqaa = 0;
            this.schedule(function() {
                this.dragScenePublic();
                let anim_2 = this.disDrag.animationName ="kuan_talk";     
                this.disDrag.playAnimation(anim_2,1);   //播放龙骨
                this.goodJobTween();    
            }, iqaa, rqaa, dqaa)
                 
    },
//goodjob动画出现，
    goodJobTween: function(){   
            let touchBtn = cc.find('Canvas/bottomGroup/touchBtn');
            touchBtn.opacity = 255;
            touchBtn.runAction( cc.scaleTo(0.8, 0.8));
            touchBtn.on('touchstart',(ev) => {
//第二场景刚进入时候说(乐乐1次，宽1次)
                let getLets = "resources/audio/wow.mp3";
                let soundLets = cc.url.raw(getLets);
                cc.audioEngine.play(soundLets, false, 1);  

                this.removeAllScene();
            })
    },
//移除节点
    removeAllScene: function(){
        let getBackNode = cc.find('Canvas/backGroup');
        let getArticleNode = cc.find('Canvas/article');
        let getBtmNode = cc.find('Canvas/bottomGroup');

        getBackNode.destroy();
        getArticleNode.destroy();
        getBtmNode.destroy();
        this.replaceScene();
    },
    replaceScene: function(){
      let getScene_2 = cc.find('Canvas/scene_2');
      getScene_2.x = 0;
      this.click_Pig();
    },
    click_Pig: function(){
        let drag_0 = cc.find("Canvas/scene_2/carDrag");  
        let display_0 = drag_0.getComponent("dragonBones.ArmatureDisplay");
        let anim_0 = display_0.animationName = "go";    
        display_0.playAnimation(anim_0,1);   //播放龙骨

      let getfc = cc.find('Canvas/scene_2/scene_2bg/fc');
      let getPigNode = cc.find('Canvas/scene_2/scene_2bg/pig/zhuOpen'); //猪
      let getPigBtn = cc.find('Canvas/scene_2/scene_2bg/pig/zhuOpenBtn'); //猪按钮 
      let getChNode = cc.find('Canvas/scene_2/scene_2bg/pig/chang');    //肠

      let getChickNode = cc.find('Canvas/scene_2/scene_2bg/chicken/jiOpen'); //鸡
      let getChickBtn = cc.find('Canvas/scene_2/scene_2bg/chicken/jiOpenBtn'); //鸡 按钮
      let getEggNode = cc.find('Canvas/scene_2/scene_2bg/chicken/jidan'); //鸡蛋

      let getCowNode = cc.find('Canvas/scene_2/scene_2bg/cow/niuOpen'); //牛
      let getCowBtn = cc.find('Canvas/scene_2/scene_2bg/cow/niuOpenBtn'); //牛 牛按钮

      this.getBoomNode = cc.find('Canvas/scene_2/scene_2bg/boom');  // 爆炸
        this.getStick = cc.find('Canvas/scene_2/scene_2bg/mb'); //魔法棒

      this.getStick.runAction(cc.sequence(cc.scaleTo(0.8, 0.8),cc.scaleTo(1, 1))).repeatForever();

      getfc.runAction(cc.sequence(cc.rotateBy(2,360),cc.rotateBy(2,360))).repeatForever();

      let inte = 3,rep = 0, de = 0;
      this.schedule(function() {
          getPigBtn.y = -440;
          this.getStick.y = -493;
    }, inte, rep, de)

//点击小猪逻辑
        getPigBtn.on('touchstart',(ev) => {
//点击小猪后乐乐说
            let getLets = "resources/audio/pigs.mp3";
            let soundLets = cc.url.raw(getLets);
            cc.audioEngine.play(soundLets, false, 1);  
            
            this.getStick.opacity = 0;

            let intea = 2,repa = 0, dea = 0;
            this.schedule(function() {

                this.getStick.opacity = 255;
                getChickBtn.y = -220;
                this.getStick.x = -875;this.getStick.y = -629;   //魔法棒移动
          }, intea, repa, dea)

            let drag_1 = cc.find("Canvas/scene_2/carDrag");  
            let display_1 = drag_1.getComponent("dragonBones.ArmatureDisplay");
            let anim_1 = display_1.animationName = "lele_talk";    
            display_1.playAnimation(anim_1,1);   //播放龙骨

            let interval = 0.5,repeat = 0, delay = 0;
                this.schedule(function() {
                    this.getBoomNode.opacity = 0;
                 }, interval, repeat, delay)
                 this.getBoomNode.opacity = 255;
                     getPigBtn.y  = this.leaveStage; //猪离开
                    this.getBoomNode.x = -1838;    //爆炸位置

                    let dragonBoneNode = cc.find("Canvas/scene_2/scene_2bg/pig/zhuOpen");  
                    let displayDrag = dragonBoneNode.getComponent("dragonBones.ArmatureDisplay");
                    let anim = displayDrag.animationName = "change";    
                    displayDrag.playAnimation(anim,0);   //播放龙骨

                    

//点击小母鸡逻辑
            getChickBtn.on('touchstart',(ev) => {
//点击小母鸡后乐乐说
                let getLets = "resources/audio/chickens.mp3";
                let soundLets = cc.url.raw(getLets);
                cc.audioEngine.play(soundLets, false, 1);  

                this.getStick.opacity = 0;

                let inteaa = 2,repaa = 0, deaa = 0;
                this.schedule(function() {
                    this.getStick.opacity = 255;
                  getCowBtn.y = -291;
                  this.getStick.x = -276;this.getStick.y = -457;   //魔法棒移动
              }, inteaa, repaa, deaa)

                let drag_2 = cc.find("Canvas/scene_2/carDrag");  
                let display_2 = drag_2.getComponent("dragonBones.ArmatureDisplay");
                let anim_2 = display_2.animationName = "lele_talk";    
                display_2.playAnimation(anim_2,1);   //播放龙骨

            let interval = 0.5,repeat = 0, delay = 0;
                this.schedule(function() {
                    this.getBoomNode.opacity = 0;
                }, interval, repeat, delay);

                   getChickBtn.y = this.leaveStage; //鸡离开
                   this.getBoomNode.x = -1012;this.getBoomNode.y = -566;
                   this.getBoomNode.opacity =  255;

                   let dragonBoneNode = cc.find("Canvas/scene_2/scene_2bg/chicken/jiOpen");  
                   let displayDrag = dragonBoneNode.getComponent("dragonBones.ArmatureDisplay");
                   let anim = displayDrag.animationName = "change";    
                   displayDrag.playAnimation(anim,0);   //播放龙骨


                   
//点击小奶牛逻辑
            getCowBtn.on('touchstart',(ev) => {
//点击小奶牛后乐乐说2次，大宽说1次，说完开车
                let getLets = "resources/audio/cows.mp3";
                let soundLets = cc.url.raw(getLets);
                cc.audioEngine.play(soundLets, false, 1);  

                let drag_3 = cc.find("Canvas/scene_2/carDrag");  
                let display_3 = drag_3.getComponent("dragonBones.ArmatureDisplay");
                let anim_3 = display_3.animationName = "lele_talk";    
                display_3.playAnimation(anim_3,1);   //播放龙骨

                let interva = 2.5,repea = 0, dela = 0;
                this.schedule(function() {

                    let drag_4 = cc.find("Canvas/scene_2/carDrag");  
                    let display_4 = drag_4.getComponent("dragonBones.ArmatureDisplay");
                    let anim_4 = display_4.animationName = "go";    
                    display_4.playAnimation(anim_4,1);   //播放龙骨

                }, interva, repea, dela);

                let interval = 0.5,repeat = 0, delay = 0;
                    this.schedule(function() {
                        this.getBoomNode.opacity = 0;
                    }, interval, repeat, delay);
    
                       getCowBtn.y = this.leaveStage; //牛离开
                       this.getBoomNode.x = -352;this.getBoomNode.y = -271;
                       this.getBoomNode.opacity = 255;


                       let dragonBoneNode = cc.find("Canvas/scene_2/scene_2bg/cow/niuOpen");  
                       let displayDrag = dragonBoneNode.getComponent("dragonBones.ArmatureDisplay");
                       let anim = displayDrag.animationName = "change";    
                       displayDrag.playAnimation(anim,0);   //播放龙骨

                       this.getStick.destroy();

                       let i = 5,r = 0, d = 0;
                       this.schedule(function() {
                         this.moveBgTween();
                       }, i, r, d);
                })
            })
        })
    },
//移动背景，桔子树出现，
    moveBgTween: function(){

        let drag_5 = cc.find("Canvas/scene_2/carDrag");  
        let display_5 = drag_5.getComponent("dragonBones.ArmatureDisplay");
        let anim_5 = display_5.animationName = "in";    
        display_5.playAnimation(anim_5,3);   //播放龙骨

        let findScene_2bg = cc.find('Canvas/scene_2/scene_2bg');

        let findPotato = cc.find('Canvas/scene_2/scene_2bg/potato'); //土豆
        let findMaize = cc.find('Canvas/scene_2/scene_2bg/maize'); //玉米

        let findOrange = cc.find('Canvas/scene_2/orange');  //桔子树
        
        findPotato.opacity = findMaize.opacity = 0;


        let _interval = 3,_repeat = 0, _delay = 0;
        this.schedule(function() {
            this.dragPublic();
            let anim = this.displayDrag.animationName = "kuan_talk";    
            this.displayDrag.playAnimation(anim,0.1);   //播放龙骨

        }, _interval, _repeat, _delay);

            let finished = cc.callFunc((ev)=>{
                findOrange.x = -4; findOrange.y = -133;

              
                this.clickOrangeTree();
            },this);

            findScene_2bg.runAction(cc.sequence(this.moveToBg_1,finished));  // 背景移动
        
    },
    dragPublic: function(){
        this.dragonBoneNode = cc.find("Canvas/scene_2/carDrag");  
        this.displayDrag = this.dragonBoneNode.getComponent("dragonBones.ArmatureDisplay");
    },
//点击桔子树，执行桔子树动画
    clickOrangeTree: function(){
//魔法棒
        this.getSticks = cc.find('Canvas/scene_2/stick');
        this.getSticks.runAction(cc.sequence(cc.scaleTo(0.8, 0.8),cc.scaleTo(1, 1))).repeatForever();

        this.getSticks.x = 250;this.getSticks.y = -247; //魔法棒

        let findTree = cc.find('Canvas/scene_2/orange/juiceTree');
        let findShape = cc.find('Canvas/scene_2/shape');
            findTree.on('touchstart',(ev) => {
                this.getSticks.y = this.leaveStage; //魔法棒移走
                let finished_ = cc.callFunc((ev)=>{
                    this.drapOrange();
                },this);

                findShape.x = -4;
                findTree.runAction(cc.sequence(cc.scaleTo(1, 0.8),cc.scaleTo(0.8, 1),finished_));
            })
      },
//桔子掉落，变成果汁
      drapOrange: function(){
        let _finished = cc.callFunc((ev)=>{
            find_orange.opacity = 0;
            find_Juice.opacity = 255;
            this.potatoShow();
        },this);
        let find_Juice = cc.find('Canvas/scene_2/orange/juiceTree/juice');
        let find_orange = cc.find('Canvas/scene_2/orange/juiceTree/orange');
        find_orange.runAction(cc.sequence(this.moveTo_orange,_finished));  // 背景移动
      },
// 土豆出现，土豆变薯片
      potatoShow: function(){
//橘子掉地上乐乐说
        let getLets = "resources/audio/oranges.mp3";
        let soundLets = cc.url.raw(getLets);
        cc.audioEngine.play(soundLets, false, 1);  

        let drag_1 = cc.find("Canvas/scene_2/carDrag");  
        let display_1 = drag_1.getComponent("dragonBones.ArmatureDisplay");
        let anim_1 = display_1.animationName = "lele_talk";    

        display_1.playAnimation(anim_1,1);   //播放龙骨
        this.getSticks.x = -500;this.getSticks.y = -628; //魔法棒

        let find_potato = cc.find('Canvas/scene_2/scene_2bg/potato');
        let find_potatoBtn = cc.find('Canvas/scene_2/scene_2bg/potatoBtn');
        let find_knife = cc.find('Canvas/scene_2/scene_2bg/potato/knife');

        find_potato.opacity = 255;
        find_potato.runAction(cc.spawn(cc.scaleTo(1, 2), cc.scaleTo(1.5, 1)));

        find_potatoBtn.on('touchstart',(ev) => {
//切土豆乐乐说
            let getLets = "resources/audio/potatoes.mp3";
            let soundLets = cc.url.raw(getLets);
            cc.audioEngine.play(soundLets, false, 1);  

                let drag_2 = cc.find("Canvas/scene_2/carDrag");  
                let display_2 = drag_2.getComponent("dragonBones.ArmatureDisplay");
                let anim_2 = display_2.animationName = "lele_talk";    
                display_2.playAnimation(anim_2,1);   //播放龙骨

            find_potatoBtn.y = this.getSticks.y = this.leaveStage;

             let playTween =  find_knife.getComponent(cc.Animation);
                    playTween.play("daoAn");

            let find_potato_price = cc.find('Canvas/scene_2/scene_2bg/potato/potato_price');
            let find_potato_ = cc.find('Canvas/scene_2/scene_2bg/potato/potato');

            let _interval_ = 1,_repeat_ = 0, _delay_ = 0;
            this.schedule(function() {
                find_knife.stopAllActions();
                find_knife.y = this.leaveStage;
                find_potato_.opacity = 0;
                find_potato_price.opacity = 255;
                this.moveMazie();
            }, _interval_, _repeat_, _delay_);
        })
      },
//玉米出现，爆米花动画 
      moveMazie: function(){
        let getMaize = cc.find('Canvas/scene_2/scene_2bg/maize');
          let getMaizes = cc.find('Canvas/scene_2/scene_2bg/maize/maize');
          let get_popcorn = cc.find('Canvas/scene_2/scene_2bg/maize/popcorn');
          let getMaizeBtn = cc.find('Canvas/scene_2/scene_2bg/maizeBtn');

          getMaize.opacity = 255;
          getMaize.runAction(cc.spawn(cc.scaleTo(1, 2), cc.scaleTo(1, 1)));

          this.getSticks.x = 841;this.getSticks.y = -622; //魔法棒

          getMaizeBtn.on('touchstart',(ev) => {
//乐乐先说，大宽说乐乐说
            let getLets = "resources/audio/corn.mp3";
            let soundLets = cc.url.raw(getLets);
            cc.audioEngine.play(soundLets, false, 1); 

            let drag_3 = cc.find("Canvas/scene_2/carDrag");  
            let display_3 = drag_3.getComponent("dragonBones.ArmatureDisplay");
            let anim_3 = display_3.animationName = "lele_talk";    
            display_3.playAnimation(anim_3,1);   //播放龙骨

            let _i_ = 2,_r_ = 0, _d_ = 0;
            this.schedule(function() {
            let drag_4 = cc.find("Canvas/scene_2/carDrag");  
            let display_4 = drag_4.getComponent("dragonBones.ArmatureDisplay");
            let anim_4 = display_4.animationName = "go";    
            display_4.playAnimation(anim_4,1);   //播放龙骨
        }, _i_, _r_, _d_);
            this.getBoomNode.x = 1800 ;this.getBoomNode.y = -500;
            this.getBoomNode.opacity = get_popcorn.opacity = 255;
              getMaizes.y = getMaizeBtn.y = this.getSticks.y =  this.leaveStage;

             let interval = 0.5,repeat = 0, delay = 0;
             this.schedule(function() {
                 this.getBoomNode.opacity = 0;
             }, interval, repeat, delay);

                let f = 6,g = 0, h = 0;
                this.schedule(function() {
                this.letsCheck();
                }, f, g, h);
          })
      },
      letsCheck: function(){
        //    get goodjobNode
                let getGoodJob = cc.find('Canvas/scene_2/loading');
                let lele = cc.find('Canvas/scene_2/loading/loading_lele0');
                //play goodJob
                let playTween =  lele.getComponent(cc.Animation);
                    playTween.play("lele_gz");

                let setGjTween = cc.sequence(this.setTween_1,this.setTween_2);//goodJobTween坐标
                    getGoodJob.runAction(setGjTween); //action goodjobTween
                    cc.audioEngine.play(this.letCheckMus, false, 1);  
            //nextScene
            let fq = 4,gq = 0, hq = 0;
            this.schedule(function() {
                let findScene_2 = cc.find('Canvas/scene_2');
                // let findBack = cc.find('Canvas/backGroup');
                let zhiyins = cc.find('Canvas/zhiyin');
                findScene_2.destroy();
                // findBack.destroy();
                zhiyins.destroy();

                cc.director.loadScene('game_01');  
            }, fq, gq, hq);
      }
});
