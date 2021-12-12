---
layout: post
title:  "Github Branch Model"
author: munna
categories: [ github, tutorial ]
tags: [github, development]
image: assets/images/git-branch-model.png
description: "Git branch development model which helps to manage your code reviewable, trackable, managable."
featured: true
hidden: true
# rating: 4.5
---

Use Github in the way so that it can help you to manage your code reviewable, trackable and managable.

# Main Branches 

At the core, the development model is greatly inspired by existing models out there. The central repo holds two main branches with an infinite lifetime:

1. *master*- origin/master branch is know to be production ready branch and this should be familier to each developer.
2. *dev*- origin/dev branch is the main branch where the source code of HEAD always reflects a state with the latest delivered development changes for the next release.

## Supportive Branches

Supportive branches will be use only to support their main branches so that team can perform parrlel development on differnt part of application without disturbing to each other.Unlike main branches,these branches has always limited lifetime, since they will be removed eventully.There are three types of supportive branches.

1. *Feature Branches* - 
2. *Release Branches*
3. *HotFix Branches*

Each of these branches are bound to specific purpose with strict rules.There is no any special meaning in terms of technology.Branch types are categorized by how we use them.lets go though these branches one by one in details.

### Feature Branches
Name of this branch should not be like master,dev,release-*,hotfix-* etc.
perform below steps to create your feature branch.
    
1. Create a feature branch.
`````````            
git checkout -b myfeature dev
#Switched to a new branch "myfeature"
`````````
2. merge finished feature on *dev*.
````
    git checkout dev
Switched to branch 'dev'
    git merge --no-ff myfeature
#Updating ea1b82a..05e9557
#(Summary of changes)
    git branch -d myfeature
#Deleted branch myfeature (was 05e9557).
    git push origin develop
``````
The --no-ff flag causes the merge to always create a new commit object

### Release Branches

1. create branch from origin *dev*.
2. merge back to branch *master*.
3. Naming convention - release-*

1. Create a release branch.
```
git checkout -b release-1.2 dev
#Switched to a new branch "release-1.2"
```
2. Finishing a release branch.
```
    git checkout master
Switched to branch 'master'
    git merge --no-ff release-1.2
#Updating ea1b82a..05e9557
#(Summary of changes)
    git branch -d myfeature
#Deleted branch myfeature (was 05e9557).
    git push origin develop
```
The --no-ff flag causes the merge to always create a new commit object

### Here are some types of branch explained.

1. **Feature** - Allow developer to directly commit there changes and make a pull request when done
2. **Dev** - This branch should be only allowed to code reviewer or project manager so that any bad code can be 
avoid before comming to main stream otherwise it will lead to generate new issues to other developer as well.
3. **Release**- Once project become stable for developed feature, project manager/responsible person
can merge dev branch to release branch. Make sure previous released branch is already close otherwise can have 
some unexpected problem in later stage.
4. **Master**- Master branch is known to be production ready branch.So make sure you only merge your release if everything is fine
5. **HotFix**- Allowed to developer, Sometimes client pointout criticle errors in production which needs to fix asap. So this time we another branch of hotfix types
which we merge later in master branch. Also do not forget to merge this hot fix into development branch otherwise
you will miss importent bug fix in next release.