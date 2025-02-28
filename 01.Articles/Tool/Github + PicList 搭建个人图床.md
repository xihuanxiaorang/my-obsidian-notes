---
tags:
  - Tool
  - PicList
create_time: 2024-12-28T17:34:00
update_time: 2025/02/25 17:24
---

## PicList

[PicList](https://piclist.cn/) 是一款高效的云存储和图床管理工具，在 PicGo 的基础上进行了深度优化，保留了 PicGo 的核心功能并新增了大量实用特性。

- **完全兼容 PicGo 功能**：支持现有的 PicGo 插件，可搭配 Typora、Obsidian 等工具使用。
- **更多内置图床**：新增 WebDav、本地图床、SFTP 和 Telegra. ph，支持 imgur 登录账号上传。
- **云端管理**：
    - 支持同步删除云端图片（所有内置图床和多个插件）。
    - 提供高级搜索、排序和批量修改 URL 功能。
- **图片增强**：内置水印添加、图片压缩、图片缩放、图片旋转、格式转换等功能，支持高级重命名。
- **上传与同步**：表单上传支持多设备共享，配置可同步至 Github 或 Gitee。
- **多图床管理**：支持十余种图床，提供云端文件目录查看、搜索、批量上传、下载及删除功能。
- **文件预览**：支持图片、视频、纯文本和 Markdown 文件的预览。
- **正则重命名**：支持批量重命名云端文件，启用正则表达式。
- **分享与存储**：支持私有存储桶的预签名链接分享。
- **用户体验优化**：
    - 界面美化，窗口大小不再受限。
    - mac 安装包签名，解决安装包损坏的问题。
    - 软件自动更新，多种启动模式。

### 下载安装

1. 前往 [PicList Releases](https://github.com/Kuingsmile/PicList/releases) 下载最新版本安装包。
   ![](https://img.xiaorang.fun/202502251724827.png)
2. 以管理员身份运行安装包，自定义安装路径，例如：`D:\PicList`。
   ![](https://img.xiaorang.fun/202502251724828.png)

### Github 图床配置

具体配置如下图所示：
![](https://img.xiaorang.fun/202502251724829.png)

- 配置名：填写 `Github`。
- 仓库名：新建一个公开仓库（如 `img`）作为图床使用，并按照 `用户名/仓库名` 的格式填写。
- 分支名：可选参数，用于指定图片存储分支，不填写则默认存储在默认分支 `main`。
- Token：![[Github#生成 Github Token]]
- 存储路径：可选参数，用于指定图片存储路径，不填写则默认存储在仓库根目录。
- 自定义域名：可选参数，用于指定图片自定义域名，一般用于 CDN 加速。例如，如果使用了 jsDelivr 加速，可填写：

	```
	https://cdn.jsdelivr.net/gh/{github用户名}/{仓库名}@{分支名}/
	```

	其中 `{github用户名}`、`{仓库名}` 和 `{分支名}` 分别对应 Github 用户名、仓库名和分支名。

## 如何在 Typora 中使用？

1. 打开 Typora 设置，进入 **图像** 配置。
2. 将上传服务设置为 `PicGo(app)`。
3. 填写 PicList 的安装路径，如：`D:\PicList\PicList.exe`。如下图所示：
   ![](https://img.xiaorang.fun/202502251724830.png)

至此，基于 Github 和 PicList 的个人图床就搭建完成啦！🎉🎉🎉
