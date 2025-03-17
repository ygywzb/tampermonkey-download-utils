# 接口文档

## downloadAndZipSync

### 描述
同步方式下载资源并整合至压缩包中。

### 参数
- `linkList`：下载链接列表。
- `options`，其他可选参数:
  - `zipName` 压缩包名称，默认为`archive`
  - `gmCallback` 油猴下载函数，无则使用原生的fetch，默认为`null`
  - `extention` 压缩包拓展名，默认为`zip`

### 返回值
异步函数，返回promise

### 示例
```javascript
async function downloadAndZip() {
    debugger;
    if (MyTools === undefined) {
        alert("资源加载失败！");
        return;
    }
    await MyTools.downloadAndZipSync(
        comicInfo.getAllLinks(), 
        {
            zipName: comicInfo.getTitle(), 
            gmCallback: GM.xmlHttpRequest, 
            extention: "cbz"
        });
}