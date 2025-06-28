---
tags:
  - Java
  - DevKit
  - EnvironmentSetup
create_time: 2024-12-28T17:27:00
update_time: 2025/06/28 23:28
---

因为在工作中可能会遇到不同的项目需要使用不同版本的 JDK，所以需要在一台电脑上安装多个版本的 JDK，如 JDK8，JDK17 等。按照下面这种方式我们可以实现安装两个或者更多版本的 JDK，并且多个版本之间的 JDK 可以自由切换。

1. 访问 Oracle 的 JDK [下载](https://www.oracle.com/cn/java/technologies/downloads/) 页面，以 [JDK8](https://www.oracle.com/java/technologies/downloads/#java8-windows) 和 [JDK17](https://www.oracle.com/java/technologies/downloads/#java17-windows) 为例，选择绿色免安装版本（主要是为了后面配置环境变量时方便）。
    ![](https://img.xiaorang.fun/202502251750522.png)
2. 将下载的 `jdk-8u431-windows-x64.zip` 和 `jdk-17.0.13_windows-x64_bin.zip` 压缩包分别解压到指定目录，如 `E:\devsoft\jdks`。
3. 设置 JAVA_HOME 环境变量。 ^a4ee2f
4. 1. 右键点击 "计算机" 或 "此电脑"，选择 "属性"。
5. 2. 点击 "高级系统设置"。
6. 3. 在弹出的 "系统属性" 窗口中，点击 "环境变量"。
7. 4. 在 "系统变量" 区域，点击 "新建"。
       1. 新建 <u>JAVA8_HOME</u> 系统变量，变量值为 JDK8 的安装路径，如上图中的 `E:\devsoft\jdks\jdk1.8.0_431`。
          ![](https://img.xiaorang.fun/202502251750523.png)
       2. 新建 <u>JAVA17_HOME</u> 系统变量，变量值为 JDK17 的安装路径，如上图中的 `E:\devsoft\jdks\jdk-17.0.13`。
          ![](https://img.xiaorang.fun/202502251750524.png)
       3. 新建 <u>JAVA_HOME</u> 系统变量，变量值为 `%JAVA8_HOME%`，表示引用 JAVA8_HOME 系统变量所对应的 JDK8 安装路径，将当前系统的 JDK 版本设置为 1.8。
          ![](https://img.xiaorang.fun/202502251750525.png)
       4. 配置 Path 系统变量。
          1. 在 "系统变量" 中找到 Path 变量，点击 "编辑"。
          2. 点击 "新建"，添加 `<u>%JAVA_HOME%\bin</u>`，然后尽量将其 "上移"。
          3. 最后一路点击 "确定" 进行保存配置。
          4. 验证配置。
             1. （重新）打开终端，输入 `java -version` 和 `javac -version` 命令来验证当前激活的 JDK 版本。
                ![](https://img.xiaorang.fun/202502251750526.png)
             2. 如果将 JAVA_HOME 系统变量的值改为 `%JAVA17_HOME%` 的话，则表示引用 JAVA17_HOME 系统变量所对应的 JDK17 安装路径，可以非常方便快捷地实现将当前系统的 JDK 版本切换到 17。
                ![](https://img.xiaorang.fun/202502251750527.png)

> [!note]
> 具体的 JDK 安装路径和版本可能会有所不同，所以请根据实际情况调整上述步骤中的路径和版本号。

至此，你可以很方便地在一台电脑上配置和切换多个 JDK 版本，以满足不同项目的需求。
