---
tags:
  - Java/JavaSE
version: JDK8
create_time: 2025/07/14 23:35
update_time: 2025/07/14 23:37
priority: 3
---

JDK1.8 添加的容器对象，在一些场景下避免使用 `null` 检查而设定的类，尽可能避免的 `NullPointerException` 异常。

## 创建 Optional 实例

Optional 私有了构造函数，因此只能通过 Optional 对外提供的三个静态方法构造实例

- `public static<T> Optional<T> empty ()` 返回一个空的 Optional 实例，即不包含任何值的 Optional。这个方法通常用于表示空值的情况。
- `public static <T> Optional<T> of (T value)` 创建一个包含非空值的 Optional 实例。如果传入的值为 null 的话会直接抛出 `NullPointerException` 异常。
- `public static <T> Optional<T> ofNullable (T value)` 创建一个 Optional 实例。如果传入的值是 null，则返回一个空的 Optional（Optional. empty ()）。否则，返回一个包含该值的 Optional。

## Optional 实例方法

### get

该方法适用于**确定 Optional 中存在值**的情况。如果 Optional 中没有值，调用该方法将会抛出`NullPointerException` 异常。

```java
public class OptionalTest {
  @Test
  public void test() {
    final Optional<Object> empty = Optional.empty();
    // System.out.println("empty.get() = " + empty.get()); // 抛出 NoSuchElementException 异常

    final Optional<Object> nullable = Optional.ofNullable(null);
    // System.out.println("nullable.get() = " + nullable.get());  // 抛出 NoSuchElementException 异常

    final Optional<String> non = Optional.of("test");
    System.out.println("non.get() = " + non.get()); // non.get() = test
  }
}
```

### orElse

该方法用于在 Optional 中的值不存在时提供一个备用值。它的作用是从 Optional 中获取值，如果值存在则返回该值，如果值为空（即 Optional 中没有值），则返回传入的备用值。

```java
@Test
public void test2() {
  Object data1 = Optional.ofNullable(null).orElse("data");
  System.out.println(data1); // data
  Object data2 = Optional.of("data1").orElse("data2");
  System.out.println(data2); // data1
}

```

### orElseGet

该方法用于在 Optional 中的值不存在时提供一个备用值。与 orElse (T other) 不同，orElseGet 允许你提供一个**延迟计算**的备用值，而不是直接传入一个常量值。

```java
@Test
public void test3() {
  final Object str = Optional.empty().orElseGet(() -> "Default Value");
  System.out.println(str); // Default Value

  final String str2 = Optional.of("Hello, World!").orElseGet(() -> "Default Value");
  System.out.println(str2); // Hello, World!
}
```

### orElseThrow

该方法用于在 Optional 中没有值时，抛出一个自定义的异常。`orElseThrow (Supplier<? extends X> exceptionSupplier)` 允许你通过一个 Supplier 动态生成一个自定义的异常。

```java
@Test
public void test4() {
  final String res = Optional.of("Hello, World!").orElseThrow(() -> new IllegalArgumentException("Value is missing"));
  System.out.println(res); // Hello, World!

  final Object res2 = Optional.empty().orElseThrow(() -> new IllegalArgumentException("Value is missing"));
  System.out.println(res2); // 抛出 IllegalArgumentException 异常
}
```

### isPresent

该方法用于检查 Optional 实例中是否存在值。如果 Optional 中包含值，则返回 true；如果 Optional 中为空（即没有值），则返回 false。

```java
@Test
public void test5() {
  final boolean b1 = Optional.empty().isPresent(); // false
  final boolean b2 = Optional.ofNullable(null).isPresent(); // false
  final boolean b3 = Optional.of("Hello, World!").isPresent(); // true
}
```

### ifPresent

该方法用于在 Optional 中包含值时执行给定的 Consumer 操作。该方法是 Optional 类中最常用的功能之一，它避免了显式的空值检查，并且是函数式编程风格的体现。

```java
@Test
public void test6() {
  Optional.empty().ifPresent(System.out::println); // 不执行任何操作
  Optional.of("Hello, World!").ifPresent(System.out::println); // "Hello, World!"
}

```

### filter

该方法基于提供的条件过滤 Optional 的值。如果 Optional 中的值满足提供的 Predicate 条件，则返回包含该值的 Optional；否则返回一个空的 Optional。

```java
@Test
public void test7() {
  Predicate<Integer> predicate = num -> num > 40;
  Optional.of(42).filter(predicate).ifPresent(System.out::println); // 42
  Optional.of(30).filter(predicate).ifPresent(System.out::println); // 不执行任何操作
}
```

### map

该方法用于将 Optional 中的值映射到另一个类型。该方法接受一个 Function 类型的参数，它描述了如何转换 Optional 中的值。如果 Optional 中有值，则使用 Function 对该值进行转换，并返回一个包含新值的 Optional；如果 Optional 为空，则直接返回一个空的 Optional。

```java
@Test
public void test8() {
  Optional.of("hello").map(String::toUpperCase).ifPresent(System.out::println); // HELLO
  Optional.of(42).map(String::valueOf).ifPresent(System.out::println); // 42
}

```

### flatMap

该方法用于将 Optional 中的值映射到另一个 Optional。与 map 不同，flatMap 会扁平化结果，因此返回的是一个 `Optional<U>`，而不是 `Optional<Optional<U>>`。

```java
@Test
public void test9 () {
  final Optional<String> optional1 = Optional.of ("hello");
  final Optional<String> optional2 = Optional.of ("world");
  optional1.flatMap (s1 -> optional2.map (s2 -> s1 + " " + s2)). ifPresent (System. out::println); // hello world
}
```
