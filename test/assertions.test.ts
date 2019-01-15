import {
  AuthzMiddlewareOptions,
  Authz,
  AuthzError
} from '../src/express-rbac-authz-middleware'

describe('Roles as enum test', () => {
  enum Roles {
    Admin = 1,
    User = 2,
    Support = 3
  }

  const options: AuthzMiddlewareOptions = {
    tokenDecoder: req => ({
      id: '123',
      roles: [Roles.Admin, Roles.Support]
    })
  }

  const authz = new Authz(options)
  const req: any = {}
  authz.handleRequest(req)

  // all
  it('assert all works with empty', () => {
    req.authz.all()
  })
  it('assert all works', () => {
    req.authz.all(Roles.Admin, Roles.Support)
  })
  it('assert all fails if missing', () => {
    expect(() => req.authz.all(Roles.Admin, Roles.User)).toThrowError()
  })

  // any
  it('assert any works with empty', () => {
    req.authz.any()
  })
  it('assert any works', () => {
    req.authz.any(Roles.User, Roles.Admin)
  })
  it('assert any fails if missing', () => {
    expect(() => req.authz.all(Roles.User)).toThrowError()
  })

  // is
  it('assert is works', () => {
    req.authz.is(Roles.Admin)
  })
  it('assert is fails if missing', () => {
    expect(() => req.authz.is(Roles.User)).toThrowError()
  })
})

describe('Role as string test', () => {
  const options: AuthzMiddlewareOptions = {
    tokenDecoder: req => ({
      id: '123',
      roles: ['Admin', 'Support']
    })
  }

  const authz = new Authz(options)
  const req: any = {}
  authz.handleRequest(req)

  // all
  it('assert all works with empty', () => {
    req.authz.all()
  })
  it('assert all works', () => {
    req.authz.all('Admin', 'Support')
  })
  it('assert all fails if missing', () => {
    expect(() => req.authz.all('Admin', 'User')).toThrowError()
  })

  // any
  it('assert any works with empty', () => {
    req.authz.any()
  })
  it('assert any works', () => {
    req.authz.any('User', 'Admin')
  })
  it('assert any fails if missing', () => {
    expect(() => req.authz.any('User')).toThrowError()
  })

  // is
  it('assert is works', () => {
    req.authz.is('Admin')
  })
  it('assert is fails if missing', () => {
    expect(() => req.authz.is('User')).toThrowError()
  })
})
