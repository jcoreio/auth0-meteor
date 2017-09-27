import {Meteor} from 'meteor/meteor'

Meteor.methods({
  'getAuth0Attributes': () => ({
    AUTH0_CLIENTID: process.env.AUTH0_CLIENT_ID || Meteor.settings.AUTH0_CLIENT_ID,
    AUTH0_DOMAIN: process.env.AUTH0_DOMAIN || Meteor.settings.AUTH0_DOMAIN,
  })
})

