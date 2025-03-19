import JSZip from 'jszip';
import { getData } from './download';
import { saveAs } from 'file-saver';
import { toolsConfigManager } from '../config';

/**
 * 下载一个文件，并存储在指定的zip中
 * @param {string} url 链接
 * @param {JSZip} zip zip实例
 * @param {import("./download").GMCallback} gmCallback 油猴下载函数，无则使用原生的fetch
 */
const getDataAndAdd = async (url, zip, gmCallback = null) => {
  console.log(`开始下载文件: ${url}`);
  const content = await getData(url, gmCallback);
  const name = url.split('/').pop();
  console.log(`文件下载成功: ${name}`);
  zip.file(name, content, { binary: true });
  console.log(`文件已添加到zip: ${name}`);
};

/**
 * @callback PCallback
 * @param {number} successNum
 * @param {number} allNum
 * @returns {void}
 */

/**
 * @typedef {Object} DAZOptions
 * @property {string} zipName - 压缩包名称
 * @property {import("./download").GMCallback} gmCallback - 油猴下载函数，无则使用原生的fetch
 * @property {string} extention - 压缩包拓展名
 * @property {PCallback} progressCallback - 下载进度回调
 */

/** @type {DAZOptions}*/
const DAZDefaultOptions = {
  zipName: 'archive',
  gmCallback: null,
  extention: 'zip',
  progressCallback: (success, all) => {
    console.info(`下载进度：${success}/${all}`);
  },
};

/**
 * 同步方式下载资源并整合至压缩包中
 * @param {string[]} linkList 下载链接列表
 * @param {DAZOptions} [options] 其他可选参数
 */
export const downloadAndZipSync = async (linkList, options = {}) => {
  const { zipName, gmCallback, extention, progressCallback } = {
    ...DAZDefaultOptions,
    ...options,
  };

  console.debug('下载链接列表:', linkList);
  console.debug('压缩包名称:', zipName);
  console.debug('使用的下载函数:', gmCallback ? 'GMCallback' : 'fetch');
  console.debug('压缩包拓展名:', extention);

  if (linkList.length <= 0) {
    console.warn('下载列表为空！');
    return;
  }

  console.info('将以同步模式下载');
  console.debug('开始创建新的zip对象');
  const zip = new JSZip();
  // 同步下载各个文件
  console.info('下载开始');

  let successNum = 0;
  let allNum = linkList.length;
  for (const url of linkList) {
    try {
      await getDataAndAdd(url, zip, gmCallback);
      successNum++;
    } catch (e) {
      console.warn(`下载或添加文件失败: ${url}`, e);
    } finally {
      progressCallback(successNum, allNum);
    }
  }
  console.info(`下载结束, 成功:${successNum}, 共:${allNum}`);
  console.info('压缩中');
  const content = await zip.generateAsync({ type: 'blob' });
  console.info('压缩包生成完成');
  saveAs(content, ''.concat(zipName, '.', extention));
  console.info(`文件已保存为: ${zipName}.${extention}`);
};

/**
 * 异步方式下载资源并整合至压缩包中
 * @param {string[]} linkList 下载链接列表
 * @param {DAZOptions} [options] 其他可选参数
 */
export const downloadAndZipAsync = async (linkList, options = {}) => {
  const { zipName, gmCallback, extention, progressCallback } = {
    ...DAZDefaultOptions,
    ...options,
  };
  const maxDownload = toolsConfigManager.config.file.maxDownload;

  console.debug('下载链接列表:', linkList);
  console.debug('压缩包名称:', zipName);
  console.debug('使用的下载函数:', gmCallback ? 'GMCallback' : 'fetch');
  console.debug('压缩包拓展名:', extention);
  console.debug('最大下载数:', maxDownload);

  if (linkList.length <= 0) {
    console.warn('下载列表为空！');
    return;
  }
  console.info('将以异步方式下载');
  console.debug('开始创建新的zip对象');
  const zip = new JSZip();

  const incrementSuccessNum = async () => {
    successNum++;
  };

  const allNum = linkList.length;
  let successNum = 0;
  const downloadQueue = [];
  for (const url of linkList) {
    const downloadTask = async () => {
      try {
        await getDataAndAdd(url, zip, gmCallback);
        await incrementSuccessNum();
      } catch (error) {
        console.error(`下载失败: ${url}`, error);
      } finally {
        progressCallback(successNum, allNum);
      }
    };

    downloadQueue.push(downloadTask);

    if (downloadQueue.length >= maxDownload) {
      console.debug('下载队列开始，异步下载个数:', downloadQueue.length);
      await Promise.all(downloadQueue.map((task) => task()));
      downloadQueue.length = 0; // 清空队列
    }
  }

  // 处理剩余的下载任务
  if (downloadQueue.length > 0) {
    console.debug('下载队列开始，异步下载个数:', downloadQueue.length);
    await Promise.all(downloadQueue.map((task) => task()));
  }

  console.info(`下载结束, 成功:${successNum}, 共:${allNum}`);
  console.info('压缩中');
  const content = await zip.generateAsync({ type: 'blob' });
  console.info('压缩包生成完成');
  saveAs(content, ''.concat(zipName, '.', extention));
  console.info(`文件已保存为: ${zipName}.${extention}`);
};
