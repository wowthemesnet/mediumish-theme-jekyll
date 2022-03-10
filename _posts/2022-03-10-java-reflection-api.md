---
layout: post
title:  "Reflection API로 외부에서 private 메소드에 접근하기"
authors: [kir3i]
tags: ["Java", "ReflectionAPI"]
image: 
description: "Java의 Reflection API로 외부에서 private 메소드를 호출해보자"
featured: true
---

[Effective Java](https://book.naver.com/bookdb/book_detail.naver?bid=14097515)를 읽던 중 이런 문장을 봤습니다.
> 권한이 있는 클라이언트는 리플렉션 API인 AccessibleObject.setAccessible을 사용해 private 생성자를 호출할 수 있다.

private 메소드인데도 뚫린다니 진짜인지 확인해보고 싶어졌습니다. 그래서 이번 글에서 직접 private 생성자를 호출하는 과정을 다뤄보고자 합니다.

## Reflection API?

우선 Reflection API가 무엇인지부터 알아보겠습니다.

> Reflection enables Java code to discover information about the fields, methods and constructors of ***loaded classes***, and to use reflected fields, methods, and constructors to operate on their underlying counterparts, within security restrictions. The API accommodates applications that need access to either the public members of a target object (based on its runtime class) or the members declared by a given class. It also allows programs to suppress default reflective access control.
>
> 출처: [Oracle Java Documentation](https://docs.oracle.com/javase/8/docs/technotes/guides/reflection/index.html)

Refelction API를 이용하면 메모리에 로드된 바이트코드를 직접 다룰 수 있다고 합니다. 메모리에 있는 바이트코드를 직접 다루다보니 private 메소드에도 접근 가능한 것으로 추측됩니다. 스프링의 `BeanInfo`와 DI, 테스트 라이브러리 등에 사용된다고 합니다. Reflection을 적용하는 상세한 과정은 다음과 같습니다.

1. JVM의 ClassLoader가 컴파일된 바이트코드(`.class` 파일)를 메모리에 로드합니다.
2. Class 형식의 인스턴스가 생성되는데 이를 코드에서 읽어와서 원하는대로 접근할 수 있습니다.

## 외부 클래스에서 private 메소드에 접근하기

이제 외부 클래스에서 직접 private 메소드를 호출해보겠습니다. 우선 테스트 대상이 될 클래스를 작성해줍니다. private 필드, 생성자, 메소드를 각각 작성해봤습니다.

```java
public class TestClass {
    private final String privateField = "This is a secret message";

    private TestClass() {
        System.out.println("TestBean constructor called!");
    }

    private String privateMethod() {
        return "privateMethod called!";
    }
}

```

다음으로 Reflection API를 사용해서 private 생성자를 호출해봤는데요. 생각보다 너무 단순했습니다.

```java
import java.lang.reflect.Constructor;
import java.lang.reflect.Method;

public class ReflectionTest {
    public static void main(String[] args) throws Exception {
        Class<TestClass> clazz = TestClass.class;
        Constructor<TestClass> constructor = clazz.getDeclaredConstructor();
        constructor.setAccessible(true);
        TestClass testInstance = constructor.newInstance();
    }
}
```

허무하게도 그냥 네 줄로 끝납니다.

1. 앞서 언급했던 Class 인스턴스를 불러오고
2. `getDeclaredConstructor()` 메소드를 이용해 생성자를 불러온 다음,
3. `setAccessible()`로 접근 권한을 부여하고
4. 호출하면 잘 생성됩니다.

```sh
TestBean constructor called!
```

같은 방법으로 private 메소드도 호출해보겠습니다.

```java
import java.lang.reflect.Constructor;
import java.lang.reflect.Method;

public class ReflectionTest {
    public static void main(String[] args) throws Exception {
        Class<TestClass> clazz = TestClass.class;
        Constructor<TestClass> constructor = clazz.getDeclaredConstructor();
        constructor.setAccessible(true);
        TestClass testInstance = constructor.newInstance();

        Method method = clazz.getDeclaredMethod("privateMethod");
        method.setAccessible(true);
        System.out.println(method.invoke(testInstance));
    }
}
```

메소드는 `invoke` 함수를 이용해 호출한다는 점을 제외하면 크게 다르지 않은 방법으로 간단히 private 메소드를 호출할 수 있습니다.

```sh
TestBean constructor called!
privateMethod called!
```

이번엔 private 필드에 접근해보겠습니다.

```java
import java.lang.reflect.Constructor;
import java.lang.reflect.Field;

public class ReflectionTest {
    public static void main(String[] args) throws Exception {
        Class<TestClass> clazz = TestClass.class;
        Constructor<TestClass> constructor = clazz.getDeclaredConstructor();
        constructor.setAccessible(true);
        TestClass testInstance = constructor.newInstance();

        Field field = clazz.getDeclaredField("privateField");
        field.setAccessible(true);
        
        System.out.println(field.get(testInstance));
        field.set(testInstance, "This is not a secret anymore");
        System.out.println(field.get(testInstance));
    }
}
```

private 필드지만 값에 접근이 가능하고 수정도 가능합니다. 게다가 **final 필드여도 수정이 됩니다.** 아무래도 메모리에 직접 접근하는 것이다보니 코드 레벨에서 막는 것들은 다 뚫을 수 있는 것 같습니다.

```sh
TestBean constructor called!
This is a secret message
This is not a secret anymore
```

### 참고

Reflection API 중 `getConstructor()`, `getMethod()`, `getField()`로는 private 메소드, 필드에 접근이 안되고 반드시 `getDeclaredConstructor()`, `getDeclaredMethod()`, `getDeclaredField()`를 사용해야 합니다. [레퍼런스](https://docs.oracle.com/javase/8/docs/api/java/lang/Class.html#getConstructor-java.lang.Class...-)의 설명을 보면 전자는 public 메소드, 필드에 접근이 가능하고 후자는 private에도 접근이 가능하다고 설명되어 있습니다. 다만 후자의 경우에도 클래스 로더 등의 정보를 참고로 하여 호출 권한이 있는지 체크하는 보안 점검 과정이 있긴 합니다.

## 결론

뭔가 복잡한 과정이 있을 줄 알았는데 생각보다 간단히 사용할 수 있었습니다. 사용하는 입장에선 편하게 사용하니까 좋긴 한데, 코드 레벨의 제약을 피할 수 있기 때문에 조심해서 사용해야 할 것 같네요. 잘 사용하면 테스트에도 유용하게 쓸 수 있을 것 같습니다.

## 참고자료

- [Oracle reflect package 공식 문서](https://docs.oracle.com/javase/8/docs/api/java/lang/reflect/package-summary.html)
- [Java의 Reflection API와 성능 이슈?](https://lob-dev.tistory.com/entry/Java%EC%9D%98-Reflection-API)
