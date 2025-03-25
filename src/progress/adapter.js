import ProgressBar from 'progressbar.js';

/**
 * @type {ProgressBar.PathDrawingOptions}
 */
const defaultBarOptions = {
  strokeWidth: 1,
  easing: 'easeInOut',
  duration: 1400,
  color: '#3498db', // 蓝色
  trailColor: '#eee',
  trailWidth: 1,
  svgStyle: { width: '100%', height: '100%' },
  text: {
    style: {
      color: 'white',
      position: 'absolute',
      right: '0',
      top: '0',
      padding: 0,
      margin: 0,
      transform: {
        prefix: true, // 自动加浏览器前缀
        value: 'translate(-50%, 0%)',
      },
      transition: 'left 0.25s ease-out',
    },
    autoStyleContainer: false,
  },
  from: { color: '#3498db' }, // 蓝色
  to: { color: '#2ecc71' }, // 绿色
  step: (state, bar) => {
    const percent = Math.round(bar.value() * 100);
    bar.setText(percent <= 5 ? '' : percent + ' %');
    bar.text.style.left = percent / 2 + '%';
    bar.path.setAttribute('stroke', state.color);
  },
};

/**
 * 生成进度条回调
 * @param {HTMLElement} element
 * @param {ProgressBar.PathDrawingOptions} [options] options
 * @returns {import('../utils/file').PCallback}
 */
const PBCallbackGen = (element, options = {}, position = 'last') => {
  const divEle = document.createElement('div');
  divEle.style.position = 'relative';
  const bar = new ProgressBar.Line(divEle, {
    ...defaultBarOptions,
    ...options,
  });

  if (position === 'first') {
    element.insertBefore(divEle, element.firstChild);
  } else {
    element.appendChild(divEle);
  }

  return (success, all) => {
    if (success > all) {
      throw new Error(`进度数据不合法，成功数：${success}，总数：${all}`);
    }
    const percent =
      success === all ? 1.0 : parseFloat((success / all).toFixed(2));
    bar.animate(percent);
  };
};

/**
 * 默认进度输出，控制台
 * @param {string} msg
 * @returns {import('../utils/file').PCallback}
 */
const defaultCallbackGen = (msg = '下载进度：') => {
  return (success, all) => {
    console.info(`${msg}${success}/${all}`);
  };
};

export const adapters = {
  PBCallbackGen,
  defaultCallbackGen,
};
