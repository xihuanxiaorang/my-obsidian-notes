---
tags:
  - Tool
create_time: 2024-12-28T17:33:00
update_time: 2025/03/13 19:05
---

> [!quote]
> [FFmpeg](https://ffmpeg.org/)

**FFmpeg** 是一款非常强大的多媒体处理工具，它几乎支持所有视频、音频格式的转换、编辑和压缩，广泛应用于视频制作、流媒体处理、媒体播放器等领域。虽然 FFmpeg 的命令行界面可能对新手有些复杂，但它强大的功能和广泛的支持使得它成为多媒体处理领域的标配工具。如果你经常需要处理视频文件，FFmpeg 无疑是一个不可或缺的工具。

主要功能如下所示：

- 格式转换：将视频从一种格式转换为另一种格式。
- 视频编辑：裁剪、合并、加水印等。
- 流媒体：推流、拉流等。
- 视频压缩：减小视频文件的大小。
- 提取音频：从视频中提取音频文件。

## 下载 & 安装

1. 访问 FFmpeg [下载](https://ffmpeg.org/download.html) 页面。
2. 选择 Windows 版本：在页面中，选择 **"Windows builds from gyan.dev"** 作为下载源。点击进入该链接，访问由 `gyan.dev` 提供的 FFmpeg Windows 构建包页面。
   ![](https://img.xiaorang.fun/202502251723778.png)
3. 选择正式发行版本：在 `gyan.dev` 页面中，选择 **"release builds"** 下的正式发行版本 **`ffmpeg-release-full.7z`**。该版本包含 FFmpeg 的所有功能，适合大部分用户。
   ![](https://img.xiaorang.fun/202502251723779.png)
4. 点击下载 **`ffmpeg-release-full.7z`** 压缩包，该压缩包包含 FFmpeg 的所有可执行文件和库文件。
5. 使用解压工具（如 7-Zip）将 **`ffmpeg-release-full.7z`** 解压到指定文件夹，例如 `E:\ffmpeg`。

## 环境变量配置

为了在命令行中方便使用 FFmpeg，你需要将 FFmpeg 的 `bin` 目录添加到系统的环境变量中。

按以下步骤操作：

- 找到解压后 FFmpeg 文件夹中的 `bin` 目录，如：`E:\ffmpeg\bin`。
- 右键点击 **"此电脑"** 或 **"我的电脑"**，选择 **"属性"**。
- 点击 **"高级系统设置"**，然后选择 **"环境变量"**。
- 在 **系统变量** 中找到 **Path**，点击 **编辑**，然后 **新增** 你解压后的 `bin` 文件夹路径。
- 点击 **确定** 保存设置。

![](https://img.xiaorang.fun/202502251723780.png)

打开终端，输入以下命令验证 FFmpeg 是否成功安装：

```bash
ffmpeg -version
```

如果一切正常，你应该能够看到 FFmpeg 的版本信息。
![](https://img.xiaorang.fun/202502251723781.png)
