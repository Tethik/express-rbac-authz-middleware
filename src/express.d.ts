import { CurrentAuthz } from './express-rbac-authz-middleware'

declare global {
  namespace Express {
    interface Request {
      authz?: CurrentAuthz
    }
  }
}
