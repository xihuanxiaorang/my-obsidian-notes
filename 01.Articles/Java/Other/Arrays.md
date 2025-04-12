---
tags:
  - Java/CodeUtil
create_time: 2024-12-22 18:40
update_time: 2025/04/12 18:20
---

## copyOf

`copyOf(U[] original, int newLength, Class<? extends T[]> newType)` 用于将源数组 `original` 中的元素复制到一个新数组中。新数组的长度由 `newLength` 决定，元素类型为 `newType`。

1. 如果 `newLength` 大于源数组的长度，则多出的部分用 `null` 填充。
2. 如果 `newLength` 小于源数组的长度，则超出部分的元素会被截断。

### 举个栗子

```java
Long[] array1 = new Long[]{1L, 2L, 3L};

// 复制并扩展长度至 5
Object[] array2 = Arrays.copyOf(array1, 5, Object[].class);
System.out.println(Arrays.toString(array2)); // [1, 2, 3, null, null]

// 复制并截断长度至 1
Object[] array3 = Arrays.copyOf(array1, 1, Object[].class);
System.out.println(Arrays.toString(array3)); // [1]
```

### 源码剖析

`copyOf` 方法源码如下所示：

```java
public static <T,U> T[] copyOf(U[] original, int newLength, Class<? extends T[]> newType) {  
    @SuppressWarnings("unchecked")  
    T[] copy = ((Object)newType == (Object)Object[].class)  
        ? (T[]) new Object[newLength]  
        : (T[]) Array.newInstance(newType.getComponentType(), newLength);  
    System.arraycopy(original, 0, copy, 0,  
                     Math.min(original.length, newLength));  
    return copy;  
}
```

核心逻辑：

1. **新数组创建**：
    - 如果目标类型为 `Object[]`，直接创建 `Object` 类型数组。
    - 否则，使用 `Array.newInstance` 按指定类型创建数组。
2. **元素复制**：
    - 使用 `System.arraycopy` 将源数组的元素复制到新数组中。
    - 复制长度为 `Math.min(original.length, newLength)`，确保不越界。

### System.arraycopy 方法

`System.arraycopy(Object src, int srcPos, Object dest, int destPos, int length)` 是一个 native 方法，专门用于高效复制数组内容，其参数说明如下：

1. `src`：源数组；
2. `srcPos`：源数组的起始位置；
3. `dest`：目标数组；
4. `destPos`：目标数组的起始位置；
5. `length`：要复制的元素个数。

举个栗子：

```java
Long[] array1 = new Long[]{1L, 2L, 3L};
Object[] array2 = new Object[5];

// 将 array1 的前 3 个元素复制到 array2 的前 3 个位置
System.arraycopy(array1, 0, array2, 0, 3);
System.out.println(Arrays.toString(array2)); // [1, 2, 3, null, null]
```

通过 `System.arraycopy` 可以实现在数组指定位置处插入元素的功能。如下所示： ^30f810

```java
Long[] array1 = new Long[]{1L, 2L, 3L, null, null, null};
int index = 1;
System.arraycopy(array1, index, array1, index + 1, 3 - index);
array1[index] = 0L;
System.out.println(Arrays.toString(array1)); // [1, 0, 2, 3, null, null]
```
