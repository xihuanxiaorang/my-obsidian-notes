---
tags:
  - Java/EffectiveJava
priority: 9
create_time: 2025/07/15 19:08
update_time: 2025/07/17 11:57
---

## Don't rely on finalizers or cleaners

`finalizer` 和 `cleaner` 曾被用作资源释放失败时的兜底方案，但它们并不可靠（详见 [[Item 8: Avoid finalizers and cleaners]]）：

- 执行时机不可预测，甚至可能永远不会执行
- 显著增加垃圾回收负担，影响系统性能
- 无法保证关键资源（如文件或数据库连接）被及时释放

未显式关闭资源可能导致：

- 内存泄漏（Memory Leak）
- 文件句柄耗尽（File Descriptor Exhaustion）
- 数据库连接池枯竭（Connection Pool Exhaustion）

## Avoid try-finally for resource closing

虽然使用 `try-finally` 手动释放资源曾是标准写法，但是在同时处理多个资源时存在明显缺陷：

```java
// try-finally is ugly when used with more than one resource!
static void copy(String src, String dst) throws IOException {
  InputStream in = new FileInputStream(src);
  try {
    OutputStream out = new FileOutputStream(dst);
    try {
      byte[] buf = new byte[BUFFER_SIZE];
      int n;
      while ((n = in.read(buf)) >= 0)
        out.write(buf, 0, n);
    } finally {
      out.close();
    }
  }
  finally {
    in.close();
  }
}
```

- 嵌套层级深，结构混乱，可读性差
- 每个资源都需单独包裹，极易遗漏或写错
- 随着资源数量增加，代码膨胀严重

## Use try-with-resources

自 Java 7 起，推荐使用 try-with-resources，适用于实现了 `AutoCloseable` 接口的资源类（如大多数 I/O、数据库类）：

```java
try (Resource res = new Resource()) {
  // use res
}
```

特性：
- 自动关闭资源，发生异常时也能安全释放
- 支持多个资源，按声明顺序打开、按逆序关闭
- 写法简洁，结构清晰，可读性强

✅ 推荐用法：

```java
// try-with-resources - the the best way to close resources!
static String firstLineOfFile(String path) throws IOException {
  try (BufferedReader br = new BufferedReader(new FileReader(path))) {
    return br.readLine();
  }
}
```

```java hl:3
// try-with-resources on multiple resources - short and sweet
static void copy(String src, String dst) throws IOException {
  try (InputStream in = new FileInputStream(src); OutputStream out = new FileOutputStream(dst)) {
    byte[] buf = new byte[BUFFER_SIZE];
    int n;
    while ((n = in.read(buf)) >= 0)
      out.write(buf, 0, n);
  }
}
```

## Exception suppression

若 `try` 块与 `close()` 方法同时抛出异常时：

- `close()` 方法抛出的异常：
	- 会被抑制并附加在主异常上
	- 可通过 `Throwable.getSuppressed()` 方法访问
	- 在异常堆栈中以 "Suppressed" 标记显示
- JVM 默认保留主异常，以便调试和防止丢失关键异常信息。

## With catch support

try-with-resources 可结合 `catch` 使用，处理异常更优雅：

```java
// try-with-resources with a catch clause
static String firstLineOfFile(String path, String defaultVal) {
  try (BufferedReader br = new BufferedReader(new FileReader(path))) {
    return br.readLine();
  } catch (IOException e) {
    return defaultVal;
  }
}
```

## Never forget

- 始终优先使用 try-with-resources 而非 try-finally
- 确保资源类实现 `AutoCloseable` 接口
