---
tags:
  - DevKit
create_time: 2024-12-30 21:38
update_time: 2025/03/24 22:09
---

## 如何将阿里云域名托管至 Cloudflare？

将域名托管到 **Cloudflare**，可享受更优的 **DNS 管理、性能优化和安全防护**。

### 添加域名到 Cloudflare

- 登录 **Cloudflare** 控制台，点击 **"添加域"**。
- 输入你的域名，点击 **"继续"**。

![](https://img.xiaorang.fun/202502251703745.png)

### 选择托管计划

选择合适的 **托管计划**，推荐 **免费计划**。
![](https://img.xiaorang.fun/202502251703746.png)

### 获取 Cloudflare DNS 服务器

Cloudflare 提供 **两个 Nameservers（名称服务器）**，复制备用。
![](https://img.xiaorang.fun/202502251703747.png) ^7abc71

### 修改阿里云 DNS 设置

#### 阿里云域名管理

登录 **阿里云** 控制台，进入 **"域名管理"**。
![](https://img.xiaorang.fun/202502251703748.png)

#### 选择目标域名

找到 **需要托管到 Cloudflare** 的域名，进入 **详细设置**。
![](https://img.xiaorang.fun/202502251703749.png)

#### 修改 DNS 服务器

进入 **DNS 服务器设置**，替换为 [[#^7abc71|Cloudflare 提供的 Nameservers]]。
![](https://img.xiaorang.fun/202502251703750.png)

### 确认 Cloudflare 配置状态

- 返回 **Cloudflare 控制台**，等待 DNS 解析生效（**可能需几小时至 48 小时**）。
- 当状态显示 **"活动"（Active）**，即表示迁移成功。

![](https://img.xiaorang.fun/202502251703751.png)

> [!note]
> - **检查 DNS 记录**：修改 DNS 服务器前，确保 **Cloudflare** 已配置好 **A 记录、CNAME、MX 记录等**，避免网站无法访问。
> - **生效时间**：DNS 更新通常在 **几小时内完成**，最晚可能 **48 小时**，期间可能会有 **短暂服务中断**，请提前规划。

完成以上步骤后，你的 **阿里云域名** 已成功托管至 **Cloudflare**，享受 **更稳定的解析与加速服务** 🚀。

## 如何设置 Cloudflare 页面规则（Page Rules）？

示例：将 `www.xiaorang.fun` 和 `https://xiaorang.fun` 重定向至 `https://docs.xiaorang.fun`**

### 确保已有 DNS 记录

![](https://img.xiaorang.fun/202503232137809.png)

### 配置页面规则

点击 "规则" → "页面规则" → "创建页面规则"。

#### 规则一：重定向 `www.xiaorang.fun`

##### 编辑页面规则

![](https://img.xiaorang.fun/202503232137811.png)
- **路径匹配：** `www.xiaorang.fun/*`
- **操作类型：** `转发 URL（Forwarding URL）`
- **状态码：** `301 - 永久重定向`

##### 创建 DNS 记录

![](https://img.xiaorang.fun/202503232137812.png)

#### 规则二：重定向 `xiaorang.fun`

##### 编辑页面规则

![](https://img.xiaorang.fun/202503232157717.png)
- **路径匹配：** `https://xiaorang.fun/*`
- **操作类型：** `转发 URL（Forwarding URL）`
- **状态码：** `301 - 永久重定向`
- **目标 URL：** `https://docs.xiaorang.fun/$1`

##### 创建 DNS 记录

![](https://img.xiaorang.fun/202503232157718.png)

### 效果验证

所有访问 `www.xiaorang.fun` 和 `xiaorang.fun` 的请求都会自动重定向至 `docs.xiaorang.fun`，确保访问一致性。🚀🚀🚀
