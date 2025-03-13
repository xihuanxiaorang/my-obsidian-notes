---
tags:
  - DevKit
  - EnvironmentSetup
  - Java
refrence_url:
  - https://www.bilibili.com/video/BV16u4m1c7YX?vd_source=84272a2d7f72158b38778819be5bc6ad
create_time: 2025-02-20 11:57
update_time: 2025/03/13 22:21
---

## 简介

- [Tomcat](https://tomcat.apache.org/) 是一个开源应用服务器，专为实现 Jakarta EE 和 Java EE 规范，广泛用于 Web 应用的部署。
- Tomcat 10 及以上版本支持 Jakarta EE，Tomcat 9 及以下版本支持 Java EE。
- 拥有活跃的全球开发者社区，致力于高效的 Web 应用开发与部署。

## 版本选择

Apache Tomcat 实现了部分 Jakarta EE（原 Java EE）技术。不同版本的 Tomcat 支持不同的 Java 规范版本，如下表所示：

- **当前支持的版本**：Tomcat `11.x`、`10.1.x`、`9.x` 版本，支持较新的 Java 版本。
- **已过时的版本**：Tomcat `5.x` 到 `8.x` 已进入生命周期末期，官方已停止提供支持。

|**版本**|**支持的 Java 版本**|**Servlet 规范**|**JSP 规范**|**EL 规范**|**WebSocket 规范**|**认证规范（JASPIC）**|
|---|---|---|---|---|---|---|
| `11.0.x` |17 及以上|6.1|4.0|6.0|2.2|3.1|
| `10.1.x` |11 及以上|6.0|3.1|5.0|2.1|3.0|
| `9.0.x` |8 及以上|4.0|2.3|3.0|1.1|1.1|

- **兼容性说明**：每个 Tomcat 版本支持特定的 Java 版本，确保符合相关规范要求。
- **强烈建议使用最新稳定版本**👍👍👍：尽管部分旧版本（如 Tomcat `7.x`）仍有社区支持，但随着时间推移，旧版本的支持逐渐减少，且更多社区资源集中在最新版本。

## 下载 & 安装

访问 [Apache Tomcat® - Apache Tomcat 11 Software Downloads](https://tomcat.apache.org/download-11.cgi) 页面，下载最新稳定的免安装版 Tomcat。
![](https://img.xiaorang.fun/202502210001574.png)

解压 Tomcat 至任意目录（如：`E:\devsoft\apache-tomcat-11.0.4`），目录结构如下所示：
![](https://img.xiaorang.fun/202502210001575.png)

## 启动服务

进入解压后的 `bin` 目录，双击 `startup.bat` 启动 Tomcat 服务。
![](https://img.xiaorang.fun/202502210001576.png)

打开浏览器，访问 http://localhost:8080/ ，出现如下界面则说明 Tomcat 服务已成功启动！
![](https://img.xiaorang.fun/202502210001577.png)

## 控制台编码设置

如果控制台输出出现乱码，可以通过以下方法解决：
1. 打开 Tomcat 配置目录下的 `conf/logging.properties` 文件。
2. 找到文件中的第 `51` 行，修改日志输出编码为 `GBK`：

	```
	java.util.logging.ConsoleHandler.encoding = GBK
	```

3. 保存文件并重新启动 Tomcat 服务。此时控制台输出的乱码问题已成功解决！🎉🎉🎉
   ![](https://img.xiaorang.fun/202502210001578.png)
