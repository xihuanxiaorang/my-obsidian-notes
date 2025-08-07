---
tags:
  - Java/EffectiveJava
priority: 11
description: 重写 equals 时必须同时重写 hashCode
create_time: 2025/07/18 17:44
update_time: 2025/07/31 19:15
---

**_Contract（<span style="font-size:10px;">约定</span>）of hashCode：_**

- 对于同一个对象，只要参与 `equals()` 比较的字段未被修改，多次调用 `hashCode()` 方法都必须返回相同的整数值。
- 若两个对象通过 `equals()` 判断为相等，则它们的哈希值也必须相等；反之不成立。则说 "对象相等"是"哈希值相等"的[[充分条件与必要条件#充分不必要条件与必要不充分条件|充分不必要条件]]。
- 不相等的对象不要求必须返回不同的哈希值，但建议尽可能不同以提升哈希表的性能。

**_The Recipe（<span style="font-size:10px;">实现步骤</span>）:_**

> "重要字段"是指参与 `equals()` 比较、用于判断对象相等性的字段。

1. 初始化 `result`：声明一个 `int` 类型的变量 `result`，将其初始化为第一个重要字段的哈希值 `c`。
2. 处理其余每个重要字段 `f`：
	1. 计算字段的哈希值 `c`：
	   - 基本类型：使用对应包装类的 `hashCode()` 方法。
	   - 对象引用：若 `equals()` 方法递归比较该字段，则 `hashCode()` 也应递归调用该字段的 `hashCode()` 方法。若字段为 `null`，则返回 $0$。
	   - 数组类型：将每个重要元素视为独立字段，递归应用上述规则；若所有元素均为重要字段，可直接使用 `Arrays.hashCode(f)`。
	2. 合并字段哈希值到 `result`：
		- 公式：`result = 31 * result + c`。
		- 其中 $31$ 是一个奇素数，常用于哈希计算，能有效降低哈希冲突的概率。
3. 返回最终结果 `result`。
