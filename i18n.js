const translations = {
    zh: {
        fontSettings: "字体设置",
        font: "字体",
        fontWeight: "字体粗细",
        fontSize: "字体大小",
        regular: "常规",
        medium: "中等",
        bold: "粗体",
        textStyle: "文字样式",
        styleEffects: "样式效果",
        italic: "斜体",
        underline: "下划线",
        strikethrough: "删除线",
        letterSpacing: "字间距",
        lineHeight: "行间距",
        colorSettings: "颜色设置",
        textColor: "文字颜色",
        backgroundColor: "背景颜色",
        transparentBg: "背景透明",
        layoutSettings: "布局设置",
        textAlign: "文字对齐",
        textRotation: "文字旋转",
        center: "居中对齐",
        left: "左对齐",
        right: "右对齐",
        autoCrop: "自动裁剪",
        cropPadding: "裁剪边距",
        noPadding: "无边距",
        effectSettings: "特效设置",
        textShadow: "文字阴影",
        shadowColor: "阴影颜色",
        shadowBlur: "阴影模糊",
        horizontalOffset: "水平偏移",
        verticalOffset: "垂直偏移",
        textStroke: "文字描边",
        strokeColor: "描边颜色",
        strokeWidth: "描边宽度",
        preview: "预览",
        imageSize: "图片尺寸",
        width: "宽度",
        height: "高度",
        customSize: "自定义尺寸",
        square: "正方形",
        portrait: "竖屏",
        banner: "横幅",
        socialPost: "社交帖文",
        cover: "封面图",
        widescreen: "宽屏",
        exportFormat: "导出格式",
        exportQuality: "导出质量",
        downloadImage: "下载图片",
        inputText: "输入文字",
        inputPlaceholder: "在这里输入文字",
        chineseFonts: "中文字体",
        englishFonts: "英文字体",
        systemFonts: "系统字体",
        pngFormat: "PNG (支持透明)",
        jpegFormat: "JPEG (最小体积)",
        webpFormat: "WebP (高压缩比)",
        textInputLabel: "输入文字",
        squareSize: "正方形 (800×800)",
        portraitSize: "竖屏 (1080×1920)",
        bannerSize: "横幅 (1200×300)",
        socialPostSize: "社交帖文 (1080×1080)",
        coverSize: "封面图 (1500×500)",
        widescreenSize: "宽屏 (1920×1080)",
        noMargin: "无边距",
        px: "像素",
        percent: "%",
        version: "版本",
        copyright: "© 2024 Text2Image. 保留所有权利。",
        currentVersion: "1.0.0",
        versionDesc: "Beta 测试版",
        switchLang: "切换语言"
    },
    en: {
        fontSettings: "Font Settings",
        font: "Font",
        fontWeight: "Font Weight",
        fontSize: "Font Size",
        regular: "Regular",
        medium: "Medium",
        bold: "Bold",
        textStyle: "Text Style",
        styleEffects: "Style Effects",
        italic: "Italic",
        underline: "Underline",
        strikethrough: "Strikethrough",
        letterSpacing: "Letter Spacing",
        lineHeight: "Line Height",
        colorSettings: "Color Settings",
        textColor: "Text Color",
        backgroundColor: "Background Color",
        transparentBg: "Transparent Background",
        layoutSettings: "Layout Settings",
        textAlign: "Text Align",
        textRotation: "Text Rotation",
        center: "Center",
        left: "Left",
        right: "Right",
        autoCrop: "Auto Crop",
        cropPadding: "Crop Padding",
        noPadding: "No Padding",
        effectSettings: "Effect Settings",
        textShadow: "Text Shadow",
        shadowColor: "Shadow Color",
        shadowBlur: "Shadow Blur",
        horizontalOffset: "Horizontal Offset",
        verticalOffset: "Vertical Offset",
        textStroke: "Text Stroke",
        strokeColor: "Stroke Color",
        strokeWidth: "Stroke Width",
        preview: "Preview",
        imageSize: "Image Size",
        width: "Width",
        height: "Height",
        customSize: "Custom Size",
        square: "Square",
        portrait: "Portrait",
        banner: "Banner",
        socialPost: "Social Post",
        cover: "Cover",
        widescreen: "Widescreen",
        exportFormat: "Export Format",
        exportQuality: "Export Quality",
        downloadImage: "Download Image",
        inputText: "Input Text",
        inputPlaceholder: "Enter text here",
        chineseFonts: "Chinese Fonts",
        englishFonts: "English Fonts",
        systemFonts: "System Fonts",
        pngFormat: "PNG (Transparent)",
        jpegFormat: "JPEG (Smallest Size)",
        webpFormat: "WebP (High Compression)",
        textInputLabel: "Input Text",
        squareSize: "Square (800×800)",
        portraitSize: "Portrait (1080×1920)",
        bannerSize: "Banner (1200×300)",
        socialPostSize: "Social Post (1080×1080)",
        coverSize: "Cover (1500×500)",
        widescreenSize: "Widescreen (1920×1080)",
        noMargin: "No Margin",
        px: "pixels",
        percent: "%",
        version: "Version",
        copyright: "© 2024 Text2Image. All rights reserved.",
        currentVersion: "1.0.0",
        versionDesc: "Beta Testing",
        switchLang: "Switch Language"
    }
};

// 当前语言
let currentLang = 'en';

// 获取翻译文本
function t(key) {
    return translations[currentLang][key] || key;
}

// 切换语言
function switchLanguage(lang) {
    if (translations[lang]) {
        currentLang = lang;
        updatePageText();
        
        // 如果输入框的内容是默认文本，则也更新它
        const textInput = document.getElementById('textInput');
        const defaultTextZh = translations['zh'].inputPlaceholder;
        const defaultTextEn = translations['en'].inputPlaceholder;
        
        if (textInput.value === defaultTextZh || textInput.value === defaultTextEn) {
            textInput.value = translations[lang].inputPlaceholder;
            // 重新生成预览图
            if (window.generateImage) {
                generateImage(false);
            }
        }

        // 更新选择框的值
        const langSelect = document.getElementById('langSelect');
        if (langSelect) {
            langSelect.value = lang;
        }
    }
}

// 初始化语言选择器
document.addEventListener('DOMContentLoaded', function() {
    const langSelect = document.getElementById('langSelect');
    if (langSelect) {
        // 设置初始值
        langSelect.value = currentLang;
        
        // 添加change事件监听器
        langSelect.addEventListener('change', function(e) {
            switchLanguage(e.target.value);
        });
    }
    
    // 初始化页面文本
    updatePageText();
});

// 更新页面文本
function updatePageText() {
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        const attrName = element.getAttribute('data-i18n-attr');
        
        if (key) {
            if (attrName) {
                // 如果指定了属性名，则翻译该属性
                element.setAttribute(attrName, t(key));
            } else {
                // 否则翻译文本内容
                element.textContent = t(key);
            }
        }
    });
} 