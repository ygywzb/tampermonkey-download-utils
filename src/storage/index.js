import { DOWNLOADED_KEY, SELECTED_KEY } from './constants';

const LS = localStorage;
// 持久化存储已经下载的id
const LSDownloadedManager = {
  /**
   * 添加id至已下载列表并保存
   * @param {number} id
   */
  add(id) {
    const dListStr = LS.getItem(DOWNLOADED_KEY);
    const dList = !dListStr ? [] : JSON.parse(dListStr);
    dList.push(id);
    LS.setItem(DOWNLOADED_KEY, JSON.stringify(dList));
  },
  getSearcher() {
    const dListStr = LS.getItem(DOWNLOADED_KEY);
    const dl = JSON.parse(dListStr);
    if (!dListStr || sl.length === 0) {
      return null;
    }
    const idSet = new Set(dl);
    return (id) => idSet.has(id);
  },
};

/**
 * 待下载视频详情
 * @typedef {Object} SelectedVideoInfo
 * @property {number} videoId 视频ID，不同清晰度ID相同
 * @property {string} videoTitle 视频标题
 * @property {string} videoUrl 视频下载链接
 * @property {string} videoRes 视频清晰度
 */

// 持久化存储已经选中、待下载的信息
const LSSelectedManager = {
  /**
   * 添加视频信息至待下载列表
   * @param {SelectedVideoInfo} info 视频信息
   * @returns {number} 返回当前任务个数
   */
  add(info) {
    const dList = this.getList();
    dList.push(info);
    LS.setItem(SELECTED_KEY, JSON.stringify(dList));
    return dList.length;
  },
  /**
   * 清空列表
   */
  clear() {
    LS.removeItem(SELECTED_KEY);
  },
  /**
   * 获取待下载列表
   * @returns {SelectedVideoInfo[]} 待下载列表
   */
  getList() {
    const dListStr = LS.getItem(SELECTED_KEY);
    return !dListStr ? [] : JSON.parse(dListStr);
  },
  getSearcher() {
    const dListStr = LS.getItem(SELECTED_KEY);
    const sl = JSON.parse(dListStr);
    if (!dListStr || sl.length === 0) {
      return null;
    }
    const idSet = new Set(sl.map((info) => info.videoId));
    return (id) => idSet.has(id);
  },
};
export default { LSDownloadedManager, LSSelectedManager };
