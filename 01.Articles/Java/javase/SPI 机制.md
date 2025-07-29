---
tags:
  - Java/JavaSE
create_time: 2024/12/14 19:01
update_time: 2025/07/29 19:27
---

## 简介

**SPI（Service Provider Interface）** 是 Java 自 6 开始引入的一种**基于 `ClassLoader` 的服务发现与加载机制**，**通过标准化配置实现运行时动态加载服务实现**。

SPI 主要由以下三部分组成：

- **Service**：服务接口，定义服务规范；
- **Service Provider**：服务提供者，接口实现类，提供具体服务；；
- **ServiceLoader**：**负责在运行时根据配置动态加载服务实现**，实现模块间解耦。

该机制提升了模块间的解耦性与扩展性，使程序**无需修改代码即可动态切换或扩展实现**。

运行流程如下：

![[Java SPI 运行流程| 800]]

应用程序**通过调用 `ServiceLoader.load()` 方法，可在运行时动态加载指定接口的所有实现类**。这些实现类可能来自多个第三方 Jar 包，**ServiceLoader 会将它们统一封装为接口实例返回**，应用程序**只需面向接口编程，无需关心具体实现**。

## 三项规范

### 配置文件规范

SPI 通过配置文件声明服务接口的实现类，规范如下：

1. **路径**：必须位于 Jar 包内的 `META-INF/services` 目录；
2. **名称**：必须为接口的全限定类名；
3. **内容**：每行一个实现类的全限定类名，支持多个实现。

以 MySQL 驱动为例，在 `mysql-connector-java` 的 Jar 包中，存在如下配置：

- 路径：`META-INF/services`
- 名称：`java.sql.Driver`
- 内容：`com.mysql.cj.jdbc.Driver`

![](https://img.xiaorang.fun/202502251814555.png)

### 实现类必须提供无参构造方法

由于 SPI 通过[[反射]]（如 `Class.forName()`）创建服务实例，因此要求**实现类必须提供无参构造方法**：

```java hl:2-4
public class Driver extends NonRegisteringDriver implements java.sql.Driver {  
  public Driver () throws SQLException {  
    // 无参构造方法  
  }  
}
```

### 保证配置文件和实现类可被加载

为确保 SPI 正常工作，配置文件及实现类必须被正确加载，常见方式包括：

- ✅ 将服务实现类所在的 Jar 包添加到项目的 classpath；
- ❌ 安装到 JRE 的扩展目录；
- ❌ 通过自定义 `ClassLoader` 手动加载。

以 MySQL 驱动为例，只需通过 Maven 引入依赖，[[JDBC]] 即可自动完成驱动加载：

```xml
<dependency>  
  <groupId>mysql</groupId>  
  <artifactId>mysql-connector-java</artifactId>  
  <version>8.0.28</version>  
</dependency>
```

## 举个简单的栗子：运营商联网服务

**应用场景**：公司 A 需接入互联网，定义了统一的联网接口。中国移动与中国联通作为服务提供者，分别实现该接口。

### 模块划分

- `simple-api`：定义联网接口（SPI 中的 Service）；
- `simple-company`：调用接口的业务模块；
- `simple-isp-mobile` / `simple-isp-unicom`：实现接口的服务提供方模块（Service Provider）。

![[Java SPI 机制栗子| 800]]

模块间调用关系如下：

![[Java SPI 机制栗子架构图| 700]]

### 定义 Service 接口（simple-api）

```java
public interface InternetService {
	/**
	* 连接网络
	*/
	void connect();
}
```

### 提供移动实现（simple-isp-mobile）

1. 引入 `simple-api` 模块；

	```xml
	<dependencies>
		<dependency>
			<groupId>fun.xiaorang</groupId>
			<artifactId>simple-api</artifactId>
			<version>1.0-SNAPSHOT</version>
		</dependency>
	</dependencies>
	```

2. 实现两个服务提供类；

	```java
	public class ChinaMobile implements InternetService {
		@Override
		public void connect () {
			System.out.println ("connect internet by [China Mobile]");
		}
	}
	```

	```java
	public class BeijingChinaMobile implements InternetService {
		@Override
		public void connect () {
			System.out.println ("connect internet by [Beijing China Mobile]");
		}
	}
	```

3. 配置文件 `resources/META-INF/services/fun.xiaorang.study.java.core.spi.demo.service.InternetService`

	```text
	fun.xiaorang.study.java.core.spi.demo.service.impl.ChinaMobile
	fun.xiaorang.study.java.core.spi.demo.service.impl.BeijingChinaMobile
	```

### 提供联通实现

1. 引入 `simple-api` 依赖；

	```xml
	<dependencies>
		<dependency>
			<groupId>fun.xiaorang</groupId>
			<artifactId>simple-api</artifactId>
			<version>1.0-SNAPSHOT</version>
		</dependency>
	</dependencies>
	```

2. 实现一个服务提供类：

	```java
	public class ChinaUnicom implements InternetService {
		@Override
		public void connect() {
			System.out.println("connect internet by [China Unicom]");
		}
	}
	```

3. 配置文件 `resources/META-INF/services/fun.xiaorang.study.java.core.spi.demo.service.InternetService`

	```text
	fun.xiaorang.study.java.core.spi.demo.service.impl.ChinaUnicom
	```

### 客户端使用 ServiceLoader 加载服务（simple-company）

```java hl:4-5
public class ApiTest {
	@Test
	public void test() {
		final ServiceLoader<InternetService> serviceLoader = ServiceLoader.load(InternetService.class);
		serviceLoader.forEach(InternetService::connect);
	}
}
```

### 测试效果

1. `simple-company` 模块只引入 `simple-isp-mobile` 模块：
   ![](https://img.xiaorang.fun/202502251814556.png)
2. 替换为 `simple-isp-unicom` 模块，无需修改任何代码：
   ![](https://img.xiaorang.fun/202502251814557.png)

## 在 JDBC 中的应用

![[JDBC#JDBC 的自动加载机制（基于 SPI）]]

## SPI 思想的延伸：SpringBoot 自动配置机制

SpringBoot 的**自动配置（Auto-Configuration）** 实质上是 SPI 思想在 Spring 体系内的延伸，用于**在引入依赖后自动完成相关配置**。具备该能力的依赖被称为 **Starter**，如官方的 `spring-boot-starter-redis`，或第三方的 `mybatis-spring-boot-starter`。

### 为什么需要自动配置？

SpringBoot 启动时**默认只会扫描当前项目的包结构，并将其中的配置类注入 IoC 容器**。但对于第三方框架（如 MyBatis、RabbitMQ）来说，其配置类通常位于外部 Jar 包中，SpringBoot 无法自动识别并加载这些类。此时就需要借助**自动配置机制**，让 SpringBoot 在引入相关依赖后，**自动将外部 Jar 包中的配置类注册进容器**，从而实现真正的"开箱即用"。

![[SpringBoot 自动配置| 900]]

### 思考：如果让你来设计 Auto-Configuration，你会怎么做？

> [!chat-bubble]+ 💬 假设你是 SpringBoot 的开发人员，现在需要实现自动配置机制：
>
> - 👨‍💼 Leader：不能脱离 SpringBoot 原有体系，别重复造轮子！
> - 👨‍💻 没问题，我们可以继续使用 `@Configuration` 注解，让配置类注入到 IoC 容器中。
> - 👨‍💼 Leader：可 SpringBoot 默认只扫描主项目包，外部依赖中的配置类怎么注入？
> - 👨‍💻 要不让用户加个 `@ComponentScan` 注解，手动指定要扫描的包路径？
> - 👨‍💼 Leader：那就不是"自动"配置了，用户还得操心！
> - 👨‍💻 嗯……要不我们参考一下 Java 的 SPI 机制，用配置文件指定要加载的类？

![[Java SPI & SpringBoot 自动配置设计思想| 1500]]

### 实例：MyBatis Starter 的自动配置实现

以 [`mybatis-spring-boot-autoconfigure`](https://github.com/mybatis/spring-boot-starter/tree/master/mybatis-spring-boot-autoconfigure) 为例分析一下 SpringBoot 的自动配置机制。
![](https://img.xiaorang.fun/202502251814558.png)

在该模块中：

- 提供了两个自动配置类：`MybatisAutoConfiguration` 和 `MybatisLanguageDriverAutoConfiguration`
- 在 `resources/META-INF/spring.factories` 文件中，按照 SpringBoot 的[[#配置文件规范|约定]]配置自动加载清单：

	```text
	org.springframework.boot.autoconfigure.EnableAutoConfiguration=\
	org.mybatis.spring.boot.autoconfigure.MybatisAutoConfiguration,\
	org.mybatis.spring.boot.autoconfigure.MybatisLanguageDriverAutoConfiguration
	```

	上述配置的含义是：
	- `K`：`EnableAutoConfiguration`
	- `V`：MyBatis 两个自动配置类的全限定类名
	- 在 SpringBoot 启动过程中，框架会扫描 `spring.factories` 文件，并根据该映射关系自动加载这两个配置类

### 总结：SpringBoot 自动配置机制的核心流程

![[SpringBoot 自动配置核心流程| 1300]]

本质上，Spring Boot 借鉴了 Java SPI 的设计思想，通过类似的机制，**将外部依赖中的配置类自动注册到 IoC 容器中**，实现模块之间的解耦与功能的自动扩展。这两者的核心思路高度一致，都是通过**约定好的配置文件 + 类加载器**，**在运行时动态加载并注入需要的组件**。
