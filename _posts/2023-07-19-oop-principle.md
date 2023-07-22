---
layout: post
title:  "객체지향 생활 체조 9가지 원칙에 맞게 Meeting Service 리팩토링하기"
authors: [pasly0920]
tags: ["OOP", "Spring Boot"]
image: ../assets/images/post-oop-principle/00.jpeg
featured: true
---

본 글은 제가 서울시립대에서 동문 및 졸업생들을 위한 커뮤니티 서비스인 시대생에서 개발을 진행하며 있던 일이다. 당시 시대팅(시대생을 위한 블라인드 소개팅)을 개발하였다.

해당 프로젝트의 코드는 여기서 확인할 수 있다.
https://github.com/uoslife/server-meeting

해당 글에서는 9가지 원칙과 그에 따른 수정에 대해서만 compact하게 다루도록 하겠다.

---

### 0. 객체지향 생활 체조 9가지 원칙이란?

아래에서 언급할 9가지 객체 지향 설계를 위한 구체적인 가이드이다.

그렇다면 객체지향은 알겠는데, 생활 체조는 갑자기 무슨 뜬금 없는 이야기인가? 정확한 경위는 모르겠지만 객체 지향에 관한 이야기를 하자면 대개 추상적으로 이야기를 많이 할 것이다. 단일 책임 원칙, 등등 이러한 것들은 객체지향의 중요한 내용이지만 추상적이고 이를 실제 구현과 설계에 적용하는 것은 쉽지 않다.

객체 지향적인 설계 및 구현을 위해서는 생활 체조를 하듯이 반복적으로 연습해야 한다는 것이고, 이를 위해서 아래에서 9가지 구체적인 가이드라인을 제시한다라는 뜻이 되겠다.

> 규칙 1: 한 메서드에 오직 한 단계의 들여쓰기(indent)만 한다.
>
> 규칙 2: else 예약어를 쓰지 않는다.
>
> 규칙 3: 모든 원시값과 문자열을 포장한다.
>
> 규칙 4: 한 줄에 점을 하나만 찍는다.
>
> 규칙 5: 줄여쓰지 않는다(축약 금지).
>
> 규칙 6: 모든 엔티티를 작게 유지한다.
>
> 규칙 7: 3개 이상의 인스턴스 변수를 가진 클래스를 쓰지 않는다.
>
> 규칙 8: 일급 콜렉션을 쓴다.
>
> 규칙 9: 게터/세터/프로퍼티를 쓰지 않는다.


각각의 규칙의 의미와 이에 맞게 Meeting Service를 리팩토링해보고자 한다.

### 1. 한 메서드에 오직 한 단계의 들여쓰기(indent)만 한다.

1개의 메서드 또는 블록 안에서 if/for/while 등을 2 depth 이상 사용하지 않는다. depth를 여러 번 들어가면서 사용한다는 것은 안에 또 하나의 응집된 블록이 생겼다는 것을 암시적으로 의미하는 것으로 이는 코드를 분리해야 될 때가 되었다는 것을 의미한다.

해당 원칙을 지키기 위해 코드를 각각의 책임과 역할에 따라 분리하면 자연스럽게 가독성과 유지보수가 용이한 코드를 작성할 수 있다.

아래는 실제 `MeetingService` 내의 Code 조각이다.

### 원본 코드
```kotlin

@Transactional
    override fun createMeetingTeam(userUUID: UUID, name: String?): String? {
        val user = userRepository.findByIdOrNull(userUUID) ?: throw UserNotFoundException()

        if (userTeamDao.findByUser(user) != null) {
            throw UserAlreadyHaveTeamException()
        }

        val meetingTeam = meetingTeamRepository.save(
            MeetingTeam(
                season = season,
                code = "",
            ),
        )
        
        userTeamDao.saveUserTeam(meetingTeam, user, true, TeamType.SINGLE)
        return ""
    }
    
```

중간에 `val meetingTeam` 코드를 보면 해당 코드의 경우 위에서 말한 depth 관련 조건을 위배했을 뿐 아니라 해당 코드의 의도를 명확히 알 수 없다.

추가적으로 위에서 exception을 던지는 부분은 해당 코드 조각 뿐만 아니라 다른 곳에서 많이 사용하고 있기에 이를 validator로 분리했다.

해당 2가지 사항을 반영한 코드이다.

### 수정 코드
```kotlin
@Transactional
    override fun createMeetingTeam(userUUID: UUID, name: String?): String? {
        val user = userRepository.findByIdOrNull(userUUID) ?: throw UserNotFoundException()
        validator.isUserAlreadyHaveTeam(user)

        val meetingTeam = saveMeetingTeam()
        userTeamDao.saveUserTeam(meetingTeam, user, true, TeamType.SINGLE)
        return ""
    }
```

물론 이 코드에서도 불만스러운 부분이 많이 보이긴 한다.
예를 들면 `saveMeetingTeam이라는` naming보다는 `createEmptyMeetingTeam`이라는 naming이 조금 더 직관적이지 않을까 하는 생각이 들고,
`saveUserTeam` 역시 뒤의 parameter를 너무 많이 받고 있고, 뭔가 직관적이지 못하다.

이러한 문제점들에 대한 수정을 진행하였고 이는 각 Section의 응집성을 위해서 최하단에서 다루도록 하겠다.

### 2. else 예약어를 쓰지 않는다.

else가 있는 코드는 의도를 파악하기 어렵다. ealry return을 통해 의도를 분명히 나타낼 수 있다.

이 말은 else 뿐 아니라 분기를 많이 나누게 될 때 통용된다. 분기를 많이 나눌 때 해당 분기에 맞는 코드를 응집하지 않고 이곳 저곳 뿌리는 것보다는 해당 분기에서 필요한 일을 응집하여 해결하고 return한다면 분기를 파악하기 좋다.

if.. else문을 잘 사용하지 않아서 (kotlin에는 return if else나 여러 문법을 제공하기에) 뒤져본 결과 하나 발견하였고 이를 수정하기로 하였다.

information에 대해서 upSert 작동을 하는 코드이다.
기존에 upSert 여부를 판단시 if else를 통해서 분기 처리를 진행하였고 이를 이른 Return 문을 통해서 흐름을 간단히 하고자 한다.

### 원본 코드

```kotlin
@Transactional
    fun informationUpSert(
        information: Information?,
        meetingTeam: MeetingTeam,
        informationDistance: String,
        informationFilter: String,
        informationMeetingTime: String,
    ) {
        if (information == null) {
            informationRepository.save(
                Information(
                    meetingTeam = meetingTeam,
                    filterInfo = informationFilter,
                    distanceInfo = informationDistance,
                    meetingTime = informationMeetingTime,
                ),
            )
        } else {
            informationUpdateDao.updateInformationByMeetingTeam(
                meetingTeam,
                informationDistance,
                informationFilter,
                informationMeetingTime,
            )
        }
    }
```

### 수정 코드
```kotlin
@Transactional
    fun informationUpSert(
        information: Information?,
        meetingTeam: MeetingTeam,
        informationDistance: String,
        informationFilter: String,
        informationMeetingTime: String,
    ) {
        if (information == null) {
            informationRepository.save(
                Information(
                    meetingTeam = meetingTeam,
                    filterInfo = informationFilter,
                    distanceInfo = informationDistance,
                    meetingTime = informationMeetingTime,
                ),
            )
            return
        }

        informationUpdateDao.updateInformationByMeetingTeam(
            meetingTeam,
            informationDistance,
            informationFilter,
            informationMeetingTime,
        )
    }
```

위의 코드는 간단하기에 크게 차이가 느껴지지 않을 수 있지만 이 또한 코드의 흐름이 복잡해지면 충분히 유용하리라 생각한다.

### 3. 모든 원시 값과 문자열을 포장한다.
이 부분은 말 그대로이다. 원시값과 문자열을 포장하지 않고 사용할 경우 Human Error의 가능성이 올라가고, 또한 안티패턴 Primitive Obsession(기본형에 대한 집착)에 노출될 수 있기에 해당 원칙 역시 중요하다.

이러한 원시 값과 문자열에 행동이 포함된다면 이를 캡슐화하는 것은 더욱 추천된다. DDD에서는 이를 특별히 VO라고 부른다.

또한 이러한 것을 간단히 변수로 포장하는 것 역시 좋지만, 해당 값과 그에 따른 행동이 필요하다면 이를 VO Class로 지정하여 해당 값과 그에 따른 행동을 하나의 응집성 있게 뭉쳐 제공한다면 블랙박스의 효과를 동시에 낼 수 있다. 이를 통해 추상화 정도 역시 높일 수 있다.

아쉽게도 VO로 Refactoring할 만한 요소가 담당 Domain에서 보이지 않아 문자열을 포장한 사례에 대해서만 살펴보겠다.

```kotlin
@Qualifier("tripleMeetingService")
class TripleMeetingService(
    private val userRepository: UserRepository,
    private val meetingTeamRepository: MeetingTeamRepository,
    private val informationRepository: InformationRepository,
    private val preferenceRepository: PreferenceRepository,
    private val userTeamDao: UserTeamDao,
    private val uniqueCodeGenerator: UniqueCodeGenerator,
    private val validator: Validator,
    private val meetingServiceUtils: MeetingServiceUtils,
    @Value("\${app.season}")
    private val season: Int,
) : BaseMeetingService()
```

season 값을 단순히 원시값으로 사용할 수 있지만, 이를 application.yml 내에서 변수 값으로 포장하여 중복을 최소화하고 의도를 드러내어 사용하고 있다.


### 4. 일급 컬렉션을 쓴다.

일급 컬렉션이란 Collection을 Wrapping하면서 Collection 외 다른 멤버 변수가 없는 상태를 말한다.

한 마디로 해당 Collection을 wrapping 해서 제공하라는 것인데, 이것이 왜 중요한가?

예를 들어 우리가 User의 List를 이전 단계에서 보내주게 된다면 이에 대해서 List의 removeAll 같은 요소들을 요청이 가능하다. 이 대신 User의 List를 Mapping하여 정해진 몇 개의 접근 Method만 제공한다면 위처럼 자유로운 접근을 막을 수 있다.

일전에 좋은 설계와 관련해서도 해당 이야기를 들었던 기억이 있는 듯하다. 사용하지 않는데 접근 가능한 루트가 있으면 안 된다. 존재한다면 언젠가는 기어코 그걸로 접근하는 사람이 생긴다라는..

```java
public class main {
    Map<String, String> map = new HashMap<>();
    map.put("1", "A");
    map.put("2", "B");
    map.put("3", "C");
}
```

예를 들어보자면 위의 코드가 아래로 바뀐 것을 보여주는 것이다.
아래의 코드는 Map을 wrapping하고 Private 변수로 선언함으로서 Method로만 접근 가능하고 다양한 비즈니스 로직들을 같이 넣을 수 있도록 변경하였다.

```java
public class GameRanking {

    private Map<String, String> ranks;

    public GameRanking(Map<String, String> ranks) {
        this.ranks = ranks;
    }
}
```

[일급 컬렉션이란](https://jojoldu.tistory.com/412)

일급 컬렉션에 대해서 더 알고 싶으시다면 위의 글을 참고하는 것은 어떨까?

그러면 이제 실제 MeetingService 내에서 해당 코드를 수정해보자

### 원본 코드

```kotlin
val userList = userTeamDao.findByTeam(meetingTeam).map { it.user!! }
toMeetingTeamUserListGetResponse(meetingTeam.name!!, userList)
```

### 수정 코드

```kotlin
class MeetingTeamUsers(
    private val users: List<User>
) {

    fun toMeetingTeamUserListGetResponse(teamName: String):
        MeetingTeamUserListGetResponse {
        val currentYear: Int = LocalDate.now().year

        return MeetingTeamUserListGetResponse(
            teamName = teamName,
            users.map {
                MeetingTeamUser(
                    nickname = it.nickname,
                    age = currentYear - it.birthYear!! + 1,
                )
            },
        )
    }
}
```

```kotlin
val meetingTeamUsers = MeetingTeamUsers(userTeamDao.findByTeam(meetingTeam).map { it.user!! })
meetingTeamUsers.toMeetingTeamUserListGetResponse(meetingTeam.name!!)
```

기존의 코드의 경우 userList Entity Collection을 그대로 드러내고 있었고, 이를 통해 원하는 대로 수정이 가능했다.

이를 `MeetingTeamUsers를` 통해 private collection 일급 콜렉션을 사용하여 직접 접근을 막고, 해당 콜렉션으로부터 의도를 가진 Method를 뽑아내어 사용할 수 있도록 했다.

이는 더 나아가 객체 지향의 기본적인 원리에도 다가가는 방법이 아닌가 싶다. 이전에 들었던 바로 객체를 단순히 데이터를 보관하는 것이 아니라 객체가 그 데이터를 활용할 수 있도록 하는 것, 객체가 동작의 주체가 되도록 하는 것이 객체 지향과 코드 분리의 관점에서 DDD와도 이어져 있다고 생각한다.

물론 이러한 Refactoring을 마음껏 할 수 있는 기저에는 Test Code가 있다. Test Code를 통해 이러한 변화가 문제가 없음을 증명한다.

### 5. 한 줄에 점을 하나만 찍는다.

이 부분은 크게 설명을 드릴 것이 없을 정도로 간단하다.


`.`을 통해서 자주 내부의 property나 method를 불러와 사용하는 경우가 있다. 

이 때 `.`을 통해 연결을 단 한 번만 하라는 것이다.

```koltin
user.information.money
```
유명한 법칙 하나를 인용하자면
디미터 법칙에 따라서 객체 그래프를 따라서 먼 객체에 메시지를 보내는 설계를 피하라고 한다. 위처럼 설계하면 객체간 결합도가 생겨 캡슐화가 깨질 우려가 있다.

```koltin
user.hasMoney()
```
이처럼 User에게 직접 물어보거나 이를 위한 의도를 드러내는 Method를 만들어 의존성을 줄이는 것이 좋다.

JPA의 QueryDSL을 사용하거나 하는 경우나 Chaining Pattern 등 특수한 경우에는 적용하는 것이 쉽지 않으나 기본적으로는 적용하는 것이 좋다.

현재 맡은 Domain의 대부분의 Code가 해당 원칙을 따르고 있으므로 수정하지 않고 예시 코드 조각을 올리겠다.


### 예시 코드
```kotlin
@Transactional
    override fun updateMeetingTeamInformation(
        userUUID: UUID,
        informationDistance: String,
        informationFilter: String,
        informationMeetingTime: String,
        preferenceDistance: String,
        preferenceFilter: String,
    ) {
        val user = userRepository.findByIdOrNull(userUUID) ?: throw UserNotFoundException()

        val userTeam = userTeamDao.findByUserWithMeetingTeam(user, TeamType.TRIPLE) ?: throw UserTeamNotFoundException()
        val meetingTeam = userTeam.team

        // information and preference 는 하나만 존재해야 함 중복 체크
        val information = informationRepository.findByMeetingTeam(meetingTeam)
        val preference = preferenceRepository.findByMeetingTeam(meetingTeam)

        meetingServiceUtils
            .informationUpSert(information, meetingTeam, informationDistance, informationFilter, informationMeetingTime)
        meetingServiceUtils.preferenceUpSert(preference, meetingTeam, preferenceDistance, preferenceFilter)
    }
```

### 6. 줄여 쓰지 않는다(축약 금지).

이 또한 의미가 명확하다. Naming을 할 때 약어를 쓰지 말고 최대한 원어를 유지하라는 것이다. 이는 특히나 개발 팀을 리드할 때 필자도 많이 강조하는 부분이다. 일부 몇몇 유명한 약어들(ex. id(identifier), ..)이 아니라면 무조건 줄이지 말라고 강조하는 편이다.

단순히 cnt, lck 등도 줄이지 않고 count, lock으로 쓰면 명확히 알아볼 수 있다. 이전에는 최소한으로 메모리를 사용하기 위해 변수 명 길이 마저 줄이기 위해 최선을 다했다지만 요즘에는 그럴 필요가 없다. 협업이 더욱 중요하다.

그리고 이렇게 약어를 사용하지 않은 네이밍이 너무 길다면 해당 코드가 1개보다 많은 책임이나 역할을 맡고 있는지 의심해보면 된다.

이 또한 현재 잘 지켜지고 있는 내용이므로 위의 코드로 예시를 대체한다.

### 7. 모든 엔티티를 작게 유지한다.

이 말 역시 간단한다.
하나의 클래스에는 50줄이 넘지 않도록 패키지에는 파일이 10개를 넘지 않도록 유지하자는 것이다.

물론 이 수치를 명확히 따르는 것은 쉽지 않지만, 이에 맞게 최대한 작게 유지하기 위해 각각의 부분부분을 분리하는 것은 분명히 도움이 된다.

### 원본 코드
```kotlin
 @Transactional
    override fun createMeetingTeam(userUUID: UUID, name: String?): String? {
        val user = userRepository.findByIdOrNull(userUUID) ?: throw UserNotFoundException()

        isUserHaveOnlyOneTeam(user)
        isTeamNameLeast2Character(name)

        val code = getUniqueTeamCode()
        val meetingTeam = saveMeetingTeam(name, code)

        userTeamDao.saveUserTeam(meetingTeam, user, true, TeamType.TRIPLE)
        return code
    }
```

위의 코드 또한 어느 정도 정돈된 것으로 보이지만, `isUserHaverOnlyOneTeam`이나 `isTeamNameLeast2Character` 같은 validation 부분이 해당 Class 의 최하단에 private function으로 추가되어 기하급수적으로 Class의 길이가 늘어났다.

또한 `getUniqueTeamCode`와 같은 코드 역시 같은 상황이었다. 이를 아래처럼 수정하였다.

### 수정 코드
```kotlin
@Transactional
    override fun createMeetingTeam(userUUID: UUID, name: String?): String? {
        val user = userRepository.findByIdOrNull(userUUID) ?: throw UserNotFoundException()

        validator.isUserAlreadyHaveTeam(user)
        validator.isTeamNameLeast2Character(name)

        val code = uniqueCodeGenerator.getUniqueTeamCode()
        val meetingTeam = saveMeetingTeam(name, code)

        userTeamDao.saveUserTeam(meetingTeam, user, true, TeamType.TRIPLE)
        return code
    }
```

validation 부분을 해당 Domain의 공통 Validator로 분리하여 호출하였고, code를 생성하는 부분은 util package의 `uniqueCodeGenerator`의 function으로 분리하였다.

이를 통해서 실제 Service 내에 핵심적인 Logic에 관련된 코드를 남겨 크기를 최소화였다.

### 8. 3개 이상의 인스턴스 변수를 가진 클래스를 쓰지 않는다.

이 부분이 이 9가지의 원칙 중 가장 어려운 부분이라고 생각한다. 말 그대로 파라미터를 3개 이상 받지 말라는 것이다. 이와 관련해서 아마 예전에 컴퓨터 구조 시간에 들었던 $arg류의 register가 3개라는 점과 관련이 있지 않을까라는 생각이 드는 부분이다. 물론 지금에서는 다른 의미이겠지만

관건은 인스턴스 변수가 많아지면, 클래스의 응집도가 낮아진다는 것이다. 또한 인스턴스 변수가 많아진다는 것은 해당 Function, Method가 많은 일을 할 확률이 높아진다는 이야기이도 하다.

우리 대장님(마틴 파울러)님은 대부분의 클래스가 인스턴스 변수 하나만으로 일을 하는 것이 적합하다고 한다.

저서 Clean Code에서 이상적인 변수 개수는 0개로 소개한다.

물론 모든 상황에서 3개 미만의 변수를 유지하는 것은 매우 어렵고 때로는 불가능할 수도 있으나, 최대한 적게 유지하는 것은 분명히 도움이 된다고 생각한다.

### 원본 코드
```kotlin
@Transactional
    override fun createMeetingTeam(userUUID: UUID, name: String?): String? {
        val user = userRepository.findByIdOrNull(userUUID) ?: throw UserNotFoundException()

        validator.isUserAlreadyHaveTeam(user)
        validator.isTeamNameLeast2Character(name)

        val code = uniqueCodeGenerator.getUniqueTeamCode()
        val meetingTeam = saveMeetingTeam(name, code)

        val newUserTeam = UserTeam.createUserTeam(meetingTeam, user, true, TeamType.TRIPLE)
        userTeamDao.saveUserTeam(newUserTeam)
        return code
    }
```

### 수정 코드
```kotlin
@Transactional
    override fun createMeetingTeam(userUUID: UUID, name: String?): String? {
        val user = userRepository.findByIdOrNull(userUUID) ?: throw UserNotFoundException()

        validator.isUserAlreadyHaveTeam(user)
        validator.isTeamNameLeast2Character(name)

        val code = uniqueCodeGenerator.getUniqueTeamCode()
        val meetingTeam = saveMeetingTeam(name, code)

        val newUserTeam = UserTeam.createUserTeam(meetingTeam, user, true, TeamType.TRIPLE)
        userTeamDao.saveUserTeam(newUserTeam)
        return code
    }
```

```kotlin
@Entity
@Table(name = "user_team")
class UserTeam(
    @Id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "team_id", nullable = false)
    var team: MeetingTeam,

    @Id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    var user: User? = null,

    @Column(nullable = false)
    var isLeader: Boolean,

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    var type: TeamType,
) {
    companion object {
        fun createUserTeam(meetingTeam: MeetingTeam, user: User, isLeader: Boolean, teamType: TeamType): UserTeam {
            return UserTeam(
                team = meetingTeam,
                user = user,
                isLeader = isLeader,
                type = teamType
            )
        }
    }
}

```

위와 코드가 뭐가 다른가요? 결국 `UserTeam.createUserTeam`은 parameter가 3개가 넘는데요? 라고 할 수 있지만, 일단 수정본에서는 객체가 스스로 값을 받아서 그에 따른 객체를 만들어 넘기고 있다.

이는 이전에 DAO로 값을 직접 넘겨서 이를 DAO 내에서 객체로 조립하여 persist하던 것과는 차이가 있다.

객체가 스스로 일을 하게 만들었다는 점과 DAO가 온전히 DB와 소통하는 일을 맡도록 분리했다고 보면 될 듯 하다.

### 9. getter/setter/프로퍼티를 쓰지 않는다.

이 부분은 DDD 등 여타 개발 원칙에서도 많이 강조하는 부분이다.
위에서 언급했듯이 사람들이 마구 값을 꺼내가고 변경하는 것을 막기 위한 의도가 1이고, 2번째 역시 언급했듯이 객체를 주도적인 주체로 사용하는 것이다. 객체를 단순히 데이터를 담아두는 용도 뿐 아니라, 객체를 실제 행동의 주체로 간주하는 것이다.

예시코드는 위에서 언급했던 일급 컬렉션 리팩토링 부분을 참고 바란다.

이 부분에서 개인적으로 고민이 드는 지점은 이 원칙을 지키는 것이 쉽지 않다는 것이다. 해당 지점들을 나열해보자면,

1. Kotlin, Spring Boot(JPA) 간의 뭔가 잘 맞지 않는 부분

간단히 이야기하자면, kotlin + JPA에서 getter는 살려두고, setter를 죽이는 것은 쉽지 않다는 것이다.
이 부분은 이미 똑같은 생각을 너무 잘 정리해두신 블로그가 있어 해당 링크로 대체한다.
[kotlin(+JPA) entity 에서 setter 를 막을 수 있을까](https://multifrontgarden.tistory.com/272)

2. Entity에 Domain Logic을 넣기 부담스럽다

일단 아직까지 진행한 프로젝트가 크게 복잡하지 않아서인지, DB와의 작동을 위주로 진행이 되고 있는데, 이러한 경우 이러한 Logic을 Entity에 밀어넣는 것은 좋지 않다고 생각한다. Entity가 DAO 계층과 연결되는 것이 좋다고 생각되지 않으며, Entity를 최대한 깨끗한 상태로 유지하고자 한다.

그렇다면 Entity Class를 Wrapping 하여 사용하면 되지 않겠느냐라는 생각이 나온다. 그렇다면 Entity Class를 Wrapping하고 DAO의 Method를 가져와 해당 객체의 Method로 연결하는 것은 어떤가 라는 생각이 들었는데 뭔가 억지를 부리는 느낌이다.

이전에 Interface에 대해 구현체가 하나일 경우 Interface가 굳이 필요하지 않은데 습관적으로 만드는 걸 반성하는 글을 본 적이 있는데, 이러한 판단 역시 나중에 똑같은 회고글을 적게 될 것 같다.

객체가 스스로 행동하게 하는 것이 쉽지 않은 것 같지만 위에서 UserList 일급 컬렉션처럼 해당 부분과 같이 객체를 다루는 방식이 충분히 마음에 들어 이 부분에 대해서 고민을 더 해보고자 한다.

### ep-1. 위에서 거슬리던 부분들

1에서 거슬렸던 부분으로 code를 반환하는 부분에서 `SingleMeetingService`의 경우 ""의 원시값을 보내는 것과 `UserTeamDao` 관련하여 Parameter가 많은 것이 무언가 찜찜하였는데,

`SingleMeetingService`의 ""의 경우 DB의 nullable과도 연관이 있고 이미 Service를 통해 받은 데이터와의 호완성 문제도 있어, 이는 차후에 생각하기로 하였다.

Parameter 관련해서는 8에서 수정하였다.

### ep-2. 회고

위 글에서의 수정은 사실 해당 객체지향 체조 원칙을 접하기 이전에 이미 본인이 진행한 것들이 꽤 있다. 그러한 수정들은 DDD의 의미를 살리거나 또는 클린 코드를 위해 수정한 것들인데, 그러한 것들이 해당 원칙과도 연관이 있다는 것이 조금 놀라웠다.

일급 컬렉션과 관련된 부분은 이전에도 알고 있었으나, 제대로 이해하지 못하고 있었는데, 이를 제대로 이해하고 적용할 수 있어 좋았던 것 같다.

몇몇 부분에 대해서는 만족스러운 결과를 내지 못했는데 이에 대해서는 조금 더 고민해봐야겠다.