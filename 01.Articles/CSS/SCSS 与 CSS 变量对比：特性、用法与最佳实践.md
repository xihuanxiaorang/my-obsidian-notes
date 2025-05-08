---
tags:
  - Frontend/CSS
create_time: 2025-05-08T13:22:00
update_time: 2025/05/08 13:26
---

## SCSS 变量（构建时变量）

### 特点

- 编译时生效，仅在构建阶段有效
- 不支持运行时动态修改
- 支持嵌套作用域、运算与函数调用

### 语法

```scss
$primary-color: #3498db;

.button {
  color: $primary-color;
}
```

### 使用方式

- 写在 `.scss` 文件中，使用 `$变量名`
- 编译后生成 `.css` 文件供浏览器使用

## CSS 变量（运行时变量）

#### 特点

- 浏览器原生支持，运行时生效
- 支持作用域继承（如作用于 `:root`、类名、元素）
- 可通过 JavaScript 动态修改
- 支持继承与覆盖，适合响应式与主题切换场景

#### 语法

```css
:root {
  --primary-color: #3498db;
}

.button {
  color: var(--primary-color);
}
```

#### 使用方式

- 定义：`--变量名: 值;`
- 使用：`var(--变量名)`

## 最佳实践

- **需要响应式、主题切换等运行时行为** → 使用 **CSS 变量**
- **结构复杂、依赖计算和逻辑的样式体系** → 使用 **SCSS 变量**
- **推荐混合使用**：用 SCSS 统一管理变量，再输出为 CSS 变量供运行时使用

```scss
$primary-color: #3498db;

:root {
  --primary-color: #{$primary-color};
}
```
