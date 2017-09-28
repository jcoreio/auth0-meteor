// @flow

// $FlowFixMe
import {Accounts} from 'meteor/accounts-base'

import type {UserProfile} from '../types'

export type Options = {
  profile: UserProfile,
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

