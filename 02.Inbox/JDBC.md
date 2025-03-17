---
tags:
  - Java
create_time: 2025-03-09T23:40:00
update_time: 2025/03/17 23:16
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
  `username` VARCHAR(32) NOT NULL COMMENT '用户名称',  
  `age` TINYINT(3) UNSIGNED NOT NULL COMMENT '用户年龄',  
  `gender` TINYINT(1) NOT NULL COMMENT '性别（0-女，1-男）',  
  `birthday` DATE NOT NULL COMMENT '用户生日',  
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
INSERT INTO `t_user` (`username`, `age`, `gender`, `birthday`) VALUES  
('张三', 25, 1, '1999-03-15'),  
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

## 执行流程

![[JDBC 执行流程 | 250]]

1. **加载驱动（Load Driver）**：通过 `Class.forName()` 或 [[04 - SPI 机制|SPI 机制]] 加载数据库驱动程序，并注册到 `DriverManager`。
2. **创建连接（Open Connection）**：使用 `DriverManager.getConnection()` 建立与数据库的连接。
3. **创建操作对象（Create Statement）**：通过连接对象创建 `Statement` 或 `PreparedStatement`。
4. **执行 SQL（Execute Statement）**：使用 `Statement` 中的 `executeQuery()` 或 `executeUpdate()` 执行查询或更新语句。
5. **处理结果（Process Results）**：通过 `ResultSet` 读取和处理查询结果。
6. **关闭连接，释放资源（Close Connection）**：通过 `try-with-resources` 自动关闭 `ResultSet`、`Statement` 和 `Connection`，释放资源。

### 加载驱动

在 SPI 机制 出现之前，加载数据库驱动的典型示例如下：

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

🤔：为什么使用 `Class.forName` 就能加载数据库驱动呢？
🤓：这是因为 JDBC 规范要求每个数据库驱动在类加载时自动注册到 `DriverManager`，通常通过[[01  - 代码块#静态初始化块|静态代码块]]实现。例如，MySQL 的 `Driver` 源码如下：

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
2. **`Class.forName()` 触发注册**：调用 `Class.forName()` 方法时，JVM 会执行静态代码块，从而完成驱动的注册与加载。 ^3f789e

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

🤔：那么 JDBC 是如何实现自动加载驱动的呢？
🤓：以 MySQL 驱动为例，当你第一次调用 `DriverManager.getConnection(url, user, password)` 方法时，系统会首先调用 `DriverManager` 类中的 `ensureDriversInitialized()` 静态方法，该方法负责加载数据库驱动。具体实现流程如下：

1. 第 601 行代码：使用 SPI 机制动态加载驱动。

	```java
	ServiceLoader<Driver> loadedDrivers = ServiceLoader.load(Driver.class);
	```

2. 第 635 行代码：通过反射实例化驱动类。

	```java
	Class.forName(aDriver, true, ClassLoader.getSystemClassLoader());
	```

	`Class.forName()` 方法通过反射动态加载驱动类，并调用无参构造方法实例化对象，完成驱动注册。[[#^3f789e]]

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

```java
public class JdbcTests {  
  private static final Logger LOGGER = LoggerFactory.getLogger(JdbcTests.class);  
  private static Connection CONNECTION = null;  

  @BeforeEach  
  public void before() {  
    try (InputStream ins = JdbcTests.class.getClassLoader().getResourceAsStream("db.properties")) {  
      final Properties properties = new Properties();  
      properties.load(ins);  
      final String url = properties.getProperty("jdbc.url");  
      final String username = properties.getProperty("jdbc.username");  
      final String password = properties.getProperty("jdbc.password");  
      CONNECTION = DriverManager.getConnection(url, username, password);  
      LOGGER.info("【建立数据库连接】: {}", CONNECTION);  
    } catch (IOException | SQLException e) {  
      throw new RuntimeException(e);  
    }  
  }  

  @AfterEach  
  public void after() {  
    if (CONNECTION != null) {  
      try {  
        CONNECTION.close();  
        LOGGER.info("【关闭数据库连接】:{}", CONNECTION);  
      } catch (SQLException e) {  
        throw new RuntimeException(e);  
      }  
    }  
  }  

  @Test  
  public void testConnection() {  
  }  
}
```

成功建立数据库连接，并在操作完成后关闭连接。`Connection` 的使用原则是：**尽量晚创建，尽量早释放**。
![[Pasted image 20250317231640.png]]

### Statement 接口

#### 更新 - 添加数据

```java
@Test  
public void testAdd() throws SQLException {  
    Statement statement = connection.createStatement();  
    String sql = "INSERT INTO `user`(`name`, `age`, `birthday`, `salary`, `note`) VALUES('小让', 18, '1995-07-13', 16000.0, '程序员');";  
    int count = statement.executeUpdate(sql);  
    LOGGER.info("【数据更新行数】：{}", count);  
}
```

测试结果如下所示：【数据更新行数】：1
![](https://fastly.jsdelivr.net/gh/xihuanxiaorang/img/202309202125843.png)

在 MySQL 客户端中执行 `select * from user;` 语句查看表中全部数据。
![](https://fastly.jsdelivr.net/gh/xihuanxiaorang/img/202309202125170.png)

#### 更新 - 删除数据

```java
@Test  
public void testDelete() throws SQLException {  
    Statement statement = connection.createStatement();  
    String sql = "DELETE FROM `user` WHERE `uid` = 1;";  
    int count = statement.executeUpdate(sql);  
    LOGGER.info("【数据更新行数】：{}", count); 
}
```

测试结果如下所示：【数据更新行数】：1
![](https://fastly.jsdelivr.net/gh/xihuanxiaorang/img/202309202125563.png)

再次利用 MySQL 客户端执行 `select * from user;` 语句查看表中全部数据，发现刚刚插入进去的一条的数据已被成功删除。![](https://fastly.jsdelivr.net/gh/xihuanxiaorang/img/202309202125068.png)

#### 查询数据

在执行查询前先往 `user` 表中插入几条数据，这样可以保证等下查询出来的效果。

```sql
INSERT INTO `user`(`name`, `age`, `birthday`, `salary`, `note`) VALUES('小让', 18, '1995-07-13', 16000.0, '程序员');  
INSERT INTO `user`(`name`, `age`, `birthday`, `salary`, `note`) VALUES('小星', 18, '1995-03-20', 20000.0, '幼教');  
INSERT INTO `user`(`name`, `age`, `birthday`, `salary`, `note`) VALUES('三十', 25, '1995-08-08', 22000.0, '硬件工程师');
```

创建用户类：

```java
@Data  
@NoArgsConstructor  
@AllArgsConstructor  
public class User {  
    /**  
     * 主键列  
     */  
    private Integer uid;  
    /**  
     * 姓名  
     */  
    private String name;  
    /**  
     * 年龄  
     */  
    private Integer age;  
    /**  
     * 生日  
     */  
    private Date birthday;  
    /**  
     * 工资薪水  
     */  
    private Float salary;  
    /**  
     * 说明  
     */  
    private String note;  
}
```

编写测试代码：

```java
@Test  
public void testQuery() throws SQLException {  
    Statement statement = connection.createStatement();  
    String sql = "SELECT * FROM `user`;";  
    ResultSet rs = statement.executeQuery(sql);  
    while (rs.next()) {  
        int uid = rs.getInt("uid");  
        String name = rs.getString("name");  
        int age = rs.getInt("age");  
        Date birthday = rs.getDate("birthday");  
        float salary = rs.getFloat("salary");  
        String note = rs.getString("note");  
        User user = new User(uid, name, age, birthday, salary, note);  
		LOGGER.info("{}", user);
    }  
}
```

测试结果如下所示：
![8ffe64fc-892a-4461-a5d0-176f42fea334](https://fastly.jsdelivr.net/gh/xihuanxiaorang/img/202309202125841.png)

再次利用 MySQL 客户端执行 `select * from user;` 语句查看表中全部数据。
![](https://fastly.jsdelivr.net/gh/xihuanxiaorang/images/202303090004164.png#height=159&id=JmnS1&originHeight=177&originWidth=780&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=shadow&title=&width=700)

#### SQL 注入💣

由于 Statement 使用的是拼接的 SQL 语句，所以很容易出现 **SQL 注入** 问题。那么何为 SQL 注入呢？SQL 注入指的是某些系统没有对用户输入的数据进行充分的检查，而在用户输入数据中注入非法的 SQL 语句段或命令，从而利用系统的 SQL 引擎完成恶意行为的做法。

咱们可以写一个简单的案例来测试一下：查询是否存在 ' 小白 ' 的用户，正常情况下用户表中是查询不到任何叫小白的用户的。

```java
@Test  
public void testSQLInjection() throws SQLException {  
    Statement statement = connection.createStatement();  
    String username = "'小白'";  
    String sql = "SELECT * FROM `user` where `name` = " + username;  
    ResultSet rs = statement.executeQuery(sql);  
    while (rs.next()) {  
        int uid = rs.getInt("uid");  
        String name = rs.getString("name");  
        int age = rs.getInt("age");  
        Date birthday = rs.getDate("birthday");  
        float salary = rs.getFloat("salary");  
        String note = rs.getString("note");  
        System.out.println("User{" +  
                "uid=" + uid +  
                ", name='" + name + '\'' +  
                ", age=" + age +  
                ", birthday=" + birthday +  
                ", salary=" + salary +  
                ", note='" + note + '\'' +  
                '}');  
    }  
}
```

测试结果如下所示：的确查询不到叫 ' 小白 ' 的用户。
![](https://fastly.jsdelivr.net/gh/xihuanxiaorang/img/202309202128574.png)

但是此时，咱们将测试代码修改一下，让其中的 username = ' 小白 ' or 1 = 1

```java
@Test  
public void testSQLInjection() throws SQLException {  
    Statement statement = connection.createStatement();  
    String username = "'小白' or 1 = 1";  
    String sql = "SELECT * FROM `user` where `name` = " + username;  
    ResultSet rs = statement.executeQuery(sql);  
    while (rs.next()) {  
        int uid = rs.getInt("uid");  
        String name = rs.getString("name");  
        int age = rs.getInt("age");  
        Date birthday = rs.getDate("birthday");  
        float salary = rs.getFloat("salary");  
        String note = rs.getString("note");  
        System.out.println("User{" +  
                "uid=" + uid +  
                ", name='" + name + '\'' +  
                ", age=" + age +  
                ", birthday=" + birthday +  
                ", salary=" + salary +  
                ", note='" + note + '\'' +  
                '}');  
    }  
}
```

测试结果如下所示：可以查询到用户表中的全部数据。
![](https://fastly.jsdelivr.net/gh/xihuanxiaorang/img/202309202128262.png)

可以想象一下如果在登录系统的时候也使用 SQL 注入的手段，那么岂不是任何一个人无需用户名和密码都可以登录进系统，这是一件多么可怕的事情！那么有没有办法解决该问题呢？答案肯定是有的，此时就引出咱们即将学到的 `PreparedStatement` 接口。

### PreparedStatement 接口

#### MySQL 预编译

通常咱们发送一条 SQL 语句给 MySQL 服务器时，MySQL 服务器每次都需要对这条语句进行校验、解析等操作。如下图所示：
![](https://fastly.jsdelivr.net/gh/xihuanxiaorang/img/202309202129064.png)

但是很多情况下，一条 SQL 语句可能需要反复的执行，每次执行可能仅仅是传递的参数不同而已，类似于这样的 SQL 语句如果每次都需要进行校验、解析等操作，未免太过于浪费性能，因此产生了 SQL 语句的预编译。所谓 **预编译** 就是将 **一些灵活的参数值以占位符 `?` 的形式给替代掉，把参数值给抽取出来，把 SQL 语句进行模板化**。让 MySQL 服务器执行相同的 SQL 语句时，不再需要在校验、解析 SQL 语句上面花费重复的时间。

如何使用预编译呢？步骤如下所示：

1. 定义预编译 SQL 语句；

   ```sql
   prepare statement from 'select * from user where uid = ? and name = ?';
   ```

2. 设置参数值；

   ```sql
   set @uid = 4,@name='小星';
   ```

3. 执行预编译 SQL 语句；

   ```sql
   execute statement using @uid,@name;
   ```

运行结果如下所示：
![](https://fastly.jsdelivr.net/gh/xihuanxiaorang/img/202309202131691.png)

#### PreparedStatement🔥

可以通过 `Connection` 连接对象的 `prepareStatement (sql)` 方法获取 `PreparedStatement` 实例对象，其中，`PreparedStatement` 接口继承自 `Statement` 接口，方法中的参数 `sql` 表示一条预编译过的 SQL 语句，在 SQL 语句中的参数值用占位符 `?` 来表示，之后可以使用 `setXxx ()` 或者 `setObject ()` 方法来设置这些参数，💡需要注意的是，**索引值从 1 开始**。

##### 更新 - 添加数据

```java
@Test  
public void testPreparedStatementAdd() throws SQLException {  
    String sql = "INSERT INTO `user`(`name`, `age`, `birthday`, `salary`, `note`) VALUES(?, ?, ?, ?, ?);";  
    PreparedStatement preparedStatement = connection.prepareStatement(sql);  
    preparedStatement.setString(1, "小白");  
    preparedStatement.setInt(2, 18);  
    preparedStatement.setDate(3, new Date(new java.util.Date().getTime()));  
    preparedStatement.setFloat(4, 18000.0f);  
    preparedStatement.setString(5, "销售");  
    int count = preparedStatement.executeUpdate();  
    System.out.println("【数据更新行数】：" + count);  
}
```

测试结果如下所示：【数据更新行数】：1
![](https://fastly.jsdelivr.net/gh/xihuanxiaorang/img/202309202132178.png)

在 MySQL 客户端中执行 `select * from user;` 语句查看表中全部数据。
![](https://fastly.jsdelivr.net/gh/xihuanxiaorang/img/202309202132625.png)

##### 更新 - 删除数据

```java
@Test  
public void testPreparedStatementDelete() throws SQLException {  
    String sql = "DELETE FROM `user` WHERE `uid` = ?;";  
    PreparedStatement preparedStatement = connection.prepareStatement(sql);  
    preparedStatement.setInt(1, 6);  
    int count = preparedStatement.executeUpdate();  
    System.out.println("【数据更新行数】：" + count);  
}
```

测试结果如下所示：【数据更新行数】：1
![](https://fastly.jsdelivr.net/gh/xihuanxiaorang/img/202309202132110.png)

在 MySQL 客户端中执行 `select * from user;` 语句查看表中全部数据，发现刚刚插入进去的一条的数据已被成功删除。
![](https://fastly.jsdelivr.net/gh/xihuanxiaorang/img/202309202132721.png)

##### 查询数据

```java
@Test  
public void testPreparedStatementQuery() throws SQLException {  
    String sql = "SELECT * FROM `user` WHERE `name` like ?;";  
    try (PreparedStatement preparedStatement = CONNECTION.prepareStatement(sql)) {  
        preparedStatement.setString(1, "%%");  
        try (ResultSet rs = preparedStatement.executeQuery()) {  
            while (rs.next()) {  
                int uid = rs.getInt("uid");  
                String name = rs.getString("name");  
                int age = rs.getInt("age");  
                Date birthday = rs.getDate("birthday");  
                float salary = rs.getFloat("salary");  
                String note = rs.getString("note");  
                User user = new User(uid, name, age, birthday, salary, note);  
                LOGGER.info("{}", user);  
            }  
        }  
    }  
}
```

测试结果如下所示：
![](https://fastly.jsdelivr.net/gh/xihuanxiaorang/img/202309202133983.png)

再次利用 MySQL 客户端执行 `select * from user;` 语句查看表中全部数据。
![](https://fastly.jsdelivr.net/gh/xihuanxiaorang/img/202309202133623.png)

#### 问题💣

事实上，在使用 `PreparedStatement` 时默认是不能执行预编译的，需要在 URL 中增加额外参数 `useServerPrepStmts=true`（MySQL Server 4.1 之前的版本是不支持预编译的，而 MySQL Connector 在 5.0.5 以后的版本默认是不开启预编译功能的）。需要注意的是💡，当使用不同的 `PreparedStatement` 对象来执行相同的 SQL 语句时，还是会出现编译两次的现象，这是因为驱动没有缓存编译后的函数 key，会二次编译。如果希望缓存编译后函数的 key，那么就还需要增加一个参数 `cachePrepStmts=true`。URL 添加参数之后才能保证 MySQL 驱动先把 SQL 语句发送给服务器进行预编译，然后再执行 `executeQuery ()` 时只是把参数发送给服务器。执行流程如下：
![](https://fastly.jsdelivr.net/gh/xihuanxiaorang/img/202309202133766.png)

为了查看效果，不妨打开 MySQL 的通用查询日志：

```
#查看general_log是否开启  
show variables like 'general_log%';  
#开启general log:  
set global general_log = 1;

#查询日志时区  
show variables like 'log_timestamps';  
#修改日志时区为系统默认的时区，如果想永久修改时区，则在my.ini配置文件中的[mysqld]下增加log_timestamps=SYSTEM  
set global log_timestamps=SYSTEM;

# 查看mysql数据存储目录  
show global variables like '%datadir%';
```

执行 `testPreparedStatementQuery ()` 测试方法，查看 MySQL 数据存储目录下的 `general_log_file` 所对应的日志文件，发现执行的 SQL 语句依然是普通的 SQL 语句：
![](https://fastly.jsdelivr.net/gh/xihuanxiaorang/img/202309202133465.png)

在 URL 上增加参数 `useServerPrepStmts=true&cachePrepStmts=true`，再次执行 `testPreparedStatementQuery ()` 测试方法，再次查看日志文件，发现日志如下，确实成功开启预编译功能。
![](https://fastly.jsdelivr.net/gh/xihuanxiaorang/img/202309202133551.png)

#### 防止 SQL 注入

使用 `PreparedStatement` 可以防止 SQL 注入，其根本原因就是 MySQL 已经对使用了占位符的 SQL 语句进行了预编译，执行计划中的条件已经确定，不能再额外添加其他条件，从而避免了 SQL 注入。咱们使用 `PreparedStatement` 的方式再来测试一下上面的 SQL 注入案例，看看是否可以查到名字叫 ' 小白 ' 的用户。

```java
@Test  
public void testPreparedStatementSQLInjection() throws SQLException {  
    String sql = "SELECT * FROM `user` WHERE `name` = ?";  
    PreparedStatement preparedStatement = CONNECTION.prepareStatement(sql);  
    preparedStatement.setString(1, "'小白' or 1 = 1");  
    try (ResultSet rs = preparedStatement.executeQuery()) {  
        while (rs.next()) {  
            int uid = rs.getInt("uid");  
            String name = rs.getString("name");  
            int age = rs.getInt("age");  
            Date birthday = rs.getDate("birthday");  
            float salary = rs.getFloat("salary");  
            String note = rs.getString("note");  
            User user = new User(uid, name, age, birthday, salary, note);  
            LOGGER.info("{}", user);  
        }  
    }  
}
```

测试结果如下所示：就是以 SQL 注入的方式也查询不到任何数据，成功！
![](https://fastly.jsdelivr.net/gh/xihuanxiaorang/img/202309202135368.png)

查看日志可以发现，它把传入进行的参数值当成一个整体的字符串作为条件。
![](https://fastly.jsdelivr.net/gh/xihuanxiaorang/img/202309202135206.png)

## 批处理

批处理允许将相关的 SQL 语句分组到一个批处理中，并通过一次调用将它们提交到数据库。当你一次向数据库发送多条 SQL 语句时，可以减少通信开销，从而提高性能。

- JDBC 驱动程序不一定支持该功能，可以使用 `DatabaseMataData.supportsBacthUpdates ()` 方法来确定目标数据库是否支持批处理更新。如果 JDBC 驱动程序支持此功能，则该方法返回值为 true。

  ```java
  @Test  
  public void testSupportsBatchUpdates() throws SQLException {  
      DatabaseMetaData databaseMetaData = CONNECTION.getMetaData();  
      boolean supportsBatchUpdates = databaseMetaData.supportsBatchUpdates();  
      System.out.println("是否支持批处理？" + supportsBatchUpdates);  
  }
  ```

  运行测试代码，发现居然报错！
  ![](https://fastly.jsdelivr.net/gh/xihuanxiaorang/img/202309202136005.png)

  上网一查，发现 MySQL8.x 版本还需在 URL 上加上 `allowPublicKeyRetrieval=true` 参数。咱们加上，再试一次，发现 MySQL 是支持批处理功能的。
  ![](https://fastly.jsdelivr.net/gh/xihuanxiaorang/img/202309202136365.png)

- `Statement`、`PreparedStatement`、`CallableStatement` 的 `addBatch ()` 方法用于将单个 SQL 语句添加到批处理中。
- `excuteBatch ()` 方法用于执行所有放入批处理中的 SQL 语句。`excuteBatch ()` 方法返回一个整数数组，数组中的每个元素代表各自更新语句的更新数目。
- 正如将 SQL 语句添加到批处理当中一样，可以使用 `clearBatch ()` 方法清空，该方法用于清空所有添加到批处理当中的 SQL 语句，而无法指定要删除某条数据。

### PreparedStatement 批处理

使用 `PreparedStatement` 实例对象进行批处理的典型步骤顺序如下：

1. 使用占位符创建 SQL 语句
2. 使用 `Connection` 实例对象的 `prepareStatement ()` 方法获取 `PreparedStatement` 实例对象
3. 使用 `Connection` 实例对象的 `setAutoCommit (false)` 方法关闭自动提交，即取消自动提交事务 (在下面章节会详细介绍)。
4. 使用 `PreparedStatement` 实例对象的 `setXxx ()` 方法给占位符赋值之后再使用 `addBatch ()` 方法将 SQL 语句添加到批处理中
5. 使用 `PreparedStatement` 实例对象的 `executeBatch ()` 方法执行批处理
6. 最后，使用 `Connection` 实例对象 `commit ()` 方法提交所有的更改，或者出现异常时，使用 `rollback ()` 方法回滚所有操作。

```java
@Test  
public void testPreparedStatementBatchAdd() {  
    try {  
        CONNECTION.setAutoCommit(false);  
        String sql = "INSERT INTO `user`(`name`, `age`, `birthday`, `salary`, `note`) VALUES(?, ?, ?, ?, ?);";  
        try (PreparedStatement preparedStatement = CONNECTION.prepareStatement(sql)) {  
            for (int i = 0; i < 5; i++) {  
                preparedStatement.setString(1, "小白" + i);  
                preparedStatement.setInt(2, 18);  
                preparedStatement.setDate(3, new Date(new java.util.Date().getTime()));  
                preparedStatement.setFloat(4, 18000.0f);  
                preparedStatement.setString(5, "销售");  
                preparedStatement.addBatch();  
            }  
            int[] counts = preparedStatement.executeBatch();  
            CONNECTION.commit();  
            LOGGER.info("【数据更新行数】：{}", counts);  
        }  
    } catch (SQLException e) {  
        e.printStackTrace();  
        try {  
            CONNECTION.rollback();  
        } catch (SQLException ex) {  
            throw new RuntimeException(ex);  
        }  
    }  
}
```

点击测试，发现插入还是挺快的，那么到底有没有用上批处理功能呢？咱们来查看一下 MySQL 日志信息，发现 SQL 语句还是一条一条发送的，并没有使用批处理功能！
![](https://fastly.jsdelivr.net/gh/xihuanxiaorang/img/202309202137810.png)不卖关子了，其实还需要在 URL 中增加一个参数 `rewriteBatchedStatements=true`。

> [!NOTE]
>
> URL 上只有加上 `rewriteBatchedStatements=true` 参数，并保证 MySQL 驱动在 5.1.13 以上版本，才能实现高性能的批量插入。MySQL 驱动在默认情况下会无视 `executeBatch ()` 语句，把咱们期望批量执行的一组 SQL 语句拆散，一条一条地发给 MySQL 服务器，批量插入直接编程单条插入，所以造成较低的性能。另外，这个参数对 INSERT / UPDATE / DELETE 都有效。

咱们在 URL 上添加上该参数 `rewriteBatchedStatements=true` 后，再来测试一下，再看看 MySQL 的日志信息。惊讶地发现，程序居然报错了！
![](https://fastly.jsdelivr.net/gh/xihuanxiaorang/img/202309202139528.png)

其实细心的小伙伴可以发现，在咱们的 SQL 语句最后有一个分号，这样在做批处理的时候就会出现上图中的错误，所以咱们需要把 SQL 语句最后的分号去掉。

```java
@Test  
public void testPreparedStatementBatchAdd() {  
    try {  
        CONNECTION.setAutoCommit(false);  
        String sql = "INSERT INTO `user`(`name`, `age`, `birthday`, `salary`, `note`) VALUES(?, ?, ?, ?, ?)";  
        try (PreparedStatement preparedStatement = CONNECTION.prepareStatement(sql)) {  
            for (int i = 0; i < 5; i++) {  
                preparedStatement.setString(1, "小白" + i);  
                preparedStatement.setInt(2, 18);  
                preparedStatement.setDate(3, new Date(new java.util.Date().getTime()));  
                preparedStatement.setFloat(4, 18000.0f);  
                preparedStatement.setString(5, "销售");  
                preparedStatement.addBatch();  
            }  
            int[] counts = preparedStatement.executeBatch();  
            CONNECTION.commit();  
            LOGGER.info("【数据更新行数】：{}", counts);  
        }  
    } catch (SQLException e) {  
        e.printStackTrace();  
        try {  
            CONNECTION.rollback();  
        } catch (SQLException ex) {  
            throw new RuntimeException(ex);  
        }  
    }  
}
```

再来测试一把，发现执行成功，此时再来看看 MySQL 的日志信息，发现达到预期效果！
![](https://fastly.jsdelivr.net/gh/xihuanxiaorang/img/202309202139500.png)

### 优化

由于 JDBC 批处理利用的是 SQL 中 `INSERT INTO ...VALUES` 的方式插入多条数据，所以当以这种方式插入大量的 (几百万或者几千万) 数据时，可能会出现如下异常：

```
com.mysql.cj.jdbc.exceptions.PacketTooBigException: Packet for query is too large (99,899,527 > 67,108,864). You can change this value on the server by setting the 'max_allowed_packet' variable.
```

`max_allowed_packet` 为数据包消息缓存区最大大小，单位为字节，默认值为 67108864（64M），最大值 1073741824（1G），最小值 1024（1K），参数值须为 1024 的倍数，非倍数将四舍五入到最接近的倍数。数据包消息缓存区初始大小为 `net_buffer_length` 个字节，每条 SQL 语句和它的参数都会产生一个数据包消息缓存区，跟事务无关。

如何查看与设置 `max_allowed_packet` 参数？

```sql
# 查看数据包消息缓存区初始大小  
show variables like 'net_buffer_length';  
# 查看数据包消息缓存区最大大小  
show variables like 'max_allowed_packet';
# 重新打开数据库连接参数生效，数据库服务重启后参数恢复为默认，想永久修改的话，则在my.ini配置文件中的[mysqld]下增加max_allowed_packet=32*1024*1024  
set global max_allowed_packet=32*1024*1024;
```

咱们为了测试效果，将该值设置小一点，`set global max_allowed_packet=20*1024*10;` 设置成 200K 大小之后，编写测试代码。

```java
@Test  
public void testPreparedStatementBatchAdd2() throws SQLException {  
    try {  
        CONNECTION.setAutoCommit(false);  
        String sql = "INSERT INTO `user`(`name`, `age`, `birthday`, `salary`, `note`) VALUES(?, ?, ?, ?, ?)";  
        try (PreparedStatement preparedStatement = CONNECTION.prepareStatement(sql)) {  
            for (int i = 1; i <= 1000000; i++) {  
                preparedStatement.setString(1, "小白" + i);  
                preparedStatement.setInt(2, 18);  
                preparedStatement.setDate(3, new Date(new java.util.Date().getTime()));  
                preparedStatement.setFloat(4, 18000.0f);  
                preparedStatement.setString(5, "销售");  
                preparedStatement.addBatch();  
            }  
            int[] counts = preparedStatement.executeBatch();  
            CONNECTION.commit();  
            LOGGER.info("【数据更新行数】：{}", counts);  
        }  
    } catch (SQLException e) {  
        e.printStackTrace();  
        try {  
            CONNECTION.rollback();  
        } catch (SQLException ex) {  
            throw new RuntimeException(ex);  
        }  
    }  
}
```

插入一百万条数据，点击测试，发现程序报错，报错的信息就和咱们上面提到的一样。
![](https://fastly.jsdelivr.net/gh/xihuanxiaorang/img/202309202140424.png)

那么该怎么优化代码呢？其实很简单，咱们分批次处理，一次处理 500 条数据，代码优化如下：

```java
@Test  
public void testPreparedStatementBatchAdd3() {  
    long start = System.currentTimeMillis();  
    try {  
        CONNECTION.setAutoCommit(false);  
        String sql = "INSERT INTO `user`(`name`, `age`, `birthday`, `salary`, `note`) VALUES(?, ?, ?, ?, ?)";  
        try (PreparedStatement preparedStatement = CONNECTION.prepareStatement(sql)) {  
            for (int i = 1; i < 1000000; i++) {  
                preparedStatement.setString(1, "小白" + i);  
                preparedStatement.setInt(2, 18);  
                preparedStatement.setDate(3, new Date(new java.util.Date().getTime()));  
                preparedStatement.setFloat(4, 18000.0f);  
                preparedStatement.setString(5, "销售");  
                preparedStatement.addBatch();  
                if (i % 500 == 0) {  
                    preparedStatement.executeBatch();  
                    preparedStatement.clearBatch();  
                }  
            }  
            preparedStatement.clearBatch();  
            CONNECTION.commit();  
            LOGGER.info("百万条数据插入用时：{}【单位：毫秒】", (System.currentTimeMillis() - start));  
        }  
    } catch (SQLException e) {  
        e.printStackTrace();  
        try {  
            CONNECTION.rollback();  
        } catch (SQLException ex) {  
            throw new RuntimeException(ex);  
        }  
    }  
}
```

点击测试，等待一段时间后，发现插入成功！测试结果如下所示：
![](https://fastly.jsdelivr.net/gh/xihuanxiaorang/img/202309202140228.png)

查看数据库中用户表的数据，发现已全部成功插入！

## 事务

### MySQL 对事务的支持

> [!tip]
> 对于 MySQL 中事务的四种隔离级别不清楚的小伙伴的可以查看 [MySQL 四种隔离级别](https://www.yuque.com/xihuanxiaorang/java/uebi2x7whkk44kg1?view=doc_embed) 这篇文章。

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
INSERT INTO `user`(`name`, `age`, `birthday`, `salary`, `note`) VALUES('小让', 18, '1995-07-13', 16000.0, '程序员');  
INSERT INTO `user`(`name`, `age`, `birthday`, `salary`, `note`) VALUES('小星', 18, '1995-03-20', 20000.0, '幼教');  
INSERT INTO `user`(`name`, `age`, `birthday`, `salary`, `note`) VALUES('三十', 25, '1995-08-08', 22000.0, '硬件工程师');
```

可以看到用户 1 的薪资为 16000，用户 2 的薪资为 20000，现在咱们就模拟一个场景，让用户 1 的薪资减 1000，然后让用户 2 的薪资加 1000，两个过程作为一个整体，总的薪资应该不变，其实就是模拟的转账过程。

#### 没有事务的情况

```java
@Test  
public void testTransferNonTransaction() {  
    String sql1 = "UPDATE `user` SET `salary` = `salary` - ? WHERE `uid` = ?;";  
    String sql2 = "UPDATE `user` SET `salary` = `salary` + ? WHERE `uid` = ?;";  
    try (PreparedStatement preparedStatement = CONNECTION.prepareStatement(sql1);  
         PreparedStatement preparedStatement2 = CONNECTION.prepareStatement(sql2)) {  
        preparedStatement.setFloat(1, 1000.0f);  
        preparedStatement.setInt(2, 1);  
        preparedStatement.executeUpdate();  
        int i = 1 / 0;  
        preparedStatement2.setFloat(1, 1000.0f);  
        preparedStatement2.setInt(2, 2);  
        preparedStatement.executeUpdate();  
    } catch (SQLException e) {  
        throw new RuntimeException(e);  
    }  
}
```

测试结果如下所示：出现异常。
![](https://fastly.jsdelivr.net/gh/xihuanxiaorang/img/202309202142759.png)

然后查看数据库用户表中的数据：
![](https://fastly.jsdelivr.net/gh/xihuanxiaorang/img/202309202143410.png)

发现在没有事务并且出现异常的情况下，用户 1 已经扣了 1000，但是用户 2 并没有加 1000，此时就暴露出没有事务的危险性！

#### 存在事务的情况

```java
@Test  
public void testTransferWithTransaction() throws SQLException {  
    connection.setAutoCommit(false);  
    try {  
        String sql1 = "UPDATE `user` SET `salary` = `salary` - ? WHERE `uid` = ?;";  
        PreparedStatement preparedStatement1 = connection.prepareStatement(sql1);  
        preparedStatement1.setFloat(1, 1000.0f);  
        preparedStatement1.setInt(2, 1);  
        preparedStatement1.executeUpdate();  
        int i = 1 / 0;  
        String sql2 = "UPDATE `user` SET `salary` = `salary` + ? WHERE `uid` = ?;";  
        PreparedStatement preparedStatement2 = connection.prepareStatement(sql2);  
        preparedStatement2.setFloat(1, 1000.0f);  
        preparedStatement2.setInt(2, 2);  
        preparedStatement2.executeUpdate();  
        connection.commit();  
    } catch (Exception e) {  
        e.printStackTrace();  
        connection.rollback();  
    }  
}
```

测试结果如下所示：出现异常。
![](https://fastly.jsdelivr.net/gh/xihuanxiaorang/img/202309202143003.png)

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
druid.url=jdbc:mysql://localhost:3306/atguigudb?useUnicode=true&characterEncoding=utf-8&useSSL=false&serverTimezone=Asia/Shanghai&useServerPrepStmts=true&cachePrepStmts=true&allowPublicKeyRetrieval=true&rewriteBatchedStatements=true
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
    private static final Logger LOGGER = LoggerFactory.getLogger(DruidDataSourceTest.class);

    private static DataSource dataSource = null;

    @BeforeAll
    public static void before() {
        try {
            Properties properties = new Properties();
            properties.load(DruidDataSourceTest.class.getResourceAsStream("/druid.properties"));
            dataSource = DruidDataSourceFactory.createDataSource(properties);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    @Test
    public void testAdd() {
        try (Connection connection = dataSource.getConnection()) {
            Statement statement = connection.createStatement();
            String sql = "INSERT INTO `user`(`name`, `age`, `birthday`, `salary`, `note`) VALUES('小让', 18, '1995-07-13', 16000.0, '程序员');";
            int count = statement.executeUpdate(sql);
            LOGGER.info("【数据更新行数】：{}", count);
        } catch (SQLException e) {
            throw new RuntimeException(e);
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
jdbcUrl=jdbc:mysql://localhost:3306/atguigudb?useUnicode=true&characterEncoding=utf-8&useSSL=false&serverTimezone=Asia/Shanghai&useServerPrepStmts=true&cachePrepStmts=true&allowPublicKeyRetrieval=true&rewriteBatchedStatements=true
username=root
password=123456
dataSource.connectionTimeout=1000
dataSource.idleTimeout=60000
dataSource.maximumPoolSize=10
```

##### 测试用例

```java
public class HikariDataSourceTest {
    private static final Logger LOGGER = LoggerFactory.getLogger(HikariDataSourceTest.class);

    private static DataSource dataSource = null;

    @BeforeAll
    public static void before() {
        HikariConfig config = new HikariConfig("/hikari.properties");
        dataSource = new HikariDataSource(config);
    }

    @Test
    public void testAdd() {
        try (Connection connection = dataSource.getConnection()) {
            Statement statement = connection.createStatement();
            String sql = "INSERT INTO `user`(`name`, `age`, `birthday`, `salary`, `note`) VALUES('小让', 18, '1995-07-13', 16000.0, '程序员');";
            int count = statement.executeUpdate(sql);
            LOGGER.info("【数据更新行数】：{}", count);
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }
}
```

点击测试按钮，测试结果如下所示：
![](https://fastly.jsdelivr.net/gh/xihuanxiaorang/img/202309202147282.png)

查询数据库，检验是否真的执行成功：
![](https://fastly.jsdelivr.net/gh/xihuanxiaorang/img/202309202148155.png)

可以发现，数据库 `user` 表中确实增加了一条数据！
