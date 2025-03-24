---
tags:
  - Frontend
  - JavaScript
create_time: 2024-12-28T17:59:00
update_time: 2025/03/23 22:17
---

## 简介

`reduce()` 方法对数组中的每个元素按序执行一个提供的 **reducer** 函数，每一次运行 **reducer** 会将先前元素的计算结果作为参数传入，最后将其结果汇总为单个返回值。

> [!quote]
[Array.prototype.reduce() - JavaScript | MDN (mozilla.org)](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce)

```javascript
arr.reduce(callbackFn(accumulator, currentValue[, currentIndex[, array]])[, initialValue])
```

参数：
- `callbackFn`：为数组中每个元素执行的函数。其返回值将作为下一次调用 `callbackFn` 函数时的 `accumulator` 参数。对于最后一次调用，返回值将作为整个 `reduce()` 方法的返回值。该函数被调用时将传入以下参数：
- `accumulator`：累加器，存储上一次调用 `callbackFn` 函数计算的结果。在第一次调用 `callbackFn()` 函数时，如果指定了 `initialValue` 参数的话，则 `accumulator` 为指定的初始值，否则的话为数组第一个元素 `array[0]` 的值；
- `currentValue`：当前元素的值。在第一次调用 `callbackFn()` 函数时，如果指定了 `initialValue` 参数的话，则 `currentValue` 为数组第一个元素 `array[0]` 的值，否则的话为数组第二个元素 `array[1]` 的值；
- `currentIndex`（可选）：当前元素在数组中的索引位置。在第一次调用 `callbackFn()` 函数时，如果指定了 `initialValue` 参数的话，则 `currentIndex` 的值为 0，否则的话为 1；
- `array`（可选）：调用了 `reduce()` 方法的数组本身；
- `initialValue` （可选）：第一次调用 `callbackFn` 回调函数时初始化 `accumulator` 的值。如果指定了 `initialValue` 参数的话，则 `callbackFn` 函数从数组中的第一个元素 `array[0]` 的值作为 `currentValue` 开始执行。如果没有指定 `initialValue` 参数的话，则 `accumulator` 初始化为数组中的第一个元素 `array[0]` 的值，并且 `callbackFn` 函数从数组中第二个元素 `array[1]` 的值作为 `currentValue` 开始执行。在这种情况下，如果数组为空（没有第一个元素 `array[0]` 的值可以作为 `accumulator` 返回），则会抛出错误；

## 常见用法

> [!tip]
> 可以将代码直接拷贝到浏览器的控制台中运行以便快速查看执行结果！

#CodeSnippet

### 数组求和

```javascript
const array = [15, 16, 17, 18, 19];

const fn = (arr) => {
  return arr.reduce((accumulator, currentValue, currentIndex) => {
	const res = accumulator + currentValue
	console.log(`accumulator: ${accumulator}, currentValue: ${currentValue}, index: ${currentIndex}, returns: ${res}`);
	return res
  }, 0)
}

console.log(fn(array))
```

### 分组

```javascript
const array = [
  { name: "Alice", age: 21 },
  { name: "Max", age: 20 },
  { name: "Jane", age: 20 },
];

const fn = (arr) => {
  return arr.reduce((accumulator, current) => {
	const list = accumulator[current.age] || []
	list.push(current)
	accumulator[current.age] = list
	return accumulator
  }, {})
}

console.log(fn(array))
```

### 去重

```javascript
const array = ["a", "b", "a", "b", "c", "e", "e", "c", "d", "d", "d", "d"];

const fn = (arr) => {
  return arr.reduce((accumulator, current) => {
	if (!accumulator.includes(current)) {
	  return [...accumulator, current]
	}
	return accumulator
  }, [])
}

console.log(fn(array))
```

### 统计元素出现的次数

```javascript
const array = ["a", "b", "a", "b", "c", "e", "e", "c", "d", "d", "d", "d"];

const fn = (arr) => {
  return arr.reduce((accumulator, current) => {
	if (accumulator[current]) {
	  accumulator[current] += 1
	} else {
	  accumulator[current] = 1
	}
	return accumulator
  }, [])
}

console.log(fn(array))
```

### 二维数组转成一维数组

```javascript
const array = [[0, 1], [2, 3], [4, 5]]

const fn = (arr) => {
  return arr.reduce((accumulator, current) => {
	return [...accumulator, ...current]
  }, [])
}

console.log(fn(array))
```

### 多维数组转成一维数组

```javascript
const array = [[0, 1], [2, 3], [4, [5, 6, 7]]]

const fn = (arr) => {
  return arr.reduce((accumulator, current) => {
	return accumulator.concat(Array.isArray(current) ? fn(current) : current)
  }, [])
}

console.log(fn(array))
```

### 树形结构平铺成一维数组

```javascript
const array = [
  {
	id: 1,
	p_id: 0,
	name: "首页",
	children: [
	  {
		id: 4,
		p_id: 1,
		name: "权限管理",
		children: [
		  {
			id: 6,
			p_id: 4,
			name: "角色列表",
			children: [{ id: 5, p_id: 6, name: "管理员列表" }],
		  },
		],
	  },
	],
  },
  { id: 2, p_id: 0, name: "菜单管理" },
  { id: 3, p_id: 0, name: "菜单列表" },
];


const fn = (arr) => {
  return arr.reduce((accumulator, current) => {
	if (current.children && current.children.length > 0) {
	  const copy = { ...current }
	  delete copy.children
	  return accumulator.concat(copy, fn(current.children))
	} else {
	  return accumulator.concat(current)
	}
  }, [])
}

console.log(fn(array))
```

### 数组转树

```javascript
const array = [
  { id: 4, p_id: 1, name: '权限管理' },
  { id: 1, p_id: 0, name: '首页' },
  { id: 6, p_id: 4, name: '角色列表' },
  { id: 5, p_id: 6, name: '管理员列表' },
  { id: 2, p_id: 0, name: '菜单管理' },
  { id: 3, p_id: 0, name: '菜单列表' }
]


const fn = (arr, pid = 0) => {
  return arr.reduce((accumulator, current) => {
	if (current.p_id === pid) {
	  const children = fn(arr, current.id)
	  if (children && children.length > 0) {
		current.children = children
	  }
	  accumulator.push(current)
	}
	return accumulator
  }, [])
}

console.log(fn(array))
```

## 手写 reduce 方法

```javascript
Array.prototype.myReduce = function (cb, init) {
  let accumulator = init ? init : this[0]
  let startIndex = init ? 0 : 1;
  for (let i = startIndex; i < this.length; i++) {
	accumulator = cb(accumulator, this[i], i, this)
  }
  return accumulator
}

const array = [
  { id: 4, p_id: 1, name: '权限管理' },
  { id: 1, p_id: 0, name: '首页' },
  { id: 6, p_id: 4, name: '角色列表' },
  { id: 5, p_id: 6, name: '管理员列表' },
  { id: 2, p_id: 0, name: '菜单管理' },
  { id: 3, p_id: 0, name: '菜单列表' }
]


const fn = (arr, pid = 0) => {
  return arr.myReduce((accumulator, current) => {
	if (current.p_id === pid) {
	  const children = fn(arr, current.id)
	  if (children && children.length > 0) {
		current.children = children
	  }
	  accumulator.push(current)
	}
	return accumulator
  }, [])
}

console.log(fn(array))
```
