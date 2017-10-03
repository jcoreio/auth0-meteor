import {Meteor} from 'meteor/meteor'
import {Accounts} from 'meteor/accounts-base'

Accounts.oauth.registerService('auth0')
Accounts.addAutopublishFields({
  forLoggedInUser: ['services.auth0'],
  forOtherUsers: [
    'services.auth0.id', 'services.auth0.name'
  ],
})

Meteor.publish('auth0.userData', function () {
  if (this.userId) {
    return Meteor.users.find({ _id: this.userId }, {fields: { 'services.auth0': 1 }})
  } else {
    this.ready()
  }
})

