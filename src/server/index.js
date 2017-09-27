import {Accounts} from 'meteor/accounts-base'
import './methods'

Accounts.oauth.registerService('auth0')
Accounts.addAutopublishFields({
  forLoggedInUser: ['services.auth0'],
  forOtherUsers: [
    'services.auth0.id', 'services.auth0.name'
  ],
})

