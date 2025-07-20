---
tags:
  - Java/EffectiveJava
priority: 11
description: 重写 equals 时必须同时重写 hashCode
create_time: 2025/07/18 17:44
update_time: 2025/07/18 18:58
---

**_Contract（<span style="font-size:10px;">约定</span>）of hashCode：_**

- 同一个对象在多次调用 `hashCode()` 时，只要参与 `equals()` 比较的字段未发生变化，则返回的哈希值必须保持一致。
- 若两个对象根据 `equals()` 判断为相等，则它们的哈希值也必须相等。
- 
