import JSZip from "jszip";
import { saveAs } from "file-saver";

/**
 * @typedef {Object} FileData
 * @property {string} name
 * @property {*} content
 */

/**
 * 将文件列表保存至压缩包中
 * @param {FileData[]} files 文件列表
 * @param {string} aname 压缩包命名
 * @param {string} extention 压缩包拓展名
 */
export const zipFiles = async (
  files,
  aname = "archive.zip",
  extention = "zip"
) => {
  const zip = new JSZip();
  files.forEach(({ name, content }) => {
    zip.file(name, content);
  });
  const content = await zip.generateAsync({ type: "blob" });
  saveAs(content, "".concat(aname, ".", extention));
};
