---
tags:
  - Java
  - DevKit
  - EnvironmentSetup
create_time: 2024/12/16 10:42
update_time: 2025/07/12 23:20
---

在实际开发中，常常需要在同一台机器上安装多个 JDK 版本（如 JDK 8、JDK 17），以适配不同项目的构建需求。本文将介绍一种简单高效的方式，帮助你安装多个 JDK 并通过环境变量实现灵活切换。

## 下载多个 JDK 版本

访问 Oracle 官网，下载所需的 JDK 绿色版（免安装压缩包）：

- [JDK8](https://www.oracle.com/java/technologies/downloads/#java8-windows)
- [JDK17](https://www.oracle.com/java/technologies/downloads/#java17-windows)

 ![](https://img.xiaorang.fun/202502251750522.png)

## 解压 JDK 至统一目录

将下载的 JDK 压缩包解压至指定路径，例如：

```text
E:\devsoft\jdks\jdk1.8.0_431
E:\devsoft\jdks\jdk-17.0.13
```

> [!tip]
> 可自定义路径，但建议统一放在同一父级目录下，便于管理与切换。

## 配置系统环境变量

打开系统环境变量配置界面：

1. 右键点击 "计算机" 或 "此电脑"，选择 "属性"。
2. 点击 "高级系统设置"。
3. 在弹出的 "系统属性" 窗口中，点击 "环境变量"。

新增以下系统变量：

| 变量名 | 变量值 | |
| ------------- | ------------------------------ | ------------------------------------------------- |
| `JAVA8_HOME` | `E:\devsoft\jdks\jdk1.8.0_431` | ![](https://img.xiaorang.fun/202502251750523.png) |
| `JAVA17_HOME` | `E:\devsoft\jdks\jdk-17.0.13` | ![](https://img.xiaorang.fun/202502251750524.png) |
| `JAVA_HOME` | `%JAVA8_HOME%`（指向 JDK8） | ![](https://img.xiaorang.fun/202502251750525.png) |

## 配置 Path 系统变量

1. 在 "系统变量" 中找到 Path 变量，点击 "编辑"。
2. 点击"新建"，添加 `%JAVA_HOME%\bin`，然后尽量将其 "上移"。
3. 最后一路点击 "确定" 进行保存配置。

## 验证当前 JDK 版本

打开新的终端窗口，执行以下命令查看当前激活的 JDK 版本：

```bash
java -version
javac -version
```

若输出为 JDK8 版本信息，则说明配置成功。

![](https://img.xiaorang.fun/202502251750526.png)

## 切换 JDK 版本

如需切换至 JDK 17，只需修改 `JAVA_HOME` 的值为 `%JAVA17_HOME%` 即可。保存后重新打开终端，再次执行 `java -version` 进行验证。

![](https://img.xiaorang.fun/202502251750527.png)

> [!note]
> 请根据实际下载的版本号及路径调整变量值，避免路径错误。

至此，你可以在一台电脑上轻松实现多版本 JDK 的共存与切换，以满足不同项目的开发需求。
