---
layout: post
title:  "Cookies read and write with JavaScript Only"
author: munna
categories: [JavaScript]
tags: [Cookie, JavaScript]
image: assets/images/cookie-operation.png
description: "Cookie is the most used object in JavaScript to store data in browser and reuse.Not need to use any third party library to perform Read/Write operation.Just use JavaScript"
featured: true
hidden: true
# rating: 4.5
---


JavaScript has everthing what you need to perform any task in browser and easy to use as comparision to other libraries which is developed on JavaScript.So Why should we go to download and use other libraries? 

> Wrote this blog because I don't want to use heavy plugin/library for simple task which can slow down performance of my application.

> Using multiple JavaScript library for small task will down performance of your Application so always try to write your small logics to perform tiny task.

## Write Cookie

```javascript
document.cookie = 'firstname=Munna;lastname=Bhakta'//Will Never expire this cookie until user remove.

//Write simple function to reuse anywhere in application.
function setCookie(cname, cvalue, exdays) {
  var d = new Date();
  d.setTime(d.getTime() + (exdays*24*60*60*1000));
  var expires = "expires="+ d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}
```
## Update Cookie
Good thing about cookie is "it never duplicate key" so when you will provide new value it will update existing cookie. No need additional code. For example. 

```javascript
document.cookie = 'firstname=Naitik;lastname=Raj'// Will add cookie firstName and lastName.
```

## Read All Cookie 
Will return all cookie value as string
```javascript
document.cookie 
```

## Read Cookie by Key

```javascript
function getCookie(key){
    return document.cookie.split(';').map(cookie=> {return cookie.indexOf(key)>-1?cookie.split("=")[1]:null }).join("");
}
readCookie('firstName');// Will Return value of firstName
``` 
### Details about used functions
1. *split* - Will make array of string by splitting ';' saperator.
2. *map* - Will loop over all array item returned by *split* function.
3. *indexOf* - compare key of each item in array and return >-1 if found else will return -1.
4. *join* - Will join array to string. 

## Delete a cookie.
You don't need to provide cooke value if you want to remove. For example. 
```JavaScript
document.cookie='firstName=;expires=Thu, 01 Jan 1970 00:00:00 UTC;'
```

Here is the complete JavaScript file which you can download and use in your application or you can write your own program by taking some help.

<script src="https://gist.github.com/munna/5f6b16a1b4235ffdb2440b4d47ae2f08.js"></script>

