// @flow

// $FlowFixMe
import {Meteor} from 'meteor/meteor'
// $FlowFixMe
import {Accounts} from 'meteor/accounts-base'
import type {Params} from "./auth0LoginHandler"
import type {LoginHandlerOptions, LoginResult} from "../types"
import auth0LoginHandler from './auth0LoginHandler'
import get from 'lodash.get'

/**
 * Wraps Meteor's builtin resume login handler to additionally fetch and update the user profile from Auth0
 * (and error out if the user no longer exists in Auth0)
 * @param params the same params as passed to auth0LoginHandler
 */
export default function wrapResumeHandler(params: Params) {
  const resumeEntry = Accounts._loginHandlers.find(entry => entry.name === 'resume')
  if (!resumeEntry) throw new Error('missing resume handler in Accounts._loginHandlers')
  const {handler: resumeHandler} = resumeEntry
  const loginWithAuth0UserIdAsync: (auth0UserId: string) => Promise<LoginResult> =
    auth0LoginHandler.createLoginWithAuth0UserId(params)
  const loginWithAuth0UserId: (auth0UserId: string) => LoginResult = Meteor.wrapAsync(
    (auth0UserId: string, callback: (error: ?Error, result?: LoginResult) => any) =>
      loginWithAuth0UserIdAsync(auth0UserId).then(result => callback(null, result), callback)
  )
  resumeEntry.handler = function resumeWithAuth0(options: LoginHandlerOptions): ?LoginResult {
    const result: ?LoginResult = resumeHandler(options)
    if (!result) return result
    const {error, userId} = result
    if (error) return result
    if (!userId) return {type: 'auth0', error: new Error('Missing userId from resume handler')}
    const user = Meteor.users.findOne({_id: userId}, {fields: {'services.auth0.user_id': 1}})
    const auth0UserId = get(user, ['services', 'auth0', 'user_id'])
    if (!auth0UserId) return {type: 'auth0', error: new Error('Missing services.auth0.user_id')}
    try {
      loginWithAuth0UserId(auth0UserId)
      return result
    } catch (error) {
      return {type: 'auth0', error}
    }
  }
}

