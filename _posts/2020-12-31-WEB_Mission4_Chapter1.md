---
layout: post
title: "Web Mission4 - React 1장. 리액트 입문"
authors: [min6choi]
tags: ["Web"]
image: assets/images/post-WEB-Mission4/react.png
description: "React Chapter1"
featured: false
---

Web Team의 Mission4는 React(리액트)를 공부하는 것이었습니다. 특히 이번 미션은 기존에 했던 방식과 다르게 새로운 미션을 만들어 수행하는 대신 온라인을 통해 제공되는 강의 1장과 2장을 2주동안 수강하며 리액트를 공부하고 강의 내용을 깃허브 레포지터리에 커밋하고 푸시하는 방식으로 진행되었습니다.

저희가 공부한 웹사이트 강의는 다음과 같습니다. (그러나 리액트를 처음 접해보는 경우 이 강의를 바로 듣는 것을 추천하지 않습니다.)

> [#4 Mission : 벨로퍼트와 함께하는 모던 리액트](https://react.vlpt.us/){: target="\_blank"}

그럼 이번 블로그 글에서는 1장.리액트 입문에서 배운 간단한 리액트 기능에 대해 다루겠습니다.

## 리액트를 공부하는 이유

형진님의 주도하에 이루어진 리액트 미션을 진행하게 된 이유는 다음과 같습니다.

- 상대적으로 규모가 큰 웹 어플리케이션의 복잡하고 거대한 UI를 계획할 때 리액트를 이용하였을 경우 컴포넌트를 기반으로 추상화하기 때문에 개발 및 유지보수가 용이합니다.
- 특정 부분을 새로 변경할 때 DOM을 직접 건들지 않고 Virtual DOM을 이용하여 개발자가 사소한 부분을 신경쓰지 않도록 해준다는 점에서 생산성이 증가합니다.

## 1장에서 공부한 내용들

- 리액트의 특징
  - 리액트 컴포넌트 예시

  ```jsx
  import React from 'react';

  function Hello() {
    return <div>Hello</div>
  }

  export default Hello;
  ```

  리액트 컴포넌트를 만들 때 앞에

  ```jsx
  import React from 'react';
  ```

  와 같은 문장을 통해 리액트를 불러와줘야 합니다.

  그리고 문서의 마지막에는

  ```jsx
  export default Hello;
  ```

  와 같이 Hello 라는 컴포넌트를 내보내겠다는 문장을 작성해야 합니다.

- 리액트를 통해 동적인 부분 구현하기
  - Counter 컴포넌트 :  간단하게 +와 -버튼을 누르면 숫자가 바뀌는 컴포넌트 입니다. 이 강의에서는 화살표 함수를 이용해 **onIncrease**와 **onDecrease**를 구현했고, **onClick**으로 각 함수를 연결해주었습니다. 그리고 동적인 값을 구현하기 위해 리액트의 **useState** 함수를 사용하였습니다.

    ```jsx
    import React, { useState } from 'react';

    function Counter() {
    const [number, setNumber] = useState(0);

    const onIncrease = () => {
     setNumber(prevNumber => prevNumber + 1);
    }

     const onDecrease = () => {
      setNumber(prevNumber => prevNumber - 1);
    }

    return (
     <div>
       <h1>{number}</h1>
       <button onClick={onIncrease}>+1</button>
       <button onClick={onDecrease}>-1</button>
     </div>
     );
    }

    export default Counter;
    ```

- 리액트를 통해 배열 렌더링 하기
  - 리액트에서 배열을 렌더링 할 때는 **key**라는 props를 설정해야 합니다. **key**값은 각 원소들마다 가지고 있는 고유값으로 설정을 해야 합니다. 밑의 경우엔 **id**가 고유 값입니다.

  ```jsx
  import React from 'react';

  function User({ user }) {
    return (
      <div>
        <b>{user.username}</b> <span>({user.email})</span>
      </div>
    );
  }

  function UserList() {
    const users = [
      {
       id: 1,
       username: 'velopert',
       email: 'public.velopert@gmail.com'
      },
      {
       id: 2,
       username: 'tester',
       email: 'tester@example.com'
      },
      {
       id: 3,
       username: 'liz',
       email: 'liz@example.com'
      }
    ];

    return (
     <div>
      {users.map(user => (
        <User user={user} key={user.id} />
      ))}
     </div>
    );
  }

  export default UserList;
    ```

이외에 1장에서는 리액트의 기본적인 것에 대해 간단하게 배웠습니다. 리액트의 경우 JavaScript의 기초를 기반으로 진행되기 때문에 JavaScript의 공부가 선행되어야 하는데요. 리액트에 대해 관심이 있는 분들을 위해 제가 이 강의를 들으면서 함께 공부했던 다른 강의와 사이트들도 아래 첨부했습니다.

> [생활코딩 리액트](https://opentutorials.org/module/4058)

이번 미션에서 공부했던 강의를 듣기 전에 맛보기로 공부하는 것을 추천합니다.

> [리액트 홈페이지 문서](https://ko.reactjs.org/docs/getting-started.html)

보다 자세하고 친절한 설명으로 리액트에 대한 이해를 도울 수 있습니다.

> [생활코딩 자바스크립트의 시작](https://www.boostcourse.org/cs124)

기초 자바스크립트 강의로 리액트를 듣기 전에 미리 듣는 것을 추천합니다.

> [웹 프로그래밍 튜토리얼](https://poiemaweb.com/)

웹 프로그래밍에 대한 전반적인 이해를 도울 수 있습니다.

## 마치며

넘치는 과제와 함께 기말고사 기간임에도 불구하고 미션을 통해 처음 접해보는 리액트에 익숙해지기 위해 최선을 다한 웹멤버들 모두 수고하셨습니다!
