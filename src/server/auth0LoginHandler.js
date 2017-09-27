import {Meteor} from 'meteor/meteor'
import {Accounts} from 'meteor/accounts-base'

function auth0LoginHandler(options) {
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

  const {profile, token} = auth0

  // Do nothing if the profile is not received.
  if (!profile || !profile.user_id) return null

  // Accounts.updateOrCreateUserFromExternalService
  // expects the unique user id to be stored in the 'id'
  // property of serviceData.
  profile.id = profile.user_id

  // Run the Accounts method to store the profile and
  // optional data (token) in Meteor users collection.
  return Accounts.updateOrCreateUserFromExternalService("auth0", profile, token)
}

module.exports = auth0LoginHandler

