---
layout: post
title: "node.js로 회원가입부터 로그인까지"
authors: [zeze1004]
tags: ["WEB"]
image: assets\images\post-WEB-Login\image1.png
description: "일단 복붙하고 실행시키면서 이해하자"
featured: false
---

이 포스팅은 WEB팀 클론코딩 프로젝트에서 회원가입, 로그인 파트를 맡은 제가 블로그 코드를 참조하면서 이해한 부분까지 코드 정리한 글입니다.

부족한 부분도 많고 틀린 정보도 있을 수 있어서 상냥히 고쳐주시면 정말 감사하겠습니다.🥳

---

로그인 구현을 위해서 먼저 회원가입 구현을 했다.

1. 회원가입 구현

   처음 코드를 작성할 때는 어떻게 해야할지 너무 막막하여
   형진님이 올려주신 샘플 코드를 참고하며 `router` 파일 먼저 작성했다.

   클라이언트가 서버로 정보를 보내는 것이므로 `post` 메소드를 사용했다.

   ```javascript
   // router
   // post로 클라이언트가 DB로 정보보내기
   userRoutes.post("/signup", asyncWrapper(userController.userCreate));
   ```

   ```javascript
   // model
   const userSchema = new Schema({
     email: {
       type: String,
       required: true,
       unique: true,
       trim: true,
     },
     password: {
       type: String,
       required: true,
     },
     // 항상 필요
     createdAt: {
       type: Date,
       default: Date.now,
     },
     updatedAt: {},
   });
   ```

   ```javascript
   // controller
   // 회원가입 로직
   // email, password 회원가입
   import { userModel } from "./user.model";
   import { StatusCodes, ReasonPhrases } from "http-status-codes";

   const userController = {};

   userController.userCreate = async (req, res) => {
     try {
       console.log(req.body);
       const user = await userModel.create({
         email: req.body.email,
         password: req.body.password,
       });
       return res.json(user);
     } catch (error) {
       return res
         .status(StatusCodes.INTERNAL_SERVER_ERROR)
         .send("중복된 이메일입니다.");
     }
   };
   ```

   mvc 패턴으로 간단하게 회원가입 로직을 구현했다.

   모델에서 email을 unique라고 설정했기에 중복된 email 입력 시 회원가입 되지 않게 설정했다.

   아직 프론트단이랑 합치지 않아서 에러시 res.send만 선언되게 작성했는데 어떻게 할 지 논의해봐야 한다.

   사용자가 이메일, 비밀번호를 post하면 `.create`를 통해 DB에 "email", "password"에 저장된다.
   (`.create`: 몽고디비 메소드)

2. password 복호화하여 저장

   평문 저장시 해킹 위험이 커 bcrypt 모듈을 이용해 복호화하여 저장해야 한다.

   처음에는 비밀번호 평문 그대로 저장했으나, 형진님이 코드리뷰로 알려 주셔서 수정했다.

   ```javascript
   import bcrypt from "bcrypt";
   const saltRounds = 10;

   // password 암호화
   userSchema.pre("save", function (next) {
     let user = this;

     if (user.isModified("password")) {
       bcrypt.genSalt(saltRounds, function (err, salt) {
         if (err) return next(err);
         bcrypt.hash(user.password, salt, function (err, hash) {
           if (err) return next(err);
           user.password = hash;
           next();
         });
       });
     } else next();
   });
   ```

   password가 저장되는 save 함수가 실행되기 전에 `bcrypt` 모듈을 이용해 password와 salt를 해싱하고 그 값을 password로 대체한다.

   간단히 말해 `salt`로 무작위 단어를 생성한 후 새로운 해시값을 추가로 password에 적용하는 것이다.

   🍓이미 짠 해시함수에 소금을 뿌리자!🍓

   비밀번호는 해시함수값으로 DB에 저장하는데

   `Rainbow Table`에 해시값 적용하면 기존 비밀번호(plainPassword)를 알 수 있다.

   (`Rainbow Table`:단어별로 해시값을 매칭하여 저장해놓은 테이블이다.)

   [🍒리빙포인트🍒]

   Rainbow Table에는 흔히 쓰는 단어들의 해시값이 저장되었으므로 비밀번호 만들 때는 단어가 아닌 무작위 글씨, 특수기호 조합으로 만들자 ^^!

3. 로그인 구현

   회원가입 된 유저가 email, password를 입력해 로그인을 시도하면

   db에 해당 email이 있는지 먼저 검색 후

   해싱된 password값이랑 일치되는지 비교한다

   ```javascript
   // route
   userRoutes.post('/signin', asyncWrapper(userController.login));
   ```

   ```javascript
   // model
   userSchema.methods.comparePassword = function (plainPassword) {
     return bcrypt
       .compare(plainPassword, this.password)
       .then((isMatch) => isMatch)
       .catch((err) => err);
   };
   ```

   ```javascript
   // 로그인시 DB에 저장된 email 먼저 찾고, email 있다면 암호화된 password랑 user가 입력한 password 비교
   userController.login = async (req, res) => {
     try {
      const user = await userModel.findOne({
         // email 먼저 비교
      email: req.body.email
      });
        if (!user) {
          return res
            .status(StatusCodes.BAD_REQUEST)
            .send('가입 되지 않은 회원입니다.');
            // .redirect("/api-docs");
        }
        user
        .comparePassword(req.body.password)
        .then((isMatch) => {
        // password 일치 안 할 시
        if(!isMatch) {
          return res.send('비밀번호가 일치하지 않습니다.');
        }
      });
        // password 일치 시
        res.send('로그인 되었습니다.');
        })
      } catch (error) {
        return res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ error: error.toString() });
      }
   };
   ```

   `.findOne`(mongoDB 메소드)을 통해 DB에서 email을 찾는다

   email이 있을 시 model 파일에 작성된 `comparePassword(plainPassword)`가 실행된다.

   입력 받은 `req.body.password`를 인자로 받은 `comparePassword`는

   `bcrypt.compare` 함수를 통해 `req.body.password`와 해싱된 password를 비교한다.

   일치 시 토큰을 user에게 부여하고 로그인 시킨다.

4. 토큰 부여

   ```javascript
   // model
   // 토큰 생성
   userSchema.methods.generateToken = function () {
     const token = jwt.sign(this._id.toHexString(), "zeze"); // secretKey
     this.token = token;
     return this.save().then((user) => user);
     // .catch((err) => err);
   };
   ```

   `jwt.sign(payload, secretKey)`에서 payload는 string 형식이어야 한다.

   그러나 mongoDB에서 생성되는 \_id는 정수이므로 mongoDB 함수인`.toHexString()`를 통해 형변환 해줘야 한다.

   생성된 토큰은 DB에 저장해야 하므로 model에 token을 추가로 만들어준다.

   ```javascript
   // model
   const userSchema = new Schema({
    ...,
    token: {
    type: String
    },
    ...
   });
   ```

   ```javascript
   // controller
   userController.login = async (req, res) => {
     try {
       const user = await userModel.findOne({
         // email 먼저 비교
         email: req.body.email,
       });
       if (!user) {
         return res
           .status(StatusCodes.BAD_REQUEST)
           .send("가입 되지 않은 회원입니다.");
       }
       user.comparePassword(req.body.password).then((isMatch) => {
         // password 일치 안 할 시
         if (!isMatch) {
           return res.send("비밀번호가 일치하지 않습니다.");
         }
       });
       // password 일치 시
       user.generateToken().then((user) => {
         res
           .cookie("x_auth", user.token)
           .status(200)
           .send("로그인 되었습니다.");
       });
     } catch (error) {
       return res
         .status(StatusCodes.INTERNAL_SERVER_ERROR)
         .json({ error: error.toString() });
     }
   };
   ```

   다시 login cotroller로 돌아가서 password가 일치된 user에 한해서 token을 부여한다.

   user.generateToken()을 통해 token을 만들고 cookie에 쿠키에 token을 저장하여

   유저가 서버에 request할 때마다 서버는 token이 일치하는지만 검증하면 된다.

### 🍒JWT에 대해 알아보자🍒

   Token Based Auth

   ![토큰1](..\assets\images\post-WEB-Login\image2.png)
   그림판으로 쓴 것 같지만...웹툰 작가의 꿈을 갖구 산 태블릿으로 열심히 적은 것이 반전...!
   악필은 노력해도 악필일 뿐...

   JWT는 크게 3가지 구조로 구분된다.

   `헤더`, `페이로드`, `시그니처`.

#### 헤더: Algorithm, Token type

- 어떤 알고리즘으로 인크립션(암호화)할건지 결정

     ```json
     {
       "alg": "HS256",
       "typ": "JWT"
     }
     ```

#### 페이로드: Data

- 개발자가 원하는 걸 저장하면 된다.

- 네트워크에 정보가 올라가므로 최소한의 데이터만 저장하는 걸 권장

     ```javascript
     {
         "id": "1223034", // 사용자 unique id
         "exp": 21313,  // 토큰 만료기간
         ...,
         "CreditCardNum": 3242342 // 절대 X, 헤더와 페이로드는 암호화되지 않음
     }
     ```

#### 시그니쳐

- 헤더와 페이로드에 시크릿키를 추가한 채 저장

     ```javascript
     HMACSHA256(
       base64UrlEncode(header) + "." + base64UrlEncode(payload),
       ZEZE // SECRET KET
     )
     ```

     [jwt.io](https://jwt.io/) 사이트에서 JWT를 사용해 해시값을 직접 확인할 수 있다. 훨씬 이해하기 쉬울 것이다.

---

### 글을 마치면서

코드리뷰가 얼마나 소중한고 중요한 것인지 알게 되었다.

좋은 기회를 준 DSC 멤버 분들, 특히 우리 WEB팀 멤버 분들에게 감사의 인사를 전한다.

코드리뷰로 전체적인 방향을 잡아준 형진님🦝

직접 화면 공유 봐주면서 후추랑 오류 잡아준 현GYU🐕‍🦺
(후추야 사랑해...! 눈아 닭가슴살 진짜 잘 삶아)

처음 시작이 막막했는데 폴더 구조부터 DOCKER사용법까지 친히 알려주신 핸섬 창구님까지🐳

비록 클론코딩 완성하지 못해서 너무 아쉽지만...(쒸익 고다현 가만안도)

백엔드 분들 덕분에 이 글을 완성할 수 있었습니다.

감사합니다. 여러분😍
