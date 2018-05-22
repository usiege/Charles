//
//  CircleView.swift
//  Nothing
//
//  Created by user on 2018/5/16.
//  Copyright © 2018年 user. All rights reserved.
//

import UIKit

class CircleView: UIView {

    var backgroundLayer: CAShapeLayer?
    var animationLayer: CAShapeLayer?
    
    let lineWidth: CGFloat = 5
    func layer(lineColor: UIColor) -> CAShapeLayer {
        
        let layer = CAShapeLayer()
        
        let rect = CGRect(x: 0, y: 0, width: self.bounds.width, height: self.bounds.height)
        layer.bounds = rect
        //这是个圆
        let path = UIBezierPath(roundedRect: rect, cornerRadius: rect.width / 2)
        layer.lineWidth = lineWidth
        layer.position = CGPoint(x: rect.width / 2, y: rect.height / 2)
        
        layer.path = path.cgPath
        layer.fillColor = UIColor.clear.cgColor
        layer.strokeColor = lineColor.cgColor
        
        layer.strokeStart = 0
        layer.strokeEnd = 1
        
        return layer
    }
    
    /*
    // Only override draw() if you perform custom drawing.
    // An empty implementation adversely affects performance during animation.
    override func draw(_ rect: CGRect) {
        // Drawing code
    }
    */
    
    override init(frame: CGRect) {
        super.init(frame: frame)
        
        let bgLayer = self.layer(lineColor: UIColor.green)
        self.layer.addSublayer(bgLayer)
        self.backgroundLayer = bgLayer
        
        let animationLayer = self.layer(lineColor: UIColor.orange)
        animationLayer.isHidden = true
        self.layer.addSublayer(animationLayer)
        self.animationLayer = animationLayer
        
        self.backgroundColor = UIColor.black
    }
    
    required init?(coder aDecoder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
    
    let PLAY_ANIMATION_KEY = "animation_key"
    
    var startTime: CFTimeInterval!  //动画开始时系统时钟
    var pastTime: CFTimeInterval!   //动画运行过的时间（除去暂停的时间）
    
    func startAnimation(totalTime: CGFloat) {
        guard totalTime > 0 else {
            return
        }
        guard ((self.animationLayer?.animation(forKey: PLAY_ANIMATION_KEY)) == nil) else {
            return
        }
        
        let animation = CABasicAnimation(keyPath: "strokeEnd")
        animation.duration = CFTimeInterval(totalTime)
        animation.delegate = self
        
        animation.fromValue = 0
        animation.toValue = 1
        
        animation.isRemovedOnCompletion = true
        animation.fillMode = kCAFillModeForwards
        self.animationLayer?.add(animation, forKey: PLAY_ANIMATION_KEY)
    }
    
    func pauseAnimation(layer: CALayer) {
        let pausetime = layer.convertTime(CACurrentMediaTime(), from: nil)
        layer.timeOffset = pausetime
        layer.speed = 0
        
        print(#function)
        print("start time: \(startTime)")
        print("pause time: \(pausetime)")
        print("系统时钟： \(CACurrentMediaTime())")
        print("以GMT为标准的，2001年一月一日00：00：00这一刻的时间绝对值: \(CFAbsoluteTimeGetCurrent())")
        let pasttime = pausetime - startTime
        print("past time: \(pasttime)")
        self.pastTime = pasttime
    }
    
    func resumeAnimation(layer: CALayer) {
        let pausetime = layer.timeOffset
        
        layer.timeOffset = 0
        layer.beginTime = 0
        layer.speed = 1
        
        let begintime = layer.convertTime(CACurrentMediaTime(), to: nil) - pausetime
        layer.beginTime = begintime
        
        print(#function)
        print("系统时钟： \(CACurrentMediaTime())")
        print("begin time: \(begintime)")
    }
    
    func stopAnimation() {
        guard self.animationLayer?.animation(forKey: PLAY_ANIMATION_KEY) != nil else {
            return
        }
        
        CATransaction.begin()
        CATransaction.setDisableActions(true)
        self.animationLayer?.timeOffset = 0
        self.animationLayer?.speed = 1
        self.animationLayer?.beginTime = CACurrentMediaTime()
        self.animationLayer?.strokeStart = 0
        self.animationLayer?.strokeEnd = 1
        CATransaction.commit()
        
        self.animationLayer?.removeAnimation(forKey: PLAY_ANIMATION_KEY)
    }
    
    func layerHidden(hidden: Bool) {
        CATransaction.begin()
        CATransaction.setDisableActions(true)
        self.animationLayer?.isHidden = hidden
        CATransaction.commit()
    }
    
}

extension CircleView: CAAnimationDelegate {
    func animationDidStart(_ anim: CAAnimation) {
        self.startTime = CACurrentMediaTime()
    }
    
    func animationDidStop(_ anim: CAAnimation, finished flag: Bool) {
        
    }
}






