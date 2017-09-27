import {Roles} from 'meteor/alanning:roles'

function addRolesToLoginHandler(loginHandler) {
  return options => {
    const user = loginHandler(options)
    if (user) {
      const {auth0: {profile: {roles}}} = options
      if (roles) roles.forEach(role => Roles.addUsersToRoles(user, role, {ifExist: true}))
    }
    return user
  }
}

module.exports = addRolesToLoginHandler

