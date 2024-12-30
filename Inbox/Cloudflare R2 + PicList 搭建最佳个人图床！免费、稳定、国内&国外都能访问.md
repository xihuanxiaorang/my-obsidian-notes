---
tags:
  - Tool
  - Cloudflare
  - PicList
create_time: 2024-12-29 21:48
update_time: 2024/12/30 23:13
---

在互联网内容创作的时代，拥有一个稳定、可靠、免费且支持全球访问的图床服务至关重要。Cloudflare R2 与 PicList 的结合为您提供了一个理想的解决方案。R2 是 Cloudflare 提供的对象存储服务，而 [[Github + PicList 搭建个人图床#PicList|PicList]] 是一款强大的图床管理工具。通过两者配合，您可以轻松搭建一个免费的个人图床，无论在国内还是国外，都能享受快速稳定的访问体验。

以下是通过 Cloudflare R2 搭建个人图床的详细步骤。

### 注册 Cloudflare 账号

首先，您需要注册一个 Cloudflare 账号。如果已经有账号，跳过此步骤即可。

1. 访问 [Cloudflare 官网](https://www.cloudflare.com/)。
2. 点击右上角 **Sign Up** 按钮，填写注册信息并完成验证。

## Cloudflare R2 服务

### 绑定支付方式

尽管 R2 提供免费计划，但开通服务时仍需绑定支付方式。这是为了验证您的账户资格。

1. 选择信用卡或 [[PayPal]] 作为支付方式并完成绑定。
2. 填写账单邮寄地址。
3. 点击 **"将 R2 订阅添加到我的账户"** 按钮，完成付费计划激活。

![](https://cdn.jsdelivr.net/gh/xihuanxiaorang/img2/202412292141647.png)

> [!note]
> R2 服务采用按需付费的模式，您只有在超出免费额度时才会产生费用。对于一般的个人用户来说，免费额度已足够日常使用。

### 创建存储桶（Bucket）

完成 R2 服务开通后，接下来您可以创建一个存储桶，用于存储您的图片资源。

1. 登录到 Cloudflare 控制面板。
2. 在左侧菜单中选择 **"R2"**。
3. 点击 **"Create Bucket"**（创建存储桶），为您的图床填写一个唯一的存储桶名称（例如：`blog`）。
4. 选择存储区域（推荐使用**自动**区域）。

#### 开启公共访问

1. 在存储桶设置页面，找到 `R2.dev` 子域配置项。
2. 点击**允许访问**，根据提示输入 "allow"，等待配置生效。

![](https://cdn.jsdelivr.net/gh/xihuanxiaorang/img2/202412301759474.png)
![](https://cdn.jsdelivr.net/gh/xihuanxiaorang/img2/202412301802438.png)

完成后，存储桶即可通过公共 URL 访问。

#### 配置自定义域名

为 Cloudflare R2 创建自定义域名可以让您的图片地址更加个性化，也方便管理，提升品牌形象，同时提高访问速度。

1. 确保域名已托管到 Cloudflare
   按照 [[Cloudflare 托管阿里云域名]] 的步骤，将域名托管至 Cloudflare。
2. 添加自定义域名
   进入 R2 存储桶的设置页面，点击 **"连接域"**，输入您的自定义域名，如 `xiaorang.fun`。
   ![](https://cdn.jsdelivr.net/gh/xihuanxiaorang/img2/202412302241051.png)
3. 确认 DNS 设置
   Cloudflare 将自动添加一条 CNAME 记录，目标指向 R2 的存储地址。确认并保存配置。
   ![](https://cdn.jsdelivr.net/gh/xihuanxiaorang/img2/202412302242543.png)
4. 等待 DNS 生效
   等待域名状态变为 **Active（活动）**。
   ![](https://cdn.jsdelivr.net/gh/xihuanxiaorang/img2/202412302245268.png)
5. 验证域名绑定
   访问存储桶中的任意图片，确认可通过自定义域名直接访问，如 `https://xiaorang.fun/avatar.png`。
   ![](https://cdn.jsdelivr.net/gh/xihuanxiaorang/img2/202412302250442.png)
