/**
 * 根据任务唯一ID，获取该任务下载进度
 * @param {string} gid 任务唯一ID
 * @returns {Promise<Object>} 进度详情对象
 */
const getOneStatus = async (gid) => {
  const rpcUrl = 'http://localhost:6800/jsonrpc';

  const requestData = {
    jsonrpc: '2.0',
    method: 'aria2.tellStatus',
    id: 'qwer',
    params: [gid], // gid 是任务的唯一 ID
  };

  const response = await fetch(rpcUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(requestData),
  });
  const result = await response.json().result;
  console.info('任务状态:', result);
  return result;
};

/**
 * 根据GID列表获取所有任务的进度情况
 * @param {string[]} gIdList
 */
export const getAllStatus = async (gIdList) => {
  const res = [];
  for (const gId of gIdList) {
    try {
      const status = await getOneStatus(gId);
      res.push(status);
    } catch (e) {
      console.warn(`进度查询失败，${e}`);
    }
  }
  return res;
};
