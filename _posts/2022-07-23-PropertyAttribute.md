---
layout: post
title: "What is Property Attribute"
authors: [pasly0920]
tags: ["Web"]
image: ../assets/images/post-Property-Attribute/ModernJsDeepDive.png
description: "JS는 어떻게 내부적으로 작동하는가?"
featured: true
---

## What is Property Attribute?

우리는 JS를 사용하면서 수많은 객체들을 사용하지만 이러한 객체의 어트리뷰트와 메서드 등이 실제로 어떻게 작동하는지는 잘 모르는 경우가 많고 필자 역시 얼마전까지 그러했다. 본 내용은 모던 자바스크립트 딥 다이브 책을 읽으면서 이에 대해 정리한 내용으로 JS엔진이 어떠한 방식으로 프로퍼티를 처리하는 지 알 수 있는 좋은 기회가 되리라 생각한다.

### 1. 내부 슬롯과 내부 메서드

---

프로퍼티 어트리뷰트를 이해하기 위해서 내부 슬롯과 내부 메서드의 개념을 먼저 알아보자. 내부 슬롯과 내부 메서드는 JS 엔진의 구현 알고리즘을 셜명하기 위해 ECMA Script 사양에서 사용하는 pseudo property, pseudo method로 [[...]]과 같은 방식으로 표기한다. 내부 슬롯과 내부 메서드는 ECMA Script 사양에 정의된 대로 구현되어 JS 엔진에서 실제로 동작하지만 개발자가 직접 접근 가능한 외부 공개된 프로퍼티는 아니다. 내부적으로 작동하므로 원칙적으로 접근 또는 호출 방법을 제공하지 않으나 일부 내부 슬롯과 메서드에서는 접근 수단을 제공하기도 한다.

예를 들어 모든 객체는 [[Prototype]]이라는 내부 슬롯을 가진다. 원칙적으로 내부 슬롯은 접근 방법이 없지만 [[Prototype]] 내부 슬롯은 \_\_prototype\_\_를 통해서 간접적으로 접근할 수 있다.

```javascript
const o = {};
//내부 슬롯은 JS엔진의 내부 로직이므로 직접 접근 불가
o.[[Prototype]]
//단 일부 내부 슬롯과 내부 메서드에 한해 간접적으로 접근 가능한 수단 제공
o.__proto__ // -> Object.prototype
```

### 2. 프로퍼티 어트리뷰트와 프로퍼티 디스크립터 객체

---

JS 엔진은 프로퍼티를 생성할 때 프로퍼티의 상태를 나타내는 프로퍼티 어트리뷰트를 기본값으로 자동 정의한다. 프로퍼티의 상태란 **프로퍼티 값, 프로퍼티 값의 갱신 가능 여부, 열거 가능 여부, 정의 가능 여부**를 의미합니다. 이에 대응되는 프로퍼티 어트리뷰트는 JS 엔진이 관리하는 내부 슬롯 [[Value]], [[Writeable]], [[Enumerable]], [[Configurable]]이다. 이들에 직접 접근할 수는 없지만 Object.getOwnPropertyDescriptor 메서드를 활용해 간접적으로 확인할 수 있다.

Object.getOwnPropertyDescriptor 메서드 호출 시에 첫 번째 매개변수에는 객체 참조를 전달하고 두 번째 매개변수에는 해당 프로퍼티 키를 문자열로 전달하여 사용한다. 이 때 프로퍼티 키에 해당하는 프로퍼티 어트리뷰트를 반환하는 Property Descriptor 객체를 반환한다. ES8에서 도입된 Object.getOwnPropertyDescriptor**s** 메서드는모든 프로퍼티의 프로퍼티 어트리뷰트를 정보를 제공하는 Property Descriptor 객체를 반환한다.

```javascript
const person = {
  name: "Lee",
};
//프로퍼티 동적 생성
person.age = 20;
console.log(Object.getOwnPropertyDescriptor(person, "name"));
// { value: 'Lee', writeable: true, enumerable: true, configurable: true}
console.log(Object.getOwnPropertyDescriptors(person));
/*
{
    name: { value: 'Lee', writeable: true, enumerable: true, configurable: true}
    age: { value: 20, writeable: true, enumerable: true, configurable: true}
}
*/
```

해당 속성들에 대해서 정리하자면

> value
>
> - 프로퍼티 키를 통해 프로퍼티 값에 접근하면 반환되는 값이다.
> - 프로퍼티 키를 통해 프로퍼티 값을 변경하면 [[Value]]에 값을 재할당한다. 이 때 해당 프로퍼티가 존재하지 않는 값이라면 프로퍼티를 동적 생성하고 생성된 프로퍼티의 [[Value]]에 값을 저장한다.
>
> Writeable
>
> - 해당 속성의 값이 변경 가능한지 여부를 나타내며 Boolean 값을 가진다.
> - [[Writeable]]이 false인 경우 해당 프로퍼티의 [[Value]]의 값을 변경할 수 없는 읽기 전용 프로퍼티가 된다.
>
> Enumerable
>
> - 프로프터의 열거 가능 여부를 나타내며 Boolean 값을 가진다.
> - 열거 가능한 속성이라면 for ... in 반복문으로 접근하여 순회할 수 있습니다.
> - [[Enumerable]]의 false인 경우 해당 프로퍼티는 for ... in문이나 Object.keys 메서드 등으로 열거할 수 없다.
>
> Configurable
>
> - 프로퍼티의 재정의 가능 여부를 나타내며 Boolean 값을 가진다.
> - configurable이 false로 설정되면 해당 속성을 잠그고 enumerable 및 configurable을 다시 변경하는 것을 방지합니다. 추가적으로 해당 프로퍼티 값 또는 메서드를 삭제하지 못하도록 방지합니다. Writeable이 true인 경우 Value의 변경과 writeable을 false로 변경하는 것은 허용됩니다.

### 3. 데이터 프로퍼티와 접근자 프로퍼티

---

프로퍼티는 데이터 프로퍼티와 접근자 프로퍼티로 구분할 수 있다.

> 데이퍼 프로퍼티
>
> - 키와 값으로 구성된 일반적인 프로퍼티이다. 거의 대부분의 프로퍼티
>
> 접근자 프로퍼티
>
> - 자체적으로 값을 갖지 않고 다른 데이터 프로퍼티의 값을 읽거나 저장할 때 호출되는 접근자 함수로 구성된 프로퍼티

#### 3.1 데이터 프로퍼티

데이터 프로퍼티는 앞서 말한 [[Value]], [[Writeable]], [[Enumerable]], [[Configurable]]를 JS 엔진에 의해서 기본값으로 자동 정의된다. 예제를 다시 한 번 살펴보자.

```javascript
const person = {
  name: "Lee",
};
//프로퍼티 동적 생성
person.age = 20;
console.log(Object.getOwnPropertyDescriptor(person, "name"));
// { value: 'Lee', writeable: true, enumerable: true, configurable: true}
```

Object.getOwnPropertyDescriptor 메서드가 반환한 프로퍼티 디스크립터 객체를 살펴보면 value 프로퍼티의 값은 'Lee'로 이것은 프로퍼티 어트리뷰트 [[Value]]의 값이 'Lee'임을 의미한다. writeable, enumerable, configurable 모두 true인 것은 [[Writeable]], [[Enumerable]], [[Configurable]]이 모두 True임을 의미한다. 이처럼 프로퍼티가 생성될 때 [[Value]]의 값은 프로퍼티 값을 초기화되며 [[Writeable]], [[Enumerable]], [[Configurable]]은 true로 초기화된다. 이는 프로퍼티를 동적 추가해도 동일하게 적용된다. 데이터 프로퍼티의 속성 정리는 위의 속성 정리를 참고하면 된다.

#### 3.2 접근자 프로퍼티

접근자 프로퍼티는 자체적으로 가지는 값이 없고 다른 데이터 프로퍼티의 값을 읽거나 저장할 때 사용하는 접근자 함수로 구성된 프로퍼티이다.
접근자 프로퍼티는 다음과 같은 프로퍼티 어트리뷰트를 갖는다.

프로퍼티 어트리뷰트 : 프로퍼티 디스크립터 객체의 프로퍼티

> [[Get]] : get
>
> - 접근자 프로퍼티를 통해 데이터 프로퍼티의 값을 읽을 때 호출되는 접근자 함수다.
> - 접근자 프로퍼티 키로 프로퍼티 값에 접근하면 프로퍼티 어트리뷰트 [[Get]]의 값, 즉 getter 함수가 호출되고 그 결과가 프로퍼티 값으로 반환된다.
>
> [[Set]] : set
>
> - 접근자 프로퍼티를 통해 데이터 프로퍼티의 값을 저장할 때 호출되는 접근자 함수다.
> - 접근자 프로퍼티 키로 프로퍼티 값을 저장하면 프로퍼티 어트리뷰트 [[Set]]의 값, 즉 setter 함수가 호출되고 그 결과가 프로퍼티 값으로 저장된다.
>   Enumerable, configurable은 데이터 프로퍼티의 Enumerable, configurable과 동일하다.
>   접근자 함수를 getter/setter함수라고도 부르며 접근자 프로퍼티는 getter와 setter 함수를 모두 정의할 수도 있고 하나만 정의할 수 도 있다.

```javascript
const person = {
    firstName : 'Ungmo',
    lastName: : 'Lee',
    //getter 함수
    get fullName() {
        return `${this.firstName} ${this.lastName}`;
    };
    //setter 함수
    set fullName(name) {
        [this.firstName, this.lastName] = name.split(' ');
    };
    //fullName은 접근자 프로퍼티로 [[Get]], [[Set]], [[Enumerable]], [[Configurable]] 프로퍼티 어트리뷰트
    console.log(Object.getOwnPropertyDescriptor(person, 'fullName'));
    // {get : f, set : f, enumerable: true, configurable: true}
}
```

접근자 프로퍼티는 자체적으로 값(프로퍼티 어트리뷰트 [[Value]])을 가지지 않으며 다만 데이터 프로퍼티의 값을 읽거나 저장할 때 관여할 뿐이다. 이를 내부 슬롯 / 메서드 관점에서 설명하면 다음과 같다. 접근자 프로퍼티 fullName으로 프로퍼티 값에 접근하면 내부적으로 [[Get]] 내부 메서드가 호출되어 다음과 같이 동작한다.

1. 프로퍼티 키가 유효한지 확인한다. 프로퍼티 키는 문자열 또는 심벌이어야 한다. 프로퍼티 키 "fullName"은 문자열이므로 유효한 프로퍼티 키이다.

2. 프로토타입 체인에서 프로퍼티를 검색한다. person 객체에 fullName 프로퍼티가 존재한다.

3. 검색된 fullName 프로퍼티가 데이터 프로퍼티인지 접근자 프로퍼티인지 확인한다. fullName 프로퍼티는 접근자 프로퍼티이다.

4. 접근자 프로퍼티 fullName의 프로퍼티 어트리뷰트 [[Get]]의 값, 즉 getter 함수를 호출하여 그 결과를 반환한다. 프로퍼티 fullName 의 프로퍼티 어트리뷰트 [[Get]]의 값은 Object.getOwnPropertyDescriptor 메서드가 반환하는 프로퍼티 디스크립터 객체의 get 프로퍼티 값과 같다.

프로포타입에 대해서는 추후 19장에서 다루도록 하겠습니다.

접근자 프로퍼티와 데이터 프로퍼티는 각각이 가지는 디스크립터 객체의 프로퍼티가 다름을 통해서 구분이 가능합니다.

### 4. 프로퍼티 정의

---

프로퍼티 정의란 새로운 프로퍼티를 추가하면서 프로퍼티 어트리뷰트를 명시적으로 정의하거나, 기존 프로퍼티의 프로퍼티 어트리뷰트를 재정의하는 것을 의미합니다. 예를 들얼 프로퍼티 값을 갱신 가능하도록 할 것인지 등에 대한 정의를 하는 것입니다. 이를 통해 객체의 프로퍼티가 어떻게 동작해야 하는지를 명확히 정의할 수 있습니다.

Object.defineProperty 메서드를 사용하면 프로퍼티의 어트리뷰트를 정의할 수 있습니다. 인수로는 객체의 참조와 데이터 프로퍼티의 키, 프로퍼티 디스크립터 객체를 전달합니다.

```javascript
const person = {};
Object.defineProperty(person, "firstName", {
  value: "Ungmo",
  writeable: true,
  enumerable: true,
  configurable: true,
});
Object.defineProperty(person, "lastName", {
  value: "Lee",
});
console.log(Object.getOwnPropertyDescriptor(person, "firstName"));
//firstName {value: "Ungmo", writeable: true, enumerable: true, configurable: true}
console.log(Object.getOwnPropertyDescriptor(person, "lastName"));
// lastName {value : "Lee", writeable: false, enumerable: false, configurable: false}
```

Object.defineProperty 메서드로 프로퍼티를 정의할 때 프로퍼티 디스크립터 객체의 프로퍼티를 일부 생략할 수 있다. 이 때 생략된 어트리뷰트는 다음과 같은 기본값이 적용된다.

| 프로퍼티 디스크립터 객체의 프로퍼티 | 대응되는 프로퍼티 어트리뷰트 | 생략했을 때의 기본값 |
| ----------------------------------- | ---------------------------- | -------------------- |
| value                               | [[Value]]                    | undefined            |
| get                                 | [[Get]]                      | undefined            |
| set                                 | [[Set]]                      | undefined            |
| writeable                           | [[Writeable]]                | false                |
| enumerable                          | [[Enumerable]]               | false                |
| configurale                         | [[Configurable]]             | false                |

Object.defineProperty를 활용하면 한 번에 하나의 프로퍼티만 정의할 수 있지만 Object.defineProperties를 활용하면 한 번에 여러 개의 프로퍼티를 한 번에 정의할 수 있다.

```javascript
const person = {};
Object.defineProperties(Person, {
    firstName: {
        value: 'Vincenzo',
        writeable : true,
        enumerable: true,
        configurable: true,
    },
    lastName: {
        value: 'Casano',
        writeable : true,
        enumerable: true,
        configurable: true,
    }
    ....
})
```

### 5. 객체 변경 방지

---

객체는 변경가능한 값이므로 재할당 없이 직접 변경할 수 있다. 즉, 프로퍼티를 추가하거나 삭제할 수 있고, 프로퍼티 값을 갱신할 수 있으며, Object.defineProperty 등의 메서드를 사용하여 프로퍼티 어트리뷰트를 재정의할 수도 있다.

JS는 객체의 변경을 방지하는 다양한 메서드를 제공한다. 객체 변경 방지 메서드들은 각각 객체의 변경을 금지하는 강도가 다르다.

| 구분           | 메서드                   | 프로퍼티 추가 | 프로퍼티 삭제 | 프로퍼티 값 읽기 | 프로퍼티 값 쓰기 | 프로퍼티 어트리뷰트 재정의 |
| -------------- | ------------------------ | ------------- | ------------- | ---------------- | ---------------- | -------------------------- |
| 객체 확장 금지 | Object.preventExtensions | X             | O             | O                | O                | O                          |
| 객체 밀봉      | Object.seal              | X             | X             | O                | O                | X                          |
| 객체 동결      | Object.freeze            | X             | X             | O                | X                | X                          |

#### 5.1 객체 확장 금지

Object.preventExtensions 메서드는 객체의 확장을 금지한다. 객체 확장 금지란 프로퍼티 추가 금지를 의미한다. 확장이 금지된 객체는 프로퍼티 추가가 금지된다. 프로퍼티를 추가하는 방법은 프로퍼티 동적 추가와 Object.defineProperty가 있는데 이 두 방법 모두 금지된다. 확장이 가능한 객체인지 여부는 Object.isExtensible 메서드로 확인할 수 있다.

```javascript
const person = { name: "Lee" };
console.log(Object.isExtensible(person)); // true Person은 확장 가능한 객체임
Object.preventExtension(person); // Person 객체의 확장을 금지하여 프로퍼티 추가를 금지한다.
perosn.age = 20; // 무시. strict mode 에서는 에러가 발생
delete person.name; // 프로퍼티 추가는 금지되지만 삭제는 가능하다.
```

#### 5.2 객체 밀봉

Object.seal 은 객체를 밀봉한다. 객체 밀봉이란 프로퍼티 추가 및 삭제와 프로퍼티 어트리뷰트 재정의 금지를 의미한다. 밀봉된 객체는 읽고 쓰기만 가능하다.

```javascript
const person = { name: "Lee" };
console.log(Object.isSealed(person)); //false 밀봉된 상태가 아님
Object.seal(person); //person 객체를 밀봉하여 프로퍼티 추가, 추가, 삭제, 재정의를 금지한다.
console.log(Object.isSealed(person)); //true 밀봉된 상태임 밀봉된 상태에서 configurable은 false이다.
person.age = 20; // X
delete person.name; // X
person.name = "Kim"; // O
// 프로퍼티 추가, 프로퍼티 삭제는 불가하지만 프로퍼티 값 갱신은 가능하다.
```

#### 5.3 객체 동결

Object.freeze 메서드는 객체를 동결한다. 객체 동결이란 프로퍼티 추가 및 삭제와 프로퍼티 어트리뷰트 재정의 금지, 프로퍼티 값 갱신 금지를 의미한다. 즉 동결된 객체는 읽기만 가능하다.

객체의 동결 여부는 Object.isFrozen 메서드로 확인 가능하다.

```javascript
const person = { name: "Lee" };
Object.isFrozen(person); //false
Object.freeze(person); // person 객체를 동결하여 프로퍼티 추가, 삭제, 재정의, 쓰기를 금지한다.
Object.isFrozen(person); //true
// 동결된 객체 person은 writeable과 configurable이 false이다.
person.age = 20; // X
delete person.name; // X
person.name = "Kim"; // X
// 프로퍼티 추가, 프로퍼티 삭제, 프로퍼티 값 갱신 금지됨.
```

#### 5.4 불변 객체

지금까지 살펴본 변경 방지 메서드들은 얕은 변경 방지로 직속 프로퍼티만 변경이 방지되고 중첩 객체까지는 영향을 주지 못했다. 따라서 Object.freeze 메서드로 객체를 동결하여도 중첩 객체까지는 동결할 수 없다.

```javascript
const person = {
  name: "Lee",
  address: { city: "Seoul" },
};
Object.freeze(person); // 얕은 객체 동결
Object.isFrozen(person); // true
Object.isFrozen(person.address); //false
// 중첩 객체까지는 동결하지 못한다. 고로 address는 수정 및 변경 가능
```

객체의 중첩 객체까지 동결하여 변경이 불가능한 읽기 전용의 불변 객체를 구현하려면 객체를 값으로 갖는 모든 프로퍼티에 대해 재귀적으로 Object.freeze 메서드를 호출해야 한다. 아래 deepFreeze를 통해서 깊은 변경 방지를 할 수 있다.

```javascript
function deepFreeze(target) {
  if (target && typeof target === "object" && !Object.isFrozen(target)) {
    Object.freeze(target);
    Object.keys(target).forEach((key) => deepFreeze(target[key]));
  }
  return target;
}
```
