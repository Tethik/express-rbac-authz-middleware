// Import here Polyfills if needed. Recommended core-js (npm i -D core-js)
// import "core-js/fn/array.find"
// ...
interface AuthzMiddlewareOptions {}

export default class DummyClass {
  options: AuthzMiddlewareOptions

  constructor(options: AuthzMiddlewareOptions) {
    this.options = options
  }
}
