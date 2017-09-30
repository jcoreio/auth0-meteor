// @flow

import type {UserProfile} from '../types'
import type {UserUpdater} from './auth0LoginHandler'
import ensureUserInRoles from "./ensureUserInRoles"

type Options = {
  getRoles?: (profile: UserProfile) => ?Array<string>,
}

export default function rolesUpdater(options: Options = {}): UserUpdater {
  const getRoles = options.getRoles || ((profile: UserProfile) => profile.app_metadata && profile.app_metadata.roles)

  return (_id: string, profile: UserProfile) => {
    const roles = getRoles(profile) || []
    ensureUserInRoles(_id, roles, {deleteOthers: true})
  }
}

