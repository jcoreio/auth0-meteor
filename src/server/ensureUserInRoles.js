// @flow

// $FlowFixMe
import {Roles} from 'meteor/alanning:roles'
import difference from 'lodash.difference'

export default function ensureUserInRoles(
  user: string | {_id: string},
  roles: string | Array<string>,
  options: {
    deleteOthers?: boolean,
    scope?: string,
    handleError?: (error: Error) => any,
  } = {}
) {
  const rolesArray = Array.isArray(roles) ? roles : [roles]

  const handleError = options.handleError || ((error: Error) => { throw error }) // eslint-disable-line no-console

  const scope = options.scope || null

  if (options.deleteOthers) {
    const priorRoles = Roles.getRolesForUser(user, {scope, onlyAssigned: true})
    const rolesToRemove = difference(priorRoles, rolesArray)
    if (rolesToRemove.length) {
      try {
        Roles.removeUsersFromRoles(user, rolesToRemove, {scope})
      } catch (error) {
        handleError(error)
      }
    }
  }

  try {
    Roles.addUsersToRoles(user, rolesArray, {scope})
  } catch (error) {
    handleError(error)
  }
}

