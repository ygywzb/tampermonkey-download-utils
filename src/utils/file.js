import JSZip from 'jszip';
import { getData } from './download';
import { saveAs } from 'file-saver';

/**
 * 下载一个文件，并存储在指定的zip中
 * @param {string} url 链接
 * @param {JSZip} zip zip实例
 * @param {import("./download").GMCallback} gmCallback 油猴下载函数，无则使用原生的fetch
 */
const getDataAndAdd = async (url, zip, gmCallback = null) => {
  try {
    const content = await getData(url, gmCallback);
    const name = url.split('/').pop();
    zip.file(name, content, { binary: true });
  } catch (e) {
    console.warn(e);
  }
};

/**
 * 同步方式下载资源并整合至压缩包中
 * @param {string[]} linkList 下载链接列表
 * @param {string} zipName 压缩包名称
 * @param {import("./download").GMCallback} gmCallback 油猴下载函数，无则使用原生的fetch
 * @param {string} extention 压缩包拓展名
 */
export const downloadAndZipSync = async (
  linkList,
  zipName = 'archive',
  gmCallback = null,
  extention = 'zip',
) => {
  const zip = new JSZip();
  // 同步下载各个文件
  linkList.forEach(async (url) => {
    await getDataAndAdd(url, zip, gmCallback);
  });
  const content = await zip.generateAsync({ type: 'blob' });
  saveAs(content, ''.concat(zipName, '.', extention));
};
