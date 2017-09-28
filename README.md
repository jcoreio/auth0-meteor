# auth0-meteor

[![Build Status](https://travis-ci.org/jcoreio/auth0-meteor.svg?branch=master)](https://travis-ci.org/jcoreio/auth0-meteor)
[![Coverage Status](https://codecov.io/gh/jcoreio/auth0-meteor/branch/master/graph/badge.svg)](https://codecov.io/gh/jcoreio/auth0-meteor)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

Auth0 integration with Meteor Accounts

## Usage

```sh
meteor add accounts accounts-oauth
npm install --save auth0-js auth0-meteor
```

### Server
Make sure you provide the `AUTH0_CLIENT_ID` and `AUTH0_DOMAIN` environment variables (or put them in `Meteor.settings`).

```js
import {Accounts} from 'meteor/accounts-base'
import 'auth0-meteor/lib/server'
import auth0LoginHandler from '@jcoreio/auth0-meteor/lib/server/auth0LoginHandler'

Accounts.registerLoginHandler(auth0LoginHandler)
```

#### `alanning:roles` v2.0 support
```js
import auth0LoginHandler from '@jcoreio/auth0-meteor/lib/server/auth0LoginHandler'
import addRolesToLoginHandler from '@jcoreio/auth0-meteor/lib/server/addRolesToLoginHandler'

Accounts.registerLoginHandler(addRolesToLoginHandler(auth0LoginHandler))
```

### Client
```js
import Auth from '@jcoreio/auth0-meteor/lib/client/Auth'

const auth = new Auth({
  clientID: process.env.AUTH0_CLIENT_ID,
  domain: process.env.AUTH0_DOMAIN,
  ...
})

// to begin login, run:
auth.authorize()

// to logout:
auth.logout()

// in your callback route, run:
auth.handleAuthentication()
```

