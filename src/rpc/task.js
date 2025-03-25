/**
 * @typedef {Object} FileInfo
 * @property {string} url 下载链接
 * @property {string} filename 文件名
 */

/**
 * RPC需要的额外参数
 * @typedef {Object} RPCSendOption
 */

/**
 * 默认的RPC发送配置
 * @type {RPCSendOption}
 */
const defaultRPCSendOption = {
  split: '10', // 分片下载
  'max-connection-per-server': '5', // 每个服务器的最大连接数
  'user-agent': 'Mozilla/5.0', // 用户代理
  'all-proxy': 'http://localhost:7890', // 设置代理
};

// 注意：以下的下载链接均为最终链接，以下函数只负责传递给RPC，不会处理
/**
 * 将一个下载任务推送至aria2 RPC
 * @param {FileInfo} fileInfo 下载文件详情
 * @param {RPCSendOption} [options] RPC需要的额外参数
 * @returns { Promise<string> } GID
 */
const sendOneTask = async (fileInfo, options = {}) => {
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
        ...defaultRPCSendOption,
        ...options,
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
 * @param {RPCSendOption} [options] RPC需要的额外参数
 * @returns {Promise<string[]>} GID列表
 */
export const sendAllTasks = async (infos, options = {}) => {
  // 收集所有gid
  const gIdList = [];
  for (const info of infos) {
    try {
      const gid = await sendOneTask(info, options);
      gIdList.push(gid);
    } catch (e) {
      console.warn(`任务发送失败，${e}`);
      continue;
    }
  }
  return gIdList;
};
