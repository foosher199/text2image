// 获取DOM元素
const textInput = document.getElementById('textInput');
const fontFamily = document.getElementById('fontFamily');
const fontWeight = document.getElementById('fontWeight');
const fontSize = document.getElementById('fontSize');
const letterSpacing = document.getElementById('letterSpacing');
const lineHeight = document.getElementById('lineHeight');
const textColor = document.getElementById('textColor');
const bgColor = document.getElementById('bgColor');
const transparentBg = document.getElementById('transparentBg');
const autoCrop = document.getElementById('autoCrop');
const cropPadding = document.getElementById('cropPadding');
const width = document.getElementById('width');
const height = document.getElementById('height');
const sizePreset = document.getElementById('sizePreset');
const textAlign = document.getElementById('textAlign');
const textShadow = document.getElementById('textShadow');
const shadowColor = document.getElementById('shadowColor');
const shadowBlur = document.getElementById('shadowBlur');
const shadowOffsetX = document.getElementById('shadowOffsetX');
const shadowOffsetY = document.getElementById('shadowOffsetY');
const textStroke = document.getElementById('textStroke');
const strokeColor = document.getElementById('strokeColor');
const strokeWidth = document.getElementById('strokeWidth');
const textRotation = document.getElementById('textRotation');
const textItalic = document.getElementById('textItalic');
const textUnderline = document.getElementById('textUnderline');
const textStrike = document.getElementById('textStrike');
const imageFormat = document.getElementById('imageFormat');
const exportQuality = document.getElementById('exportQuality');
const downloadBtn = document.getElementById('downloadBtn');
const canvas = document.getElementById('previewCanvas');
const ctx = canvas.getContext('2d');

// 获取设备像素比
const dpr = window.devicePixelRatio || 1;

// 预设尺寸配置
const sizePresets = {
    'custom': null,
    '1:1': { width: 800, height: 800 },
    '16:9': { width: 1280, height: 720 },
    '4:3': { width: 1024, height: 768 },
    'story': { width: 1080, height: 1920 },
    'banner': { width: 1200, height: 300 },
    'post': { width: 1080, height: 1080 },
    'cover': { width: 1500, height: 500 },
    'wide': { width: 1920, height: 1080 }
};

// 监听字体大小滑块变化
[fontSize, letterSpacing, strokeWidth].forEach(input => {
    input.addEventListener('input', (e) => {
        const value = e.target.value;
        e.target.nextElementSibling.textContent = `${value}px`;
    });
});

// 监听行高滑块变化
lineHeight.addEventListener('input', (e) => {
    const value = e.target.value;
    e.target.nextElementSibling.textContent = value;
});

// 监听旋转角度滑块变化
textRotation.addEventListener('input', (e) => {
    const value = e.target.value;
    e.target.nextElementSibling.textContent = `${value}°`;
});

// 监听导出质量滑块变化
exportQuality.addEventListener('input', (e) => {
    const value = e.target.value;
    e.target.nextElementSibling.textContent = `${value}%`;
});

// 监听文字阴影开关
textShadow.addEventListener('change', () => {
    const shadowControls = document.querySelector('.shadow-controls');
    shadowControls.style.display = textShadow.checked ? 'block' : 'none';
    generateImage();
});

// 监听文字描边开关
textStroke.addEventListener('change', () => {
    const strokeControls = document.querySelector('.stroke-controls');
    strokeControls.style.display = textStroke.checked ? 'block' : 'none';
    generateImage();
});

// 监听尺寸预设变化
sizePreset.addEventListener('change', () => {
    const preset = sizePresets[sizePreset.value];
    if (preset) {
        width.value = preset.width;
        height.value = preset.height;
        generateImage();
    }
});

// 监听手动尺寸变化
width.addEventListener('change', () => sizePreset.value = 'custom');
height.addEventListener('change', () => sizePreset.value = 'custom');

// 监听背景透明选项变化
transparentBg.addEventListener('change', () => {
    bgColor.disabled = transparentBg.checked;
    autoCrop.disabled = !transparentBg.checked;
    cropPadding.disabled = !transparentBg.checked || !autoCrop.checked;
    if (!transparentBg.checked) {
        autoCrop.checked = false;
    }
    generateImage();
});

// 监听自动裁剪选项变化
autoCrop.addEventListener('change', () => {
    cropPadding.disabled = !autoCrop.checked || !transparentBg.checked;
    generateImage();
});

// 监听裁剪边距变化
cropPadding.addEventListener('change', () => {
    generateImage();
});

// 计算文本边界
function getTextBounds(lines, lineHeight) {
    const padding = parseInt(cropPadding.value);
    let maxWidth = 0;
    
    // 根据对齐方式计算所需宽度
    lines.forEach(line => {
        const metrics = ctx.measureText(line);
        maxWidth = Math.max(maxWidth, metrics.width);
    });
    
    const width = maxWidth + padding * 2;
    const height = lines.length * lineHeight + padding * 2;
    return { width, height };
}

// 生成图片
function generateImage(forDownload = false) {
    // 获取目标尺寸
    let targetWidth = parseInt(width.value);
    let targetHeight = parseInt(height.value);
    
    // 获取文本内容并按行分割
    const lines = textInput.value.split('\n');
    const currentLineHeight = parseFloat(lineHeight.value); // 使用自定义行高
    const lineHeightPx = parseInt(fontSize.value) * currentLineHeight;

    // 如果是下载模式且启用了自动裁剪，计算实际所需尺寸
    if (forDownload && transparentBg.checked && autoCrop.checked) {
        // 临时设置字体以便测量文本
        const fontStyle = textItalic.checked ? 'italic' : 'normal';
        ctx.font = `${fontStyle} ${fontWeight.value} ${fontSize.value}px ${fontFamily.value}`;
        const bounds = getTextBounds(lines, lineHeightPx);
        targetWidth = bounds.width;
        targetHeight = bounds.height;
    }
    
    // 设置画布尺寸，考虑设备像素比
    canvas.width = targetWidth * dpr;
    canvas.height = targetHeight * dpr;
    
    // 设置画布CSS尺寸
    canvas.style.width = `${targetWidth}px`;
    canvas.style.height = `${targetHeight}px`;

    // 缩放上下文以匹配设备像素比
    ctx.scale(dpr, dpr);

    // 清空画布（使用透明背景）
    ctx.clearRect(0, 0, targetWidth, targetHeight);
    
    // 如果不是下载模式且背景不透明，绘制背景色
    if (!forDownload && !transparentBg.checked) {
        ctx.fillStyle = bgColor.value;
        ctx.fillRect(0, 0, targetWidth, targetHeight);
    }

    // 设置文字样式
    const fontStyle = textItalic.checked ? 'italic' : 'normal';
    ctx.font = `${fontStyle} ${fontWeight.value} ${fontSize.value}px ${fontFamily.value}`;
    ctx.fillStyle = textColor.value;
    ctx.textAlign = textAlign.value;
    ctx.textBaseline = 'middle';
    
    // 设置字间距
    ctx.letterSpacing = `${letterSpacing.value}px`;
    
    // 设置文字阴影
    if (textShadow.checked) {
        ctx.shadowColor = shadowColor.value;
        ctx.shadowBlur = parseInt(shadowBlur.value);
        ctx.shadowOffsetX = parseInt(shadowOffsetX.value);
        ctx.shadowOffsetY = parseInt(shadowOffsetY.value);
    } else {
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
    }
    
    // 启用字体平滑
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    
    // 计算文本总高度
    const totalHeight = lines.length * lineHeightPx;
    
    // 根据对齐方式确定x坐标
    let x;
    switch (textAlign.value) {
        case 'left':
            x = parseInt(cropPadding.value) || 20;
            break;
        case 'right':
            x = targetWidth - (parseInt(cropPadding.value) || 20);
            break;
        default: // center
            x = targetWidth / 2;
    }
    
    // 如果是自动裁剪模式，调整起始位置到padding
    let startY;
    if (forDownload && transparentBg.checked && autoCrop.checked) {
        startY = parseInt(cropPadding.value);
    } else {
        startY = (targetHeight - totalHeight) / 2;
    }

    // 绘制每行文本
    lines.forEach((line, index) => {
        const y = startY + (index + 0.5) * lineHeightPx;
        
        // 保存当前上下文状态
        ctx.save();
        
        // 应用旋转变换
        if (textRotation.value !== '0') {
            const rotation = parseInt(textRotation.value) * Math.PI / 180;
            ctx.translate(x, y);
            ctx.rotate(rotation);
            ctx.translate(-x, -y);
        }
        
        // 绘制描边
        if (textStroke.checked) {
            ctx.strokeStyle = strokeColor.value;
            ctx.lineWidth = parseInt(strokeWidth.value);
            ctx.lineJoin = 'round';
            ctx.strokeText(line, x, y);
        }
        
        // 绘制文本
        ctx.fillText(line, x, y);
        
        // 绘制下划线
        if (textUnderline.checked) {
            const metrics = ctx.measureText(line);
            // 修改下划线位置：从文字中线偏移到文字底部
            const underlineY = y + parseInt(fontSize.value) * 0.35;
            
            ctx.beginPath();
            ctx.strokeStyle = textColor.value;
            // 调整下划线粗细，使其更细一些
            ctx.lineWidth = Math.max(1, parseInt(fontSize.value) * 0.04);
            
            // 根据对齐方式调整下划线位置
            let underlineX;
            switch (textAlign.value) {
                case 'left':
                    underlineX = x;
                    ctx.moveTo(underlineX, underlineY);
                    ctx.lineTo(underlineX + metrics.width, underlineY);
                    break;
                case 'right':
                    underlineX = x - metrics.width;
                    ctx.moveTo(underlineX, underlineY);
                    ctx.lineTo(x, underlineY);
                    break;
                default: // center
                    underlineX = x - metrics.width / 2;
                    ctx.moveTo(underlineX, underlineY);
                    ctx.lineTo(x + metrics.width / 2, underlineY);
            }
            ctx.stroke();
        }
        
        // 绘制删除线
        if (textStrike.checked) {
            const metrics = ctx.measureText(line);
            // 删除线保持在文字中间
            const strikeY = y;
            
            ctx.beginPath();
            ctx.strokeStyle = textColor.value;
            // 调整删除线粗细
            ctx.lineWidth = Math.max(1, parseInt(fontSize.value) * 0.05);
            
            // 根据对齐方式调整删除线位置
            let strikeX;
            switch (textAlign.value) {
                case 'left':
                    strikeX = x;
                    ctx.moveTo(strikeX, strikeY);
                    ctx.lineTo(strikeX + metrics.width, strikeY);
                    break;
                case 'right':
                    strikeX = x - metrics.width;
                    ctx.moveTo(strikeX, strikeY);
                    ctx.lineTo(x, strikeY);
                    break;
                default: // center
                    strikeX = x - metrics.width / 2;
                    ctx.moveTo(strikeX, strikeY);
                    ctx.lineTo(x + metrics.width / 2, strikeY);
            }
            ctx.stroke();
        }
        
        // 恢复上下文状态
        ctx.restore();
    });
}

// 下载图片
function downloadImage() {
    // 生成透明背景的图片
    generateImage(true);
    
    const link = document.createElement('a');
    const format = imageFormat.value;
    const extension = format.split('/')[1];
    link.download = `text-image.${extension}`;
    
    // 获取导出质量
    const quality = parseInt(exportQuality.value) / 100;
    
    // 根据选择的格式导出图片
    if (format === 'image/jpeg') {
        // JPEG不支持透明，使用白色背景
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = canvas.width;
        tempCanvas.height = canvas.height;
        const tempCtx = tempCanvas.getContext('2d');
        tempCtx.fillStyle = '#ffffff';
        tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
        tempCtx.drawImage(canvas, 0, 0);
        link.href = tempCanvas.toDataURL('image/jpeg', quality);
    } else {
        // PNG和WebP支持透明
        link.href = canvas.toDataURL(format, format === 'image/webp' ? quality : 1.0);
    }
    
    link.click();
    
    // 重新生成预览图
    generateImage(false);
}

// 添加事件监听器
downloadBtn.addEventListener('click', downloadImage);

// 监听所有输入变化，实时预览
const inputs = [
    textInput, fontFamily, fontWeight, fontSize, letterSpacing, lineHeight,
    textColor, bgColor, width, height, cropPadding, textAlign,
    shadowColor, shadowBlur, shadowOffsetX, shadowOffsetY,
    textItalic, textUnderline, textStrike, textRotation,
    textStroke, strokeColor, strokeWidth
];
inputs.forEach(input => {
    input.addEventListener('input', () => generateImage(false));
    if (input.type === 'checkbox') {
        input.addEventListener('change', () => generateImage(false));
    }
});

// 处理颜色预设按钮点击
document.querySelectorAll('.color-preset-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        const color = e.target.dataset.color;
        const parent = e.target.closest('.control-group');
        const colorInput = parent.querySelector('input[type="color"]');
        colorInput.value = color;
        generateImage(false);
        
        // 移除其他按钮的active状态
        parent.querySelectorAll('.color-preset-btn').forEach(b => b.classList.remove('active'));
        // 添加当前按钮的active状态
        e.target.classList.add('active');
    });
});

// 页面加载时初始化
window.addEventListener('load', () => {
    // 设置默认文本
    textInput.value = '在这里输入文字';
    // 设置背景颜色输入框状态
    bgColor.disabled = transparentBg.checked;
    // 设置自动裁剪选项状态
    autoCrop.disabled = !transparentBg.checked;
    // 设置裁剪边距选择框状态
    cropPadding.disabled = !transparentBg.checked || !autoCrop.checked;
    // 设置阴影控件状态
    document.querySelector('.shadow-controls').style.display = 'none';
    // 生成默认图片
    generateImage(false);
    // 初始化语言
    updatePageText();
});

// 语言切换处理
const langSelect = document.getElementById('langSelect');
langSelect.addEventListener('change', (e) => {
    switchLanguage(e.target.value);
}); 