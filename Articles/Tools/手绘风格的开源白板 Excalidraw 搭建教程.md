---
tags:
  - Tool
create_time: 2024-12-28T17:32:00
update_time: 2025/03/13 19:04
---

> [!quote]
> [GitHub - excalidraw/excalidraw: Virtual whiteboard for sketching hand-drawn like diagrams](https://github.com/excalidraw/excalidraw)

![](https://img.xiaorang.fun/202502251708531.png)

## 本地部署

1. 使用 `git clone git@github.com:excalidraw/excalidraw.git` 命令下载项目源码
2. 使用 `yarn` 命令下载依赖，在此过程中可能会出现如下错误：node 版本不匹配！
    ![](https://img.xiaorang.fun/202502251708533.png)
    那么该如何解决呢？使用 `yarn config set ignore-engines true ` 命令忽略错误即可！再次运行 `yarn` 命令下载依赖，如下所示：![](https://img.xiaorang.fun/202502251708534.png)
3. 使用 `yarn start` 命令运行项目，如下所示：
    ![](https://img.xiaorang.fun/202502251708535.png)
    将会自动打开默认浏览器并访问 [http://127.0.0.1:3000/](http://127.0.0.1:3000/)，效果如下所示：
    ![](https://img.xiaorang.fun/202502251708536.png)

至此，Excalidraw 本地部署就圆满完成啦！🎉🎉🎉

## 添加字体

1. 下载字体[霞鹜文楷](https://github.com/lxgw/LxgwWenKai)，进入 [Release](https://github.com/lxgw/LxgwWenKai/releases) 界面下载对应版本的 TTF 格式文件，
   ![](https://img.xiaorang.fun/202502251708537.png)
2. 将刚才下载的霞鹜文楷字体 `LXGWWenKaiMono-Regular.ttf` 复制到 `public` 目录下：
   ![](https://img.xiaorang.fun/202502251708538.png)
3. 注册字体：
    1. 编辑 `public/font.css` 文件，添加如下代码片段

		```css
		@font-face {
		  font-family: "LXGWWenKai";
		  src: url("LXGWWenKaiMono-Regular.ttf");
		  font-display: swap;
		}
		```

       ![](https://img.xiaorang.fun/202502251708539.png)

    2. 编辑 `src/index-node.ts` 文件，添加如下代码片段

		```typescript
		registerFont("./public/LXGWWenKaiMono-Regular.ttf", { family: "LXGWWenKai" });
		```

       ![](https://img.xiaorang.fun/202502251708540.png)

4. 预加载字体资源，编辑 `index.html` 文件，在其中加入字体预加载代码，可以提高应用启动时的速度：

	```html
	<link
	      rel="preload"
	      href="/LXGWWenKaiMono-Regular.ttf"
	      as="font"
	      type="font/ttf"
	      crossorigin="anonymous"
	    />
	```

	![](https://img.xiaorang.fun/202502251708541.png)

5. 增加字体枚举，编辑 `src/constant.ts` 文件，在 `FONT_FAMILY` 常量中加入字体的枚举

	```typescript
	export const FONT_FAMILY = {
	  Virgil: 1,
	  Helvetica: 2,
	  Cascadia: 3,
	  LXGWWenKai: 4,
	};
	```

   ![](https://img.xiaorang.fun/202502251708542.png)

6. 添加字体切换按钮，编辑 `/src/actions/actionProperties.tsx` 文件，在 `PanelComponent` 的返回值数组中加入下列元素

	```tsx
	{
	    value: FONT_FAMILY.LXGWWenKai,
	    text: t("labels.handDrawn"),
	    icon: FreedrawIcon,
	},
	```

   ![](https://img.xiaorang.fun/202502251708543.png)

7. 使用 `npm run start` 命令重新启动应用
   ![](https://img.xiaorang.fun/202502251708544.png)
