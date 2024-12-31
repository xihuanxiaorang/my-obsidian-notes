---
tags:
  - Collection
  - Java
  - SourceCodeAnalysis
create_time: 2024-12-24 17:50
update_time: 2024/12/27 11:20
version: 8
---

## 基本介绍

1. ArrayList 是**动态数组**，即"长度可调节的数组"，可以包含任何类型的数据（包括 `null`），并且支持**重复元素**。
2. ArrayList 继承自 AbstractList，实现了 `List`、[RandomAccess](#randomaccess接口)、`Cloneable` 和 `Serializable` 接口，其继承关系如下图所示：

	```plantuml
	@startuml
	
	' 设置背景为深色
	skinparam backgroundColor #1E1E1E
	
	' 设置默认文本颜色为白色
	skinparam defaultTextColor white
	
	' 设置类的背景和边框颜色
	skinparam ClassBackgroundColor #2D2D2D
	skinparam ClassBorderColor #555555
	skinparam ClassFontColor white
	
	' 设置类属性和方法的颜色
	skinparam ClassAttributeIconColor #A0A0A0
	skinparam ClassStereotypeFontColor #A0A0A0
	
	' 设置连接线颜色和箭头颜色
	skinparam ArrowColor #A0A0A0
	skinparam LineColor #A0A0A0
	
	class ArrayList<E> extends AbstractList implements List,RandomAccess,Cloneable,Serializable {}
	class AbstractList<E> extends AbstractCollection implements List {}
	class AbstractCollection<E> implements Collection {}
	
	interface List<E> extends Collection {}
	interface Collection<E> extends Iterable {}
	interface Iterable<E> {}
	interface RandomAccess {}
	interface Serializable {}
	interface Cloneable {}
	
	@enduml
	```

3. ArrayList 存取元素是**有序**的；
4. ArrayList 与 Vector 类似，唯一的区别是 ArrayList 是**非线程安全**的，Vector 是线程安全的。不过，由于 Vector 实现线程安全的开销较大，推荐使用 CopyOnWriteArrayList 替代 Vector，在后面的文章中会详细介绍。

## 底层数据结构（顺序表）

ArrayList 底层使用的是**顺序表**，即基于数组实现的线性表。它通过连续存储单元依次存储数据元素，逻辑上和物理上都保持元素的相邻性。

> [!info]
>
> 线性表是由 n（n >= 0）相同类型的数据元素组成的有限序列，它是最基本、最常用的一种线性结构。
>
> 线性表有两种储存方式：<u>**顺序存储**</u>和<u>**链式存储**</u>。采用顺序存储的线性表被称为**顺序表**，采用链式存储的线性表被称为**链表**。
> ![image-20230823033246771](https://cdn.jsdelivr.net/gh/xihuanxiaorang/img2/202412162233212.png)
>
> 表中 ai-1 领先于 ai，ai 领先于 ai+1，称 ai-1 是 ai 的**直接前驱**元素，ai+1 是 ai 的**直接后继**元素。
>
> 当 i = 1,2,..., n-1 时，ai 有且仅有一个直接后继，当 i=2,3,..., n 时，ai 有且仅有一个直接前驱。<br />
> 等价于⬇️ <br />
> 除第一个元素外，每个元素都有唯一的**直接前驱**；除最后一个元素外，每个元素都有唯一的**直接后继**。
>
> 线性表中元素的个数 n（n >= 0）定义为线性表的长度，当 n = 0 时称为**空表**。
>
> 在非空表中的每个数据元素都有一个确定的位置，如 a1 是第一个数据元素，an 是最后一个数据元素，ai 是第 i 个数据元素，称 i 为数据元素 ai 在线性表中的**位序**。

其特点如下所示：

1. **连续存储**：所有元素在内存中按顺序连续存储，地址相邻。
2. **随机访问**： 由于元素连续存储，可以**通过下标或索引来快速访问顺序表中的任意元素**。这种随机访问的时间复杂度为 O (1)，即不受顺序表长度的影响，具有高效的特点。
3. **插入和删除效率相对较低**： 在顺序表中插入或删除元素，特别是在中间位置，可能需要移动大量元素。这会导致插入和删除的平均时间复杂度为 O (n)。
4. **动态扩容开销**：如果顺序表容量不足，需要进行动态扩容，即**重新分配更大的数组并复制数据**。这个过程可能会带来一定的时间开销。
5. **适用场景**： 适合频繁访问和随机读取的场景，但不适合频繁插入或删除。

## 知识储备

![[Arrays#copyOf]]

## 重要属性

### 成员变量

```java
/**
 * 数组缓冲区，数组列表的元素被存储在其中。数组列表的容量就是这个数组缓冲区的长度。
 * 当添加第一个元素时，如果 elementData == DEFAULT_CAPACITY_EMPTY_ELEMENT_DATA 的话，则进行第一次扩容，容量大小变为 DEFAULT_CAPACITY = 10。
 */
private Object[] elementData;
/**
 * 数组中元素的数量
 */
private int size;
```

### 静态常量

```java
/**
 * 默认初始容量
 */
private static final int DEFAULT_CAPACITY = 10;
/**
 * 空实例的共享空数组（用于指定容量为 0 的初始化）
 */
private static final Object[] EMPTY_ELEMENT_DATA = {};

/**
 * 默认大小(10)的共享空数组（用于无参构造器初始化）。
 * 与 EMPTY_ELEMENT_DATA 区分开，以便了解在添加第一个元素时数组容量要扩容至多少
 */
private static final Object[] DEFAULT_CAPACITY_EMPTY_ELEMENT_DATA = {};
```

1. DEFAULT_CAPACITY：**默认初始化容量** = 10。
2. EMPTY_ELEMENTDATA：如果**使用有参构造器，且指定的初始化容量为 0**，则 `elementData` 会被赋值为该常量，并且**在添加第一个元素时扩容至 1**。
3. DEFAULTCAPACITY_EMPTY_ELEMENTDATA：如果**使用无参构造器**，则 `elementData` 会被赋值为该常量，并且**在添加第一个元素时扩容至默认容量（10）**。

## 主要操作

### 初始化✨

> [!note]+
> **无参构造函数和初始容量为 0 的有参构造函数不会立即分配内存，而是在第一次添加元素时才对数组进行初始化**。这种设计旨在**延迟初始化**，避免不必要的内存浪费。例如，如果数组初始化后未添加任何元素，则会浪费内存。

无参构造函数将 `elementData` 初始化为 `DEFAULTCAPACITY_EMPTY_ELEMENTDATA`，即默认大小为 10 的空数组。

```java
/**
 * 无参构造函数
 */
public ArrayList() {
  this.elementData = DEFAULTCAPACITY_EMPTY_ELEMENTDATA;
}
```

该构造函数创建一个具有指定初始容量的数组。如果 `initialCapacity < 0`，抛出 <span style="background:rgba(255, 183, 139, 0.55)">IllegalArgumentException</span> 异常；如果 `initialCapacity = 0`，将 `elementData` 初始化为 `EMPTY_ELEMENTDATA`。

```java
/**
 * 构造具有指定初始容量的空数组
 *
 * @param initialCapacity 初始容量大小
 * @throws IllegalArgumentException 如果指定的初始容量为负数
 */
public ArrayList(int initialCapacity) {
  if (initialCapacity > 0) {
    this.elementData = new Object[initialCapacity];
  } else if (initialCapacity == 0) {
    this.elementData = EMPTY_ELEMENTDATA;
  } else {
    throw new IllegalArgumentException("Illegal Capacity: "+ initialCapacity);
  }
}
```

该构造函数通过指定集合 `c` 初始化 `ArrayList`，用于将集合中的元素复制到内部数组 `elementData` 中。

```java
public ArrayList(Collection<? extends E> c) {
    elementData = c.toArray();
    if ((size = elementData.length) != 0) {
        // c.toArray might (incorrectly) not return Object[] (see 6260652)
        if (elementData.getClass() != Object[].class)
            elementData = Arrays.copyOf(elementData, size, Object[].class);
    } else {
        // replace with empty array.
        this.elementData = EMPTY_ELEMENTDATA;
    }
}
```

🤔为什么需要 `Arrays.copyOf`？
🤓：因为在某些情况下，集合中的 `toArray()` 方法返回的数组类型可能不是 `Object[].class`，因此需要通过 ` Arrays.copyOf ` 复制为 Object[] 类型。例如：

```java
Long[] array1 = {1L, 2L};
List<Long> list1 = Arrays.asList(array1);
Object[] array2 = list1.toArray();
System.out.println(array2.getClass() == Object[].class); // false

List<Long> list2 = new ArrayList<>();
System.out.println(list2.toArray().getClass() == Object[].class); // true
```

在上例中，`list1.toArray()` 返回的数组类型与 `Object[].class` 不一致，导致潜在的类型安全问题。因此，`Arrays.copyOf` 用于确保内部数组的正确类型。

### 添加元素

#### 在尾部添加元素

1. 先判断当前数组是否已满无法再添加元素，如果已满的话，则说明数组此时容量不足需要先进行[扩容](#扩容)操作；
2. 然后在数组的末尾添加元素；
3. 最后元素个数加一 `size++`；

```java
/**
 * 在数组的尾部添加元素
 *
 * @param e 待添加的元素
 */
public boolean add(E e) {
  // 确定数组容量，如果数组容量不足的话则需要进行扩容
  ensureCapacityInternal(size + 1);  // Increments modCount!!
  elementData[size++] = e;
  return true;
}
```

#### 在指定位置添加元素✨

1. **索引合法性检查**，如果索引 `index < 0 || index > size` 的话，则抛出**索引越界异常**！
2. 判断数组目前是否已满无法再添加元素，如果已满的话，则说明数组此时容量不足需要先进行[扩容](#扩容)操作；
3. 由于数组元素在内存中是"紧挨着的"，它们之间没有空间再存放任何数据，所以在指定的位置添加元素时，需要**将指定位置及其之后的所有元素向后移动一位。也就是用前一个元素的值覆盖后一个元素的值，最后再用新元素的值覆盖指定位置上的值即可**。
4. 元素个数加一 `size++`；

   > [!Note]
   >
   > 数组中的某个区段整体往后挪的时候，一定是后面的先动！否则的话，会出现数据覆盖的情况!

   对应到代码中则体现为**倒序遍历**，**用前一个元素的值覆盖后一个元素的值**。如下所示：

	```java
	for (int i = size; i > index; i--) {
	    elementData[i] = elementData[i - 1];
	}
	```

   等价于使用 `System.arraycopy()` 方法从原数组 index 位置开始，拷贝到原数组 index + 1 位置开始，拷贝的数量 = size - index。[[Arrays#^30f810]]

	```java
	System.arraycopy(data, index, data, index + 1, size - index);
	```

   ![image-20230823183333737](https://cdn.jsdelivr.net/gh/xihuanxiaorang/img2/202412162236793.png)

5. 元素个数加一 size++；

```java
public void add(int index, E element) {
  // 索引合法性检查，如果索引不符合条件的话则抛出索引越界异常
  rangeCheckForAdd(index);
  // 确定数组容量，如果数组容量不足的话则需要进行扩容
  ensureCapacityInternal(size + 1);  // Increments modCount!!
  // 数组指定位置插入元素 => 将指定位置及其之后的所有元素向后移动一位
  System.arraycopy(elementData, index, elementData, index + 1, size - index);
  // 在指定位置处放入新元素
  elementData[index] = element;
  // 元素个数加一
  size++;
}

/**
 * 检查添加元素时索引是否越界
 *
 * @param index 索引位置
 * @throws IndexOutOfBoundsException 如果索引越界的话
 */
private void rangeCheckForAdd(int index) {
  if (index > size || index < 0) {
    throw new IndexOutOfBoundsException("Index: " + index + ", Size: " + size);
  }
}
```

#### 扩容✨

1. 确定数组所需的最小容量 minCapacity；
   1. 目前 minCapacity 为方法实参 = size + 1 = 目前数组中的元素个数 + 1；
   2. 如果 elementData = DEFAULTCAPACITY_EMPTY_ELEMENTDATA 的话，则取 minCapacity（size + 1） 与 DEFAULT_CAPACITY（10）两者较大的数赋值给 minCapacity；
2. 数组所需最小的容量确定之后，需要判断当前数组的容量是否小于所需的最小容量，如果是的话，则需要进行扩容操作；
3. 扩容操作：
   1. **确定新数组容量大小**。公式：`newCapacity = oldCapacity + (oldCapacity >> 1)`，其中 oldCapacity >> 1 进行位运算，右移一位，即为 oldCapacity 的一半 => **新数组的容量 = 原数组容量的 1.5 倍** = 原数组容量 + 原数组容量 >> 1；
   2. **数据拷贝**。新数组容量大小确定之后，则需要进行数据拷贝操作。 `Arrays.copyOf()` 方法实际上就是创建一个新的数组，然后在方法的内部调用 [[Arrays#System.arraycopy 方法]] 将原数组中的所有数据全部拷贝到新创建的数组中。

```java
private void ensureCapacityInternal(int minCapacity) {
  ensureExplicitCapacity(calculateCapacity(elementData, minCapacity));
}

/**
 * 确定数组目前所需的最小容量
 */
private static int calculateCapacity(Object[] elementData, int minCapacity) {
  if (elementData == DEFAULTCAPACITY_EMPTY_ELEMENTDATA) {
    return Math.max(DEFAULT_CAPACITY, minCapacity);
  }
  return minCapacity;
}

/**
 * 确定数组容量，如果数组容量小于目前所需的最小容量，则需要进行扩容操作
 */
private void ensureExplicitCapacity(int minCapacity) {
  modCount++;

  // overflow-conscious code
  if (minCapacity - elementData.length > 0)
    grow(minCapacity);
}

/**
 * 扩容操作，
 * ① 新数组的容量 = 原数组容量 + 原数组容量 >> 1 = 原数组容量的1.5倍；
 * ② 新数组的容量大小确定之后，将原数组中的所有数据全部拷贝到新数组当中
 */
private void grow(int minCapacity) {
  // overflow-conscious code
  int oldCapacity = elementData.length;
  // 新数组的容量 = 原数组容量的1.5倍
  int newCapacity = oldCapacity + (oldCapacity >> 1);
  if (newCapacity - minCapacity < 0)
    newCapacity = minCapacity;
  if (newCapacity - MAX_ARRAY_SIZE > 0)
    newCapacity = hugeCapacity(minCapacity);
  // minCapacity is usually close to size, so this is a win:
  // 将原数组中的所有数据全部拷贝到新数组当中
  elementData = Arrays.copyOf(elementData, newCapacity);
}
```

### 获取元素

```java
public E get(int index) {
  // 索引合法性检查，如果索引不符合条件的话则抛出索引越界异常
  rangeCheck(index);
  // 直接返回数组指定位置元素
  return elementData(index);
}

E elementData(int index) {
  return (E) elementData[index];
}
```

### 设置指定位置元素为指定值

```java
public E set(int index, E element) {
  // 索引合法性检查，如果索引不符合条件的话则抛出索引越界异常
  rangeCheck(index);
  // 根据下标获取旧值
  E oldValue = elementData(index);
  // 设置新值
  elementData[index] = element;
  // 返回旧值
  return oldValue;
}
```

### 删除元素

#### 删除指定位置元素✨

1. **索引合法性检查**，如果索引 `index >= size` 的话，则抛出**索引越界异常**！
2. 获取指定位置的元素（即需要被删除的元素）；
3. 采用数组拷贝的方式实现将索引 index 之后的所有元素全部依次向前移动一位，该过程需要移动的元素数量 = size - index - 1;
4. 将数组中的最后一个元素置为 `null`，以便进行垃圾回收；
5. 元素个数减一 size--；

```java
public E remove(int index) {
  // 索引合法性检查，如果索引不符合条件的话则抛出索引越界异常
  rangeCheck(index);

  modCount++;
  // 获取指定位置元素（需要被删除的元素）
  E oldValue = elementData(index);
  // 计算删除指定位置元素时总共需要移动的元素个数
  int numMoved = size - index - 1;
  if (numMoved > 0)
    // 采用数组拷贝的方式实现将索引 index 之后的所有元素全部依次向前移动一位
    System.arraycopy(elementData, index+1, elementData, index, numMoved);
  // 将删除元素前数组中的最后一个元素置为空以便进行垃圾回收 && 数组中元素的个数减一
  elementData[--size] = null; // clear to let GC do its work
  // 返回被删除的元素
  return oldValue;
}
```

#### 删除指定元素

1. 遍历数组，找到目标元素的索引位置；
2. 如果找到目标元素，则调用 `fastRemove(index)` 进行删除。
3. `fastRemove(index)` 方法的实现方式与 ` remove(index) ` 方法一致，都是采用数组拷贝的方式实现将索引 index 之后的所有元素全部依次向前移动一位，该过程需要移动的元素数量 = size - index - 1;

```java
/**
 * 删除数组中第一个匹配的目标元素
 */
public boolean remove(Object o) {
  if (o == null) {
  	// 遍历找到第一个 null 值
    for (int index = 0; index < size; index++)
      if (elementData[index] == null) {
        fastRemove(index);
        return true;
      }
  } else {
  	// 遍历找到第一个匹配的目标元素
    for (int index = 0; index < size; index++)
      if (o.equals(elementData[index])) {
        fastRemove(index);
        return true;
      }
  }
  // 未找到匹配元素
  return false;
}

/**
 * 快速删除指定位置的元素，内部使用
 */
private void fastRemove(int index) {
  modCount++;
  int numMoved = size - index - 1;
  if (numMoved > 0)
  	// 将索引 index 之后的所有元素全部依次向前移动一位
    System.arraycopy(elementData, index+1, elementData, index, numMoved);
  elementData[--size] = null; // clear to let GC do its work
}
```

### 调整数组容量至实际元素个数

该方法用于将数组容量调整为实际元素个数的大小。当 `ArrayList` 的元素个数已经固定不变时，调用此方法可以释放多余的内存，提高内存利用率。

实现逻辑：

1. **修改计数器（modCount）**：增加修改计数，用于支持[[快速失败机制（fail-fast）]]。
2. **检查当前数组容量**：只有当数组的实际容量大于元素个数时才进行调整。
3. **处理空列表**：如果 `ArrayList` 为空（`size == 0`），直接将 `elementData` 指向共享的空数组 `EMPTY_ELEMENTDATA`。
4. **调整数组容量**：通过 [[Arrays#copyOf]] 方法将 `elementData` 数组缩小到 `size` 大小。

```java
public void trimToSize() {
  modCount++;
  // 仅在数组容量大于实际元素个数时才进行调整
  if (size < elementData.length) {
    elementData = (size == 0)
      ? EMPTY_ELEMENTDATA // 空数组优化
      : Arrays.copyOf(elementData, size); // 缩容至实际元素个数
  }
}
```

## RandomAccess 接口

`RandomAccess` 是一个**标识**接口，不包含任何方法，仅用于标识实现类是否支持**快速随机访问**。

```java
package java.util;

public interface RandomAccess {
}
```

特性与用途：

- **快速随机访问**：实现该接口的类**支持通过元素下标快速访问元素，而无需遍历**。例如：
    - `ArrayList` 实现了 `RandomAccess` 接口，支持**快速随机访问**。
    - `LinkedList` 未实现该接口，访问元素需要遍历链表，效率较低。
- **标识作用**：`RandomAccess` 的存在使得 Java 标准库可以根据集合类型优化操作。例如，区分**随机访问集合**（如 `ArrayList`）和**顺序访问集合**（如 `LinkedList`），从而使用不同的算法实现更高效的操作。

实现应用：

在 `Collections` 类的 `binarySearch` 方法中，可以看到 `RandomAccess` 的具体应用：

```java
public static <T>
  int binarySearch(List<? extends Comparable<? super T>> list, T key) {
  if (list instanceof RandomAccess || list.size()<BINARYSEARCH_THRESHOLD)
    return Collections.indexedBinarySearch(list, key);
  else
    return Collections.iteratorBinarySearch(list, key);
}
```

- 判断集合类型：
    - 如果 `list` 实现了 `RandomAccess` 接口或集合的大小小于某个阈值（`BINARYSEARCH_THRESHOLD`），则调用**索引二分搜索**（`indexedBinarySearch`）。
    - 否则，调用**迭代器二分搜索**（`iteratorBinarySearch`）。
- 优化操作：
    - `indexedBinarySearch` 使用索引直接访问元素，适合随机访问集合（如 `ArrayList`）。
    - `iteratorBinarySearch` 使用迭代器逐个遍历，适合顺序访问集合（如 `LinkedList`）。

遍历集合的建议：

- 实现了 `RandomAccess` 接口的集合（如 `ArrayList`）：
    - 优先使用**普通 for 循环**（基于索引访问）。
    - 次选 **foreach 循环**。
- 未实现 `RandomAccess` 接口的集合（如 `LinkedList`）：
    - 优先使用**迭代器遍历**（如 `Iterator` 或 `ListIterator`）。
