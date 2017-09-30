// @flow

// $FlowFixMe
import {Meteor} from 'meteor/meteor'

export type UserProfile = {
  email?: string,
  user_id: string,
  picture?: string,
  nickname?: string,
  created_at: string,
  updated_at: string,
  last_login: string,
  name: string,
  user_metadata?: Object,
  app_metadata?: Object,
}

export type LoginResult = {
  type: string,
  userId?: string,
  error?: Error | Meteor.Error,
}

export type LoginHandlerOptions = {
  auth0?: {
    accessToken: string,
    idToken: string,
  },
}

export type LoginHandler = (options: LoginHandlerOptions) => ?LoginResult

