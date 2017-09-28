// @flow

// $FlowFixMe
import {Meteor} from 'meteor/meteor'
// $FlowFixMe
import {WebAuth, Management} from 'auth0-js'
import loginWithAuth0 from './loginWithAuth0'

import type {UserProfile} from '../types'

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
      const {accessToken, idToken} = authResult
      if (accessToken && idToken) {
        this.client.userInfo(accessToken, (err: ?Error, userInfo?: Object) => {
          if (err) return callback(err)
          if (!userInfo) return callback(new Error('missing userInfo'))
          const {sub} = userInfo
          if (!sub) return callback(new Error('missing userInfo.sub'))
          const manage = new Management({domain: this.params.domain, token: idToken})
          manage.getUser(sub, (err: ?Error, profile?: UserProfile) => {
            if (err) return callback(err)
            if (!profile) return callback(new Error('missing profile'))
            loginWithAuth0({profile, token: accessToken})
            if (callback) callback(null)
          })
        })
      } else {
        return callback(new Error('mising accessToken or idToken'))
      }
    })
  }

  logout() {
    Meteor.logout()
    const {clientID} = this.params
    this.webAuth.logout({clientID})
  }
}
