---
tags:
  - Java
create_time: 2025/01/05 21:51
update_time: 2025/08/10 23:27
---

`transient` 是 Java 中的修饰符，用于修饰类中的成员变量，表示这些变量**不会被序列化**。当一个对象通过 `ObjectOutputStream` 被序列化时，被 `transient` 修饰的变量的值不会被保存到序列化文件中。

## 作用与应用场景

### 作用

- **屏蔽敏感信息**：防止敏感数据如密码、密钥等在序列化时被泄露，确保数据安全。
- **排除无意义数据**：忽略那些在序列化时没有意义或可以在反序列化时重新生成的数据，如缓存字段、线程状态等。
- **优化存储与传输**：减少序列化数据的大小，从而优化存储空间的使用和数据传输的效率。

### 应用场景

- **处理敏感数据**：在涉及用户隐私或安全性的场景中，如用户登录信息、加密密钥等，使用 `transient` 修饰相关字段，防止敏感数据被序列化。
- **管理临时数据**：对于那些仅在程序运行时有用，不需要持久化的临时数据，如临时计算结果、中间变量等，使用 `transient` 修饰，避免不必要的序列化操作。
- **提升性能**：在需要频繁进行序列化和反序列化操作的场景中，通过减少序列化数据量，提高程序的性能。

## 使用规则与注意事项

### 使用规则

1. **修饰范围限制**：
    - `transient` 只能修饰类的实例变量，不能修饰局部变量、类方法或类本身。
2. **与 `Serializable` 接口搭配**：
    - `transient` 通常与 `Serializable` 接口结合使用，用于控制序列化过程，确保对象在序列化时按预期行为进行。
3. **默认值初始化**：
    - `transient` 修饰的变量在序列化时被忽略，在反序列化后会被初始化为该变量的默认值：
        - 基本数据类型：0、false 或 0.0
        - 引用类型：`null`

### 注意事项

1. **自定义序列化逻辑**：
    - 使用 `transient` 时，可以通过实现 `writeObject()` 和 `readObject()` 方法来自定义序列化和反序列化逻辑，以满足特定需求。例如，对敏感数据进行加密后再序列化，反序列化时再进行解密。

		```java
		private void writeObject(ObjectOutputStream oos) throws IOException {
		    oos.defaultWriteObject(); // 序列化非 transient 变量
		    oos.writeUTF(encrypt(password)); // 手动序列化加密后的密码
		}
		
		private void readObject(ObjectInputStream ois) throws IOException, ClassNotFoundException {
		    ois.defaultReadObject(); // 反序列化非 transient 变量
		    this.password = decrypt(ois.readUTF()); // 手动反序列化解密后的密码
		}
		```

2. **与 `static` 一起使用**
   - `static` 和 `transient` 可以同时修饰一个变量，但这种组合没有实际意义，因为**静态变量本来就不参与实例序列化**。静态变量属于类，而非对象实例，因此在序列化对象时，静态变量不会被序列化。

## 示例

以下示例展示了 `transient` 的基本用法：

```java
import java.io.*;

class User implements Serializable {
    private static final long serialVersionUID = 1L;

    private String username;
    private transient String password; // transient 修饰，防止序列化

    public User(String username, String password) {
        this.username = username;
        this.password = password;
    }

    @Override
    public String toString() {
        return "User{" +
                "username='" + username + '\'' +
                ", password='" + password + '\'' +
                '}';
    }
}

public class TransientExample {
    public static void main(String[] args) {
        User user = new User("admin", "123456");

        // 序列化
        try (ObjectOutputStream oos = new ObjectOutputStream(new FileOutputStream("user.ser"))) {
            oos.writeObject(user);
        } catch (IOException e) {
            e.printStackTrace();
        }

        // 反序列化
        try (ObjectInputStream ois = new ObjectInputStream(new FileInputStream("user.ser"))) {
            User deserializedUser = (User) ois.readObject();
            System.out.println(deserializedUser); // 密码字段被初始化为 null
        } catch (IOException | ClassNotFoundException e) {
            e.printStackTrace();
        }
    }
}
```

**运行结果**：

```text
User{username='admin', password='null'}
```

- **序列化前**：用户密码为 `"123456"`。
- **序列化后**：由于 `password` 被 `transient` 修饰，未被保存到文件中，反序列化后其值为 `null`。

## 总结

- **核心功能**：`transient` 修饰的变量不会被序列化，适用于临时数据或敏感数据。
- **典型场景**：
    - 屏蔽敏感数据：如密码、密钥等。
    - 避免无意义数据：如缓存、连接对象等。
- **自定义控制**：可以通过 `writeObject()` 和 `readObject()` 方法实现更精细的序列化控制，满足特定的业务需求和安全要求。
