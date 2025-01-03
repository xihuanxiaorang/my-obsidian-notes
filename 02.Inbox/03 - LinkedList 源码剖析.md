---
tags:
  - Collection
  - Java
  - SourceCodeAnalysis
  - DataStructure
create_time: 2025-01-02 23:31
update_time: 2025/01/03 23:38
---

## 基本介绍

1. LinkedList 可以包含任何类型的数据（包括 `null`），并且支持**重复元素**，长度没有限制。
2. LinkedList 继承自 `AbstractSequentialList`，实现了 `List`、`Deque`、`Cloneable` 和 `Serializable` 接口。其继承关系如下图所示：

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
	
	class LinkedList<E> extends AbstractSequentialList implements List, Deque, Cloneable, Serializable {}
	class AbstractSequentialList<E> extends AbstractList {}
	class AbstractList<E> extends AbstractCollection implements List {}
	class AbstractCollection<E> implements Collection {}
	
	interface List<E> extends Collection {}
	interface Deque<E> extends Queue {}
	interface Collection<E> extends Iterable {}
	interface Queue<E> extends Collection {}
	interface Iterable<E> {}
	interface Cloneable {}
	interface Serializable {}
	
	@enduml
	```

3. LinkedList 存取元素是**有序**的；
4. `LinkedList` 是**非线程安全**的。和 [[01 - ArrayList 源码剖析|ArrayList]] 类似，在多线程环境下，若需要保证线程安全，必须使用外部同步机制来确保操作的安全性。

## 底层数据结构（链表）

LinkedList 底层采用双向链表结构存储数据。与顺序存储的 [[01 - ArrayList 源码剖析|ArrayList]] 相比，链表不需要连续的内存空间，它由一系列的节点（`Node`）通过指针连接起来。

![[LinkedList 底层数据结构.excalidraw | 1000]]

链表通常分为：

- **单向链表**：每个节点只包含一个指向后继节点的引用。
- **双向链表**：每个节点包含两个指针，一个指向前驱节点，另一个指向后继节点。
- **循环链表**：链表的最后一个节点指向链表的头节点，形成一个环。

其特点如下所示：

1. **非连续存储**：链表的元素在内存中是分散存储的，每个节点的存储位置由指针确定。
2. **插入和删除效率高**：链表在插入和删除元素时不需要像数组一样移动其他元素，只需要修改指针的指向即可，因此这些操作的时间复杂度为 O(1)。
3. **访问效率较低**：由于链表的元素不是连续存储的，因此不能像数组那样通过索引直接访问指定元素。查找一个元素的时间复杂度是 O(n)，需要遍历链表。
4. **适用场景**：适合频繁插入和删除元素的场景，但不适合需要快速随机访问元素的场景。
