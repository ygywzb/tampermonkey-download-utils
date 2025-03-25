/**
 * @typedef {Object} FileInfo
 * @property {string} url 下载链接
 * @property {string} file 文件名
 */

/**
 * 将一个下载任务推送至aria2 RPC
 * @param {FileInfo} fileInfo 下载文件详情
 * @returns { Promise<string> } GID
 */
const sendOneTask = async (fileInfo) => {
  const { url, filename } = fileInfo;
  const rpcUrl = 'http://localhost:6800/jsonrpc'; // Aria2 RPC 地址

  const requestData = {
    jsonrpc: '2.0',
    method: 'aria2.addUri',
    id: 'qwer',
    params: [
      [url],
      {
        out: filename, // 文件名
      },
    ],
  };
  const response = await fetch(rpcUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(requestData),
  });

  const result = await response.json();
  if (!result.result) {
    throw new Error(`RPC服务存在，但下载任务添加失败：${result}`);
  }
  const gid = result.result; // 获取任务 GID
  console.info('下载任务添加成功，GID:', gid);
  return gid;
};

/**
 * 通过RPC发送一系列下载任务，并获取所有GID
 * @param {FileInfo[]} infos 下载文件信息列表
 * @returns {Promise<string[]>}
 */
export const sendAllTasks = async (infos) => {
  // 收集所有gid
  const gIdList = [];
  for (const info of infos) {
    try {
      const gid = await sendOneTask(info);
      gIdList.push(gid);
    } catch (e) {
      console.warn(`任务发送失败，${e}`);
      continue;
    }
  }
  return gIdList;
};
