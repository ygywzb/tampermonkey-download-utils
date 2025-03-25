/**
 * 根据任务唯一ID，获取该任务下载进度
 * @param {string} gid 任务唯一ID
 * @returns {Object} 进度详情对象
 */
const getAria2Status = async (gid) => {
  const rpcUrl = 'http://localhost:6800/jsonrpc';

  const requestData = {
    jsonrpc: '2.0',
    method: 'aria2.tellStatus',
    id: 'qwer',
    params: [gid], // gid 是任务的唯一 ID
  };

  try {
    const response = await fetch(rpcUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestData),
    });
    const result = await response.json().result;
    console.info('任务状态:', result);
    return result;
  } catch (error) {
    console.error('请求失败:', error);
  }
};
export default { getAria2Status };
