// @flow

import Auth0Lock from 'auth0-lock'
// $FlowFixMe
import {Meteor} from 'meteor/meteor'
import loginWithAuth0 from './loginWithAuth0'

export default class Lock extends Auth0Lock {
  constructor(clientId: string, domain: string, options?: Object = {}) {
    super(clientId, domain, options)
    this.on('authenticated', this.handleAuthenticated)
  }

  logout() {
    Meteor.logout()
    super.logout()
  }

  handleAuthenticated = (token: string) => {
    this.getUserInfo(token, (error: ?Error, profile: ?Object) => {
      if (!error && profile) {
        loginWithAuth0({profile, token})
      }
    })
  }
}
