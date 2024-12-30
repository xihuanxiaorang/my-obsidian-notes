---
tags:
  - Tool
create_time: 2024-12-29 21:48
update_time: 2024/12/30 11:41
---

利用 Cloudflare R2 对象存储搭建一个稳定的免费图床，配合 [[Github + PicList 搭建个人图床#PicList|PicList]]，可以轻松实现图片的上传和管理。

## 注册并开通 Cloudflare R2 服务

首次使用 Cloudflare 服务时，即使是仅使用免费的对象存储服务 R2，也需要注册账号并绑定支付方式。具体操作步骤如下：

### 注册 Cloudflare 账号

访问 [Cloudflare 官网](https://www.cloudflare.com/)，点击 **Sign Up** 按钮，按照页面提示完成注册流程。

### 绑定支付方式

为了开启 Cloudflare R2 服务，必须绑定有效的支付方式。即使你计划使用的是免费的 Cloudflare 服务，这一步也是必不可少的。
具体操作步骤如下所示：

1. **选择支付方式：** 你可以选择使用信用卡或 [[PayPal]] 账户。
2. **输入账单邮寄地址：** 按照提示填写相关地址信息。
3. **添加 R2 订阅：** 完成支付信息填写后，点击页面中的 **"将 R2 订阅添加到我的账户"** 按钮，正式激活付费计划。

> [!note]
> 即便你使用的是免费服务，绑定支付方式仍是激活 Cloudflare 账户的必要条件。

![](https://cdn.jsdelivr.net/gh/xihuanxiaorang/img2/202412292141647.png)
