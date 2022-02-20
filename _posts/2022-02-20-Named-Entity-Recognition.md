---
layout: post 
title: "[REST API 서버] wsgi로 Apache, Flask 연동하기"
authors: [sheele41]
tags: ["apache", "flask", "wsgi"]
image: https://oasisfores.com/wp-content/uploads/2020/09/1_MS989ztKY9KfRed2J6K4_Q.png
featured: true
---

## 시작하기 전에

---

### 이 글의 목적

나중에 또 같은 삽질을 하지 않도록 과정을 기록

### 독자의 기본 필요 지식 및 유익 분기점

REST API는 뭐고 API는 뭐에요? → _모르셔도 됩니다._

Python은 알겠는데 Apache랑 Flask는 뭐에요? → _Apache랑 Flask를 다른 곳에서 공부하신 뒤 다시 와주세요._

제 서버에는 Apache도 Python도 Flask도 안 깔려있는데요? → _깔고 와주세요._

wsgi는 뭔가요? → _일단 모르셔도 됩니다. 글로만 백날 읽어도 난해하기만 할 뿐더러 여기서 직접 해볼거니까요._

### 서버 환경

Apache, Python, Flask가 깔려있는 Ubuntu 18.04

## Apache와 Flask를 연동한다는 것

---

**WAS? Web Server?**

아직 웹에 익숙하시지 않은 분들은 WAS(Web Application Server, 웹 애플리케이션 서버), Web Server(웹 서버)와 같은 단어들이 헷갈리기만 할 겁니다.

내용을 검색해봐도 네모랑 화살표만 가득한 구조도만 줄줄이 나올 뿐이죠.

사람들이 일부러 어렵게 설명하려고 그렇게 적어놓은게 아니라 실제로 말로 설명하려면 그런 내용이 되어버립니다.

어차피 봐도 이해 안되는거, 어려운 내용은 접어두고, 까짓거 무작정 앞으로 걸어가봅시다.

![apache](https://oasisfores.com/wp-content/uploads/2020/09/2.png)

![flask](https://oasisfores.com/wp-content/uploads/2020/09/4.png)

우선 앞서 설명드린대로 여러분들이 Apache와  Flask에 대한 이해가 어느 정도 되어있다는 가정 하에 진행을 하겠습니다.

어떻게 보면 **Apache도 웹 페이지를 띄워주는 서버**이고, **Flask도 웹 페이지를 띄워주는 서버**인데 굳이 같은 기능을 하는 두 개를 모두 깔아놓고 '연동' 이라는 것을 할 필요가 있을까요?

**네 있습니다.** Flask만으로는 웹 서버 역할을 하기에는 좀 많이 부족하거든요. (하나의 요청밖에 처리하지 못하고... 느리고...)

그리고 SSL, VirtualHost 같은 Apache의 편리한 기본 기능을 놓친다는 건 굉장히 아깝잖아요? ㅎㅎ

그래서 이렇게 욕심쟁이처럼 **두 기능을 모두 쓰고 싶을 때** 하는 것이 바로 **Apache, Flask의 연동**입니다.

이 경우 **Flask를 httpd 위에 얹는다, 웹 서버를 앞단에 둔다(그림 참조)** 등 여러가지로 표현하기도 합니다. ㅎㅎ

![server](https://oasisfores.com/wp-content/uploads/2020/09/server.png)

## wsgi를 이용하여 Apache, Flask 연동하기

---

아무튼 이제 Apache와 Flask 두 개를 연동해야 한다는 건 알겠는데... 연동은 어떻게 하는 걸까요?

그 방법이 바로 **wsgi (Web Server Gateway Interface)** 입니다.

wsgi를 검색해보면 이것 저것 어려운 단어들이 많이 나올텐데 일단은 그냥 두 개를 연결해주는 **'프로그램'** 이라고 생각해둡시다.

실제로 wsgi는 아래 명령어를 통해 설치해주어야 합니다.

### Python 3.x 버전의 경우

```bash
apt-get install libapache2-mod-wsgi-py3
```

### Python 2.x 버전의 경우

```bash
apt-get install libapache2-mod-wsgi
```

설치가 끝난 뒤에는 꼭 모듈을 enable 시켜주세요.

```bash
a2enmod wsgi
```

이제 준비도 다 끝났으니 본격적으로 연동을 시작해보죠.

아직 wsgi도 뭔지 잘 모르겠고 아리까리하다구요? 당연한겁니다.

백문이불여일견이라고... 이런건 하면서 배우는겁니다 하면서.

**우선 자신의 웹 페이지가 위치할 디렉토리에 .py 파일과 .wsgi 파일을 만들어줍니다.**

파일명은 제가 알아서 정한 것들이니 꼭 저게 되어야 하는 것은 아닙니다.

### app.py

```python
from flask import Flask

app = Flask(\_\_name\_\_)

@app.route("/")
def hello\_world():
    return "Good!"
```

### mywsgi.wsgi

```python
import sys
sys.path.insert(0, "웹 페이지 디렉토리 ex) /var/www/html")
from app import app as application
```

이때 중요한게 있는데 wsgi 파일의 마지막 라인에서 **from 다음에는 같이 만들어준 .py 파일의 이름**을, **import 다음에는 .py 파일 내부에서 생성해준 Flask 객체의 변수명**을 적어주어야 합니다.

```python
from <.py File Name> import <Flask Object Name> as application
```

.py 파일과 .wsgi 파일을 만들어주었다면 다음으로는 **Apache의 VirtualHost 파일들이 존재하는 디렉토리로 이동**합니다.

```bash
cd /etc/apache2/sites-available/
```

대충 **자기\_사이트\_주소.conf** 파일을 만들어주고 VirtualHost 내용을 작성해줍니다.

```bash
vi www.example.com.conf
```

**첨부된 코드는 아래와 같은 상황을 가정하고 작성된 내용입니다.**

* 사이트 주소 : www.example.com

* 웹 디렉토리 : /var/www/html

* wsgi 파일명 : mywsgi.wsgi

* 프로세스명, 프로세스 그룹명(별 의미 없음) : myflaskapp

* 할당 유저 및 그룹 : www-data / www-data

이때 웬만하면 user와 group은 www-data로 하시기 바랍니다.

권한 문제로 soc 파일을 쓰거나 읽지 못하게 되면 **503 service unavailable** 에러가 발생합니다. ( [https://webmaster.cafe/tools/apache-conf-generator/](https://webmaster.cafe/tools/apache-conf-generator/) 를 이용하시면 편리합니다. )  

### **SSL(https)을 사용하지 않는 경우**

```xml
<VirtualHost \*:80>
    ServerName www.example.com
        
    WSGIScriptAlias / /var/www/html/mywsgi.wsgi
    WSGIDaemonProcess myflaskapp user=www-data group=www-data threads=5

    DocumentRoot /var/www/html

    <Directory /var/www/html>
        WSGIProcessGroup myflaskapp
        WSGIApplicationGroup %{GLOBAL}
        WSGIScriptReloading on
        Options FollowSymLinks MultiViews
        AllowOverride All
        require all granted

        php\_value upload\_max\_filesize 10M
        php\_value post\_max\_size 10M

        php\_value session.cookie\_httponly 1
        php\_value session.use\_strict\_mode 1

        # php\_value memory\_limit 128M
        # php\_value max\_execution\_time 30
        # php\_value max\_input\_time 60
    </Directory>

    AssignUserID www-data www-data

    ErrorLog ${APACHE\_LOG\_DIR}/www.example.com-error.log
    CustomLog ${APACHE\_LOG\_DIR}/www.example.com-access.log combined

</VirtualHost>
```

### **SSL(https)을 사용하는 경우**

```xml
<VirtualHost \*:80>
    ServerName www.example.com

    WSGIScriptAlias / /var/www/html/mywsgi.wsgi

    <IfModule mod\_rewrite.c>
    RewriteEngine on

    RewriteRule ^ - \[E=protossl\]
    RewriteCond %{HTTPS} on
    RewriteRule ^ - \[E=protossl:s\]

    RewriteCond %{HTTPS} !=on
    RewriteRule ^ https://%{HTTP\_HOST}%{REQUEST\_URI} \[L,R=301\]

    </IfModule>

</VirtualHost>

# Specify the SSL cache directory. If possible, use shmcb, otherwise use the provided path.
SSLStaplingCache shmcb:/var/run/ocsp(128000)

<VirtualHost \*:443>
    ServerName www.example.com

    DocumentRoot /var/www/html

    WSGIScriptAlias / /var/www/html/mywsgi.wsgi
    WSGIDaemonProcess myflaskapp user=www-data group=www-data threads=5

    <Directory /var/www/html>
        WSGIProcessGroup myflaskapp
        WSGIApplicationGroup %{GLOBAL}
        WSGIScriptReloading on
        Options FollowSymLinks MultiViews
        AllowOverride All
        require all granted

        # upload\_max\_filesize and post\_max\_size must have the same value.
        php\_value upload\_max\_filesize 10M
        php\_value post\_max\_size 10M

        # Enhance session security.
        php\_value session.cookie\_httponly 1
        php\_value session.use\_strict\_mode 1
  
        # php\_value memory\_limit 128M
        # php\_value max\_execution\_time 30
        # php\_value max\_input\_time 60
    </Directory>

    AssignUserID www-data www-data

    ErrorLog ${APACHE\_LOG\_DIR}/www.example.com-error.log
    CustomLog ${APACHE\_LOG\_DIR}/www.example.com-access.log combined

    Header always set Strict-Transport-Security "max-age=31536000"

    SSLEngine on

    SSLProtocol all -SSLv2 -SSLv3

    SSLCipherSuite ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-AES256-GCM-SHA384:DHE-RSA-AES128-GCM-SHA256:DHE-DSS-AES128-GCM-SHA256:kEDH+AESGCM:ECDHE-RSA-AES128-SHA256:ECDHE-ECDSA-AES128-SHA256:ECDHE-RSA-AES128-SHA:ECDHE-ECDSA-AES128-SHA:ECDHE-RSA-AES256-SHA384:ECDHE-ECDSA-AES256-SHA384:ECDHE-RSA-AES256-SHA:ECDHE-ECDSA-AES256-SHA:DHE-RSA-AES128-SHA256:DHE-RSA-AES128-SHA:DHE-DSS-AES128-SHA256:DHE-RSA-AES256-SHA256:DHE-DSS-AES256-SHA:DHE-RSA-AES256-SHA:AES128-GCM-SHA256:AES256-GCM-SHA384:AES128-SHA256:AES256-SHA256:AES128-SHA:AES256-SHA:AES:CAMELLIA:DES-CBC3-SHA:!aNULL:!eNULL:!EXPORT:!DES:!RC4:!MD5:!PSK:!aECDH:!EDH-DSS-DES-CBC3-SHA:!EDH-RSA-DES-CBC3-SHA:!KRB5-DES-CBC3-SHA

    SSLHonorCipherOrder on
    SSLCertificateFile "/etc/letsencrypt/live/www.example.com/cert.pem"
    SSLCertificateKeyFile "/etc/letsencrypt/live/www.example.com/privkey.pem"
    SSLCertificateChainFile "/etc/letsencrypt/live/www.example.com/chain.pem"

    # Turn on OCSP stapling
    SSLUseStapling on
    SSLStaplingResponderTimeout 5
    SSLStaplingReturnResponderErrors off

</VirtualHost>
```

중요한 것만 간단하게 설명드리자면 아래와 같습니다. (자세한 내용은 [https://modwsgi.readthedocs.io/en/develop/configuration.html](https://modwsgi.readthedocs.io/en/develop/configuration.html) 참조)

### 사이트 URL/ 접근시 mywsgi.wsgi 파일 참조

```xml
WSGIScriptAlias / /var/www/html/mywsgi.wsgi
```

### Flask 프로세스, user, group, thread 설정

```xml
WSGIDaemonProcess myflaskapp user=www-data group=www-data threads=5
```

자 이제 힘든건 다 끝났습니다. VirtualHost 파일 작성이 끝났다면 다음 명령어를 통해 **사이트를 enable** 시켜줍니다.

```bash
a2ensite www.example.com.conf
```

Apache도 한 번 재시작 해주고.

```xml
service apache2 restart
```

자신의 사이트 주소에 접속을 해보면 정상적으로 잘 작동하는 모습을 확인할 수 있습니다.

![ok](https://oasisfores.com/wp-content/uploads/2020/09/6.png)

## TroubleShooting

---

웹 페이지가 정상적으로 나오지 않는다구요?

그럴 수 있죠... 오히려 되는게 신기한 겁니다.

설정을 한 두개 한 것도 아니고 여러 파일이 복잡하게 얽혀있으니까요...

문제를 해결하기 위해서는 로그를 봐야하는데 터미널에는 로그가 코빼기도 안보이네요?

우선 로그를 띄워봅시다.

아까 작성했던 VirtualHost 파일에서 에러 파일 저장 위치와 파일명을 확인합니다.

```xml
ErrorLog ${APACHE\_LOG\_DIR}/www.example.com-error.log
```

그 다음 경로와 파일명에 맞게 명령어를 치면...?

```bash
tail -f /var/log/apache2/www.example.com-error.log
```

![error](https://oasisfores.com/wp-content/uploads/2020/09/7.png)

위와 같이 에러가 실시간으로 올라오는 모습을 확인하실 수 있습니다. (종료는 Ctrl + C)

추가) 만약 로그가 잘 뜨지 않는 것 같으면 **.wsgi** 파일을 다음과 같이 변경해보세요.

```python
import sys
import logging

logging.basicConfig(stream=sys.stderr)
sys.path.insert(0, "MY\_WEB\_DIRECTORY")
from app import app as application
```

대부분의 문제는 **VirtualHost, wsgi, py 등의 파일 작성 실수, 권한 설정, Python 패키지 설정(venv로 해결)**으로 인해 발생하니 이것들을 우선적으로 확인하면 빠른 문제 해결에 도움이 될겁니다.

## 마치며

---

이렇게 wsgi를 이용하여 Apache와 Flask를 연동하는 방법을 알아보았는데 어떻게 좀 감이 잡히셨나요? ^^;

이래저래 말이 길었지만 결국 **VirtualHost에 wsgi 관련 설정을 해줌으로써 요청이 들어왔을 때 Flask로 넘겨주는 것이 가능**하다는 내용입니다.

흐름이죠 결국은...

이제 웹 서버를 앞단에 갖다 놓는다느니, Flask를 httpd에 얹는다느니 하는 아리송한 이야기들이 좀 이해가 가시죠? ㅎㅎ

전문적이고 정확하지는 않아도 최대한 이해하기 쉬운 글이 되도록 노력해보았습니다.

부디 여러분들에게 도움이 되었으면 좋겠네요. 긴 글 읽어주셔서 감사합니다. ^^
