---
tags:
  - Java
create_time: 2025-03-09T23:40:00
update_time: 2025/03/21 17:14
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

1. **加载驱动（Load Driver）**：通过 `Class.forName()` 或 [[04 - SPI 机制|SPI 机制]] 加载数据库驱动程序，并注册到 `DriverManager`。
2. **创建连接（Open Connection）**：使用 `DriverManager.getConnection()` 建立与数据库的连接。
3. **创建操作对象（Create Statement）**：通过连接对象创建 `Statement` 或 `PreparedStatement`。
4. **执行 SQL（Execute Statement）**：使用 `Statement` 中的 `executeQuery()` 或 `executeUpdate()` 执行查询或更新语句。
5. **处理结果（Process Results）**：通过 `ResultSet` 读取和处理查询结果。
6. **关闭连接，释放资源（Close Connection）**：通过 `try-with-resources` 自动关闭 `ResultSet`、`Statement` 和 `Connection`，释放资源。

### 加载驱动

在 SPI 机制出现之前，加载数据库驱动的典型示例如下：

```java hl:9
public class ApiTest {  
  private static final String URL = "jdbc:mysql://localhost:3306/jdbc-study";  
  private static final String USERNAME = "root";  
  private static final String PASSWORD = "123456";  

  @Test  
  public void test() throws ClassNotFoundException {  
    // 加载驱动（使用 Class.forName() 方法）  
    Class.forName("com.mysql.cj.jdbc.Driver");  
    // 使用 try-catch-resources 语句块来确保资源被正确关闭  
    try (  
      // 创建连接  
      final Connection connection = DriverManager.getConnection(URL, USERNAME, PASSWORD);  
      // 创建 Statement 对象  
      final Statement statement = connection.createStatement();  
      // 执行 SQL 查询  
      final ResultSet resultSet = statement.executeQuery("select * from t_user")) {  
      // 处理查询结果  
      while (resultSet.next()) {  
        System.out.println(resultSet.getString("username"));  
      }  
    } catch (SQLException e) {  
      throw new RuntimeException(e);  
    }  
  }  
}
```

在 SPI 机制出现之前，程序员通常需要通过 `Class.forName()` 手动加载数据库驱动，例如：

```java
// 加载 MySQL8 数据库驱动
Class.forName("com.mysql.cj.jdbc.Driver");

// 加载 Oracle 数据库驱动
Class.forName("oracle.jdbc.driver.OracleDriver");

// 加载 SqlServer 数据库驱动
Class.forName("com.microsoft.sqlserver.jdbc.SQLServerDriver");
```

🤔为什么使用 `Class.forName` 就能加载数据库驱动呢？
🤓这是因为 JDBC 规范要求每个数据库驱动在类加载时自动注册到 `DriverManager`，通常通过[[01  - 代码块#静态初始化块|静态代码块]]实现。例如，MySQL 的 `Driver` 源码如下：

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

🔎**原理**：
1. **类加载阶段**：驱动类加载时，静态代码块会调用 `DriverManager.registerDriver()` 方法，自动完成驱动注册。
2. **`Class.forName()` 触发注册**：调用 `Class.forName()` 方法时，JVM 会执行静态代码块，从而完成驱动的注册与加载。

> [!chat-bubble]+ 看着这些硬编码的类名，作为一名有追求的程序员，脑海中自然会冒出这样的念头：
>
> - 🤔 咦！？这些类名是不是可以写到配置文件中呢？这样更换数据库驱动时，就不用修改代码了。比如：`driver-name: com.mysql.cj.jdbc.Driver`。
> - 😩 不过，这样还是不够完美……我还得记住不同数据库厂商提供的 `Driver` 类名！这也太麻烦了吧！头发本来就不多了，换驱动还得查文档，太不友好了。
> - 🧐 能不能和数据库厂商商量一下，让他们直接把配置文件也一并提供？程序员省事，厂商也省事！程序员不用了解驱动类名，厂商还能方便地升级驱动。
> + 😎 听起来是个好主意！不过，如果厂商提供配置文件，程序如何读取它呢？
> - 🏆 还记得 `ClassLoader` 吗？它不仅可以加载类，还能通过 `getResource()` 或 `getResources()` 读取 classpath 下的文件。👉 只要和厂商**事先约定好配置文件的路径和格式**，就能通过它读取配置！
> + 🎉 你 TN 的还真是个天才！！！这套机制，我们就叫它 **SPI** 吧！

这种设计既简化了开发，又提升了代码的可维护性，堪称一举两得！

JDBC 通过 SPI（Service Provider Interface） 机制自动完成驱动加载和注册。通过这种机制：

✅ 程序员无需手动调用 `Class.forName()` 加载驱动
✅ 引入驱动 jar 包后，JDBC 会自动完成驱动加载
✅ 更换数据库时，仅需替换 jar 包，无需修改代码

🤔那么 JDBC 是如何实现自动加载驱动的呢？
🤓以 MySQL 驱动为例，当你第一次调用 `DriverManager.getConnection(url, user, password)` 方法时，系统会首先调用 `DriverManager` 类中的 `ensureDriversInitialized()` 静态方法，该方法负责加载数据库驱动。具体实现流程如下：

1. 第 601 行代码：使用 SPI 机制动态加载驱动。

	```java
	ServiceLoader<Driver> loadedDrivers = ServiceLoader.load(Driver.class);
	```

2. 第 635 行代码：通过反射实例化驱动类。

	```java
	Class.forName(aDriver, true, ClassLoader.getSystemClassLoader());
	```

	`Class.forName()` 方法通过反射动态加载驱动类，并调用无参构造方法实例化对象，完成驱动注册。

通过这两个步骤，JDBC 在运行时即可动态加载驱动。程序员只需引入驱动 jar 包，JDBC 便能自动完成驱动的加载与注册。

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
![[Pasted image 20250318172702.png]]

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
![[Pasted image 20250318172859.png]]

在 MySQL 客户端中执行 `SELECT * FROM t_user;` 可查看新增数据：
![[Pasted image 20250318173537.png]]

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
![[Pasted image 20250318174111.png]]

在 MySQL 客户端中再次执行 `SELECT * FROM t_user;`，发现刚插入的数据已被成功删除。
![[Pasted image 20250318174252.png]]

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
![[Pasted image 20250318190116.png]]

##### SQL 注入💣

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
![[Pasted image 20250318191526.png]]

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
![[Pasted image 20250318221157.png]]

⚠️**问题分析**
- `Statement` 直接拼接 SQL 语句，未对用户输入进行校验。
- `OR 1 = 1` 恒成立，导致返回所有数据。

🤔可以想象一下如果登录系统也存在 SQL 注入漏洞，那么攻击者可以绕过身份验证，直接访问系统，这将带来多么严重的安全风险。那么如何防止 SQL 注入呢？
🤓答案就是 **使用 `PreparedStatement` 代替 `Statement`**，它可以有效防止恶意 SQL 代码的注入，提高系统的安全性。
- 使用 `PreparedStatement` **预编译** SQL 语句，避免拼接 SQL。
- `PreparedStatement` 通过**占位符**替代用户输入，防止 SQL 注入。

#### PreparedStatement 接口

##### MySQL 预编译机制

在向 MySQL 服务器发送 SQL 语句时，MySQL 每次都会对语句进行**解析**、**校验**和**执行计划生成**等操作，如下图所示：
![](https://fastly.jsdelivr.net/gh/xihuanxiaorang/img/202309202129064.png)

在实际业务中，很多 SQL 语句结构是固定的，仅参数不同。
- 如果每次都重新解析和校验，性能会受到影响。
- **预编译**允许 MySQL 将 SQL 语句模板化，参数以占位符 `?` 形式存在，执行时只需注入参数，避免重复解析和校验。

🤔如何使用预编译呢？
🤓具体实现步骤如下所示：

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
![[Pasted image 20250318232506.png]]

##### PreparedStatement✨

在 Java 中，可以通过 `Connection` 连接对象的 `prepareStatement(sql)` 方法获取 `PreparedStatement` 实例对象。其中，`PreparedStatement` 接口继承自 `Statement` 接口，方法中的参数 `sql` 表示一条预编译 SQL 语句，SQL 语句中的参数值用占位符 `?` 来表示，之后可以使用 `setXxx()` 或者 `setObject()` 方法来设置这些参数。

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
![[Pasted image 20250319115031.png]]

在 MySQL 客户端中执行 `SELECT * FROM t_user;` 可查看新增数据：
![[Pasted image 20250319120032.png]]

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
![[Pasted image 20250319115738.png]]

在 MySQL 客户端中再次执行 `SELECT * FROM t_user;`，发现刚插入的数据已被成功删除。
![[Pasted image 20250319120127.png]]

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
![[Pasted image 20250319125616.png]]

##### 问题💣

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

执行 `testPreparedStatementQuery()` 测试方法后，查看日志文件（位于 MySQL 数据目录下），发现执行的 SQL 语句依然是普通 SQL：
![[Pasted image 20250319130026.png]]

🔍 **验证**：在 URL 上添加 `useServerPrepStmts=true&cachePrepStmts=true` 参数，再次执行，发现 SQL 语句已被成功预编译：
![[Pasted image 20250319130329.png]]

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
![[Pasted image 20250319134339.png]]

查看日志可以发现，`PreparedStatement` 会将参数作为一个整体处理，不会将其解析为 SQL 语句的一部分，从而避免了 SQL 注入。
![[Pasted image 20250319134525.png]]

## 批处理

批处理是一种将多条 SQL 语句合并为一个批次并一次性提交给数据库的技术，能有效减少数据库交互次数，提升执行性能。

### 判断是否支持批处理

部分 JDBC 驱动可能不支持批处理，可使用 `DatabaseMetaData.supportsBatchUpdates()` 方法进行检测。

```java
@Test  
public void testSupportsBatchUpdates() throws SQLException {  
  DatabaseMetaData databaseMetaData = CONNECTION.getMetaData();  
  boolean supportsBatchUpdates = databaseMetaData.supportsBatchUpdates();  
  System.out.println("是否支持批处理？" + supportsBatchUpdates);  
}
```

测试结果如下所示：发现 MySQL 支持批处理。
![[Pasted image 20250319165828.png]]

### 核心方法

| 方法               | 作用                           |
| ---------------- | ---------------------------- |
| `addBatch()`     | 将 SQL 语句添加到批处理中              |
| `executeBatch()` | 执行批处理                        |
| `clearBatch()`   | 清空批处理中已添加的 SQL，无法单独指定删除某条语句。 |

### 使用 PreparedStatement 进行批处理

执行批处理的标准流程：
1. 创建 `PreparedStatement` 对象
2. 关闭自动提交 (`setAutoCommit(false)`)
3. 🔄**创建 SQL 语句**，使用占位符
4. 🔄添加 SQL 语句到批处理中，调用 `addBatch()`
5. 执行批处理，调用 `executeBatch()`
6. 事务处理，成功后提交 `commit()`，失败时回滚 `rollback()`

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

点击测试，插入速度确实很快，但是否真的启用了批处理呢？查看 MySQL 日志后，发现 SQL 语句仍是逐条发送的，批处理功能并未生效。
![[Pasted image 20250319184515.png]]

🤔那么该如何启用批处理功能呢？
🤓在数据库连接 URL 中添加 `rewriteBatchedStatements=true` 参数，启用批量优化。

```text
jdbc:mysql://localhost:3306/jdbc-study?useUnicode=true&characterEncoding=utf-8&useSSL=false&serverTimezone=Asia/Shanghai&useServerPrepStmts=true&rewriteBatchedStatements=true
```

> [!note]
> - 适用于 **`INSERT`、`UPDATE`、`DELETE`** 语句
>   需要 **MySQL JDBC 驱动版本 ≥ 5.1.13**
>   **必须关闭自动提交** 才能生效

🔍 **验证**：启用 `rewriteBatchedStatements=true` 后，查看 MySQL 日志，确认 SQL 语句是批量执行的。
![[Pasted image 20250319190347.png]]

### 分批提交（优化）

> [!warning]- 大数据批量执行可能触发异常
>
> ```text
> com.mysql.cj.jdbc.exceptions.PacketTooBigException: Packet for query is too large (99,899,527 > 67,108,864). You can change this value on the server by setting the 'max_allowed_packet' variable.
> ```
>
> `max_allowed_packet` 表示 MySQL 单个数据包的最大大小（单位：字节）。
>
> - **默认值**：67108864（64M）
> - **最小值**：1024（1K）
> - **最大值**：1073741824（1G）
>
> > [!note]
> >
> > 参数值需为 1024 的倍数，非倍数将自动四舍五入到最接近的倍数。
>
> 查看与设置 `max_allowed_packet`：
> ```sql
> -- 查看最大数据包大小  
> SHOW VARIABLES LIKE 'max_allowed_packet';
> 
> -- 设置最大数据包大小为 32M（需重启 MySQL 服务）
> SET GLOBAL max_allowed_packet = 32 * 1024 * 1024;
> ```

批量执行时，单个批次可能超过 `max_allowed_packet` 限制，导致执行失败。💡为避免这个问题，采用 **分批提交**（如 **500 条/批**）。

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
![[Pasted image 20250321123552.png]]

日志如下所示：
![[Pasted image 20250321124021.png]]
