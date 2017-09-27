// @flow

// $FlowFixMe
import {Meteor} from 'meteor/meteor'
import Lock from './Lock'

if (Meteor.isClient) {
  Meteor.startup(() => {
    Meteor.call('getAuth0Attributes', function (error: ?Error, res?: Object) {
      if (!res.AUTH0_CLIENTID || !res.AUTH0_DOMAIN) return
      new Lock(res.AUTH0_CLIENTID, res.AUTH0_DOMAIN)
    })
  })
}

