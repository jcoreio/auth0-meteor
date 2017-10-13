// @flow

// $FlowFixMe
import {Accounts} from 'meteor/accounts-base'

export type Options = {
  idToken?: string,
  username?: string,
  password?: string,
}

export default function loginWithAuth0({idToken, username, password}: Options): Promise<void> {
  return new Promise((resolve: () => void, reject: (error: Error) => void) => {
    Accounts.callLoginMethod({
      methodArguments: [{auth0: {idToken, username, password}}],
      userCallback: (error: ?Error) => {
        if (error) reject(error)
        else resolve()
      },
    })
  })
}

