---
tags:
  - Frontend
  - Vue
create_time: 2024-12-29 19:03
update_time: 2025/01/03 11:52
---

## 应用实例✨

在 Vue 中，**每个应用实例都是通过 `createApp` 函数创建的**。以下是 [`createApp`](https://cn.vuejs.org/api/application.html#createapp) 函数的定义：

```ts
function createApp(rootComponent: Component, rootProps?: object): App
```

- 第一个参数：表示根组件。
- 第二个参数（可选）：用于传递给根组件的属性（[[props]]）。

用法：
1. **内联[[#根组件]]**
   可以直接在 `createApp` 函数中定义根组件：

	```js
	import { createApp } from 'vue'
	
	const app = createApp({
	  /* 根组件选项 */
	})
	```

2. **[[单文件组件]]（SFC）**
   如果使用的是单文件组件，可以直接导入组件文件作为根组件：

	```js hl:2
	import { createApp } from 'vue'
	import App from './App.vue'
	
	const app = createApp(App)
	```

## 根组件

传递给 `createApp` 函数的对象实际上是一个组件。**每个 Vue 应用都需要一个"根组件"，其他组件将作为其子组件存在**。

虽然简单示例可能只包含一个组件，但实际应用通常是由一个嵌套的、可重用的组件树组成的。例如，一个待办事项应用可能有以下组件结构：

```
App (root component)
├─ TodoList
│  └─ TodoItem
│     ├─ TodoDeleteButton
│     └─ TodoEditButton
└─ TodoFooter
   ├─ TodoClearButton
   └─ TodoStatistics
```

## 挂载应用✨

**创建的应用实例需要通过调用 `.mount()` 方法挂载到一个 DOM 容器上，页面内容才会被渲染**。以下是 [`.mount()`](https://cn.vuejs.org/api/application.html#app-mount) 方法的定义：

```ts
interface App {
  mount(rootContainer: Element | string): ComponentPublicInstance
}
```

该方法接收一个 "容器" 参数，该参数可以是：
- **CSS 选择器** (使用第一个匹配到的元素)

	```js hl:4
	import { createApp } from 'vue'
	const app = createApp(/* ... */)
	
	app.mount('#app')
	```

- **实际的 DOM 元素**

	```js
	app.mount(document.body.firstChild)
	```

> [!note]
> 1. 如果组件定义了[[模板]]或[[渲染函数]]，它将**替换容器内的所有现存 DOM 节点**。否则在运行时编译器可用的情况下，Vue 会使用容器的 `innerHTML` 作为模板。[[#^c7b9dd]]
> 2. **对于每个应用实例，`.mount()` 方法仅能调用一次**。
> 3. **`.mount()` 方法应该始终在整个应用配置和资源注册完成后才被调用**。[[#^995d22]] 同时请注意，不同于其他资源注册方法，它的**返回值是根组件实例**而非应用实例。

### DOM 中的根组件模板

根组件的模板通常包含在组件选项中，但也可以直接写在挂载容器中。例如：

```html hl:2
<div id="app">
  <button @click="count++">{{ count }}</button>
</div>
```

```js
import { createApp } from 'vue'

const app = createApp({
  data() {
    return {
      count: 0
    }
  }
})

app.mount('#app')
```

**当根组件没有设置 [`template`](https://cn.vuejs.org/api/options-rendering.html#template) 和  [`render`](https://cn.vuejs.org/api/options-rendering.html#render) 选项时，Vue 将自动使用容器的 `innerHTML` 作为模板**。 ^c7b9dd

适用场景：
- 无构建步骤的应用：DOM 内模板常用于简单的 Vue 应用，例如 [[01 - 通过 CDN 使用 Vue]] 的场景。
- 结合服务器端渲染（SSR）：根模板可能由服务器动态生成并传递给客户端，适合与服务端框架集成使用。

## 应用配置

应用实例会暴露一个 `.config` 对象允许我们配置一些应用级的选项，例如定义一个[应用级的错误处理器](https://cn.vuejs.org/api/application#app-config-errorhandler)，用来捕获所有子组件上的错误：

```js
app.config.errorHandler = (err) => {
  /* 处理错误 */
}
```

此处，还可以**通过 [`app.component`](https://cn.vuejs.org/api/application#app-component) 方法注册一个全局组件，使其在整个应用范围内可用**：

```js
app.component('TodoDeleteButton', TodoDeleteButton)
```

**确保在挂载应用实例之前完成所有应用配置**！ ^995d22

## 多个应用实例

应用实例并不只限于一个。**Vue 支持在同一个页面中创建多个应用实例，每个实例都有独立的作用域和配置**。例如：

```js
const app1 = createApp({
  /* ... */
})
app1.mount('#container-1')

const app2 = createApp({
  /* ... */
})
app2.mount('#container-2')
```

如果你正在使用 Vue 来增强服务端渲染 HTML，并且只想要 Vue 去控制一个大型页面中特殊的一小部分，应避免将一个单独的 Vue 应用实例挂载到整个页面上，而是应该创建多个小的应用实例，将它们分别挂载到所需的元素上去。
