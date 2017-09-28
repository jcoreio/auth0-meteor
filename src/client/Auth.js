// @flow

// $FlowFixMe
import {Meteor} from 'meteor/meteor'
import {WebAuth, Management} from 'auth0-js'
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

export default class Auth {
  webAuth: WebAuth
  management: Management
  params: Params

  constructor(params: Params) {
    this.params = params
    this.webAuth = new WebAuth(params)
    this.management = new Management(params)
  }

  handleAuthentication(callback?: (err: ?Error) => any) {
    this.webAuth.parseHash((err: ?Error, authResult?: AuthResult) => {
      if (err) {
        if (callback) callback(err)
        return
      }
      if (!authResult) {
        if (callback) callback(new Error('missing authResult'))
        return
      }
      const {accessToken, idToken} = authResult
      if (accessToken && idToken) {
        this.webAuth.client.userInfo(accessToken, (err: ?Error, profile?: Object) => {
          if (err) {
            if (callback) callback(err)
            return
          }
          if (!profile) {
            if (callback) callback(new Error('missing profile'))
            return
          }
          loginWithAuth0({profile, token: accessToken})
          if (callback) callback(null)
        })
      } else {
        if (callback) callback(new Error('mising accessToken or idToken'))
      }
    })
  }

  logout() {
    Meteor.logout()
    const {clientID} = this.params
    this.webAuth.logout({clientID})
  }
}
