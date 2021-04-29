---
layout: post
title:  "React Hook, 친해질래?"
authors: [poiu694]
tags: ["Web"]
image: assets/images/post-React-Hook/thumb.png
description: "TODO-LIST With React Hook"
featured: true
---

## Hooks develop

 React는 React Hook이 나오기 전에 Logic을 재사용하려면 `Higher-order components`과 `Render props`를 이용했었다. 둘 다 몇몇의 패턴에는 사용하기 정말 좋다. 하지만, 단점은 명확하다. React를 엄청 복잡한 예제에서 무언가 가져오려면 구조를 바꿔야 하는 경우가 생겼을 때 우리는 쉽게 wrapper 지옥에 빠질 수 있다. 아니면 코드가 중복돼있거나 엉켜있는 Giant Component를 바라보고 있을 수 있다. 이런 경우는 생각보다 자주 일어나고 사람과 컴퓨터가 힘들어진다.



 리액트의 대가인 Dan은 위에서 얘기하는 문제들을 포괄해서 React가 더 가볍고 좋은 primitive나 add state를 제공하지 않기 때문에 생기는 현상이라고 말한다. 그래서 React 팀은 기존의 코드를 엎지 않을 수 있으면서 새로운 API를 제공해 주려고 노력했다. 그게 바로 React Hook다!



 React Hook은 React 버전 16.8부터 추가되었다. 실제 React에서 Hooks가 구현된 크기는 ~1.5kB(min + gzip).이다. 단지 크기가 작다는 걸 얘기하는 게 아니라, 기존에 만들었던 Class만으로 이루어진 프로젝트에 Hooks을 도입한다면 bundle size를 줄일 수 있다는 얘기다🧐



## What are hooks?

그렇다면 React Hook이 왜 특별한지, 그리고 무엇인지 알아보자😊

먼저, React Hook은 다음과 같은 특징을 지녔다.

- React Hook은 `props`, `state`, `context`, `refs`, `lifecycle`에 관한 직관적인 API를 제공해 준다.
- `Class Component` -> `Functional Component`로 바꾸어 준다.
- 코드를 공유하기 편하게 해준다.
- `Custom Hook`을 만들 수 있어 유용한 기능을 담긴 Hook을 사용자 간의 공유가 가능하다.



React Hook의 종류는 엄청 많다. 그 중에서 기본적인 Hooks를 소개시켜주려고 한다🤗

### State Hook ( useState )

  - `useState`는 `state`를 `class`가 아닌 곳에서 다룰 수 있게 해준다.

  - 기본형은 다음과 같다.

```react
import {useState} from "react";

const [value, setValue] = useState(0);
```

  - `useState`는 두 개를 반환한다. 0-index에서는 `state`, 1-index에서는 `state`를 변경해 주는 함수를 반환한다.

  - `useState`괄호 안에 적어준 초깃값은 첫 번째 렌더링에만 딱 한 번만 사용한다.

  - 예시

```react
import React, { useState } from "react";

const Example = () =>{
  const [count, setCount] = useState(0);

  return (
    <div>
      <p> {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click
      </button>
    </div>
  );
}
```

전에 했던 `class`를 만들고 작업했던 그 과정을 이렇게 단순하게 줄일 수 있다. 코드가 엄청 줄었고, 직관적으로 보인다. `state`를 관리하기 위해 어렵게 했던 그런 모습을 이제 벗어나 보자😎



### Effect Hook ( useEffect )

- 데이터를 가져오거나, DOM을 직접 조작하는 `side effects`를 수행한다.

- `class`형식에서 사용하던 `componentDidMount`, `componentDidUpdate`, `componentWillUnmout`를 하나로 통합하여 사용한다.

- 예시

```react
  import React, { useState, useEffect } from "react";
  
  const Example = () =>{
    const [count, setCount] = useState(0);
  
    useEffect(() => {
      document.title = `click ${count} times`;
    }, [count]);
  
    return (
      <div>
        <p> {count} times</p>
        <button onClick={() => setCount(count + 1)}>
          Click
        </button>
      </div>
    );
  }
```
  위 코드에서 `useEffect`는 세 개의 함수를 통합해서 단 한 번에 끝낼 수 있다😁 `class`에서 했던 `ComponentDidMount`로 처음 `title`을 지정하고 `ComponentWillUpdate`로 count에 따라 title이 바뀌는 게 저 코드 블록으로 끝이 난다!

 조금만 더 생각해 보자. 내가 원하지 않는 경우에 `re-render`가 계속되면은 비용이 커지지 않을까? 그래서 `useEffects`는 내부에 두 개의 파라미터를 사용한다. 첫 번째 인자는 `render`가 될 때 어떻게 동작할지에 대한 코드, 두 번째 인자로는 `dependency`를 설정해 준다. `dependency`가 바뀔 때만 `useEffect`는 `update`의 역할을 해줄 것이다.

 이걸 조금 더 다르게 생각한다면 `dependency`로 `[ ]` 설정한다면 무엇이 바뀌든 `update`가 되지 않는다.



### Context Hook ( useContext )

- `createContext`를 반환받아 그 `context`의 현재 값을 사용한다.

- `context`의 현재 값은 Hook을 호출하는 컴포넌트 가장 가까이에 있는 `MyContext.Provide`에 의해 결정된다.

- `context`값이 변경되면 항상 `re-render` 된다.

- 예시

  ```react
  import React, {useState, useEffect, useContext} from "react";
  
  const CountContext = createContext({});
  
  const Counter = () => {
      const conunt = useContext(CountContext);
      return <div>seconds: {count}</div>
  };
  
  const Timer = () => {
   	const [seconds, setSeconds] = useState(0);
      
      useEffect(()=>{
          const interval = setInterval(() => {
              setSeconds(seconds + 1);
          }, 1000);
          
          return () => clearInterval(interval);
      });
      
      return(
      	<div className="App")>
              <CountContext.Provider value={seconds}>
              	<Counter />
              </CountContext.Provider>
          </div>
      );
  };
  ```

`count`는 `value={seconds}`에서 온다. 우리는 `render prop pattern`에서 벗어날 수 있다!



### Reducer Hook ( useReducer )

- `useState`의 대체함수의 역할을 한다.

- 예시

  ```react
  import React, {useReducer} from "react";
  
  const reducer = (state, action) =>{
    switch (action.type) {
      case 'INC':
        return state + 1;
      case 'DEC':
        return state - 1;
      default:
        return state;
    }
  }
  
  const [state, dispatch] = useReducer(reducer, initialState);
  ```

- `reducer`는 위와 같이 함수로 정의한다.

- `dispatch`는 `action`을 해주는 함수이며, 사용은 다음과 같이 한다.

- ```react
  dispatch({type: 'INC'}); // Increment
  dispatch({type: 'DEC'}) // Decrement
  ```

  다수의 하위 값을 포함하는 복잡한 정적 로직을 만드는 경우나 새로운 `state`가 이전 `state`에 의존적인 경우 주로 사용한다.

- `update`를 트리거 하는 컴포넌트의 성능을 최적화 가능하다. 왜냐면 콜백 대신 `dispatch`를 전달할 수 있기 때문이다.



 이 외에도 제공되는 React Hook은 많다. 하지만, 이걸로도 React Hook의 마술을 볼 수 있었을 것이다. 그렇다면 우리는 지금까지 배운 React Hook을 이용해서 간단하게 TODO-LIST를 만들어 보자😆





## TODO-LIST

TODO-LIST는 우리가 웹을 공부해봤던 사람이라면 한 번씩은 만들어 봤을 것이다. React Hook을 이용한 방법과 다른 방식으로 했던 방법을 비교해보는 것도 좋을 것 같다😁



우리가 만드는 TODO-LIST에서 다음과 같은 기능을 넣을 것이다.

1. TODO-ITEM 추가 기능
2. TODO-ITEM 체크해서 했던 일인지, 해야 할 일인지 알 수 있는 기능(Toggle)
3. TODO-ITEM 삭제 기능(One Item / All completed Item)



우리는 연습하고 나서 실제로 사용할 수 있게끔 `LocalStorage`를 이용해서 껐다 켜도 TODO-LIST를 유지하자! 

참고로 여기서는 `useState`, `useEffect`로만 이용해서 코드를 짤 것이다. 왜냐면 `useContext`와 `useReducer`를 이용하는 습관은 정말 좋고 권장한다. 하지만, `useContext`나 `useReducer`를 사용하기 전 상황에 먼저 익숙해질 필요가 있고 초심자에게 이 둘은 어렵다고 생각한다. 여기서는 React Hook이 처음인 분들을 대상으로 TODO-LIST를 만들 것이기 때문에 앞서 얘기한 두 가지만을 이용해서 만들어 보려고 한다.

나중에 프로젝트가 복잡해지면 `useContext`와 `useReducer`의 마법을 느껴보자😊



완성본 미리보기😎

![1619681704501](../assets\images\post-React-Hook/Todolist.png)





### TODO

 가장 먼저, todo에는 어떤게 담겨 있을지 정해야 한다. 우리가 만들 Todo에는 무엇인지를 나타내는 `task` 다 끝낸 일인지 파악해 주는 `complete` 그리고 각각의 `id`를 가지고 있다!



### TODO-TEMPLATE

 `TodoTemplate.js`를 만들자! TODO-TEMPLATE에서는 입력을 담당하는 `Header`와 `TodoList`를 포함하고 있고, `todos`를 실질적으로 저장하고 있다. `todos`를 `TodoTemplate`에서 관리해서 `Header`와 `TodoList`가 서로 같은 `todos`를 사용할 수 있게 계속해서 전달해 주자.



Todo를 저장하고 가져올 수 있게 해주는 `LocalStorage`를 `useState`와 `useEffect`로 만든다.

```react
const UseLocalStorage = (key, initialState) => {
  const [state, setState] = useState(
    () => JSON.parse(window.localStorage.getItem(key)) || initialState
  );

  useEffect( () =>{
    window.localStorage.setItem(key, JSON.stringify(state));
  }, [key, state]);

  return [state, setState];
}

```

`key`를 이용해서 저장되어 있는 값이 있으면 그것을 가져오고, 없으면 `initialState`를 가져온다. `useEffect`를 이용해서 `state`가 바뀌게 되면 계속해서 `LocalStorage`에 저장을 시켜주자!



그렇다면 이를 이용해서 `todos`를 만들어보자.

```react
// Todotemplate.js
import React, {useState} from "react";
import UseLocalStorage from "../components/Hook/UseLocalStorage";
import Header from "../components/Todo/Header";
import ToDoList from "../components/Todo/ToDoList";

const TODOS_LS = 'TODOS';

const TodoTemplate = ()=>{
    const [todos, setTodos] = UseLocalStorage(TODOS_LS, [{
      id:1, 
      task:"Submit Your TODO-LIST", 
      complete:false
    }]);
    
    return (
        <div className="Main">
          <Header />
          <ToDoList todos={todos}/>
        </div>
  );
}
```

`TodoTemplate`를 이런 식으로 구성할 수 있다!!



### HEADER

TODO-ITEM을 추가해 줄 수 있는 `Header`를 만들어 보자. `input`을 관리해 주는 `useState`를 하나 만들 것이다.

```react
// Header.js
import React, {useState} from "react";

const Header = () => {
    const [value, setValue] = useState("");

    const handleChange = (e) =>{
        const {
            target: {value}
        } = e;
        setValue(value);
    }

    return(
        <div className="head">
            <div className="title"> 
                <p className="title">To do List </p>
            </div>
            <form className="form">
                <input type="text" placeholder="TODO LIST" className="todo-input" value={value} 						onChange={handleChange} />
                <span> <button className="subbtn"> ADD </button></span>
            </form>
        </div>
    );
}
```

이렇게 만들 수 있다! `onChange` 이제 추가 기능을 만들 것인데, 추가 기능을 만들려면 `TodoTemplate`에서 만들어야 한다.

`Header`에서 바뀌었을 때 바뀐 값을 `TodoList`에서 사용하기가 어려워서 추가된 모습을 바로 못 보기 때문이다.



`TodoTemplate`에 다음과 같은 코드를 추가해주자!

```react
// TodoTemplate.js
// Add Task
  const addTodo = (input, validator) =>{
      let todosMap = [...todos];
      todosMap.push({
        id: todos[todos.length -1].id + 1,
        task: input,
        complete: false
      })
      setTodos(todosMap);
  }
  
  <Header addTodo={addTodo} />
```

여기서 `todosMap`을 만들어주고 `Header`에 `addTodo`를 넘겨준다. `useState`에서는 직접적으로 추가가 되지 않기 때문에 ! 새로운 변수를 만들어서 todos를 갱신해 준다. 그리고 추가한 `todo`는 해야 할 일이기 때문에 default로 `complete`를 `false`로 준다. 



그리고 `Header`에서는 `addTodo`를 받아서 `onSubmit`함수를 만들자!

```react
// Header.js
const onSubmit = (e) =>{
        e.preventDefault()
        addTodo(value);
        setValue("");
}
```

`addTodo`에 `value`를 전달하고 나서는 input 칸이 비어있게 만들기 위해 `setValue`를 위와 같이 해주자. 이 기능을 `form`안에 넣는다면 `LocalStorage`에 저장되는 모습을 볼 수 있다!

![1619678285863](../assets\images\post-React-Hook/LocalStorage.png)



### TODO-LIST

이제 화면에 보이게 만들어보자😄😄

```react
// TodoList.js
import React from "react";
import ToDoItem from "./ToDoItem";

const ToDoList = ({todos}) => {
    return(
        <div className="todo-list">
            {todos.map(todo =>{
                return(
                    <ToDoItem key={todo.id + todo.task} todo={todo} />
                );
            })}
            <div className="delbtn"> Clear Completed </div>
        </div>
    );
}

export default ToDoList;
```

`TodoList`는 간단하다. `todos	`의 크기만큼 `TodoItem`을 반환하고 전체 삭제를 해주는 부분을 만들면 된다. 전체 삭제해 주는 부분을 `Component`를 새로 만들어서 넣어도 된다!

 여기서 주목할 부분은 `TodoItem`마다 `key`를 주어야 한다. 이것은 `re-render`과정에서 중요하므로 반드시 해줘야 한다고만 이해해도 된다. 공부하고 싶으면 👉[사이트](https://kentcdodds.com/blog/understanding-reacts-key-prop)👈를 읽어봐도 좋다👨‍🏫👩‍🏫



### TODO-ITEM

```react
// TodoItem.js
import React from "react";
import "./ToDoItem.css";

const ToDoItem = ({todo}) => {
    return(
        <div className="todo-item" id={todo.id}>
            <div className="todo-del" id={todo.id}> ❌ </div>
            <div className="todo-task" > {todo.task} </div>
        </div>
    );
}

export default ToDoItem;
```

이와 같이 구성하면 이제 우리는 `TodoItem`이 정상적으로 추가되는 모습을 볼 수 있다🎉🎉



하지만, 아직 삭제와 토글 기능을 만들지 않았다. `TodoTemplate.js`로 돌아가자.

```react
// TodoTemplate.js
// toggle
  const handleToggle = (id) => {
      let todosMap = todos.map(task =>{
        return task.id === Number(id) ? {... task, complete: !task.complete} : {...task}
      });
      setTodos(todosMap);
  }
  
  // Delete Completed Tasks
  const handleDeleteAll = () => {
      let todosMap = todos.filter(task =>{
        return !task.complete;
      });
      setTodos(todosMap);
  }

  // Delete One Task
  const handleDeleteItem = (id) => {
      let todosMap = todos.filter(task =>{
        return task.id !== Number(id);
      });
      setTodos(todosMap);
  }
```

이걸 적절하게 주고 id 값을 이용만 해준다면 우리의 TODO-LIST를 완성할 수 있다! css는 각자의 몫으로 남기겠다😉



추가로 기능을 만들어보고 싶으면 다음과 같은 기능을 혼자 만들어보며 연습을 해보자!

1. Filter 기능 ! Select-Option에 따라서 전체, 했던 일, 해야 할 일만 나오게끔 만들자.
2. Input Validator ! input으로 빈칸은 입력이 되지 않게 만들자.
3. Color 기능 ! 해야 할 일들을 분야로 나누어서 Color와 함께 저장을 하고, Color-Filter 기능까지 만들자.



React Hook과 친해지는 그 날까지 응원한다 :)

