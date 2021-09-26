---
layout: post
title: '함수형 언어의 특징 "Closure"'
authors: [gusrb3164]
tags: ['Web']
image: ../assets/images/post-js-closure/javascript-logo.png
description: '자바스크립트의 기술중 하나인 클로저에 대해서'
featured: true
---

리액트팀의 6월 tech talk에서 다룬 주제중 하나인 자바스크립트 Closure에 대한 글입니다.

## Closure

클로저의 개념에 앞서 앞의 예시 코드의 실행 결과를 우선 살펴 보겠습니다.

```js
function assert(value, text) {
  value ? console.log(text) : console.log('error');
}

var outerValue = 'ninja';
var later;

function outerFunction() {
  var innerValue = 'samurai';

  function innerFunction() {
    assert(outerValue, 'Inner can see the ninja'); // 전역 변수를 참조하는건 당연히 가능하다.
    assert(innerValue, 'Inner can see the samurai'); // 하지만 outerFunction 함수가 끝나도 innerValue를 참조하는게 가능할까?
  }
  later = innerFunction; // 전역 변수에 innerFunction을 대입.
}
outerFunction();
later(); // outerFunction의 실행이 끝나고 later 함수 실행.
```

later 변수에 innerFunction을 대입해준 뒤 호출하게 되면 어떻게 될까요?

대부분 언어들의 방식에서는 함수의 생명주기가 끝나고 innerValue를 참조하려 하면 에러가 발생합니다.

하지만 자바스크립트에서는 innerValue의 참조가 가능하여 에러가 발생하지 않습니다.

이러한 이유는 innerFunction을 클로저라는 보호막이 감싸고 있으며, innerFunction()의 클로저는 해당 함수가 존재하는 한, 함수의 유효 범위와 관계된 모든 변수를 가비지 컬렉션으로부터 보호하기 때문입니다.

> ![capture](https://gusrb3164.github.io/assets/images/posts/closure.jpg)
> '자바스크립트 닌자' 책에서 클로저를 그림으로 표현한 것

그렇다면 자바스크립트 언어에서는 왜 이런 클로저가 발생하는 것일까요?

---

## Js의 Garbage Collection

바로 자바스크립트의 가비지 컬렉터 정책 때문입니다.

보통 저수준 언어에서는 메모리가 필요없어질 때를 개발자가 직접 결정하고 해제하는 방식을 사용합니다. (ex: C언어의 malloc() 과 free())

하지만 자바스크립트에서는 **도달가능성**이라는 개념을 통해 언어 자체적으로 메모리를 관리합니다.
즉, ‘도달 가능한(reachable)’ 값은 쉽게 말해 어떻게든 접근하거나 사용할 수 있는 값을 의미합니다. 도달 가능한 값은 메모리에서 삭제되지 않습니다.

> 자바스크립트의 실행 컨텍스트의 최상위 객체는 브라우저에서 **window**, Node js 에서 **global** 입니다. 따라서, 가비지 컬렉터는 해당 최상위 객체에서의 접근을 기준으로 합니다.

그럼 가비지컬렉터 개념을 가지고 다시 위의 코드의 동작을 살펴봅시다.

```js
function assert(value, text) {
  value ? console.log(text) : console.log('error');
}

var outerValue = 'ninja';
var later; // 전역 변수

function outerFunction() {
  var innerValue = 'samurai';

  function innerFunction() {
    assert(outerValue, 'Inner can see the ninja');
    assert(innerValue, 'Inner can see the samurai');
  }
  later = innerFunction; // 최상위 객체가 참조하는 변수에 innerFunction을 대입한다.
}
outerFunction();
later(); // later변수를 통해 innerFunction을 참조하고, outerFunction의 innerValue까지 참조가 가능하므로 innerFunction을 감싸는 outerFunction 을 가비지 컬렉터가 회수하지 않는다!
```

코드의 동작 순서를 나타내보면 다음과 같습니다.

1. outerFunction을 호출한다.
2. 전역 객체의 변수인 later가 innerFunction을 참조하도록 한다.
3. outerFunction 내부의 innerValue는 innerFunction이 참조한다.
4. innerFunction의 유효범위에 해당하는 outerFunction 내부 모든 곳은 전역 객체에서 참조가 가능하여 가바지 컬렉터가 회수하지 않는다.
5. 따라서 outerFunction을 감싸는 일종의 메모리 보호막인 클로저가 작동한다.

---

## Closure의 활용법

함수형 언어에서 클로저를 주로 이용하는 방식중 가장 중요한 것을 추려본다면 주로 2가지가 있습니다.

### 1. 변수의 전역 오염을 막도록 private 효과 나타내기

```js
function assert(value, text) {
  value ? console.log(text) : console.log('error');
}

function Ninja() {
  var feints = 0;

  this.getFeints = () => feints;
  this.feint = () => {
    feints++;
  };
}

var ninja = new Ninja(); // 함수를 new로 생성하면 함수내 this는 ninja context를 참조한다.
ninja.feint();

assert(ninja.getFeints() == 1, '생성자 함수 내부에 있는 feint 변수의 값은 얻어올 수 있다.');
assert(ninja.feints === undefined, '하지만 private변수에 직접 접근할 수 없다.');
```

위의 코드 예시는 클로저를 활용해서 feints변수를 get, set하는 과정은 모두 메서드를 통해서만 가능하고 직접 feints 변수를 외부에서 참조하는 것을 불가능하게 합니다.

### 2. 함수가 관리하는 변수를 함수가 소멸한 이후에도 기억하도록 하기

두번째 방법은 리액트 Hook의 useState를 생각하면 이해하기 쉽습니다. 리액트에서는 함수형 컴포넌트를 구현하기 위해 컴포넌트가 소멸되어도 상태를 유지하려고 클로저를 사용했습니다.

아래 코드는 useState의 클로저를 이해하기 쉽게 간추려 낸 코드 예시입니다.
useState가 outerFunction, state와 setState가 innerFunction로 매핑되는걸 확인할 수 있습니다.

```js
const useState = initialValue => {
  let innerState = initialValue;
  const state = () => innerState;
  const setState = newValue => {
    innerState = newValue;
  };
  return [state, setState];
};
```

---

### 참고문서

- <https://ko.javascript.info/garbage-collection>
- <https://developer.mozilla.org/ko/docs/Web/JavaScript/Memory_Management>
