---
tags:
  - DevKit
  - Java
update_time: 2025/03/12 11:42
create_time: 2025-02-28T18:46:00
---

> [!quote]
> 官方文档地址：[MapStruct – Java bean mappings, the easy way!](https://mapstruct.org/)

## 介绍

### What is it?

MapStruct 是一个代码生成器，采用 **约定大于配置** 的方式，大幅简化 Java Bean 之间的映射。生成的代码使用普通方法调用，无需反射，因此 **快速、类型安全、易读**。

### Why?

多层应用程序需要在不同对象模型（如实体与 DTO）间转换，手写映射代码繁琐且易出错。MapStruct 通过 **编译时生成** 映射代码，提高性能，并提供完整的错误检查。

### How?

MapStruct 是 Java 注解处理器，可用于 **Maven、Gradle** 及 IDE。它提供合理的默认设置，同时允许开发者灵活配置。

### Features

MapStruct **基于注解定义映射器接口**，编译时自动生成实现类。其特点：
- **无反射**，仅普通方法调用，提高执行速度；
- **编译时类型安全**，防止错误映射；
- **构建时错误报告**，如：
    - 目标属性未映射；
    - 找不到正确的映射方法。

## 设置

MapStruct 是基于 JSR269 规范的 Java 注解处理器，因此可以在命令行构建（javac，Ant，Maven 等）以及 IDE 中使用。

它包含以下组件:

- `org.mapstruct`: 包含所需的注解，如 `@Mapping`；
- `org.mapstruct:mapstruct-processor`: 包含生成映射器实现的注解处理器；

### 依赖

对于 Maven 项目，如果想使用 MapStruct 的话，需要添加如下内容至 `pom.xml` 配置文件中：

```xml hl:2,6-11,23-30
<properties>
  <org.mapstruct.version>1.6.3</org.mapstruct.version>
</properties>
...
<dependencies>
  <dependency>
    <groupId>org.mapstruct</groupId>
    <artifactId>mapstruct</artifactId>
    <version>${org.mapstruct.version}</version>
    <scope>provided</scope>
  </dependency>
</dependencies>
...
<build>
  <plugins>
    <plugin>
      <groupId>org.apache.maven.plugins</groupId>
      <artifactId>maven-compiler-plugin</artifactId>
      <version>3.8.1</version>
      <configuration>
        <source>1.8</source> <!-- depending on your project -->
        <target>1.8</target> <!-- depending on your project -->
        <annotationProcessorPaths>
          <path>
            <groupId>org.mapstruct</groupId>
            <artifactId>mapstruct-processor</artifactId>
            <version>${org.mapstruct.version}</version>
          </path>
          <!-- other annotation processors -->
        </annotationProcessorPaths>
      </configuration>
    </plugin>
  </plugins>
</build>
```

### 编译选项

MapStruct 代码生成器可以使用注解处理器选项进行配置。

当直接调用 javac 时，这些选项以 `-Akey=value` 的形式传递给编译器。当通过 Maven 使用 MapStruct 时，任何处理器选项都可以通过在 Maven 处理器插件的配置中使用 `compilerArgs` 进行传递，如下所示：

```xml hl:18-28
...
<plugin>
  <groupId>org.apache.maven.plugins</groupId>
  <artifactId>maven-compiler-plugin</artifactId>
  <version>3.8.1</version>
  <configuration>
    <source>1.8</source> <!-- depending on your project -->
    <target>1.8</target> <!-- depending on your project -->
    <annotationProcessorPaths>
      <path>
        <groupId>org.mapstruct</groupId>
        <artifactId>mapstruct-processor</artifactId>
        <version>${org.mapstruct.version}</version>
      </path>
    </annotationProcessorPaths>
    <!-- due to problem in maven-compiler-plugin, for verbose mode add showWarnings -->
    <showWarnings>true</showWarnings>
    <compilerArgs>
      <arg>
        -Amapstruct.suppressGeneratorTimestamp=true
      </arg>
      <arg>
        -Amapstruct.suppressGeneratorVersionInfoComment=true
      </arg>
      <arg>
        -Amapstruct.verbose=true
      </arg>
    </compilerArgs>
  </configuration>
</plugin>
...
```

列举常用选项：

- `defaultComponentModel`，其常用的可选值有： ^d4dc33
  - `default`：映射器不使用组件模型，通常通过 `Mappers#getMapper(Class)` 检索实例；
  - `spring`：生成的映射器是一个单例的 Spring Bean，可以通过 `@Autowired` 注解检索；
  - 至于其他的 `cdi`、`jsr330` 等选项值请自行参考文档 https://mapstruct.org/documentation/stable/reference/html/#configuration-options
- `defaultInjectionStrategy`：用于指定映射器（Mapper）中默认的依赖注入方式，该配置仅适用于基于注解的组件模型，例如 CDI（Contexts and Dependency Injection）、Spring 和 JSR 330。存在如下两个可选值： ^e705d4
  - `field`（默认值）：使用字段注入依赖。在生成的映射类中，依赖的目标对象通常作为字段声明，并在映射方法之前通过字段注入进行初始化。
  - `constructor`：使用构造函数注入依赖。在这种策略下，生成的映射类会创建构造函数，该构造函数将依赖的目标对象作为参数，通过构造函数注入来初始化依赖。

### 与 Lombok 一起使用

MapStruct 从 1.2.0. Beta1 版本开始可以与 Lombok 1.16.14 及更高版本一起使用。MapStruct 会自动利用 Lombok 生成的 getter、setter 方法和构造函数，并在生成映射器时使用它们，从而减少手动编写代码的工作，让你的代码更简洁和易于维护，这两个工具的组合可以极大地提高开发效率。

Lombok 在 1.18.16 版本中引入了一个重大变化，**需要添加一个额外的注解处理器 `lombok-mapstruct-binding`（适用于 Maven 项目）**，否则的话 MapStruct 将无法与 Lombok 一起正常工作。这个注解处理器的作用是用来解决 Lombok 和 MapStruct 模块之间的编译问题。通过添加它，可以确保 Lombok 和 MapStruct 在项目中协同工作，并避免潜在的编译问题。

完整配置如下所示：

```xml hl:3,15-21,39-49
<properties>
  <org.mapstruct.version>1.6.3</org.mapstruct.version>
  <org.projectlombok.version>1.18.16</org.projectlombok.version>
  <maven.compiler.source>8</maven.compiler.source>
  <maven.compiler.target>8</maven.compiler.target>
</properties>

<dependencies>
  <dependency>
    <groupId>org.mapstruct</groupId>
    <artifactId>mapstruct</artifactId>
    <version>${org.mapstruct.version}</version>
    <scope>provided</scope>
  </dependency>
  <!-- lombok dependency should not end up on classpath -->
  <dependency>
    <groupId>org.projectlombok</groupId>
    <artifactId>lombok</artifactId>
    <version>${org.projectlombok.version}</version>
    <scope>provided</scope>
  </dependency>
</dependencies>

<build>
  <plugins>
    <plugin>
      <groupId>org.apache.maven.plugins</groupId>
      <artifactId>maven-compiler-plugin</artifactId>
      <version>3.8.1</version>
      <configuration>
        <source>1.8</source> <!-- depending on your project -->
        <target>1.8</target> <!-- depending on your project -->
        <annotationProcessorPaths>
          <path>
            <groupId>org.mapstruct</groupId>
            <artifactId>mapstruct-processor</artifactId>
            <version>${org.mapstruct.version}</version>
          </path>
          <path>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <version>${org.projectlombok.version}</version>
          </path>
          <!-- additional annotation processor required as of Lombok 1.18.16 -->
          <path>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok-mapstruct-binding</artifactId>
            <version>0.2.0</version>
          </path>
        </annotationProcessorPaths>
        <!-- due to problem in maven-compiler-plugin, for verbose mode add showWarnings -->
        <showWarnings>true</showWarnings>
        <compilerArgs>
          <arg>
            -Amapstruct.defaultComponentModel=default
          </arg>
          <arg>
            -Amapstruct.defaultInjectionStrategy=constructor
          </arg>
        </compilerArgs>
      </configuration>
    </plugin>
  </plugins>
</build>
```

### IDE 支持

> [!quote]
> [IDE Support – MapStruct](https://mapstruct.org/documentation/ide-support/)

以 IntelliJ IDEA 为例，安装 [MapStruct Support - IntelliJ IDEs Plugin | Marketplace (jetbrains.com)](https://plugins.jetbrains.com/plugin/10036-mapstruct-support) 插件，该插件具备如下[特性](https://github.com/mapstruct/mapstruct-idea#features)：

- 代码补全
  ![](https://img.xiaorang.fun/202502281859583.gif)
- 转到声明
  ![](https://img.xiaorang.fun/202502281900241.gif)
- 查找用法
  ![](https://img.xiaorang.fun/202502281900562.png)
- 高亮显示
- 快速修复

## 快速入门

下面演示如何使用 MapStruct 映射两个对象。

### 实体类和 DTO

假设咱们有一个代表汽车的类（例如，JPA 实体）和一个附带的数据传输对象（DTO）。

```java
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Car {
  private String make;
  private int numberOfSeats;
  private CarType type;

  public enum CarType {
    SEDAN, HATCHBACK, SUV
  }
}
```

```java
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CarDTO {
  private String make;
  private int seatCount;
  private String type;
}
```

这两种类型非常相似，只是座位数属性具有不同的名称，并且 `type` 属性在 `Car` 类中是一个特殊的枚举类型，但在 `CarDTO` 中是一个普通字符串。

### 映射器接口

> [!tip]
> 在实际项目中，建议使用 `Convert` 作为后缀，并将其放入 `convert` 包下，以避免与 MyBatis 的 `Mapper` 产生歧义。

为了生成一个映射器用于将 `Car` 对象转换为 `CarDTO` 对象，需要定义一个映射器接口，如下所示：

```java
@Mapper
public interface CarMapper {
  CarMapper INSTANCE = Mappers.getMapper(CarMapper.class);

  @Mapping(source = "numberOfSeats", target = "seatCount")
  CarDTO carToCarDTO(Car car);
}
```

- `@Mapper` 注解将接口标记为映射接口，并让 MapStruct 处理器在编译期间启动。
- 实际映射方法需要源对象作为参数并返回目标对象。其名称可以自由选择。
- 对于源对象和目标对象中名称不同的属性，可以使用 `@Mapping` 注解来配置它们之间的映射关系。
- 在必要且可行的情况下，将对源和目标中具有不同类型的属性执行类型转换，例如，将 `type` 属性从枚举类型转换为字符串。
- 一个接口中可以有多个映射方法，MapStruct 将为所有映射方法生成对应的实现。
- 可以从 `Mappers` 类中获取接口实现的实例。按照约定，接口通常声明成一个名为 `INSTANCE` 的成员，以便客户端可以访问映射器的实现。

由 MapStruct 生成的 `carToCarDTO()` 方法实现：

```java
// GENERATED CODE
/*
@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-03-09T23:23:23+0800",
    comments = "version: 1.6.3, compiler: javac, environment: Java 17.0.13 (Amazon.com Inc.)"
)
*/
public class CarMapperImpl implements CarMapper {

  @Override
  public CarDTO carToCarDTO(Car car) {
    if ( car == null ) {
      return null;
    }

    CarDTO carDTO = new CarDTO();

    carDTO.setSeatCount( car.getNumberOfSeats() );
    carDTO.setMake( car.getMake() );
    if ( car.getType() != null ) {
      carDTO.setType( car.getType().name() );
    }

    return carDTO;
  }
}
```

### 使用映射器

基于映射器接口，客户端可以以一种非常简单且类型安全的方式执行对象映射。如下所示：

```java
class CarMapperTest {
  @Test
  public void shouldMapCarToCarDTO() {
    // given
    final Car car = new Car("Morris", 5, Car.CarType.SEDAN);

    // when
    final CarDTO carDTO = CarMapper.INSTANCE.carToCarDTO(car);

    // then
    assertNotNull(carDTO);
    assertEquals("Morris", carDTO.getMake());
    assertEquals(5, carDTO.getSeatCount());
    assertEquals("SEDAN", carDTO.getType());
  }
}
```

## 定义映射器

在本节中，你将学习如何使用 MapStruct 定义一个 Bean 映射器以及必须使用哪些选项来执行此操作。

### 基本映射

要创建一个映射器，只需定义一个具有所需映射方法的 Java 接口，并使用 `@Mapper` 注解进行标注：

```java
@Mapper
public interface CarMapper {
  @Mapping(target = "manufacturer", source = "make")
  @Mapping(target = "seatCount", source = "numberOfSeats")
  CarDTO carToCarDTO(Car car);
}
```

`@Mapper` 注解会在构建时触发 MapStruct 生成 `CarMapper` 接口的实现。

在生成的方法中，源类型（如 `Car`）的所有可读属性都会复制到目标类型（如 `CarDTO`）的对应属性中：

- **同名属性会自动映射**。
- **若名称不同，使用 `@Mapping` 注解指定映射关系**。

以下是由 MapStruct 生成的 `carToCarDTO()` 方法实现：

```java
// GENERATED CODE
public class CarMapperImpl implements CarMapper {

  @Override
  public CarDTO carToCarDTO(Car car) {
    if ( car == null ) {
      return null;
    }

    CarDTO carDTO = new CarDTO();

    if ( car.getFeatures() != null ) {
      carDTO.setFeatures( new ArrayList<String>( car.getFeatures() ) );
    }
    carDTO.setManufacturer( car.getMake() );
    carDTO.setSeatCount( car.getNumberOfSeats() );
    carDTO.setDriver( personToPersonDTO( car.getDriver() ) );
    carDTO.setPrice( String.valueOf( car.getPrice() ) );
    if ( car.getCategory() != null ) {
      carDTO.setCategory( car.getCategory().toString() );
    }
    carDTO.setEngine( engineToEngineDTO( car.getEngine() ) );

    return carDTO;
  }
}
```

MapStruct 的基本原理是生成的代码尽可能接近手写代码，不使用反射，而是通过普通的 getter/setter 调用完成数据复制。

### 添加自定义映射方法

有时，某些类型转换**无法由 MapStruct 自动生成**，需要手动实现映射逻辑。可以通过以下两种方式添加自定义映射方法：

1. **在单独的类中实现自定义方法**，然后让 MapStruct 使用它。
2. **在映射器接口中定义默认方法**（Java 8+），MapStruct 会自动调用这些方法。

手动实现 `Person` 到 `PersonDTO` 的映射方法：

```java hl:8-10
@Mapper
public interface CarMapper {
  CarMapper INSTANCE = Mappers.getMapper(CarMapper.class);

  @Mapping(source = "numberOfSeats", target = "seatCount")
  CarDTO carToCarDTO(Car car);

  default PersonDTO personToPersonDTO(Person person) {
    //手写映射逻辑
  }
}
```

在 `carToCarDTO()` 方法中，MapStruct 会自动调用你手动实现的 `personToPersonDTO()` 方法，以确保 `driver` 属性得到正确的映射。

### 使用抽象类代替接口

定义映射器时，可以**使用抽象类代替接口**。这样可以**直接编写自定义方法，并在映射器中声明额外字段**。MapStruct 会自动生成一个继承该抽象类的实现类，**既能手写逻辑，又能利用 MapStruct 的自动生成功能**。与接口中的默认方法相比，抽象类允许定义字段，在映射过程中使用。

可以将上面的栗子改成如下所示：

```java
@Mapper
public abstract class CarMapper {

  @Mapping(...)
  public abstract CarDTO carToCarDTO(Car car);

  public PersonDTO personToPersonDTO(Person person) {
    //手写映射逻辑
  }
}
```

MapStruct 会生成 `CarMapper` 的子类，并重写 `carToCarDTO()` 抽象方法。当映射 `driver` 属性时，会自动调用你手动实现的 `personToPersonDTO()` 方法处理转换。

### 具有多个源参数的映射方法

MapStruct 支持带有**多个源参数**的映射方法，适用于**合并多个实体对象到一个数据传输对象（DTO）**。

#### 多个源参数的映射方法

```java
@Mapper
public interface AddressMapper {
  @Mapping(target = "description", source = "person.description")
  @Mapping(target = "houseNumber", source = "address.houseNo")
  DeliveryAddressDTO personAndAddressToDeliveryAddressDTO(Person person, Address address);
}
```

- 该方法接受两个源参数：`Person person` 和 `Address address`。
- 目标对象 `DeliveryAddressDTO` 是这两个源对象的组合。
- **同名属性自动映射**，无需额外注解。

如果**多个源对象中有相同名称的属性**时，则必须使用 `@Mapping` 注解明确指定**从哪个源参数获取该属性**。否则，MapStruct **无法自动推断**，会抛出错误。如果某个属性**只在某一个源对象中存在**，那么 `@Mapping` 注解可以省略，MapStruct 会自动识别。

> [!warning]
> - **只要使用 `@Mapping` 注解就必须明确指定 `source` 参数**。
> - **所有源参数都为 `null` 时则映射方法返回 `null`**，只要有一个源参数不为 `null` 则会创建目标对象并填充可用属性。

#### 直接引用非 Bean 类型的参数

```java
@Mapper
public interface AddressMapper {
  @Mapping(target = "description", source = "person.description")
  @Mapping(target = "houseNumber", source = "hn")
  DeliveryAddressDTO personAndAddressToDeliveryAddressDTO(Person person, Integer hn);
}
```

在该示例中，`hn` 参数不是 `Address` 对象，而是一个**独立的整数类型参数**，但它仍然可以直接映射到目标对象的 `houseNumber` 属性。说明 MapStruct **不仅支持 Bean 类型（如 `Person`、`Address`），也支持基本数据类型（如 `Integer`）作为源参数**。

### 将嵌套对象的属性映射到目标对象

如果不想手动列出嵌套对象所有的属性，可以使用 `.` 作为 `target`。这样，MapStruct 会**自动将源对象的所有属性映射到目标对象**，无需逐个指定。

```java
@Mapper
public interface CustomerMapper {
  @Mapping( target = "name", source = "record.name" )
  @Mapping( target = ".", source = "record" )
  @Mapping( target = ".", source = "account" )
  Customer customerDTOToCustomer(CustomerDTO customerDTO);
}
```

在生成的代码中：

- `CustomerDTO.record` 中的所有属性会直接映射到 `Customer`，不需要手动列出每个属性。
- `CustomerDTO.account` 中的所有属性也会直接映射到 `Customer`。
- 由于 `record` 和 `account` **可能存在相同属性**（如 `name`），可以使用 `@Mapping(target = "name", source = "record.name")` **显式指定来源**，解决冲突。

适用场景：
- **层级结构对象映射为扁平结构对象**（如 `CustomerDTO` → `Customer`）。
- **反向映射**时使用 `@InheritInverseConfiguration` 注解可减少重复代码。

> [!info]- 何为反向映射？
> `@InheritInverseConfiguration` 注解主要用于**反向映射**，即从 DTO 映射回实体（或反向操作）。当一个映射方法已经定义了 `@Mapping` 规则，可以使用 `@InheritInverseConfiguration` **自动继承**这些规则，避免重复书写相反方向的映射逻辑。
>
> ```java
> @Mapper
> public interface CustomerMapper {
> 
> @Mapping(target = "name", source = "record.name") 
> @Mapping(target = ".", source = "record") 
> @Mapping(target = ".", source = "account") 
> Customer customerDTOToCustomer(CustomerDTO customerDTO);
> 
> @InheritInverseConfiguration
> CustomerDTO customerToCustomerDTO(Customer customer);
> }
> ```
>
> ### **如何工作**
>
> 1. **`customerDTOToCustomer ()`** 方法：
>    - `record. name` → `Customer. name`
>    - `record` 的所有属性 → `Customer`
>    - `account` 的所有属性 → `Customer`
> 2. **`customerToCustomerDTO ()`** 方法：
>    - 不需要显式声明映射规则，因为 `@InheritInverseConfiguration` 注解会自动反向应用 `customerDTOToCustomer ()` 的映射规则：
>      - `Customer. name` → `record. name`
>      - `Customer` 的所有属性 → `record`
>      - `Customer` 的所有属性 → `account`
>
> ### **作用**
>
> - **避免重复代码**，只需定义一次映射规则，反向映射自动继承。
> - **保持一致性**，不会因为手动编写反向规则而导致映射错误。
>
>
>
> 适用于**双向转换**的场景，如：
>
> - **DTO ↔️ 实体**
> - **请求对象 ↔️ 数据库对象**

### 更新现有 Bean 实例

有时，我们希望**更新现有的目标对象**，而不是创建一个新的实例。这可以通过**在方法参数中添加目标对象，并使用 `@MappingTarget` 进行标注**来实现。

```java
@Mapper
public interface CarMapper {
  void updateCarFromDTO(CarDTO carDTO, @MappingTarget Car car);
}
```

- 该方法不会返回新对象，而是**直接修改传入的 `Car` 实例**，用 `CarDTO` 的属性更新它。
- **`@MappingTarget` 只能标注一个参数**，即需要更新的对象。
- **方法返回值可以是 `void`**，也可以**返回 `Car`**，这样可以支持**链式调用**。

更新目标对象时，`CollectionMappingStrategy` 决定**如何处理集合或 Map 类型的属性**：

1. **`ACCESSOR_ONLY`（默认策略）**
    - **清空目标集合**，然后用源对象的集合填充。
2. **`ADDER_PREFERRED` 或 `TARGET_IMMUTABLE`**
    - **不清空目标集合**，而是直接添加新值。

### 直接字段访问映射

MapStruct 允许直接映射那些没有 getter/setter 方法的 `public` 字段。当 MapStruct 无法找到适合某个属性的 getter/setter 方法时，它将使用字段本身作为读/写访问器。

- **读取访问器（read accessor）**：
	- ✅被 `public` / `pubilc final` 修饰的字段才被视为读取访问器。
	- ❌被 `static` 修饰的字段不被视为读取访问器。
- **写入访问器（write accessor）**：
	- ✅被 `public` 修饰的字段才被视为写入访问器。
	- ❌被 `final` / `static` 修饰的字段不被视为写入访问器。

举个栗子：

```java
public class Customer {
  private Long id;
  private String name;

  //省略 getter/setter
}

public class CustomerDTO {
  public Long id;
  public String customerName;
}

@Mapper
public interface CustomerMapper {
  CustomerMapper INSTANCE = Mappers.getMapper(CustomerMapper.class);

  @Mapping(target = "name", source = "customerName")
  Customer toCustomer(CustomerDTO customerDTO);

  @InheritInverseConfiguration
  CustomerDTO fromCustomer(Customer customer);
}
```

对于上述例子，生成的映射器代码实现：

```java
// GENERATED CODE
public class CustomerMapperImpl implements CustomerMapper {

  @Override
  public Customer toCustomer(CustomerDTO customerDTO) {
    // ...
    customer.setId(customerDTO.id);
    customer.setName(customerDTO.customerName);
    // ...
  }

  @Override
  public CustomerDTO fromCustomer(Customer customer) {
    // ...
    customerDTO.id = customer.getId();
    customerDTO.customerName = customer.getName();
    // ...
  }
}
```

在这个例子中，`CustomerDTO` 中的 `id` 和 `customerName` 字段将直接映射到 `Customer` 对象的相应字段。生成的映射代码将直接访问这些字段，无需通过 getter/setter 方法。

### 使用构建器（Builder）

MapStruct **支持使用构建器映射不可变对象**。在映射过程中，MapStruct 会检查目标类型是否有可用的构建器，并通过 `BuilderProvider`（[[04  - SPI 机制|SPI]]）自动选择合适的构建器。

默认 `BuilderProvider` 认为一个类具备构建器需要满足以下条件：
- **该类中有一个无参的公共静态构建器创建方法，该方法返回一个构建器实例。** 例如，`Person` 类中有一个返回 `PersonBuilder` 实例的公共静态方法。
- **构建器类中有一个无参的公共方法（构建方法），该方法返回正在构建的类型实例。** 例如，`PersonBuilder` 类中有一个返回 `Person` 实例的方法。
- 如果存在多个构建方法，MapStruct 将寻找名为 `build` 的方法，如果存在这样的方法，则将使用它，否则会产生编译错误。
- 可以在 `@BeanMapping`、`@Mapper` 或 `@MapperConfig` 注解中使用 `@Builder` 来指定构建方法。
- 如果存在多个满足上述条件的构建器创建方法，`DefaultBuilderProvider`（[[04  - SPI 机制|SPI]]）会抛出 `MoreThanOneBuilderCreationMethodException` 异常，并记录编译警告，同时不会使用任何构建器。

如果满足条件，MapStruct 会调用构建器的 setter 方法（或类似的方法）进行属性映射，并最终调用 `build ()` 方法创建对象实例。

> [!tip]
> 可以通过 `@Builder #disableBuilder ` 关闭构建器支持。禁用后，MapStruct 将回退到标准的 getter/setter 方式进行映射。

> [!tip]
> 构建器类型也可以通过 **对象工厂（Object Factory）** 进行管理。例如，如果 `PersonBuilder` 具有对应的对象工厂，MapStruct 会**优先使用工厂创建 `PersonBuilder` 实例，而不是直接调用 `Person. builder ()` 方法。**

> [!warning]
> 此外，构建器的使用会影响 `@BeforeMapping` 和 `@AfterMapping` 方法的行为。详情请参考[[#使用映射前和映射后方法进行映射定制]]。

举个栗子：

```java hl:9-11,22-24
public class Person {
=
  private final String name;

  protected Person(Person.Builder builder) {
    this.name = builder.name;
  }

  public static Person.Builder builder() {
    return new Person.Builder();
  }

  public static class Builder {

    private String name;

    public Builder name(String name) {
      this.name = name;
      return this;
    }

    public Person build() {
      return new Person(this);
    }
  }
}
```

```java
public interface PersonMapper {
  Person map(PersonDTO dto);
}
```

使用构建器生成的映射器代码实现：

```java
// GENERATED CODE
public class PersonMapperImpl implements PersonMapper {
  public Person map(PersonDTO dto) {
    if (dto == null) {
      return null;
    }

    Person.Builder builder = Person.builder();

    builder.name( dto.getName() );

    return builder.build();
  }
}
```

> [!tip]
> 如果你想禁用构建器，可以将 `mapstruct. disableBuilders` 选项传递给编译器，例如：`-Amapstruct. disableBuilders=true`。

### 使用构造函数（Constructor）

MapStruct **支持使用构造函数映射目标类型**。在映射过程中，MapStruct 会优先检查目标类型是否存在[[#使用构建器（Builder）|构建器]]，如果没有构建器，MapStruct 会寻找一个可访问的构造函数。当存在多个构造函数时，MapStruct 会按照以下规则选择使用哪个构造函数：
- 如果某个构造函数被 `@Default` 注解标记，则优先使用该构造函数。
- 如果类中只有一个公共的（`public`）构造函数，则使用该构造函数，并忽略其他非公共的构造函数。
- 如果存在无参构造函数，则使用该构造函数，并忽略其他构造函数。
- 如果存在多个符合条件的构造函数，则会因为构造函数不明确而导致编译错误。为了解决歧义，可以使用 `@Default` 注解明确指定要使用的构造函数。

举个栗子：决定使用哪个构造函数

```java
public class Vehicle {

  protected Vehicle() { }

  // MapStruct 选择此构造函数，因为它是唯一的 public 构造函数
  public Vehicle(String color) { }
}

public class Car {

  // MapStruct 选择此构造函数，因为它是一个无参构造函数
  public Car() { }

  public Car(String make, String color) { }
}

public class Truck {

  public Truck() { }

  // MapStruct 选择此构造函数，因为它被 @Default 注解标记
  @Default
  public Truck(String make, String color) { }
}

public class Van {

  // MapStruct 无法选择构造函数，导致编译错误
  public Van(String make) { }

  public Van(String make, String color) { }
}
```

使用构造函数进行映射时，MapStruct 会**根据构造函数的参数名称来匹配目标对象的属性**。如果构造函数带有 `@ConstructorProperties` 注解，MapStruct 会使用该注解来获取参数名称。

> [!note]
> 如果目标类型存在**对象工厂方法**或使用 `@ObjectFactory` 注解标记的方法，则**工厂方法的优先级高于构造函数**。在这种情况下，MapStruct 不会调用构造函数，而是使用工厂方法创建目标对象。

举个栗子：

```java
public interface PersonMapper {
  Person map(PersonDTO dto);
}
```

生成的映射器代码实现：

```java
// GENERATED CODE
public class PersonMapperImpl implements PersonMapper {
  public Person map(PersonDTO dto) {
    if (dto == null) {
      return null;
    }

    String name = dto.getName();
    String surname = dto.getSurname();

    return new Person(name, surname);
  }
}
```

### 映射 Map 到 Bean

在某些情况下，可能需要将 `Map<String, ???>` 映射到特定的 Java Bean 中。MapStruct 提供了一种透明的方式来进行此类映射，即通过目标 Bean 的属性（或 `@Mapping #source ` 显式指定的属性）来提取 Map 中的值。

举个栗子：

```java
public class Customer {
  private Long id;
  private String name;
  // 省略 getter/setter
}

@Mapper
public interface CustomerMapper {
  @Mapping(target = "name", source = "customerName")
  Customer toCustomer(Map<String, String> map);
}
```

生成的映射器代码实现：

```java
// GENERATED CODE
public class CustomerMapperImpl implements CustomerMapper {
  @Override
  public Customer toCustomer(Map<String, String> map) {
    // ...
    if ( map.containsKey( "id" ) ) {
      customer.setId( Integer.parseInt( map.get( "id" ) ) );
    }
    if ( map.containsKey( "customerName" ) ) {
      customer.setName( map.get( "customerName" ) );
    }
    // ...
  }
}
```

MapStruct 在由 Map ➡️ Bean 转换时，仍然遵循普通对象映射的所有规则，包括：
- ✅**自动类型转换**（如果源字段和目标字段类型不同，MapStruct 会尝试自动转换）
- ✅**支持 `@Mapping` 自定义字段映射**
- ✅**支持 `@Mapper #uses ` 关联其他映射器进行复杂类型转换**
- ✅**使用自定义转换方法**（在映射器中写 `default` 方法）

> [!warning]
> 如果使用**原始类型的 Map（即 Map 没有泛型参数）**，或者 Map 的键**不是 `String` 类型**，则 MapStruct 会生成警告。不过，如果将 Map 作为一个整体直接映射到目标的某个属性（即 Map 直接作为 Bean 的一个字段），则不会触发警告。

### 添加注解

有时其他框架需要你在特定类上添加注解，以便框架能够正确识别和管理映射器（Mapper）。MapStruct 提供了 `@AnnotateWith` 注解，可用于在指定位置生成额外的注解。
例如，Apache Camel 提供了一个 `@Converter` 注解，你可以通过 `@AnnotateWith` 注解让 MapStruct 在编译时自动为映射器添加 `@Converter` 注解。

举个栗子：

```java
@Mapper
@AnnotateWith(
  value = Converter.class,
  elements = @AnnotateWith.Element(name = "generateBulkLoader", booleans = true)
)
public interface MyConverter {
  @AnnotateWith(Converter.class)
  DomainObject map(DtoObject dto);
}
```

在这个示例中， `MyConverter` 接口使用 `@AnnotateWith` 注解来指定在生成的实现类上添加 `@Converter` 注解，并设置 `generateBulkLoader` 属性为 `true`。同时，`map ()` 方法也添加 `@Converter` 注解，表明它是一个转换方法。

生成的映射器代码实现：

```java hl:2,4
// GENERATED CODE
@Converter(generateBulkLoader = true)
public class MyConverterImpl implements MyConverter {
  @Converter
  public DomainObject map(DtoObject dto) {
    // 默认的映射逻辑
  }
}
```

### 添加 Javadoc 注释

MapStruct 允许使用 `@Javadoc` 注解在生成的映射器实现类中自动添加 Javadoc 注释。这对于需要遵循特定的 Javadoc 规范，或者需要满足 Javadoc 校验要求的项目来说特别有用。
`@Javadoc` 提供了多个参数，分别对应不同的 Javadoc 元素，例如：类描述、作者、版本信息、弃用说明等。

举个栗子：

```java
@Mapper
@Javadoc(
  value = "This is the description",
  authors = { "author1", "author2" },
  deprecated = "Use {@link OtherMapper} instead",
  since = "0.1"
)
public interface MyAnnotatedWithJavadocMapper {
  //...
}
```

生成的映射器代码实现：

```java
/**
* This is the description
*
* @author author1
* @author author2
*
* @deprecated Use {@link OtherMapper} instead
* @since 0.1
*/
public class MyAnnotatedWithJavadocMapperImpl implements MyAnnotatedWithJavadocMapper {
  //...
}
```

也可以直接提供整个 Javadoc 注释块。

```java
@Mapper
@Javadoc(
  "This is the description\n"
  + "\n"
  + "@author author1\n"
  + "@author author2\n"
  + "\n"
  + "@deprecated Use {@link OtherMapper} instead\n"
  + "@since 0.1\n"
)
public interface MyAnnotatedWithJavadocMapper {
  //...
}
```

如果使用 JDK15+，可以使用**文本块（`"""`**）。

```java
@Mapper
@Javadoc(
  """
  This is the description

  @author author1
  @author author2

  @deprecated Use {@link OtherMapper} instead
  @since 0.1
  """
)
public interface MyAnnotatedWithJavadocMapper {
  //...
}
```

## 获取映射器实例

### 使用 Mappers 工厂（无依赖注入）

如果不使用依赖注入（DI）框架，可以通过 `org. mapstruct. factory. Mappers` 类获取映射器实例。只需调用 `getMapper ()` 方法，并传入映射器接口类型即可。
举个栗子：使用 `Mappers` 工厂获取映射器实例

```java
CarMapper mapper = Mappers.getMapper( CarMapper.class );
```

按照惯例，映射器接口应该定义一个名为 `INSTANCE` 的静态成员，该成员用于保存映射器类型的单例对象。
举个栗子：在接口中声明映射器实例

```java
@Mapper
public interface CarMapper {
  CarMapper INSTANCE = Mappers.getMapper(CarMapper.class);

  CarDTO carToCarDTO(Car car);
}
```

举个栗子：在抽象类中声明映射器实例

```java
@Mapper
public abstract class CarMapper {
  public static final CarMapper INSTANCE = Mappers.getMapper(CarMapper.class);

  CarDTO carToCarDTO(Car car);
}
```

这种方式使得客户端可以很轻松地获取映射器对象，而无需重复创建新实例。
举个栗子：获取映射器实例

```java
Car car = ...;
CarDTO dto = CarMapper.INSTANCE.carToCarDTO(car);
```

> [!note]
> 由 MapStruct 生成的映射器是**无状态且线程安全的**，因此可以安全地在多个线程中共享使用。

### 使用依赖注入

如果你正在使用依赖注入框架，如 CDI（Java EE 的上下文和依赖注入）或 Spring 框架，建议**通过依赖注入地方式获取映射器实例**，而不是通过上述的 `Mappers` 工厂。为此，你可以通过 `@Mapper (componentModel = "spring")` 或 `@Mapper (componentModel = "cdi")` 指定组件模型，或者在[[#^d4dc33|编译选项]]中配置全局默认组件模型。

目前支持 CDI 和 Spring（后者可通过其自定义注解或使用 JSR 330 注解）。请参阅[[#^d4dc33|编译选项]]以了解 `componentModel` 属性的可选值，这些值与 `mapstruct. defaultComponentModel` 处理器选项相同，常量定义在 `MappingConstants. ComponentModel` 类中。在这两种情况下，都会在生成的映射器实现类中添加上所需的注解，以便使其可以进行依赖注入。以下是一个使用 CDI 的示例：

```java
@Mapper(componentModel = MappingConstants.ComponentModel.CDI)
public interface CarMapper {
  CarDTO carToCarDTO(Car car);
}
```

生成的映射器实现将自动加上 `@ApplicationScoped` 注解，因此可以使用 `@Inject` 注解注入到字段、构造函数参数等中。

举个栗子：通过依赖注入获取映射器

```java
@Inject
private CarMapper mapper;
```

使用其他映射器类（参见[[#调用其他映射器]]）的映射器时将按照相同配置的组件模型进行注入。因此，如果前一个示例中的 `CarMapper` 使用了另一个映射器，那么这个其他映射器也必须是可注入的 CDI Bean。

### 注入策略

在[[#使用依赖注入]]时，可以选择构造函数注入、字段注入或 setter 注入，通过 `@Mapper` 或 `@MapperConfig` 注解指定 `injectionStrategy` 参数来配置注入策略。

举个栗子：使用构造函数注入

```java
@Mapper(componentModel = MappingConstants.ComponentModel.CDI, 
        uses = EngineMapper.class, 
        injectionStrategy = InjectionStrategy.CONSTRUCTOR)
public interface CarMapper {
  CarDTO carToCarDTO(Car car);
}
```

- **默认使用字段注入**，但可以通过[[#^e705d4|编译选项]]修改默认的注入策略。
- 👍**建议使用构造器注入**，因为它更符合**依赖倒置原则**（Dependency Inversion Principle），更方便测试。
- 在 Spring 中定义具有**循环依赖**的映射器时，可能导致编译失败，这时应使用 **setter 注入** 的方式来解决。
- 对于抽象类或装饰器，应使用 setter 注入的方式。

## 数据类型转换

在映射过程中，源对象和目标对象的属性类型可能不同。例如，源对象的某个属性可能是 `int` 类型，而目标对象对应属性是 `Long` 类型。
此外，某些对象引用也可能需要转换成目标模型的对应类型。例如，`Car` 类可能有一个类型为 `Person` 的 `driver` 属性，当映射一个 `Car` 对象时，需要将其转换为 `PersonDTO` 对象。

### 隐式类型转换

MapStruct 在许多情况下会自动处理类型转换。例如：
- `int` ➡️ `String`：自动调用 ` String.valueOf (int) `
- `String` ➡️ `int`：自动调用 ` Integer.parseInt (String) `

支持的自动转换包括：

- 所有 Java **基本数据类型及其对应的包装类型**之间，例如 `int` 和 `Integer`，`boolean` 和 `Boolean` 等。生成的代码会进行空值（`null`）检查，即在将包装类型转换为相应的基本类型时会执行空值检查。
- 所有 Java **数值类型**之间，例如 `int` 和 `long` 或 `byte` 和 `Integer`。

  > [!warning]
  >
  > 从较大范围的数据类型转换为较小范围的数据类型（例如从 `long` 到 `int`）可能会导致数据溢出或精度损失。
  > 可以通过 `@Mapper` 和 `@MapperConfig` 注解中的 `typeConversionPolicy` 属性来控制输出警告或者错误。由于向后兼容的原因，默认值是 `ReportingPolicy. IGNORE`。

- 所有 Java **基本数据类型（包括其包装类型）和字符串 `String`** 之间，例如 `int` 和 `String` 或 `Boolean` 和 `String`。可以指定一个 `java. text. DecimalFormat` 可以理解的格式字符串。

  举个栗子：`int` ➡️ `String`

	```java
	@Mapper
	public interface CarMapper {
	  @Mapping(source = "price", numberFormat = "$#.00")
	  CarDTO carToCarDTO(Car car);
	
	  @IterableMapping(numberFormat = "$#.00")
	  List<String> prices(List<Integer> prices);
	}
	```

- **枚举类型转换**
  - 枚举类型 ↔️ `String`
  - 枚举类型 ↔️ `Integer`，使用 `enum.ordinal ()`

    > [!note]
    > 从 `Integer` 类型转换为枚举类型时，值必须小于枚举值的数量（`enum.values (). length`），否则会抛出 `ArrayOutOfBoundsException` 异常！

- **大数值类型（`java. math. BigInteger`，`java. math. BigDecimal`）和 Java 基本类型（包括其包装类型）以及 `String`** 之间。可以指定一个 `java. text. DecimalFormat` 可以理解的格式字符串。

  举个栗子：`BigDecimal` ➡️ `String`

	```java
	@Mapper
	public interface CarMapper {
	  @Mapping(source = "power", numberFormat = "#.##E0")
	  CarDTO carToCarDTO(Car car);
	}
	```

- JAXB 相关类型：
  - `JAXBElement<T>` 和 `T`，`List<JAXBElement<T>>` 和 `List<T>` 之间。
  - `java. util. Calendar` / `java. util. Date` 和 JAXB 的 `XMLGregorianCalendar` 之间。
  - `XMLGregorianCalendar` / **`java. util. Date` 和 `String`** 之间。可以通过 `dateFormat` 选项指定一个 `java. text. SimpleDateFormat` 可以理解的格式字符串。

  举个栗子：`Date` ➡️ `String`

	```java
	@Mapper
	public interface CarMapper {
		@Mapping(source = "manufacturingDate", dateFormat = "dd.MM.yyyy")
		CarDTO carToCarDTO(Car car);
		
		@IterableMapping(dateFormat = "dd.MM.yyyy")
		List<String> stringListToDateList(List<Date> dates);
	}
	```

- Joda-Time 相关类型：
  - Joda 的 `org. joda. time. DateTime`、`org. joda. time. LocalDateTime`、`org. joda. time. LocalDate`、`org. joda. time. LocalTime` 和 `String` 之间。可以通过 `dateFormat` 选项指定一个 `java. text. SimpleDateFormat` 可以理解的格式字符串。
  - Joda 的 `org. joda. time. DateTime` 和 `javax. xml. datatype. XMLGregorianCalendar`，`java. util. Calendar` 之间。
  - Joda 的 `org. joda. time. LocalDateTime`、`org. joda. time. LocalDate` 和 `javax. xml. datatype. XMLGregorianCalendar`，`java. util. Date` 之间。
- Java 8 日期时间 API：
  - `java. time. LocalDate`、`java. time. LocalDateTime` 和 `javax. xml. datatype. XMLGregorianCalendar` 之间。
  - `java. time. ZonedDateTime`、**`java. time. LocalDateTime`、`java. time. LocalDate`、`java. time. LocalTime` 和 `String`** 之间。可以通过 `dateFormat` 选项指定一个 `java. text. SimpleDateFormat` 可以理解的格式字符串。
  - **`java. time. Instant`、`java. time. Duration`、`java. time. Period` 和 `String`** 之间，使用每个类的解析方法从 `String` 映射，并使用 `toString` 映射到 `String`。
  - `java. time. ZonedDateTime` 和 `java. util. Date` 之间，当从给定的 `Date` 映射 `ZonedDateTime` 时，使用系统默认时区。
  - **`java. time. LocalDateTime` 和 `java. util. Date`** 之间，使用 UTC 作为时区。
  - **`java. time. LocalDate` 和 `java. util. Date` / `java. sql. Date`** 之间，使用 UTC 作为时区。
  - **`java. time. Instant` 和 `java. util. Date`** 之间。
  - **`java. time. LocalDateTime` 和 `java. time. LocalDate`** 之间。
  - `java. time. ZonedDateTime` 和 `java. util. Calendar` 之间。
- SQL 时间类型：
  - **`java. sql. Date` 和 `java. util. Date`** 之间。
  - **`java. sql. Time` 和 `java. util. Date`** 之间。
  - **`java. sql. Timestamp` 和 `java. util. Date`** 之间。
- `java. util. Currency` 和 `String` 之间。

    > [!note]
    >
    > 由 `String` ➡️ `java. util. Currency` 时，值必须是有效的 ISO-4217 货币代码，否则会抛出 `IllegalArgumentException` 异常！

- `java. util. UUID` 和 `String` 之间。

    > [!note]
    >
    > 由 `String` ➡️ `java. util. UUID` 时，值必须是有效的 UUID，否则会抛出 `IllegalArgumentException` 异常！

- **`String` 和 `StringBuilder`** 之间。
- `java. net. URL` 和 `String` 之间。

    > [!note]
    >
    > 由 `String` ➡️ `java. net. URL` 时，值必须是有效的 URL，否则会抛出 `MalformedURLException` 异常！

- `java. util. Locale` 和 `String` 之间。
    - `java. util. Locale` ➡️ `String`：生成的字符串将是一个格式良好的 IETF BCP 47 语言标签，表示该区域设置。
    - `String` ➡️ `java. util. Locale`：返回最能代表该语言标签的区域设置。

### 映射对象引用

通常，对象不仅包含基本属性，还可能引用其他对象。例如，`Car` 类可能包含对 `Person` 对象的引用（代表司机），而该对象映射到 `CarDTO` 时可能需要引用 `PersonDTO` 对象。

在这种情况下，要正确映射对象引用，需要为被引用的对象定义一个单独的映射方法：

举个栗子：

```java
@Mapper
public interface CarMapper {
  CarDTO carToCarDTO(Car car);

  PersonDTO personToPersonDTO(Person person);
}
```

在 `carToCarDTO ()` 方法的实现中，MapStruct 会自动调用 `personToPersonDTO ()` 方法来映射 `driver` 属性，而 `personToPersonDTO ()` 方法的生成实现则负责 `Person` 对象的映射，从而完成 `Car` ➡️ `CarDTO` 的转换。

这样可以**映射任意深度的对象层级**。在从实体（entity）映射到数据传输对象（DTO）时，通常需要在某个层级截断对其他实体的引用。要实现这一点，可以自定义映射方法（详见下一节），例如将引用的实体转换为其 ID 并存入目标对象。

🚀🚀🚀在生成映射方法的实现时，MapStruct 会对源对象和目标对象的每对属性按以下规则进行处理：
- 如果**源属性和目标属性的类型相同**，则直接将值从源对象复制到目标对象。若属性是集合（如 `List`），则会创建集合的副本并赋值给目标属性。
- 如果**源属性和目标属性的类型不同**，MapStruct 会检查是否**存在一个映射方法，该方法的参数类型与源属性类型匹配，返回类型与目标属性类型匹配**。如果存在这样的方法，它将在生成的映射实现中被调用。
- 如果**找不到匹配的映射方法**，MapStruct 会检查是否存在针对该属性类型的**内置转换**。如果有，生成的映射代码将应用该转换。
- 如果**仍然找不到合适的方法**，MapStruct 会执行**复杂转换**，包括：
    - 先调用一个映射方法，再使用另一个映射方法处理结果，例如：`target = method1 (method2 (source))`
    - 先执行内置转换，再调用映射方法处理结果，例如：`target = method (conversion (source))`
    - 先调用映射方法，再执行内置转换处理结果，例如：`target = conversion (method (source))`
- 如果**仍无法转换**，MapStruct 会**尝试自动生成一个子映射方法，以处理源属性和目标属性之间的映射**。
- 如果 MapStruct **无法创建基于名称的映射方法**，则会在构建时抛出错误，并指明无法映射的属性及其路径。

可以在多个级别上定义映射控制（`MappingControl`），包括 `@MapperConfig`、`@Mapper`、`@BeanMapping` 和 `@Mapping`，其中后者的优先级高于前者。例如，`@Mapper (mappingControl = NoComplexMapping. class)` 的优先级高于 `@MapperConfig (mappingControl = DeepClone. class)`。

`@IterableMapping` 和 `@MapMapping` 的工作方式与 `@Mapping` 类似。`MappingControl` 是从 MapStruct 1.4 开始的实验性功能。

`MappingControl` 具有一个枚举类型，对应前面提到的四种映射方式：
- `MappingControl. Use #DIRECT `（直接映射）
- `MappingControl. Use #MAPPING_METHOD `（使用映射方法）
- `MappingControl. Use #BUILT_IN_CONVERSION `（使用内置转换）
- `MappingControl. Use #COMPLEX_MAPPING `（使用复杂映射）
指定枚举表示启用该映射方式，未指定则禁用。默认情况下，这四种选项均处于启用状态，允许所有映射方式。

> [!info]
> 要阻止 MapStruct 自动生成子映射方法，可使用 `@Mapper (disableSubMappingMethodsGeneration = true)`。

> [!tip]
> 用户可以通过元注解完全控制映射。例如，`@DeepClone` 仅允许直接映射。如果源类型与目标类型相同，MapStruct 将对源进行深度克隆。默认情况下，允许自动生成子映射方法。

> [!info]
> 自动生成子映射方法时暂时不会考虑[[#共享配置]]。详情见 [issue #1086](https://github.com/mapstruct/mapstruct/issues/1086)

> [!info]
> 目标对象的构造方法参数也被视为目标属性。详情见[[#使用构造函数（Constructor）]]

### 控制嵌套对象映射

如上所述，MapStruct 默认会根据源对象和目标对象的属性名称生成映射方法。然而，在许多情况下，这些名称可能并不匹配。

在 `@Mapping` 注解中使用 `.` 语法，可以控制属性的映射方式，以解决名称不匹配的问题。MapStruct 官方示例库中提供了详细的[示例](https://github.com/mapstruct/mapstruct-examples/tree/master/mapstruct-nested-bean-mappings)说明如何处理此类问题。

最简单的情况是，需要调整嵌套属性的映射。例如，`FishTankDTO` 和 `FishTank` 中都包含 `fish` 属性，它们的名称相同，MapStruct 会自动生成一个 `FishDTO fishToFishDTO (Fish fish)` 方法来进行映射。但是，如果 `Fish` 类的 `type` 属性需要映射到 `FishDTO` 类的 `kind` 属性，MapStruct 默认不会处理这种名称不同的情况。我们可以通过 `@Mapping (target="fish. kind", source="fish. type")` 来指定映射规则，让 `fish. type` 映射到 `fish. kind`。

举个栗子：

```java
@Mapper
public interface FishTankMapper {
  @Mapping(target = "fish.kind", source = "fish.type")
  @Mapping(target = "fish.name", ignore = true)
  @Mapping(target = "ornament", source = "interior.ornament")
  @Mapping(target = "material.materialType", source = "material")
  @Mapping(target = "quality.report.organisation.name", source = "quality.report.organisationName")
  FishTankDTO map(FishTank source);
}
```

上述示例展示了几种映射方式：

- `@Mapping (target = "fish. kind", source = "fish. type")` 解决属性名称不同的问题。
- `@Mapping (target = "fish. name", ignore = true)` 忽略某个属性的映射。
- `@Mapping (target = "ornament", source = "interior. ornament")` & `@Mapping (target = "material. materialType", source = "material")` 允许从不同层级映射属性。
- `@Mapping (target = "quality. report. organisation. name", source = "quality. report. organisationName")` 在不同嵌套层级间映射特定属性。

有时候，源对象和目标对象的属性层级不匹配，此时可以"挑选"某些属性进行映射。例如：

```java
@Mapping(target = "ornament", source = "interior.ornament")
@Mapping(target = "material.materialType", source = "material")
```

这里 `materialType` 不是 `material` 的直接属性，而是 `material` 这个对象的属性。因此，`material` 会被映射到 `materialType`。

如果某些对象在映射过程中共享相同的基础结构，MapStruct 也能处理。例如：

```java
@Mapping(target = "quality.report.organisation.name", source = "quality.report.organisationName")
```

这里 `organisation` 在 `OrganisationDTO` 中没有对应的 `organisation` 对象，因此 MapStruct 只会映射 `organisationName`。

假设 `kind` 和 `type` 本身是对象，MapStruct 仍会生成相应的方法进行映射：

```java
@Mapper
public interface FishTankMapperWithDocument {
  @Mapping(target = "fish.kind", source = "fish.type")
  @Mapping(target = "fish.name", expression = "java(\"Jaws\")")
  @Mapping(target = "plant", ignore = true)
  @Mapping(target = "ornament", ignore = true)
  @Mapping(target = "material", ignore = true)
  @Mapping(target = "quality.document", source = "quality.report")
  @Mapping(target = "quality.document.organisation.name", constant = "NoIdeaInc")
  FishTankWithNestedDocumentDTO map(FishTank source);
}
```

在此示例中：
- `@Mapping (target = "fish. name", expression = "java (\"Jaws\")")` 使用 Java 表达式为 `fish. name` 赋固定值 `"Jaws"`。
- `@Mapping (target = "quality. document", source = "quality. report")` 指定 `document` 由 `report` 映射而来，尽管它们的名称不同，MapStruct 仍会根据该规则进行转换。
- `@Mapping (target = "quality. document. organisation. name", constant = "NoIdeaInc")` 使用常量 `"NoIdeaInc"` 赋值给 `organisation. name`。

MapStruct 在处理嵌套对象时，会自动对源对象中的每个嵌套属性进行 `null` 检查，避免 `NullPointerException`。

虽然可以直接在 `@Mapping` 注解中配置嵌套属性，👍但更推荐的做法是**编写独立的映射方法**，以便在多个地方复用。例如：

```java
@Mapper
public interface FishTankMapper {
  FishTankDTO map(FishTank source);

  FishDTO map(Fish source);
}
```

这样，`FishDTO` 的映射逻辑可以在 `map (Fish source)` 方法中定义，并在 `map (FishTank source)` 方法中复用，而不必在多个 `@Mapping` 注解中重复配置。

在某些情况下，嵌套对象的映射可能不会覆盖所有目标对象的属性。MapStruct 提供了 `ReportingPolicy` 来控制未映射属性的处理方式。例如，`IGNORE` 选项允许 MapStruct 忽略未映射的属性，不会在编译时报错。

### 调用自定义的映射方法

在 MapStruct 中，有时需要对映射逻辑进行自定义，特别是当字段映射不直接对应时。例如，你可能需要将一个复杂对象的多个属性映射到另一个对象的单个属性上，或者需要根据某些条件计算出新的属性值。为了实现这一点，可以定义一个自定义映射方法，该方法接收源对象作为参数，并返回目标对象。MapStruct 会**自动**调用这个方法来处理特定的映射逻辑。其余的字段仍然可以通过标准的 `@Mapping` 注解来映射。

在下面的示例中展示了如何将 `FishTank` 对象的 `length`、`width` 和 `height` 属性映射到 `FishTankWithVolumeDTO` 对象的 `volume` 属性。`VolumeDTO` 具有 `volume`（体积）和 `description`（描述）两个属性。这里可以通过一个自定义的映射方法 `mapVolume (FishTank source)` 计算体积和填充描述信息，然后返回 `VolumeDTO` 对象。

```java hl:27
public class FishTank {
  Fish fish;
  String material;
  Quality quality;
  int length;
  int width;
  int height;
}

public class FishTankWithVolumeDTO {
  FishDTO fish;
  MaterialDTO material;
  QualityDTO quality;
  VolumeDTO volume;
}

public class VolumeDTO {
  int volume;
  String description;
}

@Mapper
public abstract class FishTankMapperWithVolume {
  @Mapping(target = "fish.kind", source = "source.fish.type")
  @Mapping(target = "material.materialType", source = "source.material")
  @Mapping(target = "quality.document", source = "source.quality.report")
  @Mapping(target = "volume", source = "source")
  abstract FishTankWithVolumeDTO map(FishTank source);

  VolumeDTO mapVolume(FishTank source) {
    int volume = source.length * source.width * source.height;
    String desc = volume < 100 ? "Small" : "Large";
    return new VolumeDTO(volume, desc);
  }
}
```

> [!note]
> 在 `@Mapping (target = "volume", source = "source")` 中，`source` 不是 `FishTank` 的某个属性，而是 `map (FishTank source)` 方法的整个参数对象。这表明 `volume` 需要通过 `mapVolume (FishTank source)` 方法来计算并映射。

### 调用其他映射器

除了在同一个映射器接口中定义的方法之外，MapStruct 还可以调用其他类中定义的映射方法，无论是由 MapStruct 生成的映射器还是手写的映射方法。这样可以更好地组织映射代码（例如，每个应用模块一个映射器），或者用于处理 MapStruct 无法自动生成的自定义映射逻辑。

例如，在 `Car` 类中有一个类型为 `Date` 的 `manufacturingDate` 属性，而在 `CarDTO` 中对应的属性却是 `String` 类型。为了实现该转换，可以手动编写一个 `DateMapper` 映射器：

```java
public class DateMapper {=
  public String asString(Date date) {
    return date != null ? new SimpleDateFormat("yyyy-MM-dd").format(date) : null;
  }

  public Date asDate(String date) {
    try {
      return date != null ? new SimpleDateFormat("yyyy-MM-dd").parse(date) : null;
    } catch (ParseException e) {
      throw new RuntimeException(e);
    }
  }
}
```

然后，在 `@Mapper` 注解中，通过 `uses` 参数引用 `DateMapper`，如下所示：

```java
@Mapper(uses = DateMapper.class)
public interface CarMapper {
  CarDTO carToCarDTO(Car car);
}
```

- **执行过程**：在为 `carToCarDTO ()` 方法的实现生成代码时，MapStruct 会查找一个可以将 `Date` 转换为 `String` 的方法，并在 `DateMapper` 类中找到 `asString ()` 方法，最终生成代码来调用它映射 `manufacturingDate` 属性。
- **依赖注入**：**生成的映射器使用为它们配置的组件模型来检索引用的映射器**。例如，
	- 如果为 `CarMapper` 使用了 CDI 作为组件模型，`DateMapper` 也必须是一个 CDI bean。
	- 当使用默认组件模型时，任何要被 MapStruct 生成的映射器引用的手写映射器类**必须声明一个公共无参构造函数**，否则 MapStruct 无法实例化它。

### 传递目标类型到自定义映射器（了解）

当使用 `@Mapper #uses ()` 引入自定义映射器时，可以在自定义映射方法中添加一个额外的 `Class` 类型（或其超类）参数，以便为特定的目标对象类型执行通用映射逻辑。该参数必须用 `@TargetType` 注解标注，这样 MapStruct 才会在生成代码时传递目标属性的 `Class` 类型实例。

例如，在 `CarDTO` 中有一个类型为 `Reference` 的 `owner` 属性，而 `Reference` 类只存储了 `Person` 实体的主键。现在，我们可以创建一个通用的自定义映射器，将任何 `Reference` 类型的对象解析为相应的 JPA 实体实例。

```java
public class Car {
  private Person owner;
  // ...
}

public class Person extends BaseEntity {
  // ...
}

public class Reference {
  private String pk;
  // ...
}

public class CarDTO {
  private Reference owner;
  // ...
}
```

```java
@ApplicationScoped // CDI 组件模型
public class ReferenceMapper {

  @PersistenceContext
  private EntityManager entityManager;

  public <T extends BaseEntity> T resolve(Reference reference, @TargetType Class<T> entityClass) {
    return reference != null ? entityManager.find(entityClass, reference.getPk()) : null;
  }

  public Reference toReference(BaseEntity entity) {
    return entity != null ? new Reference(entity.getPk()) : null;
  }
}
```

- `resolve ()` 泛型方法，接受一个 `Reference` 对象和一个目标实体类的 `Class` 对象作为参数。通过 `@TargetType` 指示 MapStruct 在生成代码时传递目标类型的类实例，这样可以利用 JPA 的 `EntityManager.find ()` 方法查找相应的数据库实体。
- `toReference ()` 方法则用于将实体对象转换回 `Reference`。

生成的映射器代码实现：

```java
// GENERATED CODE
@ApplicationScoped
public class CarMapperImpl implements CarMapper {

  @Inject
  private ReferenceMapper referenceMapper;

  @Override
  public Car carDTOToCar(CarDTO carDTO) {
    if (carDTO == null) {
      return null;
    }

    Car car = new Car();

    car.setOwner(referenceMapper.resolve(carDTO.getOwner(), Owner.class));
    // ...

    return car;
  }
}
```

- `@TargetType Class<T>` 让 MapStruct 在调用 `ReferenceMapper.resolve ()` 时，传入 `Owner. class` 作为目标类型。
- 这样，`ReferenceMapper` 可以通用地处理不同的 JPA 实体，而不仅仅是 `Person`。
- 生成的代码会自动调用 `ReferenceMapper.resolve ()` 方法，并传入目标对象的类型。

这样可以灵活地映射 `Reference` 到对应的 JPA 实体，避免手动编写重复代码。

### 映射方法选择

MapStruct 在映射属性时，会**优先选择最具体的映射方法**，方法来源包括：
- 当前 `@Mapper` 映射器
- 通过 `@Mapper#uses()` 引入的其他映射器

工厂方法（`@ObjectFactory`）遵循相同解析规则（详见[对象工厂](#)）。

**解析规则**：
1. **优先匹配源类型更具体的映射方法**
    - 例如，`String` ➡️ `Integer ` 比 ` Object` ➡️ `Integer ` 更具体，因此优先使用 ` String` ➡️ `Integer `。
2. **存在多个同样具体的映射方法时，会抛出错误**
    - 例如，`String` ➡️ `Number ` 和 ` String` ➡️ `Integer ` 都适用，但 MapStruct 无法决定使用哪个方法，因此会抛出错误。

> [!info]- JAXB 支持
> 在使用 JAXB （如 `String -> JAXBElement<String>`）时，MapStruct 会参考 `@XmlElementDecl` 注解的作用域（`scope`）和名称（`name`）属性，以确保 `JAXBElement` 实例具有正确的 `QName` 值。

### 基于限定符的映射方法选择

在某些情况下，需要**多个具有相同方法签名但不同逻辑**的映射方法。MapStruct 提供 `@Qualifier`（`org.mapstruct.Qualifier`）来解决此问题。
`@Qualifier` 限定符允许用户定义**自定义注解**，并将其**标注在映射方法上**，然后在 `@Mapping` 中**指定使用哪种方法**，适用于**普通属性映射、集合映射和 Map 映射**。

举个栗子：多个相同签名的映射方法。假设有一个 `Titles` 类，其中有两个方法用于翻译标题：

```java
public class Titles {
  public String translateTitleEG(String title) { /* 逻辑 */ }
  public String translateTitleGE(String title) { /* 逻辑 */ }
}
```

当 `MovieMapper` 依赖 `Titles` 进行映射时：

```java
@Mapper(uses = Titles.class)
public interface MovieMapper {
  @Mapping(target = "title")
  GermanRelease toGerman(OriginalRelease movies);
}
```

由于 `translateTitleEG` 和 `translateTitleGE` 具有**相同的参数和返回类型**，MapStruct **无法确定**该选择哪个方法，会报错。

使用 `@Qualifier` 解决方法冲突。首先，定义一个通用的 `@Qualifier` 注解：

```java
@Qualifier
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.CLASS)
public @interface TitleTranslator {}
```

然后，为具体的映射方法定义限定符：

```java
@Qualifier
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.CLASS)
public @interface EnglishToGerman {}

@Qualifier
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.CLASS)
public @interface GermanToEnglish {}
```

> [!note]
> `TitleTranslator` 为类型级别的限定符，而 `EnglishToGerman` 和 `GermanToEnglish` 为方法级别的限定符！

在 `Titles` 类中应用这些限定符：

```java
@TitleTranslator
public class Titles {
  @EnglishToGerman
  public String translateTitleEG(String title) { /* 逻辑 */ }

  @GermanToEnglish
  public String translateTitleGE(String title) { /* 逻辑 */ }
}
```

最后，在 `MovieMapper` 映射时指定限定符：

```java
@Mapper(uses = Titles.class)
public interface MovieMapper {
  @Mapping(target = "title", qualifiedBy = { TitleTranslator.class, EnglishToGerman.class })
  GermanRelease toGerman(OriginalRelease movies);
}
```

这样，MapStruct 就会优先选择 `translateTitleEG` 方法进行 `title` 映射。

> [!warning]
> 请确保使用的保留策略为 `CLASS`（`@Retention(RetentionPolicy.CLASS)`）。

> [!warning]
> 被 `@Qualifier` 注解标注的类或方法只能用于那些明确指定了 `qualifiedBy` 的映射，不会被其他映射方法自动使用。

> [!tip]
> 同样的机制也适用于 Bean 映射：`@BeanMapping#qualifiedBy` 可用于选择标注了特定限定符的工厂方法。

在很多情况下，为了选择合适的方法专门创建一个新的注解可能显得过于繁琐。对此，MapStruct 提供了 `@Named` 注解，它本质上是一个**预定义的限定符**（自身带有 `@Qualifier`），可以用来为映射器或具体的映射方法命名。例如，上述示例可以改写为：

```java
@Named("TitleTranslator")
public class Titles {
  @Named("EnglishToGerman")
  public String translateTitleEG(String title) { /* 逻辑 */ }

  @Named("GermanToEnglish")
  public String translateTitleGE(String title) { /* 逻辑 */ }
}
```

然后在 `MovieMapper` 中使用 `qualifiedByName` 进行匹配：

```java
@Mapper(uses = Titles.class)
public interface MovieMapper {
  @Mapping(target = "title", qualifiedByName = { "TitleTranslator", "EnglishToGerman" })
  GermanRelease toGerman(OriginalRelease movies);
}
```

> [!warning]
> 虽然 `@Named` 的机制与自定义限定符类似，但使用时需要更加谨慎。
> 如果在 IDE 中重构一个自定义限定符的名称，IDE 会自动更新所有相关引用，确保代码一致性。而如果直接修改 `@Named` 里的字符串名称，IDE 不会自动更新其他地方的引用，可能会导致映射失败或运行时错误。

### 结合限定符和默认值

请注意，`@Mapping#defaultValue` 本质上是一个字符串，MapStruct 需要将其转换为 `@Mapping#target` 指定的类型。如果 `@Mapping` 还指定了 `qualifiedByName` 或 `qualifiedBy`，MapStruct 会强制使用对应的方法进行转换，而不会自动推断转换方式。

如果希望 `defaultValue` 采用特定的转换方式，需要提供一个专门的方法，将 `String` 转换为目标类型，并使用 `@Named` 或 `@Qualifier` 进行标注，以便 MapStruct 正确识别和调用该方法。

举个栗子：使用默认值的映射器

```java
@Mapper
public interface MovieMapper {
  @Mapping(target = "category", qualifiedByName = "CategoryToString", defaultValue = "DEFAULT")
  GermanRelease toGerman(OriginalRelease movies);

  @Named("CategoryToString")
  default String defaultValueForQualifier(Category cat) {
    // 自定义映射逻辑
  }
}
```

如果 `category` 为空，则 MapStruct 会调用 `defaultValueForQualifier(Enum.valueOf(Category.class, "DEFAULT"))` 方法，并将返回值赋给 `category` 字段。

举个栗子：使用默认值和默认方法的映射器。

```java
@Mapper
public interface MovieMapper {
  @Mapping(target = "category", qualifiedByName = "CategoryToString", defaultValue = "Unknown")
  GermanRelease toGerman(OriginalRelease movies);

  @Named("CategoryToString")
  default String defaultValueForQualifier(Category cat) {
    // 自定义映射逻辑
  }

  @Named("CategoryToString")
  default String defaultValueForQualifier(String value) {
    return value;
  }
}
```

在此示例中，当 `category` 为空时，MapStruct 会调用 `defaultValueForQualifier("Unknown")`，将 `"Unknown"` 赋值给 `category`。

如果上面的 `defaultValue` 方案无法满足需求，可以选择使用 `defaultExpression` 来设置默认值。

举个栗子：使用默认表达式的映射器

```java
@Mapper
public interface MovieMapper {
  @Mapping(target = "category", qualifiedByName = "CategoryToString", defaultExpression = "java(\"Unknown\")")
  GermanRelease toGerman(OriginalRelease movies);

  @Named("CategoryToString")
  default String defaultValueForQualifier(Category cat) {
    // 自定义映射逻辑
  }
}
```

此方式会直接将 `"Unknown"` 作为 Java 代码执行，相当于 `category = "Unknown"`，适用于更灵活的默认值赋值场景。

## 映射集合

集合类型（如 `List`、`Set` 等）的映射方式与普通对象的映射方式类似，即通过在映射器接口中定义源类型和目标类型的映射方法。MapStruct 支持 Java 集合框架中的多种可迭代类型。
生成的代码会通过一个循环来遍历源集合，转换每个元素，并将其放入目标集合。如果在当前映射器或关联的映射器中能找到匹配的元素映射方法，MapStruct 就会调用它来进行元素转换，否则就会使用隐式转换。

举个栗子：

```java
@Mapper
public interface CarMapper {
  Set<String> integerSetToStringSet(Set<Integer> integers);

  List<CarDTO> carsToCarDTOs(List<Car> cars);

  CarDTO carToCarDTO(Car car);
}
```

- `integerSetToStringSet()` 方法会将集合中每个 `Integer` 类型的元素转换为 `String` 类型
- `carsToCarDTOs()` 遍历集合，并调用 `carToCarDTO()` 将每个 `Car` 元素转换为 `CarDTO`。

生成的映射器代码实现：

```java hl:11,26
// GENERATED CODE
@Override
public Set<String> integerSetToStringSet(Set<Integer> integers) {
  if (integers == null) {
    return null;
  }

  Set<String> set = new LinkedHashSet<>();

  for (Integer integer : integers) {
    set.add(String.valueOf(integer));
  }

  return set;
}

@Override
public List<CarDTO> carsToCarDTOs(List<Car> cars) {
  if (cars == null) {
    return null;
  }

  List<CarDTO> list = new ArrayList<>();

  for (Car car : cars) {
    list.add(carToCarDTO(car));
  }

  return list;
}
```

当映射对象的集合属性时（如 `Car#passengers` ➡️ `CarDTO#passengers`），MapStruct 会寻找参数和返回类型匹配的集合映射方法：

```java
// GENERATED CODE
carDTO.setPassengers(personsToPersonDTOs(car.getPassengers()));
```

某些框架（如 JAXB）生成的类可能仅提供 getter 方法而没有 setter 方法，此时生成的代码会调用 getter 并通过 `addAll()` 添加元素：

```java
// 生成的代码
carDTO.getPassengers().addAll(personsToPersonDTOs(car.getPassengers()));
```

> [!warning]
> 不允许将可迭代类型映射为非可迭代类型，反之亦然！否则，MapStruct 会抛出错误。

### 映射 Map 集合

MapStruct 也支持 `Map` 集合类型的映射。举个栗子：

```java
public interface SourceTargetMapper {
  @MapMapping(valueDateFormat = "dd.MM.yyyy")
  Map<String, String> longDateMapToStringStringMap(Map<Long, Date> source);
}
```

与集合映射类似，生成的代码会遍历源 `Map`，对键和值进行转换（可通过隐式转换或调用其他映射方法），然后放入目标 `Map` 中。

生成的映射器代码实现：

```java
// GENERATED CODE
@Override
public Map<Long, Date> stringStringMapToLongDateMap(Map<String, String> source) {
  if (source == null) {
    return null;
  }

  Map<Long, Date> map = new LinkedHashMap<>();

  for (Map.Entry<String, String> entry : source.entrySet()) {
    Long key = Long.parseLong(entry.getKey());
    Date value;
    try {
      value = new SimpleDateFormat("dd.MM.yyyy").parse(entry.getValue());
    } catch (ParseException e) {
      throw new RuntimeException(e);
    }

    map.put(key, value);
  }

  return map;
}
```

- 遍历 `source` 的键值对，将 `String` 类型的键转换为 `Long`。
- 使用 `SimpleDateFormat` 将 `String` 类型的值转换为 `Date`。
- 转换后，将键值对存入 `LinkedHashMap` 集合并返回。

### 集合映射策略

MapStruct 提供了 `CollectionMappingStrategy`，可选值包括：
- `ACCESSOR_ONLY`：仅通过 **getter** 访问集合，并调用 `getter().addAll(...)` 添加元素，适用于 **不可变集合** 或 **仅提供 getter** 的对象。
- `SETTER_PREFERRED`：优先调用 **setter** 直接赋值整个集合，适用于 **标准 Java Bean**。
- `ADDER_PREFERRED`：优先使用 **adder 方法**（如 `addItem(T item)`），适用于 **JPA 实体**（如 `@OneToMany` 关系）。
- `TARGET_IMMUTABLE`：目标集合 **不可修改**，尝试变更会抛出异常，适用于 **不可变对象**（如 `record`、Guava `ImmutableList`）。

下表展示了不同策略在目标对象具有或缺少 `set-`、`add-` 和 `get-` 方法时的适用情况（`-s` 表示复数形式）：

| 选项                   | 仅有 `set-s` 方法 | 仅有 `add-` 方法 | 同时有 `set-s` 和 `add-` | 无 `set-s` 或 `add-` 方法 | 目标已存在 (`@TargetType`) |
| -------------------- | ------------- | ------------ | -------------------- | --------------------- | --------------------- |
| **ACCESSOR_ONLY**    | `set-s`       | `get-s`      | `set-s`              | `get-s`               | `get-s`               |
| **SETTER_PREFERRED** | `set-s`       | `add-`       | `set-s`              | `get-s`               | `get-s`               |
| **ADDER_PREFERRED**  | `set-s`       | `add-`       | `add-`               | `get-s`               | `get-s`               |
| **TARGET_IMMUTABLE** | `set-s`       | *异常*         | `set-s`              | *异常*                  | `set-s`               |

`Adder` 方法常用于 JPA 实体（例如 `addChild()`），用于向集合中添加单个元素，同时维护父子关系。MapStruct 通过匹配集合的泛型类型与 `Adder` 方法的参数来确定合适的方法。如果有多个候选方法，MapStruct 会尝试将复数形式的 `Setter` / `Getter` 名称转换为单数进行匹配。

不应直接使用 `DEFAULT`，它仅用于区分 `@MapperConfig` 中用户显式指定的策略和 `@Mapper` 内 MapStruct 采用的默认策略。`DEFAULT` 的行为等同于 `ACCESSOR_ONLY`。

> [!tip]
> 在 JPA 实体中使用 `Adder` 方法时，MapStruct 假设目标集合已初始化（如 `new ArrayList<>()`）。如果需要初始化集合，可以使用工厂方法创建目标实体，而不是依赖 MapStruct 通过构造方法实例化对象。

### 集合映射的默认实现类型

当集合或 `Map` 类型的映射方法返回的是接口类型，MapStruct 会在生成的代码中实例化对应的具体实现。下表列出了支持的接口类型及其在生成代码中对应的默认实现类型：

|**接口类型**|**默认实现类型**|
|---|---|
| `Iterable` | `ArrayList` |
| `Collection` | `ArrayList` |
| `List` | `ArrayList` |
| `Set` | `LinkedHashSet` |
| `SortedSet` | `TreeSet` |
| `NavigableSet` | `TreeSet` |
| `Map` | `LinkedHashMap` |
| `SortedMap` | `TreeMap` |
| `NavigableMap` | `TreeMap` |
| `ConcurrentMap` | `ConcurrentHashMap` |
| `ConcurrentNavigableMap` | `ConcurrentSkipListMap` |
