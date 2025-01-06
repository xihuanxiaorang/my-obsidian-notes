---
tags:
  - Collection
  - Java
  - SourceCodeAnalysis
  - DataStructure
create_time: 2025-01-02 23:31
update_time: 2025/01/06 23:27
---

## 基本介绍

1. `LinkedList` 可以存储任何类型的数据（包括 `null`），并且允许**重复元素**，长度不受限制。
2. `LinkedList` 继承自 `AbstractSequentialList`，并实现了 `List`、`Deque`、`Cloneable` 和 `Serializable` 接口。其继承关系如下图所示：

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

3. `LinkedList` 存取元素是**有序**的；
4. `LinkedList` 是**非线程安全**的。和 [[01 - ArrayList 源码剖析|ArrayList]] 类似。如果在多线程环境中使用，需借助外部同步机制确保线程安全。

## 底层数据结构（链表）

`LinkedList` 的底层采用**双向链表**结构存储数据。与 ArrayList 的顺序存储不同，[[02 - 链表.canvas|链表]]结构不需要连续的内存空间，而是由一系列 `Node` 节点通过指针连接起来。其底层结构如下图所示：

![[LinkedList 底层数据结构.excalidraw | 1000]]

每一个 `Node` 节点包含以下三个部分：

1. **数据域 (`item`)**：存储节点中的元素。
2. **前驱指针 (`prev`)**：指向前一个节点的引用。
3. **后继指针 (`next`)**：指向下一个节点的引用。

其代码实现如下所示：

```java
private static class Node<E> {
  // 节点存储的元素
  E item;
  // 指向下一个节点的引用          
  Node<E> next; 
  // 指向前一个节点的引用   
  Node<E> prev;    

  Node(Node<E> prev, E element, Node<E> next) {
    this.item = element;
    this.next = next;
    this.prev = prev;
  }
}
```

## 重要属性

`LinkedList` 中的关键成员变量如下所示：

```java
/**
 * 元素个数，默认为 0
 */
transient int size = 0;

/**
 * 头节点（第一个节点）
 */
transient Node<E> first;

/**
 * 尾节点（最后一个节点）
 */
transient Node<E> last;
```

## 主要操作

### 添加元素✨

#### 在头部添加元素

通过 `linkFirst()` 方法实现将新元素添加到链表头部。具体步骤如下所示：

```java
public void addFirst(E e) {  
    linkFirst(e);  
}

private void linkFirst(E e) {  
    // 获取当前头节点
    final Node<E> f = first;  
    // 创建新节点，将当前头节点作为其后继节点
    final Node<E> newNode = new Node<>(null, e, f);  
    // 更新头节点为新节点
    first = newNode;  
    // 如果链表为空，则将新节点同时作为尾节点
    if (f == null)  
        last = newNode;  
	// 否则，将原头节点的 prev 指向新节点
    else  
        f.prev = newNode;  
    // 增加元素个数
    size++;  
    // 更新结构修改次数
    modCount++;  
}
```

1. **获取当前头节点**：通过 `first` 获取链表当前的头节点。
2. **创建新节点**：创建一个新节点 `newNode`，其 ` next ` 指向当前头节点，` prev ` 设置为 ` null `。
3. **更新头节点**：将 `first` 指向新节点，使其成为新的头节点。
4. **处理空链表**：如果链表为空（`f == null`），则新节点同时作为尾节点。
5. **更新指针**：若链表非空，则更新原头节点的 `prev` 指向新节点。
6. **更新状态**：增加元素个数 `size` 和结构修改次数 `modCount`。

关键步骤示意图如下所示：
![[LinkedList 在头部添加元素.excalidraw|1200]]

#### 在尾部添加元素

通过 `linkLast()` 方法实现将新元素添加到链表末尾。具体步骤如下所示：

```java
public boolean add(E e) {  
    linkLast(e);  
    return true;  
}

void linkLast(E e) {  
    // 获取当前尾节点
    final Node<E> l = last;  
    // 创建新节点，将当前尾节点作为其前驱节点
    final Node<E> newNode = new Node<>(l, e, null);  
    // 更新尾节点为新节点
    last = newNode;  
    // 如果链表为空，则将新节点同时作为头节点
    if (l == null)  
        first = newNode;  
    // 否则，将原尾节点的 next 指向新节点
    else  
        l.next = newNode;  
    // 增加元素个数
    size++;  
    // 更新结构修改次数
    modCount++;  
}
```

1. **获取当前尾节点**：通过 `last` 获取链表的当前尾节点。
2. **创建新节点**：创建一个新节点 `newNode`，其 `prev` 指向当前尾节点，`next` 设置为 `null`。
3. **更新尾节点**：将 `last` 指向新节点，使其成为新的尾节点。
4. **处理空链表**：若链表为空（`l == null`），则新节点同时作为头节点。
5. **更新指针**：若链表非空，则更新原尾节点的 `next` 指向新节点。
6. **更新状态**：增加元素个数 `size` 和结构修改次数 `modCount`。

关键步骤示意图如下所示：
![[LinkedList 在尾部添加元素.excalidraw|1200]]

#### 在指定位置添加元素

```java
public void add(int index, E element) {
    // 检查索引是否合法
    checkPositionIndex(index);

    // 如果索引等于链表大小，说明在尾部添加元素
    if (index == size) {
        linkLast(element);
    }
    // 在指定位置前插入新元素 
    else {
        linkBefore(element, node(index));
    }
}

Node<E> node(int index) {
    // 判断索引位置在链表的前半部分还是后半部分
    if (index < (size >> 1)) {
        Node<E> x = first;
        // 从头节点开始遍历，找到指定位置的节点
        for (int i = 0; i < index; i++) {
            x = x.next;
        }
        return x;
    } else {
        Node<E> x = last;
        // 从尾节点开始遍历，找到指定位置的节点
        for (int i = size - 1; i > index; i--) {
            x = x.prev;
        }
        return x;
    }
}

void linkBefore(E e, Node<E> succ) {
    // 获取前驱节点
    final Node<E> pred = succ.prev;
    // 创建新节点，并将其插入到前驱节点和后继节点之间
    final Node<E> newNode = new Node<>(pred, e, succ);
    succ.prev = newNode;
    // 如果前驱节点为 null，说明新节点成为头节点
    if (pred == null) {
        first = newNode;
    } else {
        pred.next = newNode;
    }
    size++;
    modCount++;
}
```

关键步骤示意图如下所示：
![[LinkedList 在指定位置添加元素.excalidraw|1200]]

## 扩展：序列化机制

🤔 为什么 `size`、`first` 和 `last` 等成员变量均使用 [[transient]] 关键字修饰？

🤓 由上面的继承关系图可知，虽然 `LinkedList` 实现了 `Serializable` 接口，支持序列化，但上述关键成员变量都被 `transient` 修饰，这样做是为了：
1. **节省存储空间**
    - 链表结构包含大量前驱和后继指针，直接序列化会浪费存储空间。
    - 通过自定义序列化，仅存储节点的数据部分（`item`），避免无效数据的传输。
2. **重建链表结构**
    - 反序列化时，通过节点数据重新连接链表结构，确保数据完整性。

### writeObject 方法

`writeObject` 仅序列化链表中的数据部分（`item`），省略前驱和后继指针：

```java
private void writeObject(java.io.ObjectOutputStream s) 
    throws java.io.IOException {
    // 序列化非 transient 成员变量
    s.defaultWriteObject();
    
    // 序列化链表中元素的数量
    s.writeInt(size);
    
    // 按顺序序列化每个节点的元素
    for (Node<E> x = first; x != null; x = x.next) {
        s.writeObject(x.item);
    }
}
```

### readObject 方法

`readObject` 在反序列化时，通过逐一读取序列化流中的节点数据，并通过重建每个节点来完整恢复链表结构：

```java
private void readObject(java.io.ObjectInputStream s) 
    throws java.io.IOException, ClassNotFoundException {
    // 反序列化非 transient 成员变量
    s.defaultReadObject();
    
    // 读取链表中元素的数量
    int size = s.readInt();
    
    // 逐一恢复每个节点并重新连接链表
    for (int i = 0; i < size; i++) {
        linkLast((E) s.readObject());
    }
}
```
