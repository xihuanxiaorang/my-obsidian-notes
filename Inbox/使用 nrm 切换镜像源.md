---
tags:
  - 前端
  - 环境搭建
---
1. 首先，使用 `npm install nrm -g` 命令全局安装 nrm，安装完成之后，可以使用 `nrm -v` 命令查看是否安装成功，如下所示：
   ![img](https://cdn.jsdelivr.net/gh/xihuanxiaorang/img2/202412122346193.png)
2. 使用 `nrm ls` 命令查看所有支持的镜像源列表以及当前正在使用的镜像源，如下所示：
   ![img](https://cdn.jsdelivr.net/gh/xihuanxiaorang/img2/202412122346274.png)
3. 使用 `nrm use xxx`命令可以选择需要切换的镜像源，如切换到华为镜像源，切换成功后会提示 "The registry has been changed to 'xxx'"。 
   ![img](https://cdn.jsdelivr.net/gh/xihuanxiaorang/img2/202412122346571.png)
4. 使用 `nrm test` 命令可以测试镜像源速度。
   ![img](https://cdn.jsdelivr.net/gh/xihuanxiaorang/img2/202412122346975.png)