---
tags:
  - Java/EffectiveJava
priority: 9
create_time: 2025/07/15 19:08
update_time: 2025/07/16 22:35
---

## 显式关闭资源为何如此重要？

Java 标准库中大量资源类（如 `InputStream`、`OutputStream`、`java.sql.Connection` 等）都要求显式调用 `close()` 方法进行释放。若未及时关闭，可能造成严重的性能问题。例如：

- 内存泄漏（Memory Leak）
- 文件描述符耗尽（File Descriptor Exhaustion）
- 数据库连接池耗尽（Connection Pool Exhaustion）

虽然部分类实现了 `finalize()` 方法，作为关闭失败时的兜底方案，但这种做法并不可靠（详见：[[Item8 Avoid finalizers and cleaners]]）：

- Finalizer 的执行时机不可控，甚至可能永远不会执行
- 会显著增加垃圾回收负担，影响性能
- 无法保证资源被及时释放

## try-finally

在 Java 7 之前，`try-finally` 是确保资源在异常或提前返回情况下仍能被正确关闭的标准写法：

```java
// try-finally - No longer the best way to close resources!
static String firstLineOfFile(String path) throws IOException {
  BufferedReader br = new BufferedReader(new FileReader(path));
  try {
    return br.readLine();
  } finally {
    br.close();
  }
}
```

在处理多个资源时，try-finally 的可读性和可维护性就显著下降：

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

存在的问题：

- 嵌套层级多、结构混乱，可读性差
- 每个资源都需单独封装，极易遗漏或写错
- 随着资源数量增加，代码膨胀严重

## try-with-resources

Java 7 引入的 `try-with-resources` 语法从根本上解决了上述问题。只要资源类**实现了 `AutoCloseable` 接口**，即可使用该结构：

```java
interface AutoCloseable {
	void close() throws Exception;
}
```

Java 标准库及主流第三方库中的大多数资源类都已实现该接口。你在自定义资源类时，也应遵循这一规范。

### 示例

使用 try-with-resources 重写的 `firstLineOfFile` 方法，清晰简洁，能自动关闭资源：

```java
// try-with-resources - the the best way to close resources!
static String firstLineOfFile(String path) throws IOException {
  try (BufferedReader br = new BufferedReader(new FileReader(path))) {
    return br.readLine();
  }
}
```

在传统写法中，多个资源需要嵌套多个 try-finally，而使用 try-with-resources 则非常简洁：

```java
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

**多个资源可在同一个 `try` 中声明，按顺序打开、按逆序关闭，无需嵌套，即可确保每个资源都被正确释放。**

### 异常抑制机制

当 `try` 块和 `close()` 方法都抛出异常时，关闭过程中的异常会被抑制并附加到主异常：

- 在异常堆栈中以 "Suppressed" 标记显示
- 可通过 `Throwable.getSuppressed()` 方法访问
- 有助于定位关闭资源过程中的问题，同时保持主异常的信息完整。

### 配合 catch 使用

try-with-resources 同样支持 `catch` 块，可直接用于异常处理，无需额外嵌套。以下是一个稍作简化的示例：当读取失败时返回默认值。

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

## 总结

> [!important]
> 在处理需要关闭的资源时，应始终**优先使用 try-with-resources 而非 try-finally**。

- 写法简洁，结构清晰，可读性强
- 自动关闭资源，避免遗漏
- 支持多资源，处理更安全
- 可抑制关闭异常，提升调试能力

try-with-resources 是现代 Java 开发中不可或缺的资源管理机制，应作为默认首选。
