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
```js
import {Accounts} from 'meteor/accounts-base'
import 'auth0-meteor/lib/server'
import auth0LoginHandler from '@jcoreio/auth0-meteor/lib/server/auth0LoginHandler'
import wrapResumeHandler from '@jcoreio/auth0-meteor/lib/server/wrapResumeHandler'

const auth0Params = {
  clientId: process.env.AUTH0_MANAGEMENT_CLIENT_ID,
  clientSecret: process.env.AUTH0_MANAGEMENT_CLIENT_SECRET,
  domain: process.env.AUTH0_DOMAIN,
  audience: process.env.AUTH0_FRONTEND_CLIENT_ID,
}

Accounts.registerLoginHandler(auth0LoginHandler(auth0Params))
wrapResumeHandler(auth0Params)
```

#### `alanning:roles` v2.0 support
```js
import auth0LoginHandler from '@jcoreio/auth0-meteor/lib/server/auth0LoginHandler'
import rolesUpdater from '@jcoreio/auth0-meteor/lib/server/rolesUpdater'

Accounts.registerLoginHandler(auth0LoginHandler({
  ...
  updaters: [rolesUpdater({
    getRoles: (_id, profile) => profile.app_metadata && profile.app_metadata.roles, // default value
  })]
}))
```

#### Syncing to user.profile

The following will copy `auth0profile.user_metadata.theme` to `meteorUser.profile.theme` and
`auth0profile.app_metadata.location` to `meteorUser.profile.location`.

```js
import auth0LoginHandler from '@jcoreio/auth0-meteor/lib/server/auth0LoginHandler'
import profileUpdater from '@jcoreio/auth0-meteor/lib/server/profileUpdater'

Accounts.registerLoginHandler(auth0LoginHandler({
  ...
  updaters: [profileUpdater({
    fields: {
      theme: 'user_metadata.theme',
      location: 'app_metadata.location',
    },
  })]
}))
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

// to subscribe to `services.auth0` data for the logged-in user:
import {Meteor} from 'meteor/meteor'
Meteor.subscribe('auth0.userData')

// to log in manually with username/password:
import loginWithAuth0 from '@jcorieo/auth0-meteor/lib/client/loginWithAuth0'
loginWithAuth0({username, password}).then(onResolved, onRejected)
```

