import ProgressBar from 'progressbar.js';

/**
 * @type {ProgressBar.PathDrawingOptions}
 */
const defaultBarOptions = {
  strokeWidth: 4,
  easing: 'easeInOut',
  duration: 1400,
  color: '#3498db', // 蓝色
  trailColor: '#eee',
  trailWidth: 1,
  svgStyle: { width: '100%', height: '100%' },
  from: { color: '#3498db' }, // 蓝色
  to: { color: '#2ecc71' }, // 绿色
  step: (state, bar) => {
    bar.path.setAttribute('stroke', state.color);
  },
};

/**
 * 生成进度条回调
 * @param {HTMLElement} element
 * @param {ProgressBar.PathDrawingOptions} [options] options
 * @returns {import('../utils/file').PCallback}
 */
const PBCallbackGen = (element, options = {}) => {
  const bar = new ProgressBar.Line(element, {
    ...defaultBarOptions,
    ...options,
  });
  return (success, all) => {
    if (success > all) {
      throw new Error(`进度数据不合法，成功数：${success}，总数：${all}`);
    }
    const percent =
      success === all ? 1.0 : parseFloat((success / all).toFixed(2));
    bar.animate(percent);
  };
};

export const adapters = {
  PBCallbackGen,
};
