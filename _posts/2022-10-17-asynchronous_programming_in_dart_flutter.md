---
layout: post
title:  "Dart/Flutter에서 비동기처리하기"
authors: [hfjxjjd123]
tags: ["Dart","Flutter","asynchronous","다트","플러터"]
image: assets/images/post-asyncDart/asynchronous.jpg
description: "Dart/Flutter에서 비동기처리하기"
featured: true
---


 ## 비동기처리(asynchronous programming)란?
 <br>

<strong>비동기처리</strong>는 대기를 필요로 하는 작업을 기다리면서도 프로세스가 다른 작업을 수행할 수 있도록 작업하는 방식을 말한다.

따라서 프로세스가 외부에 요청을 던지는 작업을 할 때, 그 요청에 대한 결과값을 반환하기 위해 프로세스가 멈춰서 기다리는 일이 없기 때문에, 버리는 시간 없이 효율적으로 작업을 처리할 수 있게된다.
<br>

비동기처리가 쓰이는 예시

- 네트워크에서 데이터를 받아올 때

- 데이터베이스에 데이터를 작성할 때

- 파일로부터 데이터를 읽어올 때
<br>
<br>

Dart언어는 <strong>`Stream`</strong>과 <strong>`Future`</strong>, 2가지 종류로 비동기처리를 지원한다.

`Stream`도 그렇고 `Future`도 그렇고 비동기처리 개념은 주로 외부에 사상/연산을 주고받고 하는 과정에서 사용되므로, 변수에 바로 `Stream`/`Future` 타입이 할당되기보단 외부작업을 맡기는 로직이 쓰이는 함수 내에서 `Stream`/`Future` 객체의 개념을 요구하는 경우가 대부분이다.

따라서 `Stream`/`Future` 객체는 함수에서 반환되는 경우가 많으며, 함수가 정의될 때 함수의 body에서 비동기처리 방식이 사용된다는 것을 아래 코드와 같이 명시해줘야 한다. 

```dart
Stream<T> function() async*{
	...
}

Future<T> function() async{
	...
}
```
위와 같이 `Stream`을 다루는 함수엔 <strong>`async*`</strong>,  `Future`를 다루는 함수엔 <strong>`async`</strong>라는 서로 다른 키워드를 통해서 함수  내에서 비동기처리방식이 쓰인다는 것을 명시할 수 있다.

다만 이 함수들의 반환형이 꼭 `Stream`, `Future`일 필요는 없다. `async*`/`async` 키워드는 함수의 body 안에 비동기작업이 있다는 것을 명시할 뿐 그 함수의 반환형에 대한 정보를 의미하는 것은 아니다.

<br> 
<br>

## Stream이란?
<br>
다른 환경에서도 많이 사용해서 다소 익숙한 비동기처리 개념 중 하나인 Stream은 Flutter에선 비동기적 이벤트(값)의 연속된 소스를 의미한다. 



<br>

`Stream`으로 정의된 함수는 선언 즉시 `Stream` 객체를 반환하며, 그 후엔 `Stream`의 데이터에 접근해서 사용할 때까지 아무 일도 일어나지 않는다.
이후 <strong>`listen()`</strong>/<strong>`await for`</strong> 키워드를 통해 `Stream`객체의 <strong>데이터</strong>에 접근할 수 있으며, 이 때 `async*` 함수가 동작하게 된다.
```dart
stream.listen((int x) => print(x)); //listen()
    
await for (final value in stream) { //await for
	sum += value;
}
```

일반적으로 `Stream` 객체의 데이터에 접근하는 과정에서 iterator의 개념이 사용되는데, 가장 최근에 올라온 이벤트들을 하나씩 처리하고 지워나가면서 `Stream` 안에 남은 이벤트가 없어질 때까지 이를 계속하게 된다. 
이렇게 한 이벤트는 한 번 사용하고 버리는 것을 <strong>단일구독스트림</strong>이라고 한다.

하나의 이벤트에 여러 번 접근해서 값을 사용하고 싶다면 <strong>브로드캐스트스트림</strong> 형식을 사용하면 된다.

<br>
<br>

## Future란?
<br>
보통 외부의 결과에 영향을 받는 비동기식 작업은 의미적으로 2가지 상태로 구분된다.

- 외부로부터 결과값을 받은 상태(#1)
- 외부로부터 결과값을 아직 받지 못한 상태(#2)

`Future` 타입을 가지는 객체는 비동기식 작업을 수행할 때 그 작업의 상태(#1, #2)에 상관없이 `Future`라는 타입을 반환한다.

따라서 `Stream`과 마찬가지로 `Future`가 의미적으로 포함하는 <strong>실제 데이터값</strong>에 접근하기 위해선 특수 키워드들이 사용되는데, `Future`에선 <strong>`await`</strong>, <strong>`then`</strong>을 사용한다.

Flutter에서 데이터베이스를 다룰 때 주로 `Future`를 사용하므로 예제 소스코드 3개를 보면서 개념을 자세히 확인해 보자. 

참고로 `getString1()` / `getString3()`은 각각 1초, 3초 기다렸다 `String` 값을 의미적으로 받아오는 `Future<String>` 타입의 함수이다.

<br>


### 1. `then` 키워드 쓰임새
```dart
import 'dart:async';

void main() async{
  
  Future<String> getString1(){
    return Future.delayed(Duration(seconds:1),()=>"연산1");
  }
  Future<String> getString3(){
    return Future.delayed(Duration(seconds:3),()=>"연산3");
  }
  
  getString3().then((String string){print(string);});
  //getString3() 요청 후 계속..
  getString1().then((String string){print(string);}); 
  //getString1() 요청 후 계속..
```
`getString3()`이 먼저 호출됐지만 비동기적 연산을 하므로`getString1()`의 호출도 즉시 이뤄진다. 이후 `then` 키워드를 통해서 비동기연산의 결과(필요한 데이터)를 받아오는데, 1초 후 `getString1()`의 결과값이 먼저(`연산1`) 연산되며 이후 2초가 더 지난 뒤 `getString3()`의 결과값(`연산3`)이 처리되므로 `연산1`이 먼저 출력된 후 `연산3`이 출력된다.

<br>

### 2. `await` 키워드 쓰임새
```dart
import 'dart:async';

void main() async{
  
  Future<String> getString1(){
    return Future.delayed(Duration(seconds:1),()=>"연산1");
  }
  Future<String> getString3(){
    return Future.delayed(Duration(seconds:3),()=>"연산3");
  }
  
  print(await getString3()); 
  // getString3() 요청, await로 getString3()이 데이터값을 받아올 때 까지 기다림
  // 3초후 String 데이터값을 받아오고 계속
  print(await getString1()); 
  // getString1() 요청, await로 getString1()이 데이터값을 받아올 때 까지 기다림
  // 1초후 String 데이터값을 받아옴
}
```
`getString3()`이 먼저 호출됐으며, `await`라는 키워드로 `getString3()`의 결과값이 반환될 때까지 프로세스는 기다린 후 그 결과값을 반환한다. 
3초 후 `getString3()`이 반환되고 나서 `getString1()`이 호출되며 마찬가지로 결과값이 반환될 때까지 프로세스가 기다린 후 그 결과값을 반환하게 되므로 `연산3`이 먼저 출력된 후에 `연산1`이 출력된다.

<br>

### 3. `await`의 필요성
`await`는 얼핏보면 동기 처리 성격을 가지고 있어서 일반적인 동기 처리 방식으로 해결하면 되지 않나 하는 생각이 들 수 있지만 `await`는 연쇄적으로 `async`함수 , `Future`를 받아오는 상황에서 유용하게 쓰일 수 있다.

```dart
onTap:() async{
      await updateModel(Model);
      BLOC().add(getAllModel(Model.day));
      setState((){});
    }
```
위의 코드는 `onTap`이라는 이벤트가 발생했을 때 `updateModel()` 메소드로 데이터를 데이터베이스에 업데이트 한 후 그 업데이트 된 데이터를 포함한 모든 `Model` 데이터를 받아오게 설계돼있다. 

그렇기 때문에 데이터베이스를 업데이트 해주는 `updateModel()`의 작업처리가 완료된 후 `getAllModel()` 메소드가 동작해야 하므로 `await`가 사용되어 `updateModel()`의 작업처리를 기다린 후 반환했다. 

하지만 `getAllModel`을 통해 받아온 데이터 모델들은 아직 데이터 값으로 반환할 필요가 없기 때문에 `await` 사용 없이 `Future` 자료형인 채로 그대로 다음 메소드의 인자로 전달하여 처리를 미룰 수 있게된다. 

이렇게 `await`는 필요한 순간에 데이터 값을 반환하거나 완료를 기다릴 수 있도록 해주기 때문에 비동기처리에서 데이터를 다룰 때 유용하게 사용된다.

<br>
<br>

## 비동기처리 in Flutter
<br>

이제 Flutter에서  비동기처리방식, `Stream`과 `Future` 개념을 어떻게 사용하는지 알아보겠다.

Flutter에서의 쓰임을 얘기하기 전에 Flutter의 구성에 대해 간단하게 설명하면, Flutter는 `Widget`이라는 기본 단위로 구성되어있다. `Widget`은 Flutter에서 화면에 보여지는 모든 UI (View)의 기본 단위로써 의미를 가진다.

`Widget`을 빌드할 때 사용될 정보가 데이터베이스에 있는 등의 상황에서, 비동기처리를 이용해 `Widget`을 렌더링 해야하는데, Flutter에선 이를 지원해주는 기본 빌더 `FutureBuilder`, `StreamBuilder`가 있다.

기본적으로 `FutureBuilder` , `StreamBuilder` 모두 <strong>`AsyncSnapshot`</strong>라는 객체를 추가적으로 다룬다.

<br>

### `AsyncSnapshot`이란? 

비동기처리의 상태를 알 수 있게 해주는 객체이며, 비동기처리가 완료된 상태라면 데이터를 조회할 수도 있다.

앞서 얘기했지만 비동기처리는 다음과 같이 2가지 상태를 가질 수 있다.

- 외부로부터 결과값을 받은 상태
- 외부로부터 결과값을 아직 받지 못한 상태
<br>

편의상 `snapshot`을 `AsyncSnapshot`의 객체라 할 때, `snapshot.hasData`라는 필드에 접근해서 비동기처리의 상태를 알아낼 수 있다.

`snapshot.hasData == true` => 외부로부터 결과값 or Error값을 받아온 상태 <br> 
`snapshot.hasData == false` => 외부로부터 결과값을 받지 못한 상태

`snapshot.hasError`라는 필드를 통해선 반환값이 에러인지 확인가능하고,
`snapshot.data`필드를 통해 반환한 실제 데이터값을 얻어낼 수 있다.

<br>

### `StreamBuilder`, `FutureBuilder` 사용법

```dart
StreamBuilder<T>(
	stream: stream, // 위젯에서 다룰 정보를 가지는 Stream<T> 객체 
    builder: (BuildContext context, AsyncSnapshot<T> snapshot) {
    	return (snapshot.hasData)? Widget('Result'):Widget('Waiting');
    }
)

FutureBuilder<T>(
	future: future, // 위젯에서 다룰 정보를 가지는 Future<T> 객체 
    builder: (BuildContext context, AsyncSnapshot<T> snapshot) {
    	return (snapshot.hasData)? Widget('Result'):Widget('Waiting');
    }
)
```
위젯의 기본 구성은 다음과 같으며,빌더는 인자로 들어간 `stream`, `future`의 `AsyncSnapshot`을 받아온 후 `snapshot.hasData`의 결과 상태에 따라서 
`true` 일 때는 `Widget('Result')`를, 
`false`일 때는 `Widget('Waiting')`을 빌드한다는 것을 알 수 있다.


위젯은 `stream`, `future`가 데이터 값을 반환할 때까지, 즉 `snapshot.hasData != null` 일 때까지 계속해서 위젯을 리빌딩한다.

이를 통해서 Flutter에서 비동기적 방식으로 위젯을 빌드할 수 있는 것이다.
