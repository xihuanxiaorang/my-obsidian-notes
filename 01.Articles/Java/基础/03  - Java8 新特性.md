---
tags:
  - Java
repository: https://github.com/xihuanxiaorang/java-study/tree/core-study/core-study/lambda-study
create_time: 2024-12-28T17:51:00
update_time: 2025/01/16 21:47
---

Lambda 表达式、强大的 Stream API、全新时间日期 API；新特性使得 Java 的运行速度更快、代码更少（Lambda 表达式）、便于并行、最大化减少空指针异常！

## Lambda 表达式

### 抛砖引玉

#### 回顾一下匿名内部类

在介绍如何使用 Lambda 表达式之前，我们先来回顾一下 [[02  - 嵌套类#匿名类]]，例如，我们使用匿名内部类的方式来比较两个 Integer 类型数据的大小。

```java
final Comparator<Integer> comparator = new Comparator<Integer>() {  
  @Override  
  public int compare(final Integer o1, final Integer o2) {  
    return Integer.compare(o1, o2);  
  }  
};
```

接下来，我们就可以将上述匿名内部类的实例对象作为方法参数进行使用，如下所示：

```java hl:7
public class ApiTest {
  @Test
  public void test() {
    final Comparator<Integer> comparator = new Comparator<Integer>() {
      @Override
      public int compare(final Integer o1, final Integer o2) {
        return Integer.compare(o1, o2);
      }
    };
    final TreeSet<Integer> treeSet = new TreeSet<>(comparator);
    treeSet.addAll(Arrays.asList(1, 3, 2, 4, 6, 5));
    treeSet.forEach(System.out::println);
  }
}
```

简单分析下上述代码，可以发现在整个匿名内部类中，实际上真正有用的就是高亮显示的代码（第 7 行），其他的代码实际上都是 "冗余" 的。当我们将鼠标放到匿名内部类上去时，IDEA 会提示 "匿名 `new Comparator<Integer>()` 可被替换为 Lambda" 和 "匿名 `new Comparator<Integer>()` 可被替换为 [[#方法引用]]"。
![](https://cdn.jsdelivr.net/gh/xihuanxiaorang/img2/202412132155072.png)

如果使用 Lambda 表达式完成两个 Integer 类型数据的比较，我们该如何实现呢？

```java hl:4
public class ApiTest {  
  @Test  
  public void test () {  
    final Comparator<Integer> comparator = (o1, o2) -> Integer.compare (o1, o2);  
    final TreeSet<Integer> treeSet = new TreeSet<>(comparator);  
    treeSet.addAll (Arrays.asList (1, 3, 2, 4, 6, 5));  
    treeSet.forEach (System. out::println);  
  }  
}
```

看到没！使用 Lambda 表达式，我们只需一行代码就能够实现两个 Integer 类型数据的比较。还可以直接将 Lambda 表达式传递到 TreeSet 的构造方法中，如下所示：

```java
final TreeSet<Integer> treeSet = new TreeSet<>(((o1, o2) -> Integer.compare (o1, o2)));
```

最直观的感受就是使用 Lambda 表达式一行代码就能搞定匿名内部类多行代码的功能。

#### 举个栗子

🤔看到这，有的小伙伴可能会问：我使用匿名内部类的方式实现比较两个整数类型数据的大小并不复杂啊！我为啥还要学习一种新的语法呢？

🤓我只能说：小伙子，你还是 Too Young Too Simple！接下来，我们一起来写一个稍微复杂一点的例子，来对比下使用匿名内部类和 Lambda 表达式实现相同功能时，哪种方式更加简洁？

假如，现在有一个这样的需求：获取年龄大于 30 岁的员工信息。

准备工作：

1. 定义 Employee 实体类，用于存在员工的姓名、年龄、工资等属性。

	```java
	@Data
	@Builder
	@NoArgsConstructor
	@AllArgsConstructor
	public class Employee {
     /**
      * 姓名
      */
     private String name;
     /**
      * 年龄
      */
     private Integer age;
     /**
      * 工资
      */
     private Double salary;
	}
	```

2. 创建一个用于存储员工信息的集合。

	```java
	public class ApiTest2 {
     private final List<Employee> employees = new ArrayList<>();
	
     @BeforeEach
     public void before() {
       employees.add(new Employee("张三", 18, 9999.99));
       employees.add(new Employee("李四", 38, 5555.55));
       employees.add(new Employee("王五", 60, 6666.66));
       employees.add(new Employee("赵六", 16, 7777.77));
       employees.add(new Employee("田七", 18, 3333.33));
     }
	}	
	```

##### 普通的遍历集合 & if 判断

首先使用遍历集合 & if 判断的方式来过滤出年龄大于等于 30 岁的员工信息。

```java
public static List<Employee> filterEmployeesByAge(List<Employee> employees) {  
  List<Employee> employeeList = new ArrayList<>();  
  for (final Employee employee : employees) {  
    if (employee.getAge() >= 30) {  
      employeeList.add(employee);  
    }  
  }  
  return employeeList;  
}
```

接下来，我们测试一下上面的过滤方法。

```java
@Test  
public void test() {  
  final List<Employee> employeeList = filterEmployeesByAge(employees);  
  employeeList.forEach(System.out::println);  
}
```

测试结果如下所示：

```
Employee(name=李四, age=38, salary=5555.55)  
Employee(name=王五, age=60, salary=6666.66)
```

假设现在需求发生了变化，需要获取工资大于等于 5000 的员工信息。此时，我们不得不再次编写一个按照工资进行过滤的方法。

```java
public static List<Employee> filterEmployeesBySalary(List<Employee> employees) {  
  List<Employee> employeeList = new ArrayList<>();  
  for (final Employee employee : employees) {  
    if (employee.getSalary() >= 5000) {  
      employeeList.add(employee);  
    }  
  }  
  return employeeList;  
}
```

对比 `filterEmployeesByAge()` 和 `filterEmployeesBySalary()` 方法后，可以发现，方法体中大部门内容都是一样的，只是 if 判断条件不同而已。

如果此时需求再次发生变化，如获取年龄小于等于 20 的员工信息，那我们又得重新编写一个过滤方法了，由此看来，使用遍历集合 & if 判断的方式根本无法满足一直在变的需求！

那么，有没有更好的优化方式呢？可能很多小伙伴会说：将公用的方法抽取出来。没错，这是一种优化方式，但它不是最好的。最好的方式是啥呢？当然是设计模式啦！设计模式可是无数前辈们不断实践而总结出来的经验。

##### 第一次优化（设计模式）

那么，如何使用设计模式来优化上面的方法呢？我们接着往下看。

首先，定义一个泛型接口 `MyPredirect` （参考自 [[#Predicate 断言型接口]]），该接口中只定义了一个 `boolean filter(T t)` 方法，该方法由实现类去实现具体的过滤逻辑，判断类型为 T 的对象是否满足条件，如果满足条件的话则返回 true，反之则返回 false。

```java
public interface MyPredicate<T> {  
  boolean filter(T t);  
}
```

然后，编写一个 `MyPredicate` 接口的实现类 `FilterEmployeesByAge` ，用于过滤出年龄大于等于 30 岁的员工信息。

```java
public class FilterEmployeeByAge implements MyPredicate<Employee> {  
  @Override  
  public boolean filter(final Employee employee) {  
    return employee.getAge() >= 30;  
  }  
}
```

然后，我们定义一个过滤员工信息的方法，此方法接收一个待过滤的员工集合以及一个我们自定义的 `MyPredirect` 接口实例，用于在遍历员工集合时将满足条件的员工信息返回。

```java
public static List<Employee> filterEmployees(List<Employee> employees, MyPredicate<Employee> myPredicate) {  
  List<Employee> employeeList = new ArrayList<>();  
  for (final Employee employee : employees) {  
    if (myPredicate.filter(employee)) {  
      employeeList.add(employee);  
    }  
  }  
  return employeeList;  
}
```

接着，我们编写一个测试方法来测试下优化后的代码。

```java
@Test  
public void test2() {  
  final List<Employee> employeeList = filterEmployees(employees, new FilterEmployeeByAge());  
  employeeList.forEach(System.out::println);  
}
```

运行测试方法，测试结果如下所示：

```
Employee(name=李四, age=38, salary=5555.55)  
Employee(name=王五, age=60, salary=6666.66)
```

写到这里，小伙伴们是否有一种豁然开朗的感觉呢？没错，这就是设计模式的魅力！当我们想要获取工资大于等于 5000 的员工信息时，我们只需要新增一个 `MyPredicate` 接口的实现类 `FilterEmployeeBySalary` 即可。

```java
public class FilterEmployeeBySalary implements MyPredicate<Employee> {  
  @Override  
  public boolean filter(final Employee employee) {  
    return employee.getSalary() >= 5000;  
  }  
}
```

编写一个测试方法进行测试。

```java
@Test  
public void test3() {  
  final List<Employee> employeeList = filterEmployees(employees, new FilterEmployeeBySalary());  
  employeeList.forEach(System.out::println);  
}
```

运行测试方法，测试结果如下所示：

```
Employee(name=张三, age=18, salary=9999.99)  
Employee(name=李四, age=38, salary=5555.55)  
Employee(name=王五, age=60, salary=6666.66)  
Employee(name=赵六, age=16, salary=7777.77)
```

可以看到，使用设计模式对代码的结构进行优化之后，无论需求如何变化，按照何种方式进行过滤，都只需要新增 `MyPredicate` 接口的实现类来实现具体的过滤逻辑即可，其他代码都不需要进行改动，满足开闭原则。

使用设计模式也存在不好的地方：每次定义一个过滤策略的时候，都需要新增一个过滤类！！！那么有没有办法不新增过滤类又能实现功能呢？当然有，那就是匿名内部类。

##### 第二次优化（匿名内部类）

我们可以使用匿名内部类的方式实现与 `FilterEmployeeByAge` 和 `FilterEmployeeBySalary` 类相同的功能。

```java
@Test  
public void test4() {  
  final List<Employee> employeeList = filterEmployees(employees, new MyPredicate<Employee>() {  
    @Override  
    public boolean filter(final Employee employee) {  
      return employee.getAge() >= 30;  
    }  
  });  
  employeeList.forEach(System.out::println);  
}  

@Test  
public void test5() {  
  final List<Employee> employeeList = filterEmployees(employees, new MyPredicate<Employee>() {  
    @Override  
    public boolean filter(final Employee employee) {  
      return employee.getSalary() >= 5000;  
    }  
  });  
  employeeList.forEach(System.out::println);  
}
```

运行测试方法，可以发现测试结果与之前的结果相同。

使用匿名内部类的方式虽然可以弥补使用设计模式时容易新增大量过滤类的缺点，但是匿名内部类中冗余的代码还是比较多，那么能不能进一步优化，使得代码更加简洁易读呢？当然有，那就是今天的主角：Lambda 表达式。

##### 第三次优化（Lambda 表达式）

我们可以使用 Lambda 表达式的方式进一步优化上面的代码，实现相同的功能。

```java
@Test  
public void test6() {  
  final List<Employee> employeeList = filterEmployees(employees, employee -> employee.getAge() >= 30);  
  employeeList.forEach(System.out::println);  
}  

@Test  
public void test7() {  
  final List<Employee> employeeList = filterEmployees(employees, employee -> employee.getSalary() >= 5000);  
  employeeList.forEach(System.out::println);  
}
```

可以发现，Lambda 表达式使得代码变得非常简洁，只要编写具体的过滤逻辑即可，至于其他的冗余代码都省却了。

### 基础语法

Java8 中引入了一个新的操作符 "->"，该操作符称为箭头操作符，箭头操作符将 Lambda 表达式拆分成左右两部分：

- 左侧：Lambda 表达式的**参数列表**，空参则括号里面什么都不写
- 右侧：Lambda 表达式中所需执行的功能，即 **Lambda 体**

![](https://fastly.jsdelivr.net/gh/xihuanxiaorang/images/202303071650858.webp)

语法格式如下所示：

- 无参数并且无返回值；

	```java
  () -> System.out.println ("Hello Lambda!");	
	```

- 只有一个参数（参数列表的小括号可以省略）但是无返回值；

	```java
  x -> System.out.println (x);	
	```

- 有两个以上参数并且有返回值，Lambda 体中有多条语句（只有一条语句时，return 和大括号可以省略）

	```java
	Comparator<Integer> com = (x, y) -> {
    System.out.println("函数式接口");
    return Integer.compare(x, y);
	}	
	```

- Lambda 表达式的**参数列表的数据类型可以省略不写**，因为 JVM 编译器通过上下文可以推断出数据类型，即类型推断

	```java
	(Integer x,Integer y)-> Integer.compare(x, y);	
	```

### 方法引用

方法引用 Method Reference，引用一个<u>现有的方法</u>来代替 Lambda 表达式。

基本语法：使用 ":: " 双冒号分隔，左边是具体的类（或对象），右边是需要调用的现有方法。

使用条件：**Lambda 表达式体中调用方法的<u>参数列表</u>、<u>返回值类型</u>必须与函数式接口中的抽象方法保持一致**！！！

#### 对象:: 实例方法

```java hl:8
public class MethodReferenceTest {  
  @Test  
  public void test() {  
    final PrintStream ps = System.out;  
    final Consumer<String> con1 = (s) -> ps.println(s);  
    con1.accept("aaa");  

    final Consumer<String> con2 = ps::println;  
    con2.accept("bbb");  
  }  
}
```

当我们将鼠标放到 Lambda 表达式上时，IDEA 会提示 "Lambda 可被替换为方法引用"。
![](https://cdn.jsdelivr.net/gh/xihuanxiaorang/img2/202412132224970.png)

#### 类:: 静态方法

```java hl:6
@Test  
public void test02(){  
  Comparator<Integer> com1 = (x, y) -> Integer.compare(x, y);  
  System.out.println(com1.compare(1, 2));  

  Comparator<Integer> com2 = Integer::compare;  
  System.out.println(com2.compare(2, 1));  
}
```

#### 类:: 实例方法

> [!tip]
> 当 Lambda 参数列表中的第一个参数作为方法的调用者，第二个参数作为方法的参数时，才能使用 ClassName:: Method。

```java hl:6
@Test  
public void test03(){  
  BiPredicate<String, String> bp1 = (x, y) -> x.equals(y);  
  System.out.println(bp1.test("a","b"));  

  BiPredicate<String, String> bp2 = String::equals;  
  System.out.println(bp2.test("c","c"));  
}
```

#### 构造器引用

> [!note]
> 需要调用的构造器的参数列表要与函数式接口中的抽象方法的参数列表保持一致！

```java hl:3
@Test  
public void test04() {  
  final PersonFactory<Person> personFactory = Person::new;  
  final Person person = personFactory.create("Peter", "Parker");  
  System.out.println(person);  
}  

interface PersonFactory<P extends Person> {  
  P create(String firstName, String lastName);  
}  
```

```java
@Data  
@NoArgsConstructor  
@AllArgsConstructor  
public class Person {  
  private String firstName;  
  private String lastName;  
}
```

### Lambda 作用范围

> [!quote]
> Accessing outer scope variables from Lambda expressions is very similar to anonymous objects. You can access final variables from the local outer scope as well as instance fields and static variables.

⬇️

Lambda 表达式访问外部变量（如局部变量，成员变量，静态变量，默认接口方法）与匿名内部类访问外部变量时的方式非常相似。

#### 访问局部变量

```java
public class LambdaScopeTest {  
  @Test  
  public void test() {  
    int num = 1;  
    Converter<Integer, String> stringConverter = from -> String.valueOf(from + num);  
    final String convert = stringConverter.convert(2);  
    System.out.println(convert); // 3  
  }  

  @FunctionalInterface  
  interface Converter<F, T> {  
    T convert(F from);  
  }  
}
```

这个 num 必须是**不可变值**，如下所示，这样改变值则会报错！

```java
int num = 1;  
Converter<Integer, String> stringConverter = (from) -> String.valueOf(from + num);  
num = 3;
```

> [!quote]
> Variable used in Lambda expression should be final or effectively final ➡️ 从 Lambda 表达式引用的本地变量必须是最终变量或实际上的最终变量。

![](https://cdn.jsdelivr.net/gh/xihuanxiaorang/img2/202412132231795.png)

另外在 Lambda 表达式内部修改也是不允许的；

```java
int num = 1;  
Converter<Integer, String> converter = (from) -> {  
  String value = String.valueOf(from + num);  
  num = 3;  
  return value;  
};
```

#### 访问成员变量和静态变量

与在 Lambda 表达式中访问局部变量相比，在 Lambda 表达式中对成员变量和静态变量拥有读写权限；

```java
static int outerStaticNum;  
int outerNum;  

@Test  
public void test2() {  
  Converter<Integer, String> stringConverter1 = from -> {  
    outerNum = 23;  
    return String.valueOf(from + outerNum);  
  };  
  System.out.println(stringConverter1.convert(2)); // 25  

  Converter<Integer, String> stringConverter2 = from -> {  
    outerStaticNum = 72;  
    return String.valueOf(from + outerStaticNum);  
  };  
  System.out.println(stringConverter2.convert(2)); // 74  
}
```

#### 访问默认接口方法

```java
@FunctionalInterface  
interface IFormula {  
  double calculate(int a);  

  default double sqrt(int a) {  
    return Math.sqrt(a);  
  }  
}
```

`IFormula` 接口中定义了一个带有默认实现的 sqrt 求平方根方法。

- 在匿名内部类中我们可以很方便的访问此方法

	```java
	@Test  
	public void test3() {  
    IFormula formula = new IFormula() {  
      @Override  
      public double calculate(final int a) {  
        return sqrt(a * a);  
      }  
    };  
    System.out.println(formula.calculate(4)); // 4  
	}
	```

- 但是在 Lambda 表达式中无法直接访问此默认方法，这样的代码没法通过编译；

	```java
	IFormula formula = (a) -> sqrt(a * a);
	```

带有默认实现的接口方法，是无法直接在 Lambda 表达式中访问的！其实**接口中的默认方法相当于类中的一个普通方法，而不是静态方法，必须使用实例对象调用方法才行**！所以上面这段代码将无法编译通过。

### 函数式接口

Lambda 表达式需要 "函数式接口" 的支持。何为函数式接口？**函数式接口中有且仅有一个抽象方法**。一般在函数式接口上都会标注一个 `@FunctionalInterface` 注解，该注解的作用就类似于 `@Override` 一样，告诉编译器这是一个函数式接口，用于在编译器期间检测该接口中是否有且仅有一个抽象方法，如果缺失或者拥有多个抽象方法的话则编译不通过。

#### 内置的函数式接口

##### Predicate 断言型接口

内部抽象方法： `boolean test (T t);` 判断类型为 T 的对象是否满足某种约束条件，并返回 boolean 值。它内部提供了一些带有默认实现的方法，可以被用来组合一个复杂的判断逻辑（and, or, negate）。

```java
@Slf4j  
public class FunctionalInterfaceTest {  
  @Test  
  public void test() {  
    Predicate<String> predicate = (s) -> s.length() > 0;  
    String str = "foo";  
    log.info("字符串 {} 的长度是否大于0？{}", str, predicate.test(str));  
    log.info("字符串 {} 的长度是否小于等于0？{}", str, predicate.negate().test(str));  

    Predicate<Boolean> nonNull = Objects::nonNull;  
    Predicate<Boolean> isNull = Objects::isNull;  
    Boolean b = true;  
    log.info("布尔类型的 {} 是否不为null？{}", b, nonNull.test(b));  
    log.info("布尔类型的 {} 是否为null？{}", b, isNull.test(b));  
      
    Predicate<String> isEmpty = String::isEmpty;  
    Predicate<String> isNotEmpty = isEmpty.negate();  
    log.info("字符串 {} 是否为空？{}", str, isEmpty.test(str));  
    log.info("字符串 {} 是否不为空？{}", str, isNotEmpty.test(str));  
  }  
}
```

测试结果如下所示：

```
19:11:53.747 [main] INFO fun.xiaorang.study.java.core.lambda.FunctionalInterfaceTest -- 字符串 foo 的长度是否大于0？true  
19:11:53.751 [main] INFO fun.xiaorang.study.java.core.lambda.FunctionalInterfaceTest -- 字符串 foo 的长度是否小于等于0？false  
19:11:53.751 [main] INFO fun.xiaorang.study.java.core.lambda.FunctionalInterfaceTest -- 布尔类型的 true 是否不为null？true  
19:11:53.751 [main] INFO fun.xiaorang.study.java.core.lambda.FunctionalInterfaceTest -- 布尔类型的 true 是否为null？false  
19:11:53.752 [main] INFO fun.xiaorang.study.java.core.lambda.FunctionalInterfaceTest -- 字符串 foo 是否为空？false  
19:11:53.752 [main] INFO fun.xiaorang.study.java.core.lambda.FunctionalInterfaceTest -- 字符串 foo 是否不为空？true
```

##### Function 函数型接口

内部抽象方法： `R apply (T t);` 对类型为 T 的对象应用操作，并返回结果是 R 类型的对象。通过它内部提供的一些默认方法，组合，链式处理 (compose, andThen)。

```java
@Test  
public void test2() {  
  // 需求：先将字符串反转之后取第一个字符再转换成数字 "123" => 3  
  final Function<String, Integer> toIntegerFunction = Integer::valueOf;  
  final Function<String, String> reserveFunction = this::reserve;  
  final Function<String, String> startsWithFunction = new Something()::startsWith;  
  String str = "123";  

  // andThen 实现  
  final Function<String, Integer> function = reserveFunction.andThen(startsWithFunction).andThen(toIntegerFunction);  
  log.info("字符串 {} 反转之后取第一个字符再转换成数字是 {}", str, function.apply(str));  

  // compose 实现  
  final Function<String, Integer> function1 = toIntegerFunction.compose(startsWithFunction).compose(reserveFunction);  
  log.info("字符串 {} 反转之后取第一个字符再转换成数字是 {}", str, function1.apply(str));  
}  

public String reserve(String str) {  
  int length = str.length();  
  if (str.isEmpty() || length == 1) {  
    return str;  
  }  
  final String left = str.substring(0, length / 2);  
  final String right = str.substring(length / 2, length);  
  return reserve(right) + reserve(left);  
}  

class Something {  
  String startsWith(String s) {  
    return String.valueOf(s.charAt(0));  
  }  
}
```

测试结果如下所示：

```
22:35:49.283 [main] INFO fun.xiaorang.study.java.core.lambda.FunctionalInterfaceTest -- 字符串 123 反转之后取第一个字符再转换成数字是 3  
22:35:49.286 [main] INFO fun.xiaorang.study.java.core.lambda.FunctionalInterfaceTest -- 字符串 123 反转之后取第一个字符再转换成数字是 3
```

##### Supplier 供给型接口

内部抽象方法： `T get ();` 返回类型为 T 的对象。

```java
@Test  
public void test3() {  
  final Supplier<Person> personSupplier = Person::new;  
  log.info("调用 Person 类的无参构造方法创建一个 Person 对象实例：{}", personSupplier.get());  
}
```

测试结果如下所示：

```
22:43:42.262 [main] INFO fun.xiaorang.study.java.core.lambda.FunctionalInterfaceTest -- 调用 Person 类的无参构造方法创建一个 Person 对象实例：Person(firstName=null, lastName=null)
```

##### Consumer 消费型接口

内部抽象方法： `void accept (T t);` 对类型为 T 的对象应用操作。

```java
@Test  
public void test4() {  
  Consumer<Person> greeter = person -> log.info("Hello, {}", person.getFirstName());  
  greeter.accept(new Person("Peter", "Parker"));  
}
```

测试结果如下所示：

```
22:48:21.327 [main] INFO fun.xiaorang.study.java.core.lambda.FunctionalInterfaceTest -- Hello, Peter
```

#### 其他函数式接口

| 函数式接口                            | 参数类型   | 返回类型    | 用途                                                       |
| :------------------------------- | ------ | ------- | -------------------------------------------------------- |
| `BiFunction<T,U,R>`              | T, U   | R       | 对类型为 T, U 参数应用操作，返回 R 类型的结果。包含方法为： `R apply (T t, U u)`     |
| `UnaryOperator` (Function 子接口)    | T      | T       | 对类型为 T 的对象进行一元运算，并返回 T 类型的结果。包含方法为： `T apply (T t)`        |
| `BinaryOperator` (BiFunction 子接口) | T, T    | T       | 对类型为 T 的对象进行二元运算，并返回 T 类型的结果。包含方法为： `T apply (T t1, T t2)` |
| `BiConsumer<T,U>`                | T, U    | void    | 对类型为 T, U 参数应用操作。包含方法为： `void accept (Tt, Uu)`              |
| `BiPredicate<T,U>`               | T, U    | boolean | 包含方法为： `boolean test (Tt, Uu)`                             |
| `ToIntFunction`                  | T      | int     | 计算 `int` 值的函数                                             |
| `ToLongFunction`                 | T      | long    | 计算 `long` 值的函数                                            |
| `ToDoubleFunction`               | T      | double  | 计算 `double` 值的函数                                          |
| `IntFunction`                    | int    | R       | 参数为 `int` 类型的函数                                           |
| `LongFunction`                   | long   | R       | 参数为 `long` 类型的函数                                          |
| `DoubleFunction`                 | double | R       | 参数为 `double` 类型的函数                                        |

## Stream API

流（Stream）是数据渠道，用于操作数据源（集合和数组等）所生成的元素序列。集合讲的是数据，流讲的是计算。

> [!important]
> - Stream 流既不是数据结构，也**不保存数据**，主要目的在于计算。
> - Stream 流**只能被消费一次**，当其执行了终止操作后便说明其已经被消费掉了，多次消费的话会导致 "IllegalStateException" 异常。
> - Stream 流的中间操作是**惰性执行**的，只有终止操作开始时才会执行。

操作 Stream 流的三个步骤：

1. 获取源：通过一个数据源（如：集合、数组、...）创建一个 Stream 流；
2. 中间操作：对数据源的数据进行处理，如 filter、map、sorted、distinct...
3. 终止操作：执行中间操作并产生结果返回，如 forEach、collect、reduce...

![](https://cdn.jsdelivr.net/gh/xihuanxiaorang/img2/202412132241746.jpeg)

### 获取源（创建 Stream 流）

创建 Stream 流的几种方式：

- 从集合 | 数组创建（最常见）
- 使用 Stream. of (T)
- 使用 Stream. builder ()
- 从其他来源（如文件、正则表达式分割等）创建
- 使用无限流：使用 Stream. iterate 和 Stream. generate 方法可以创建无限流，这类流会按需生成或迭代新的元素直至程序显式终止它们

```java hl:16,54,61
public class StreamTest {  
  @Test  
  public void createStreamTest() {  
    final User user1 = new User(1, "张三", 20, "123456", "zs@qq.com");  
    final User user2 = new User(2, "李四", 21, "123456", "ls@qq.com");  
    final User user3 = new User(3, "王五", 22, "123456", "ww@qq.com");  
    final User user4 = new User(4, "赵六", 22, "123456", "zl@qq.com");  
    final User user5 = new User(5, "钱七", 25, "123456", "q7@qq.com");  

    // 从List集合创建Stream流 useListToStream  
    final List<User> userList = List.of(user1, user2, user3, user4, user5);  
    final Stream<User> useListToStream = userList.stream();  

    //从Map集合创建Stream流 useMapEntrySetToStream  
    final Map<Integer, User> userMap = Map.of(user1.getId(), user1, user2.getId(), user2, user3.getId(), user3, user4.getId(), user4, user5.getId(), user5);  
    final Stream<Map.Entry<Integer, User>> useMapEntrySetToStream = userMap.entrySet().stream();  

    // 从数组创建Stream流 useArrayToStream  
    User[] userArray = {user1, user2, user3, user4, user5};  
    final Stream<User> useArrayToStream = Arrays.stream(userArray);  

    // 使用Stream.of()创建Stream流 useStreamOfToStream  
    final Stream<User> useStreamOfToStream = Stream.of(user1, user2, user3, user4, user5);  

    // 使用Stream.builder()创建Stream流 useStreamBuilderToStream  
    final Stream.Builder<User> builder = Stream.builder();  
    builder.add(user1).add(user2).add(user3).add(user4).add(user5);  
    final Stream<User> useStreamBuilderToStream = builder.build();  
    useStreamBuilderToStream.forEach(System.out::println);  

    System.out.println("===========================");  

    // 从文件创建Stream流 useFileToStream  
    final Path path = Paths.get("src", "test", "resources", "stream.txt");  
    try (Stream<String> useFileToStream = Files.lines(path)) {  
      useFileToStream.forEach(System.out::println);  
    } catch (IOException e) {  
      throw new RuntimeException(e);  
    }  

    System.out.println("===========================");  

    // 从正则表达式创建Stream流 useRegexToStream  
    String str = "张三,李四,王五,赵六,钱七";  
    String regex = ",";  
    final Pattern pattern = Pattern.compile(regex);  
    try (Stream<String> useRegexToStream = pattern.splitAsStream(str)) {  
      useRegexToStream.forEach(System.out::println);  
    }  

    System.out.println("===========================");  

    // 使用Stream.iterate()创建Stream流 useIterateToStream  
    try (Stream<Integer> useIterateToStream = Stream.iterate(1, n -> n + 1).limit(10)) {  
      useIterateToStream.forEach(System.out::println);  
    }  

    System.out.println("===========================");  

    // 使用Stream.generate()创建Stream流 useGenerateToStream  
    try (Stream<Integer> useGenerateToStream = Stream.generate(() -> new Random().nextInt(10)).limit(5)) {  
      useGenerateToStream.forEach(System.out::println);  
    }  
  }  
}
```

测试结果如下所示：

```
User(id=1, name=张三, age=20, password=123456, email=zs@qq.com)  
User(id=2, name=李四, age=21, password=123456, email=ls@qq.com)  
User(id=3, name=王五, age=22, password=123456, email=ww@qq.com)  
User(id=4, name=赵六, age=22, password=123456, email=zl@qq.com)  

User(id=5, name=钱七, age=25, password=123456, email=q7@qq.com)  
===========================  
ilovechina  
ilikechina  
===========================  
张三  
李四  
王五  
赵六  
钱七  
===========================  
1  
2  
3  
4  
5  
6  
7  
8  
9  
10  
===========================  
4  
5  
5  
4  
6
```

### 中间操作

准备工作：定义一个 User 类，

```java
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class User {
  /**
   * 用户ID
   */
  private Integer id;
  /**
   * 用户名
   */
  private String name;
  /**
   * 年龄
   */
  private Integer age;
  /**
   * 密码
   */
  private String password;
  /**
   * 邮箱
   */
  private String email;
}
```

#### filter

filter 过滤：将流中满足指定条件的数据保留，去除不满足指定条件的数据。

```java hl:23
@Test  
public void filterStreamTest() {  
  final User user1 = new User(1, "张三", 20, "123456", "zs@qq.com");  
  final User user2 = new User(2, "李四", 21, "123456", null);  
  final User user3 = new User(3, "王五", 22, "123456", "");  
  final User user4 = new User(4, "赵六", 22, "123456", "zl@qq.com");  
  final User user5 = new User(5, "钱七", 25, "123456", "q7@qq.com");  

  // 从List集合创建Stream流 useListToStream  
  final List<User> userList = List.of(user1, user2, user3, user4, user5);  
  final Stream<User> useListToStream = userList.stream();  

  // filter过滤1：筛选年龄在22（含）以上的用户 filterUserList1  
  /*final List<User> filterUserList1 = useListToStream.filter(user -> user.getAge() >= 22).collect(Collectors.toList());  
  filterUserList1.forEach(System.out::println);*/  

  // filter过滤2：筛选填写过邮箱的用户 filterUserList2  
  /*final List<User> filterUserList2 = useListToStream.filter(user -> user.getEmail() != null && !user.getEmail().isEmpty()).collect(Collectors.toList());  
  filterUserList2.forEach(System.out::println);*/  


  // filter过滤3：自定义方法，筛选填写过邮箱的用户 filterUserList3  
  final List<User> filterUserList3 = useListToStream.filter(user -> checkUserEmail(user.getEmail())).collect(Collectors.toList());  
  filterUserList3.forEach(System.out::println);  
}  

private static Boolean checkUserEmail(String userEmail) {  
  return userEmail != null && !userEmail.isEmpty();  
}
```

测试结果如下所示：

```
User(id=1, name=张三, age=20, password=123456, email=zs@qq.com)  
User(id=4, name=赵六, age=22, password=123456, email=zl@qq.com)  
User(id=5, name=钱七, age=25, password=123456, email=q7@qq.com)
```

#### distinct

distinct 去重：去除流中重复的数据，通过流中元素的 hashCode () 和 equals () 方法判断元素是否相等。

> [!note]
> 重写 User 类的 hashCode () 和 equals () 方法，以用户 ID 和用户名是否相同来判断两个 User 对象是否是同一个对象。

```java hl:28,36
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class User {
  /**
   * 用户ID
   */
  private Integer id;
  /**
   * 用户名
   */
  private String name;
  /**
   * 年龄
   */
  private Integer age;
  /**
   * 密码
   */
  private String password;
  /**
   * 邮箱
   */
  private String email;

  @Override
  public boolean equals(final Object o) {
    if (this == o) return true;
    if (o == null || getClass() != o.getClass()) return false;
    final User user = (User) o;
    return Objects.equals(id, user.id) && Objects.equals(name, user.name);
  }

  @Override
  public int hashCode() {
    return Objects.hash(id, name);
  }
}
```

```java hl:5,8
@Test
public void distinctStreamTest() {
  // distinct去重1：基本数据类型去重
  final Stream<Integer> integerStream = Stream.of(1, 1, 2, 3, 4, 4, 5);
  integerStream.distinct().forEach(System.out::println);
  System.out.println("================================");
  final Stream<String> stringStream = Stream.of("Xiaomi", "Apple", "Huawei", "Lenovo", "Apple");
  stringStream.distinct().forEach(System.out::println);
  System.out.println("================================");

  // distinct去重2：自定义对象去重，将重复的User对象去除
  final User user1 = new User(1, "张三", 20, "123456", "zs@qq.com");
  final User user2 = new User(2, "李四", 21, "123456", "ls@qq.com");
  final User user3 = new User(3, "王五", 22, "123456", "ww@qq.com");
  final User user4 = new User(4, "赵六", 22, "123456", "zl@qq.com");
  final User user5 = new User(5, "钱七", 25, "123456", "q7@qq.com");
  final User user6 = new User(5, "钱七", 25, "123456", "q8@qq.com");
  // 从List集合创建Stream流 useListToStream
  final List<User> userList = List.of(user1, user2, user3, user4, user5, user6);
  final Stream<User> useListToStream = userList.stream();
  useListToStream.distinct().forEach(System.out::println);
}
```

测试结果如下所示：

```
1  
2  
3  
4  
5  
================================  
Xiaomi  
Apple  
Huawei  
Lenovo  
================================  
User(id=1, name=张三, age=20, password=123456, email=zs@qq.com)  
User(id=2, name=李四, age=21, password=123456, email=ls@qq.com)  
User(id=3, name=王五, age=22, password=123456, email=ww@qq.com)  
User(id=4, name=赵六, age=22, password=123456, email=zl@qq.com)  
User(id=5, name=钱七, age=25, password=123456, email=q7@qq.com)
```

#### limit

limit 限制：截取流使其最大长度不超过给定数量。

```java hl:14
@Test  
public void limitStreamTest() {  
  final User user1 = new User(1, "张三", 20, "123456", "zs@qq.com");  
  final User user2 = new User(2, "李四", 21, "123456", null);  
  final User user3 = new User(3, "王五", 22, "123456", "");  
  final User user4 = new User(4, "赵六", 22, "123456", "zl@qq.com");  
  final User user5 = new User(5, "钱七", 25, "123456", "q7@qq.com");  

  // 从List集合创建Stream流 useListToStream  
  final List<User> userList = List.of(user1, user2, user3, user4, user5);  
  final Stream<User> useListToStream = userList.stream();  

  // limit截取：前三个用户  
  useListToStream.limit(3).forEach(System.out::println);  
}
```

测试结果如下所示：

```
User(id=1, name=张三, age=20, password=123456, email=zs@qq.com)  
User(id=2, name=李四, age=21, password=123456, email=null)  
User(id=3, name=王五, age=22, password=123456, email=)
```

#### skip

skip 跳过：跳过流中的前 N 个元素，如果流中元素不足 N 个，则返回一个空流。

```java hl:14
@Test  
public void skipStreamTest() {  
  final User user1 = new User(1, "张三", 20, "123456", "zs@qq.com");  
  final User user2 = new User(2, "李四", 21, "123456", null);  
  final User user3 = new User(3, "王五", 22, "123456", "");  
  final User user4 = new User(4, "赵六", 22, "123456", "zl@qq.com");  
  final User user5 = new User(5, "钱七", 25, "123456", "q7@qq.com");  

  // 从List集合创建Stream流 useListToStream  
  final List<User> userList = List.of(user1, user2, user3, user4, user5);  
  final Stream<User> useListToStream = userList.stream();  

  // skip跳过：跳过年龄最小的用户  
  useListToStream.sorted(Comparator.comparingInt(User::getAge)).skip(1).forEach(System.out::println);  
}
```

测试结果如下所示：

```
User(id=2, name=李四, age=21, password=123456, email=null)  
User(id=3, name=王五, age=22, password=123456, email=)  
User(id=4, name=赵六, age=22, password=123456, email=zl@qq.com)  
User(id=5, name=钱七, age=25, password=123456, email=q7@qq.com)
```

#### sorted

sorted 排序：

- 自然排序，适用于内置的数据类型，要求 Stream 内的元素实现 java. lang. Comparable 接口。
- 自定义排序，适用于自定义的数据类型，要求手动实现 Comparable 接口中的 compareTo 方法。其中 compareTo 就是比较两个值，如果前者大于后者，返回 1；两者相等返回 0；前者小于后者返回 -1；更为简单的用法是 Comparator. comparingXxx (比较的属性)。

> [!note]
> 使用 `sorted ()` 对 User 集合进行排序的时候，User 需要实现 Comparable 接口，否则的话会报 ClassCastException 转换异常，无法将 User 对象转换为 Comparable 接口实例！

```java hl:5,41
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class User implements Comparable<User> {
  /**
   * 用户ID
   */
  private Integer id;
  /**
   * 用户名
   */
  private String name;
  /**
   * 年龄
   */
  private Integer age;
  /**
   * 密码
   */
  private String password;
  /**
   * 邮箱
   */
  private String email;

  @Override
  public boolean equals(final Object o) {
    if (this == o) return true;
    if (o == null || getClass() != o.getClass()) return false;
    final User user = (User) o;
    return Objects.equals(id, user.id) && Objects.equals(name, user.name);
  }

  @Override
  public int hashCode() {
    return Objects.hash(id, name);
  }

  @Override
  public int compareTo(final User o) {
    return o.getAge() - this.getAge();
  }
}
```

```java hl:22
@Test  
public void sortedStreamTest() {  
  // sorted排序1：基本数据类型排序  
  final Stream<Integer> integerStream = Stream.of(4, 2, 3, 5, 1);  
  integerStream.sorted().forEach(System.out::println);  
  System.out.println("================================");  
  final Stream<String> stringStream = Stream.of("apple", "lenovo", "Huawei", "Xiaomi", "Lenovo");  
  stringStream.sorted().forEach(System.out::println);  
  System.out.println("================================");  

  // sorted排序2：自定义对象排序，按照年龄从大到小排序  
  final User user1 = new User(1, "张三", 20, "123456", "zs@qq.com");  
  final User user2 = new User(2, "李四", 21, "123456", "ls@qq.com");  
  final User user3 = new User(3, "王五", 22, "123456", "ww@qq.com");  
  final User user4 = new User(4, "赵六", 23, "123456", "zl@qq.com");  
  final User user5 = new User(5, "钱七", 24, "123456", "q7@qq.com");  
  // 从List集合创建Stream流 useListToStream  
  final List<User> userList = List.of(user1, user2, user3, user4, user5);  
  final Stream<User> useListToStream = userList.stream();  
  /*useListToStream.sorted().forEach(System.out::println);*/  
  /*useListToStream.sorted(Comparator.comparingInt(User::getAge)).forEach(System.out::println); // 升序*/  
  useListToStream.sorted(Comparator.comparingInt(User::getAge).reversed()).forEach(System.out::println); // 降序  
}
```

测试结果如下所示：

```
1  
2  
3  
4  
5  
================================  
Huawei  
Lenovo  
Xiaomi  
apple  
lenovo  
================================  
User(id=5, name=钱七, age=24, password=123456, email=q7@qq.com)  
User(id=4, name=赵六, age=23, password=123456, email=zl@qq.com)  
User(id=3, name=王五, age=22, password=123456, email=ww@qq.com)  
User(id=2, name=李四, age=21, password=123456, email=ls@qq.com)  
User(id=1, name=张三, age=20, password=123456, email=zs@qq.com)
```

#### map

map 映射：提供一个映射规则，将流中的每一个元素替换成指定的元素。

```java
@Test  
public void mapStreamTest() {  
  final User user1 = new User(1, "张三", 20, "123456", "zs@qq.com");  
  final User user2 = new User(2, "李四", 21, "123456", null);  
  final User user3 = new User(3, "王五", 22, "123456", "");  
  final User user4 = new User(4, "赵六", 22, "123456", "zl@qq.com");  
  final User user5 = new User(5, "钱七", 25, "123456", "q7@qq.com");  

  // 从List集合创建Stream流 useListToStream  
  final List<User> userList = List.of(user1, user2, user3, user4, user5);  
  final Stream<User> useListToStream = userList.stream();  

  // map映射1：将邮箱的域名更改为 "@sina.com"  
  /*final List<String> mapUserList1 = useListToStream.map(user -> user.getEmail().replace("@qq.com", "@sina.com")).collect(Collectors.toList());  
    mapUserList1.forEach(System.out::println);*/  

  // map映射2：将邮箱的域名更改为 "@sina.com"，返回user集合  
  /*final List<User> mapUserList2 = useListToStream.map(user -> {  
      user.setEmail(user.getEmail().replace("@qq.com", "@sina.com"));  
      return user;  
    }).collect(Collectors.toList());  
    mapUserList2.forEach(System.out::println);*/  

  // map映射3：筛选填写过邮箱的用户，将邮箱的域名更改为 "@sina.com"  
  final List<User> mapUserList3 = useListToStream  
  .filter(user -> checkUserEmail(user.getEmail()))  
  .map(user -> {  
    user.setEmail(user.getEmail().replace("@qq.com", "@sina.com"));  
    return user;  
  }).collect(Collectors.toList());  
  mapUserList3.forEach(System.out::println);  
}

```

测试结果如下所示：

```
User(id=1, name=张三, age=20, password=123456, email=zs@sina.com)  
User(id=4, name=赵六, age=22, password=123456, email=zl@sina.com)  
User(id=5, name=钱七, age=25, password=123456, email=q7@sina.com)
```

#### flatmap

flatmap 扁平化：用于将流中的每个元素映射为一个流，然后将这些流扁平化为一个流。常用于处理嵌套集合、合并多个流等场景。

栗子 1：

```java hl:17
@Test  
public void flatMapStreamTest() {  
  final User user1 = new User(1, "张三", 20, "123456", "zs@qq.com");  
  final User user2 = new User(2, "李四", 21, "123456", "ls@qq.com");  
  final User user3 = new User(3, "王五", 22, "123456", "ww@qq.com");  
  final User user4 = new User(4, "赵六", 23, "123456", "zl@qq.com");  
  final User user5 = new User(5, "钱七", 24, "123456", "q7@qq.com");  

  // 从List集合创建Stream流 useListToStream  
  final List<User> userList1 = List.of(user1, user2);  
  final List<User> userList2 = List.of(user3, user4);  
  final List<User> userList3 = List.of(user5);  
  final List<List<User>> userList = List.of(userList1, userList2, userList3);  
  final Stream<List<User>> useListToStream = userList.stream();  

  // flatMap扁平化：将集合 userList1、userList2、userList3 中超过20岁的用户重新组合到一个新的集合中  
  final List<User> collect = useListToStream.flatMap(List::stream).filter(user -> user.getAge() > 20).collect(Collectors.toList());  
  collect.forEach(System.out::println);  
}
```

测试结果如下所示：

```
User(id=2, name=李四, age=21, password=123456, email=ls@qq.com)  
User(id=3, name=王五, age=22, password=123456, email=ww@qq.com)  
User(id=4, name=赵六, age=23, password=123456, email=zl@qq.com)  
User(id=5, name=钱七, age=24, password=123456, email=q7@qq.com)
```

栗子 2：

```java
@Test  
public void flatMapStreamTest2() {  
  Stream.of("Hello", "World")  
          .map(s -> s.split(""))  // 转换成['H','e','l','l','o'],['W','o','r','l','d'] 两个数组  
          .flatMap(Arrays::stream) // 将两个数组扁平化成为 ['H','e','l','l','o','W','o','r','l','d'] 一个数组  
          .distinct() // 去除重复元素  
          .forEach(System.out::print); // 打印结果：HeloWrd  
}
```

![](https://cdn.jsdelivr.net/gh/xihuanxiaorang/img2/202412132252154.jpeg)

#### peek

peek 遍历处理：生成一个与原始流相同的流，但在每个元素被消费时，提供一个消费函数（Consumer）进行处理，常用于调试。

```java
@Test  
public void peekStreamTest() {  
  final User user1 = new User(1, "张三", 20, "123456", "zs@qq.com");  
  final User user2 = new User(2, "李四", 21, "123456", null);  
  final User user3 = new User(3, "王五", 22, "123456", "");  
  final User user4 = new User(4, "赵六", 22, "123456", "zl@qq.com");  
  final User user5 = new User(5, "钱七", 25, "123456", "q7@qq.com");  

  // 从List集合创建Stream流 useListToStream  
  final List<User> userList = List.of(user1, user2, user3, user4, user5);  
  final Stream<User> useListToStream = userList.stream();  

  // peek遍历1：将集合userList中的用户打印出来  
  /*useListToStream.peek(System.out::println).collect(Collectors.toList());*/  

  // peek遍历2：将集合userList中未填写邮件的用户打印出来  
  useListToStream.filter(user -> !checkUserEmail(user.getEmail())).peek(System.out::println).collect(Collectors.toList());  
}
```

测试结果如下所示：

```
User(id=2, name=李四, age=21, password=123456, email=null)  
User(id=3, name=王五, age=22, password=123456, email=)
```

### 终止操作

#### forEach & ForEachOrdered

forEach & forEachOrdered 遍历：foeEachOrdered 主要用在并行流当中，用于去保证顺序，在并行流下 forEach 肯定会乱序的。

```java
@Test  
public void forEachStreamTest() {  
  final User user1 = new User(1, "张三", 20, "123456", "zs@qq.com");  
  final User user2 = new User(2, "李四", 21, "123456", "ls@qq.com");  
  final User user3 = new User(3, "王五", 22, "123456", "ww@qq.com");  
  final User user4 = new User(4, "赵六", 23, "123456", "zl@qq.com");  
  final User user5 = new User(5, "钱七", 24, "123456", "q7@qq.com");  

  // 从List集合创建Stream流 useListToStream  
  final List<User> userList = List.of(user1, user2, user3, user4, user5);  
  // final Stream<User> useListToStream = userList.stream(); // 串行流  
  final Stream<User> useListToStream = userList.parallelStream(); // 并行流  

  // forEach遍历  
  // useListToStream.forEach(System.out::println);  
  // forEachOrdered遍历  
  useListToStream.forEachOrdered(System.out::println);  
}
```

测试结果如下所示：

```
User(id=1, name=张三, age=20, password=123456, email=zs@qq.com)  
User(id=2, name=李四, age=21, password=123456, email=ls@qq.com)  
User(id=3, name=王五, age=22, password=123456, email=ww@qq.com)  
User(id=4, name=赵六, age=23, password=123456, email=zl@qq.com)  
User(id=5, name=钱七, age=24, password=123456, email=q7@qq.com)
```

#### collect

collect 收集：对流中的数据执行收集操作（如收集到 List，Set，Map 集合中）。在 Collectors 类中提供了许多静态方法，可以方便地创建常见收集实例。

| 方法             | 返回值类型                      | 作用                                                                                                                           |
| -------------- | -------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| toList         | List<T>                    | 用于将流中的元素收集到一个新的 List 集合中                                                                                                     |
| toSet          | Set<T>                     | 用于将流中的元素收集到一个新的 Set 集合中                                                                                                      |
| toMap          | Colection<T, ?, Map<K, U>> | 用于将流中的元素转换为一个 Map。每个元素通过提供的 keyMapper 和 valueMapper 来生成键和值，并支持在键冲突时通过 mergeFunction 来合并值。如果没有定义 mergeFunction，那么在键冲突时报键重复异常！ |
| toCollection   | Colection<T>               | 用于将流中的元素收集到由用户提供的集合类型中。它支持任何实现了 Collection 接口的集合类型（如 ArrayList、LinkedList、HashSet 等）                                         |
| counting       | Long                       | 用于统计流中元素的数量，如果流中没有元素，则返回 0                                                                                                   |
| summingInt     | Integer                    | 用来计算流中元素经过 ToIntFunction 函数处理后的所有 int 值的总和。例如，可以用它来计算一个整数列表中所有数的总和，或者从对象流中提取某个字段的数值并求和。如果流为空，则返回 0                           |
| averagingInt   | Double                     | 用来计算流中元素经过 ToIntFunction 函数处理后的所有 int 值的算术平均值。如果流为空，则返回 0                                                                    |
| summarizingInt | IntSummaryStatistics       | 对流中的元素进行整数值的汇总统计，包括总和、平均值、最大值、最小值等。                                                                                          |
| joining        | String                     | 用于将流中的字符序列元素连接成一个字符串。可以提供分隔符、前缀和后缀。                                                                                          |
| maxBy          | Optional<T>                | 根据给定的比较器选择流中的最大值。如果流为空，返回 Optional. empty ()。                                                                                  |
| minBy          | Optional<T>                | 根据给定的比较器选择流中的最小值。如果流为空，返回 Optional. empty ()。                                                                                  |
| reducing       | 规约产生的类型                    | 根据提供的合并规则将流中的元素合并成一个单一的值。可以用来做如求和、求最大值、求最小值等。                                                                                |
| groupingBy     | Map<K, List<T>>            | 根据流中元素的某个属性值对流进行分组，生成一个 Map，键是属性值，值是该属性值对应的元素列表。                                                                             |
| partitioningBy | Map<Boolean, List<T>>      | 根据给定的条件对流中的元素进行分区，生成一个 Map。键是布尔值，表示元素是否满足条件，值是满足条件或不满足条件的元素列表。                                                               |

```java
@Test  
public void collectStreamTest() {  
  final User user1 = new User(1, "张三", 20, "123456", "zs@qq.com");  
  final User user2 = new User(2, "李四", 21, "123456", "ls@qq.com");  
  final User user3 = new User(3, "王五", 22, "123456", "ww@qq.com");  
  final User user4 = new User(4, "赵六", 22, "123456", "zl@qq.com");  
  final User user5 = new User(5, "钱七", 24, "123456", "q7@qq.com");  
  final User user6 = new User(6, "钱七", 24, "123456", "q7@qq.com");  

  // 从List集合创建Stream流 useListToStream  
  final List<User> userList = List.of(user1, user2, user3, user4, user5, user6);  
  final Stream<User> useListToStream = userList.stream(); // 串行流  

  // 使用joining将用户的用户名连接起来  
  /*final String str = useListToStream.map(User::getName).collect(Collectors.joining(", ", "[", "]"));  
    System.out.println(str);*/  

  // 统计用户数量  
  /*final long count = useListToStream.collect(Collectors.counting());  
    System.out.println(count);*/  

  // 统计用户的年龄总和  
  /*final Integer sumAge = useListToStream.collect(Collectors.summingInt(User::getAge));  
    System.out.println(sumAge);*/  

  // 统计用户的平均年龄  
  /*final Double averageAge = useListToStream.collect(Collectors.averagingInt(User::getAge));  
    System.out.println(averageAge);*/  

  // 统计用户的最小年龄  
  /*final Optional<User> optionalUser = useListToStream  
            .collect(Collectors.minBy(Comparator.comparing(User::getAge)));  
    optionalUser.ifPresent(user -> System.out.println(user.getAge()));*/  

  // 统计用户的最大年龄  
  /*useListToStream  
            .collect(Collectors.maxBy(Comparator.comparing(User::getAge)))  
            .ifPresent(user -> System.out.println(user.getAge()));*/  

  // 对用户年龄的汇总统计  
  /*final IntSummaryStatistics summaryStatistics = useListToStream.collect(Collectors.summarizingInt(User::getAge));  
    System.out.println(summaryStatistics);*/  

  // 根据用户年龄进行分组  
  /*final Map<Integer, List<User>> collect = useListToStream.collect(Collectors.groupingBy(User::getAge));  
    collect.forEach((k, v) -> System.out.println("年龄为 " + k + " 岁的有:" + v));*/  
  // 根据用户年龄进行分组并取出id最大的用户  
  /*final Map<Integer, Optional<User>> collect = useListToStream.collect(Collectors.groupingBy(User::getAge, Collectors.reducing(BinaryOperator.maxBy(Comparator.comparing(User::getId)))));  
    collect.forEach((k, v) -> System.out.println("年龄为 " + k + " 岁的并且id最大的为:" + v.get()));*/  

  // 根据用户年龄是否大于22进行分区  
  /*final Map<Boolean, List<User>> collect = useListToStream.collect(Collectors.partitioningBy(user -> user.getAge() > 22));  
    collect.forEach((k, v) -> {  
      String str = k ? "年龄大于22岁的有:" : "年龄小于等于22岁的有:";  
      System.out.println(str + v);  
    });*/  

  // 使用reducing实现求和的功能  
  /*final Integer sumAge = useListToStream.collect(Collectors.reducing(0, User::getAge, Integer::sum));  
    System.out.println(sumAge);*/  

  // 使用reducing实现求最大值的功能  
  /*useListToStream  
            .collect(Collectors.reducing(BinaryOperator.maxBy(Comparator.comparing(User::getAge))))  
            .ifPresent(user -> System.out.println(user.getAge()));*/  

  // 将用户信息收集到Map集合中  
  final Map<String, User> collect = useListToStream.collect(Collectors.toMap(User::getName, Function.identity(), (u1, u2) -> u2));  
  collect.forEach((k, v) -> System.out.println(k + ":" + v));  
}
```

测试结果如下所示：

```
钱七:User(id=6, name=钱七, age=24, password=123456, email=q7@qq.com)  
李四:User(id=2, name=李四, age=21, password=123456, email=ls@qq.com)  
张三:User(id=1, name=张三, age=20, password=123456, email=zs@qq.com)  
王五:User(id=3, name=王五, age=22, password=123456, email=ww@qq.com)  
赵六:User(id=4, name=赵六, age=22, password=123456, email=zl@qq.com)
```

##### 详解 collect 方法

```java
<R> R collect(Supplier<R> supplier, BiConsumer<R, ? super T> accumulator, BiConsumer<R, R> combiner);
```

该方法用于将流中的元素收集到某个容器（或对象）中，并允许自定义收集过程。它提供了一个非常灵活的机制，通过三个参数 (supplier, accumulator, combiner) 来定义如何进行收集。

- `Supplier<R> supplier`
	- 描述：提供一个新的结果容器（R）的方法。
    - 作用：用于初始化一个空的容器，收集的结果将存储在这个容器中。
    - 通常是工厂方法，例如 ArrayList:: new、HashSet:: new 等。
- `BiConsumer<R, ? super T> accumulator`
    - 描述：定义如何将流中的元素逐个添加到结果容器中的方法。
    - 作用：流中的每个元素（T）会通过这个方法被放入到容器（R）中。
    - 通常实现为对容器进行修改的操作，例如 List:: add。
- `BiConsumer<R, R> combiner`
    - 描述：定义如何将两个部分结果容器（R 和 R）合并的方法。
    - 作用：在并行流中，多个线程可能会产生多个部分结果容器，这个方法定义了如何合并这些容器。
    - 在串行流中，这个方法通常不会被调用，但它仍然需要定义。

![](https://cdn.jsdelivr.net/gh/xihuanxiaorang/img2/202412132256215.png)

```java
@Test  
public void collectStreamTest2() {  
  // 仿Collectors.toList()方法实现一个toList()  
  final ArrayList<Integer> collect = Stream.of(1, 2, 3, 4).collect(ArrayList::new, ArrayList::add, ArrayList::addAll);  
  System.out.println(collect); // [1, 2, 3, 4]  

  // 仿Collectors.toMap()方法实现一个toMap()  
  final User user1 = new User(1, "张三", 20, "123456", "zs@qq.com");  
  final User user2 = new User(2, "李四", 21, "123456", "ls@qq.com");  
  final User user3 = new User(3, "王五", 22, "123456", "ww@qq.com");  
  final User user4 = new User(4, "赵六", 22, "123456", "zl@qq.com");  
  final User user5 = new User(5, "钱七", 24, "123456", "q7@qq.com");  
  final HashMap<String, Integer> collect1 = Stream.of(user1, user2, user3, user4, user5)  
  .collect(HashMap::new,  
           (map, element) -> map.merge(element.getName(), element.getAge(), (e1, e2) -> e1), HashMap::putAll);  
  System.out.println(collect1); // {钱七=24, 李四=21, 张三=20, 王五=22, 赵六=22}  
}
```

> [!tip]
> 其中 merge 方法可以方便地将一个键和值合并到 Map 中，同时允许通过一个自定义的合并逻辑（remappingFunction）来处理键冲突的情况。

测试结果如下所示：

```
[1, 2, 3, 4]  
{钱七=24, 李四=21, 张三=20, 王五=22, 赵六=22}
```

#### toArray

toArray：将流中的元素保存到一个数组当中。

```java
@Test  
public void toArrayStreamTest() {  
  final User user1 = new User(1, "张三", 20, "123456", "zs@qq.com");  
  final User user2 = new User(2, "李四", 21, "123456", "ls@qq.com");  
  final User user3 = new User(3, "王五", 22, "123456", "ww@qq.com");  
  final User user4 = new User(4, "赵六", 22, "123456", "zl@qq.com");  
  final User user5 = new User(5, "钱七", 24, "123456", "q7@qq.com");  

  // 从List集合创建Stream流 useListToStream  
  final List<User> userList = List.of(user1, user2, user3, user4, user5);  
  final Stream<User> useListToStream = userList.stream();  

  // 将Stream流中的元素收集到数组中  
  final User[] users = useListToStream.toArray(User[]::new);  
  for (final User user : users) {  
    System.out.println(user);  
  }  
}
```

测试结果如下所示：

```
User(id=1, name=张三, age=20, password=123456, email=zs@qq.com)  
User(id=2, name=李四, age=21, password=123456, email=ls@qq.com)  
User(id=3, name=王五, age=22, password=123456, email=ww@qq.com)  
User(id=4, name=赵六, age=22, password=123456, email=zl@qq.com)  
User(id=5, name=钱七, age=24, password=123456, email=q7@qq.com)
```

#### findFirst & findAny

- findFirst：返回流中的第一个元素
- findAny：返回流中的任意一个元素

> [!info]
> 串行流中 2 个 find 方法返回的结果一样；并行流中 findAny 返回最先处理完毕的数据。
> 2 个 find 方法均返回一个 Optional 对象，在访问其值之前先检查 Optional 对象是否存在值。

```java
@Test  
public void findXxxStreamTest() {  
  final User user1 = new User(1, "张三", 20, "123456", "zs@qq.com");  
  final User user2 = new User(2, "李四", 21, "123456", "ls@qq.com");  
  final User user3 = new User(3, "王五", 22, "123456", "ww@qq.com");  
  final User user4 = new User(4, "赵六", 22, "123456", "zl@qq.com");  
  final User user5 = new User(5, "钱七", 24, "123456", "q7@qq.com");  

  // 从List集合创建Stream流 useListToStream  
  final List<User> userList = List.of(user1, user2, user3, user4, user5);  
  final Stream<User> useListToStream = userList.stream(); // 串行流  

  // 查找第一个大于20岁的用户  
  // useListToStream.filter(user -> user.getAge() > 20).findFirst().ifPresent(System.out::println);  

  // 查找任意一个大于20岁的用户  
  useListToStream.filter(user -> user.getAge() > 20).findAny().ifPresent(System.out::println);  
}
```

测试结果如下所示：

```
User(id=2, name=李四, age=21, password=123456, email=ls@qq.com)
```

#### allMatch & noneMatch & anyMatch

- allMatch：当流中所有的元素都匹配指定的规则时才会返回 true，否则返回 false。
- noneMatch：当流中所有的元素都无法匹配指定的规则时才返回 true，否则返回 false。
- anyMatch：当流中任意一个元素匹配指定的规则时就会返回 true，流中所有的元素都无法匹配指定的规则时返回 false。

```java
@Test  
public void allAndAnyAndNoneMatchStreamTest() {  
  final User user1 = new User(1, "张三", 20, "123456", "zs@qq.com");  
  final User user2 = new User(2, "李四", 21, "123456", "ls@qq.com");  
  final User user3 = new User(3, "王五", 22, "123456", "ww@qq.com");  
  final User user4 = new User(4, "赵六", 22, "123456", "zl@qq.com");  
  final User user5 = new User(5, "钱七", 24, "123456", "q7@qq.com");  

  // 从List集合创建Stream流 useListToStream  
  final List<User> userList = List.of(user1, user2, user3, user4, user5);  
  final Stream<User> useListToStream = userList.stream();  

  // 判断用户是否全部大于23岁？  
  /*final boolean allMatch = useListToStream.allMatch(user -> user.getAge() > 23);  
    System.out.println("allMatch = " + allMatch);*/  

  // 判断是否存在超过23岁的用户？  
  final boolean anyMatch = useListToStream.anyMatch(user -> user.getAge() > 23);  
  System.out.println("anyMatch = " + anyMatch);  
}
```

测试结果如下所示：

```
anyMatch = true
```

#### min & max & count & sum

- min、max 方法均返回一个 Optional 对象，在访问其值之前要先检查 Optional 对象是否存在值。
- count 方法返回 long。
- sum 方法仅适用于 IntStream、LongStream 和 DoubleStream 创建的流。

```java
@Test  
public void maxAndMinAndCountAndSumStreamTest() {  
  final Stream<Integer> stream = Stream.of(10, 20, 33, 6, 49);  

  // max|min  
  // stream.max(Integer::compareTo).ifPresent(System.out::println);  
  // stream.min(Integer::compareTo).ifPresent(System.out::println);  

  // count  
  final long count = stream.count();  
  System.out.println("count = " + count);  

  final IntStream intStream = IntStream.of(10, 20, 33, 6, 49);  
  final int sum = intStream.sum();  
  System.out.println("sum = " + sum);  
}
```

测试结果如下所示：

```
count = 5  
sum = 118
```

#### reduce

reduce 聚合：本意为缩减，引申为聚合，也叫规约。是指将流中的数据按照一定的规则计算合并成单个值（Optional 对象）

基本语法：reduce (identity, accumulator, combiner)

- identity：代表（每个线程的）初始值，可省略。省略时，将 Stream 流的第一个值作为初始值。
- accumulator：代表累加器，它是一个二元运算器，指定当前元素与下一个元素合并的方式。
- combiner：代表组合器，可省略。在并行流中组合器用来合并多线程计算的结果，在串行流中不起作用。

```java
@Test  
public void reduceStreamTest() {  
  System.out.println("=====================================1个参数（累加器）的版本=====================================");  

  // 使用reduce实现求和  
  Stream.of(1, 2, 3).reduce(Integer::sum).ifPresent(sum -> System.out.println("sum = " + sum));  

  // 使用reduce求最大值  
  Stream.of(3, 5, 11, 99, 12).reduce(Integer::max).ifPresent(max -> System.out.println("max = " + max));  

  // 使用reduce实现字符串拼接  
  Stream.of("Hello", "Java", "Stream", "!").reduce((s1, s2) -> s1 + " " + s2).ifPresent(str -> System.out.println("str = " + str));  

  final User user1 = new User(1, "张三", 20, "123456", "zs@qq.com");  
  final User user2 = new User(2, "李四", 21, "123456", "ls@qq.com");  
  final User user3 = new User(3, "王五", 22, "123456", "ww@qq.com");  
  final User user4 = new User(4, "赵六", 22, "123456", "zl@qq.com");  
  final User user5 = new User(5, "钱七", 24, "123456", "q7@qq.com");  

  // 从List集合创建Stream流 useListToStream  
  final List<User> userList = List.of(user1, user2, user3, user4, user5);  
  final Stream<User> useListToStream = userList.stream();  

  // 求用户的最大年龄  
  useListToStream.map(User::getAge).reduce(Integer::max).ifPresent(maxAge -> System.out.println("maxAge = " + maxAge));  

  System.out.println("==================================2个参数（初始值，累加器）的版本==================================");  

  // 使用reduce实现求和  
  Integer identity = 10;  
  final Integer sum = Stream.of(1, 2, 3, 4).reduce(identity, (n1, n2) -> {  
    final String format = String.format("n1(%d) + n2(%d) = %d %s", n1, n2, n1 + n2, Thread.currentThread().getName());  
    System.out.println(format);  
    return n1 + n2;  
  });  
  System.out.println("sum = " + sum);  
  System.out.println("----------------------------------");  
  final Integer sum2 = Stream.of(1, 2, 3, 4).parallel().reduce(identity, (n1, n2) -> {  
    final String format = String.format("n1(%d) + n2(%d) = %d %s", n1, n2, n1 + n2, Thread.currentThread().getName());  
    System.out.println(format);  
    return n1 + n2;  
  });  
  System.out.println("sum2 = " + sum2);  

  System.out.println("================================3个参数（初始值，累加器，组合器）的版本================================");  
  final Integer sum3 = Stream.of(1, 2, 3, 4).parallel().reduce(identity, (n1, n2) -> {  
    final String format = String.format("累加器 n1(%d) + n2(%d) = %d %s", n1, n2, n1 + n2, Thread.currentThread().getName());  
    System.out.println(format);  
    return n1 + n2;  
  }, (x, y) -> {  
    final String format = String.format("组合器 n1(%d) + n2(%d) - identity(%d) = %d %s", x, y, identity, x + y - identity, Thread.currentThread().getName());  
    System.out.println(format);  
    return x + y - identity;  
  });  
  System.out.println("sum3 = " + sum3);  
}
```

测试结果如下所示：

```
=====================================1个参数（累加器）的版本=====================================  
sum = 6  
max = 99  
str = Hello Java Stream !  
maxAge = 24  
==================================2个参数（初始值，累加器）的版本==================================  
n1(10) + n2(1) = 11 main  
n1(11) + n2(2) = 13 main  
n1(13) + n2(3) = 16 main  
n1(16) + n2(4) = 20 main  
sum = 20  
----------------------------------  
n1(10) + n2(3) = 13 main  
n1(10) + n2(4) = 14 main  
n1(13) + n2(14) = 27 main  
n1(10) + n2(2) = 12 ForkJoinPool.commonPool-worker-1  
n1(10) + n2(1) = 11 main  
n1(11) + n2(12) = 23 main  
n1(23) + n2(27) = 50 main  
sum2 = 50  
================================3个参数（初始值，累加器，组合器）的版本================================  
累加器 n1(10) + n2(2) = 12 ForkJoinPool.commonPool-worker-2  
累加器 n1(10) + n2(3) = 13 main  
累加器 n1(10) + n2(1) = 11 ForkJoinPool.commonPool-worker-1  
累加器 n1(10) + n2(4) = 14 ForkJoinPool.commonPool-worker-3  
组合器 n1(11) + n2(12) - identity(10) = 13 ForkJoinPool.commonPool-worker-1  
组合器 n1(13) + n2(14) - identity(10) = 17 ForkJoinPool.commonPool-worker-3  
组合器 n1(13) + n2(17) - identity(10) = 20 ForkJoinPool.commonPool-worker-3  
sum3 = 20
```

### 并行流

并行流就是将数据分拆成多个部分来进行处理，每个部分可以交给不同的线程来并发处理，以达到提高处理速度的效果。

创建并行流，只需在串行流上调用 parallel () 方法即可，或者直接在获取源时使用 parallelStream ()。

并行流针对无状态转换的操作效果提升明显，而对有状态转换的操作反而会导致性能下降。

- 无状态：Stream 流中的元素处理不受其他元素的影响，如 filter、map、flatMap、peek...
- 有状态：只有拿到 Stream 流中的全部元素之后，才能执行的操作，如 distinct、sorted、limit、skip...

```java
@Test  
public void parallelStreamTest() {  
  // 串行流  
  // final Stream<Integer> stream = Stream.of(1, 2, 3, 4, 5);  
  // 并行流  
  // final Stream<Integer> stream = Stream.of(1, 2, 3, 4, 5).parallel();  
  final Stream<Integer> stream = Arrays.asList(1, 2, 3, 4, 5).parallelStream();  

  // 流的线程信息  
  stream.peek(integer -> System.out.println(integer + ":" + Thread.currentThread().getName())).collect(Collectors.toList());  
}
```

测试结果如下所示：

```
2:ForkJoinPool.commonPool-worker-1  
3:main  
4:ForkJoinPool.commonPool-worker-4  
1:ForkJoinPool.commonPool-worker-3  
5:ForkJoinPool.commonPool-worker-2
```

## Optional

JDK1.8 添加的容器对象，在一些场景下避免使用 NULL 检查而设定的类，尽可能避免的 <span style="background:rgba(255, 183, 139, 0.55)">NullPointerException</span> 异常。

#### 创建 Optional 实例

Optional 私有了构造函数，因此只能通过 Optional 对外提供的三个静态方法构造实例

- `public static<T> Optional<T> empty ()` 返回一个空的 Optional 实例，即不包含任何值的 Optional。这个方法通常用于表示空值的情况。
- `public static <T> Optional<T> of (T value)` 创建一个包含非空值的 Optional 实例。如果传入的值为 null 的话会直接抛出 <span style="background:rgba(255, 183, 139, 0.55)">NullPointerException</span> 异常。
- `public static <T> Optional<T> ofNullable (T value)` 创建一个 Optional 实例。如果传入的值是 null，则返回一个空的 Optional（Optional. empty ()）。否则，返回一个包含该值的 Optional。

#### Optional 实例方法

##### get

该方法适用于**确定 Optional 中存在值**的情况。如果 Optional 中没有值，调用该方法将会抛出 <span style="background:rgba(255, 183, 139, 0.55)">NoSuchElementException</span> 异常。

```java
public class OptionalTest {  
  @Test  
  public void test() {  
    final Optional<Object> empty = Optional.empty();  
    // System.out.println("empty.get() = " + empty.get()); // 抛出 NoSuchElementException 异常  

    final Optional<Object> nullable = Optional.ofNullable(null);  
    // System.out.println("nullable.get() = " + nullable.get());  // 抛出 NoSuchElementException 异常  
      
    final Optional<String> non = Optional.of("test");  
    System.out.println("non.get() = " + non.get()); // non.get() = test  
  }  
}
```

##### orElse

该方法用于在 Optional 中的值不存在时提供一个备用值。它的作用是从 Optional 中获取值，如果值存在则返回该值，如果值为空（即 Optional 中没有值），则返回传入的备用值。

```java
@Test  
public void test2() {  
  Object data1 = Optional.ofNullable(null).orElse("data");  
  System.out.println(data1); // data  
  Object data2 = Optional.of("data1").orElse("data2");  
  System.out.println(data2); // data1  
}

```

##### orElseGet

该方法用于在 Optional 中的值不存在时提供一个备用值。与 orElse (T other) 不同，orElseGet 允许你提供一个**延迟计算**的备用值，而不是直接传入一个常量值。

```java
@Test  
public void test3() {  
  final Object str = Optional.empty().orElseGet(() -> "Default Value");  
  System.out.println(str); // Default Value  

  final String str2 = Optional.of("Hello, World!").orElseGet(() -> "Default Value");  
  System.out.println(str2); // Hello, World!  
}
```

##### orElseThrow

该方法用于在 Optional 中没有值时，抛出一个自定义的异常。`orElseThrow (Supplier<? extends X> exceptionSupplier)` 允许你通过一个 Supplier 动态生成一个自定义的异常。

```java
@Test  
public void test4() {  
  final String res = Optional.of("Hello, World!").orElseThrow(() -> new IllegalArgumentException("Value is missing"));  
  System.out.println(res); // Hello, World!  

  final Object res2 = Optional.empty().orElseThrow(() -> new IllegalArgumentException("Value is missing"));  
  System.out.println(res2); // 抛出 IllegalArgumentException 异常  
}
```

##### isPresent

该方法用于检查 Optional 实例中是否存在值。如果 Optional 中包含值，则返回 true；如果 Optional 中为空（即没有值），则返回 false。

```java
@Test  
public void test5() {  
  final boolean b1 = Optional.empty().isPresent(); // false  
  final boolean b2 = Optional.ofNullable(null).isPresent(); // false  
  final boolean b3 = Optional.of("Hello, World!").isPresent(); // true  
}
```

##### ifPresent

该方法用于在 Optional 中包含值时执行给定的 Consumer 操作。该方法是 Optional 类中最常用的功能之一，它避免了显式的空值检查，并且是函数式编程风格的体现。

```java
@Test  
public void test6() {  
  Optional.empty().ifPresent(System.out::println); // 不执行任何操作  
  Optional.of("Hello, World!").ifPresent(System.out::println); // "Hello, World!"  
}

```

##### filter

该方法基于提供的条件过滤 Optional 的值。如果 Optional 中的值满足提供的 Predicate 条件，则返回包含该值的 Optional；否则返回一个空的 Optional。

```java
@Test  
public void test7() {  
  Predicate<Integer> predicate = num -> num > 40;  
  Optional.of(42).filter(predicate).ifPresent(System.out::println); // 42  
  Optional.of(30).filter(predicate).ifPresent(System.out::println); // 不执行任何操作  
}
```

##### map

该方法用于将 Optional 中的值映射到另一个类型。该方法接受一个 Function 类型的参数，它描述了如何转换 Optional 中的值。如果 Optional 中有值，则使用 Function 对该值进行转换，并返回一个包含新值的 Optional；如果 Optional 为空，则直接返回一个空的 Optional。

```java
@Test  
public void test8() {  
  Optional.of("hello").map(String::toUpperCase).ifPresent(System.out::println); // HELLO  
  Optional.of(42).map(String::valueOf).ifPresent(System.out::println); // 42  
}

```

##### flatMap

该方法用于将 Optional 中的值映射到另一个 Optional。与 map 不同，flatMap 会扁平化结果，因此返回的是一个 `Optional<U>`，而不是 `Optional<Optional<U>>`。

```java
@Test  
public void test9 () {  
  final Optional<String> optional1 = Optional.of ("hello");  
  final Optional<String> optional2 = Optional.of ("world");  
  optional1.flatMap (s1 -> optional2.map (s2 -> s1 + " " + s2)). ifPresent (System. out::println); // hello world  
}
```

## 新时间与日期 API

<span style="background:rgba(240, 167, 216, 0.55)">TODO</span>
