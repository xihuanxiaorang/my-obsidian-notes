---
tags:
  - Tool
  - DevKit/内网穿透工具
update_time: 2025/06/28 23:42
create_time: 2025-06-28T23:38:00
priority: 999
---

> [!quote]
> [NATAPP-内网穿透 基于ngrok的国内高速内网映射工具](https://natapp.cn/)

1. 注册并登陆账号，开通一个免费隧道（每次启动域名会发生变化）
2. 填写配置信息，修改你需要映射到本地的哪个端口
3. 在我的隧道列表中可以查看刚才开通的隧道
4. 下载[客户端](https://cdn.natapp.cn/assets/downloads/clients/2_3_9/natapp_windows_amd64_2_3_9.zip?version=20230407) &解压
5. 启动客户端，需要先下载一份配置文件[使用本地配置文件config.ini](https://natapp.cn/article/config_ini)，将该文件放置于 natapp 同级目录，修改配置文件中的 authtoken 为刚才开通隧道中的 authtoken
