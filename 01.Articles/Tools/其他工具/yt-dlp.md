---
tags:
  - Tool
create_time: 2024-12-28T17:34:00
update_time: 2025/02/14 18:38
---

> [!quote]
> [yt-dlp/yt-dlp: A feature-rich command-line audio/video downloader](https://github.com/yt-dlp/yt-dlp)

**yt-dlp** 是一款开源的命令行工具，可以用于从各种视频和音频平台（如 YouTube、Bilibili、Vimeo、Facebook 等）下载视频、音频、字幕以及播放列表。它是 **youtube-dl** 的一个分支，提供了更高的性能和更多的功能。yt-dlp 支持更广泛的网站、格式、选项，并且修复了 youtube-dl 中的一些 bug。

主要特点如下所示：

1. **高效的视频下载**
    - **yt-dlp** 能够快速、稳定地从网站下载视频或音频。
    - 支持多种视频格式和音频格式的下载，并且支持自动选择最佳质量的下载。
2. **支持多个平台**
    - 支持 YouTube、Bilibili、Vimeo、Facebook、Twitter、Instagram、Twitch、SoundCloud 等多个平台。
3. **视频格式和质量选择**
    - 可以选择视频的格式、分辨率和质量，甚至是视频和音频流分开下载，然后使用 FFmpeg 合并。
    - 支持下载视频或音频流，并且可以指定输出的文件格式（例如 MP4、MP3、WebM 等）。
4. **播放列表和批量下载**
    - 支持从整个播放列表中下载视频，也支持批量下载多个视频链接。
5. **字幕下载**
    - 支持下载和嵌入字幕，或将字幕提取为独立的文件。
6. **自动化功能**
    - 可以通过脚本自动化下载任务，适合批量下载、定时下载等需求。
7. **更多高级功能**
    - 支持代理设置，下载速度限制，自动重试等。
    - 支持下载视频的不同部分（比如下载指定的时间段或单独的音频部分）。

## 下载

1. 访问 [yt-dlp GitHub Release 页面](https://github.com/yt-dlp/yt-dlp/releases)。
2. 在页面中，向下滚动找到 **"Assets"** 部分。
3. 以 Windows 系统为例，点击 **`yt-dlp.exe`** 文件链接进行下载。
  ![](https://cdn.jsdelivr.net/gh/xihuanxiaorang/img2/202412181055659.png)
4. 下载完成后，将 `yt-dlp.exe` 文件放到一个合适的位置，例如 `E:\yt-dlp`。

## 环境变量配置

1. 右键点击 **"此电脑"** 或 **"我的电脑"**，选择 **"属性"**。
2. 点击 **"高级系统设置"**，然后选择 **"环境变量"**。
3. 在 **系统变量** 中找到 **Path**，点击 **编辑**，然后 **新增** `yt-dlp.exe` 文件所在的路径，如：`E:\yt-dlp`。
4. 点击 **"确定"** 保存设置。

![](https://cdn.jsdelivr.net/gh/xihuanxiaorang/img2/202412182128444.png)

打开终端，输入以下命令：

```bash
yt-dlp --version
```

如果显示 yt-dlp 的版本信息，则说明配置成功。

## 基本用法

### 下载视频

只需提供视频的 URL，`yt-dlp` 即可开始下载：

```bash
yt-dlp <视频链接>
```

如下所示：
![](https://cdn.jsdelivr.net/gh/xihuanxiaorang/img2/202412182317055.png)

![](https://cdn.jsdelivr.net/gh/xihuanxiaorang/img2/202412182316871.png)

上图框出的部分大致意思是：在使用 `yt-dlp` 下载视频时，想要下载的高质量格式（如 4K 超清或 1080P 60 帧）可能需要你成为某个网站的 **付费会员**。为了验证你的身份并获取这些格式，你需要提供 **认证信息**，例如通过 cookies 模拟登录状态。

具体而言，`yt-dlp` 提示你使用 `--cookies-from-browser` 或 `--cookies` 参数来提供浏览器中的 cookies，确保 `yt-dlp` 能识别你的登录状态，从而允许你下载这些付费视频。

解决方案如下：

1. 使用 **`--cookies-from-browser`**：
   如果你使用的是支持的浏览器（如 Chrome 或 Firefox），可以通过 `yt-dlp` 提供的命令从浏览器直接获取 cookies。`yt-dlp` 会自动获取你当前浏览器中的登录 cookies。
   **步骤**：
   - 首先确保你已经登录到相关网站。
   - 然后使用以下命令从浏览器获取 cookies：

		```bash
		yt-dlp --cookies-from-browser chrome <视频链接>
		```

		或者，如果你使用的是 Firefox：

		```bash
		yt-dlp --cookies-from-browser firefox <视频链接>
		```

2. **手动提取 cookies**
   如果你使用的是其他浏览器，或不想使用 `--cookies-from-browser`，你可以借助浏览器插件 [Get cookies.txt LOCALLY](https://chromewebstore.google.com/detail/get-cookiestxt-locally/cclelndahbckbenkjhflpdbgdldlbecc) 导出浏览器所有 cookies 到一个 `cookies.txt` 文件，然后通过 ` --cookies ` 参数将其传递给 ` yt-dlp `。
   ![](https://cdn.jsdelivr.net/gh/xihuanxiaorang/img2/202412182248144.png)

	```bash
	yt-dlp --cookies "E:\yt-dlp\cookies.txt" <视频链接>
	```

通过上述步骤，成功提供 cookies 后，你可以顺利下载高质量的视频。下载完成后的显示效果如下：
![](https://cdn.jsdelivr.net/gh/xihuanxiaorang/img2/202412182311704.png)
![](https://cdn.jsdelivr.net/gh/xihuanxiaorang/img2/202412182312722.png)

### 选择视频格式和质量

你可以使用 `-f` 参数来指定下载的视频格式、质量或分辨率。例如，选择最佳的视频和音频质量：

```bash
yt-dlp -f bestvideo+bestaudio <视频链接>
```

在这个命令中，`-f bestvideo+bestaudio` 表示 `yt-dlp` 会自动选择并下载最佳质量的视频流和音频流，确保你获得最高画质和音质。

在下载视频之前，建议使用 `--list-formats` 参数来列出所有可用的格式，这样你可以查看可选的分辨率、编码和文件大小等信息。命令如下：

```bash
yt-dlp --list-formats <视频链接>
```

运行该命令后，`yt-dlp` 会列出该视频的所有可用格式，包括不同分辨率的视频流和音频流的详细信息。每个格式的输出中包括：

- **ID**：格式的唯一标识符。
- **EXT**：文件扩展名（如 `mp4`、`m4a`）。
- **RESOLUTION**：视频分辨率（如 `480x360`、`1080p`、`2880x2160`）。
- **FPS**：帧率（如 `29 fps`、`30 fps`、`59 fps`）。
- **FILESIZE**：文件大小。
- **VCODEC**：视频编码格式。
- **ACODEC**：音频编码格式。

![](https://cdn.jsdelivr.net/gh/xihuanxiaorang/img2/202412191826909.png)

- **下载 1080p 视频和最佳音频：**
  假设你使用 `--list-formats` 查看可用格式后，发现 1080p 分辨率的视频格式 ID 为 `30116`，最佳音频格式 ID 为 `30280`。你可以使用以下命令下载：

	```bash
	yt-dlp -f 30116+30280 <视频链接>
	```

	![](https://cdn.jsdelivr.net/gh/xihuanxiaorang/img2/202412192216153.png)

	在这个例子中：
	- `30116` 是 1080p 分辨率的视频格式，适用于需要下载 1080p 视频的情况。
	- `30280` 是最佳音频格式，通常选择 `m4a` 格式的音频流。
- **下载 4K 视频和最佳音频：**
  如果该视频提供 4K 分辨率的视频（例如 `2880x2160`），使用 `--list-formats` 查找到对应格式 ID 后，选择视频格式（如 `30120`）和音频格式（如 `30280`）：

	```bash
	yt-dlp -f 30120+30280 <视频链接>
	```

	![](https://cdn.jsdelivr.net/gh/xihuanxiaorang/img2/202412192228708.png)

### 下载音频

如果只需要下载音频（例如 MP3 格式），可以使用 `-x` 参数：

```bash
yt-dlp -x --audio-format mp3 https://www.youtube.com/watch?v=dQw4w9WgXcQ
```

- `-x`：仅提取音频。
- `--audio-format mp3`：将音频转换为 MP3 格式。

![](https://cdn.jsdelivr.net/gh/xihuanxiaorang/img2/202412192209110.png)

### 下载播放列表

`yt-dlp` 支持下载整个播放列表或合集，只需提供其 URL。例如，要下载 Bilibili 的一个合集，直接提供合集链接：

```bash
yt-dlp <视频链接>
```

在 Bilibili 中，视频合集的 URL 通常是包含多个视频的页面，运行此命令后，`yt-dlp` 会自动下载合集中的所有视频。
![](https://cdn.jsdelivr.net/gh/xihuanxiaorang/img2/202412192254244.png)

### 自定义输出文件名

使用 `-o` 参数可以自定义输出文件名格式。例如，以下命令将视频保存为标题加扩展名：

```bash
yt-dlp -o "%(title)s.%(ext)s" <视频链接>
```

你可以根据需要调整格式，常用的替代变量包括：

- `%(title)s`：视频标题
- `%(ext)s`：文件扩展名
- `%(id)s`：视频 ID
- `%(uploader)s`：上传者名字

例如，如果你想将视频文件按上传者和标题命名，可以使用：

```bash
yt-dlp -o "%(uploader)s - %(title)s.%(ext)s" <视频链接>
```

![](https://cdn.jsdelivr.net/gh/xihuanxiaorang/img2/202412192310083.png)
