---
tags:
  - Java/JavaSE
version: JDK8
create_time: 2025/07/14 22:27
update_time: 2025/07/14 23:31
---

流（Stream）是数据渠道，用于操作数据源（集合和数组等）所生成的元素序列。集合讲的是数据，流讲的是计算。

> [!important]
>
> - Stream 流既不是数据结构，也**不保存数据**，主要目的在于计算。
> - Stream 流**只能被消费一次**，当其执行了终止操作后便说明其已经被消费掉了，多次消费的话会导致 "IllegalStateException" 异常。
> - Stream 流的中间操作是**惰性执行**的，只有终止操作开始时才会执行。

操作 Stream 流的三个步骤：

1. 获取源：通过一个数据源（如：集合、数组、…）创建一个 Stream 流；
2. 中间操作：对数据源的数据进行处理，如 `filter`、`map`、`sorted`、`distinct` …
3. 终止操作：执行中间操作并产生结果返回，如 `forEach`、`collect`、`reduce` …

![](https://img.xiaorang.fun/202502251812773.jpeg)

## 获取源（创建 Stream 流）

创建 Stream 流的几种方式：

- 从集合 | 数组创建（最常见）
- 使用 `Stream.of(T)`
- 使用 `Stream.builder()`
- 从其他来源（如文件、正则表达式分割等）创建
- 使用无限流：使用 `Stream.iterate()` 和 `Stream.generate()` 方法可以创建无限流，这类流会按需生成或迭代新的元素直至程序显式终止它们

```java hl:16,54,61
public class StreamTest {
  @Test
  public void createStreamTest() {
    final User user1 = new User(1, "张三", 20, "123456", "zs@qq.com");
    final User user2 = new User(2, "李四", 21, "123456", "ls@qq.com");
    final User user3 = new User(3, "王五", 22, "123456", "ww@qq.com");
    final User user4 = new User(4, "赵六", 22, "123456", "zl@qq.com");
    final User user5 = new User(5, "钱七", 25, "123456", "q7@qq.com");

    // 从List集合创建Stream流 useListToStream
    final List<User> userList = List.of(user1, user2, user3, user4, user5);
    final Stream<User> useListToStream = userList.stream();

    //从Map集合创建Stream流 useMapEntrySetToStream
    final Map<Integer, User> userMap = Map.of(user1.getId(), user1, user2.getId(), user2, user3.getId(), user3, user4.getId(), user4, user5.getId(), user5);
    final Stream<Map.Entry<Integer, User>> useMapEntrySetToStream = userMap.entrySet().stream();

    // 从数组创建Stream流 useArrayToStream
    User[] userArray = {user1, user2, user3, user4, user5};
    final Stream<User> useArrayToStream = Arrays.stream(userArray);

    // 使用Stream.of()创建Stream流 useStreamOfToStream
    final Stream<User> useStreamOfToStream = Stream.of(user1, user2, user3, user4, user5);

    // 使用Stream.builder()创建Stream流 useStreamBuilderToStream
    final Stream.Builder<User> builder = Stream.builder();
    builder.add(user1).add(user2).add(user3).add(user4).add(user5);
    final Stream<User> useStreamBuilderToStream = builder.build();
    useStreamBuilderToStream.forEach(System.out::println);

    System.out.println("===========================");

    // 从文件创建Stream流 useFileToStream
    final Path path = Paths.get("src", "test", "resources", "stream.txt");
    try (Stream<String> useFileToStream = Files.lines(path)) {
      useFileToStream.forEach(System.out::println);
    } catch (IOException e) {
      throw new RuntimeException(e);
    }

    System.out.println("===========================");

    // 从正则表达式创建Stream流 useRegexToStream
    String str = "张三,李四,王五,赵六,钱七";
    String regex = ",";
    final Pattern pattern = Pattern.compile(regex);
    try (Stream<String> useRegexToStream = pattern.splitAsStream(str)) {
      useRegexToStream.forEach(System.out::println);
    }

    System.out.println("===========================");

    // 使用Stream.iterate()创建Stream流 useIterateToStream
    try (Stream<Integer> useIterateToStream = Stream.iterate(1, n -> n + 1).limit(10)) {
      useIterateToStream.forEach(System.out::println);
    }

    System.out.println("===========================");

    // 使用Stream.generate()创建Stream流 useGenerateToStream
    try (Stream<Integer> useGenerateToStream = Stream.generate(() -> new Random().nextInt(10)).limit(5)) {
      useGenerateToStream.forEach(System.out::println);
    }
  }
}
```

测试结果如下所示：

```text
User(id=1, name=张三, age=20, password=123456, email=zs@qq.com)
User(id=2, name=李四, age=21, password=123456, email=ls@qq.com)
User(id=3, name=王五, age=22, password=123456, email=ww@qq.com)
User(id=4, name=赵六, age=22, password=123456, email=zl@qq.com)

User(id=5, name=钱七, age=25, password=123456, email=q7@qq.com)
===========================
ilovechina
ilikechina
===========================
张三
李四
王五
赵六
钱七
===========================
1
2
3
4
5
6
7
8
9
10
===========================
4
5
5
4
6
```

## 中间操作

准备工作：定义一个 `User` 类

```java
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class User {
  /**
   * 用户ID
   */
  private Integer id;
  /**
   * 用户名
   */
  private String name;
  /**
   * 年龄
   */
  private Integer age;
  /**
   * 密码
   */
  private String password;
  /**
   * 邮箱
   */
  private String email;
}
```

### filter

`filter` 过滤：将流中满足指定条件的数据保留，去除不满足指定条件的数据。

```java hl:23
@Test
public void filterStreamTest() {
  final User user1 = new User(1, "张三", 20, "123456", "zs@qq.com");
  final User user2 = new User(2, "李四", 21, "123456", null);
  final User user3 = new User(3, "王五", 22, "123456", "");
  final User user4 = new User(4, "赵六", 22, "123456", "zl@qq.com");
  final User user5 = new User(5, "钱七", 25, "123456", "q7@qq.com");

  // 从List集合创建Stream流 useListToStream
  final List<User> userList = List.of(user1, user2, user3, user4, user5);
  final Stream<User> useListToStream = userList.stream();

  // filter过滤1：筛选年龄在22（含）以上的用户 filterUserList1
  /*final List<User> filterUserList1 = useListToStream.filter(user -> user.getAge() >= 22).collect(Collectors.toList());
  filterUserList1.forEach(System.out::println);*/

  // filter过滤2：筛选填写过邮箱的用户 filterUserList2
  /*final List<User> filterUserList2 = useListToStream.filter(user -> user.getEmail() != null && !user.getEmail().isEmpty()).collect(Collectors.toList());
  filterUserList2.forEach(System.out::println);*/


  // filter过滤3：自定义方法，筛选填写过邮箱的用户 filterUserList3
  final List<User> filterUserList3 = useListToStream.filter(user -> checkUserEmail(user.getEmail())).collect(Collectors.toList());
  filterUserList3.forEach(System.out::println);
}

private static Boolean checkUserEmail(String userEmail) {
  return userEmail != null && !userEmail.isEmpty();
}
```

测试结果如下所示：

```text
User(id=1, name=张三, age=20, password=123456, email=zs@qq.com)
User(id=4, name=赵六, age=22, password=123456, email=zl@qq.com)
User(id=5, name=钱七, age=25, password=123456, email=q7@qq.com)
```

### distinct

`distinct` 去重：去除流中重复的数据，通过流中元素的 hashCode () 和 equals () 方法判断元素是否相等。

> [!note]
> 重写 `User` 类的 `hashCode()` 和 `equals()` 方法，以用户 ID 和用户名是否相同来判断两个 `User` 对象是否是同一个对象。

```java hl:28,36
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class User {
  /**
   * 用户ID
   */
  private Integer id;
  /**
   * 用户名
   */
  private String name;
  /**
   * 年龄
   */
  private Integer age;
  /**
   * 密码
   */
  private String password;
  /**
   * 邮箱
   */
  private String email;

  @Override
  public boolean equals(final Object o) {
    if (this == o) return true;
    if (o == null || getClass() != o.getClass()) return false;
    final User user = (User) o;
    return Objects.equals(id, user.id) && Objects.equals(name, user.name);
  }

  @Override
  public int hashCode() {
    return Objects.hash(id, name);
  }
}
```

```java hl:5,8
@Test
public void distinctStreamTest() {
  // distinct去重1：基本数据类型去重
  final Stream<Integer> integerStream = Stream.of(1, 1, 2, 3, 4, 4, 5);
  integerStream.distinct().forEach(System.out::println);
  System.out.println("================================");
  final Stream<String> stringStream = Stream.of("Xiaomi", "Apple", "Huawei", "Lenovo", "Apple");
  stringStream.distinct().forEach(System.out::println);
  System.out.println("================================");

  // distinct去重2：自定义对象去重，将重复的User对象去除
  final User user1 = new User(1, "张三", 20, "123456", "zs@qq.com");
  final User user2 = new User(2, "李四", 21, "123456", "ls@qq.com");
  final User user3 = new User(3, "王五", 22, "123456", "ww@qq.com");
  final User user4 = new User(4, "赵六", 22, "123456", "zl@qq.com");
  final User user5 = new User(5, "钱七", 25, "123456", "q7@qq.com");
  final User user6 = new User(5, "钱七", 25, "123456", "q8@qq.com");
  // 从List集合创建Stream流 useListToStream
  final List<User> userList = List.of(user1, user2, user3, user4, user5, user6);
  final Stream<User> useListToStream = userList.stream();
  useListToStream.distinct().forEach(System.out::println);
}
```

测试结果如下所示：

```text
1
2
3
4
5
================================
Xiaomi
Apple
Huawei
Lenovo
================================
User(id=1, name=张三, age=20, password=123456, email=zs@qq.com)
User(id=2, name=李四, age=21, password=123456, email=ls@qq.com)
User(id=3, name=王五, age=22, password=123456, email=ww@qq.com)
User(id=4, name=赵六, age=22, password=123456, email=zl@qq.com)
User(id=5, name=钱七, age=25, password=123456, email=q7@qq.com)
```

### limit

`limit` 限制：截取流使其最大长度不超过给定数量。

```java hl:14
@Test
public void limitStreamTest() {
  final User user1 = new User(1, "张三", 20, "123456", "zs@qq.com");
  final User user2 = new User(2, "李四", 21, "123456", null);
  final User user3 = new User(3, "王五", 22, "123456", "");
  final User user4 = new User(4, "赵六", 22, "123456", "zl@qq.com");
  final User user5 = new User(5, "钱七", 25, "123456", "q7@qq.com");

  // 从List集合创建Stream流 useListToStream
  final List<User> userList = List.of(user1, user2, user3, user4, user5);
  final Stream<User> useListToStream = userList.stream();

  // limit截取：前三个用户
  useListToStream.limit(3).forEach(System.out::println);
}
```

测试结果如下所示：

```text
User(id=1, name=张三, age=20, password=123456, email=zs@qq.com)
User(id=2, name=李四, age=21, password=123456, email=null)
User(id=3, name=王五, age=22, password=123456, email=)
```

### skip

`skip` 跳过：跳过流中的前 N 个元素，如果流中元素不足 N 个，则返回一个空流。

```java hl:14
@Test
public void skipStreamTest() {
  final User user1 = new User(1, "张三", 20, "123456", "zs@qq.com");
  final User user2 = new User(2, "李四", 21, "123456", null);
  final User user3 = new User(3, "王五", 22, "123456", "");
  final User user4 = new User(4, "赵六", 22, "123456", "zl@qq.com");
  final User user5 = new User(5, "钱七", 25, "123456", "q7@qq.com");

  // 从List集合创建Stream流 useListToStream
  final List<User> userList = List.of(user1, user2, user3, user4, user5);
  final Stream<User> useListToStream = userList.stream();

  // skip跳过：跳过年龄最小的用户
  useListToStream.sorted(Comparator.comparingInt(User::getAge)).skip(1).forEach(System.out::println);
}
```

测试结果如下所示：

```text
User(id=2, name=李四, age=21, password=123456, email=null)
User(id=3, name=王五, age=22, password=123456, email=)
User(id=4, name=赵六, age=22, password=123456, email=zl@qq.com)
User(id=5, name=钱七, age=25, password=123456, email=q7@qq.com)
```

### sorted

`sorted` 排序：

- 自然排序，适用于内置的数据类型，要求 Stream 内的元素实现 ` java.lang.Comparable` 接口。
- 自定义排序，适用于自定义的数据类型，要求手动实现 `Comparable` 接口中的 `compareTo()` 方法。其中 `compareTo()` 方法就是比较两个值，如果前者大于后者，返回 1；两者相等返回 0；前者小于后者返回 -1；更为简单的用法是 `Comparator.comparingXxx(比较的属性)`。

> [!note]
> 使用 `sorted()` 方法对 `User` 集合进行排序的时候，`User` 需要实现 `Comparable` 接口，否则的话会报 `ClassCastException` 转换异常，无法将 `User` 对象转换为 Comparable 接口实例！

```java hl:5,41
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class User implements Comparable<User> {
  /**
   * 用户ID
   */
  private Integer id;
  /**
   * 用户名
   */
  private String name;
  /**
   * 年龄
   */
  private Integer age;
  /**
   * 密码
   */
  private String password;
  /**
   * 邮箱
   */
  private String email;

  @Override
  public boolean equals(final Object o) {
    if (this == o) return true;
    if (o == null || getClass() != o.getClass()) return false;
    final User user = (User) o;
    return Objects.equals(id, user.id) && Objects.equals(name, user.name);
  }

  @Override
  public int hashCode() {
    return Objects.hash(id, name);
  }

  @Override
  public int compareTo(final User o) {
    return o.getAge() - this.getAge();
  }
}
```

```java hl:22
@Test
public void sortedStreamTest() {
  // sorted排序1：基本数据类型排序
  final Stream<Integer> integerStream = Stream.of(4, 2, 3, 5, 1);
  integerStream.sorted().forEach(System.out::println);
  System.out.println("================================");
  final Stream<String> stringStream = Stream.of("apple", "lenovo", "Huawei", "Xiaomi", "Lenovo");
  stringStream.sorted().forEach(System.out::println);
  System.out.println("================================");

  // sorted排序2：自定义对象排序，按照年龄从大到小排序
  final User user1 = new User(1, "张三", 20, "123456", "zs@qq.com");
  final User user2 = new User(2, "李四", 21, "123456", "ls@qq.com");
  final User user3 = new User(3, "王五", 22, "123456", "ww@qq.com");
  final User user4 = new User(4, "赵六", 23, "123456", "zl@qq.com");
  final User user5 = new User(5, "钱七", 24, "123456", "q7@qq.com");
  // 从List集合创建Stream流 useListToStream
  final List<User> userList = List.of(user1, user2, user3, user4, user5);
  final Stream<User> useListToStream = userList.stream();
  /*useListToStream.sorted().forEach(System.out::println);*/
  /*useListToStream.sorted(Comparator.comparingInt(User::getAge)).forEach(System.out::println); // 升序*/
  useListToStream.sorted(Comparator.comparingInt(User::getAge).reversed()).forEach(System.out::println); // 降序
}
```

测试结果如下所示：

```text
1
2
3
4
5
================================
Huawei
Lenovo
Xiaomi
apple
lenovo
================================
User(id=5, name=钱七, age=24, password=123456, email=q7@qq.com)
User(id=4, name=赵六, age=23, password=123456, email=zl@qq.com)
User(id=3, name=王五, age=22, password=123456, email=ww@qq.com)
User(id=2, name=李四, age=21, password=123456, email=ls@qq.com)
User(id=1, name=张三, age=20, password=123456, email=zs@qq.com)
```

### map

map 映射：提供一个映射规则，将流中的每一个元素替换成指定的元素。

```java
@Test
public void mapStreamTest() {
  final User user1 = new User(1, "张三", 20, "123456", "zs@qq.com");
  final User user2 = new User(2, "李四", 21, "123456", null);
  final User user3 = new User(3, "王五", 22, "123456", "");
  final User user4 = new User(4, "赵六", 22, "123456", "zl@qq.com");
  final User user5 = new User(5, "钱七", 25, "123456", "q7@qq.com");

  // 从List集合创建Stream流 useListToStream
  final List<User> userList = List.of(user1, user2, user3, user4, user5);
  final Stream<User> useListToStream = userList.stream();

  // map映射1：将邮箱的域名更改为 "@sina.com"
  /*final List<String> mapUserList1 = useListToStream.map(user -> user.getEmail().replace("@qq.com", "@sina.com")).collect(Collectors.toList());
    mapUserList1.forEach(System.out::println);*/

  // map映射2：将邮箱的域名更改为 "@sina.com"，返回user集合
  /*final List<User> mapUserList2 = useListToStream.map(user -> {
      user.setEmail(user.getEmail().replace("@qq.com", "@sina.com"));
      return user;
    }).collect(Collectors.toList());
    mapUserList2.forEach(System.out::println);*/

  // map映射3：筛选填写过邮箱的用户，将邮箱的域名更改为 "@sina.com"
  final List<User> mapUserList3 = useListToStream
  .filter(user -> checkUserEmail(user.getEmail()))
  .map(user -> {
    user.setEmail(user.getEmail().replace("@qq.com", "@sina.com"));
    return user;
  }).collect(Collectors.toList());
  mapUserList3.forEach(System.out::println);
}

```

测试结果如下所示：

```text
User(id=1, name=张三, age=20, password=123456, email=zs@sina.com)
User(id=4, name=赵六, age=22, password=123456, email=zl@sina.com)
User(id=5, name=钱七, age=25, password=123456, email=q7@sina.com)
```

### flatmap

flatmap 扁平化：用于将流中的每个元素映射为一个流，然后将这些流扁平化为一个流。常用于处理嵌套集合、合并多个流等场景。

栗子 1：

```java hl:17
@Test
public void flatMapStreamTest() {
  final User user1 = new User(1, "张三", 20, "123456", "zs@qq.com");
  final User user2 = new User(2, "李四", 21, "123456", "ls@qq.com");
  final User user3 = new User(3, "王五", 22, "123456", "ww@qq.com");
  final User user4 = new User(4, "赵六", 23, "123456", "zl@qq.com");
  final User user5 = new User(5, "钱七", 24, "123456", "q7@qq.com");

  // 从List集合创建Stream流 useListToStream
  final List<User> userList1 = List.of(user1, user2);
  final List<User> userList2 = List.of(user3, user4);
  final List<User> userList3 = List.of(user5);
  final List<List<User>> userList = List.of(userList1, userList2, userList3);
  final Stream<List<User>> useListToStream = userList.stream();

  // flatMap扁平化：将集合 userList1、userList2、userList3 中超过20岁的用户重新组合到一个新的集合中
  final List<User> collect = useListToStream.flatMap(List::stream).filter(user -> user.getAge() > 20).collect(Collectors.toList());
  collect.forEach(System.out::println);
}
```

测试结果如下所示：

```text
User(id=2, name=李四, age=21, password=123456, email=ls@qq.com)
User(id=3, name=王五, age=22, password=123456, email=ww@qq.com)
User(id=4, name=赵六, age=23, password=123456, email=zl@qq.com)
User(id=5, name=钱七, age=24, password=123456, email=q7@qq.com)
```

栗子 2：

```java
@Test
public void flatMapStreamTest2() {
  Stream.of("Hello", "World")
          .map(s -> s.split(""))  // 转换成['H','e','l','l','o'],['W','o','r','l','d'] 两个数组
          .flatMap(Arrays::stream) // 将两个数组扁平化成为 ['H','e','l','l','o','W','o','r','l','d'] 一个数组
          .distinct() // 去除重复元素
          .forEach(System.out::print); // 打印结果：HeloWrd
}
```

![](https://img.xiaorang.fun/202502251812774.png)

### peek

peek 遍历处理：生成一个与原始流相同的流，但在每个元素被消费时，提供一个消费函数（Consumer）进行处理，常用于调试。

```java
@Test
public void peekStreamTest() {
  final User user1 = new User(1, "张三", 20, "123456", "zs@qq.com");
  final User user2 = new User(2, "李四", 21, "123456", null);
  final User user3 = new User(3, "王五", 22, "123456", "");
  final User user4 = new User(4, "赵六", 22, "123456", "zl@qq.com");
  final User user5 = new User(5, "钱七", 25, "123456", "q7@qq.com");

  // 从List集合创建Stream流 useListToStream
  final List<User> userList = List.of(user1, user2, user3, user4, user5);
  final Stream<User> useListToStream = userList.stream();

  // peek遍历1：将集合userList中的用户打印出来
  /*useListToStream.peek(System.out::println).collect(Collectors.toList());*/

  // peek遍历2：将集合userList中未填写邮件的用户打印出来
  useListToStream.filter(user -> !checkUserEmail(user.getEmail())).peek(System.out::println).collect(Collectors.toList());
}
```

测试结果如下所示：

```text
User(id=2, name=李四, age=21, password=123456, email=null)
User(id=3, name=王五, age=22, password=123456, email=)
```

## 终止操作

### forEach & ForEachOrdered

forEach & forEachOrdered 遍历：foeEachOrdered 主要用在并行流当中，用于去保证顺序，在并行流下 forEach 肯定会乱序的。

```java
@Test
public void forEachStreamTest() {
  final User user1 = new User(1, "张三", 20, "123456", "zs@qq.com");
  final User user2 = new User(2, "李四", 21, "123456", "ls@qq.com");
  final User user3 = new User(3, "王五", 22, "123456", "ww@qq.com");
  final User user4 = new User(4, "赵六", 23, "123456", "zl@qq.com");
  final User user5 = new User(5, "钱七", 24, "123456", "q7@qq.com");

  // 从List集合创建Stream流 useListToStream
  final List<User> userList = List.of(user1, user2, user3, user4, user5);
  // final Stream<User> useListToStream = userList.stream(); // 串行流
  final Stream<User> useListToStream = userList.parallelStream(); // 并行流

  // forEach遍历
  // useListToStream.forEach(System.out::println);
  // forEachOrdered遍历
  useListToStream.forEachOrdered(System.out::println);
}
```

测试结果如下所示：

```text
User(id=1, name=张三, age=20, password=123456, email=zs@qq.com)
User(id=2, name=李四, age=21, password=123456, email=ls@qq.com)
User(id=3, name=王五, age=22, password=123456, email=ww@qq.com)
User(id=4, name=赵六, age=23, password=123456, email=zl@qq.com)
User(id=5, name=钱七, age=24, password=123456, email=q7@qq.com)
```

### collect

collect 收集：对流中的数据执行收集操作（如收集到 List，Set，Map 集合中）。在 Collectors 类中提供了许多静态方法，可以方便地创建常见收集实例。

| 方法           | 返回值类型                 | 作用                                                                                                                                                                                            |
| -------------- | -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| toList         | List<T>                    | 用于将流中的元素收集到一个新的 List 集合中                                                                                                                                                      |
| toSet          | Set<T>                     | 用于将流中的元素收集到一个新的 Set 集合中                                                                                                                                                       |
| toMap          | Colection<T, ?, Map<K, U>> | 用于将流中的元素转换为一个 Map。每个元素通过提供的 keyMapper 和 valueMapper 来生成键和值，并支持在键冲突时通过 mergeFunction 来合并值。如果没有定义 mergeFunction，那么在键冲突时报键重复异常！|
| toCollection   | Colection<T>               | 用于将流中的元素收集到由用户提供的集合类型中。它支持任何实现了 Collection 接口的集合类型（如 ArrayList、LinkedList、HashSet 等）|
| counting       | Long                       | 用于统计流中元素的数量，如果流中没有元素，则返回 0                                                                                                                                              |
| summingInt     | Integer                    | 用来计算流中元素经过 ToIntFunction 函数处理后的所有 int 值的总和。例如，可以用它来计算一个整数列表中所有数的总和，或者从对象流中提取某个字段的数值并求和。如果流为空，则返回 0                  |
| averagingInt   | Double                     | 用来计算流中元素经过 ToIntFunction 函数处理后的所有 int 值的算术平均值。如果流为空，则返回 0                                                                                                    |
| summarizingInt | IntSummaryStatistics       | 对流中的元素进行整数值的汇总统计，包括总和、平均值、最大值、最小值等。|
| joining        | String                     | 用于将流中的字符序列元素连接成一个字符串。可以提供分隔符、前缀和后缀。|
| maxBy          | Optional<T>                | 根据给定的比较器选择流中的最大值。如果流为空，返回 Optional. empty ()。|
| minBy          | Optional<T>                | 根据给定的比较器选择流中的最小值。如果流为空，返回 Optional. empty ()。|
| reducing       | 规约产生的类型             | 根据提供的合并规则将流中的元素合并成一个单一的值。可以用来做如求和、求最大值、求最小值等。|
| groupingBy     | Map<K, List<T>>            | 根据流中元素的某个属性值对流进行分组，生成一个 Map，键是属性值，值是该属性值对应的元素列表。|
| partitioningBy | Map<Boolean, List<T>>      | 根据给定的条件对流中的元素进行分区，生成一个 Map。键是布尔值，表示元素是否满足条件，值是满足条件或不满足条件的元素列表。|

```java
@Test
public void collectStreamTest() {
  final User user1 = new User(1, "张三", 20, "123456", "zs@qq.com");
  final User user2 = new User(2, "李四", 21, "123456", "ls@qq.com");
  final User user3 = new User(3, "王五", 22, "123456", "ww@qq.com");
  final User user4 = new User(4, "赵六", 22, "123456", "zl@qq.com");
  final User user5 = new User(5, "钱七", 24, "123456", "q7@qq.com");
  final User user6 = new User(6, "钱七", 24, "123456", "q7@qq.com");

  // 从List集合创建Stream流 useListToStream
  final List<User> userList = List.of(user1, user2, user3, user4, user5, user6);
  final Stream<User> useListToStream = userList.stream(); // 串行流

  // 使用joining将用户的用户名连接起来
  /*final String str = useListToStream.map(User::getName).collect(Collectors.joining(", ", "[", "]"));
    System.out.println(str);*/

  // 统计用户数量
  /*final long count = useListToStream.collect(Collectors.counting());
    System.out.println(count);*/

  // 统计用户的年龄总和
  /*final Integer sumAge = useListToStream.collect(Collectors.summingInt(User::getAge));
    System.out.println(sumAge);*/

  // 统计用户的平均年龄
  /*final Double averageAge = useListToStream.collect(Collectors.averagingInt(User::getAge));
    System.out.println(averageAge);*/

  // 统计用户的最小年龄
  /*final Optional<User> optionalUser = useListToStream
            .collect(Collectors.minBy(Comparator.comparing(User::getAge)));
    optionalUser.ifPresent(user -> System.out.println(user.getAge()));*/

  // 统计用户的最大年龄
  /*useListToStream
            .collect(Collectors.maxBy(Comparator.comparing(User::getAge)))
            .ifPresent(user -> System.out.println(user.getAge()));*/

  // 对用户年龄的汇总统计
  /*final IntSummaryStatistics summaryStatistics = useListToStream.collect(Collectors.summarizingInt(User::getAge));
    System.out.println(summaryStatistics);*/

  // 根据用户年龄进行分组
  /*final Map<Integer, List<User>> collect = useListToStream.collect(Collectors.groupingBy(User::getAge));
    collect.forEach((k, v) -> System.out.println("年龄为 " + k + " 岁的有:" + v));*/
  // 根据用户年龄进行分组并取出id最大的用户
  /*final Map<Integer, Optional<User>> collect = useListToStream.collect(Collectors.groupingBy(User::getAge, Collectors.reducing(BinaryOperator.maxBy(Comparator.comparing(User::getId)))));
    collect.forEach((k, v) -> System.out.println("年龄为 " + k + " 岁的并且id最大的为:" + v.get()));*/

  // 根据用户年龄是否大于22进行分区
  /*final Map<Boolean, List<User>> collect = useListToStream.collect(Collectors.partitioningBy(user -> user.getAge() > 22));
    collect.forEach((k, v) -> {
      String str = k ? "年龄大于22岁的有:" : "年龄小于等于22岁的有:";
      System.out.println(str + v);
    });*/

  // 使用reducing实现求和的功能
  /*final Integer sumAge = useListToStream.collect(Collectors.reducing(0, User::getAge, Integer::sum));
    System.out.println(sumAge);*/

  // 使用reducing实现求最大值的功能
  /*useListToStream
            .collect(Collectors.reducing(BinaryOperator.maxBy(Comparator.comparing(User::getAge))))
            .ifPresent(user -> System.out.println(user.getAge()));*/

  // 将用户信息收集到Map集合中
  final Map<String, User> collect = useListToStream.collect(Collectors.toMap(User::getName, Function.identity(), (u1, u2) -> u2));
  collect.forEach((k, v) -> System.out.println(k + ":" + v));
}
```

测试结果如下所示：

```text
钱七:User(id=6, name=钱七, age=24, password=123456, email=q7@qq.com)
李四:User(id=2, name=李四, age=21, password=123456, email=ls@qq.com)
张三:User(id=1, name=张三, age=20, password=123456, email=zs@qq.com)
王五:User(id=3, name=王五, age=22, password=123456, email=ww@qq.com)
赵六:User(id=4, name=赵六, age=22, password=123456, email=zl@qq.com)
```

#### 详解 collect 方法

```java
<R> R collect(Supplier<R> supplier, BiConsumer<R, ? super T> accumulator, BiConsumer<R, R> combiner);
```

该方法用于将流中的元素收集到某个容器（或对象）中，并允许自定义收集过程。它提供了一个非常灵活的机制，通过三个参数 (supplier, accumulator, combiner) 来定义如何进行收集。

- `Supplier<R> supplier`
  - 描述：提供一个新的结果容器（R）的方法。
    - 作用：用于初始化一个空的容器，收集的结果将存储在这个容器中。
    - 通常是工厂方法，例如 ArrayList:: new、HashSet:: new 等。
- `BiConsumer<R, ? super T> accumulator`
  - 描述：定义如何将流中的元素逐个添加到结果容器中的方法。
  - 作用：流中的每个元素（T）会通过这个方法被放入到容器（R）中。
  - 通常实现为对容器进行修改的操作，例如 List:: add。
- `BiConsumer<R, R> combiner`
  - 描述：定义如何将两个部分结果容器（R 和 R）合并的方法。
  - 作用：在并行流中，多个线程可能会产生多个部分结果容器，这个方法定义了如何合并这些容器。
  - 在串行流中，这个方法通常不会被调用，但它仍然需要定义。

![](https://img.xiaorang.fun/202502251814882.png)

```java
@Test
public void collectStreamTest2() {
  // 仿Collectors.toList()方法实现一个toList()
  final ArrayList<Integer> collect = Stream.of(1, 2, 3, 4).collect(ArrayList::new, ArrayList::add, ArrayList::addAll);
  System.out.println(collect); // [1, 2, 3, 4]

  // 仿Collectors.toMap()方法实现一个toMap()
  final User user1 = new User(1, "张三", 20, "123456", "zs@qq.com");
  final User user2 = new User(2, "李四", 21, "123456", "ls@qq.com");
  final User user3 = new User(3, "王五", 22, "123456", "ww@qq.com");
  final User user4 = new User(4, "赵六", 22, "123456", "zl@qq.com");
  final User user5 = new User(5, "钱七", 24, "123456", "q7@qq.com");
  final HashMap<String, Integer> collect1 = Stream.of(user1, user2, user3, user4, user5)
  .collect(HashMap::new,
           (map, element) -> map.merge(element.getName(), element.getAge(), (e1, e2) -> e1), HashMap::putAll);
  System.out.println(collect1); // {钱七=24, 李四=21, 张三=20, 王五=22, 赵六=22}
}
```

> [!tip]
> 其中 merge 方法可以方便地将一个键和值合并到 Map 中，同时允许通过一个自定义的合并逻辑（remappingFunction）来处理键冲突的情况。

测试结果如下所示：

```text
[1, 2, 3, 4]
{钱七=24, 李四=21, 张三=20, 王五=22, 赵六=22}
```

### toArray

toArray：将流中的元素保存到一个数组当中。

```java
@Test
public void toArrayStreamTest() {
  final User user1 = new User(1, "张三", 20, "123456", "zs@qq.com");
  final User user2 = new User(2, "李四", 21, "123456", "ls@qq.com");
  final User user3 = new User(3, "王五", 22, "123456", "ww@qq.com");
  final User user4 = new User(4, "赵六", 22, "123456", "zl@qq.com");
  final User user5 = new User(5, "钱七", 24, "123456", "q7@qq.com");

  // 从List集合创建Stream流 useListToStream
  final List<User> userList = List.of(user1, user2, user3, user4, user5);
  final Stream<User> useListToStream = userList.stream();

  // 将Stream流中的元素收集到数组中
  final User[] users = useListToStream.toArray(User[]::new);
  for (final User user : users) {
    System.out.println(user);
  }
}
```

测试结果如下所示：

```text
User(id=1, name=张三, age=20, password=123456, email=zs@qq.com)
User(id=2, name=李四, age=21, password=123456, email=ls@qq.com)
User(id=3, name=王五, age=22, password=123456, email=ww@qq.com)
User(id=4, name=赵六, age=22, password=123456, email=zl@qq.com)
User(id=5, name=钱七, age=24, password=123456, email=q7@qq.com)
```

### findFirst & findAny

- findFirst：返回流中的第一个元素
- findAny：返回流中的任意一个元素

> [!info]
> 串行流中 2 个 find 方法返回的结果一样；并行流中 findAny 返回最先处理完毕的数据。
> 2 个 find 方法均返回一个 Optional 对象，在访问其值之前先检查 Optional 对象是否存在值。

```java
@Test
public void findXxxStreamTest() {
  final User user1 = new User(1, "张三", 20, "123456", "zs@qq.com");
  final User user2 = new User(2, "李四", 21, "123456", "ls@qq.com");
  final User user3 = new User(3, "王五", 22, "123456", "ww@qq.com");
  final User user4 = new User(4, "赵六", 22, "123456", "zl@qq.com");
  final User user5 = new User(5, "钱七", 24, "123456", "q7@qq.com");

  // 从List集合创建Stream流 useListToStream
  final List<User> userList = List.of(user1, user2, user3, user4, user5);
  final Stream<User> useListToStream = userList.stream(); // 串行流

  // 查找第一个大于20岁的用户
  // useListToStream.filter(user -> user.getAge() > 20).findFirst().ifPresent(System.out::println);

  // 查找任意一个大于20岁的用户
  useListToStream.filter(user -> user.getAge() > 20).findAny().ifPresent(System.out::println);
}
```

测试结果如下所示：

```text
User(id=2, name=李四, age=21, password=123456, email=ls@qq.com)
```

### allMatch & noneMatch & anyMatch

- allMatch：当流中所有的元素都匹配指定的规则时才会返回 true，否则返回 false。
- noneMatch：当流中所有的元素都无法匹配指定的规则时才返回 true，否则返回 false。
- anyMatch：当流中任意一个元素匹配指定的规则时就会返回 true，流中所有的元素都无法匹配指定的规则时返回 false。

```java
@Test
public void allAndAnyAndNoneMatchStreamTest() {
  final User user1 = new User(1, "张三", 20, "123456", "zs@qq.com");
  final User user2 = new User(2, "李四", 21, "123456", "ls@qq.com");
  final User user3 = new User(3, "王五", 22, "123456", "ww@qq.com");
  final User user4 = new User(4, "赵六", 22, "123456", "zl@qq.com");
  final User user5 = new User(5, "钱七", 24, "123456", "q7@qq.com");

  // 从List集合创建Stream流 useListToStream
  final List<User> userList = List.of(user1, user2, user3, user4, user5);
  final Stream<User> useListToStream = userList.stream();

  // 判断用户是否全部大于23岁？
  /*final boolean allMatch = useListToStream.allMatch(user -> user.getAge() > 23);
    System.out.println("allMatch = " + allMatch);*/

  // 判断是否存在超过23岁的用户？
  final boolean anyMatch = useListToStream.anyMatch(user -> user.getAge() > 23);
  System.out.println("anyMatch = " + anyMatch);
}
```

测试结果如下所示：

```text
anyMatch = true
```

### min & max & count & sum

- min、max 方法均返回一个 Optional 对象，在访问其值之前要先检查 Optional 对象是否存在值。
- count 方法返回 long。
- sum 方法仅适用于 IntStream、LongStream 和 DoubleStream 创建的流。

```java
@Test
public void maxAndMinAndCountAndSumStreamTest() {
  final Stream<Integer> stream = Stream.of(10, 20, 33, 6, 49);

  // max|min
  // stream.max(Integer::compareTo).ifPresent(System.out::println);
  // stream.min(Integer::compareTo).ifPresent(System.out::println);

  // count
  final long count = stream.count();
  System.out.println("count = " + count);

  final IntStream intStream = IntStream.of(10, 20, 33, 6, 49);
  final int sum = intStream.sum();
  System.out.println("sum = " + sum);
}
```

测试结果如下所示：

```text
count = 5
sum = 118
```

### reduce

reduce 聚合：本意为缩减，引申为聚合，也叫规约。是指将流中的数据按照一定的规则计算合并成单个值（Optional 对象）

基本语法：reduce (identity, accumulator, combiner)

- identity：代表（每个线程的）初始值，可省略。省略时，将 Stream 流的第一个值作为初始值。
- accumulator：代表累加器，它是一个二元运算器，指定当前元素与下一个元素合并的方式。
- combiner：代表组合器，可省略。在并行流中组合器用来合并多线程计算的结果，在串行流中不起作用。

```java
@Test
public void reduceStreamTest() {
  System.out.println("=====================================1个参数（累加器）的版本=====================================");

  // 使用reduce实现求和
  Stream.of(1, 2, 3).reduce(Integer::sum).ifPresent(sum -> System.out.println("sum = " + sum));

  // 使用reduce求最大值
  Stream.of(3, 5, 11, 99, 12).reduce(Integer::max).ifPresent(max -> System.out.println("max = " + max));

  // 使用reduce实现字符串拼接
  Stream.of("Hello", "Java", "Stream", "!").reduce((s1, s2) -> s1 + " " + s2).ifPresent(str -> System.out.println("str = " + str));

  final User user1 = new User(1, "张三", 20, "123456", "zs@qq.com");
  final User user2 = new User(2, "李四", 21, "123456", "ls@qq.com");
  final User user3 = new User(3, "王五", 22, "123456", "ww@qq.com");
  final User user4 = new User(4, "赵六", 22, "123456", "zl@qq.com");
  final User user5 = new User(5, "钱七", 24, "123456", "q7@qq.com");

  // 从List集合创建Stream流 useListToStream
  final List<User> userList = List.of(user1, user2, user3, user4, user5);
  final Stream<User> useListToStream = userList.stream();

  // 求用户的最大年龄
  useListToStream.map(User::getAge).reduce(Integer::max).ifPresent(maxAge -> System.out.println("maxAge = " + maxAge));

  System.out.println("==================================2个参数（初始值，累加器）的版本==================================");

  // 使用reduce实现求和
  Integer identity = 10;
  final Integer sum = Stream.of(1, 2, 3, 4).reduce(identity, (n1, n2) -> {
    final String format = String.format("n1(%d) + n2(%d) = %d %s", n1, n2, n1 + n2, Thread.currentThread().getName());
    System.out.println(format);
    return n1 + n2;
  });
  System.out.println("sum = " + sum);
  System.out.println("----------------------------------");
  final Integer sum2 = Stream.of(1, 2, 3, 4).parallel().reduce(identity, (n1, n2) -> {
    final String format = String.format("n1(%d) + n2(%d) = %d %s", n1, n2, n1 + n2, Thread.currentThread().getName());
    System.out.println(format);
    return n1 + n2;
  });
  System.out.println("sum2 = " + sum2);

  System.out.println("================================3个参数（初始值，累加器，组合器）的版本================================");
  final Integer sum3 = Stream.of(1, 2, 3, 4).parallel().reduce(identity, (n1, n2) -> {
    final String format = String.format("累加器 n1(%d) + n2(%d) = %d %s", n1, n2, n1 + n2, Thread.currentThread().getName());
    System.out.println(format);
    return n1 + n2;
  }, (x, y) -> {
    final String format = String.format("组合器 n1(%d) + n2(%d) - identity(%d) = %d %s", x, y, identity, x + y - identity, Thread.currentThread().getName());
    System.out.println(format);
    return x + y - identity;
  });
  System.out.println("sum3 = " + sum3);
}
```

测试结果如下所示：

```text
=====================================1个参数（累加器）的版本=====================================
sum = 6
max = 99
str = Hello Java Stream !
maxAge = 24
==================================2个参数（初始值，累加器）的版本==================================
n1(10) + n2(1) = 11 main
n1(11) + n2(2) = 13 main
n1(13) + n2(3) = 16 main
n1(16) + n2(4) = 20 main
sum = 20
----------------------------------
n1(10) + n2(3) = 13 main
n1(10) + n2(4) = 14 main
n1(13) + n2(14) = 27 main
n1(10) + n2(2) = 12 ForkJoinPool.commonPool-worker-1
n1(10) + n2(1) = 11 main
n1(11) + n2(12) = 23 main
n1(23) + n2(27) = 50 main
sum2 = 50
================================3个参数（初始值，累加器，组合器）的版本================================
累加器 n1(10) + n2(2) = 12 ForkJoinPool.commonPool-worker-2
累加器 n1(10) + n2(3) = 13 main
累加器 n1(10) + n2(1) = 11 ForkJoinPool.commonPool-worker-1
累加器 n1(10) + n2(4) = 14 ForkJoinPool.commonPool-worker-3
组合器 n1(11) + n2(12) - identity(10) = 13 ForkJoinPool.commonPool-worker-1
组合器 n1(13) + n2(14) - identity(10) = 17 ForkJoinPool.commonPool-worker-3
组合器 n1(13) + n2(17) - identity(10) = 20 ForkJoinPool.commonPool-worker-3
sum3 = 20
```

## 并行流

并行流就是将数据分拆成多个部分来进行处理，每个部分可以交给不同的线程来并发处理，以达到提高处理速度的效果。

创建并行流，只需在串行流上调用 parallel () 方法即可，或者直接在获取源时使用 parallelStream ()。

并行流针对无状态转换的操作效果提升明显，而对有状态转换的操作反而会导致性能下降。

- 无状态：Stream 流中的元素处理不受其他元素的影响，如 filter、map、flatMap、peek…
- 有状态：只有拿到 Stream 流中的全部元素之后，才能执行的操作，如 distinct、sorted、limit、skip…

```java
@Test
public void parallelStreamTest() {
  // 串行流
  // final Stream<Integer> stream = Stream.of(1, 2, 3, 4, 5);
  // 并行流
  // final Stream<Integer> stream = Stream.of(1, 2, 3, 4, 5).parallel();
  final Stream<Integer> stream = Arrays.asList(1, 2, 3, 4, 5).parallelStream();

  // 流的线程信息
  stream.peek (integer -> System.out.println (integer + ": " + Thread.currentThread (). getName ())). collect (Collectors.toList ());
}
```

测试结果如下所示：

```text
2: ForkJoinPool. commonPool-worker-1
3:main
4: ForkJoinPool. commonPool-worker-4
1: ForkJoinPool. commonPool-worker-3
5: ForkJoinPool. commonPool-worker-2
```
