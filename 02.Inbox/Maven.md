---
tags:
  - DevTool
  - EnvironmentSetup
  - Java
create_time: 2025-02-15 12:21
update_time: 2025/02/19 23:23
---

## 前期准备

| 工具       | 版本       |
| -------- | -------- |
| [[JDK]]  | 17       |
| [[IDEA]] | 2024.3.3 |

> [!important]
> **确保已配置 [[JDK#^a4ee2f|JAVA_HOME]] 环境变量**。

## 下载 & 安装

> [!important] 系统要求
>
> 1. **Java Development Kit (JDK)**：Maven 3.9+ 需要 JDK 8 或更高版本。
> 2. **内存**：无最低要求。
> 3. **磁盘**：大约需要 10MB 用于 Maven 本身的安装。除此之外，还需要使用磁盘空间来存储您的本地 Maven 仓库。本地仓库的大小会根据使用情况而变化，但至少需要 500MB。
> 4. **操作系统**：无最低要求。

访问[官方下载](https://maven.apache.org/download.cgi)，下载最新稳定免安装版 Maven（如 3.3.9）。
![](https://img.xiaorang.fun/202502161731136.png)

解压 Maven 至任意目录（如 `E:\devsoft\apache-maven-3.9.9`），目录结构如下：
![](https://img.xiaorang.fun/202502161732291.png)
- `bin`：包含可执行文件（如 `mvn`）。🚀🚀🚀
- `boot`：包含核心库和类文件。
- `conf`：包含核心配置文件（如 `settings.xml`）。🏷️🏷️🏷️
- `lib`：包含运行时所需的 Java 类库。

## 配置

### 环境变量配置

1. 右键点击 "计算机" 或 "此电脑"，选择 "属性"。
2. 点击 "高级系统设置"。
3. 在弹出的 "系统属性" 窗口中，点击 "环境变量"。
4. 在 "系统变量" 区域，点击 "新建"。
    1. 新建 <u>MAVEN_HOME</u> 系统变量，变量值为 Maven 的安装路径，如 `E:\devsoft\apache-maven-3.9.9`。
5. 配置 Path 系统变量。
    1. 在 "系统变量" 中找到 Path 变量，点击 "编辑"。
    2. 点击 "新建"，添加 `%MAVEN_HOME%\bin`，然后尽量将其 "上移"。
    3. 最后一路点击 "确定" 进行保存配置。

打开终端，运行 `mvn -v` 命令，应显示版本信息：
![](https://img.xiaorang.fun/202502161844788.png)

### 本地仓库地址配置

默认情况下，Maven 将依赖下载到 `~/.m2/repository` 目录。通过修改 `settings.xml` 配置文件中的 `<localRepository>` 标签，可以自定义本地仓库路径，如：`E:\devsoft\apache-maven-repository`。

```xml
<localRepository>E:\devsoft\apache-maven-repository</localRepository>
```

### 阿里云镜像配置

> [!quote]
> [阿里云云效Maven](https://developer.aliyun.com/mvn/guide)

在 `settings.xml` 文件中的 `<mirrors>` 标签下，添加如下 `mirror` 配置：

```xml
<mirror>
  <id>aliyunmaven</id>
  <mirrorOf>central</mirrorOf>
  <name>阿里云公共仓库</name>
  <url>https://maven.aliyun.com/repository/public</url>
</mirror>
```

- `<id>aliyunmaven</id>`：镜像的唯一标识符，用于区分不同的镜像。
- `<mirrorOf>central</mirrorOf>`：表示该镜像仅用于 Maven 的 `central` 仓库，即所有指向中央仓库的请求将被重定向到阿里云镜像。如此，Maven 将使用阿里云镜像来替代默认的中央仓库。
- `<name>阿里云公共仓库</name>`：镜像的名称，表示这是阿里云提供的公共 Maven 仓库。
- `<url>https://maven.aliyun.com/repository/public</url>`：阿里云公共仓库的 URL，Maven 会通过该地址访问阿里云镜像仓库下载依赖。

这段配置的目的是将 Maven 中央仓库的所有请求重定向到阿里云公共仓库，从而显著提高 Maven 构建过程中的依赖下载速度，减少因访问国外仓库带来的延迟和不稳定问题。

### 构建环境配置

> [!important]
> 使用 `<profile>` 标签可以为不同构建环境配置特定参数（如属性、仓库或插件）。这种方式可以灵活管理多环境构建，提升构建过程的可维护性和灵活性。

将以下 `profile` 配置添加至 `settings.xml` 文件中的 `<profiles>` 标签中：

```xml
<profile>
    <id>jdk-17</id>
    <activation>
      <activeByDefault>true</activeByDefault>
      <jdk>17</jdk>
    </activation>
    <properties>
      <maven.compiler.source>17</maven.compiler.source>
      <maven.compiler.target>17</maven.compiler.target>
      <maven.compiler.compilerVersion>17</maven.compiler.compilerVersion>
    </properties>
</profile>
```

- **`<id>jdk-17</id>`**：定义该 `profile` 的唯一标识符，用于命令行或配置中激活。
- **`<activation>`**：
	- **`<activeByDefault>true</activeByDefault>`**：该 `profile` 会默认激活，除非有冲突的配置。
	- **`<jdk>17</jdk>`**：仅在 JDK 版本为 17 时才会激活该 `profile`。
- **`<properties>`**：
	- **`<maven.compiler.source>17</maven.compiler.source>`**：设置编译源代码版本为 JDK 17。
	- **`<maven.compiler.target>17</maven.compiler.target>`**：确保生成的字节码符合 JDK 17 要求。这意味着，生成的字节码仅在 JDK 17 或更高版本中可运行。
	- **`<maven.compiler.compilerVersion>17</maven.compiler.compilerVersion>`**：明确使用 JDK 17 编译器进行代码编译，确保所有编译器特性都与 JDK 17 相兼容。

该 `profile` 配置的目的是确保在 JDK 17 环境下构建时，编译源代码和生成字节码时使用 JDK 17 的特性。

### 集成 IDEA 配置

- 打开 **File** ➡ **Settings**。
- 进入 **Build, Execution, Deployment** ➡ **Build Tools** ➡ **Maven**。
![](https://img.xiaorang.fun/202502171821053.png)

## 核心概念

### 仓库

在 Maven 中，**仓库**（Repository）用于存储和管理项目构建所需的各种构件（Artifacts），如库文件（Libraries）、插件（Plugins）以及项目打包后的输出（如 JAR、WAR 文件）。

分类：
- **本地仓库**：
    - 位于开发人员的本地计算机上，默认路径为 `~/.m2/repository`，可以通过[[#本地仓库地址配置|配置]]进行自定义。
    - 本地仓库用于缓存从远程仓库下载的依赖和项目的构建产物。这样可以避免每次构建时重复下载，提高构建速度。
- **远程仓库**：
    - 位于本地计算机之外，用于为本地仓库提供资源。
    - **分类**：
        - **中央仓库**：由 Maven 官方维护，存储大量开源构件，供全球开发者使用。
        - **私服**：公司或部门内部的仓库，存储自有或购买的资源，仅对内部开放。可以缓存中央仓库中的构件，以便本地使用。
	- 配置方式：
		- 在 `settings.xml` 中配置 `mirror` 节点，指定使用的远程仓库。如：[[#阿里云镜像配置]]
		- 在 `pom.xml` 中配置 `repository` 节点，指定项目的依赖来源。

工作流程：

- 在构建过程中，Maven 会首先检查本地仓库中是否已存在所需的构件。
	- 如果本地仓库中已存在，Maven 会直接使用该构件。
	- 如果本地仓库没有，Maven 会从远程仓库（如中央仓库）下载缺失的构件。下载完成后，构件会被缓存到本地仓库，以便下次构建时直接使用，避免重复下载。

通过仓库机制，Maven 能够高效地管理和共享项目依赖，确保构建过程的高效性、稳定性和一致性。

### 坐标

在 Maven 中，**坐标**（Coordinate）是用来唯一标识一个构件（artifact）的方式。每个构件都由以下几个关键部分组成，合起来形成一个唯一的坐标：
- **`groupId`**：
	- 唯一标识构件所属的组织或公司。
	- 通常采用该组织或公司官网的反向域名格式，例如 `org.apache.maven`、`org.apache.zookeeper` 和 `com.google.guava`。
- **`artifactId`**：
	- 构件的名称，用于唯一标识某个构件。
	- 每个 `groupId` 下可以有多个不同的 `artifactId`，例如 Apache 下有 `maven` 和 `zookeeper` 等不同项目。
	- 通常取值为项目或模块的名称。
- **`version`**：
	- 构件的版本号。
	- 格式通常为 **主版本号. 次版本号. 修订号**。
		- **主版本号**：表示重大更新，通常包括不兼容的 API 改动。
		- **次版本号**：表示向后兼容的功能增强或新增功能。
		- **修订号**：表示修复 bug 或进行小范围的改进，通常是向后兼容的。
	- 版本号还可以使用如 `SNAPSHOT` 或 `RELEASE` 来表示构件的发布状态。
- **`packaging`**（可选）：
	- 构件的类型，例如 `jar`、`war`、`pom` 等。
	- 如果未指定，默认值为 `jar`。

坐标（简称 GAV）在 Maven 中用于唯一标识一个构件。凭借这组坐标，Maven 可以准确地在中央仓库或指定仓库中查找和下载所需的构件，从而确保项目依赖的一致性和准确性。

### POM

**POM**：Project Object Model，项目对象模型。与 **DOM**（Document Object Model，文档对象模型）类似，都是模型化思想的具体体现。

POM 的核心体现在 Maven 项目根目录下的 **`pom.xml`** 配置文件中。该文件是 Maven 项目的核心配置文件，负责定义项目的基本信息、依赖关系、构建过程等。学习 Maven，实际上就是学习如何配置这个 `pom.xml` 文件并理解每个配置项的作用。

通过 `pom.xml`，Maven 能够管理项目的依赖、插件、构建生命周期等各个方面，确保项目在不同环境中的一致性和可维护性。其主要功能包括：

- **定义项目信息**：包括项目的名称、描述、版本、URL 等元数据。
- **依赖管理**：通过 `dependencies` 标签定义项目所需的依赖，Maven 会自动下载并管理这些依赖。
- **构建配置**：定义项目构建过程中所需的插件和目标（如编译、测试、打包等）。
- **生命周期管理**：通过 `build` 配置管理构建的顺序和任务。
- **继承与聚合**：支持父子关系和模块化构建，允许多模块项目统一管理和继承公共配置。

### 标准目录结构

> [!important]
> #### 约定大于配置，配置大于编码！

Maven 采用标准目录结构组织项目文件和资源，有助于提升项目的可维护性和可理解性，尤其在团队协作中。标准目录结构如下：

```bash
my-project/
 ├── src/
 │    ├── main/
 │    │    ├── java/                 # 项目的 Java 源代码
 │    │    ├── resources/            # 项目资源文件（如配置文件）
 │    │    ├── webapp/               # Web 项目的网页资源（如 JSP、HTML、CSS 等）
 │    ├── test/
 │    │    ├── java/                 # 测试代码
 │    │    ├── resources/            # 测试资源文件
 ├── target/                         # 编译和打包后的输出目录
 ├── pom.xml                         # Maven 项目的核心配置文件
```

- **`src/main/java/`**：存放项目的 Java 源代码，包含所有类文件。
- **`src/main/resources/`**：存放项目的资源文件（如配置文件、XML 文件等），这些文件会随构建过程一起打包。
- **`src/main/webapp/`**：仅适用于 Web 项目，存放网页资源（如 HTML、JSP、CSS、JS 等）。
- **`src/test/java/`**：存放项目的测试代码，Maven 用于执行单元测试。
- **`src/test/resources/`**：存放与测试相关的资源文件。
- **`target/`**：存放构建过程生成的文件，如 `.class` 文件、打包后的 `.jar` 或 `.war` 文件。每次执行 `mvn clean` 命令时，该目录会被清空。
- **`pom.xml`**：Maven 的核心配置文件，定义项目的依赖、构建插件、目标等。

> [!answer] 为什么遵循约定的目录结构？
> - **标准化**：统一的目录结构便于团队和第三方开发者理解项目布局，提升开发效率。
> - **自动化**：Maven 插件（如编译、测试、打包等）默认按照该结构执行任务，无需额外配置。
> - **清晰分离**：码、资源、测试和构建结果等内容明确分隔，便于管理和维护。

## 举个栗子

### 基于 IDEA 创建 Java 工程

通过 IDEA 创建一个 Java 工程，选择 **File** ➡ **New** ➡ **Project** ➡ **Java**。
![](https://img.xiaorang.fun/202502192252375.png)

项目目录结构与[[#标准目录结构]]一致，如下所示：
![](https://img.xiaorang.fun/202502192252376.png)

### 基于 IDEA 创建 Web 工程

通过 IDEA 创建一个 Web 工程，选择 **File** ➡ **New** ➡ **Project** ➡ **Maven Archetype**，后选择适合 Web 工程的 Maven 骨架/模板。
![](https://img.xiaorang.fun/202502192321479.png)

项目目录结构与[[#标准目录结构]]一致，如下所示：
![[Pasted image 20250219232347.png]]
