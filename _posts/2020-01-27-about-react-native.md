---
layout: post
title: "React Native에 대해서"
authors: [koreanhole]
tags: ["Mobile", "React Native"]
image: assets/images/post-about-react-native/thumb.png
description: "React Native에 대한 설명입니다."
featured: true
---

## Intro

## React Native의 4가지 Thread

1. UI Thread
   - 메인 스레드
   - Android 혹은 iOS의 UI렌더링에 사용된다.
2. JavaScript Thread
   - JavaScript로직이 실행되는 Thread
   - 각종 API호출, 터치 이벤트가 처리되는 등의 스레드가 있다.
   - 네이티브 뷰에 대한 업데이트는 일괄 처리되며 JavaScript Thread의 각 이벤트 루프 끝에서 네이티브 측으로 전달되며 결국에는 UI Thread에서 실행된다.
   - 좋은 성능을 유지하기 위해 JavaScript Thread는 프레임 렌더링 데드라인 전에 배치 업데이트를 UI Thread에 전달할 수 있어야 한다.
     - iOS의 경우 초당 60프레임을 표시하며 새로운 프레임을 생성하기까지는 16.67ms가 소요된다.
     - UI를 느리게 하지 않기 위해서는 JavaScript 이벤트 루프에서 UI 변경으로 이어지는 복잡한 처리를 16.67ms이내로 처리해야 한다.
     - ScrollView혹은 navigatoriOS의 경우는 JavaScript Thread에서 실행되지 않고 UI Thread에서 100% 실행 되기 때문에 위의 제약조건에 해당하지 않는다.
3. Native Modules Thread
   - 앱이 플랫폼 API에 엑세스 하는 경우에 Native Modules Thread의 일부로 나타난다.
4. Render Thread
   - Android L(5.0)에서만 React Native의 Render Thread가 UI를 그리는데 사용된다. Render Thread는 UI를 그리는데 필요한 OpenGL명령을 생성한다.

## React Native앱이 실행되는 과정

1. 앱이 시작하면서 Main Thread(UI Thread)가 실행되며 JavaScript 번들을 로드한다.
2. JavaScript번들의 로드가 완료되면 Main Thread(UI Thread)는 JavaScript코드들을 JavaScript Thread로 보낸다.
   - 그래야 JavaScript Thread가 무거운 작업을 하더라도 Main Thread(UI Thread)가 문제를 일으키지 않기 때문이다.
3. React가 렌더링을 시작하면서 조정자(Reconciler)는 **diffing**을 시작하며 새로운 virtual DOM(layout)을 생성하며 변경점들을 다른 thread(Shadow Thread)로 보낸다.
4. Shadow Thread가 레이아웃의 계산을 끝마치면 레이아웃의 parameter혹은 object를 Main Thread(UI Thread)에 보낸다.
5. Main Thread는 shadow thread가 보낸 레이아웃을 화면에 렌더링한다.

> Diffing Algorithm이란?
>
> 컴포넌트 내에 스테이트가 변경된 경우 React는 해당 컴포넌트를 dirty하다고 표시하고 batch에 추가한다. 그리고 virtual Dom element와 실제 Dom element를 비교 순회하면서 dirty 체크가 되어있는 엘리먼트를 처리한다. 처리하는 과정에서 속성값만 변한 경우에는 속성값만 업데이트하고 해당 엘리먼트의 태그 혹은 컴포넌트가 변경된 경우라면 해당 노드를 포함한 하위 모든 노드를 제거한 후 새로운 virtual dom으로 대체한다. 이러한 일련의 과정이 모두 마무리 한 후에 실제 Dom에 결과를 업데이트 한다.

## Native Bridge

- React Native에서는 JavaScript 스레드가 Native Bridge를 통해 Native Thread와 통신한다.
  - Native Bridge가 없다면 JavaScript코드가 Native코드와 통신할 수 없다.
- JavaScript side에서 전송되는 데이터들은 JSON object로 Native Bridge를 통해 Native Side로 전달된다.
- JavaScript에서 사용되는 callback(button의 onPress와 같은 것들)의 경우는 Native side에서 버튼이 눌러졌다는 event를 다시 JavaScript side로 보낸 후 해당 이벤트에 맞는 callback function이 실행된다.
- React Native는 Main Thread → JavaScript Thread → Shadow Thread → Native side의 일련의 실행과정으로 실행이 되는데 많은 수의 연산이 필요할 경우(예를들어 매우 빠른 속도로 큰 규모의 리스트를 스크롤 할 경우) Native Bridge에서의 traffic jam이 발생한다.
  - 위와 같은 traffic jam을 피하기 위해 레이아웃을 미리 계산(pre calculating)하는 방법도 있다.
  - pre calculating을 통해 애초에 bridge를 건너는 횟수를 최소화하는 것이다.

## Future Of Native Bridge

- Facebook도 native bridge를 사용하는것에 있어서의 성능하락을 인지하고 있으며 React Native를 위한 완전히 새로운 architecture를 작업하고 있으며 결국에는 bridge사용을 제거할것이다.
- Facebook은 JavaScript Interface라는것을 구현하는 중이다.
  - JavaScript Interface(JSI)는 JavaScript코드와 JavaScript엔진 사이에 위치하는것으로, 결국은 JavaScript엔진을 제거할 것이다.
- 추가적으로 React Native는 Debug모드에서 Chrome브라우저(V8엔진 사용)에서도 작동될 예정이다.
- JSI의 사용으로 JavaScript side와 Native side가 통신하기 위해 더이상 JSON메시지를 보낼 필요가 없으며 Native Bridge를 사용할 필요도 없게 된다.
- 또한 현재는 React Native앱이 실행되면서 JavaScript side에서 사용되는 모든 native모듈들은 실행과 동시에 초기화 되어야 하지만 새로운 architecture에서는 필요할때만 초기화될것이다. 따라서 앱의 실행 성능에 이점이 있을것이다.
  - bridge를 사용하지 않고 JavaScript코드들이 직접적인 reference를 갖고 있기 때문에 가능한일이다.

## 참고자료

[How React Native Works?](https://www.codementor.io/@saketkumar95/how-react-native-works-mhjo4k6f3)

[How the React Native bridge works and how it will change in the near future](https://dev.to/wjimmycook/how-the-react-native-bridge-works-and-how-it-will-change-in-the-near-future-4ekc)
