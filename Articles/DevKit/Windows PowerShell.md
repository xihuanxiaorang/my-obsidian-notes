---
tags:
  - DevKit
create_time: 2025/03/22 22:15
update_time: 2025/07/13 13:08
---

## 更新

### 查看当前版本

以管理员身份运行 Windows PowerShell，执行以下命令：

```bash
$PSVersionTable.PSVersion
```

![](https://img.xiaorang.fun/202503222220647.png)

### 检索最新版本

执行以下命令检索可用版本（包括稳定版 & 预览版）：

```bash
winget search Microsoft.PowerShell
```

![](https://img.xiaorang.fun/202503222222964.png)

### 安装最新版本

运行以下命令安装最新版本 Windows PowerShell：

```bash
winget install --id Microsoft.Powershell --source winget
```

![](https://img.xiaorang.fun/202503222228683.png)

安装完成后，在终端中输入 `pwsh` 验证是否已更新到最新版本。
