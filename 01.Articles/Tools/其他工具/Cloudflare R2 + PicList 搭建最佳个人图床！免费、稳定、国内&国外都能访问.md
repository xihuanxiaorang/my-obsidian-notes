---
tags:
  - Tool
create_time: 2024-12-29 21:48
update_time: 2025/02/14 18:35
---

在互联网内容创作的时代，拥有一个稳定、可靠、免费且支持全球访问的图床服务变得越来越重要。结合 **Cloudflare R2** 和 [[Github + PicList 搭建个人图床#PicList|PicList]]，您可以轻松搭建一个个人图床，享受 Cloudflare 提供的全球加速和 CDN 服务，同时使用 PicList 高效管理和上传图片。无论您在国内还是国外，都能获得快速且稳定的图片加载体验。

以下是详细步骤，帮助您通过 **Cloudflare R2** 配合 **PicList** 搭建个人图床。

### 注册 Cloudflare 账号

首先，您需要注册一个 Cloudflare 账号。如果已经有账号，跳过此步骤即可。

1. 访问 [Cloudflare 官网](https://www.cloudflare.com/)。
2. 点击右上角 **Sign Up** 按钮，填写注册信息并完成验证。

## Cloudflare R2 服务

### 绑定支付方式

尽管 R2 提供免费计划，但开通服务时仍需绑定支付方式。这样做是为了验证账户资格并防止滥用。

1. 选择信用卡或 [[PayPal]] 作为支付方式并完成绑定。
2. 填写账单邮寄地址。
3. 点击 **"将 R2 订阅添加到我的账户"** 按钮，完成付费计划激活。

![](https://cdn.jsdelivr.net/gh/xihuanxiaorang/img2/202412292141647.png)

> [!tip]
> R2 服务采用按需付费的模式，您只有在超出免费额度时才会产生费用。对于一般的个人用户来说，免费额度已足够日常使用。

### 创建存储桶（Bucket）

完成 R2 服务开通后，接下来您可以创建一个存储桶，用于存储您的图片资源。

1. 登录到 Cloudflare 控制面板。
2. 在左侧菜单中选择 **"R2"**，进入 R2 管理界面。
3. 点击 **"Create Bucket"**（创建存储桶），为图床选择一个唯一的存储桶名称（例如：`blog`）。
4. 选择 **自动** 存储区域，系统会自动为您选择最合适的区域。

#### 开启公共访问

1. 在存储桶设置页面，找到 `R2.dev` 子域配置项。
2. 点击 **"允许访问"**，根据提示输入 "allow" 完成配置。
3. 等待配置生效后，您的存储桶就可以通过公共 URL 访问。

![](https://cdn.jsdelivr.net/gh/xihuanxiaorang/img2/202412301759474.png)
![](https://cdn.jsdelivr.net/gh/xihuanxiaorang/img2/202412301802438.png)

#### 配置自定义域名（可选）

使用自定义域名来访问您的图床资源，不仅能够提升品牌形象，还能增强用户体验。配置过程如下：

1. 将域名托管至 Cloudflare
   - 按照[[如何将阿里云域名托管至 Cloudflare？]] 的步骤，将您的域名托管至 Cloudflare。
   - 确保您的域名已经成功添加到 **Cloudflare 控制台** 中，并显示为 **Active**。
2. 配置自定义域名指向 R2 存储桶
   - 进入 R2 存储桶的设置页面，点击 **"连接域"**，输入您的自定义域名，如 `img.xiaorang.fun`。
     ![](https://cdn.jsdelivr.net/gh/xihuanxiaorang/img2/202412302241051.png)
     ![](https://cdn.jsdelivr.net/gh/xihuanxiaorang/img2/202412311143718.png)
   - Cloudflare 将自动为您添加一条 **CNAME** 记录，指向您的 **R2 存储桶地址**。
     ![](https://cdn.jsdelivr.net/gh/xihuanxiaorang/img2/202412302242543.png)
   - 等待 DNS 配置生效，确保记录状态显示为 **Active（活动）**。
     ![](https://cdn.jsdelivr.net/gh/xihuanxiaorang/img2/202412311146044.png)
   - 验证自定义域名绑定是否成功。您可以访问存储桶中的任意图片 URL，例如 `https://img.xiaorang.fun/avatar.png`，查看是否可以正常加载。
     ![](https://cdn.jsdelivr.net/gh/xihuanxiaorang/img2/202412311147802.png)

#### 创建 API 令牌

在 **PicList** 配置 **Cloudflare R2 图床** 时，您需要生成 API 令牌，以便 **PicList** 有权限访问您的存储桶。具体步骤如下：

1. 登录到 **Cloudflare 控制面板**，并进入 **"R2"** 页面。
2. 点击 **"管理 R2 API 令牌"** ➡️ **"创建 API 令牌"**。
3. 在创建 API 令牌时，选择 **"管理员读写"** 权限。
   ![](https://cdn.jsdelivr.net/gh/xihuanxiaorang/img2/202412311150479.png)
4. 拷贝 **"访问密钥 ID"** 和 **"机密访问密钥"**，并妥善保存。它们分别对应 **PicList** 配置 **AWS S3 图床** 时的 **AccessKeyId** 和 **SecretAccessKey**。
   ![](https://cdn.jsdelivr.net/gh/xihuanxiaorang/img2/202412311057662.png)
5. 拷贝 **"S3 客户端使用管辖权地的终结点"**，该值对应 **PicList** 配置 **AWS S3 图床** 时的 **"自定义节点"**。
   ![](https://cdn.jsdelivr.net/gh/xihuanxiaorang/img2/202412311116838.png)

## PicList 图床配置

**PicList** 支持通过兼容 **S3** 协议的对象存储服务上传和管理图片，除了 **Cloudflare R2** 外，还支持 **Amazon S3**、**Backblaze B2** 等其他服务。

以下是 **Cloudflare R2 图床** 的配置示例，您可以参考下图设置您的 **PicList** 图床：
![](https://cdn.jsdelivr.net/gh/xihuanxiaorang/img2/202412311154226.png)
更多详细的配置项解释可以参考 [PicList 配置 AWS S3 图床的官方文档](https://piclist.cn/configure.html#%E5%86%85%E7%BD%AEaws-s3)。
