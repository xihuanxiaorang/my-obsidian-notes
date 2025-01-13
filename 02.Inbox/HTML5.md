---
media: https://www.bilibili.com/video/BV1p84y1P7Z5?p=7&vd_source=84272a2d7f72158b38778819be5bc6ad
Creator: 尚硅谷
tags:
  - Tutorial
  - HTML
create_time: 2025-01-10 18:31
update_time: 2025/01/13 17:57
---

## 什么是 HTML?

**超文本标记语言**（HTML，<font color="#d83931">H</font>yper<font color="#d83931">T</font>ext <font color="#d83931">M</font>arkup <font color="#d83931">L</font>anguage）是一种用于构建网页和 Web 应用的标记语言。它通过标签（如 `<h1>`、`<p>`、`<a>`）定义网页的结构和内容。HTML 由一系列元素组成，描述文本、图像、链接和多媒体内容，并告诉浏览器如何呈现这些内容。

- **超文本**：超越普通文本，包含链接、图片、视频等多媒体内容。
- **标记**：用特定符号或标签定义内容的结构和表现形式。

## 准备工作

- **工具**：[[VSCode]]（代码编辑器）。
- **浏览器**：[Chrome 浏览器](https://www.google.com/intl/zh-CN/chrome/)（需科学上网工具🪜访问）。

## HTML 入门

### HTML 初体验

1. 创建项目：新建一个文件夹，命名为 `html-study`，并使用 VSCode 打开。
2. 创建文件：在文件夹中创建一个新文件，命名为 `index.html`。
3. 编写代码：在文件中输入以下代码并保存

	```html
	<!DOCTYPE html>
	<html>
	  <head>
	    <title>我的第一个网页</title>
	  </head>
	  <body>
	    <h1>欢迎来到 HTML 世界！</h1>
	    <p>这是我的第一个网页。</p>
	    <a href="https://www.baidu.com">百度一下</a>
	  </body>
	</html>
	```

4. 使用 [[VSCode#Live Server]] 插件运行，右键 `index.html` 文件选择 "**Open with Live Server**"，在浏览器中查看效果。

### HTML 标签

1. 标签（又称元素）是 HTML 的基本构成单元，用于定义网页的结构和内容。
2. 标签分类：
   - **双标签**：包含起始标签和结束标签
     ![[HTML 双标签.excalidraw]]
     例如：

		```html
		<p>这是段落文本</p>
		```

   - **单标签**：没有结束标签，直接闭合
     ![[HTML 单标签.excalidraw]]
     例如,

		```html
		<img src="image.jpg" alt="示例图片" />
		```

3. 标签名不区分大小写（`<p>` 与 `<P>` 均可识别），但**推荐使用小写**，因为符合 HTML 规范，便于阅读和维护。
4. 标签之间的关系：
   - **父子关系**（嵌套）：子标签位于父标签内部，例如：

		```html
		<div>
		    <p>段落文本</p>
		</div>
		```

   - **兄弟关系**（并列）：同级标签平级书写，例如：

		```html
		<h1>标题 1</h1>
		<h2>标题 2</h2>
		```

   - **格式规范**：
     - 父子关系：子标签需换行并缩进（使用 Tab 键）。
     - 兄弟关系：同级标签换行且保持对齐。

> [!tip]
> 大部分 HTML 标签是双标签，如 `<div>` 和 `<a>`；单标签则包括 `<br>` 和 `<img>` 等。

### HTML 标签属性

HTML 标签属性为标签提供额外信息，通常写在起始标签或单标签内，以**键值对**的形式存在。基本格式如下：
![[HTML 标签属性.excalidraw]]
例如：

```html
<marquee loop="1" bgcolor="orange">学习技术，从零到一，步步为赢！</marquee>
<input type="password" placeholder="请输入您的密码">
```

有些特殊属性没有属性值，直接写属性名即可，例如：

```html
<input disabled>
```

> [!note]
> 1. 标签与属性匹配
>    - 每个标签支持的属性不同（部分属性为特定标签专用）。
>    - 也有一些**全局属性**，可以适用于所有标签（后续会详细介绍）。
> 2. 属性规范
>    - **名称和值**：不区分大小写，推荐使用小写。
>    - **引号使用**：属性值建议用双引号包裹（也支持单引号或省略引号）。
> 3. 避免冲突
>    - 标签中不要重复定义相同的属性，否则只有第一个定义的属性会生效，后面的属性会被忽略。例如：
>      ```html
>      <input type="text" type="password">
>      <!-- 最终只有 type="text" 生效，type="password" 被忽略 -->
>      ```

### HTML 基本结构
