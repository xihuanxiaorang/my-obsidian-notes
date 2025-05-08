---
tags:
  - Frontend/CSS
create_time: 2025-05-08T13:33:00
update_time: 2025/05/08 13:36
---

## `@import`（旧语法）

### 特点

- 直接引入 SCSS 文件，**所有变量、函数、混入全局可见**
- **易引发命名冲突，污染全局命名空间**
- 可重复引入同一文件，可能导致重复编译
- Sass 官方已不推荐使用

### 示例

```scss
// _variables.scss
$primary-color: blue;

// main.scss
@import 'variables';

body {
  color: $primary-color; // 可直接使用
}
```

## `@use`（推荐语法）

### 特点

- 默认有命名空间，需加前缀访问变量（如 `variables.$primary-color`）
- 同一文件只会被引入一次，避免重复编译
- 支持私有变量（变量名前加 `_` 不会被导出）
- 更符合模块化设计，利于维护与复用

### 示例

```scss
@use 'variables';

body {
  color: variables.$primary-color;
}
```

取消命名空间前缀：

```scss
@use 'variables' as *;

body {
  color: $primary-color;
}
```
