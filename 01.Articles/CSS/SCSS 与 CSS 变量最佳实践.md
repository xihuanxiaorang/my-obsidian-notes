---
tags:
  - Frontend/CSS
update_time: 2025/05/17 13:20
create_time: 2025-05-17T13:15:00
---

## SCSS 变量（构建时变量）

### 特点

- 编译时生效，仅在构建阶段可用
- 不支持运行时动态更新
- 支持嵌套作用域、运算和函数调用，适合复杂样式逻辑

### 示例

```scss
$primary-color: #3498db;

.button {
  color: $primary-color;
}
```

### 用法

- 定义于 `.scss` 文件中，使用 `$变量名`
- 编译生成的 `.css` 文件供浏览器加载，变量值已被替换为具体值

## CSS 变量（运行时变量）

### 特点

- 浏览器原生支持，运行时生效
- 支持作用域继承（如定义在 `:root`、类或元素上）
- 可通过 JavaScript 动态修改
- 适用于主题切换、响应式样式等动态场景

### 示例

```css
:root {
  --primary-color: #3498db;
}

.button {
  color: var(--primary-color);
}
```

### 用法

- 定义变量：`--变量名: 值;`
- 引用变量：`var(--变量名)`

## 最佳实践

- **涉及主题切换、暗黑模式等运行时样式变更** → 推荐使用 **CSS 变量**
- **需要逻辑计算、结构复杂的样式系统** → 适合使用 **SCSS 变量**
- **推荐组合使用**：通过 SCSS 管理变量逻辑，再输出为 CSS 变量供运行时调用

```scss
$primary-color: #3498db;

:root {
  --primary-color: #{$primary-color};
}
```
