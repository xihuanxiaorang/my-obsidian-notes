---
tags:
  - Frontend/CSS
create_time: 2025-05-17T13:22:00
update_time: 2025/05/17 13:28
---

## `@import`（旧语法）

### 特点

- 直接引入 SCSS 文件，**所有变量、函数和混入全局可见**
- 易导致命名冲突和全局命名空间污染
- 支持重复引入，可能造成重复编译
- 官方已不推荐，未来可能移除

### 示例

```scss file:variables.scss
$primary-color: blue;
```

```scss file:main.scss
@import 'variables';

body {
  color: $primary-color; // 可直接使用
}
```

## `@use`（推荐语法）

### 特点

- 默认启用命名空间，需通过前缀访问（如 `variables.$primary-color`）
- 同一模块只会加载一次，避免重复编译
- 支持私有变量（以 `_` 开头不会导出）
- 更符合模块化理念，利于维护与复用

### 示例

```scss file:main.scss
@use 'variables';

body {
  color: variables.$primary-color;
}
```

取消命名空间前缀：

```scss file:main.scss hl:1
@use 'variables' as *;

body {
  color: $primary-color;
}
```
