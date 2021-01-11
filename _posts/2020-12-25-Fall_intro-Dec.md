---
layout: post
title: "Fall intro team 12월 파이썬 과제"
authors: ["maybeluna"]
tags: ["Fall intro"]
image: https://www.bloter.net/wp-content/uploads/2016/09/navercast_python_01logo.png
description: "과제 6"
featured: false
---


## 1. Assignment-6

### Ex 01. I Know Rock only

- 제출할 폴더 : `ex01/`
- 제출할 파일 : `rock_only.py`

상대방이 바위를 냈을 때, 가위바위보를 진행하는 함수 `rock_only()`를 작성하세요.

```python
rock_only()
```

- 매개변수(parameter) : **없음**
- 기능
  - 가위는 `scissors`, 바위는 `rock`, 보는 `paper` 문자열을 사용합니다.
  - 함수를 실행하면 문자열 입력을 하나 받고, 가위바위보의 결과를 **출력**합니다.
- 반환값(return value) : **없음**

```python
# 예시 코드 1
rock_only() # 'scissors' 입력

# 예시 출력 1
You win!

# 예시 입력 2
rock_only() # 'rock' 입력

# 예시 출력 2
Draw

# 예시 입력 3
rock_only() # 'paper' 입력

# 예시 출력 3
You lose...
```

- 나의 작업

```python
def rock_only():
    a = input()
    if a == "scissors":
        print("You win!")
    elif a == "rock":
        print("Draw")
    elif a == "paper":
        print("You lose...")
```

=> clear 😉

"조건문을 활용하여 함수를 수행해보았습니다. 다음에는 바위 뿐만 아니라 가위, 보에도 적용될 수 있는 함수를 만들어보고 싶습니다."

---

### Ex 02. dot dot dot

- 제출할 폴더 : `ex02/`
- 제출할 파일 : `dot_product.py`

두 1차원 벡터가 리스트가 주어졌을 때, 이 둘의 **내적** 결과를 반환하는 함수 `dot_product()` 를 작성하세요.

```python
dot_product()
```

- 매개변수(parameter) : 1차원 **리스트** a, b (a, b는 내적이 가능한 경우만 주어짐)
- 반환값(return value) : a, b의 내적 결과
  - 내적이 가능한 경우, 내적값을 반환
  - 내적이 불가능한 경우, 0을 반환

```python
# 예시
a = [1, 2, 3]
b = [4, 5, 6]

print(dot_product(a, b)) # 32
```

Hint 💡 : Dot Product가 무엇인지 잘 모른다면? Search Google!

- Dot product: 벡터의 내적을 말하는 것으로 a = (a1, a2, a3), b = (b1, b2, b3) 두 벡터의 내적은 a1xb1 + a2xb2 + a3xb3을 말한다.
- 할당 연산자
  - a += b: a에 b 값을 더하고 그 결과를 a에 할당하는 것으로 '+' 자리에 다른 사칙연산(Ex. -, /, *, %, //, **)에도 마찬가지로 적용된다.
- 나의 작업

```python
def dot_product(a, b): 
    if len(a) == len(b):
        vector = 0
        for i in range(0, len(a)):
            vector += a[i]*b[i]
            result = vector
    else:
        result = 0
    return print(result)
```

"처음에 자동적으로 벡터의 내적을 적용한는 numpy 패키지를 사용했으나 이를 이용하지 않고 구해보는 것이 이 과제의 목적이라고 하셔서 다시 구해보았습니다. 가장 난제가 내적이 불가능한 경우, 0을 반환하는 것이었습니다. 내적이 불가능한 경우를 계속 파악하지 못해 오랜시간 고민을 하였고 결국 코어 멤버 분에게 질문을 하고 길이가 다르면 내적이 불가능하다는 답변을 들은 후 결론을 도출할 수 있었습니다. 다만 의문이 드는 것은 만약 리스트 안에 정수가 아닌 문자, 혹은 불 형식이 들어있는 것은 어떻게 파악하는 것인가 의문이 들었습니다. 이 부분은 한번 더 생각해보아야 할 것 같습니다."

---

### Ex 03. 분명한명분

- 제출할 폴더 : `ex03/`
- 제출할 파일 : `is_palindrome.py`

입력받은 문자열이 펠린드롬(회문)인지 확인하는 함수 `is_palindrome()` 을 작성하세요.

```python
is_palindrome()
```

- 매개변수(parameter) : 문자열 `s`
- 반환값(return value) : `s`가 펠린드롬이면 True, 아니면 False

```python
# 예시 코드 1
print(is_palindrome("토마토"))

# 예시 출력 1
True

# 예시 입력 2
print(is_palindrome("파이썬"))

# 예시 출력 2
False
```

Hint 💡 : Palindrome이 무엇인지 잘 모른다면? Search Google!

- Palindrome: 앞에서부터 읽으나 뒤에서부터 읽으나 똑같은 단어로 대표적으로 eye가 있다.
- 나의 작업

```python
def is_palindrome(s):
    for i in range(len(s)//2):
        if s[i] == s[-1 -i]:
            result = True
        else:
            result = False
        return print(result)
```

=> clear 😉

"리스트 순서가 0부터 시작하는 것을 인식하는 것이 이 문제의 핵심 포인트였습니다."

---

### Ex 04. Strange Compare

- 제출할 폴더 : `ex04/`
- 제출할 파일 : `strange_cmp`

여욱이라는 아이는 숫자를 특이하게 비교하는 것으로 유명하다.

**각 자리수를 모두 오름차순으로 정렬해버린 다음** 그 결과를 바탕으로 두 수를 비교한다.

두 숫자가 주어졌을 때, 여욱이의 방법으로 결과를 반환하는 함수 `strange_cmp()` 을 작성하세요.

```python
strange_cmp()
```

- 매개변수(parameter) : 정수(int) `x`, `y`
- 반환값(return value) : x가 y보다 크면 **"Left",** y가 x보다 크면 **"Right",** 같으면 **"Same"**

```python
# 예시 코드 1
print(strange_compare(123, 231))

# 예시 출력 1
Same # 123 == 123

# 예시 입력 2
print(strange_compare(222, 321))

# 예시 출력 2
Left # 222 > 123

# 예시 입력 3
print(strange_compare(911, 537))

# 예시 출력 3
Right # 119 < 357
```

- 나의 첫 번째 작업

```python
def strange_cmp(x, y):
    if x > y:
        result = "Left"
    elif x < y:
        result = "Right"
    elif x == y:
        result = "Same"
    return result
```

- 리스트 정렬
  - a.reverse(): 리스트 뒤집기
  - a.sort(): 리스트 오름차순 정렬
  - a.sort(reverse=True): 리스트 내림차순 정렬
- 나의 두 번째 작업

```python
def strange_cmp(x, y):
    x = list(str(x))
    x.sort()
    a = int("".join(x))
    y = list(str(y))
    y.sort()
    b = int("".join(y))
    if a > b:
        result = "Left"
    elif a < b:
        result = "Right"
    elif a == b:
        result = "Same"
    return print(result)
```

"초반에 오름차순 있는 지 몰라서 이거는 과제6에서 그나마 쉽다고 생각했습니다. 그런데 다시 문제 확인하다가 오름차순을 알게되서 호다닥 고쳤습니다! 이 문제에서 가장 어려웠던게 정수형을 어떻게 오름차순으로 바꿀 지 였습니다. 계속 고민하다가 구글링 도중 리스트로 바꾸고 정렬시킨 다음 다시 바꾸는 방법이 있어 이를 적용해보았습니다!"

---

### Ex 05. I Love Combination Pizza II

- 제출할 폴더 : `ex05/`
- 제출할 파일 : `combi_two.py`
- 사용 **금지**된 코드 : `itertools`

숫자 $n(1<n<10)$이 주어졌을 때, 0~9까지의 숫자 중 n자리 조합을 모두 **출력**하는 코드를 작성하세요

```python
# 예시 입력 1
2

# 예시 출력 1
01 02 03 ... 09 12 13 ... 78 79 89 

# 예시 입력 2
8

# 예시 출력 2
01234567 01234568 ... 23456789 
```

- 나의 작업

```python
n = int(input())
if 1 < n < 10:
    j = str(1) + n*str(0)
    for i in range(1, int(j)):
        print (str(i).zfill(n), end=" ")
```

=> clear 😉

"n자리 조합을 다 인지하는 것이 중요했습니다. 예를 들자면 3자리 수라면 일의 자리 역시 001로 인식하는 것이 필요했습니다. 그 부분을 반복문 조건문을 통해 해결해보았고 무사히 작동되었습니다. 다만 8자리수의 경우 실험을 해보다가 2시간이 지나도 완성이 안되어 강제 종료하였습니다."

> *과제 6이 어렵다고 하셨는데 실제로 기존에 했던 것보다 어려워서 애를 먹었습니다. 특히 한 쪽을 해결하면 또 한 쪽이 문제가 생각나서 어떻게 하면 문제를 전부 해결할 수 있을까 고민했습니다. 23일 기대하지 못했던 상을 타서 매우 민망하고 아직 제가 탈 상이 아닌 것 같은데 더 노력하라는 의미로 알고 방학 때는 열코딩 하겠습니다!!*

## 🎄🎅Merry Christmas🎁🎄
