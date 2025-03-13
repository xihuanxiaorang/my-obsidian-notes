---
tags:
  - Frontend
  - EnvironmentSetup
create_time: 2024-12-28T17:22:00
update_time: 2025/03/13 22:06
---

 [nrm](https://github.com/Pana/nrm)（npm registry manager）是 npm 的镜像源管理工具，使用它可以快速切换 npm 镜像源。
1. 首先，使用 `npm install nrm -g` 命令全局安装 nrm，安装完成之后，可以使用 `nrm -v` 命令查看是否安装成功，如下所示：
   ![](https://img.xiaorang.fun/202502251759841.png)
2. 使用 `nrm ls` 命令查看所有支持的镜像源列表以及当前正在使用的镜像源，如下所示：
   ![](https://img.xiaorang.fun/202502251759842.png)
3. 使用 `nrm use xxx` 命令可以选择需要切换的镜像源，如切换到华为镜像源，切换成功后会提示 "The registry has been changed to 'xxx'"。
   ![](https://img.xiaorang.fun/202502251759843.png)
4. 使用 `nrm test` 命令可以测试镜像源速度。
   ![](https://img.xiaorang.fun/202502251759844.png)
