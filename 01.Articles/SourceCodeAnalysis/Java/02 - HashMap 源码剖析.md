---
tags:
  - Collection
  - Java
  - SourceCodeAnalysis
  - DataStructure
create_time: 2024-12-24 17:50
update_time: 2025/01/08 17:50
version: 8
---

## 基本介绍

1. HashMap 是一个散列表，存储内容为键值对（Key-Value）的映射关系。Key 和 Value 可以为 NULL，但是**只允许存在一个 Key 为 NULL 的元素**，如果再次存入 Key 为 NULL 的元素时，会用新的 value 值替换旧的 value 值；
2. HashMap 继承自 AbstractMap 抽象类，实现了 Map、Serializable 和 Cloneable 接口，其继承关系如下图所示：

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
	
	class HashMap<K, V> extends AbstractMap implements Map,Serializable,Cloneable {}
	class AbstractMap<K, V> implements Map {}
	
	interface Map<K, V> {}
	interface Serializable {}
	interface Cloneable {}
	
	@enduml
	```

3. HashMap 存取元素是**无序**的。由于[[#数组初始化 & 扩容|扩容]]操作会重新计算和放置元素，导致其存储顺序可能发生变化。
4. **非线程安全**的。多线程环境下，若存在并发修改，需要使用 `ConcurrentHashMap` 或通过同步机制保证线程安全。

## 底层数据结构（哈希表）

HashMap 底层采用 **哈希表结构（数组 + 链表 +红黑树）** 实现，结合了[[01 - 数组.canvas|数组]]和[[02 - 链表.canvas|链表]]的优点：
1. 数组优点：通过下标快速访问元素，查询效率高。
2. 链表优点：插入或删除元素时，无需移动其他元素，只需调整节点的引用。

其底层数据结构大致如下图所示：HashMap 使用一个数组作为主存储结构，其中每个元素是一个链表或红黑树的头节点，数据存储单元类型为 `Node<K, V>`。
![[HashMap 底层数据结构.excalidraw| 1500]]

`Node` 是存储键值对的基础单元，包含以下字段：
- **`hash`**：存储 `key` 的哈希值。
- **`key` 和 `value`**：存储键值对数据。
- **`next`**：指向链表的下一个节点。

其代码实现如下所示：

```java
static class Node<K,V> implements Map.Entry<K,V> {
    // key的hash值
    final int hash;
    // key值
    final K key;
    // value值
    V value;
    // 当前节点的下一个节点
    Node<K,V> next;

    Node(int hash, K key, V value, Node<K,V> next) {
        this.hash = hash;
        this.key = key;
        this.value = value;
        this.next = next;
    }

    public final K getKey()        { return key; }
    public final V getValue()      { return value; }
    public final String toString() { return key + "=" + value; }

    public final int hashCode() {
        return Objects.hashCode(key) ^ Objects.hashCode(value);
    }

    public final V setValue(V newValue) {
        V oldValue = value;
        value = newValue;
        return oldValue;
    }

    public final boolean equals(Object o) {
        if (o == this)
            return true;
        if (o instanceof Map.Entry) {
            Map.Entry<?,?> e = (Map.Entry<?,?>)o;
            if (Objects.equals(key, e.getKey()) &&
                Objects.equals(value, e.getValue()))
                return true;
        }
        return false;
    }
}
```

数据存储（即[[#添加元素]]）过程：
- **哈希计算**：
    - 使用 `hash` 方法计算 `key` 的哈希值。
    - 通过 `(n - 1) & hash` 公式（其中 `n` 为数组长度）确定元素在数组中的索引下标。
- **哈希冲突（碰撞）**：
    - 当两个元素计算出的数组索引下标相同时，后插入的元素会作为链表的后继节点存储。
    - 链表节点通过 `next` 字段串联起来。
- **链表到红黑树转换**：
    - 链表的查找效率为 O (n)，链表长度较长时会显著降低查询效率。
    - 当 **链表长度 > 8（TREEIFY_THRESHOLD）且数组长度 >= 64（MIN_TREEIFY_CAPACITY）** 时，会将链表转换为红黑树，查询效率提升到 O (logN)。
- **扩容优化**：
    - 如果数组长度 < 64，即使链表长度超过 8，也不会转换为红黑树，而是通过[[#数组初始化 & 扩容|扩容]]操作拆分链表：
        - **低位链表**：节点索引不变。
        - **高位链表**：节点索引增加原数组长度。

当链表转换为红黑树时，节点会使用 `TreeNode` 表示，其结构如下：

```java
static final class TreeNode<K,V> extends LinkedHashMap.Entry<K,V> {
    // 当前节点的父节点
    TreeNode<K,V> parent;
    // 当前节点的左节点
    TreeNode<K,V> left;
    // 当前节点的右节点
    TreeNode<K,V> right;
    // 当前节点在双向链表中的上一个节点
    TreeNode<K,V> prev;
    // 当前节点的颜色(红/黑)
    boolean red;
    TreeNode(int hash, K key, V val, Node<K,V> next) {
        super(hash, key, val, next);
    }
    ...
}

static class Entry<K,V> extends HashMap.Node<K,V> {  
    Entry<K,V> before, after;  
    Entry(int hash, K key, V value, Node<K,V> next) {  
        super(hash, key, value, next);  
    }
}
```

红黑树是一种自平衡二叉查找树，能够确保在最坏情况下查询效率为 O (logN)。

## 重要属性

### 静态常量

```java
// 默认初始化容量（16）
static final int DEFAULT_INITIAL_CAPACITY = 1 << 4;

// 默认加载因子
static final float DEFAULT_LOAD_FACTOR = 0.75f;

// 链表转换为红黑树的阈值
static final int TREEIFY_THRESHOLD = 8;

// 链表树化时的最小数组容量
static final int MIN_TREEIFY_CAPACITY = 64;
```

1. DEFAULT_INITIAL_CAPACITY：默认数组容量。当通过无参构造器初始化 HashMap 时，数组的初始容量为 16。
2. DEFAULT_LOAD_FACTOR：默认加载因子（0.75）。决定何时触发扩容，表示数组的填充度阈值。
3. TREEIFY_THRESHOLD：链表长度的树化阈值（8）。**当链表长度超过 8 时，会<u>尝试</u>将链表转换为红黑树**。
4. MIN_TREEIFY_CAPACITY：最小树化数组容量（64）。**链表转换为红黑树的前提是数组容量必须 >= 64，否则只会触发扩容而非树化**。

> [!important] 链表树化条件
> **数组长度 ≥ 64（MIN_TREEIFY_CAPACITY）&& 链表长度 > 8（TREEIFY_THRESHOLD）** 时，链表才会转换为红黑树。

### 成员变量

```java
// HashMap 中存储的键值对数量
transient int size;

// 扩容阈值（数组容量 * 加载因子）
int threshold;

// 存储数据的数组，数组元素类型为 Node<K,V>
transient Node<K,V>[] table;

// 加载因子（扩容因子）
final float loadFactor;

// 快速失败机制的修改计数器
transient int modCount;
```

1. **`size`**：
   - 表示 `HashMap` 中实际存储的键值对数量，不包括空槽位。
   - 与数组长度不同，因为数组中的部分槽位可能形成链表或红黑树。
2. **`threshold`**：
   - 扩容阈值，决定数组何时需要扩容，计算公式为当前数组容量乘以加载因子：`threshold = capacity * loadFactor`。
   - 例如，初始容量为 16，加载因子为 0.75，则扩容阈值为 `16 * 0.75 = 12`。当键值对数量 ≥ 12 时触发扩容。
3. `table`：
   - 用于存储数据的核心数组，类型为 `Node<K, V>[]`，其元素可能为空或指向链表/红黑树。
   - 使用 `transient` 修饰，表示不会直接参与序列化，而是通过自定义序列化方法保存和恢复数据（见[[#序列化机制]]）。
4. **`loadFactor`**：
   - 加载因子，表示允许填充数组的比例，用于控制扩容的频率。
   - 默认值为 0.75，在性能和内存占用之间提供了良好的平衡：
     - 加载因子越高（如 1.0）：减少扩容次数，节省内存，但增加哈希碰撞的可能性，导致链表长度增加，查询性能下降。
     - 加载因子越低（如 0.5）：降低哈希碰撞概率，提高查询效率，但会频繁扩容，浪费内存。
     那么，为什么会选择 0.75 呢？为什么不是其他数？背后是有什么考虑吗？在源码中有这样一段描述：

	```java
	/**
	  As a general rule, the default load factor (.75) offers a good tradeoff between time and space costs.
	  Higher values decrease the space overhead but increase the lookup cost (reflected in most of the operations of the HashMap class, including get and put).
	  The expected number of entries in the map and its load factor should be taken into account when setting its initial capacity,
	  so as to minimize the number of rehash operations.
	  If the initial capacity is greater than the maximum number of entries divided by the load factor, no rehash operations will ever occur. 
	*/
	```

   翻译过来的大致意思是：通常，默认加载因子（0.75）在时间和空间成本之间提供了良好折中。
   - 较高的加载因子可以减少空间占用，但会增加查找成本（尤其是 `get` 和 `put` 操作中的查找时间）。
   - 应根据预计存储的键值对数量和加载因子合理设置初始容量，以尽量减少 **重新哈希（rehash）** 操作的次数。
   - 如果初始容量大于键值对总数除以加载因子，则不会触发任何 rehash 操作。
5. **`modCount`**：
   - 记录结构修改次数（如 `put`、`remove` 等操作）。
   - 用于实现[[快速失败机制（fail-fast）]]：在遍历集合时，如果检测到集合结构被修改（如通过非迭代器的方式 `put` 或 `remove` 元素），会立刻抛出 `ConcurrentModificationException` 异常，避免因并发修改导致的数据不一致或逻辑错误。
   - 在 `java.util` 包的集合类（如 `ArrayList`、`LinkedList`、`HashMap` 等）中广泛使用 `modCount` 变量来支持快速失败机制。
   - 快速失败机制仅用于检测单线程中的意外修改，并不适用于多线程环境。在多线程场景下，需要使用 `ConcurrentHashMap` 或通过外部同步机制（如 `Collections.synchronizedMap`）保证线程安全。

## 主要操作

### 初始化✨

> [!important]
>
> 在构造函数中，`table` 并未立即初始化，而是**延迟到首次[[#添加元素]]时才进行初始化**。这种设计避免了在未添加任何元素时浪费内存空间。

```java
public HashMap(int initialCapacity, float loadFactor) {
    if (initialCapacity < 0)
        throw new IllegalArgumentException("Illegal initial capacity: " + initialCapacity);
    if (initialCapacity > MAXIMUM_CAPACITY)
        initialCapacity = MAXIMUM_CAPACITY;
    if (loadFactor <= 0 || Float.isNaN(loadFactor))
        throw new IllegalArgumentException("Illegal load factor: " + loadFactor);
    this.loadFactor = loadFactor;
    this.threshold = tableSizeFor(initialCapacity);
}
```

构造函数分析如下：

1. 校验参数 `initialCapacity`（初始容量）和 `loadFactor`（加载因子）的合法性，不符合要求时抛出异常。
2. 调用 [[#tableSizeFor 方法]]，计算 >= initialCapacity 的最小 2 的幂（如 16、32），以确保数组容量始终为 2 的幂次方。
3. `threshold` 暂时保存了计算出的数组容量，而不是正常的扩容阈值（`capacity * loadFactor`）。这是因为数组尚未初始化，只有在首次[[#添加元素]]时才会： ^f1dccd
   - 利用 `threshold` 初始化数组容量；
   - 重新计算正确的扩容阈值 `capacity * loadFactor`。

#### tableSizeFor 方法

用于计算 >= cap 的最小 2 的幂。举个栗子：假设传入的 `cap = 17`，此时 `tableSizeFor` 方法会返回 >= 17 的最小 2 的整数幂，即 32。因为 2<sup>4</sup>=16 < 17，所以选择 2<sup>5</sup>=32 > 17。

```java
static final int tableSizeFor(int cap) {
	int n = cap - 1;
	n |= n >>> 1;
	n |= n >>> 2;
	n |= n >>> 4;
	n |= n >>> 8;
	n |= n >>> 16;
	return (n < 0) ? 1 : (n >= MAXIMUM_CAPACITY) ? MAXIMUM_CAPACITY : n + 1;
}
```

逻辑分析：
1. **`cap - 1`**：为什么要执行 cap - 1 操作呢？因为若 `cap` 本身就是 2 的幂，此步骤可以确保不会计算出其两倍的值。例如，`cap=16` 时，避免返回 32。
2. **位运算处理**：通过逐步右移和按位或操作，将高位的 1 扩展到低位，最终使所有位都为 1。例如：
   - 初始：`cap - 1 = 17 - 1 = 16 (0b10000)`
   - 执行后：`n = 31 (0b11111)`，最终返回 `n + 1 = 32`。
3. **边界处理**：返回值始终在 [1, `MAXIMUM_CAPACITY`] 范围内。

示意图如下所示：
![[寻找2的幂次方最小值的示意图.excalidraw | 700]]

### 添加元素

`put` 方法源码如下所示：

```java
public V put(K key, V value) {
	return putVal(hash(key), key, value, false, true);
}
```

#### 扰动函数

`put` 方法通过 `hash` 函数计算 key 的哈希值，其源码如下所示：

```java
static final int hash(Object key) {
  int h;
  return (key == null) ? 0 : (h = key.hashCode()) ^ (h >>> 16);
}
```

- 如果 `key` 为 `null`，直接返回 `0`。
- 如果 `key` 不为 `null`，通过公式 `(h = key. hashCode ()) ^ (h >>> 16)` 计算哈希值：
  1. 先获取 `key` 的哈希值 `h`。
  2. 再将 `h` 无符号右移 16 位（高位补 0），与 `h` 本身按位异或。
  3. 高 16 位保持不变（与 0 异或仍为自身），而低 16 位与高 16 位发生异或。

这种设计的目的在于**增加随机性，均匀分布散列结果，减少哈希碰撞**。通过引入高位参与散列计算，避免了高位信息被浪费而导致的碰撞问题，从而提升了哈希表的效率。

#### 计算数组下标

数组下标的计算公式为：`index = hash & (length - 1)`。

这也正好解释了为什么数组容量必须是 2 的整数幂，因为这样 `length - 1` 正好相当于一个 "低位掩码"，通过 ` & ` 操作之后，散列值的高位全部会被清零，仅保留低位值作为数组下标。

举个栗子：初始长度为 16，为例 `length - 1 = 15`，其二进制表示为 `0000 0000 0000 0000 0000 0000 0000 1111`。将某个散列值 `hash` 与其进行 `&` 操作时，结果仅保留了 `hash` 值的低 4 位：
![[HashMap 数组下标计算.excalidraw|800]]
最终得到的结果正是数组的下标。通过这种方式，可以高效、均匀地将哈希值映射到数组的索引范围内。

#### 添加元素主流程✨

1. 检查数组 `table` 是否已初始化：
   - 若未初始化（`tab == null || tab. length == 0`），则调用 `resize` 方法先完成初始化。
2. 根据公式 `index = (n - 1) & hash` 计算插入位置索引 `i`，并取出该位置节点 `p = tab[i]`：
   - 若 `p == null`（位置为空），直接插入新节点，**元素个数 size + 1**。
   - 若 `p != null`（位置已有节点），按以下情况处理：
     1. 若 `p` 的哈希值和键值与新节点相同，表示是同一节点 [[#^4ae9ff]]，**指针 e 指向该节点**。
     2. 若 `p` 是红黑树节点，则调用红黑树插入逻辑，找到目标节点后，**指针 e 指向该节点**。
     3. 若 `p` 是链表节点，则遍历链表：
        - 找到相同节点，**指针 e 指向该节点**；
        - 未找到相同节点，就将新节点添加到链表末尾。若链表长度超出阈值（8），且数组长度 >= 64，链表转化为红黑树。**元素个数 size + 1**。
3. 如果找到相同节点（`e != null`），判断是否需要覆盖旧值：
   - 若 `onlyIfAbsent == false` 或 `oldValue == null`，则用新值覆盖旧值，并返回旧值。
   - 否则直接返回旧值。
4. 若为新节点（`e == null`），触发以下操作：
   - **modCount + 1** 标记结构变化。
   - 如果节点总数超过扩容阈值（`size > threshold`），调用 `resize` 方法扩容。
5. 返回结果：
   - 若插入的是新节点，则返回 `null`；
   - 否则返回旧值。

> [!tip]
> **使用自定义对象作为 key 时，需要重写 `hashCode` 和 `equals` 方法：**。
> - `hashCode` 决定对象的哈希分布。
> - `equals` 用于判断哈希冲突时是否为同一对象。

^4ae9ff

```java
// 参数 onlyIfAbsent 表示是否覆盖已有值，true 不覆盖，false 覆盖，默认为 falseV putVal(int hash, K key, V value, boolean onlyIfAbsent, boolean evict) {  
  // tab: 存放节点的数组，n: 数组长度，i: 目标插入位置索引，p: 目标位置的节点  
  Node<K, V>[] tab;  
  Node<K, V> p;  
  int n, i;  
  // 若 table 未初始化或长度为 0，则调用 resize 方法初始化  
  if ((tab = table) == null || (n = tab.length) == 0) n = (tab = resize()).length;  
  // 计算数组下标 index = (n - 1) & hash，并检查该位置是否已有元素  
  if ((p = tab[i = (n - 1) & hash]) == null)  
    // 若当前位置为空，直接插入新节点  
    tab[i] = newNode(hash, key, value, null);  
  else {  
    // e: 临时存储目标节点，k: 临时存储 key    Node<K, V> e;  
    K k;  
    // 若当前位置节点的 hash 和 key 与新节点相同，则表示是同一节点  
    if (p.hash == hash && ((k = p.key) == key || (key != null && key.equals(k)))) e = p;  
      // 若当前位置为红黑树节点，则调用树节点插入方法  
    else if (p instanceof TreeNode) e = ((TreeNode<K, V>) p).putTreeVal(this, tab, hash, key, value);  
      // 否则，处理链表节点插入逻辑  
    else {  
      // 遍历链表，若找到相同节点则停止  
      for (int binCount = 0; ; ++binCount) {  
        // 遍历到链表尾部  
        if ((e = p.next) == null) {  
          // 尾插法新增节点  
          p.next = newNode(hash, key, value, null);  
          // 如果链表长度超过树化阈值，则尝试转化为红黑树  
          if (binCount >= TREEIFY_THRESHOLD - 1) treeifyBin(tab, hash);  
          break;  
        }        if (e.hash == hash && ((k = e.key) == key || (key != null && key.equals(k))))  
          // 找到相同节点，停止插入  
          break;  
        p = e;  
      }    }    // 若找到相同节点，根据 onlyIfAbsent 判断是否覆盖旧值  
    if (e != null) {  
      V oldValue = e.value;  
      if (!onlyIfAbsent || oldValue == null)  
        // 覆盖旧值  
        e.value = value;  
      afterNodeAccess(e);  
      // 返回旧值  
      return oldValue;  
    }  
  }  
  // 更新结构修改计数器  
  ++modCount;  
  // 节点数量加一，检查是否需要扩容  
  if (++size > threshold) resize();  
  afterNodeInsertion(evict);  
  // 返回 null，表示插入的是新节点  
  return null;  
}
```

#### 数组初始化 & 扩容✨

> [!important]
> `resize` 方法主要用于<strong style="font-size:19px;">初始化数组</strong>或<strong style="font-size:19px;">扩容并迁移数据</strong>。

1. 确定新数组的容量和扩容阈值
   1. **旧数组容量 `oldCap > 0`**，说明数组已经初始化过，当前流程为扩容：
      - 新数组容量： `newCap = oldCap << 1`，（即旧数组容量的两倍）。
      - 新扩容阈值： `newThr = oldThr << 1`（即旧扩容阈值的两倍）。
   2. **旧扩容阈值 > 0 && 旧数组容量 = 0**，说明数组尚未初始化，但已通过有参构造器指定了初始容量和加载因子，当前流程为数组初始化：
      - 新数组容量：直接使用 `oldThr` 的值作为 `newCap`，即目标初始容量。 [[#^f1dccd]]
      - 新扩容阈值：根据加载因子计算，`newThr = newCap * loadFactor`。
   3. **旧扩容阈值 = 0 && 旧数组容量 = 0**，说明数组尚未初始化，且未通过构造器指定初始容量，当前流程为默认初始化：
      - 新数组容量： `newCap = DEFAULT_INITIAL_CAPACITY = 16`。
      - 新扩容阈值： `newThr = DEFAULT_INITIAL_CAPACITY * DEFAULT_LOAD_FACTOR = 12`。
2. 创建新数组 & 更新指针
   - 用新数组容量 `newCap` 创建数组 `newTab`，并将其赋值给 `table`。
   - 同时将新扩容阈值 `newThr` 更新到 `threshold`。
3. 迁移数据（将旧数组的数据拷贝到新数组），遍历旧数组的每个位置 `j`，判断节点类型并进行相应迁移：
   1. **位置为空**：直接跳过。
   2. **仅有一个节点**：无需拆分，直接计算新索引并插入新数组。
   3. **链表结构**：根据节点的高位 bit 拆分为 **低位链表** 和 **高位链表**：[[#^e07431]]
      - 低位链表：新索引 = 原索引位置。
      - 高位链表：新索引 = 原索引位置 + 原数组长度。
   4. **红黑树结构**：调用树节点的 `split` 方法完成迁移。

在迁移数据时，原链表会被拆分为<u>低位链表</u>和<u>高位链表</u>，然后分别插入到新数组的<u>当前索引位置</u>和<u>当前索引位置 + 原数组长度</u>。这个结论是怎么来的呢？举个栗子，如下图所示：（a）和 (b) 分别表示扩容前和扩容后 key1 和 key2 在数组中的索引位置。
![image.png](https://cdn.jsdelivr.net/gh/xihuanxiaorang/img2/202412162334584.png) ^e07431
- 扩容前：
	- 如 (a) 所示，key1 和 key2 的 hash 值后四位相同，所以在旧数组中计算出的索引位置相同，都等于 5，它们在同一个链表上。
- 扩容后：
  ![image.png](https://cdn.jsdelivr.net/gh/xihuanxiaorang/img2/202412162335948.png)
	- 数组长度 `n` 扩展为原来的两倍（从 16 到 32），此时 `n-1` 的二进制表示在高位多了 1 个 bit 位，用于区分高位与低位节点。
	- 新数组下标计算的变化：
	  - `key1` 的索引位置不变，仍为 5。
	  - `key2` 的索引位置变为 `21 = 5 + 16`（原索引位置 + 原数组长度）。
	- 如（b）所示，`key1` 和 `key2` 被分配到了不同的链表位置。

扩容时，只需要根据节点 hash 值的高位 bit 来判断新索引位置：
- **高位 bit 为 0**：节点仍位于原索引位置。
- **高位 bit 为 1**：节点的新位置为原索引位置加上原数组长度。

```java
final Node<K,V>[] resize() {
 // 保存旧数组到 oldTab
 Node<K,V>[] oldTab = table;
 // 保存旧数组容量到 oldCap
 int oldCap = (oldTab == null) ? 0 : oldTab.length;
 // 保存旧扩容阈值到 oldThr
 int oldThr = threshold;
 // 预定义新数组容量和扩容阈值
 int newCap, newThr = 0;
 
 // 如果旧数组容量大于 0，说明已经初始化过
 if (oldCap > 0) {
     // 如果旧数组容量已达到最大容量限制，则不再扩容
     if (oldCap >= MAXIMUM_CAPACITY) {
	     // 设置阈值为整数最大值 2^31-1
         threshold = Integer.MAX_value;
         // 返回旧数组
         return oldTab;
     }
     // 否则扩容为旧数组容量的两倍，但不超过最大容量
     else if ((newCap = oldCap << 1) < MAXIMUM_CAPACITY && oldCap >= DEFAULT_INITIAL_CAPACITY)
         // 扩容阈值也扩大为原来的两倍
         newThr = oldThr << 1;
 }
 // 如果旧扩容阈值 > 0 && 旧数组容量 = 0，则说明数组尚未初始化，但已通过有参构造器指定了初始容量和加载因子
 else if (oldThr > 0)
	 // 新数组容量为旧扩容阈值
     newCap = oldThr;
 // 默认初始化流程（无参构造器）
 else {
	 // 默认数组容量 16
     newCap = DEFAULT_INITIAL_CAPACITY;
     // 默认扩容阈值 = 16 * 0.75 = 12
     newThr = (int)(DEFAULT_LOAD_FACTOR * DEFAULT_INITIAL_CAPACITY);
 }
 // 计算新阈值（如果未设置）
 if (newThr == 0) {
     // 扩容阀值公式：数组容量 * 加载因子
     float ft = (float)newCap * loadFactor;
     newThr = (newCap < MAXIMUM_CAPACITY && ft < (float)MAXIMUM_CAPACITY ?
               (int)ft : Integer.MAX_value);
 }
 // 更新扩容阈值
 threshold = newThr;
 // 初始化新数组
 @SuppressWarnings({"rawtypes","unchecked"})
 Node<K,V>[] newTab = (Node<K,V>[])new Node[newCap];
 table = newTab;
 // 如果旧数组不为空，迁移数据到新数组
 if (oldTab != null) {
     for (int j = 0; j < oldCap; ++j) {
         Node<K,V> e;
         // 旧数组当前位置有节点
         if ((e = oldTab[j]) != null) {
	         // 清空旧数组当前位置
             oldTab[j] = null;
             // 当前节点无后续节点
             if (e.next == null)
	               // 计算新索引并插入新数组
                 newTab[e.hash & (newCap - 1)] = e;
             // 当前节点是红黑树
             else if (e instanceof TreeNode)
                 // 分裂红黑树
                 ((TreeNode<K,V>)e).split(this, newTab, j, oldCap);
             // 当前节点是链表
             else {
	             // 拆分链表为低位链表和高位链表
                 Node<K,V> loHead = null, loTail = null;
                 // hiXXX表示原数组下标+原数组长度的位置处的链表，高位链表
                 Node<K,V> hiHead = null, hiTail = null;
                 Node<K,V> next;
                 do {
	                 // 保存下一个节点
                     next = e.next;
                     // 判断当前节点位于低位链表还是高位链表
                     if ((e.hash & oldCap) == 0) {
                         if (loTail == null)
                             loHead = e;
                         else
                             loTail.next = e;
                         loTail = e;
                     }
                     else {
                         if (hiTail == null)
                             hiHead = e;
                         else
                             hiTail.next = e;
                         hiTail = e;
                     }
                 } while ((e = next) != null);
                 // 将低位链表插入到新数组原位置
                 if (loTail != null) {
                     loTail.next = null;
                     newTab[j] = loHead;
                 }
                 // 将高位链表插入到新数组原位置 + 旧数组容量
                 if (hiTail != null) {
                     hiTail.next = null;
                     newTab[j + oldCap] = hiHead;
                 }
             }
         }
     }
 }
 // 返回新数组
 return newTab;
}
```

### 获取元素

1. 初步检查条件, 如果以下任意条件不满足，则直接返回 `null`：
   - 数组是否已初始化 (`table != null`)。
   - 数组长度是否大于 0 (`n > 0`)。
   - 目标下标位置的元素是否存在 (`tab[(n - 1) & hash] != null`)。
2. 定位目标节点：
   - 检查首节点 (`first`)： [[#^4ae9ff]]
     - 比较其 `hash` 值是否相等。
     - 检查 `key` 引用是否相同或通过 `equals` 方法判定为相等。
   - 若匹配，则直接返回该节点。
3. 处理链表或树结构：
   - 若首节点不匹配，但存在下一个节点 (`first. next != null`)，则进一步判断：
     - 如果首节点是树节点 (`TreeNode`)，调用树节点的 `getTreeNode` 方法。
     - 如果是链表结构，遍历链表节点：
       - 对每个节点，逐一比较 `hash` 值和 `key` 值，找到匹配的节点则返回。
   - 遍历结束后仍未匹配，则返回 `null`。

```java
public V get(Object key) {
  Node<K,V> e;
  return (e = getNode(hash(key), key)) == null ? null : e.value;
}

final Node<K,V> getNode(int hash, Object key) {
  Node<K,V>[] tab; Node<K,V> first, e; int n; K k;
  // 检查基本条件：数组初始化、长度、目标下标位置是否有元素
  if ((tab = table) != null && (n = tab.length) > 0 &&
      (first = tab[(n - 1) & hash]) != null) {
      // 检查首节点是否匹配目标
      if (first.hash == hash && // always check first node
          ((k = first.key) == key || (key != null && key.equals(k))))
          return first;
      // 如果首节点不匹配，但存在下一个节点
      if ((e = first.next) != null) {
      	  // 判断是否为树节点
          if (first instanceof TreeNode)
              return ((TreeNode<K,V>)first).getTreeNode(hash, key);
          // 遍历链表查找匹配节点
          do {
              if (e.hash == hash &&
                  ((k = e.key) == key || (key != null && key.equals(k))))
                  return e;
          } while ((e = e.next) != null);
      }
  }
  return null;
}
```

### 删除元素

`remove` 方法的前半部分逻辑与 `get` 方法一致，用于定位目标元素。具体描述可参考[[#获取元素]]，这里直接讨论目标元素找到后的处理逻辑。找到目标元素后，根据其所在结构类型执行删除操作：

1. 如果目标元素是红黑树中的节点，调用红黑树的删除方法完成操作。
2. 如果目标元素是当前下标位置的首节点，用目标元素的后继节点替换当前下标位置处的头节点，实现删除。
3. 如果目标元素在链表中：调整链表结构，使目标元素的前驱节点的 `next` 指向目标元素的后继节点，实现删除。示意图如下所示：
   ![[单向链表-删除元素.excalidraw| 600]]

```java
public V remove(Object key) {
  Node<K,V> e;
  return (e = removeNode(hash(key), key, null, false, true)) == null ?
      null : e.value;
}

final Node<K,V> removeNode(int hash, Object key, Object value,
                               boolean matchValue, boolean movable) {
  Node<K,V>[] tab; Node<K,V> p; int n, index;
  // 确认表非空，长度有效，且当前索引位置有元素
  if ((tab = table) != null && (n = tab.length) > 0 && (p = tab[index = (n - 1) & hash]) != null) {
      Node<K,V> node = null, e; K k; V v;
      // 检查首节点是否为目标节点
      if (p.hash == hash && ((k = p.key) == key || (key != null && key.equals(k))))
          node = p;
      // 遍历链表或树结构寻找目标节点
      else if ((e = p.next) != null) {
          if (p instanceof TreeNode)
              node = ((TreeNode<K,V>)p).getTreeNode(hash, key);
          else {
              do {
                  if (e.hash == hash &&
                      ((k = e.key) == key ||
                       (key != null && key.equals(k)))) {
                      node = e;
                      break;
                  }
                  p = e;
              } while ((e = e.next) != null);
          }
      }
      // 删除节点
      if (node != null && (!matchValue || (v = node.value) == value || (value != null && value.equals(v)))) {
          // 红黑树节点删除
          if (node instanceof TreeNode)
              ((TreeNode<K,V>)node).removeTreeNode(this, tab, movable);
          // 删除首节点
          else if (node == p)
              tab[index] = node.next;
          // 删除链表节点
          else
              p.next = node.next;
		  // 更新结构修改计数器
          ++modCount;
          // 节点数量加一
          --size;
          afterNodeRemoval(node);
          return node;
      }
  }
  return null;
}
```

## 扩展

### 序列化机制

🤔 为什么 `table` 和其他字段使用 [[transient]] 修饰？

🤓 `table` 是 `HashMap` 存储数据的核心数组，但在序列化时不会直接保存，而是通过 `transient` 修饰跳过。这种设计有以下两个主要目的：
1. **节省空间**
    - `table` 中包含大量未使用的空槽位，直接序列化整个数组会浪费存储空间。
    - 自定义序列化逻辑可以仅保存实际存在的键值对，避免存储无效数据，从而减少存储和传输的开销。
2. **保证跨 JVM 一致性**
    - `HashMap` 的数据存储位置依赖于键的 `hashCode`，而 `Object.hashCode()` 是基于 native 实现的，在不同 JVM 上可能有不同的结果。
    - 通过序列化键值对而非直接保存数组，反序列化时重新计算哈希值并重新存储数据，可以确保在不同 JVM 环境下的数据一致性。

#### writeObject 方法

通过自定义 `writeObject` 方法实现序列化控制，避免直接序列化整个 `table` 数组，从而提升存储效率并保证数据一致性。

1. **保存元数据**
    - 序列化非 `transient` 字段，如扩容阈值（`threshold`）和加载因子（`loadFactor`）。
2. **保存键值对**
    - 遍历 `table` 数组，将每个非空槽位中的链表或红黑树节点逐一序列化。

```java
private void writeObject(java.io.ObjectOutputStream s) throws IOException {  
    // 获取当前数组容量（槽位数）
    int buckets = capacity();  

    // 序列化非 transient 字段，如 loadFactor 和 threshold
    s.defaultWriteObject();  

    // 写入槽位数量，用于反序列化时恢复 HashMap 的结构
    s.writeInt(buckets);  

    // 写入实际存储的键值对数量
    s.writeInt(size);     

    // 写入所有键值对
    internalWriteEntries(s);  
}

final int capacity() {  
    // 如果 table 不为空，返回数组长度（槽位数）
    // 如果 table 未初始化但 threshold > 0，返回扩容阈值
    // 否则返回默认初始容量 DEFAULT_INITIAL_CAPACITY
    return (table != null) ? table.length :  
           (threshold > 0) ? threshold :  
           DEFAULT_INITIAL_CAPACITY;  
}

void internalWriteEntries(java.io.ObjectOutputStream s) throws IOException {
    // 存储槽位的数组
    Node<K,V>[] tab;  
    // 如果有键值对存在且 table 不为空
    if (size > 0 && (tab = table) != null) {  
        // 遍历槽位数组
        for (Node<K,V> e : tab) {             
            // 遍历槽位中的链表或红黑树节点
            for (; e != null; e = e.next) {   
                // 序列化键
                s.writeObject(e.key);         
                // 序列化值
                s.writeObject(e.value);       
            }
        }
    }
}
```

#### readObject 方法

`readObject` 是自定义的反序列化方法，用于根据序列化流中的数据重建 `HashMap` 的元数据和存储内容。
1. **读取元数据**
    - 通过 `defaultReadObject` 方法读取非 `transient` 字段（如 `threshold` 和 `loadFactor`）。
    - 读取槽位数量（`buckets`）和键值对数量（`size`），为恢复数据结构提供基础信息。
2. **重建数据结构**
    - 初始化 `table` 数组，根据 `loadFactor` 和键值对数量计算扩容阈值和容量。
    - 遍历键值对，重新计算哈希值并将其存入 `table`。

```java
private void readObject(ObjectInputStream s)
  throws IOException, ClassNotFoundException {

  ObjectInputStream.GetField fields = s.readFields();

  // Read loadFactor (ignore threshold)
  float lf = fields.get("loadFactor", 0.75f);
  if (lf <= 0 || Float.isNaN(lf))
    throw new InvalidObjectException("Illegal load factor: " + lf);

  lf = Math.min(Math.max(0.25f, lf), 4.0f);
  HashMap.UnsafeHolder.putLoadFactor(this, lf);

  reinitialize();

  s.readInt();                // Read and ignore number of buckets
  int mappings = s.readInt(); // Read number of mappings (size)
  if (mappings < 0) {
    throw new InvalidObjectException("Illegal mappings count: " + mappings);
  } else if (mappings == 0) {
    // use defaults
  } else if (mappings > 0) {
    float fc = (float)mappings / lf + 1.0f;
    int cap = ((fc < DEFAULT_INITIAL_CAPACITY) ?
               DEFAULT_INITIAL_CAPACITY :
               (fc >= MAXIMUM_CAPACITY) ?
               MAXIMUM_CAPACITY :
               tableSizeFor((int)fc));
    float ft = (float)cap * lf;
    threshold = ((cap < MAXIMUM_CAPACITY && ft < MAXIMUM_CAPACITY) ?
                 (int)ft : Integer.MAX_VALUE);

    // Check Map.Entry[].class since it's the nearest public type to
    // what we're actually creating.
    SharedSecrets.getJavaObjectInputStreamAccess().checkArray(s, Map.Entry[].class, cap);
    @SuppressWarnings({"rawtypes","unchecked"})
    Node<K,V>[] tab = (Node<K,V>[])new Node[cap];
    table = tab;

    // Read the keys and values, and put the mappings in the HashMap
    for (int i = 0; i < mappings; i++) {
      @SuppressWarnings("unchecked")
      K key = (K) s.readObject();
      @SuppressWarnings("unchecked")
      V value = (V) s.readObject();
      putVal(hash(key), key, value, false, false);
    }
  }
}
```

```java
private void readObject(ObjectInputStream s) throws IOException, ClassNotFoundException {

  // 读取非 transient 字段，如 loadFactor 和 threshold
  ObjectInputStream.GetField fields = s.readFields();

  // 获取加载因子 loadFactor，默认值为 0.75
  float lf = fields.get("loadFactor", 0.75f);
  if (lf <= 0 || Float.isNaN(lf)) {
    throw new InvalidObjectException("Illegal load factor: " + lf);
  }

  // 限制加载因子的范围在 [0.25, 4.0]
  lf = Math.min(Math.max(0.25f, lf), 4.0f);

  // 设置加载因子到当前对象
  HashMap.UnsafeHolder.putLoadFactor(this, lf);

  // 初始化 HashMap 的结构
  reinitialize();

  // 读取槽位数量（buckets），但忽略实际值
  s.readInt();

  // 读取实际存储的键值对数量
  int mappings = s.readInt();
  if (mappings < 0) {
    throw new InvalidObjectException("Illegal mappings count: " + mappings);
  }

  // 如果有存储的键值对，则重新初始化结构
  if (mappings > 0) {
    // 计算扩容阈值和容量
    float fc = (float)mappings / lf + 1.0f;
    int cap = ((fc < DEFAULT_INITIAL_CAPACITY) ?
               DEFAULT_INITIAL_CAPACITY :
               (fc >= MAXIMUM_CAPACITY) ?
               MAXIMUM_CAPACITY :
               tableSizeFor((int)fc));

    // 设置扩容阈值，确保不会超过最大容量
    threshold = Math.min((int)(cap * lf), Integer.MAX_VALUE);

    // 初始化存储数组 table
    @SuppressWarnings({"rawtypes", "unchecked"})
    Node<K,V>[] tab = (Node<K,V>[]) new Node[cap];
    table = tab;

    // 逐个读取键值对并插入 HashMap
    for (int i = 0; i < mappings; i++) {
      @SuppressWarnings("unchecked")
      // 读取键
      K key = (K) s.readObject();
      @SuppressWarnings("unchecked")
      // 读取值
      V value = (V) s.readObject();
      // 插入键值对 
      putVal(hash(key), key, value, false, false); 
    }
  }
}
```
