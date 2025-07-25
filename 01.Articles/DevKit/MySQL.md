---
tags:
  - DevKit
  - SQL/MySQL
  - EnvironmentSetup
create_time: 2024/12/16 10:48
update_time: 2025/07/12 23:43
---

## 下载 & 安装

> [!info]
> 安装 MySQL 之前，确保电脑上原来安装的 MySQL 已经彻底卸载干净（包括应用、数据、注册表和系统环境变量等信息，如果是第一次安装的话，则可以不用管）！可以使用原生的 MySQL Installer 或者第三方卸载工具（如：[[软件卸载工具#^6ce691|HiBit Uninstaller]]）进行卸载。

访问 [MySQL Community Downloads](https://dev.mysql.com/downloads/installer/) 下载页面，选择版本，如 `8.0.40` 。
![](https://img.xiaorang.fun/202502251753627.png)

安装过程非常简单，如下所示：

1. 双击运行下载的安装程序
2. 选择 Custom 安装类型，可以自定义 MySQL 的安装路径
 ![](https://img.xiaorang.fun/202502251753628.png)
3. 选择安装 MySQL Server 和 MySQL Workbench 两款产品
 ![](https://img.xiaorang.fun/202502251753629.png)
 首先分别点击右侧准备安装的产品，然后再分别点击下方的 Advanced Options 高级选项，可以分别选择每款产品各自的安装路径。
 ![](https://img.xiaorang.fun/202503162240237.png)
 ![](https://img.xiaorang.fun/202503162240238.png)
4. 然后一直点击 Next 即可
5. 在设置密码阶段可以根据实际情况进行设置，如果是自己学习所用的话可以配置一个简单点的密码，如 `123456`

## 环境变量配置

打开 CMD 命令行窗口，输入 mysql 命令，提示 "'mysql' 不是内部或外部命令，也不是可运行的程序或批处理文件"。
![](https://img.xiaorang.fun/202502251753630.png)

上面的提示就是告诉我们应该去配置 MySQL 的环境变量。

1. 右键点击 "计算机" 或 "此电脑"，选择 "属性"。
2. 点击 "高级系统设置"。
3. 在弹出的 "系统属性" 窗口中，点击 "环境变量"。
4. 在 "系统变量" 区域，点击 "新建"。
   1. 新建 <u>MYSQL_HOME</u> 系统变量，变量值为 MySQL Server 的安装路径，如 `E:\devsoft\MySQL\MySQL Server 8.0` （默认的安装路径为 `C:\Program Files\MySQL\MySQL Server 8.0` ）。
5. 6. Path 系统变量。
   1. 在 "系统变量" 中找到 Path 变量，点击 "编辑"。
   2. 点击 "新建"，添加 `%MYSQL_HOME%\bin` ，然后尽量将其 "上移"。
   3. 最后一路点击 "确定" 进行保存配置。

重新打开 CMD 命令行窗口，输入 `mysql -uroot -p123456` 命令连接 MySQL 服务器。由上图可以反映出，MySQL 环境变量已经配置成功。
![](https://img.xiaorang.fun/202502251753632.png)

至此，MySQL 已经成功安装，现在可以愉快地删库跑路啦~🌸🌸🌸

## 设置

### 开启日志功能

修改 `my.ini` 配置文件（位于 MySQL 安装目录，如 `E:\devsoft\MySQL\MySQL Server 8.0`）：

```ini hl:3
# 开启普通查询日志（General Log）
log-output=FILE  # 将日志输出到文件  
general-log=1    # 启用普通查询日志  
general_log_file="XIAORANG.log"  # 指定日志文件名  

# 开启慢查询日志（Slow Query Log）
slow-query-log=1  # 启用慢查询日志  
slow_query_log_file="XIAORANG-slow.log"  # 指定慢查询日志文件名  
long_query_time=10  # 记录执行时间超过 10 秒的 SQL  

# 错误日志（Error Log）
log-error="XIAORANG.err"  # 指定错误日志文件  
```

重启 MySQL 服务使配置生效！

```sh
# Windows（管理员 CMD 执行）
net stop MySQL80
net start MySQL80

# Linux / macOS
sudo systemctl restart MySQL80
```
