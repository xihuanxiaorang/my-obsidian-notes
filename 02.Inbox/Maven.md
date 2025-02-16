---
tags:
  - DevTool
  - EnvironmentSetup
  - Java
create_time: 2025-02-15 12:21
update_time: 2025/02/16 17:32
---

## 下载 & 安装

> [!important] 系统要求
> 1. **Java Development Kit (JDK)**：Maven 3.9+ 需要 JDK 8 或更高版本才能执行。
> 2. **内存**：无最低要求。
> 3. **磁盘**：大约需要 10MB 用于 Maven 本身的安装。除此之外，还需要使用磁盘空间来存储您的本地 Maven 仓库。本地仓库的大小会根据使用情况而变化，但至少需要 500MB。
> 4. **操作系统**：无最低要求。

相关开发工具的版本：

| 工具                | 版本       |
| ----------------- | -------- |
| [[JDK]]           | 17       |
| [[IntelliJ IDEA]] | 2024.1.7 |

访问[官方下载](https://maven.apache.org/download.cgi)页面，下载最新（`3.3.9`）稳定免安装版本的 Maven。
![](https://img.xiaorang.fun/202502161731136.png)

> [!important]
> **确保已配置 [[JDK#^a4ee2f|JAVA_HOME]] 环境变量**。

下载的压缩包可解压至任意目录，如 `E:\devsoft\apache-maven-3.9.9`。解压后的软件目录如下图所示：
![](https://img.xiaorang.fun/202502161732291.png)
- `bin`：包含可执行文件（如 `mvn` 命令），用于构建和管理项目。
- `boot`：包含启动 Maven 时所需的核心库和类文件。
- `conf`：包含 Maven 的核心配置文件 `settings.xml`，可用于设定仓库地址和代理等。
- `lib`：包含 Maven 运行时所需的 Java 类库和工具。

## 配置

### 环境变量配置
