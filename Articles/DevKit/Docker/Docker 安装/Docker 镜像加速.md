---
tags:
  - DevKit/Docker
create_time: 2025/07/12 22:40
update_time: 2025/07/12 22:45
priority: 3
---

> [!info]
> 2025.07 亲测有效

## Ubuntu

```bash hl:8-9
# 创建配置目录（如果不存在）
sudo mkdir -p /etc/docker

# 写入镜像加速配置文件（可根据需要替换为你自己的镜像地址）
sudo tee /etc/docker/daemon.json > /dev/null <<EOF
{
  "registry-mirrors": [
    "https://docker.1ms.run",
    "https://docker.xuanyuan.me"
  ]
}
EOF

# 重载并重启 Docker 服务使配置生效
sudo systemctl daemon-reload
sudo systemctl restart docker
```

## Windows Desktop

1. 依次进入："设置" → "Docker 引擎"
2. 添加 `registry-mirrors` 字段：

	```json hl:10-11
	{
	  "builder": {
	    "gc": {
	      "defaultKeepStorage": "20GB",
	      "enabled": true
	    }
	  },
	  "experimental": false,
	  "registry-mirrors": [
	    "https://docker.1ms.run",
	    "https://docker.xuanyuan.me"
	  ]
	}
	```

	![](https://img.xiaorang.fun/202507062240015.png)

3. 点击 **Apply & Restart** 应用更改并重启 Docker。
