import {Roles} from 'meteor/alanning:roles'

import type {UserProfile} from '../types'

type Options = {
  auth0?: {
    profile?: UserProfile,
  }
}

function addRolesToLoginHandler(loginHandler) {
  return (options: Options) => {
    const {auth0} = options
    const user = loginHandler(options)
    if (user && auth0) {
      const {profile} = auth0
      if (!profile) return user
      const {roles} = profile
      if (!Array.isArray(roles)) return user
      roles.forEach(role => Roles.addUsersToRoles(user, role, {ifExist: true}))
    }
    return user
  }
}

module.exports = addRolesToLoginHandler

