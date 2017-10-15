// @flow

// $FlowFixMe
import {Accounts} from 'meteor/accounts-base'

export type Options = {
  idToken?: string,
  username?: string,
  password?: string,
  userCallback?: (error: ?Error) => any,
}

export default function loginWithAuth0({idToken, username, password, userCallback}: Options) {
  Accounts.callLoginMethod({
    methodArguments: [{auth0: {idToken, username, password}}],
    userCallback,
  })
}

