---
tags:
  - Cloudflare
  - 阿里云
create_time: 2024-12-30 21:38
update_time: 2025/03/13 19:04
---

通过将域名托管到 Cloudflare，可以享受更好的 DNS 管理、性能优化和安全性。以下是详细步骤：

1. **添加域名到 Cloudflare**
   - 登录 Cloudflare 账户，点击 **"添加域"** 按钮。
   - 输入你的域名，点击 **"继续"**。

   ![](https://img.xiaorang.fun/202502251703745.png)
2. **选择托管计划**
   - 选择适合你的托管计划，**免费计划**适用于大多数用户。

   ![](https://img.xiaorang.fun/202502251703746.png)
3. **获取名称服务器信息**
   - Cloudflare 会提供两个名称服务器（Nameservers）。
   - 复制这些名称服务器以便稍后替换阿里云的默认 DNS。

   ![](https://img.xiaorang.fun/202502251703747.png)
4. **域名管理**
   - 在阿里云控制台首页，点击 **"域名"** 进入域名管理页面。

   ![](https://img.xiaorang.fun/202502251703748.png)
5. **选择要托管的域名**
   - 在域名管理页面，点击目标域名并进入详细设置页面。

   ![](https://img.xiaorang.fun/202502251703749.png)
6. **修改 DNS 服务器**
   - 进入 **DNS 服务器设置**，将 Cloudflare 提供的名称服务器粘贴到相应位置，替换原有的阿里云 DNS 服务器。

   ![](https://img.xiaorang.fun/202502251703750.png)
7. **确认 Cloudflare 配置状态**
   - 返回 Cloudflare 控制面板，等待 DNS 更新生效（可能需要几小时到 48 小时）。
   - 状态更新为 **"活动"（Active）** 时，域名托管到 Cloudflare 的设置即完成。

   ![](https://img.xiaorang.fun/202502251703751.png)

> [!note]
> 1. **检查 DNS 记录：**
> 在更改 DNS 服务器前，确保 Cloudflare 中已经正确配置了所有必要的 DNS 记录（如 A、CNAME、MX 等），避免服务中断。
> 2. **DNS 更新生效时间：**
> 全球 DNS 更新可能需要几个小时到 48 小时，请耐心等待，并提前通知相关人员可能的短暂服务中断。

通过以上步骤，你已成功将阿里云域名托管到 Cloudflare，并开启了更稳定的 DNS 服务与加速功能。
