//
//  TextProblemView.swift
//  VIPX
//
//  Created by user on 2018/5/10.
//  Copyright © 2018年 VIPX. All rights reserved.
//

import UIKit

class ProblemView: UITextView {

    /*
    // Only override draw() if you perform custom drawing.
    // An empty implementation adversely affects performance during animation.
    override func draw(_ rect: CGRect) {
        // Drawing code
    }
    */
    
//    private var _attributeString: NSAttributedString?
    private(set) var attributedProblem: NSAttributedString = NSAttributedString.init()
    {
        willSet {
            self.text = newValue.string
            self.font = font
            
            self.textContainer.lineBreakMode = .byWordWrapping
            self.textStorage.replaceCharacters(in: NSRange(location: 0, length: newValue.length), with: newValue)
            
            let size = self.sizeThatFits(CGSize(width: self.width, height: CGFloat(MAXFLOAT)))
            self.textContainer.size = size
        }
        
        didSet {
            
        }
    }
    
    
    override init(frame: CGRect, textContainer: NSTextContainer?) {
        super.init(frame: frame, textContainer: textContainer)
    }
    
    required init?(coder aDecoder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
    
    //设置题目文字属性
    func setupSubject(text: String, font: UIFont) {
        
        self.font = font
        
        let changeString = NSMutableAttributedString.init(string: text)
        let desTextRange = NSRange(location: 0, length: text.length)
        changeString.addAttribute(NSAttributedStringKey.font, value: font, range: desTextRange)
        changeString.addAttribute(NSAttributedStringKey.foregroundColor, value: UIColor.init(hex: "f4f5f5"), range: desTextRange)
        
        self.text = changeString.string
        
        self.font = font
        let size = self.sizeThatFits(CGSize(width: self.width, height: CGFloat(MAXFLOAT)))
        self.textContainer.size = size
        self.textContainer.lineBreakMode = .byWordWrapping
        self.textStorage.replaceCharacters(in: NSRange(location: 0, length: changeString.string.length), with: changeString)
        
        self.attributedProblem = changeString
    }
    
    //当前要发生替换的区域
    private(set) var optionsRange: NSRange?
    
    //给选项添加属性
    func textOptions(text: String, font: UIFont) -> NSAttributedString {
        //选项左右添加空格
        let addSpace = "  " + text + "  "
        
        //选项文字属性
        let optionString = NSMutableAttributedString(string: addSpace)
        let optionRange = NSRange(location: 2, length: text.length)
        
        optionString.addAttribute(NSAttributedStringKey.font, value: font.withSize(CGFloat.font_adapt_screen((29, 31, 33))), range: optionRange)
        optionString.addAttribute(NSAttributedStringKey.foregroundColor, value: UIColor.init(hex: "f4f5f5"), range: optionRange)
        optionString.addAttribute(NSAttributedStringKey.strokeColor, value: UIColor.init(hex: "2ad4f3"), range: optionRange)
        optionString.addAttribute(NSAttributedStringKey.strokeWidth, value: -CGFloat.font_adapt_screen((3, 5, 7)), range: optionRange)
        optionString.addAttribute(NSAttributedStringKey.underlineStyle, value: 1, range: optionRange)
        
        return optionString
    }
    
    //替换选项文字
    func replaceOption(options: String, replaceOptions: String, font: UIFont) {
        
        //给选项添加属性
        let changeString = NSMutableAttributedString.init(attributedString: self.attributedProblem)
        let optionString = self.textOptions(text: replaceOptions, font: font)
        
        //选项最终位置
        if let optionsRange = changeString.string.range(of: options) {
            let range = NSRange(optionsRange, in: options)
            changeString.replaceCharacters(in: range, with: optionString)
            self.optionsRange = range
        } else {
            self.optionsRange = NSRange(location: 0, length: 0)
        }
        
        self.attributedProblem = changeString
    }
    
    //添加富文本图片
    // originString 原始字符串
    // replaceRange 要替换的文字范围
    // size 替换图片大小
    func replacePictureForText(originString: NSAttributedString, replaceRange: NSRange, size: CGSize) -> NSAttributedString {
        let attachment = NSTextAttachment()
        attachment.image = UIImage.init(named: "study_select_words")
        attachment.bounds = CGRect(x: 0, y: 0, width: size.width, height: size.height)
        
        //最终结果
        let originMutiString = NSMutableAttributedString.init(attributedString: originString)
        
        //生成图片
        let attachString = NSAttributedString(attachment: attachment)
        let mutiAttachString = NSMutableAttributedString(attributedString: attachString)
        
        //替换成图片
        originMutiString.replaceCharacters(in: replaceRange, with: mutiAttachString)
        return originMutiString
    }
    
    
    
}
