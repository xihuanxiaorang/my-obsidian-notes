---
tags:
  - Java
repository: https://github.com/xihuanxiaorang/java-study/tree/core-study/core-study/spi-study
create_time: 2024-12-28T17:52:00
update_time: 2025/01/16 21:47
---

## 简介

SPI，全称为 Service Provider Interface，是一种**基于 ClassLoader 的服务发现和加载机制**，自 Java 6 开始引入。SPI 的核心思想是通过标准化的方式动态加载服务的实现类。

一个完整的 SPI 体系通常由以下三个组件构成：

- **Service**：公开的接口或抽象类，用于定义功能模块的抽象行为。
- **Service Provider**：服务的具体实现类，用于实现 Service 接口中定义的功能。
- **ServiceLoader**：SPI 的核心组件，负责**在运行时通过配置文件发现并加载对应的 Service Provider**。

这种机制极大地增强了模块的灵活性和扩展性，使得应用程序可以通过约定加载不同的实现而无需修改代码。

其运行流程如下图所示：

![[Java SPI 运行流程.excalidraw| 800]]

**应用程序（Application）首先通过调用 ServiceLoader 的 `load()` 方法加载服务提供者（Service Provider）**。在第三方 Jar 包中，可能存在多个服务提供者，这些提供者都实现了统一的服务接口（Service Interface）。ServiceLoader 会将加载的服务提供者以接口实例的形式返回给应用程序，应用程序在获取这些实例后，即可执行后续操作，而**无需关心服务接口的具体实现细节，只需与服务接口进行交互即可**。

## 在 JDBC 中的应用

JDBC，全称是 Java DataBase Connectivity。是 Java 提供的一套用于访问数据库的标准 API。简单来说，JDBC 允许开发者使用 Java 语言与数据库交互。各数据库厂商会根据 JDBC 规范提供各自的实现，这些实现被称为 "数据库驱动"（Driver）。通过加载合适的数据库驱动，应用程序可以实现与不同数据库的无缝连接和操作。

下图清晰的描述了 JDBC 的架构：

- 最上层是 Java 应用程序，负责调用标准化的 JDBC API。
- JDBC API 中间层将应用程序的调用请求映射到具体的数据库驱动。
- 底层是数据库驱动，负责将 JDBC API 的调用翻译为数据库协议，并与数据库通信。
- 最终，通过驱动程序访问和操作数据库。

![[JDBC 架构图.excalidraw| 600]]

先来大致了解一下 JDBC 的调用流程，如下图所示：

![[JDBC 调用流程.excalidraw | 500]]

在 Java SPI 出现之前，一个典型的示例代码如下所示：

![[JDBC 调用流程]]

下面我们重点了解一下数据库驱动的加载方式。在 Java SPI 机制出现之前，程序员通常通过调用 Class. forName 手动加载数据库驱动，例如：

```java
// 加载 MySQL8 数据库驱动
Class.forName("com.mysql.cj.jdbc.Driver");

// 加载 Oracle 数据库驱动
Class.forName("oracle.jdbc.driver.OracleDriver");

// 加载 SqlServer 数据库驱动
Class.forName("com.microsoft.sqlserver.jdbc.SQLServerDriver");
```

🤔：为什么使用 Class. forName 就能加载数据库驱动呢？
🤓：这是因为 JDBC 规范要求 Driver 实现类在类加载的时候能将自动将自身的实例对象注册到 DriverManager 中。其中 MySQL 的 Driver 源码如下所示：

```java
public class Driver extends NonRegisteringDriver implements java.sql.Driver {
  // Register ourselves with the DriverManager.
  static {
    try {
      java.sql.DriverManager.registerDriver(new Driver());
    } catch (SQLException E) {
      throw new RuntimeException("Can't register driver!");
    }
  }

  /**
     * Construct a new driver and register it with DriverManager
     * 
     * @throws SQLException
     *             if a database error occurs.
     */
  public Driver() throws SQLException {
    // Required for Class.forName().newInstance().
  }
}
```

具体来说，每个数据库驱动都会实现 java. sql. Driver 接口，并在静态代码块中通过调用 `DriverManager.registerDriver()` 方法，将自身注册到 DriverManager 的驱动列表中。因此，使用 Class. forName 加载驱动类时，静态代码块会自动执行，从而完成驱动的注册和加载。

> [!chat-bubble]+ 看着这些硬编码的类名，作为一名有追求的程序员，脑海中自然会冒出这样的念头：
>
> - 咦！？这些类名是不是可以写到配置文件中呢？这样我更换数据库驱动时，就不用修改代码了。比如： `dirver-name: com.mysql.cj.jdbc.Driver`
> - 不过，这样还是不够完美……我还得记住不同数据库厂商提供的 Driver 类名！这也太麻烦了吧！头发本来就不多了，换驱动还得查文档，太不友好了。
> - 能不能和数据库厂商商量一下，让他们直接把配置文件也一并提供？程序员省事，厂商也省事！程序员不用了解驱动类名，厂商还能方便地升级驱动。
> + 听起来是个好主意！不过，如果厂商提供配置文件，那程序如何去读取它呢？
> - 还记得 ClassLoader 吗？它不仅可以加载类，还能通过 `getResource()` 或 `getResources()` 方法读取 classpath 下的文件。只要我们和厂商**事先约定好配置文件的路径和格式**，就可以通过它来读取厂商放在 jar 包中的配置文件！
> + 你 TN 的还真是个天才！！！这套机制，我们就叫它 SPI 吧！

这种设计既简化了开发，又提升了代码的可维护性，堪称一举两得！

于是，JDBC 借助 Java SPI 机制实现了数据库驱动的自动加载。通过这种方式：

- 程序员无需显式调用 Class. forName 来加载驱动。
- 只需在项目中引入所需的数据库驱动 jar 包即可。
- 更换数据库时，只需更换对应的 jar 包，无需修改代码。

🤔：那么 JDBC 具体是如何实现的呢？
🤓：以 MySQL 驱动为例，当你第一次调用 DriverManager. getConnection (url, user, password); 方法时，系统会首先调用 DriverManager 类中的静态方法 ensureDriversInitialized ()，该方法负责加载数据库驱动。具体实现流程如下：

1. 第 601 行代码：使用 SPI 机制动态加载 Driver 接口的实现类。

	```java
	ServiceLoader<Driver> loadedDrivers = ServiceLoader.load(Driver.class);
	```

2. 第 635 行代码：使用反射技术创建驱动类的实例对象。

	```java
	Class.forName(aDriver, true, ClassLoader.getSystemClassLoader());
	```

	`Class.forName()` 方法会通过反射动态加载驱动类，并调用其无参构造方法实例化对象，从而将其注册到 `DriverManager` 中。

通过这两个步骤，数据库驱动可以在运行时自动加载，程序员只需引入驱动的 jar 包，JDBC 会自动完成驱动的加载与注册，而无需手动调用 `Class.forName()` 方法。

## 三大规范要素

### 规范的配置文件

1. 文件路径：必须位于 jar 包中的 META-INF/services 目录下。
2. 文件名称：文件名必须为 Service 接口的全限定类名。
3. 文件内容：写入 Service 实现类（即 Service Provider）的全限定类名。多个实现类需换行分开，每行一个。

以 MySQL 数据库驱动为例，查看 mysql-connector-java 的 jar 包。在 resources/META-INF/services 目录下存在一个名称为 java. sql. Driver（Service 接口的全限定类名）的配置文件，其内容是 MySQL 数据库驱动类的全限定类名： `com.mysql.cj.jdbc.Driver` 。
![](https://cdn.jsdelivr.net/gh/xihuanxiaorang/img2/202412151731091.png)

### Service Provider 类必须具备无参构造方法

SPI 机制要求 Service 接口的实现类（即 Service Provider 类）必须提供无参构造方法。因为 SPI 使用反射技术 Class. forName () 来实例化服务提供者，而反射机制默认调用的是无参构造方法。

例如，MySQL 数据库驱动类 Driver 就提供了无参构造方法：

```java
public class Driver extends NonRegisteringDriver implements java. sql. Driver {  
  public Driver () throws SQLException {  
    // 无参构造方法  
  }  
}
```

通过这个无参构造方法，SPI 能够通过反射实例化 Driver 类。

### 保证配置文件和 Service Provider 类可被加载

以下三种方式可以确保配置文件和 Service Provider 类被正确加载：

- [x] 将 ServiceProvider 的 jar 包放到 classpath 下
- [ ] 将 jar 包安装到 JRE 的扩展目录当中
- [ ] 使用自定义 ClassLoader 手动加载

以 MySQL 为例，只需通过 Maven 引入 MySQL 驱动的依赖，JDBC 就会自动加载数据库驱动，而无需手动干预：

```xml
<dependency>  
  <groupId>mysql</groupId>  
  <artifactId>mysql-connector-java</artifactId>  
  <version>8.0.28</version>  
</dependency>
```

## 举个简单的栗子

应用背景：公司 A 需要接入互联网。它定义了一个标准化的网络连接 API，而中国移动和中国联通分别提供具体的网络服务。这一场景涉及以下三方：公司 A & 中国移动 & 中国联通。其中，

- 公司 A 开发了两个模块：
    - simple-api：定义连接网络的 API，作为 SPI 机制中的 Service 接口。
    - simple-company：业务应用程序，调用 simple-api 中的接口。
- 中国移动 & 中国联通：分别以 simple-isp-mobile 和 simple-isp-unicom 模块的形式，提供基于 simple-api 的联网服务实现，两者都作为 SPI 机制中的 Service Provider。

![[Java SPI 机制栗子.excalidraw | 800]]

项目关系图比较简单，其中 simple-company 会调用 simple-api，而 simple-isp-mobile 和 simple-isp-unicom 则实现了 simple-api。如下所示：

![[Java SPI 机制栗子架构图.excalidraw | 700]]

具体代码实现步骤如下所示：

1. simple-api 模块：整个模块仅定义一个 InternetService 接口，作为 SPI 机制中的 Service。

   ```java
   public interface InternetService {
     /**
      * 连接网络
      */
     void connect();
   }
   ```

2. simple-isp-mobile 模块
   1. 依赖于 simple-api 模块；

      ```xml
      <dependencies>
        <dependency>
          <groupId>fun.xiaorang</groupId>
          <artifactId>simple-api</artifactId>
          <version>1.0-SNAPSHOT</version>
        </dependency>
      </dependencies>
      ```

   2. 定义 ChinaMobile 和 BeijingChinaMobile 两个类，都实现了 InternetService 接口。

         ```java
         public class ChinaMobile implements InternetService {
           @Override
           public void connect() {
             System.out.println("connect internet by [China Mobile]");
           }
         }
         ```

         ```java
         public class BeijingChinaMobile implements InternetService {
           @Override
           public void connect() {
             System.out.println("connect internet by [Beijing China Mobile]");
           }
         }
         ```

   3. 在 resources/META-INF/services 目录下创建一个名为 InternetService 接口全限定类名的配置文件，文件内容为 ChinaMobile 和 BeijingChinaMobile 这两个 Service Provider 的全限定类名，存在多个 Service Provider 时多行表示。

         ```
         fun.xiaorang.study.java.core.spi.demo.service.impl.ChinaMobile
         fun.xiaorang.study.java.core.spi.demo.service.impl.BeijingChinaMobile
         ```

3. simple-isp-unicom 模块
   1. 同样依赖于 simple-api 模块；

      ```xml
      <dependencies>
        <dependency>
          <groupId>fun.xiaorang</groupId>
          <artifactId>simple-api</artifactId>
          <version>1.0-SNAPSHOT</version>
        </dependency>
      </dependencies>
      ```

   2. 定义 ChinaUnicom 类，实现了 InternetService 接口。

      ```java
      public class ChinaUnicom implements InternetService {
        @Override
        public void connect() {
          System.out.println("connect internet by [China Unicom]");
        }
      }
      ```

   3. 在 resources/META-INF/services 目录下创建一个名为 InternetService 接口全限定类名的配置文件，文件内容为 ChinaUnicom 这个 Service Provider 的全限定类名。

      ```
      fun.xiaorang.study.java.core.spi.demo.service.impl.ChinaUnicom
      ```

4. simple-company：使用 ServiceLoader 的 load() 方法发现并加载 InternetService 服务，面向 Service 接口编程！

   ```java
   public class ApiTest {
     @Test
     public void test() {
       final ServiceLoader<InternetService> serviceLoader = ServiceLoader.load(InternetService.class);
       serviceLoader.forEach(InternetService::connect);
     }
   }
   ```

测试：

1. simple-company 模块先只引入 simple-isp-mobile 模块，测试结果如下所示：
   ![](https://cdn.jsdelivr.net/gh/xihuanxiaorang/img2/202412151846021.png)
2. 然后将网络服务商替换成联通，也就是将依赖的模块换成 simple-isp-unicom，代码不需要做任何改动，测试结果如下所示：
   ![](https://cdn.jsdelivr.net/gh/xihuanxiaorang/img2/202412151846865.png)

## SPI & SpringBoot 自动配置

最后，让我们触类旁通，举一反三，以 SpringBoot 框架的自动配置为例，一起探讨一下 SPI 设计思想的发散和延伸。 SpringBoot 自动配置，即大名鼎鼎的 Auto-Configuration：

- 它是指基于你引入的依赖 jar 包，对 SpringBoot 应用进行自动配置
- 它提供了自动配置功能的依赖 jar 包，通常被称为 Starter，如官方的：spring-boot-starter-redis，非官方的：mybatis-spring-boot-starter 等等

SpringBoot 项目启动的时候默认会自动扫描当前项目的 package，然后将其中的配置类注入到 IoC 容器中。但是，当我们与其他框架进行集成的时候，如 mybatis、rabbitmq 框架等等，SpringBoot 是不支持直接扫描其他框架的 package 的，这个时候则需要使用 Auto-Configuration 机制，基于引入的依赖 jar 包对 SpringBoot 应用进行自动配置，换言之呢，就是将其他 jar 包的配置类注入到 IOC 容器中。

![[SpringBoot 自动配置.excalidraw| 900]]

> [!chat-bubble]+ OK！假设你是 SpringBoot 的开发人员，你会怎样实现 Auto-Configuration 机制呢？
>
> - 作为 Leader，我先提几点要求：首先，不能脱离 SpringBoot 框架，我可不想重复造轮子！
> + 完全同意。我们可以继续使用 @Configuration 等已有注解，然后将自动配置的类注入到 Spring 的 IoC 容器中。
> - 作为 Leader，我再提个问题，SpringBoot 框架默认是扫描当前项目的 package，那么如何将其他 jar 包中的配置类也注入到 IOC 容器中呢？
> + 让用户使用注解 @ComponentScan 来扫描第三方的 package 吧！
> - 听起来对用户很不友好啊！用户只想引入依赖的 jar 包就行。既然我们叫"自动配置"，那么能否实现全自动，而不要是半自动呢？
> + 让我想想，这个需求怎么听起来这么耳熟呢。。。要不我们参考参考 Java SPI 的设计思想？

![[Java SPI & SpringBoot 自动配置设计思想.excalidraw| 1500]]

以 [mybatis-spring-boot-autoconfigure](https://github.com/mybatis/spring-boot-starter/tree/master/mybatis-spring-boot-autoconfigure/src/main/java/org/mybatis/spring/boot/autoconfigure) 为例来分析一下 SpringBoot 自动配置：
![](https://cdn.jsdelivr.net/gh/xihuanxiaorang/img2/202412151907253.png)

由上图可知，在 mybatis-spring-boot-autoconfigure 中存在两个自动配置类，分别是 MybatisAutoConfiguration 和 MybatisLanguageDriverAutoConfiguration，然后在 resources 目录下的 META-INF 中确实存在一个 spring. factories 配置文件，里面的内容是 K = V 的格式，其中 KEY 是 EnableAutoConfiguration 的全限定类名，VALUE 则是两个自动配置类的全限定类名，两个类名之间用逗号隔开。

最后，简单总结一下 SpringBoot 自动配置的核心流程：

![[SpringBoot 自动配置核心流程.excalidraw | 1300]]

以上，就是 SpringBoot 自动配置的原理，它是不是和 SPI 的设计思想有着异曲同工之妙呢？
