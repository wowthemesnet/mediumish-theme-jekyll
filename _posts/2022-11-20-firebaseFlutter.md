---
layout: post
title: "Flutter로 Firebase에 휴대전화, 이메일 계정 연동하기"
authors: [simpack0513]
tags: ["Flutter", "Firebase"]
image: ../assets/images/post-firebaseflutter/intro.png
featured: true
use_math: true
---

# Firebase Auth

Firebase는 여러 인증 수단을 제공하고 있습니다. 기본적으로는 이메일과 비밀번호를 이용한 인증이지만 휴대전화 인증, 구글 계정, 소셜 로그인도 지원하고 있습니다. <br><br>
**이메일과 비밀번호를 이용해 회원가입한 사용자가 휴대전화로도 로그인하려면 어떻게 해야 할까요?** <br><br>
Firebase에서는 여러 인증 방법으로 회원을 각각 만들면 같은 개인 UID가 부여되지 않으므로, 반드시 여러 인증 공급자를 계정에 연결하는 과정이 필요합니다.<br><br>
오늘은 이메일과 휴대전화 인증 방법을 연결해보며 여러 인증 방법을 계정에 연결하는 과정을 보겠습니다.<br><br>
이번 포스팅에서는 Flutter에 Firebase Auth 환경이 구축되었다고 가정하고 진행합니다.
> Flutter에 Firebase Auth를 연동하는 방법은 인터넷에 매우 자세히 있습니다.

<br>
<br>

## 전체적인 과정

다음 상황을 바탕으로 대략적인 과정을 설명하겠습니다. <br><br>
> 첫 회원가입을 하는 사용자가 이메일과 비밀번호를 입력하고 휴대전화 문자 인증을 받아 회원가입을 마치는 상황입니다. 사용자 정보 입력 순서는 상관없지만, 이번 상황에선 이메일과 비밀번호를 먼저 받는다고 하겠습니다. 이후 사용자는 이메일/비밀번호 또는 휴대전화 문자 인증으로 로그인이 가능하고, Firebase는 이 둘 중 어느 방법으로 로그인해도 같은 사용자임을 인식할 것입니다.

<br>

1. 사용자에게 입력 받은 이메일과 비밀번호로 사용자 계정을 만듭니다.
2. 휴대전화 번호를 입력 받고 인증번호를 발송합니다.
3. 인증코드와 인증ID를 이용해 Credential 객체를 가져옵니다.
4. Credential 객체를 linkWithCredential() 메소드로 넘겨 휴대전화 인증방법을 등록합니다.

<br>
<br>

## 이메일과 비밀번호로 사용자 계정 만들기

Textfield 등으로 사용자에게 입력받은 이메일과 비밀번호를 `createUserWithEmailAndPassword()` 메소드로 넘기면 Firebase에 회원 등록이 되고 Credential 객체를 반환해줍니다.

> Credential 객체란 사용자의 신원 정보를 담은 객체입니다. 예를들어, 이메일 로그인 경우에 사용자가 입력한 이메일(아이디), 비밀번호가 객체에 담겨 있는 정보입니다. Credential 객체를 Sign 또는 createUser 메소드에 넘기면 데이터베이스와 정보를 비교해 로그인을 하거나, 회원가입을 합니다. 휴대전화 인증의 경우 PhoneAuthCredential 라는 이름으로 Credential와 동일한 기능을 합니다.


```Dart
final credential = await FirebaseAuth.instance.createUserWithEmailAndPassword(
    email: emailAddress,
    password: password,
  );
```

여러 인증 방법으로 회원을 만드려면 우선 하나의 방법으로 로그인이 되어야 합니다. <br>
이번 상황에서는 이메일로 회원가입을 한 동시에 로그인이 되어 있는 상태입니다.

<br>
<br>

## 휴대전화 인증번호 보내고 받기

이메일로 로그인이 되어 있는 상태에서 휴대전화 Credential 객체가 준비되었다면 연동할 준비가 끝납니다. <br>
이제 휴대전화 인증을 해보겠습니다. 사용자에게 휴대전화를 입력 받고 '인증번호 보내기' 버튼 등을 통해 휴대전화 문자로 인증번호를 오게 할 수 있습니다.

```Dart
String verificationId = '';

await FirebaseAuth.instance.verifyPhoneNumber(
        timeout: const Duration(seconds: 60),
        phoneNumber: '+821012345678',
        verificationCompleted: (verificationCompleted) async{
          print("인증코드 발송 성공");
        },
        verificationFailed: (verificationFailed) async {
          print("코드 발송 실패");
        },
        codeSent: (verificationId, resendingToken) async{
          setState(() {
            this.verificationId = verificationId;
          });
        },
)
```

휴대전화로 인증번호를 오게 하는 메소드는 verifyPhoneNumber()으로 속성에 대해 설명하겠습니다.

+ `timeout`은 인증 코드가 유효한 시간입니다.

+ `phonenumber`은 인증 코드를 전송할 휴대전화 번호입니다. 한국은 +82에 010에서 맨 앞 0을 제외한 번호를 입력하면 됩니다.

+ `verificationCompleted`는 인증 코드 발송에 성공하면 실행됩니다.

+ `verificationFailed`는 인증 코드 발송에 실패하면 실행됩니다.

+ `codeSent`는 인증 코드가 전송되면 실행되는데, verificationId는 나중에 Credential 객체를 가져올 때 써야하므로 따로 state 변수를 만들어 저장하였습니다.

<br>
<br>

## 인증 코드 검증하고 Credential 객체 가져오기

앞서 저장한 verificationId와 사용자가 입력한 인증 코드를 토대로 Credential 객체를 생성합니다.
> 휴대전화 인증에서는 `PhoneAuthCredential`를 Credential 객체로 사용합니다.


```Dart
PhoneAuthCredential phoneAuthCredential = PhoneAuthProvider.credential(
    verificationId: verificationId, smsCode: '123456');
```

만약 이메일과 연동하지 않고 휴대전화 인증으로 단독 계정을 만들고 싶다면,  이후 `signInWithCredential` 메소드에 Credential 객체를 넘기면 됩니다. <br>

마찬가지로 휴대전화가 아닌 구글 아이디 인증과 같은 다른 인증 방법을 사용할 때도, Credential 객체까지만 받고 `signInWithCredential` 메소드를 실행하기 직전 상황까지만 만들면 연동 준비가 끝납니다.

<br>
<br>

## 인증 방법 연동 완료하기

이제 `signInWithCredential` 메소드 대신 `linkWithCredential` 메소드를 이용해 Credential을 검증하고 문제가 없다면 연동을 완료합니다.

```Dart
final userCredential = await FirebaseAuth.instance.currentUser
          ?.linkWithCredential(phoneAuthCredential);
```



<br>
<br>

## 마무리 하며...

앱 사용률을 높이기 위해서 사용자에게 여러 로그인 수단을 제공하는 것은 중요합니다. `Firebase`는 다양한 인증 수단을 제공하고 이를 간편하게 연동할 수 있도록 하여 빠르게 앱을 개발하는 사람들에게 좋은 선택지 중 하나 입니다. 이번 내용은 비록 공식 문서에도 나와 있는 내용이지만 친절하지 않아 이렇게 포스팅을 해보았는데, 복습도 되서 좋았습니다.
