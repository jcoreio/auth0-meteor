// @flow

// $FlowFixMe
import {Accounts} from 'meteor/accounts-base'

export type Options = {
  idToken: string,
}

export default function loginWithAuth0({idToken}: Options) {
  Accounts.callLoginMethod({
    methodArguments: [{auth0: {idToken}}]
  })
}

