---
tags:
  - Obsidian
create_time: 2025/04/11 18:27
update_time: 2025/08/08 22:13
---

Obsidian 插件能为应用添加新功能和优化工作流程，如任务管理、日历视图、数据可视化、模板自动化等。

- **内置插件**：Obsidian 自带，可在设置中启用或关闭。
- **社区插件**：第三方开发，提供更多个性化功能。

## 如何安装 Obsidian 插件？

### 启用社区插件

1. 打开 Obsidian，点击左下角齿轮图标进入【设置】界面。
2. 选择【第三方插件】选项卡，开启【安全模式】。（注意：开启后请谨慎安装插件，确保来源可信。）

### 安装流程

1. 在【第三方插件】界面点击【浏览】或【获取更多插件】进入插件库。
2. 浏览插件列表，搜索并选择需要的插件，点击【安装】。
3. 安装后，点击【启用】激活插件。

## 推荐插件

```dataview
TABLE file.ctime AS "创建时间", file.mtime AS "修改时间"
FROM #Obsidian/Plugin 
WHERE contains(file.path, this.file.folder) AND file.name != this.file.name
SORT priority ASC
```
