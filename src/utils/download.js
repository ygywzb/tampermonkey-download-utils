/**
 * GM_XHR成功返回的对象
 * @typedef GMResponse
 * @property {*} response 一定有response属性
 * @property {number} status
 */

/**
 * GM下载函数，一般为GM.xmlHttpRequest
 * @callback GMCallback
 * @param {Object} options 下载选项
 * @returns {Promise<GMResponse>} 响应数据
 */

/**
 * 通过GM API下载来获取数据
 * @param {GMCallback} gmCallback 下载函数
 * @param {string} url 下载链接
 * @returns {Promise<*>} 直接输出数据
 */
const getDataByGM = async (gmCallback, url) => {
  console.debug(`调用GM_XHR, URL:${url}`);
  const response = await gmCallback({
    method: 'get',
    url: url,
    responseType: 'blob',
  });
  console.debug(`响应自${url}:`, response);
  if (response.status !== 200) {
    const errMsg = `GM_XHR 相应错误! 响应码: ${response.status}`;
    console.error(errMsg);
    throw new Error(errMsg);
  }
  return response.response;
};
/**
 * 通过fetch获取二进制数据
 * @param {string} url 链接
 * @returns {Blob} 二进制数据
 */
const getDataByFetch = async (url) => {
  console.debug(`调用fetch, URL:${url}`);
  const response = await fetch(url);
  console.debug(`响应自${url}:`, response);
  if (!response.ok) {
    const errMsg = `fetch 响应码错误! 响应码: ${response.status}`;
    console.error(errMsg);
    throw new Error(errMsg);
  }
  const blob = await response.blob();
  return blob;
};
/**
 * 获取二进制数据，可选是否用GM，否则用原生fetch
 * @param {string} url 链接
 * @param {GMCallback} callback GM下载函数，一般为GM.xmlHttpRequest
 * @returns {*} 二进制数据
 */
export const getData = async (url, callback = null) => {
  if (callback === null) {
    return getDataByFetch(url);
  }
  return getDataByGM(callback, url);
};
