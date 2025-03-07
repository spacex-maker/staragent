/**
 * 格式化时间
 * @param {number} seconds - 秒数
 * @returns {string} 格式化后的时间字符串
 */
export const formatTime = (seconds) => {
  if (!seconds || seconds === Infinity) return '计算中...';
  if (seconds < 60) return `${Math.ceil(seconds)}秒`;
  if (seconds < 3600) return `${Math.ceil(seconds / 60)}分钟`;
  return `${Math.floor(seconds / 3600)}小时${Math.ceil((seconds % 3600) / 60)}分钟`;
};

/**
 * 格式化速度
 * @param {number} bytesPerSecond - 每秒字节数
 * @returns {string} 格式化后的速度字符串
 */
export const formatSpeed = (bytesPerSecond) => {
  if (!bytesPerSecond) return '0 KB/s';
  const units = ['B/s', 'KB/s', 'MB/s', 'GB/s'];
  let value = bytesPerSecond;
  let unitIndex = 0;
  
  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex++;
  }
  
  return `${value.toFixed(2)} ${units[unitIndex]}`;
};

/**
 * 格式化文件大小
 * @param {number} bytes - 字节数
 * @param {Object} options - 配置选项
 * @param {number} options.precision - 小数点位数，默认为2
 * @param {boolean} options.keepZero - 是否保留末尾的0，默认为false
 * @param {string[]} options.units - 自定义单位数组，默认为 ['B', 'KB', 'MB', 'GB', 'TB', 'PB']
 * @returns {string} 格式化后的文件大小字符串
 */
export const formatFileSize = (bytes, options = {}) => {
  const {
    precision = 2,
    keepZero = false,
    units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB']
  } = options;

  // 处理特殊情况
  if (bytes === undefined || bytes === null) return '0 B';
  if (bytes === 0) return '0 B';
  if (isNaN(bytes) || !isFinite(bytes)) return '未知大小';

  // 计算合适的单位
  const k = 1024;
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  // 确保不超过单位数组范围
  const unitIndex = Math.min(i, units.length - 1);
  
  // 计算最终的值
  const value = bytes / Math.pow(k, unitIndex);
  
  // 格式化数字
  let formattedValue = value.toFixed(precision);
  
  // 如果不保留末尾的0，则去除
  if (!keepZero) {
    formattedValue = parseFloat(formattedValue).toString();
  }
  
  return `${formattedValue} ${units[unitIndex]}`;
};

/**
 * 动态计算文件名省略
 * @param {string} fileName - 文件名
 * @param {number} availableWidth - 可用宽度（像素）
 * @param {Object} options - 配置选项
 * @param {string} options.font - 字体设置，默认 '14px -apple-system'
 * @param {number} options.minFrontChars - 最小保留前缀字符数，默认 4
 * @param {number} options.minEndChars - 最小保留后缀字符数，默认 3
 * @param {number} options.ellipsisWidth - 省略号宽度，默认 20
 * @param {boolean} options.keepExt - 是否总是保持扩展名完整，默认 true
 * @returns {string} 处理后的文件名
 */
export const getDynamicEllipsisFileName = (fileName, availableWidth, options = {}) => {
  if (!fileName) return '';
  
  const {
    font = '14px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial',
    minFrontChars = 4,
    minEndChars = 3,
    ellipsisWidth = 20,
    keepExt = true
  } = options;

  // 获取 canvas context 用于测量文本宽度
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  if (!context) return fileName;
  context.font = font;

  // 测量文本宽度的辅助函数
  const measureWidth = (text) => context.measureText(text).width;

  // 分离文件名和扩展名
  const parts = fileName.split('.');
  const ext = parts.length > 1 ? parts.pop() : '';
  const baseName = parts.join('.');
  
  // 如果文件名加扩展名的总宽度小于可用宽度，直接返回完整文件名
  const fullWidth = measureWidth(fileName);
  if (fullWidth <= availableWidth) {
    return fileName;
  }

  // 计算扩展名宽度（如果需要保持扩展名）
  const extWidth = keepExt && ext ? measureWidth(`.${ext}`) : 0;
  const extString = keepExt && ext ? `.${ext}` : '';
  
  // 计算基本名称可用宽度
  const availableBaseWidth = availableWidth - extWidth - ellipsisWidth;
  
  // 如果可用宽度太小，仅显示最小前缀
  if (availableBaseWidth <= measureWidth(baseName.slice(0, minFrontChars))) {
    const truncated = baseName.slice(0, minFrontChars);
    return `${truncated}...${extString}`;
  }

  // 动态计算前后部分的长度
  let frontChars = minFrontChars;
  let endChars = minEndChars;
  let currentWidth = 0;

  // 逐步增加字符数，直到达到可用宽度
  while (frontChars + endChars < baseName.length) {
    const front = baseName.slice(0, frontChars);
    const end = baseName.slice(-endChars);
    currentWidth = measureWidth(`${front}...${end}`);
    
    if (currentWidth > availableBaseWidth) {
      break;
    }
    
    // 优先增加前部分的字符数
    if (frontChars / (frontChars + endChars) < 0.65) {
      frontChars++;
    } else {
      endChars++;
    }
  }

  // 确保不会超出原始长度
  frontChars = Math.min(frontChars, baseName.length - endChars);
  endChars = Math.min(endChars, baseName.length - frontChars);

  // 构建最终的文件名
  const front = baseName.slice(0, frontChars);
  const end = endChars > 0 ? baseName.slice(-endChars) : '';
  
  return `${front}${end ? '...' : ''}${end}${extString}`;
};

// 导出一个更简单的包装函数，用于快速调用
/**
 * 智能文件名省略（自动计算宽度）
 * @param {string} fileName - 文件名
 * @param {Object} options - 配置选项
 * @returns {string} 处理后的文件名
 */
export const getSmartEllipsisFileName = (fileName, containerElement) => {
  if (!fileName || !containerElement) return fileName;
  
  // 获取容器宽度
  const availableWidth = containerElement.getBoundingClientRect().width;
  
  // 使用默认配置调用动态省略函数
  return getDynamicEllipsisFileName(fileName, availableWidth, {
    font: window.getComputedStyle(containerElement).font,
    minFrontChars: 4,
    minEndChars: 3,
    ellipsisWidth: 20,
    keepExt: true
  });
};

/**
 * 文件名省略处理
 * @param {string} fileName - 文件名
 * @param {Object} options - 配置选项
 * @param {boolean} options.short - 是否使用更短的缩写方式，默认为 true
 * @param {number} options.maxLength - 最大显示长度，short模式默认为12，长模式默认为20
 * @returns {string} 处理后的文件名
 */
export const getEllipsisFileName = (fileName, options = { short: true }) => {
  if (!fileName) return '';
  
  const parts = fileName.split('.');
  const ext = parts.length > 1 ? parts.pop() : '';
  const name = parts.join('.');
  
  // 设置默认最大长度
  const maxLength = options.short ? 12 : 20;
  
  if (options.short) {
    // 短模式：如果文件名超过maxLength个字符
    if (name.length <= maxLength) return fileName;
    
    // 对于较短的文件名，保持前后比例为2:1
    const frontLength = Math.min(6, Math.floor(name.length * 0.67));
    const endLength = Math.min(3, Math.floor(name.length * 0.33));
    
    const start = name.slice(0, frontLength);
    const end = name.slice(-endLength);
    return ext ? `${start}...${end}.${ext}` : `${start}...${end}`;
  } else {
    // 长模式：如果文件名超过maxLength个字符
    if (name.length <= maxLength) return fileName;
    
    // 对于较长的文件名，保持前后比例为3:2
    const frontLength = Math.min(12, Math.floor(name.length * 0.6));
    const endLength = Math.min(8, Math.floor(name.length * 0.4));
    
    const start = name.slice(0, frontLength);
    const end = name.slice(-endLength);
    return ext ? `${start}...${end}.${ext}` : `${start}...${end}`;
  }
};

/**
 * 从中间省略文件名
 * @param {string} fileName - 文件名
 * @param {number} maxLength - 最大显示长度
 * @returns {string} 处理后的文件名
 */
export const getMiddleEllipsisFileName = (fileName) => {
  if (!fileName) return '';
  
  const parts = fileName.split('.');
  const ext = parts.length > 1 ? parts.pop() : '';
  const name = parts.join('.');
  
  if (name.length <= 20) return fileName;
  
  const start = name.slice(0, 10);
  const end = name.slice(-8);
  return ext ? `${start}...${end}.${ext}` : `${start}...${end}`;
};

/**
 * 判断文件是否为图片
 * @param {string} filename - 文件名
 * @returns {boolean} 是否为图片文件
 */
export const isImageFile = (filename) => {
  if (!filename) return false;
  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'];
  const ext = filename.split('.').pop()?.toLowerCase();
  return imageExtensions.includes(ext);
}; 