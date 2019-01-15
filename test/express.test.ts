import * as express from 'express'
import { AuthzMiddleware } from '../src/express-rbac-authz-middleware'
import * as request from 'supertest'

describe('express middleware', () => {
  const app = express()

  const options = {
    tokenDecoder: (req: any) => ({
      id: '123',
      roles: ['user']
    })
  }

  app.use(AuthzMiddleware(options))
  app.get('/user', (req: any, resp) => {
    req.authz.all('user')
    resp.json({ msg: 'Hello User' })
  })
  app.get('/admin', (req: any, resp) => {
    req.authz.is('admin')
    resp.json({ msg: 'Hello Admin' })
  })
  app.get('/guest', (req, resp) => {
    resp.json({ msg: 'Hello Guest' })
  })

  it('returns ok when guest', async () => {
    const result = await request(app).get('/guest')
    expect(result.status).toEqual(200)
  })

  it('returns ok when authorized', () =>
    request(app)
      .get('/user')
      .expect(200))

  it('returns error when unauthorized', () =>
    request(app)
      .get('/admin')
      .expect(500))
})
