// @flow

// $FlowFixMe
import {Meteor} from 'meteor/meteor'
// $FlowFixMe
import {Accounts} from 'meteor/accounts-base'

import type {UserProfile} from '../types'

type Options = {
  auth0?: {
    profile?: UserProfile,
    token?: string,
  },
}

function auth0LoginHandler(options: Options): any {
  const {auth0} = options
  if (!auth0) return undefined // Do not handle

  if (Accounts.oauth.serviceNames().indexOf('auth0') < 0) {
    // If the auth0 service was removed from serviceConfiguration
    return {
      type: "auth0",
      error: new Meteor.Error(
        Accounts.LoginCancelledError.numericError,
        "No registered oauth service found for: Auth0")
    }
  }

  const {profile} = auth0

  // Do nothing if the profile is not received.
  if (!profile) return null
  const {user_id} = profile
  if (!user_id) return null

  // Run the Accounts method to store the profile and
  // optional data (token) in Meteor users collection.
  return Accounts.updateOrCreateUserFromExternalService(
    "auth0",
    {...profile, id: user_id},
    {profile}
  )
}

module.exports = auth0LoginHandler

