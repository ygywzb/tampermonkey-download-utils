# 下载函数

## `async` `function` downloadAndZipSync

### 描述
**同步方式**下载资源，整合至压缩包，并保存。

### 参数
- `linkList`：下载链接列表。
- `options`，其他可选参数:
  - `zipName` 压缩包名称，默认为`archive`
  - `gmCallback` 油猴下载函数，无则使用原生的fetch，默认为`null`
  - `extention` 压缩包拓展名，默认为`zip`
  - `progressCallback` 显示进度的回调，默认输出控制台

### 返回值
无

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
```

## `async` `function` downloadAndZipAsync

### 描述
**异步方式**下载资源，整合至压缩包，并保存。

### 参数
同[downloadAndZipSync](#async-function-downloadandzipsync)

### 配置
通过`toolsConfigManager`，在同步下载的基础配置上，进一步操作异步下载的最大下载数`toolsConfigManager.config.file.maxDownload`，默认为5

### 返回值
无

### 示例
同[downloadAndZipSync](#async-function-downloadandzipsync)，仅为调用函数不同。

# 进度显示
进度显示均为`progressCallback`的参数，使用回调生成器实现`PCallback`接口
```
type PCallback = (successNum: number, allNum: number) => void
```

## `default` 控制台输出日志
默认情况下会在控制台输出进度。
```javascript
const DAZDefaultOptions = {
  // 其他默认配置
  progressCallback: (success, all) => {
    console.info(`下载进度：${success}/${all}`);
  },
};
```

## `function` PBCallbackGen

### 描述
基于`progressbar.js`实现，指定元素，在元素下插入一个进度条

### 参数
- `element` 进度条所插入的父元素
- `options` 进度条配置，类型为`ProgressBar.PathDrawingOptions`，具体详见样例
- `position` 插入位置，默认为`'last'`，即尾插；或填入`'first'`，为头插

### 返回值
实现[PCallback](#进度显示)的进度显示回调函数，每次调用回调函数会更新进度

### 示例
结合下载函数的综合实例
```javascript
async function downloadAndZip() {
    await MyTools.downloadAndZipAsync(
        comicInfo.getAllLinks(), 
        {
        zipName: comicInfo.getTitle(),
        gmCallback: GM.xmlHttpRequest,
        extention: "cbz",
        // 生成一个进度条，头插到id为content的元素作为第一个子元素
        progressCallback: MyTools.adapters.PBCallbackGen(
            document.querySelector('#content'), {}, 'first')
        }
    )
}