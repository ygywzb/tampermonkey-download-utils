import { CONFIG_KEY } from './constants';
import { defaultDownloadConfig } from './download';
import { defaultFileConfig } from './file';

/**
 * 工具配置，包括所有配置
 * @typedef {Object} ToolsConfig
 * @property {import("./file").FileConfig} file
 * @property {import("./download").DownloadConfig} download
 */

/**
 * 工具默认配置，包括所有的默认配置
 * @type ToolsConfig
 */
const defaultConfig = {
  download: defaultDownloadConfig,
  file: defaultFileConfig,
};

/**
 * 配置管理器
 * @typedef {Object} ConfigManager
 * @property {ToolsConfig} config
 * @property {function} load
 * @property {function} save
 * @property {function} remove
 * @property {function} reset
 */

/**
 * 配置管理器，默认配置，使用localstorage配置持久化
 * @type ConfigManager
 */
export const toolsConfigManager = {
  config: defaultConfig,
  load: () => {
    const cfg = localStorage.getItem(CONFIG_KEY);
    if (cfg !== null) {
      toolsConfigManager.config = JSON.parse(cfg);
      console.info('已载入本地配置:', toolsConfigManager.config);
    } else {
      console.info('未发现本地配置，将使用默认配置');
    }
  },
  save: () => {
    localStorage.setItem(CONFIG_KEY, JSON.stringify(toolsConfigManager.config));
    console.info('已保存当前配置到本地:', toolsConfigManager.config);
  },
  remove: () => {
    localStorage.removeItem(CONFIG_KEY);
    console.info('已清除本地配置');
  },
  reset: () => {
    toolsConfigManager.config = defaultConfig;
    console.info('已恢复默认配置');
  },
};
