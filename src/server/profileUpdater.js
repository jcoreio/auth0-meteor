// @flow

// $FlowFixMe
import {Meteor} from 'meteor/meteor'
import type {UserProfile} from '../types'
import type {UserUpdater} from './auth0LoginHandler'
import get from 'lodash.get'
import size from 'lodash.size'

type Options = {
  fields: {[name: string]: string},
}

export default function profileUpdater({fields}: Options = {}): UserUpdater {
  return (_id: string, profile: UserProfile) => {
    const $set = {}
    const $unset = {}
    for (let key in fields) {
      const value = get(profile, fields[key])
      if (value === undefined) $unset[`profile.${key}`] = ''
      else $set[`profile.${key}`] = value
    }
    const updates = {}
    if (size($set)) updates.$set = $set
    if (size($unset)) updates.$unset = $unset
    if (size(updates)) Meteor.users.update({_id}, updates)
  }
}

