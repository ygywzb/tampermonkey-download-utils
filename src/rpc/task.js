/**
 * 将一个下载任务推送至aria2 RPC
 * @param {string} url 下载链接
 * @param {string} filename 文件名
 * @returns { string } GID
 */
const addAria2Task = async (url, filename) => {
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

  try {
    const response = await fetch(rpcUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestData),
    });

    const result = await response.json();
    if (result.result) {
      const gid = result.result; // 获取任务 GID
      console.info('下载任务添加成功，GID:', gid);
      return gid;
    } else {
      console.warn('下载任务添加失败:', result);
      return null;
    }
  } catch (error) {
    console.error('请求失败:', error);
    return null;
  }
};

export default {
  addAria2Task,
};
