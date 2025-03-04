---
tags:
  - DevKit
  - Java
update_time: 2025/03/04 23:18
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
@Generated(
  value = "org.mapstruct.ap.MappingProcessor",
  date = "2025-03-01T19:12:50+0800",
  comments = "version: 1.6.3, compiler: javac, environment: Java 17.0.13 (Amazon.com Inc.)"
)
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
> 构建器类型也可以通过 **对象工厂（Object Factory）** 进行管理。例如，如果 `PersonBuilder` 具有对应的对象工厂，MapStruct 会**优先使用工厂创建 `PersonBuilder` 实例，而不是直接调用 `Person.builder ()` 方法。**

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

在某些情况下，可能需要将 `Map<String, ???>` 映射到特定的 Java Bean 中。MapStruct 提供了一种透明的方式来进行此类映射，即通过目标 Bean 的属性（或 `@Mapping#source` 显式指定的属性）来提取 Map 中的值。

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
- ✅**支持 `@Mapper#uses` 关联其他映射器进行复杂类型转换**
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

在这个示例中， `MyConverter` 接口使用 `@AnnotateWith` 注解来指定在生成的实现类上添加 `@Converter` 注解，并设置 `generateBulkLoader` 属性为 `true`。同时，`map()` 方法也添加 `@Converter` 注解，表明它是一个转换方法。

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

如果不使用依赖注入（DI）框架，可以通过 `org.mapstruct.factory.Mappers` 类获取映射器实例。只需调用 `getMapper()` 方法，并传入映射器接口类型即可。
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

如果你正在使用依赖注入框架，如 CDI（Java EE 的上下文和依赖注入）或 Spring 框架，建议**通过依赖注入地方式获取映射器实例**，而不是通过上述的 `Mappers` 工厂。为此，你可以通过 `@Mapper(componentModel = "spring")` 或 `@Mapper(componentModel = "cdi")` 指定组件模型，或者在[[#^d4dc33|编译选项]]中配置全局默认组件模型。

目前支持 CDI 和 Spring（后者可通过其自定义注解或使用 JSR 330 注解）。请参阅[[#^d4dc33|编译选项]]以了解 `componentModel` 属性的可选值，这些值与 `mapstruct.defaultComponentModel` 处理器选项相同，常量定义在 `MappingConstants.ComponentModel` 类中。在这两种情况下，都会在生成的映射器实现类中添加上所需的注解，以便使其可以进行依赖注入。以下是一个使用 CDI 的示例：

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
