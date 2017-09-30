// @flow

// $FlowFixMe
import {Meteor} from 'meteor/meteor'
// $FlowFixMe
import {WebAuth} from 'auth0-js'
import loginWithAuth0 from './loginWithAuth0'

export type Params = {
  domain: string,
  clientID: string,
  redirectUri?: string,
}

type AuthResult = {
  accessToken?: string,
  idToken?: string,
}

export default class Auth extends WebAuth {
  params: Params

  constructor(params: Params) {
    super(params)
    this.params = params
  }

  handleAuthentication(callback?: (err: ?Error) => any = () => {}) {
    this.parseHash((err: ?Error, authResult?: AuthResult) => {
      if (err) return callback(err)
      if (!authResult) return callback(new Error('missing authResult'))
      const {idToken} = authResult
      if (idToken) {
        loginWithAuth0({idToken})
        if (callback) callback(null)
      } else {
        return callback(new Error('missing idToken'))
      }
    })
  }

  logout() {
    Meteor.logout()
    const {clientID} = this.params
    this.webAuth.logout({clientID})
  }
}
