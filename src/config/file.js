/**
 * @typedef {Object} FileConfig
 * @property {number} maxDownload
 */

import { MAX_CONCURRENT_DOWNLOADS } from './constants';

/**
 * 默认的下载配置
 * @type FileConfig
 */
export const defaultFileConfig = {
  maxDownload: MAX_CONCURRENT_DOWNLOADS,
};
