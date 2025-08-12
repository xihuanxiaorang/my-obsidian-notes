---
tags:
  - Java/JavaSE
version: JDK8
create_time: 2025/07/14 23:30
update_time: 2025/07/23 19:17
priority: 1
---

## 抛砖引玉

### 回顾一下匿名内部类

在介绍如何使用 Lambda 表达式之前，我们先来回顾一下[[嵌套类#匿名类|匿名内部类]]，例如，我们使用匿名内部类的方式来比较两个 Integer 类型数据的大小。

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

简单分析下上述代码，可以发现在整个匿名内部类中，实际上真正有用的就是高亮显示的代码（第 7 行），其他的代码实际上都是 "冗余" 的。当我们将鼠标放到匿名内部类上去时，IDEA 会提示 "匿名 `new Comparator<Integer>()` 可被替换为 Lambda" 和 "匿名 `new Comparator<Integer>()` 可被替换为[[#方法引用]]"。
![](https://img.xiaorang.fun/202502251812769.png)

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

### 举个栗子

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

#### 普通的遍历集合 & if 判断

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

```text
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

#### 第一次优化（设计模式）

那么，如何使用设计模式来优化上面的方法呢？我们接着往下看。

首先，定义一个泛型接口 `MyPredirect`（参考自 [[#Predicate 断言型接口]]），该接口中只定义了一个 `boolean filter(T t)` 方法，该方法由实现类去实现具体的过滤逻辑，判断类型为 T 的对象是否满足条件，如果满足条件的话则返回 true，反之则返回 false。

```java
public interface MyPredicate<T> {
  boolean filter(T t);
}
```

然后，编写一个 `MyPredicate` 接口的实现类 `FilterEmployeesByAge`，用于过滤出年龄大于等于 30 岁的员工信息。

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

```text
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

```text
Employee(name=张三, age=18, salary=9999.99)
Employee(name=李四, age=38, salary=5555.55)
Employee(name=王五, age=60, salary=6666.66)
Employee(name=赵六, age=16, salary=7777.77)
```

可以看到，使用设计模式对代码的结构进行优化之后，无论需求如何变化，按照何种方式进行过滤，都只需要新增 `MyPredicate` 接口的实现类来实现具体的过滤逻辑即可，其他代码都不需要进行改动，满足开闭原则。

使用设计模式也存在不好的地方：每次定义一个过滤策略的时候，都需要新增一个过滤类！！！那么有没有办法不新增过滤类又能实现功能呢？当然有，那就是匿名内部类。

#### 第二次优化（匿名内部类）

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

#### 第三次优化（Lambda 表达式）

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

## 基础语法

Java8 中引入了一个新的操作符 "->"，该操作符称为箭头操作符，箭头操作符将 Lambda 表达式拆分成左右两部分：

- 左侧：Lambda 表达式的**参数列表**，空参则括号里面什么都不写
- 右侧：Lambda 表达式中所需执行的功能，即 **Lambda 体**

![](https://img.xiaorang.fun/202502251812770.png)

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

## 方法引用

方法引用 Method Reference，引用一个<u>现有的方法</u>来代替 Lambda 表达式。

基本语法：使用 ":: " 双冒号分隔，左边是具体的类（或对象），右边是需要调用的现有方法。

使用条件：**Lambda 表达式体中调用方法的<u>参数列表</u>、<u>返回值类型</u>必须与函数式接口中的抽象方法保持一致**！！！

### 对象:: 实例方法

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
![](https://img.xiaorang.fun/202502251812771.png)

### 类:: 静态方法

```java hl:6
@Test
public void test02(){
  Comparator<Integer> com1 = (x, y) -> Integer.compare(x, y);
  System.out.println(com1.compare(1, 2));

  Comparator<Integer> com2 = Integer::compare;
  System.out.println(com2.compare(2, 1));
}
```

### 类:: 实例方法

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

### 构造器引用

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

## Lambda 作用范围

> [!quote]
> Accessing outer scope variables from Lambda expressions is very similar to anonymous objects. You can access final variables from the local outer scope as well as instance fields and static variables.

⬇️

Lambda 表达式访问外部变量（如局部变量，成员变量，静态变量，默认接口方法）与匿名内部类访问外部变量时的方式非常相似。

### 访问局部变量

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
> Variable used in Lambda expression should be final or effectively final → 从 Lambda 表达式引用的本地变量必须是最终变量或实际上的最终变量。

![](https://img.xiaorang.fun/202502251812772.jpeg)

另外在 Lambda 表达式内部修改也是不允许的；

```java
int num = 1;
Converter<Integer, String> converter = (from) -> {
  String value = String.valueOf(from + num);
  num = 3;
  return value;
};
```

### 访问成员变量和静态变量

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

### 访问默认接口方法

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

## 函数式接口

Lambda 表达式需要 "函数式接口" 的支持。何为函数式接口？**函数式接口中有且仅有一个抽象方法**。一般在函数式接口上都会标注一个 `@FunctionalInterface` 注解，该注解的作用就类似于 `@Override` 一样，告诉编译器这是一个函数式接口，用于在编译器期间检测该接口中是否有且仅有一个抽象方法，如果缺失或者拥有多个抽象方法的话则编译不通过。

### 内置的函数式接口

#### Predicate 断言型接口

内部抽象方法：`boolean test (T t);` 判断类型为 T 的对象是否满足某种约束条件，并返回 boolean 值。它内部提供了一些带有默认实现的方法，可以被用来组合一个复杂的判断逻辑（and, or, negate）。

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

```text
19:11:53.747 [main] INFO fun.xiaorang.study.java.core.lambda.FunctionalInterfaceTest -- 字符串 foo 的长度是否大于0？true
19:11:53.751 [main] INFO fun.xiaorang.study.java.core.lambda.FunctionalInterfaceTest -- 字符串 foo 的长度是否小于等于0？false
19:11:53.751 [main] INFO fun.xiaorang.study.java.core.lambda.FunctionalInterfaceTest -- 布尔类型的 true 是否不为null？true
19:11:53.751 [main] INFO fun.xiaorang.study.java.core.lambda.FunctionalInterfaceTest -- 布尔类型的 true 是否为null？false
19:11:53.752 [main] INFO fun.xiaorang.study.java.core.lambda.FunctionalInterfaceTest -- 字符串 foo 是否为空？false
19:11:53.752 [main] INFO fun.xiaorang.study.java.core.lambda.FunctionalInterfaceTest -- 字符串 foo 是否不为空？true
```

#### Function 函数型接口

内部抽象方法：`R apply (T t);` 对类型为 T 的对象应用操作，并返回结果是 R 类型的对象。通过它内部提供的一些默认方法，组合，链式处理 (compose, andThen)。

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

```text
22:35:49.283 [main] INFO fun.xiaorang.study.java.core.lambda.FunctionalInterfaceTest -- 字符串 123 反转之后取第一个字符再转换成数字是 3
22:35:49.286 [main] INFO fun.xiaorang.study.java.core.lambda.FunctionalInterfaceTest -- 字符串 123 反转之后取第一个字符再转换成数字是 3
```

#### Supplier 供给型接口

内部抽象方法：`T get ();` 返回类型为 T 的对象。

```java
@Test
public void test3() {
  final Supplier<Person> personSupplier = Person::new;
  log.info("调用 Person 类的无参构造方法创建一个 Person 对象实例：{}", personSupplier.get());
}
```

测试结果如下所示：

```text
22:43:42.262 [main] INFO fun.xiaorang.study.java.core.lambda.FunctionalInterfaceTest -- 调用 Person 类的无参构造方法创建一个 Person 对象实例：Person(firstName=null, lastName=null)
```

#### Consumer 消费型接口

内部抽象方法：`void accept (T t);` 对类型为 T 的对象应用操作。

```java
@Test
public void test4() {
  Consumer<Person> greeter = person -> log.info("Hello, {}", person.getFirstName());
  greeter.accept(new Person("Peter", "Parker"));
}
```

测试结果如下所示：

```text
22:48:21.327 [main] INFO fun.xiaorang.study.java.core.lambda.FunctionalInterfaceTest -- Hello, Peter
```

### 其他函数式接口

| 函数式接口                           | 参数类型 | 返回类型 | 用途                                                                                    |
|:----------------------------------- | -------- | -------- | --------------------------------------------------------------------------------------- |
| `BiFunction<T,U,R>`                  | T, U     | R        | 对类型为 T, U 参数应用操作，返回 R 类型的结果。包含方法为：`R apply (T t, U u)`        |
| `UnaryOperator` (Function 子接口)    | T        | T        | 对类型为 T 的对象进行一元运算，并返回 T 类型的结果。包含方法为：`T apply (T t)`        |
| `BinaryOperator` (BiFunction 子接口) | T, T     | T        | 对类型为 T 的对象进行二元运算，并返回 T 类型的结果。包含方法为：`T apply (T t1, T t2)` |
| `BiConsumer<T,U>`                    | T, U     | void     | 对类型为 T, U 参数应用操作。包含方法为：`void accept (Tt, Uu)`                         |
| `BiPredicate<T,U>`                   | T, U     | boolean  | 包含方法为：`boolean test (Tt, Uu)`                                                    |
| `ToIntFunction`                      | T        | int      | 计算 `int` 值的函数                                                                     |
| `ToLongFunction`                     | T        | long     | 计算 `long` 值的函数                                                                    |
| `ToDoubleFunction`                   | T        | double   | 计算 `double` 值的函数                                                                  |
| `IntFunction`                        | int      | R        | 参数为 `int` 类型的函数                                                                 |
| `LongFunction`                       | long     | R        | 参数为 `long` 类型的函数                                                                |
| `DoubleFunction`                     | double   | R        | 参数为 `double` 类型的函数                                                              |
