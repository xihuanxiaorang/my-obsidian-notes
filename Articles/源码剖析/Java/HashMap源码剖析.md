---
tags:
  - Collection
  - Java
  - SourceCodeAnalysis
create_time: 2024-12-24 17:50
update_time: 2024-12-24 17:50
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

HashMap 底层采用 **哈希表结构（数组+链表+红黑树）** 实现，结合了数组和链表的优点：
1. 数组优点：通过下标快速访问元素，查询效率高。
2. 链表优点：插入或删除元素时，无需移动其他元素，只需调整节点的引用。

其底层数据结构大致如下图所示：HashMap 使用一个数组作为主存储结构，其中每个元素是一个链表或红黑树的头节点，数据存储单元类型为 `Node<K, V>`。
![[HashMap底层数据结构.excalidraw | 1500]]

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

数据存储过程：
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
2. DEFAULT_LOAD_FACTOR：默认加载因子（0.75）。决定何时触发扩容，表示**数组的填充度阈值**。
3. TREEIFY_THRESHOLD：链表长度的树化阈值（8）。当链表长度超过 8 时，会尝试将链表转换为红黑树。
4. MIN_TREEIFY_CAPACITY：最小树化数组容量（64）。链表转换为红黑树的前提是数组容量必须 ≥ 64，否则会触发扩容而非树化。

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

1. **`size`**：存储的键值对数量。注意，`size` 记录的是实际存储的键值对总数，而非数组的长度（因为数组中的某些索引可能已形成链表或红黑树）。
2. **`modCount`**：结构修改次数。用于实现**快速失败机制 (fail-fast)**。当遍历集合过程中，若发现集合结构被修改（如 `put` 或 `remove` 操作），会立刻抛出 `ConcurrentModificationException`，避免因并发修改导致的不一致性。在 `java.util` 包下的集合类如 `ArrayList`、`HashMap` 均支持快速失败机制，但并不适用于多线程环境。
3. **`threshold`**：扩容阈值，决定数组何时需要扩容，计算公式为：threshold = capacity * loadFactor；例如，初始容量为 16，加载因子为 0.75，则扩容阈值为 `16 * 0.75 = 12`。当键值对数量 ≥ 12 时触发扩容。
4. **`loadFactor`**：加载因子（扩容因子），表示允许填充数组的比例。默认值为 0.75，在容量和性能之间提供良好的平衡：
   - **加载因子过大**：减少扩容频率，降低空间占用，但增加哈希碰撞概率，导致链表长度增加，查询性能下降。
   - **加载因子过小**：降低哈希碰撞概率，提升查询效率，但会频繁扩容，浪费内存空间。

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

   通俗点来说就是，
   - **加载因子过大（如 1.0）**：
	   - **优点**：减少数组扩容，节省内存。
	   - **缺点**：哈希碰撞概率更高，链表或红黑树更长，`get` 和 `put` 操作的效率降低。
   - **加载因子过小（如 0.5）**：
	   - **优点**：哈希碰撞概率降低，查询效率提升。
	   - **缺点**：更频繁地触发扩容，浪费内存空间，扩容过程耗时，影响性能。
   - **选择 0.75 的原因**：
	   - 默认加载因子 0.75 在**性能和内存占用之间找到了最佳平衡点**。
	   - 0.75 的设计经验表明，既能避免频繁扩容，又能有效降低哈希碰撞概率，从而提升查询和插入操作的效率。
	不推荐随意更改加载因子，特别是在构造器中指定，除非有非常明确的优化需求。
5. **`Node<K,V>[] table`**：用于存储数据的核心数组，类型为 `Node<K, V>[]`。该字段使用 `transient` 修饰，通过 `transient` 修饰的字段在序列化的时候将被排除在外，那么 HashMap 在序列化后进行反序列化时，是如何恢复数据的呢？HashMap 通过自定义的 `readObject` 和 `writeObject` 方法自定义序列化和反序列化操作。这样做主要是出于以下两点考虑：
   1. table 一般不会存满，即容量大于实际键值对个数，序列化 table 未使用的部分不仅浪费时间也浪费空间；
   2. key 对应的类型如果没有重写 `hashCode` 方法，那么它将调用 Object 的 `hashCode` 方法，该方法为 native 方法，在不同 JVM 下实现可能不同；换句话说，同一个键值对在不同的 JVM 环境下，在 table 中存储的位置可能不同，那么在反序列化 table 操作时可能会出错。
   所以在 HashXXX 类中（如 HashTable，HashSet，LinkedHashMap 等等），我们可以看到，这些类用于存储数据的字段都用 `transient` 修饰，并且都自定义了 `readObject` 和 `writeObject` 方法。`readObject` 和 `writeObject` 方法这节就不进行源码分析了，有兴趣的小伙伴可以自己研究。

## 主要操作

### 初始化

> [!important]
>
> 在构造函数中并没有对 `table` 进行初始化，而是**在第一次添加元素的时候才会对 `table` 进行初始化**，这样设计的主要目的是为了**延迟初始化，避免内存的浪费**，因为有可能发生在初始化了之后用户后面并没有向其中添加任何元素的情况，这样的话就会造成不必要的浪费。

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

1. 对传入的两个参数：initialCapacity（初始化容量 ） 和 loadFactor（加载因子）进行校验，如果不满足要求就抛出异常！
2. `tableSizeFor`：为了保证数组的容量必须满足 2^N 的要求，该方法的作用就是找到比传入的初始容量要大或者刚好相等的最小的 2^N 数。假设当传入的初始容量 initialCapacity = 17，这个时候 `tableSizeFor` 方法就应该返回一个接近 17 并比 17 要大的 2^N 数，结果应该为 32，因为 2^4=16 < 17，所以找到的是 2^5=32 > 17；

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

   1. `n = cap - 1`，为什么要执行 cap - 1 操作？因为当你传入的**初始容量刚好是 2 的幂次方数**，如果没有这行代码的话，执行完后面的几次无符号右移操作之后再执行 n + 1，最终返回的结果会是你传入的**初始容量的两倍**，即你传入的是 16，最后返回的结果为 32，所以需要先执行 cap - 1 操作。
   2. 后面的步骤乍一看可能会有点晕 😵，怎么一直对 n 进行无符号右移 1、2、4、8、16 位后再与自身进行按位与操作，其实这样做的目的是为了把二进制的每一位都变为 1，当二进制的每一位都是 1 之后，就是一个标准的 2 的幂次方减 1，比如 15=0b1111 = 2^6 - 1，最后返回 n+1 即可获得一个比初始容量要大或者刚好相等的最小的 2^N 数。如下图所示：
      ![[寻找2的幂次方最小值的示意图.excalidraw | 700]]
3. 可以看到最后将通过 `tableSizeFor` 方法确定出来的容量大小 capacity 赋值给了扩容阈值 `threshold`，这不对吧！正常的阈值计算公式不应该是 threshold = capacity \* loadFactor; 吗？为什么这里是直接将容量大小 capacity 赋值给扩容阈值 `threshold`？这样设计是为什么呢？如上面所说，为了实现**延迟初始化**，在构造函数中并没有对数组 table 进行初始化，那么计算出来的容量大小肯定要拿一个变量进行保存对吧，所以这里只是使用 `threshold` 保存一下而已。在添加第一个元素时，在 `put` 方法中会对数组 table 进行初始化，此时就会将保存在 `threshold` 中的容量大小取出当作数组的容量进行初始化，然后再利用正常的阈值计算公式去重新计算 `threshold` 的值即可。

### 添加元素

`put` 方法源码如下：

```java
public V put(K key, V value) {
	return putVal(hash(key), key, value, false, true);
}
```

#### 扰动函数

`put` 方法通过 `hash` 函数计算 key 对应的哈希值，`hash` 函数源码如下：

```java
static final int hash(Object key) {
  int h;
  return (key == null) ? 0 : (h = key.hashCode()) ^ (h >>> 16);
}
```

如果 key 为 null 的话，则返回 0；如果不为 null 的话，则通过 `(h = key. hashCode ()) ^ (h >>> 16)` 公式计算得到哈希值。该公式通过将 key 的哈希值无符号右移 16 位后（高位全部补 0）与原哈希值本身进行按位异或运算。也就是让低 16 位与高 16 位进行异或，高 16 位保持不变 (与 0 异或都是自己本身)，让高位也得以参与散列运算。说白了，使用**扰动函数就是为了增加随机性，使得散列更加均匀，减少碰撞**，不会造成因为高位没有参与下标计算从而引起的碰撞。

#### 计算数组下标

数组下标 `index = hash & (length - 1)`。顺便说一下，这也正好解释了为什么数组长度必须是 2 的整数幂，因为这样（数组长度 - 1）正好相当于一个 "低位掩码"，使用 `&` 操作之后的结果就是散列值的高位全部归零，只保留低位值，正好用来做数组下标访问。以初始长度 16 为例，16-1=15，其二进制表示就是 `0000 0000 0000 0000 0000 0000 0000 1111`，和某个散列值 hash 做 `&` 操作如下所示，最后返回的结果就是截取了 hash 值的低四位。
![[HashMap数组下标计算.excalidraw | 800]]

#### 添加元素主流程

1. 首先判断数组是否为空 `tab == null || tab. length == 0`，如果是的话，则先调用 `resize` 方法进行初始化操作；
2. 获取数组在当前下标位置处的元素 `p = tab[i = (n - 1) & hash]`，判断元素 p 是否为 NULL？如果元素 p = NULL，则说明数组在当前下标位置处不存在元素，则直接将元素放在该位置即可。**元素个数 size + 1**；
3. 经过第上一步，说明数组在当前下标位置处已经存在元素，此时会分为如下三种情况：
   1. 判断当前要插入的元素否与数组当前下标位置处的元素的 hash 值和 key 值相等？如果条件成立的话，则表示当前要插入的元素与当前位置处已有元素是同一个元素，则让**节点 e 直接指向该元素**即可。

      > [!tip]
      >
      > **在使用自定义对象作为 key 时，需要重写对象的 `hashCode` 和 `equals` 方法**。其中，`hashCode` 方法用于决定对象会被放到哪个 bucket 里，当多个对象的哈希值冲突时，此时就需要使用 `equals` 方法判断这些对象是否为同一个对象。

   1. 经过上一步，说明当前要插入的元素否与当前数组下标位置处的元素的 hash 值和 key 值并不相等，此时会将元素添加到链表的末尾或者红黑树的叶子节点。所以此时需要判断当前位置的元素是否为红黑树节点？条件成立的话，则走红黑树添加元素的逻辑，返回与要插入元素的 hash 值和 key 值都相等的树节点，让**节点 e 指向该树节点**。
   2. 经过上一步，说明数组当前下标位置处是链表结构，遍历该链表，寻找与当前要插入的元素的 hash 值和 key 值相等的节点，
      1. 如果找到了的话，则跳出循环，让**节点 e 指向在链表中找到的节点**；
      2. 如果找不到的话，就将元素添加到链表的末尾，然后判断当前链表是否要进行树化操作，即判断链表的长度>8 && 数组的长度>=64？如果条件成立的话，则将链表转化为红黑树。**元素个数 size + 1**；
4. 判断节点 e 是否不为 NULL？条件成立的话，会根据传入的 onlyIfAbsent 参数判断是否要覆盖原来的 VAULE 值？
   1. 如果 onlyIfAbsent = fasle 的话，则使用新的 value 覆盖原来的 value 值并返回原来的 value 值；
   2. 如果 onlyIfAbsent = true && oldValue != null 的话，则不会覆盖原来的值，而是直接将原来的 value 值返回；
5. 经过第 2 步和第 3.3.2 步，元素个数会加一，此时会判断元素个数是否已经超过扩容阈值？如果条件成立的话，则说明需要调用 `resize` 方法对数组进行扩容。

```java
// 参数onlyIfAbsent表示是否覆盖原来的值，true表示不覆盖，false表示覆盖，默认为false
final V putVal(int hash, K key, V value, boolean onlyIfAbsent, boolean evict) {
 // tab是存放节点的数组，n是数组长度,i是当前要插入的节点在数组中的下标，p是当前数组下标处的节点
 Node<K,V>[] tab; Node<K,V> p; int n, i;
 // tab指向全局的table数组，判断tab是否为null或者tab的长度为0
 if ((tab = table) == null || (n = tab.length) == 0)
	   // 条件成立，表示table数组还没有被初始化，此时添加的元素为集合中的第一个元素，调用resize扩容方法初始化tab
     n = (tab = resize()).length;
 // hash & (n-1) => 当前要插入元素在数组中的数组下标index，p指向数组当前位置的元素，判断数组当前位置是否存在元素
 if ((p = tab[i = (n - 1) & hash]) == null)
		 // 条件成立，表明数组当前位置没有元素，则直接在当前位置插入元素
     tab[i] = newNode(hash, key, value, null);
 // 数组当前位置存在节点
 else {
	    // e指向数组当前位置处已有的元素
     Node<K,V> e; K k;
     // 判断当前要插入元素的hash值和key值是否与当前位置处已有元素的hash值和key值相同
     if (p.hash == hash && ((k = p.key) == key || (key != null && key.equals(k))))
         // 条件成立，表示当前要插入的元素与当前位置处已有元素是同一个元素
         e = p;
     // 判断该元素是否为红黑树节点
     else if (p instanceof TreeNode)
	       // 如果是的话，则使用红黑树添加元素的方法插入元素
         e = ((TreeNode<K,V>)p).putTreeVal(this, tab, hash, key, value);
     // 最后一种情况，在当前位置处的链表中插入元素
     else {
         // 遍历数组当前位置处的链表，此时p节点为数组当前位置处的第一个元素
         for (int binCount = 0; ; ++binCount) {
	           // e指向p的下一个节点，在循环体的最后又将p指向e，如此这般可以用来遍历当前链表
             // 判断p节点的下一个节点是否为null
             if ((e = p.next) == null) {
	               // 条件成立，表明p节点没有下一个节点，即p节点为最后一个节点，则直接将要插入的节点挂在p节点后面，尾插法
                 p.next = newNode(hash, key, value, null);
                 // 判断当前链表元素个数是否大于8个?
                 if (binCount >= TREEIFY_THRESHOLD - 1)
	                   // 在treeifyBin方法中还会继续判断数组长度是否小于64?
	                   // 如果数组长度小于64的话，则优先进行扩容而不是树化；
                     // 如果数组长度大于等于64的话，再加上上面当前链表元素个数大于8的条件，就会将当前链表转化为红黑树
                     treeifyBin(tab, hash);
                 // 跳出循环，停止链表遍历
                 break;
             }
             // 判断当前要插入元素的hash值和key值是否与正在遍历的链表中的e节点的hash值和key值相同
             if (e.hash == hash && ((k = e.key) == key || (key != null && key.equals(k))))
                 // 条件成立，表明要插入的元素与e节点是同一个元素，则不执行插入操作，跳出循环，停止链表遍历
                 break;
             p = e;
         }
     }
     // 判断e是否为null，如果不为null，表明在数组（包括某一下标位置处的链表）中找到了与要插入元素的key相同的节点
     if (e != null) {
	       // 取出e节点的value值赋值给oldValue
         V oldValue = e.value;
         // 判断onlyIfAbsent是否为false或者原来的值是否为null
         if (!onlyIfAbsent || oldValue == null)
	           // 条件成立，表明onlyIfAbsent为false或者原来的值为null，则用要插入元素的value值覆盖掉原来的值
             e.value = value;
         afterNodeAccess(e);
         // 返回原来的值
         return oldValue;
     }
 }
 // modCount+1表示HashMap此时结构已经发生变化
 ++modCount;
 // 不管是在数组上添加一个元素还是在链表中添加一个元素，size都会加1
 // 判断节点数量是否已经大于阈值?
 if (++size > threshold)
	   // 条件成立，表明节点数量已经大于扩容阈值，需要使用resize方法对数组进行扩容
     resize();
 afterNodeInsertion(evict);
 // 当前要插入的节点是一个新的节点，即在原来的数组+链表+红黑树中不存在该节点，自然原来的值也就不存在，因此返回null
 return null;
}
```

#### 数组初始化 & 扩容

> [!important]
> `resize` 方法有两个作用：<strong style="font-size:19px;">初始化数组</strong>和<strong style="font-size:19px;">对数组进行扩容（包括数据迁移操作）</strong>。

1. 在计算新数组的容量和扩容阈值之前，先用 oldTab、oldCap 和 oldThr 三个变量分别保存扩容前数组的引用、容量以及扩容阈值。
   1. 当旧数组容量大于 0 时，说明数组已经初始化过，此时走的是数组**扩容**流程，新数组的容量 newCap = oldCap << 1 <=> newCap = oldCap * 2，等于旧数组容量的两倍；新扩容阈值 newThr = oldThr << 1 <=> oldThr * 2，等于旧扩容阈值的两倍；
   2. 当 **旧扩容阈值>0&&旧数组容量=0** 时，对应的情况是**使用指定数组初始容量和加载因子的构造器进行初始化**。大家应该还记得在上面 [[#初始化 | 初始化.构造函数分析.第三点]] 的中曾提到过将使用 `tableSizeFor` 方法获取到的容量大小保存在扩容阈值变量中，此时刚好从旧扩容阈值 oldThr 中取出数组应该初始化的容量大小赋值给 newCap；新扩容阈值 newThr = newCap \* loadFactor = 新数组容量 * 指定的加载因子参数；
   3. 当 **旧扩容阈值=0&&旧数组容量=0** 时，对应的情况是**使用默认的无参构造进行初始化**。新数组容量 newCap = DEFAULT_INITIAL_CAPACITY = 16，扩容阈值 newThr = DEFAULT_LOAD_FACTOR * DEFAULT_INITIAL_CAPACITY = 0.75 * 16 = 12；
2. 创建一个新的数组，数组初始容量大小为 newCap：`Node<K,V>[] newTab = (Node<K,V>[]) new Node[newCap]`。让 table 指向新创建出来的数组，至此数组的初始化和扩容工作就已经完成了，接下来的工作就是进行**数据拷贝（即将原数组中的数据迁移到新数组中）**。
3. 数据迁移：遍历原数组，将原数组中的非空元素拷贝到新数组中。当遍历到某一个索引位置时，判断原数组中该位置的元素是否为 NULL，即判断原数组中该位置是否存在元素？
   1. 条件成立的话，判断当前元素是否有下一个节点？即判断该节点是否为链表或者红黑树结构；
      1. 条件成立的话，判断当前节点是不是树节点，即判断当前索引位置处的元素是否已经由链表转化为红黑树结构？
         1. 条件成立的话，则走红黑树的扩容流程；
         2. 条件不成立的话，说明当前索引位置处的元素是一个链表结构。**在迁移数据时会把原链表拆成一个<u>低位链表</u>和一个<u>高位链表</u>，然后再分别插入到新数组的两个位置上，这两个位置分别为<u>当前索引位置</u>和<u>当前索引位置 + 原数组长度</u>**。这个结论是怎么来的？举个栗子，如下图所示：图 a 和图 b 分别表示扩容前和扩容后 key1 和 key2 在数组中的索引位置。
            ![image.png](https://cdn.jsdelivr.net/gh/xihuanxiaorang/img2/202412162334584.png)

            1. 扩容前 key1 和 key2 的 hash 值后四位相等，所以在旧数组中的索引位置相同，都等于 5，两个节点处在同一个链表上；
            2. 数组在扩容后，因为数组长度 n 变为原来的 2 倍，即 n - 1 就会比原来在高位处多 1 个 bit 位，因此新的数组下标就会发生这样的变化：
               ![image.png](https://cdn.jsdelivr.net/gh/xihuanxiaorang/img2/202412162335948.png)

               导致在计算节点位于新数组中的索引位置时，key1 的索引位置还是等于 5，而 key2 的索引位置 = 21 <== 5 + 16，即原位置 + 原数组长度。所以在扩容时，只需要看 hash 值所对应二进制的最高位的位置是 0 还是 1 即可，如果是 0 的话表示还是位于原位置，是 1 的话则表示当前节点所在新数组的位置 = 原位置 + 原来的数组长度。

      2. 条件不成立的话，则表示当前索引位置在原数组中只存在一个元素，所以只需要计算该元素位于新数组中的数组下标即可。
   2. 条件不成立的话，直接跳过进入下一次循环。

```java
final Node<K,V>[] resize() {
 // 将原来的table交由oldTab保存
 Node<K,V>[] oldTab = table;
 // 获取原来的数组长度赋值给oldCap
 int oldCap = (oldTab == null) ? 0 : oldTab.length;
 // 将原来的阈值大小threshold交由oldThr保存
 int oldThr = threshold;
 // 预定义新数组的大小和阈值
 int newCap, newThr = 0;
 // 如果原来的数组长度大于0
 if (oldCap > 0) {
     // 如果原来的数组长度已经大于等于最大的数组长度(1<<30)，即超过最大值就不再扩容了
     if (oldCap >= MAXIMUM_CAPACITY) {
	       // 直接把阈值大小设置为最大整数2^31-1
         threshold = Integer.MAX_value;
         // 返回原来的数组
         return oldTab;
     }
     // oldCap<<1 => 将原来的数组大小*2，即扩大容量为当前容量的两倍，但不能超过 MAXIMUM_CAPACITY
     else if ((newCap = oldCap << 1) < MAXIMUM_CAPACITY && oldCap >= DEFAULT_INITIAL_CAPACITY)
         // 将阈值也扩大1倍 <=> oldThr * 2
         newThr = oldThr << 1;
 }
 // 当原来的阈值大于0但数组长度=0时，对应的情况就是使用带有指定数组长度和加载因子的构造器创建HashMap
 else if (oldThr > 0)
	   // 新数组的长度等于原来的阈值大小
     newCap = oldThr;
 // 对应的情况是使用默认的构造器创建HashMap
 else {
	   // 默认的数组大小为16
     newCap = DEFAULT_INITIAL_CAPACITY;
     // 默认的阈值大小 = 16 * 0.75(加载因子) = 12
     newThr = (int)(DEFAULT_LOAD_FACTOR * DEFAULT_INITIAL_CAPACITY);
 }
 // 当新的阈值大小为0时，对应的情况就是使用带有指定数组长度和加载因子的构造器创建HashMap
 if (newThr == 0) {
     // 使用阀值公式计算新的阈值 = 新的容量 * 加载因子
     float ft = (float)newCap * loadFactor;
     newThr = (newCap < MAXIMUM_CAPACITY && ft < (float)MAXIMUM_CAPACITY ?
               (int)ft : Integer.MAX_value);
 }
 // 将新的阈值大小赋值给threshold
 threshold = newThr;
 @SuppressWarnings({"rawtypes","unchecked"})
 // 此时数组初始化或者扩容已经完成，接下来的工作就是进行数据拷贝，将原数组中的数据迁移到新数组中
 // 创建新的数组，数组长度为上面计算出来的新数组的大小newCap
 Node<K,V>[] newTab = (Node<K,V>[])new Node[newCap];
 // table指向新数组
 table = newTab;
 if (oldTab != null) {
     // 根据容量遍历原数组，复制非空元素到新数组
     for (int j = 0; j < oldCap; ++j) {
         // 当前节点变量
         Node<K,V> e;
         // 首先使用e指向原数组中该位置处的元素，然后判断数组中该位置处的元素是否为null，即判断原数组中该位置是否存在元素
         if ((e = oldTab[j]) != null) {
	           // 条件成立，说明原数组中该位置存在元素，则将原数组中该位置的元素清空
             oldTab[j] = null;
             // 判断当前元素是否有下一个节点，即判断该位置是否存在链表，如果为null，则表示当前位置只存在一个元素，所以只需要计算该元素位于新数组中的数组下标即可
             if (e.next == null)
	               // 那么再次使用 hash & (n - 1) 来计算当前元素位于新数组中的数组下标，在新数组的该位置存放当前节点
                 newTab[e.hash & (newCap - 1)] = e;
             // 该节点存在下一个节点，所以有可能是链表或者红黑树结构
             else if (e instanceof TreeNode)
                 // 判断当前节点是不是树节点，即判断当前位置是否已经转化为红黑树结构
                 ((TreeNode<K,V>)e).split(this, newTab, j, oldCap);
             // 表明该节点是一个链表结构
             else {
	                // 新的位置只有两种可能：原位置 或者 原位置+原数组长度
	                // 把原链表拆成两个链表，然后再分别插入到新数组的两个位置上
	                // loXXX表示数组下标位置不变的链表，低位链表
                 Node<K,V> loHead = null, loTail = null;
                 // hiXXX表示原数组下标+原数组长度的位置处的链表，高位链表
                 Node<K,V> hiHead = null, hiTail = null;
                 // next节点，用于递归该位置的链表
                 Node<K,V> next;
                 do {
	                    // next节点指向当前节点的下一个节点
                     next = e.next;
                     // 使用hash & 原数组长度(如16 = 10000)，如果最高位为0，表示该节点位于原位置，即存在于低位链表中
                     if ((e.hash & oldCap) == 0) {
                         // 判断低位链表的尾节点是否为null，如果为null，表示当前低位链表还没有节点，则将低位链表的头节点指向当前节点
                         if (loTail == null)
                             // 将低位链表的头节点指向当前节点，作为该链表的第一个节点
                             loHead = e;
                         // 如果不为null，则让低位链表的尾节点的下一个节点指向当前节点，即将整个低位链表串起来
                         else
                             loTail.next = e;
                         // 最后让低位链表的尾节点指向当前节点，即移动低位链表的尾节点
                         loTail = e;
                     }
                     else {
                         if (hiTail == null)
                             hiHead = e;
                         else
                             hiTail.next = e;
                         hiTail = e;
                     }
                 } while ((e = next) != null); // 递归当前链表直至结束
                 // 如果低位链表不为空
                 if (loTail != null) {
	                    // 将低位链表的尾节点的下一个节点清空
                     loTail.next = null;
                     // 在新数组的原位置处放入低位链表
                     newTab[j] = loHead;
                 }
                 // 如果高位链表不为空
                 if (hiTail != null) {
	                    // 将高位链表的尾节点的下一个节点清空
                     hiTail.next = null;
                     // 在新数组的原位置+原来数组长度大小处放入高位链表
                     newTab[j + oldCap] = hiHead;
                 }
             }
         }
     }
 }
 // 返回新的数组
 return newTab;
}
```

### 获取元素

1. 首先**判断数组是否不为空 && 数组长度是否大于 0 && 当前下标位置（`(n-1) & hash`）处的元素是否不为空**，如果三个条件中有一个条件不满足的话，则直接返回 null；
2. 走到这一步，表示上述三个条件都满足 => 数组已经初始化 && 数组中已添加过元素 && 数组在当前下标位置处存在元素。现在只需**通过比较两者的 hash 值与 key 值判断当前下标位置处的元素是否刚好就是要找的元素**，如果是的话，则直接返回该元素；
3. 走到这一步，说明当前下标位置处的元素与目标元素不相等，需要判断当前下标位置处的元素的下一个节点是否不为空，如果不为空的话，则说明当前下标位置处是一个链表或者红黑树结构；
   1. 判断当前下标位置处的元素是否是一个树节点，如果是一个树节点的话，则走红黑树获取元素的流程；
   2. 经过上一步，说明当前下标位置处是一个链表结构，需要从头到尾**遍历链表，依次比较链表中的各个节点的 hash 值与 key 值是否与目标元素的 hash 值与 key 值相等**。如果在链表中找到满足条件的节点的话则返回该节点，如果找不到的话则返回 null。

```java
public V get(Object key) {
  Node<K,V> e;
  return (e = getNode(hash(key), key)) == null ? null : e.value;
}

final Node<K,V> getNode(int hash, Object key) {
  Node<K,V>[] tab; Node<K,V> first, e; int n; K k;
  // 判断数组是否不为空 && 数组长度是否大于0 && 当前下标位置处的元素是否不为空，如果三个条件中有一个条件不满足的话，则直接返回null
  if ((tab = table) != null && (n = tab.length) > 0 &&
      (first = tab[(n - 1) & hash]) != null) {
      // 条件成立的话，判断当前下标位置处的元素的 hash 值和 key 值是否刚好与目标元素的 hash 值和 key 值刚好相等，如果是的话，则直接返回该元素
      if (first.hash == hash && // always check first node
          ((k = first.key) == key || (key != null && key.equals(k))))
          return first;
      // 判断当前下标位置处的元素的下一个节点是否不为空，如果不为空的话，则说明当前下标位置处是一个链表或者红黑树结构
      if ((e = first.next) != null) {
          // 判断当前下标位置处的元素是否是一个树节点，如果是一个树节点的话，则走红黑树获取元素的流程
          if (first instanceof TreeNode)
              return ((TreeNode<K,V>)first).getTreeNode(hash, key);
          // 走到这一步说明当前下标位置处是一个链表结构，需要从头到尾遍历链表，依次判断链表中的各个节点的 hash 值与 key 值是否与目标元素的 hash 值与 key 值相等
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

`remove` 方法中的前半部分其实就是 `get` 方法的逻辑，从集合中找到目标元素，至于这一部分的文字描述可以参考[[#获取元素]]，咱们就直接从后半部分开始。如果找到了目标元素（也就是当前准备要删除的元素）的话，存在如下三种情况：

1. 判断目标元素是否是一个树节点，如果是的话，则走红黑树删除元素的流程；
2. 判断目标元素是否刚好等于当前下标位置处的元素，如果是的话，则将目标元素的下一个节点替换当前下标位置处的元素；
3. 走到这一步说明当前下标位置处是一个链表结构，则直接让目标元素的前一个节点（也就是节点 p）的 next 指向目标元素的 next，从而实现从链表中删除目标元素。
   ![[链表中删除元素演示.excalidraw | 600]]

```java
public V remove(Object key) {
  Node<K,V> e;
  return (e = removeNode(hash(key), key, null, false, true)) == null ?
      null : e.value;
}

final Node<K,V> removeNode(int hash, Object key, Object value,
                               boolean matchValue, boolean movable) {
  Node<K,V>[] tab; Node<K,V> p; int n, index;
  // 判断数组是否不为空 && 数组长度是否大于0 && 当前下标位置处的元素是否不为空，如果三个条件中有一个条件不满足的话，则直接返回null
  if ((tab = table) != null && (n = tab.length) > 0 &&
      (p = tab[index = (n - 1) & hash]) != null) {
      Node<K,V> node = null, e; K k; V v;
      // 条件成立的话，判断当前下标位置处的元素的 hash 值和 key 值是否刚好与目标元素的 hash 值和 key 值刚好相等，如果是的话，说明找到目标元素赋值给节点node
      if (p.hash == hash &&
          ((k = p.key) == key || (key != null && key.equals(k))))
          node = p;
      // 判断当前下标位置处的元素的下一个节点是否不为空，如果不为空的话，则说明当前下标位置处是一个链表或者红黑树结构
      else if ((e = p.next) != null) {
          // 判断当前下标位置处的元素是否是一个树节点，如果是一个树节点的话，则走红黑树获取元素的流程
          if (p instanceof TreeNode)
              node = ((TreeNode<K,V>)p).getTreeNode(hash, key);
          else {
              // 走到这一步说明当前下标位置处是一个链表结构，需要从头到尾遍历链表，依次判断链表中的各个节点的 hash 值与 key 值是否与目标元素的 hash 值与 key 值相等，如果找到与目标元素相等的节点则赋值给节点node
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
      // 如果节点node不为空的话，则说明已经找到目标元素
      // 至于判断是否需要 value 值相等才删除的逻辑无关紧要，不做重点分析
      if (node != null && (!matchValue || (v = node.value) == value ||
                           (value != null && value.equals(v)))) {
          // 判断节点node是否是一个树节点，如果是的话，则走红黑树删除元素的流程
          if (node instanceof TreeNode)
              ((TreeNode<K,V>)node).removeTreeNode(this, tab, movable);
          // 判断节点node是否刚好等于当前下标位置处的元素，如果是的话，则将node节点的下一个节点作为当前下标位置处的元素
          else if (node == p)
              tab[index] = node.next;
          // 走到这一步说明当前下标位置处是一个链表结构，则直接让node节点的前一个节点（也就是节点p）的next指向node节点的next，从而实现从链表中删除node节点
          else
              p.next = node.next;
          ++modCount;
          --size;
          afterNodeRemoval(node);
          return node;
      }
  }
  return null;
}
```
