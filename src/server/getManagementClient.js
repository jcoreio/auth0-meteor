// @flow

import superagent from 'superagent'
// $FlowFixMe
import {ManagementClient} from 'auth0'
import memoize from 'lodash.memoize'

type Options = {
  clientId: string,
  clientSecret: string,
  domain: string,
}

const getCachedClient: (clientId: string) => (options: Options) => Promise<ManagementClient> = memoize((clientId: string) => {
  let client: ?ManagementClient
  let refresh_at: ?number

  return async ({domain, clientSecret}: Options): Promise<ManagementClient> => {
    if (!client || refresh_at == null || refresh_at < Date.now()) {
      const {body: {access_token, expires_in}} = await superagent.post(`https://${domain}/oauth/token`)
        .type('application/json')
        .send({
          client_id: clientId,
          client_secret: clientSecret,
          audience: `https://${domain}/api/v2/`,
          grant_type: 'client_credentials',
        })
      refresh_at = Date.now() + Math.floor(expires_in * 0.9) * 60000
      client = new ManagementClient({token: access_token, domain})
    }

    return client
  }
})

export default function getManagementClient(options: Options): Promise<ManagementClient> {
  return getCachedClient(options.clientId)(options)
}
