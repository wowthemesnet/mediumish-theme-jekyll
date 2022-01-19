---
layout: post 
title: "객체를 다루는 당신, 이것을 조심하세요!"
authors: [suin0730]
tags: ["Effective Java", "객체 생성", "객체 파괴"]
image: ../assets/images/post-AlexNet/2.png
featured: true
---

## 객체를 다루는 당신, 이것을 조심하세요

### TOC

- [객체를 다루는 당신, 이것을 조심하세요](#객체를-다루는-당신-이것을-조심하세요)
  - [TOC](#toc)
  - [들어가며](#들어가며)
- [1단계: 객체 생성하기](#1단계-객체-생성하기)
  - [1.1 생성자 vs 정적 팩토리 메서드](#11-생성자-vs-정적-팩토리-메서드)
  - [1.2 매개 변수가 많은 객체를 생성할 때](#12-매개-변수가-많은-객체를-생성할-때)
    - [1.2.1 점층적 생성자 패턴](#121-점층적-생성자-패턴)
    - [1.2.2 자바빈즈 패턴](#122-자바빈즈-패턴)
    - [1.2.3 빌더 패턴](#123-빌더-패턴)
  - [1.3 의존 객체 주입](#13-의존-객체-주입)
    - [1.3.1 자원을 직접 명시하지 않아야 하는 경우](#131-자원을-직접-명시하지-않아야-하는-경우)
    - [1.3.2 자원 명시가 필요한 경우](#132-자원-명시가-필요한-경우)
- [2단계: 꼭 필요한 객체를 만든 것인지 생각해보기](#2단계-꼭-필요한-객체를-만든-것인지-생각해보기)
  - [2.1 불필요한 객체를 생성하는 경우](#21-불필요한-객체를-생성하는-경우)
    - [2.1.1 동일한 문자열 반복 생성](#211-동일한-문자열-반복-생성)
    - [2.1.2 비싼 객체 반복 생성](#212-비싼-객체-반복-생성)
    - [2.1.3 오토 박싱](#213-오토-박싱)
  - [2.2 다 쓴 객체를 놓지 않는 경우](#22-다-쓴-객체를-놓지-않는-경우)
    - [2.2.1 메모리를 직접 관리하는 클래스](#221-메모리를-직접-관리하는-클래스)
    - [2.2.2 캐시](#222-캐시)
    - [2.2.3 콜백 리스너](#223-콜백-리스너)
- [3단계: 다 쓴 객체 참조를 바르게 해제하기](#3단계-다-쓴-객체-참조를-바르게-해제하기)
  - [3.1 객체 소멸자 사용 지양](#31-객체-소멸자-사용-지양)
    - [3.1.1 사용하지 말아야 할 이유](#311-사용하지-말아야-할-이유)
    - [3.1.2 대안](#312-대안)
    - [3.1.3 그럼 `finalizer`와 `cleaner`는 대체 언제 쓰는가?](#313-그럼-finalizer와-cleaner는-대체-언제-쓰는가)
  - [3.2 try-with-resources](#32-try-with-resources)
    - [3.2.1 자원을 닫기 위해 try-finally를 사용하는 경우](#321-자원을-닫기-위해-try-finally를-사용하는-경우)
    - [3.2.2 자원을 닫기 위해 try-with-resources를 사용하는 경우](#322-자원을-닫기-위해-try-with-resources를-사용하는-경우)

### 들어가며

객체 지향 프로그래밍은 컴퓨터 프로그래밍 패러다임 중 하나로, 컴퓨터 프로그램을 명령어 목록이 아닌 객체의 모임이라는 관점으로 봅니다.
객체 지향 프로그래밍은 속성와 메서드를 가진 **객체**를 이용해 문제를 작게 쪼개어 큰 문제를 해결하는 Bottom-up 방식을 사용합니다.
2021년 기준, 대표적인 객체 지향 언어인 Java는 한국에서 53%의 점유율을 차지할 정도로 인기가 많습니다.

Java 가 이렇게 널리 사용되는 언어인만큼, 잘 사용하고 있는지 되돌아보는 습관이 필요하다고 생각합니다.
Java에서 객체를 다루는 요령을 소개한 Effective Java 3판을 읽으며 중요하다고 느낀 부분을 공유하려 합니다.

## 1단계: 객체 생성하기

Car car = new Car()이 최선인가요? 확실해요?

### 1.1 생성자 vs 정적 팩토리 메서드

> 생성자 대신 정적 팩토리 메서드를 고려해 봅시다.

정적 팩토리 메서드로 인스턴스를 생성하면 여러 장점이 있습니다.

첫째로, 메서드에 이름을 사용할 수 있습니다.
메서드 명에 클라이언트에 반환할 객체 특성을 나타낼 수 있어서 이름이 없는 생성자에 비해 개발자들이 각 팩토리 메서드가 어떤 역할을 하는지 이해하기 쉽습니다.

둘째로, 호출될 때마다 동일한 객체가 반환되도록 해서 인스턴스를 통제할 수 있고 싱글톤 혹은 인스턴스화 불가하게 만들어서 성능을 끌어올릴 수도 있습니다.

마지막으로 정적 팩토리 메서드를 사용하면 반환 타입의 하위 객체를 반환할 수 있어 API를 더 유연하고 가볍게 만들 수 있습니다.

[예시] EnumSet

`EnumSet`은 public 생성자 대신 정적 팩터리 메서드를 사용합니다. 아래 `noneOf` 메서드를 보면 `universe.length`가 64보다 큰지에 따라 `EnumSet`의 하위 클래스인 `RegularEnumSet` 또는 `JumboEnumSet을` 반환할 수 있습니다. 정적 팩터리 메서드를 호출하는 개발자는 `noneOf`가 `EnumSet`의 하위 클래스만 반환하면 그 클래스가 무엇인지 몰라도 괜찮습니다.

```java
public static <E extends Enum<E>> EnumSet<E> noneOf(Class<E> elementType) {
  Enum<?>[] universe = getUniverse(elementType);
  if (universe == null)
      throw new ClassCastException(elementType + " not an enum");

  if (universe.length <= 64)
      return new RegularEnumSet<>(elementType, universe);
  else
      return new JumboEnumSet<>(elementType, universe);
}
```

반면, 정적 팩토리 메서드로 인스턴스를 생성했을 때 단점도 있습니다.

첫째로 상속하기 위해서는 상위 클래스에 public이나 protected 생성자가 필요하기 때문에 생성자 대신 정적 팩토리 메서드만 사용한다면 하위 클래스를 만들 수 없습니다.

두번째 단점은 생성자와 비교했을 때, 정적 팩토리 메서드는 API 설명에서 객체를 생성하는 역할을 하는지 알기 어렵다는 것입니다.

### 1.2 매개 변수가 많은 객체를 생성할 때

정적 팩토리 메서드와 생성자는 선택적 매개변수가 많을 때 적절하게  대응하기 어렵습니다. 대안으로 제시된 점층적 생성자 패턴, 자바빈즈 패턴, 빌더 패턴을 각각 살펴봅시다.

#### 1.2.1 점층적 생성자 패턴

> 점층적 생성자 패턴을 사용할 때 매개변수 개수가 많아지면 클라이언트 코드를 작성하거나 의미를 파악하기 어렵습니다.

점층적 생성자 패턴은 필수 매개변수만 받는 생성자를 기반으로 선택 매개변수를 하나씩 늘린 생성자를 만드는 패턴입니다.

`Circles` 클래스에서 필수 매개변수인 `radius`와 `count`를 받는 생성자를 기본으로, 선택 매개변수인 `color`, `solidLine`, `shadow`를 하나씩 추가한 생성자를 만들었습니다. 이 클래스를 사용하기 위해서는 원하는 선택 매개변수를 모두 포함한 생성자 중 가장 짧은 생성자를 호출해야 하는데, 이 방법은 사용하지 않는 매개변수도 결국 채워진다는 점에서 비효율적입니다.

```java
public class Circles {
  private final int radius;          // 반지름       (필수)
  private final int count;           // 원 개수      (필수)
  private final String color;        // 원 색깔      (선택)
  private final boolean solidLine;   // 실선 여부    (선택)
  private final boolean shadow;       // 그림자 여부 (선택)
  
  public Circles (int radius, int count) {
    this(radius, count, '');
  }

  public Circles (int radius, int count, Stirng color) {
    this(radius, count, color, 0);
  }

  public Circles (int radius, int count, String color, boolean solidLine) {
    this(radius, count, color, solidLine 0);
  }

  public Circles (int radius, int count, String color, boolean solidLine, boolean shadow){
    this.radius = radius;
    this.count = count;
    this.color = color;
    this.solidLine = solidLine;
    this.shadow = shadow;
  }
}
```

#### 1.2.2 자바빈즈 패턴

> 자바빈즈 패턴을 사용하면 객체 하나를 만들기 위해 여러 메소드를 호출해야 하고, 객체가 완전히 생성되기 전에는 일관성이 무너집니다.

자바빈즈 패턴은 매개변수가 없는 생성자로 객체를 만든 후, 세터 메서드를 호출해 원하는 매개변수 값을 설정하는 패턴입니다. 반지름이 3이고 그림자가 있는 노란색 원을 7개 만들려면 아래 예시와 같이 생성하면 됩니다.

이 방법은 인스턴스를 만들고 읽기 쉽지만 `circles` 객체를 하나 만들기 위해 세터 메서드를 5개나 호출해야 하고 모든 메서드 호출이 완료되기 전까지는 객체 일관성이 깨진다는 단점이 있습니다. 객체 일관성이 깨지면 스레드 안정성을 얻기 위해 수동으로 객체를 얼리고 녹여야 하는데 이 방법은 런타임 오류에 취약하므로 사용하기 어렵습니다.

```java
Circles circles = new Circles();
circles.setRadius(3);
circles.setCount(7);
circles.setColor('yellow');
circles.setShadow(true);
```

```java
public class Circles {
  // 기본값으로 초기화
  private int radius = 1;
  private int count = 1;
  private String color = 'white';
  private boolean solidLine = true;
  private boolean shadow = false;
  
  public Circles() { }

  // 세터 메서드
  public void setRadius(int val)          { radius = val; }
  public void setCount(int val)           { count = val; }
  public void setColor(String val)        { color = val; }
  public void setSolidLine(boolean val)   { solidLine = val; }
  public void setShadow(boolean val)      { shadow = val; }
}
```

#### 1.2.3 빌더 패턴

> 빌더 패턴은 점층적 생성자 패턴의 안정성과 자바빈즈 패턴의 가독성을 둘 다 가집니다. 생성자나 정적 팩터리 메서드가 처리할 매개변수가 많다면 빌더 패턴을 사용하는 것이 좋습니다.

빌더 패턴에서 클라이언트는 필요한 객체를 직접 만들지 않고, 필수 매개변수를 사용해 생성자(혹은 정적 팩토리 메서드)를 호출해 빌더 객체를 얻습니다. 빌더 객체는 세터 메서드로 선택 매개변수를 설정하고 `build()`를 호출해 객체를 만듭니다.

아래 예제를 보면 **빌더의 세터 메서드는 빌더 자신을 반환하기 때문에 연쇄적으로 호출할 수 있습니다.** 이 코드는 점층적 생성자 패턴보다 읽고 쓰기 쉽습니다.

```java
Circles circle = new Circles.Builder(3, 7).color('yellow').shadow(true);
```

```java
public class Circles {
  private final int radius;
  private final int count;
  private final String color;
  private final boolean solidLine;
  private final boolean shadow;

  public static class Builder {
    // 필수 매개변수
    private final int radius;
    private final int count;

    // 선택 매개변수 (기본값으로 초기화)
    private String color = 'white';
    private boolean solidLine = true;
    private boolean shadow = false;

    public Builder(int radius, int count) {
      this.radius = radius;
      this.count = count;
    }
    public Builder(String val) { color = val; return this; }
    public Builder(boolean val) { solidLine = val; return this; }
    public Builder(boolean val) { shadow = val; return this; }

    public Circles build() {
      return new Circles(this);
    }
  }

  private Circles(Builder builder) {
    radius = builder.redius;
    count = builder.count;
    color = builder.color;
    solidLine = builder.solidLine;
    shadow  =builder.shadow;
  }
}
```

단, 빌더 객체를 만들려면 다른 방법에 비해 장황한 빌더부터 만들어야 합니다. 따라서 매개변수가 4개 이상인 경우에 빌더 사용을 고려하는 것이 낫습니다.

### 1.3 의존 객체 주입

#### 1.3.1 자원을 직접 명시하지 않아야 하는 경우

> 사용하는 자원에 따라 동작이 달라지는 클래스에는 [정적 유틸리티 클래스](https://github.com/suin0730/active-reading/blob/main/%5B1%5D%20%EC%9D%B4%ED%8E%99%ED%8B%B0%EB%B8%8C%20%EC%9E%90%EB%B0%94%203%ED%8C%90/%5BItem%204%5D%20%EC%9D%B8%EC%8A%A4%ED%84%B4%EC%8A%A4%ED%99%94%EB%A5%BC%20%EB%A7%89%EC%9C%BC%EB%A0%A4%EB%A9%B4%20private%20%EC%83%9D%EC%84%B1%EC%9E%90%EB%A5%BC%20%EC%82%AC%EC%9A%A9%ED%95%98%EB%9D%BC.md)나 [싱글턴](https://github.com/suin0730/active-reading/blob/main/%5B1%5D%20%EC%9D%B4%ED%8E%99%ED%8B%B0%EB%B8%8C%20%EC%9E%90%EB%B0%94%203%ED%8C%90/%5BItem%203%5D%20private%20%EC%83%9D%EC%84%B1%EC%9E%90%EB%82%98%20%EC%97%B4%EA%B1%B0%20%ED%83%80%EC%9E%85%EC%9C%BC%EB%A1%9C%20%EC%8B%B1%EA%B8%80%ED%84%B4%EC%9E%84%EC%9D%84%20%EB%B3%B4%EC%A6%9D%ED%95%98%EB%9D%BC.md)이 적합하지 않습니다.

자원을 정적으로 명시해두는 것이 부자연스러울 때가 종종 있다. 예를 들어, 맞춤법을 검사하는 프로그램을 아래와 같이 만들었다고 생각해보자. 현실 세계에서는 언어가 바뀔수도, 특수한 사전을 사용할수도 있지만 이 코드는 단 하나의 사전만 자원으로 사용한다.

만약 `final` 한정자를 지우고 사전을 바꿀 수 있는 메소드를 추가한다면 여러 사전을 사용할 수 있겠지만 thread-safe하지 않다.

```java
// 정적 유틸리티 사용
public class SpellChecker {
  private static final Lexicon dictionary = ...;

  private SpellChecker() {}
  ...
}
```

```java
// 싱글턴 사용
public class SpellChecker {
  private final Lexicon dictionary = ...;

  private SpellChecker() {}
  public static SpellChecker INSTANCE = new SpellChecker(...);
  ...
}
```

#### 1.3.2 자원 명시가 필요한 경우

> 클라이언트가 명시하는 자원을 클래스가 사용해야 한다면 의존성을 주입해야 합니다. 이 경우 클래스의 유연성, 재사용성, 테스트 용이성이 크게 향상됩니다.

클래스(SpellChecker)가 클라이언트가 원하는 자원(dictionary)을 사용해야 한다면 아래 코드와 같이 **인스턴스를 생성할 때 생성자에 필요한 자원을 넘겨줘야 합니다.**

의존 객체 주입 패턴을 사용하면, 불변성을 보장하여 같은 자원을 사용하려는 여러 클라이언트가 의존 객체를 공유할 수 있고 생성자, [정적 팩터리](https://github.com/suin0730/active-reading/blob/main/%5B1%5D%20%EC%9D%B4%ED%8E%99%ED%8B%B0%EB%B8%8C%20%EC%9E%90%EB%B0%94%203%ED%8C%90/%5BItem%201%5D%20%EC%83%9D%EC%84%B1%EC%9E%90%20%EB%8C%80%EC%8B%A0%20%EC%A0%95%EC%A0%81%20%ED%8C%A9%ED%86%A0%EB%A6%AC%20%EB%A9%94%EC%84%9C%EB%93%9C%EB%A5%BC%20%EA%B3%A0%EB%A0%A4%ED%95%98%EB%9D%BC.md), [빌더](https://github.com/suin0730/active-reading/blob/main/%5B1%5D%20%EC%9D%B4%ED%8E%99%ED%8B%B0%EB%B8%8C%20%EC%9E%90%EB%B0%94%203%ED%8C%90/%5BItem%202%5D%20%EC%83%9D%EC%84%B1%EC%9E%90%EC%97%90%20%EB%A7%A4%EA%B0%9C%EB%B3%80%EC%88%98%EA%B0%80%20%EB%A7%8E%EB%8B%A4%EB%A9%B4%20%EB%B9%8C%EB%8D%94%EB%A5%BC%20%EA%B3%A0%EB%A0%A4%ED%95%B4%EB%9D%BC.md) 모두에 똑같이 응용할 수 있습니다.

```java
public class SpellChecker {
  private final Lexicon dictionary;

  public SpellChecker(Lexicon dictionary) {
    this.dictionary = Object.requireNonNull(dictionary);
  }
  ...
}
```

이 패턴을 변형해서, 생성자에 특정 타입 인스턴스를 반복해서 넘겨주는 자원 팩터리를 넘길 수 있습니다. 한정적 와일드카드 타입을 사용해 팩터리 타입 매개변수를 제한하면 클라이언트는 자신이 명시한 타입의 하위 타입 객체를 생성할 수 있는 팩터리를 넘길 수 있습니다.

```java
Apartment create(Supplier<? extends house> houseFactory) { ... }
```

## 2단계: 꼭 필요한 객체를 만든 것인지 생각해보기

그 객체... 정말 필요한가요?

### 2.1 불필요한 객체를 생성하는 경우

똑같은 기능의 객체를 매번 생성하기보다는 객체 하나를 재사용하는게 나을 때가 있습니다. 아래는 객체를 재사용하는 방향으로 개선할 수 있는 코드 예시입니다.

#### 2.1.1 동일한 문자열 반복 생성

아래 코드는 "IU is the best"라는 문자열 객체를 String 생성자에 넘겨 완전히 똑같은 객체를 하나 더 생성합니다. 반복문이나 자주 사용되는 메서드에 아래 코드가 있다면, 쓸모없는 객체가 대량으로 만들어질 것입니다. 좋은 예시는 새로운 인스턴스를 매번 만드는 대신 하나의 String 인스턴스만 사용하기 때문에 **같은 VM에서 똑같은 문자열을 사용하는 모든 코드가 같은 객체를 재사용하는 것이 보장됩니다.**

```java
// 나쁜 예시
String s = new String("IU is the best");

// 좋은 예시
String s = "bikini";
```

#### 2.1.2 비싼 객체 반복 생성

생성 비용이 비싼 객체인지 매번 명확히 알 수는 없지만, 성능이 갑자기 떨어진다면 비싼 객체를 생성했는지 의심할 수 있습니다. 정규표현식을 사용해 문자열 매칭을 확인하는 아래 코드가 그 예시입니다. `String.matches`는 정규표현식으로 문자열 형태를 확인하는 쉬운 방법이지만 정규표현식에 사용하는 `Pattern` 인스턴스는 한 번 사용하고 버려지기 때문에 불변으로 생성하는 것이 좋습니다. `Pattern`을 static final로 끄집어내 이름을 지으면 코드 의미도 훨씬 잘 드러납니다.

```java
// 나쁜 예시
static boolean isRomanNumeral(String s) {
  return s.matches( ... );
}

// 좋은 예시
static boolean isRomanNumeral(String s) {
  private static final Patten ROMAN = Pattern.compile( ... );

  static boolean inRomanNumeral(String s) {
    return ROMAN.matcher(s).matches();
  }
}
```

#### 2.1.3 오토 박싱

0부터 `Integer.MAX_VALUE`까지의 합을 출력하는 아래 프로그램은 long에서 Long으로의 언박싱 때문에 불필요한 Long 인스턴스가 만들어집니다. **박싱된 기본 타입 보다는 기본 타입을 사용하고, 의도치 않은 오토박싱을 주의해야 합니다.**

```java
private static long sum() {
  Long sum = 0;
  for (long i = 0; i <= Integer.MAX_VALUE; i++)
    sum += i;

  return sum
}
```

### 2.2 다 쓴 객체를 놓지 않는 경우

Java의 가비지 컬렉터는 다 쓴 객체를 알아서 회수해주지만, 여전히 클라이언트는 메모리를 관리해야 합니다.

특정 조건으로 인해 가비지 컬렉터가 다 쓴 객체 메모리를 회수하지 않으면 점차 가비지 컬렉션 활동과 메모리 사용량이 늘어나 성능이 저하될 것입니다.
성능 저하가 심해진다면 디스크 페이징이나 OutOfMemoryError를 일으켜 예기치 않게 프로그램이 종료됩니다.

메모리 누수가 일어나는 대표적인 원인을 살펴보면 다음과 같습니다.

#### 2.2.1 메모리를 직접 관리하는 클래스

아래 `Stack` 클래스는 element 메모리를 직접 관리합니다. 나쁜 예시 `pop()` 메서드에서는 스택이 줄어들 때 인덱스가 size보다 큰 배열 요소를 GC하지 못합니다. 따라서 좋은 예시 `pop()`과 같이 다 쓴 참조를 null 처리하는 과정이 필요합니다.

```java
public class Stack {
  private Object[] elements;
  private int size = 0;
  private static final int DEFAULT_INITIAL_CAPACITY = 16;

  public Stack() {
    elements = new Object[DEFAULT_INITIAL_CAPACITY];
  }

  public void push(Object e) {
    ensureCapacity();
    elements[size++] = e;
  }

  // 나쁜 예시
  public Object pop() {
    if (size == 0) throw new EmptyStacException();
    return elements[--size];
  }

  // 새로 들어올 원소를 위한 공간 확보
  private void ensureCapacity() {
    if (elements.length == size)
      elements = Arrrays.copyOf(elements, 2 * size + 1);
  }
}
```

```java
// 좋은 예시
public Object pop() {
  if (size == 0) throw new EmptyStacException();
  Object result = elements[--size];
  element[size] = null; // 참조 해제
  return result;
}
```

그러나 이렇게 객체 참조를 수동으로 null 처리하는 일은 예외적인 경우에만 발생해야 합니다.
**다 쓴 참조를 해제하는 가장 좋은 방법은 그 참조를 담은 변수를 유효 범위 밖으로 밀어내는 것으로, 변수의 범위를 최소로 정의했다면 이 일은 자연스럽게 이뤄집니다.**

일반적으로 자기 메모리를 스스로 관리하는 클래스라면 클라이언트는 항상 메모리 누수에 주의해야 합니다.

#### 2.2.2 캐시

객체 참조를 캐시에 넣고 클라이언트가 잊는다면 메모리 누수가 날 수 있습니다.

만약 캐시 외부에서 키를 참조하는 동안만 엔트리가 살아 있어야 한다면, `WeakHashMap`을 사용해서 캐시를 만들면 됩니다. 다 쓴 엔트리가 자동으로 제거될 것입니다. 일반적으로는 캐시 엔트리 유효 기간을 알 수 없으므로 쓰지 않는 엔트리를 가끔 청소합니다.

#### 2.2.3 콜백 리스너

클라이언트가 콜백을 등록만 하고 해지하지 않는 경우 콜백이 쌓여 메모리 누수가 날 수 있습니다. 이 경우 콜백을 `WeakHashMap`과 같은 약한 참조로 저장하면 가비지 컬렉터가 메모리를 수거합니다.

## 3단계: 다 쓴 객체 참조를 바르게 해제하기

다 쓴 객체를 올바르게 반환하는 방법은?

### 3.1 객체 소멸자 사용 지양

자바에서는 두가지 객체 소멸자를 제공합니다.

- `finalizer`: 예측 불가능하고, 상황에 따라 위험할 수 있어 자바 9에서 deprecated API로 지정됨
- `cleaner`: `finalizer`를 대체하는 덜 위험한 API이지만, 여전히 예측할 수 없고 느림

#### 3.1.1 사용하지 말아야 할 이유

- 수행 시점: `finalizer`와 `cleaner`가 수행되기까지 얼마나 걸릴지 알 수 없으므로 제때 실행되어야 하는 작업을 맡기면 오류를 낼 수 있습니다. 객체 소멸자가 동작하는 시점은 GC 알고리즘에 달렸으며 그 구현 방법에 따라 천차만별이므로 애초에 사용하지 않는게 좋습니다. 만약 클래스에 `finalizer`를 사용한다면 인스턴스 자원 회수가 지연되어 OutOfMemory를 내며 프로그램이 죽을 수 있습니다.
- 수행 여부: `finalizer`와 `cleaner`는 객체 소멸 수행 여부를 보장하지 않으므로 데이터베이스 공유 락 해제와 같이 상태를 수정해야 하는 작업에는 사용하면 안됩니다.
- 보완 클래스가 제 역할을 못함: `System.gc`나 `System.runFinalization` 메서드를 사용하면 `finalizer`와 `cleaner`가 실행될 가능성을 높일 수는 있으나 무조건 보장하진 않아 사용하지 않는게 낫습니다.
- 낮은 성능: `finalizer`가 객체를 소멸시키면 AutoClosable 객체를 사용해서 가비지 컬렉터가 수거하도록 할 때보다 50배 정도 느립니다.
보안 취약: 객체 생성을 막으려면 원래는 생성자에서 예외를 던지면 되지만 `finalizer`는 다른 방식으로 동작합니다. 만약 객체 직렬화 화정에서 예외가 발생하면, 생성되던 객체에서 `finalizer`가 수행될 수 있고 일그러진 객체가 만들어집니다. final 클래스는 하위 클래스를 만들 수 없으니 만약 final이 아닌 클래스를 공격에 안전하게 만들려면 아무 일도 하지 않는 `finalizer` 메서드를 만들고 final로 선언해야 합니다.

#### 3.1.2 대안

파일이나 스레드 등 종료해야 하는 자원을 담고 있는 클래스에서 `finalizer`, `cleaner`를 대체하는 방법은 `AutoClosable을` 구현하고 `close` 메서드를 호출하는 것입니다.  [(AutoClosable)](https://github.com/suin0730/active-reading/blob/main/%5B1%5D%20%EC%9D%B4%ED%8E%99%ED%8B%B0%EB%B8%8C%20%EC%9E%90%EB%B0%94%203%ED%8C%90/%5BItem%209%5D%20try-finally%EB%B3%B4%EB%8B%A4%EB%8A%94%20try-with-resources%EB%A5%BC%20%EC%82%AC%EC%9A%A9%ED%95%98%EB%9D%BC.md)

#### 3.1.3 그럼 `finalizer`와 `cleaner`는 대체 언제 쓰는가?

- close 메서드 안전망: 자원을 가진 클라이언트가 `close` 메서드를 호출하지 않는 경우를 대비해, `cleaner`와 `finalizer`를 객체를 수거하는 안전망으로 사용할 수 있습니다.
- 네이티브 피어와 연결된 객체: 자바 객체가 네이티브 메서드를 통해 네이티브 객체를 생성하면 가비지 컬렉터는 이 객체의 존재를 알지 못합니다. 네이티브 객체를 회수하려면 성능 저하를 감수하고 `close` 메서드를 사용해야 합니다.

### 3.2 try-with-resources

자바 라이브러리에는 `InputStream`, `OutputStream`, `java.sql.Connection` 등 `close()` 메서드를 이용해 닫아야 하는 자원이 많습니다. 그러나 자원 닫기는 예측할 수 없는 예외가 발생하면 클라이언트가 놓치기 쉽습니다. 이런 자원 중 대부분이 finalizer를 사용하지만 믿을만하지 못합니다.

#### 3.2.1 자원을 닫기 위해 try-finally를 사용하는 경우

아래 코드에서는 자원이 제대로 닫히는 것을 보장하는 수단으로 항상 실행됨을 보장하는 try-finally를 사용했습니다. 그러나 예외는 try문과 finally 문에서 모두 발생할 수 있습니다.

만약 기기에 물리적인 문제가 생긴다면 `readLine` 메서드에 문제가 생겨 예외를 던지고 `close()`도 실패할 것입니다. 이 경우 스택 추적 내역은 두번째 예외만을 기록할 것이고 디버깅을 어렵게 합니다.

```java
// 자원을 한개 사용하는 경우
static String firstLineOfFile(String path) throws IOException {
  BufferReader bt = new BufferReader(new FileReader(path));
  try {
    return br.readLine();
  } finally {
    br.close();
  }
}

```

```java
// 자원을 두개 사용하는 경우
static void copy(String src, String dst) throws IOException {
  InputStream in = new FileInputStream(src);
  try {
    OutputStream out = new FileOutputStrieam(dst);
    try {
      byte[] buf = new byte[BUFFER_SIZE];
      int n;
      while ((n = in.read(buf)) >= 0)
        out.write(buf, 0, n);
    } finally {
      cout.close();
    }
  }
}
```

#### 3.2.2 자원을 닫기 위해 try-with-resources를 사용하는 경우

자바 7은 리소스를 닫아야만 하는 자원은 `AutoCloseable` 인터페이스를 사용하게끔 했습니다. 아래 코드처럼 `AutoClosable`을 구현한 리소스에 try-with-resources를 사용하면 길이가 짧아져서 읽기 수월할 뿐 아니라 문제를 진단하기도 훨씬 쉽습니다.

이전 상황과 달리, 만약 `close()` 호출 양쪽에서 예외가 발생하면, `close()`에서 발생한 예외는 숨겨지고 `readLine`에서 발생한 예외만 기록됩니다.

try-finally에서처럼 try-with-resources에도 catch절을 쓸 수 있으므로 try문을 중첩하지 않고도 다수의 예외를 처리할 수 있게 됩니다.

```java
static String firstLineOfFile(String path) throws IOException {
  try (BufferReader br = new BufferedReader(
    new FileReader(path))) {
      return br.readLine();
    }
}
```

```java
static void copy(String src, String dst) throws IOException {
  try (InputStream in = new FileInputStream(src);
      OutputStream out = new FileOutputStream(dst)) {
        byte[] buf = new byte[BUFFER_SIZE];
        int n;
        while ((n = in.read(buf)) >= 0)
          out.write(buf, 0, n);
      }
}
```