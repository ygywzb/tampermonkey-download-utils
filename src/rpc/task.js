/**
 * @typedef {Object} FileInfo
 * @property {string} url 下载链接
 * @property {string} filename 文件名
 */

/**
 * 真实下载链接获取函数
 * @callback RealUrlGenFunc
 * @param {string} nowUrl
 * @returns {Promise<string>} realUrl
 */

/**
 * @typedef {Object} RPCSendOption
 * @property {Object} rpcOpts RPC需要的额外参数
 * @property {RealUrlGenFunc} realUrlFunc 若不是最终下载链接，请提供获取最终链接获取函数吧
 */

/**
 * 默认配置，默认无需跳转，且rpc无其他要求
 * @type {RPCSendOption}
 */
const defaultRPCSendOption = {
  rpcOpts: {},
  realUrlFunc: null,
};

/**
 * 将一个下载任务推送至aria2 RPC
 * @param {FileInfo} fileInfo 下载文件详情
 * @param {RPCSendOption} [options] 下载选项，脚本内部设置
 * @returns { Promise<string> } GID
 */
const sendOneTask = async (fileInfo, options = {}) => {
  const { url, filename } = fileInfo;
  const { rpcOpts, realUrlFunc } = {
    ...defaultRPCSendOption,
    ...options,
  };
  const rpcUrl = 'http://localhost:6800/jsonrpc'; // Aria2 RPC 地址
  // 获取下载链接
  let realUrl = url;
  if (realUrlFunc) {
    realUrl = await realUrlFunc(url);
  }

  const requestData = {
    jsonrpc: '2.0',
    method: 'aria2.addUri',
    id: 'qwer',
    params: [
      [url],
      {
        out: filename, // 文件名
        ...rpcOpts,
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
 * @param {RPCSendOption} [options] 下载选项，脚本内部设置
 * @returns {Promise<string[]>}
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
