// @flow

// $FlowFixMe
import {Accounts} from 'meteor/accounts-base'

export type Options = {
  profile: Object,
  token: string,
}

export default function loginWithAuth0({profile, token}: Options) {
  Accounts.callLoginMethod({
    methodArguments: [{
      auth0: {
        profile,
        token
      }
    }]
  })
}

