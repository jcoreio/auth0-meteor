// @flow

// $FlowFixMe
import {Meteor} from 'meteor/meteor'
// $FlowFixMe
import {Accounts} from 'meteor/accounts-base'
import jwt from 'jsonwebtoken'
import createJwksClient from 'jwks-rsa'
import promisify from 'es6-promisify'

import type {UserProfile, LoginResult, LoginHandlerOptions, LoginHandler} from '../types'
import getManagementClient from "./getManagementClient"

export type UserUpdater = (_id: string, profile: UserProfile) => any

export type Params = {
  clientId: string,
  clientSecret: string,
  domain: string,
  audience?: string,
  jwksClientOptions?: {
    jwksUri: string,
    strictSsl?: boolean,
    cache?: boolean,
    cacheMaxAge?: number,
    rateLimit?: boolean,
    jwksRequestsPerMinute?: number,
  },
  updaters?: Array<UserUpdater>,
}

function createLoginWithAuth0UserId(params: Params): (auth0UserId: string) => Promise<LoginResult> {
  const {clientId, clientSecret, domain} = params
  const updaters = params.updaters || []

  return async function loginWithAuth0UserId(auth0UserId: string): Promise<LoginResult> {
    const mgmtClient = await getManagementClient({clientId, clientSecret, domain})
    const profile: UserProfile = await mgmtClient.users.get({id: auth0UserId})
    const {updated_at, created_at, last_login} = profile

    const parsedProfile = {
      ...profile,
      created_at: new Date(created_at),
      updated_at: new Date(updated_at),
      last_login: new Date(last_login),
    }

    const user = Meteor.users.findOne(
      {'services.auth0.user_id': auth0UserId},
      {fields: {_id: 1, 'services.auth0.updated_at': 1}}
    )
    let userId
    if (user) {
      userId = user._id
      if (user.services.auth0.updated_at < parsedProfile.updated_at) {
        Meteor.users.update(
          {_id: user._id},
          {$set: {'services.auth0': parsedProfile}}
        )
        updaters.forEach(updater => updater(user._id, profile))
      }
    } else {
      userId = Meteor.users.insert({services: {auth0: parsedProfile}})
      updaters.forEach(updater => updater(userId, profile))
    }
    return {type: 'auth0', userId}
  }
}

function auth0LoginHandler(params: Params): LoginHandler {
  const {clientId, clientSecret, domain, updaters, audience} = params

  const jwksClient = createJwksClient(params.jwksClientOptions || {
    strictSsl: true,
    cache: true,
    cacheMaxAge: 36000000,
    rateLimit: true,
    jwksRequestsPerMinute: 10,
    jwksUri: `https://${domain}/.well-known/jwks.json`,
  })

  const loginWithAuth0UserId = createLoginWithAuth0UserId({clientId, clientSecret, domain, updaters})

  async function handler(options: LoginHandlerOptions): Promise<?LoginResult> {
    const {auth0} = options
    if (!auth0) return undefined // Do not handle

    if (Accounts.oauth.serviceNames().indexOf('auth0') < 0) {
      // If the auth0 service was removed from serviceConfiguration
      return {
        type: "auth0",
        error: new Error("No registered oauth service found for: Auth0")
      }
    }

    const {idToken} = auth0
    if (!idToken) return {type: 'auth0', error: new Error('missing idToken')}

    try {
      const {header, payload} = jwt.decode(idToken, {complete: true})
      const {publicKey} = await promisify(jwksClient.getSigningKey)(header.kid)
      jwt.verify(idToken, publicKey, {
        audience,
        issuer: `https://${domain}/`,
      })

      const {sub: auth0UserId} = payload
      if (!auth0UserId) return {type: 'auth0', error: new Error('missing sub in decoded idToken')}

      return await loginWithAuth0UserId(auth0UserId)
    } catch (error) {
      console.error(error.stack) // eslint-disable-line no-console
      return {type: 'auth0', error}
    }
  }

  return Meteor.wrapAsync(
    (options, callback) => handler(options).then(result => callback(null, result), callback)
  )
}
auth0LoginHandler.createLoginWithAuth0UserId = createLoginWithAuth0UserId

module.exports = auth0LoginHandler

