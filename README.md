# auth0-lock-meteor

[![Build Status](https://travis-ci.org/jcoreio/auth0-lock-meteor.svg?branch=master)](https://travis-ci.org/jcoreio/auth0-lock-meteor)
[![Coverage Status](https://codecov.io/gh/jcoreio/auth0-lock-meteor/branch/master/graph/badge.svg)](https://codecov.io/gh/jcoreio/auth0-lock-meteor)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

`auth0-lock` integration with Meteor Accounts

## Usage

```sh
meteor add accounts accounts-oauth
npm install --save auth0-lock-meteor
```

### Server
```js
import {Accounts} from 'meteor/accounts-base'
import 'auth0-lock-meteor/lib/server'
import auth0LoginHandler from 'auth0-lock-meteor/lib/auth0LoginHandler'

Accounts.registerLoginHandler(auth0LoginHandler)
```

#### `alanning:roles` v2.0 support
```js
import auth0LoginHandler from 'auth0-lock-meteor/lib/auth0LoginHandler'
import addRolesToLoginHandler from 'auth0-lock-meteor/lib/addRolesToLoginHandler'

Accounts.registerLoginHandler(addRolesToLoginHandler(auth0LoginHandler))
```

### Client
```js
import 'auth0-lock-meteor/lib/client'
```

