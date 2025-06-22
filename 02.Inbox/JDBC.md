---
tags:
  - Java
create_time: 2025-03-09T23:40:00
update_time: 2025/06/22 16:34
---

## 简介

JDBC（Java Database Connectivity）是 Java 提供的一套访问关系型数据库的标准 API（位于 `java.sql` 包）。JDBC 允许开发者使用 Java 与数据库交互。各数据库厂商根据 JDBC 规范提供自己的实现，称为**数据库驱动**（Driver）。通过加载合适的驱动，应用程序可以与不同数据库无缝连接和操作。程序员只需**面向接口编程**，无需关注底层的具体实现。

![[JDBC 标准 | 1000]]

| 主要接口/类              | 作用                |
| ------------------- | ----------------- |
| `DriverManager`     | 管理数据库驱动 & 获取数据库连接 |
| `Driver`            | 定义数据库驱动接口         |
| `Connection`        | 表示与数据库的连接对象       |
| `PreparedStatement` | 预编译 SQL 语句        |
| `ResultSet`         | 处理查询结果集           |

## 环境搭建

执行以下 SQL 语句创建 `jdbc-study` 数据库和 `t_user` 用户表，为后续的 JDBC 操作搭建一个测试环境。

```sql
CREATE DATABASE IF NOT EXISTS `jdbc-study`;
USE `jdbc-study`;

CREATE TABLE IF NOT EXISTS `t_user` (
  `id` BIGINT(32) AUTO_INCREMENT COMMENT '用户ID',
  `username` VARCHAR(32) NOT NULL COMMENT '用户名',
  `age` TINYINT(3) UNSIGNED NOT NULL COMMENT '年龄',
  `gender` TINYINT(1) NOT NULL COMMENT '性别（0-女，1-男）',
  `birthday` DATE NOT NULL COMMENT '生日',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_general_ci
COMMENT='用户表';
```

✅ 将存储引擎设置为 `InnoDB`，支持事务和外键。
✅ 字符集设置为 `utf8mb4`，兼容所有 Unicode 字符（包括 emoji）。
✅ 排序规则设置为 `utf8mb4_general_ci`，忽略大小写，提升查询性能。

插入测试数据：

```sql
INSERT INTO `t_user` (`username`, `age`, `gender`, `birthday`)
VALUES ('张三', 25, 1, '1999-03-15'),
       ('李四', 22, 0, '2002-07-21'),
       ('王五', 30, 1, '1994-05-12'),
       ('赵六', 28, 0, '1996-11-08'),
       ('孙七', 27, 1, '1997-09-03'),
       ('周八', 24, 0, '2000-12-25'),
       ('吴九', 26, 1, '1998-06-18'),
       ('郑十', 23, 0, '2001-04-30'),
       ('陈十一', 29, 1, '1995-08-14'),
       ('杨十二', 31, 0, '1993-02-28');
```

实体类：

```java
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {
  /**
   * 用户ID
   */  private Long id;
  /**
   * 用户名
   */
  private String username;
  /**
   * 年龄
   */
  private Integer age;
  /**
   * 性别（0-女，1-男）
   */
  private Integer gender;
  /**
   * 生日
   */
  private Date birthday;
}
```

## 执行流程

![[JDBC 执行流程 | 250]]

1. **加载驱动（Load Driver）**：通过 `Class.forName()` 或 [[SPI 机制|SPI 机制]] 加载数据库驱动，并注册到 `DriverManager`。
2. **创建连接（Open Connection）**：使用 `DriverManager.getConnection()` 建立与数据库的连接。
3. **创建操作对象（Create Statement）**：通过连接对象创建 `Statement` 或 `PreparedStatement`。
4. **执行 SQL（Execute Statement）**：使用 `Statement` 中的 `executeQuery()` 或 `executeUpdate()` 执行查询或更新语句。
5. **处理结果（Process Results）**：通过 `ResultSet` 读取和处理查询结果。
6. **关闭连接，释放资源（Close Connection）**：通过 `try-with-resources` 自动关闭 `ResultSet`、`Statement` 和 `Connection`，释放资源。

### 加载驱动

#### 传统方式

在 [[SPI 机制]]出现前，程序员需要手动加载数据库驱动：

```java hl:9
public class ApiTest {
  private static final String URL = "jdbc:mysql://localhost:3306/jdbc-study";
  private static final String USERNAME = "root";
  private static final String PASSWORD = "123456";

  @Test
  public void test() throws ClassNotFoundException {
    // 显式加载数据库驱动
    Class.forName("com.mysql.cj.jdbc.Driver");
    // 使用 try-catch-resources 语句块来确保资源被正确关闭
    try (
      // 获取连接
      final Connection connection = DriverManager.getConnection(URL, USERNAME, PASSWORD);
      // 创建 Statement 对象
      final Statement statement = connection.createStatement();
      // 执行查询
      final ResultSet resultSet = statement.executeQuery("select * from t_user")) {
      // 遍历结果集
      while (resultSet.next()) {
        System.out.println(resultSet.getString("username"));
      }
    } catch (SQLException e) {
      throw new RuntimeException(e);
    }
  }
}
```

常见驱动加载方式如下：

```java
// 加载 MySQL8 数据库驱动
Class.forName("com.mysql.cj.jdbc.Driver");

// 加载 Oracle 数据库驱动
Class.forName("oracle.jdbc.driver.OracleDriver");

// 加载 SqlServer 数据库驱动
Class.forName("com.microsoft.sqlserver.jdbc.SQLServerDriver");
```

#### 为什么调用 `Class.forName()` 就能加载驱动？

因为 JDBC 规范规定：**驱动类在加载时必须自动注册到 `DriverManager` 中**。厂商通常在[[代码块#静态初始化块|静态代码块]]中完成注册：

```java hl:5
public class Driver extends NonRegisteringDriver implements java.sql.Driver {
  static {
    try {
      // 注册驱动到 DriverManager
      java.sql.DriverManager.registerDriver(new Driver());
    } catch (SQLException E) {
      throw new RuntimeException("Can't register driver!");
    }
  }
}
```

##### 原理解析

- **类加载阶段**：当驱动类被加载时，静态代码块会自动执行，调用 `DriverManager.registerDriver()` 完成注册。
- `Class.forName()` 用于**触发类的加载和初始化**，间接完成注册流程。

##### 自动加载的演进：SPI 机制

> [!chat-bubble]+ 面对硬编码的驱动类名，作为一名有追求的程序员难免会想：
>
> - 🤔 咦！？能不能通过配置文件指定驱动类呢？这样更换数据库驱动时，就不用修改代码了。例如：`driver-name:com.mysql.cj.jdbc.Driver`。
> - 😩 不过，这样还是不够完美……我还得记住不同数据库厂商提供的 `Driver` 类名！这也太麻烦了吧！头发本来就不多了，换驱动还得查文档，太不友好了。
> - 🧐 能不能和数据库厂商商量一下，让他们直接把配置文件也一并提供？程序员省事，厂商也省事！程序员不用了解驱动类名，厂商还能方便地升级驱动。
> * 😎 听起来是个好主意！不过，如果厂商提供配置文件，程序如何读取它呢？
> - 🏆 还记得 `ClassLoader` 吗？它不仅可以加载类，还能通过 `getResource()` 或 `getResources()` 读取 classpath 下的文件。只要和厂商**事先约定好配置文件的路径和格式**，就能通过它读取配置！
> * 🎉 你 TN 的还真是个天才！！！这套机制，我们就叫它 **SPI** 吧！

这种设计既简化了开发，又提升了代码的可维护性，堪称一举两得！

#### JDBC 的自动加载机制（基于 SPI）

自 Java 6 起，JDBC 开始支持 [[SPI 机制]]。驱动 jar 包中需提供如下配置文件：

```
META-INF/services/java.sql.Driver
```

文件内容为驱动类的全限定类名：

```
com.mysql.cj.jdbc.Driver
```

当首次调用 `DriverManager.getConnection()` 时，JDBC 会执行以下流程：

1. **通过 SPI 加载驱动实现类**：

	```java
	ServiceLoader<Driver> loadedDrivers = ServiceLoader.load(Driver.class);
	```

2. **通过反射触发类加载并注册驱动**：

	```java
	Class.forName(aDriver, true, ClassLoader.getSystemClassLoader());
	```

通过这种机制：

- 无需手动调用 `Class.forName()`；
- 引入驱动依赖即可自动完成加载与注册；
- 更换数据库仅需替换依赖，无需修改任何代码。

### 创建连接

#### URL

URL 用于标识一个建立数据库连接的驱动程序，格式由三部分组成，使用冒号进行分隔：

- **协议**：在 JDBC 连接 URL 中始终为 `jdbc`
- **子协议**：用于标识数据库驱动程序
- **子名称**：用于定位数据库，包含主机名（或 IP 地址）、端口号和数据库名

MySQL 的完整连接 URL 格式如下：

```text
jdbc:mysql://主机名:端口号/数据库名?参数=值&参数=值
```

示例：

```text
jdbc:mysql://localhost:3306/jdbc-study?useUnicode=true&characterEncoding=utf-8&useSSL=false&serverTimezone=Asia/Shanghai
```

- `useUnicode=true&characterEncoding=utf-8`：指定字符编码格式，确保数据在传输和存储过程中正确解码。若 MySQL 使用 GBK 编码，而项目使用 UTF-8 编码时，JDBC 会在数据存取时进行格式转换。
- `useSSL=false`：MySQL 5.7 之后默认启用 SSL 连接。禁用 SSL 可提升连接速度。SSL 主要作用：
  - 认证服务器身份，确保数据传输到正确的服务器
  - 加密数据，防止中途被窃取
  - 维护数据完整性，防止数据在传输过程中丢失或被篡改
- `serverTimezone=Asia/Shanghai`：MySQL 8.0 之后必须指定服务器时区，避免时区不一致导致时间偏移。

#### 用户名密码

建立数据库连接时需要提供用户名和密码。这些信息需妥善保管，避免泄露。

#### 测试

在 `resources` 资源目录下新建 `db.properties` 配置文件，用于保存数据库连接信息：

```properties
jdbc.url=jdbc:mysql://localhost:3306/jdbc-study?useUnicode=true&characterEncoding=utf-8&useSSL=false&serverTimezone=Asia/Shanghai
jdbc.username=root
jdbc.password=123456
```

编写 `JdbcTests` 测试类：

```java hl:13,24
public class JdbcTests {
  private static final Logger LOGGER = LoggerFactory.getLogger(JdbcTests.class);
  private Connection connection = null;

  @BeforeEach
  public void before() {
    try (InputStream ins = JdbcTests.class.getClassLoader().getResourceAsStream("db.properties")) {
      final Properties properties = new Properties();
      properties.load(ins);
      final String url = properties.getProperty("jdbc.url");
      final String username = properties.getProperty("jdbc.username");
      final String password = properties.getProperty("jdbc.password");
      connection = DriverManager.getConnection(url, username, password);
      LOGGER.info("【建立数据库连接】: {}", connection);
    } catch (IOException | SQLException e) {
      throw new RuntimeException("数据库连接失败", e);
    }
  }

  @AfterEach
  public void after() {
    if (connection != null) {
      try {
        connection.close();
        LOGGER.info("【关闭数据库连接】: {}", connection);
      } catch (SQLException e) {
        throw new RuntimeException("关闭数据库连接失败", e);
      }
    }
  }

  @Test
  public void testConnection() {
    assertNotNull(connection);
    LOGGER.info("【测试数据库连接成功】");
  }
}
```

成功建立数据库连接，并在操作完成后关闭连接。
![](https://img.xiaorang.fun/202503211715614.png)

> [!important]
> `Connection` 连接的使用原则是：**尽量晚创建，尽量早释放**。

### 创建操作对象

#### Statement 接口

##### 添加数据

```java hl:3-5
@Test
public void testAdd() {
  final String sql = "INSERT INTO `t_user`(`username`, `age`, `gender`, `birthday`) VALUES('小让', 30, 1, '1995-07-13')";
  try (Statement statement = connection.createStatement()) {
    int count = statement.executeUpdate(sql);
    LOGGER.info("【插入数据行数】: {}", count);
    assertEquals(1, count);
  } catch (SQLException e) {
    throw new RuntimeException("插入数据失败", e);
  }
}
```

测试结果如下所示：
![](https://img.xiaorang.fun/202503211715616.png)

在 MySQL 客户端中执行 `SELECT * FROM t_user;` 可查看新增数据：
![](https://img.xiaorang.fun/202503211715617.png)

##### 删除数据

```java
@Test
public void testDelete() {
  final String sql = "DELETE FROM `t_user` WHERE `id` = 11";
  try (Statement statement = connection.createStatement()) {
    int count = statement.executeUpdate(sql);
    LOGGER.info("【删除数据行数】: {}", count);
    assertEquals(1, count);
  } catch (SQLException e) {
    throw new RuntimeException("删除数据失败", e);
  }
}
```

测试结果如下所示：
![](https://img.xiaorang.fun/202503211715618.png)

在 MySQL 客户端中再次执行 `SELECT * FROM t_user;`，发现刚插入的数据已被成功删除。
![](https://img.xiaorang.fun/202503211715619.png)

##### 查询数据

```java
@Test
public void testQuery() {
  final String sql = "SELECT * FROM `t_user`";
  try (Statement statement = connection.createStatement();
       ResultSet rs = statement.executeQuery(sql)) {
    final List<User> users = new ArrayList<>();
    while (rs.next()) {
      users.add(new User(rs.getLong("id"), rs.getString("username"), rs.getInt("age"), rs.getInt("gender"), rs.getDate("birthday")));
    }
    users.forEach(System.out::println);
  } catch (SQLException e) {
    throw new RuntimeException("查询数据失败", e);
  }
}
```

测试结果如下所示：
![](https://img.xiaorang.fun/202503211715620.png)

##### SQL 注入 💣

由于 `Statement` 使用字符串拼接构建 SQL 语句，极易导致 **SQL 注入** 问题。

> [!answer]
> SQL 注入是指在用户输入中注入非法的 SQL 语句，系统在未充分校验的情况下直接执行，从而被恶意利用。

举个栗子：查询名为 '小白' 的用户。正常情况下，用户表中不存在名为 '小白' 的用户。

```java hl:3-4
@Test
public void testSQLInjection() {
  final String username = "'小白'";
  final String sql = "SELECT * FROM `t_user` WHERE `username` = " + username;
  try (Statement statement = connection.createStatement();
       ResultSet rs = statement.executeQuery(sql)) {
    final List<User> users = new ArrayList<>();
    while (rs.next()) {
      users.add(new User(rs.getLong("id"), rs.getString("username"), rs.getInt("age"), rs.getInt("gender"), rs.getDate("birthday")));
    }
    users.forEach(System.out::println);
  } catch (SQLException e) {
    throw new RuntimeException("查询数据失败", e);
  }
}
```

测试结果：确实未查询到名为 '小白' 的用户。
![](https://img.xiaorang.fun/202503211715621.png)

举个栗子：使用 SQL 注入查询全部数据。将查询条件修改为 `'小白' OR 1 = 1`，即使用户不存在，也会返回所有数据。

```java hl:3
@Test
public void testSQLInjection() {
  final String username = "'小白' OR 1 = 1";
  final String sql = "SELECT * FROM `t_user` WHERE `username` = " + username;
  try (Statement statement = connection.createStatement();
       ResultSet rs = statement.executeQuery(sql)) {
    final List<User> users = new ArrayList<>();
    while (rs.next()) {
      users.add(new User(rs.getLong("id"), rs.getString("username"), rs.getInt("age"), rs.getInt("gender"), rs.getDate("birthday")));
    }
    users.forEach(System.out::println);
  } catch (SQLException e) {
    throw new RuntimeException("查询数据失败", e);
  }
}
```

测试结果如下所示：返回了所有的用户数据。
![](https://img.xiaorang.fun/202503211715622.png)

⚠️**问题分析**

- `Statement` 直接拼接 SQL 语句，未对用户输入进行校验。
- `OR 1 = 1` 恒成立，导致返回所有数据。

🤔 可以想象一下如果登录系统也存在 SQL 注入漏洞，那么攻击者可以绕过身份验证，直接访问系统，这将带来多么严重的安全风险。那么如何防止 SQL 注入呢？
🤓 答案就是 **使用 `PreparedStatement` 代替 `Statement`**，它可以有效防止恶意 SQL 代码的注入，提高系统的安全性。

- 使用 `PreparedStatement` **预编译** SQL 语句，避免拼接 SQL。
- `PreparedStatement` 通过**占位符**替代用户输入，防止 SQL 注入。

#### PreparedStatement 接口

##### MySQL 预编译机制

在向 MySQL 服务器发送 SQL 语句时，MySQL 每次都会对语句进行**解析**、**校验**和**执行计划生成**等操作，如下图所示：
![](https://img.xiaorang.fun/202503211732793.png)

在实际业务中，很多 SQL 语句结构是固定的，仅参数不同。

- 如果每次都重新解析和校验，性能会受到影响。
- **预编译**允许 MySQL 将 SQL 语句模板化，参数以占位符 `?` 形式存在，执行时只需注入参数，避免重复解析和校验。

🤔 如何使用预编译呢？
🤓 具体实现步骤如下所示：

1. 定义预编译 SQL 语句；

	```sql
	PREPARE statement FROM 'SELECT * FROM `t_user` WHERE `id` = ? AND `username` = ?';
	```

2. 设置参数值；

	```sql
	SET @id = 1, @username = '张三';
	```

3. 执行预编译 SQL 语句；

	```sql
	EXECUTE statement USING @id, @username;
	```

✅**性能提升**：解析与校验只在预编译阶段完成
✅**安全性增强**：参数作为独立变量注入，防止 SQL 注入

运行结果如下所示：
![](https://img.xiaorang.fun/202503211715623.png)

##### PreparedStatement✨

在 Java 中，可以通过 `Connection` 连接对象的 `prepareStatement (sql)` 方法获取 `PreparedStatement` 实例对象。其中，`PreparedStatement` 接口继承自 `Statement` 接口，方法中的参数 `sql` 表示一条预编译 SQL 语句，SQL 语句中的参数值用占位符 `?` 来表示，之后可以使用 `setXxx ()` 或者 `setObject ()` 方法来设置这些参数。

> [!note]
> **占位符索引从 1 开始**。

###### 添加数据

```java hl:3-9
@Test
public void testPreparedStatementAdd() {
  final String sql = "INSERT INTO `t_user`(`username`, `age`, `gender`, `birthday`) VALUES(?, ?, ?, ?)";
  try (PreparedStatement preparedStatement = connection.prepareStatement(sql)) {
    preparedStatement.setString(1, "小让");
    preparedStatement.setInt(2, 30);
    preparedStatement.setInt(3, 1);
    preparedStatement.setDate(4, new Date(System.currentTimeMillis()));
    int count = preparedStatement.executeUpdate();
    LOGGER.info("【插入数据行数】: {} 行", count);
    assertEquals(1, count);
  } catch (SQLException e) {
    throw new RuntimeException("插入数据失败", e);
  }
}
```

测试结果如下所示：
![](https://img.xiaorang.fun/202503211715624.png)

在 MySQL 客户端中执行 `SELECT * FROM t_user;` 可查看新增数据：
![](https://img.xiaorang.fun/202503211715625.png)

###### 删除数据

```java
@Test
public void testPreparedStatementDelete() {
  final String sql = "DELETE FROM `t_user` WHERE `id` = ?";
  try (PreparedStatement preparedStatement = connection.prepareStatement(sql)) {
    preparedStatement.setInt(1, 12);
    int count = preparedStatement.executeUpdate();
    LOGGER.info("【删除数据行数】: {} 行", count);
    assertEquals(1, count);
  } catch (SQLException e) {
    throw new RuntimeException("删除数据失败", e);
  }
}
```

测试结果如下所示：
![](https://img.xiaorang.fun/202503211715626.png)

在 MySQL 客户端中再次执行 `SELECT * FROM t_user;`，发现刚插入的数据已被成功删除。
![](https://img.xiaorang.fun/202503211715627.png)

###### 查询数据

```java
@Test
public void testPreparedStatementQuery() {
  final String sql = "SELECT * FROM `t_user` WHERE `gender` = ?";
  try (PreparedStatement preparedStatement = connection.prepareStatement(sql)) {
    preparedStatement.setInt(1, 0);
    try (ResultSet rs = preparedStatement.executeQuery()) {
      final List<User> users = new ArrayList<>();
      while (rs.next()) {
        users.add(new User(rs.getLong("id"), rs.getString("username"), rs.getInt("age"), rs.getInt("gender"), rs.getDate("birthday")));
      }
      LOGGER.info("【查询结果】：{} 条记录", users.size());
      users.forEach(System.out::println);
    }
  } catch (SQLException e) {
    throw new RuntimeException("查询数据失败", e);
  }
}
```

测试结果如下所示：
![](https://img.xiaorang.fun/202503211715628.png)

##### 问题 💣

默认情况下，`PreparedStatement` **不会执行预编译**，需要在数据库连接 URL 中添加额外参数：

- `useServerPrepStmts=true` – 启用服务端预编译（MySQL 4.1 之前的版本不支持）。
- `cachePrepStmts=true` – 启用预编译语句缓存，避免重复编译。

举个栗子：

```text
jdbc:mysql://localhost:3306/jdbc-study?useUnicode=true&characterEncoding=utf-8&useSSL=false&serverTimezone=Asia/Shanghai&useServerPrepStmts=true
```

在 URL 添加这些参数后，MySQL 将在接收 SQL 语句时进行预编译，之后执行时仅需传递参数，减少解析和校验的开销。执行流程如下所示：
![[JDBC 预编译执行流程 | 1000]]

为了查看效果，可以开启 MySQL 通用查询日志：

```sql
# 查看 general_log 状态
SHOW VARIABLES LIKE 'general_log%';

# 开启 general_log
SET GLOBAL general_log = 1;

# 查看日志时区
SHOW VARIABLES LIKE 'log_timestamps';

# 修改日志时区为系统默认值（永久修改需在 my.ini 中配置）
SET GLOBAL log_timestamps = SYSTEM;

# 查看 MySQL 数据目录
SHOW GLOBAL VARIABLES LIKE '%datadir%';
```

执行 `testPreparedStatementQuery ()` 测试方法后，查看日志文件（位于 MySQL 数据目录下），发现执行的 SQL 语句依然是普通 SQL：
![](https://img.xiaorang.fun/202503211715629.png)

🔍 **验证**：在 URL 上添加 `useServerPrepStmts=true&cachePrepStmts=true` 参数，再次执行，发现 SQL 语句已被成功预编译：
![](https://img.xiaorang.fun/202503211715630.png)

##### 防止 SQL 注入

`PreparedStatement` 能有效防止 SQL 注入，因为 MySQL 会对使用占位符 `?` 的 SQL 语句进行预编译，执行计划中的条件已固定，无法再通过注入的方式添加其他条件。

举个栗子：使用 `PreparedStatement` 测试 SQL 注入，尝试查询名为 `'小白'` 的用户：

```java
@Test
public void testPreparedStatementSQLInjection() {
  final String sql = "SELECT * FROM `t_user` WHERE `username` = ?";
  try (PreparedStatement preparedStatement = connection.prepareStatement(sql)) {
    preparedStatement.setString(1, "'小白' OR 1 = 1");
    try (ResultSet rs = preparedStatement.executeQuery()) {
      final List<User> users = new ArrayList<>();
      while (rs.next()) {
        users.add(new User(rs.getLong("id"), rs.getString("username"), rs.getInt("age"), rs.getInt("gender"), rs.getDate("birthday")));
      }
      assertEquals(0, users.size());
      users.forEach(System.out::println);
    }
  } catch (SQLException e) {
    throw new RuntimeException("查询数据失败", e);
  }
}
```

测试结果如下所示：尝试 SQL 注入失败，查询不到数据。
![](https://img.xiaorang.fun/202503211715631.png)

查看日志可以发现，`PreparedStatement` 会将参数作为一个整体处理，不会将其解析为 SQL 语句的一部分，从而避免了 SQL 注入。
![](https://img.xiaorang.fun/202503211715632.png)

## 批处理

批处理通过将多条 SQL 语句合并为一个批次并一次性提交给数据库，能有效减少数据库交互次数，提升执行性能。

### 批处理支持检测

部分 JDBC 驱动可能不支持批处理，可使用 `DatabaseMetaData.supportsBatchUpdates ()` 方法进行检测。

```java
@Test
public void testSupportsBatchUpdates() throws SQLException {
  DatabaseMetaData databaseMetaData = CONNECTION.getMetaData();
  boolean supportsBatchUpdates = databaseMetaData.supportsBatchUpdates();
  System.out.println("是否支持批处理？" + supportsBatchUpdates);
}
```

测试结果表明 MySQL 支持批处理：
![](https://img.xiaorang.fun/202503211715633.png)

### 核心方法

| 方法               | 作用             |
| ---------------- | -------------- |
| `addBatch ()`     | 添加 SQL 语句到批处理中 |
| `executeBatch ()` | 执行批处理          |
| `clearBatch ()`   | 清空批处理，无法删除特定语句 |

### 使用 PreparedStatement 进行批处理

批处理执行流程：
1. 创建 SQL 语句，使用占位符
2. 创建 `PreparedStatement`
3. 关闭自动提交 (`setAutoCommit (false)`)
4. 🔄设置 SQL 语句，占位符替换参数
5. 🔄添加 SQL 语句到批处理中，调用 `addBatch ()`
6. 执行批处理，调用 `executeBatch ()`
7. 成功提交 `commit ()`，失败回滚 `rollback ()`

```java hl:12,15,17,21
@Test
public void testPrepareStatementBatchUpdate() {
  final String sql = "INSERT INTO `t_user`(`username`, `age`, `gender`, `birthday`) VALUES(?, ?, ?, ?)";
  try (PreparedStatement preparedStatement = connection.prepareStatement(sql)) {
    // 关闭自动提交，开启事务
    connection.setAutoCommit(false);
    for (int i = 0; i < 5; i++) {
      preparedStatement.setString(1, "小让" + i);
      preparedStatement.setInt(2, 30);
      preparedStatement.setInt(3, 1);
      preparedStatement.setDate(4, new Date(System.currentTimeMillis()));
      preparedStatement.addBatch();
    }
    // 执行批处理
    preparedStatement.executeBatch();
    // 提交事务
    connection.commit();
  } catch (SQLException e) {
    try {
      // 出现异常时回滚
      connection.rollback();
    } catch (SQLException ex) {
      throw new RuntimeException("事务回滚失败", ex);
    }
    throw new RuntimeException("批处理插入失败", e);
  }
}
```

点击测试，插入速度确实很快，但是否真的启用了批处理呢？查看 MySQL 日志后，发现 SQL 语句仍是逐条执行的，批处理功能并未生效。
![](https://img.xiaorang.fun/202503211715634.png)

🤔 那么该如何真正的启用批处理功能呢？
🤓 在数据库连接 URL 中添加 `rewriteBatchedStatements=true` 参数，启用批量优化。

```text
jdbc:mysql://localhost:3306/jdbc-study?useUnicode=true&characterEncoding=utf-8&useSSL=false&serverTimezone=Asia/Shanghai&useServerPrepStmts=true&rewriteBatchedStatements=true
```

> [!note]
>
> - 适用于 **`INSERT`、`UPDATE`、`DELETE`** 语句
> - 需 **MySQL JDBC Driver ≥ 5.1.13**
> - **必须关闭自动提交**

🔍 **验证**：查看 MySQL 日志，确认 SQL 语句批量执行：
![](https://img.xiaorang.fun/202503211715635.png)

### 分批提交（优化）

> [!warning]- 大批量执行可能触发异常
>
> ```text
> com.mysql.cj.jdbc.exceptions.PacketTooBigException: Packet for query is too large (99,899,527 > 67,108,864). You can change this value on the server by setting the 'max_allowed_packet' variable.
> ```
>
> `max_allowed_packet` 表示 MySQL 单个数据包的最大大小（单位：字节）。
>
> - **默认值**：67108864（64M）
> - **范围**：1K - 1G（需为 1024 倍数）
>
> 调整 `max_allowed_packet`：
>
> ```sql
> SHOW VARIABLES LIKE 'max_allowed_packet';  -- 查看当前值
> SET GLOBAL max_allowed_packet = 32 * 1024 * 1024;  -- 设置 32M（需重启服务）
>```

批量执行时，单个批次可能超过 `max_allowed_packet` 限制，导致执行失败。💡 为避免这个问题，采用 **分批提交**（如 **500 条/批**）。

```java
@Test
public void testPrepareStatementBatchUpdate2() {
  final long start = System.currentTimeMillis();
  final String sql = "INSERT INTO `t_user`(`username`, `age`, `gender`, `birthday`) VALUES(?, ?, ?, ?)";
  try (PreparedStatement preparedStatement = connection.prepareStatement(sql)) {
    // 关闭自动提交，开启事务
    connection.setAutoCommit(false);
    for (int i = 0; i < 1000000; i++) {
      preparedStatement.setString(1, "小让" + i);
      preparedStatement.setInt(2, 30);
      preparedStatement.setInt(3, 1);
      preparedStatement.setDate(4, new Date(System.currentTimeMillis()));
      preparedStatement.addBatch();
      // 每 500 条提交一次，防止数据包超限
      if (i % 500 == 0) {
        preparedStatement.executeBatch();
        preparedStatement.clearBatch();
      }
    }
    // 提交剩余的批次
    preparedStatement.executeBatch();
    preparedStatement.clearBatch();
    // 提交事务
    connection.commit();
    LOGGER.info("百万条数据插入用时：{} 毫秒", (System.currentTimeMillis() - start));
  } catch (SQLException e) {
    try {
      // 出现异常时回滚
      connection.rollback();
    } catch (SQLException ex) {
      throw new RuntimeException("事务回滚失败", ex);
    }
    throw new RuntimeException("批处理插入失败", e);
  }
}
```

测试结果如下所示：
![](https://img.xiaorang.fun/202503211715637.png)

日志如下所示：
![](https://img.xiaorang.fun/202503211715638.png)

## 事务

### MySQL 对事务的支持

对于 MySQL 中事务的四种隔离级别不清楚的小伙伴的可以查看 [MySQL 四种隔离级别](https://www.yuque.com/xihuanxiaorang/java/uebi2x7whkk44kg1?view=doc_embed) 这篇文章。

### JDBC 事务处理

在 JDBC 中的事务是使用 `Connection` 连接对象中的 `commit ()` 方法和 `rollback ()` 方法来进行管理的。在 JDBC 中事务的默认提交时机，存在如下两种情况：

- 当一个连接对象被创建时，**默认情况下是自动提交事务**，即每次执行一条 SQL 语句时，如果执行成功，就会向数据库自动提交，提交后就不能再进行回滚；
- 关闭数据库连接，数据就会自动提交。如果多个操作，每个操作使用的是自己单独的连接 (Connection)，则无法保证事务。**同一个事务的多个操作必须在同一个连接下**。

在 JDBC 中使用事务的基本步骤如下：

1. 调用 `Connection` 连接对象的 `setAutoCommit (false)` 方法以取消自动提交事务；
2. 在所有的 SQL 语句都成功执行后，调用 `commit ()` 方法提交事务；
3. 在出现异常时，调用 `rollback ()` 方法回滚事务；
4. 如果 `Connection` 连接对象没有被关闭的话，可以被重复使用，则需要恢复其自动提交状态 `setAutoCommit (true)`；

### 测试

> 为了方便观察运行效果，下面的操作每次执行前都将删除已有的 user 表，并重新创建 user 表，这样自动编号将从 1 开始。然后插入三条初始数据。

```sql
INSERT INTO `user` (`name`, `age`, `birthday`, `salary`, `note`) VALUES ('小让', 18, '1995-07-13', 16000.0, '程序员');  
INSERT INTO `user` (`name`, `age`, `birthday`, `salary`, `note`) VALUES ('小星', 18, '1995-03-20', 20000.0, '幼教');  
INSERT INTO `user` (`name`, `age`, `birthday`, `salary`, `note`) VALUES ('三十', 25, '1995-08-08', 22000.0, '硬件工程师');
```

可以看到用户 1 的薪资为 16000，用户 2 的薪资为 20000，现在咱们就模拟一个场景，让用户 1 的薪资减 1000，然后让用户 2 的薪资加 1000，两个过程作为一个整体，总的薪资应该不变，其实就是模拟的转账过程。

#### 没有事务的情况

 ```java
 @Test  
 public void testTransferNonTransaction () {  
     String sql1 = "UPDATE `user` SET `salary` = `salary` - ? WHERE `uid` = ?;";  
     String sql2 = "UPDATE `user` SET `salary` = `salary` + ? WHERE `uid` = ?;";  
     try (PreparedStatement preparedStatement = CONNECTION.prepareStatement (sql1);  
          PreparedStatement preparedStatement2 = CONNECTION.prepareStatement (sql2)) {  
         preparedStatement.setFloat (1, 1000.0f);  
         preparedStatement.setInt (2, 1);  
         preparedStatement.executeUpdate ();  
         int i = 1 / 0;  
         preparedStatement2.setFloat (1, 1000.0f);  
         preparedStatement2.setInt (2, 2);  
         preparedStatement.executeUpdate ();  
     } catch (SQLException e) {  
         throw new RuntimeException (e);  
     }  
 }
 ```

测试结果如下所示：出现异常。 ![](https://fastly.jsdelivr.net/gh/xihuanxiaorang/img/202309202142759.png)

然后查看数据库用户表中的数据：
![](https://fastly.jsdelivr.net/gh/xihuanxiaorang/img/202309202143410.png)

发现在没有事务并且出现异常的情况下，用户 1 已经扣了 1000，但是用户 2 并没有加 1000，此时就暴露出没有事务的危险性！

#### 存在事务的情况

```java
@Test  
 public void testTransferWithTransaction () throws SQLException {  
     connection.setAutoCommit (false);  
     try {  
         String sql1 = "UPDATE `user` SET `salary` = `salary` - ? WHERE `uid` = ?;";  
         PreparedStatement preparedStatement1 = connection.prepareStatement (sql1);  
         preparedStatement1.setFloat (1, 1000.0f);  
         preparedStatement1.setInt (2, 1);  
         preparedStatement1.executeUpdate ();  
         int i = 1 / 0;  
         String sql2 = "UPDATE `user` SET `salary` = `salary` + ? WHERE `uid` = ?;";  
         PreparedStatement preparedStatement2 = connection.prepareStatement (sql2);  
         preparedStatement2.setFloat (1, 1000.0f);  
         preparedStatement2.setInt (2, 2);  
         preparedStatement2.executeUpdate ();  
         connection.commit ();  
     } catch (Exception e) {  
         e.printStackTrace ();  
         connection.rollback ();  
     }  
 }
```

测试结果如下所示：出现异常。 ![](https://fastly.jsdelivr.net/gh/xihuanxiaorang/img/202309202143003.png)

然后查看数据库用户表中的数据：
![](https://fastly.jsdelivr.net/gh/xihuanxiaorang/img/202309202143026.png)

发现在增加事务之后，即使在出现异常的情况下，也不会发生用户 1 已经扣 1000，而用户 2 没有加钱的尴尬情况。

## 数据库连接池

### 为什么需要数据库连接池？

传统的 jdbc 开发形式存在的问题:

- 普通的 JDBC 数据库连接使用【DriverManager】来获取，每次向数据库建立连接的时候都要将 【Connection】加载到内存中，再验证用户名和密码（保守估计需要花费 0.05s～1s 的时间）；
- 需要【数据库连接】的时候，就向数据库申请一个，执行完成后再【断开连接】。这样的方式将会消耗大量的资源和时间。数据库的连接资源并没有得到很好的重复利用。若同时有几百人甚至几千人在线，频繁的进行数据库连接操作将占用很多的系统资源，严重的甚至会造成服务器的崩溃；
- 对于每一次数据库连接，使用完后都得断开。否则，如果程序出现异常而未能关闭，将会导致数据库系统中的内存泄漏，最终将导致重启数据库；（回忆：何为 Java 的内存泄漏？）
- 这种开发方式不能控制【被创建的连接对象数】，系统资源会被毫无顾及的分配出去，如连接过多，也可能导致内存泄漏，服务器崩溃；

为解决传统开发中的数据库连接问题，可以采用数据库连接池技术。

- 数据库连接池的基本思想：就是为数据库连接建立一个"缓冲池"。预先在缓冲池中放入一定数量的连接，当需要建立数据库连接时，只需从"缓冲池"中取出一个，使用完毕之后再放回去；
- 数据库连接池负责分配、管理和释放数据库连接，它允许应用程序【重复使用一个现有的数据库连接】，而不是重新建立一个；
- 数据库连接池在初始化时将【创建一定数量】的数据库连接放到连接池中。无论这些连接是否被使用，连接池都将一直保证至少拥有一定量的连接数量。连接池的【最大数据库连接数】限定了这个连接池能占有的最大连接数，当应用程序向连接池请求的连接数超过最大连接数量时，这些请求将被加入到等待队列中；

### 优点

1. 资源重用：由于数据库连接得以重用，避免了频繁创建，释放连接引起的大量性能开销。在减少系统消耗的基础上，另一方面也增加了系统运行环境的平稳性。
2. 更快的系统反应速度：数据库连接池在初始化过程中，往往已经创建了若干数据库连接置于连接池中备用。此时连接的初始化工作均已完成。对于业务请求处理而言，直接利用现有可用连接，避免了数据库连接初始化和释放过程的时间开销，从而减少了系统的响应时间。
3. 新的资源分配手段：对于多应用共享同一数据库的系统而言，可在应用层通过数据库连接池的配置，实现某一应用最大可用数据库连接数的限制，避免某一应用独占所有的数据库资源。
4. 统一的连接管理，避免数据库连接泄漏：在较为完善的数据库连接池实现中，可根据预先的占用超时设定，强制回收被占用连接，从而避免了常规数据库连接操作中可能出现的资源泄漏。

### 常见的开源数据库连接池

【DataSource】通常被称为【数据源】，它包含【连接池】和【连接池管理组件】两个部分，习惯上也经常把 DataSource 称为连接池。【DataSource】用来取代 DriverManager 来获取 Connection，获取速度快，同时可以大幅度提高数据库访问速度。DataSource 同样是 jdbc 的规范，针对不通的连接池技术，我们可以有不同的实现。

特别注意：

- 数据源和数据库连接不同，数据源无需创建多个，它是产生数据库连接的工厂，通常情况下，一个应用只需要一个数据源，当然也会有多数据源的情况。
- 当数据库访问结束后，程序还是像以前一样关闭数据库连接：`conn.close ()`；但 `conn.close ()` 并没有关闭数据库的物理连接，它仅仅把数据库连接释放，归还给了数据库连接池。

#### Druid（德鲁伊）

Druid 是阿里巴巴开源平台上一个数据库连接池实现，它结合了 C3P0、DBCP、Proxool 等 DB 池的优点，同时加入了【日志监控】，可以很好的监控 DB 池连接和 SQL 的执行情况，可以说是针对监控而生的 DB 连接池，**可以说是目前最好的连接池之一。**

##### 引入依赖

```xml
 <dependency>
     <groupId>com.alibaba</groupId>
     <artifactId>druid</artifactId>
     <version>1.2.8</version>
 </dependency>
```

##### 编写配置文件

```properties
druid.url=jdbc:mysql://localhost: 3306/atguigudb? useUnicode=true&characterEncoding=utf-8&useSSL=false&serverTimezone=Asia/Shanghai&useServerPrepStmts=true&cachePrepStmts=true&allowPublicKeyRetrieval=true&rewriteBatchedStatements=true
 druid.username=root
 druid.password=123456
 druid.initialSize=10
 druid.minIdle=20
 druid.maxActive=50
 druid.maxWait=500
```

##### 测试用例

 ```java
 public class DruidDataSourceTest {
     private static final Logger LOGGER = LoggerFactory.getLogger (DruidDataSourceTest.class);
 ​
     private static DataSource dataSource = null;
 ​
     @BeforeAll
     public static void before () {
         try {
             Properties properties = new Properties ();
             properties.load (DruidDataSourceTest.class.getResourceAsStream ("/druid.properties"));
             dataSource = DruidDataSourceFactory.createDataSource (properties);
         } catch (Exception e) {
             throw new RuntimeException (e);
         }
     }
 ​
     @Test
     public void testAdd () {
         try (Connection connection = dataSource.getConnection ()) {
             Statement statement = connection.createStatement ();
             String sql = "INSERT INTO `user` (`name`, `age`, `birthday`, `salary`, `note`) VALUES ('小让', 18, '1995-07-13', 16000.0, '程序员');";
             int count = statement.executeUpdate (sql);
             LOGGER.info ("【数据更新行数】：{}", count);
         } catch (SQLException e) {
             throw new RuntimeException (e);
         }
     }
 }
 ```

点击测试按钮，测试结果如下所示：
![](https://fastly.jsdelivr.net/gh/xihuanxiaorang/img/202309202147334.png)

查询数据库，检验是否真的执行成功：
![](https://fastly.jsdelivr.net/gh/xihuanxiaorang/img/202309202147611.png)

可以发现，数据库 `user` 表中确实增加了一条数据！

#### HiKariCP

`HiKariCP` 是数据库连接池的一个后起之秀，日语中"光"的意思，号称历史上最快的数据库连接池，可以完美地 PK 掉其他连接池，是一个高性能的 `JDBC` 连接池，在后边学习的 **springboot 中默认集成了该连接池**，他是由日本人 [Brett Wooldridge](https://github.com/brettwooldridge) 开发。

##### 引入依赖

 ```xml
 <dependency>
     <groupId>com.zaxxer</groupId>
     <artifactId>HikariCP</artifactId>
     <version>5.0.1</version>
 </dependency>
 ```

##### 编写配置文件

```properties
jdbcUrl=jdbc:mysql://localhost: 3306/atguigudb? useUnicode=true&characterEncoding=utf-8&useSSL=false&serverTimezone=Asia/Shanghai&useServerPrepStmts=true&cachePrepStmts=true&allowPublicKeyRetrieval=true&rewriteBatchedStatements=true
username=root
password=123456
dataSource.connectionTimeout=1000
dataSource.idleTimeout=60000
dataSource.maximumPoolSize=10
```

##### 测试用例

 ```java
 public class HikariDataSourceTest {
     private static final Logger LOGGER = LoggerFactory.getLogger (HikariDataSourceTest.class);
 ​
     private static DataSource dataSource = null;
 ​
     @BeforeAll
     public static void before () {
         HikariConfig config = new HikariConfig ("/hikari.properties");
         dataSource = new HikariDataSource (config);
     }
 ​
     @Test
     public void testAdd () {
         try (Connection connection = dataSource.getConnection ()) {
             Statement statement = connection.createStatement ();
             String sql = "INSERT INTO `user`(`name`, `age`, `birthday`, `salary`, `note`) VALUES ('小让', 18, '1995-07-13', 16000.0, '程序员');";
             int count = statement.executeUpdate (sql);
             LOGGER.info ("【数据更新行数】：{}", count);
         } catch (SQLException e) {
             throw new RuntimeException (e);
         }
     }
 }

 ```
点击测试按钮，测试结果如下所示： ![](https://fastly.jsdelivr.net/gh/xihuanxiaorang/img/202309202147282.png)

查询数据库，检验是否真的执行成功： ![](https://fastly.jsdelivr.net/gh/xihuanxiaorang/img/202309202148155.png)

可以发现，数据库 `user` 表中确实增加了一条数据！
