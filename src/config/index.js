import { CONFIG_KEY, CONFIG_VERSION } from './constants';
import { defaultDownloadConfig } from './download';
import { defaultFileConfig } from './file';

/**
 * 工具配置，包括所有配置
 * @typedef {Object} ToolsConfig
 * @property {string} version
 * @property {import("./file").FileConfig} file
 * @property {import("./download").DownloadConfig} download
 */

/**
 * 工具默认配置，包括所有的默认配置
 * @type ToolsConfig
 */
const defaultConfig = {
  version: CONFIG_VERSION,
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
    const cfgStr = localStorage.getItem(CONFIG_KEY);
    if (cfgStr !== null) {
      const cfg = JSON.parse(cfgStr);
      if (cfg.version !== CONFIG_VERSION) {
        toolsConfigManager.config = defaultConfig;
        console.warn('配置版本不匹配，将使用默认配置');
        return;
      }
      toolsConfigManager.config = cfg;
      console.info('已载入本地配置:', toolsConfigManager.config);
    } else {
      toolsConfigManager.config = defaultConfig;
      console.warn('未发现本地配置，将使用默认配置');
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
