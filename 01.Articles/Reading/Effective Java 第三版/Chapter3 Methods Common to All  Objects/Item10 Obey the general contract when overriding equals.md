---
tags:
  - Java/EffectiveJava
description: 覆盖 equals 时需遵守的约定
priority: 10
create_time: 2025/07/17 16:01
update_time: 2025/07/17 23:26
---

**_Don't override if:_**

- 类的每个实例在本质上都是唯一的，即使它们的所有字段值相同，也不应被视为相等。(e.g. `Thread`)
- 类本身无需判断 "内容是否相等"，因为这样的比较没有实际意义。(e.g. `java.util.Random`)
- 父类已正确实现 `equals`，且该实现对当前子类仍然适用。(e.g. `Set`)
- 类是私有的或包级私有的，并且能确定 `equals` 方法永远不会被调用。

**_Override if:_**

当一个类希望通过对象的属性值是否相同来判断两个实例是否相等，而不是依赖默认的引用比较（`==`），并且父类尚未提供相应实现时，则应重写 `equals` 方法。

**_Equals implements an "equivalence relation（<span style="font-size:10px;">等价关系</span>）":_**

- Reflexive（<span style="font-size:10px;">自反性</span>）：`x.equals(x)` 必须返回 `true`。
- Symmetric（<span style="font-size:10px;">对称性</span>）：若 `x.equals(y)` 为 `true`，则 `y.equals(x)` 也必须为 `true`。
- Transitive（<span style="font-size:10px;">传递性</span>）: 若 `x.equals(y)` 与 `y.equals(z)` 都为 `true`，则 `x.equals(z)` 也必须为 `true`
- Consistent（<span style="font-size:10px;">一致性</span>）: 在对象未发生变化的前提下，多次调用 `x.equals(y)` 应始终返回相同的结果。
- Non-nullity（<span style="font-size:10px;">非空性</span>）: `x.equals(null)` 必须返回 `false`

**_The Recipe（<span style="font-size:10px;">实现步骤</span>）:_**

1. 使用 `==` 判断参数是否为当前对象本身（可提升性能）；
2. 使用 `instanceof` 检查参数类型是否匹配；
3. 将参数强制转换为目标类型；
4. 逐一比较所有 "关键字段"，判断它们的值是否相等；
5. 实现后自检：是否满足对称性、传递性和一致性？（通常自反性和非空性会自然成立）

```java
@Override
public boolean equals (Object o){
  if(o == this)
    return true;

  if (!(o instanceof PhoneNumber))
    return false;

  PhoneNumber pn = (PhoneNumber)o;
  
  return pn.lineNumber == lineNumber
    && pn.prefix == prefix
    && pn.areaCode == areaCode;
}
```

**_Never Forget_**

- 重写 `equals` 时，必须同时重写 `hashCode`，详见 [[Item 11 Always override hashCode when you  override equals]]。
- 避免过度设计，实现应尽可能简洁清晰。
- `equals` 的参数类型必须为 `Object`，否则是重载（overload）而非重写（override），将导致预期外的行为。
