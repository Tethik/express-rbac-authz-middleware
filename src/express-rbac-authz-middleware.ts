import { Request, Response, NextFunction } from 'express'

interface AuthzMiddlewareUser {
  id: string
  roles: any[]
}

export interface AuthzMiddlewareOptions {
  tokenDecoder: (req: Request) => AuthzMiddlewareUser
}

export function AuthzMiddleware(options: AuthzMiddlewareOptions) {
  const authz = new Authz(options)
  return (req: Request, resp: Response, next: NextFunction) => {
    authz.handleRequest(req)
    next()
  }
}

export class Authz {
  options: AuthzMiddlewareOptions

  constructor(options: AuthzMiddlewareOptions) {
    this.options = options
  }

  public handleRequest(req: Request) {
    const user = this.options.tokenDecoder(req)
    req.authz = new CurrentAuthz(user)
  }
}

export class AuthzError extends Error {}

export class CurrentAuthz {
  public user: AuthzMiddlewareUser
  public check: Checks

  constructor(user: AuthzMiddlewareUser) {
    this.user = user
    this.check = new Checks(user)
  }

  public any<Role>(...roles: Role[]) {
    if (!this.check.any(...roles)) throw new AuthzError()
  }

  public all<Role>(...roles: Role[]) {
    if (!this.check.all(...roles)) throw new AuthzError()
  }

  public is<Role>(role: Role) {
    if (!this.check.is(role)) throw new AuthzError()
  }
}

class Checks {
  user: AuthzMiddlewareUser

  constructor(user: AuthzMiddlewareUser) {
    this.user = user
  }

  public any<Role>(...roles: Role[]) {
    if (roles.length === 0) return true
    for (let i = 0; i < roles.length; i++) {
      if (this.user.roles.indexOf(roles[i]) > -1) return true
    }
    return false
  }

  public all<Role>(...roles: Role[]) {
    return roles.every(role => this.is(role))
  }

  public is<Role>(role: Role) {
    return this.user.roles.includes(role)
  }
}
