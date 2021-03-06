# Jasmine v Mocha: Dawn of Testing

This repo shows some of the differences between Jasmine and Mocha+Chai+Sinon (MCS) javascript testing in node, with React or Backbone + underscore.

## Structure of this Repository

This repo is built to test four different sets of tests (see the `package.json` `scripts` directive):

- Mocha + React
- Mocha + Backbone/jQuery
- Jasmine + React
- Jasmine + Backbone/jQuery

In the `src/` directory, you'll find the source code for the React and Backbone components. It's just a fairly simple timestamp component that updates every minute with human readable 'x minutes ago' style output. I also added some functionality that makes an AJAX/fetch request when the element is clicked, so we can arbitrarily test event and network handling.

Also note that while React essentially combines the DOM and the Javascript, the Backbone test is using Underscore templating in a separate HTML file for its DOM. The big difference, testing-wise, is that you'll need to read the HTML file in manually in your test. This is obviously a shortcut I took for this demo and there are many, many ways of approaching it differently.

The Mocha tests reside in the `mocha/` directory. You'll see `backbone.opts` and `react.opts` files that are used as config files for Mocha to run either the Backbone or React versions of the tests. These wire things up a little bit differently using the bootstrapping files in the `mocha/bootstrap/` directory.

The Jasmine tests reside in the `jasmine/` directory. You'll see `backbone.json` and `react.json` files that are used as config files for Jasmine to run either the Backbone or React versions of the tests. These wire things up a little bit differently using the bootstrapping files in the `jasmine/(react|backbone)/helpers/` directories.


## Before You Start

Here are links to all the primary technologies used in this demo:

- [Mocha](http://mochajs.org/)
- [Chai](http://chaijs.com/)
- [Sinon](http://sinonjs.org/)
- [Jasmine](http://jasmine.github.io/2.4/introduction.html)
- [React](http://facebook.github.io/react/)
- [Backbone](http://backbonejs.org/)
- [Underscore](http://underscorejs.org/)
- [jsdom](https://github.com/tmpvar/jsdom)

There is no web-facing version of these tests or the base components as this was a demo for node only. Because of that, `jsdom` is a prerequisite for all tests in order for node to have a DOM to work with. You'll see it bootstrapped in all the tests, and you can read its documentation to discover all its functionality. But for our purposes, we're just injecting and empty body and letting our tests handle injecting the DOM as necessary. (In the case of React, React's TestUtils take care of this with its shallow renderer and renderIntoDocument functionality. For Backbone, we use jQuery to manually apply and empty DOM using `.html()/.empty()` on the body element).

A last note: This was developed with node v5.3.0 and I believe you'll need at least v4.x in order for the latest versions of `jsdom` to work.

## Running the Tests

The tests are all run via npm:
- `npm run test-mocha-react`
- `npm run test-mocha-backbone`
- `npm run test-jasmine-react`
- `npm run test-jasmine-backbone`

See the `package.json` file for more info on how these are instrumented.

## Syntax Comparison

There is more or less a direct one-to-one correlation in functionality between Jasmine and MCS, and in many cases, the syntax is identical. The biggest differences appear in the way spies work, as Sinon and Jasmine tend to use their own set of vocabulary to define how they work. But, functionally, they have APIs that do the same things.

### Creating Tests

| syntax | Jasmine | Mocha |
| ------ | ------- | ----- |
| Create test suite | `define("Test Suite", () => {})` | `define("Test Suite", () => {})` |
| before each test | `beforeEach(() => {})` | `beforeEach(() => {})` |
| after each test | `afterEach(() => {})` | `afterEach(() => {})` |
| before suite | `beforeAll(() => {})` | `before(() => {})` |
| after suite | `afterAll(() => {})` | `after(() => {})` |
| Create test | `it("tests something", () => {})` | `it("tests something", () => {})` |
| Create async test | `it("tests something", (done) => { done(); }` | `it("tests something", (done) => { done(); }` |
| Isolate test | `fit("tests something", () => {})` | `it.only("tests something", () => {})` |
| Isolate suite | `fdefine("tests something", () => {})` | `define.only("tests something", () => {})` |
| Skip test | `xit("tests something", () => {})` | `it.skip("tests something", () => {})` |
| Skip suite | `xdefine("tests something", () => {})` | `define.skip("tests something", () => {})` |

### Assertions

| syntax | Jasmine | Chai |
| ------ | ------- | ---- |
| === | `expect(x).toBe(y)` | `x.should.equal(y)` |
| | | `expect(x).to.equal(y)` |
| == | `expect(x).toEqual(y)` | `x.should.eql(y)` |
| | | `expect(x).to.eql(y)` |
| undefined | `expect(x).toBeDefined()` | `should.exist(x)` |
| | | `expect(x).to.exist()` |
| | `expect(x).not.toBeDefined()` | `should.not.exist(x)` |
| | | `expect(x).to.not.exist()` |
| truthiness | `expect(x).toBeTruthy()` | `x.should.be.ok` |
| | | `expect(x).to.be.ok` |
| | `expect(x).toBeFalsy()` | `x.should.not.be.ok` |
| | | `expect(x).to.not.be.ok` |
| contains | `expect(x).toContain(y)` | `x.should.contain(y)` |
| | | `expect(x).to.contain(y)` |
| errors | `expect(x).toThrowError(y)` | `x.should.throw(y)` |
| | | `expect(x).to.throw(y)` |


### Spies/Stubs/Mocks

| syntax | Jasmine | Sinon |
| ------ | ------- | ---- |
| Sandboxing (automatic spy cleanup) | Built-in | `var sandbox = sinon.sandbox.create(); sandbox.restore();`
| Stub | `spyOn(x, 'func')` | `sinon.stub(x, 'func')` |
| Spy | `spyOn(x, 'func').and.callThrough()` | `sinon.spy(x, 'func')` |
| Mock return value | `spyOn(x, 'func').and.returnValue(y)` | `sinon.stub(x, 'func', () => y)` |
| | `spyOn(x, 'func').and.callFake(() => y)` | |
| Reset spy | `spy.calls.reset()` | `spy.reset()` |
| Restore spy | Built-in | `spy.restore()` (only if not using sandbox) |
| Get return value | `spy.calls.first().returnValue` | `spy.returnValues[0]` |
| Check call count | `spy.calls.count()` | `spy.callCount` |
| Assert called | `expect(spy).toHaveBeenCalled()` | `spy.called.should.be.true` |
| Assert call count | `expect(spy).toHaveBeenCalledTimes(2)` | `spy.callCount.should.equal(2)` |
| Assert call args | `expect(spy).toHaveBeenCalledWith(y, z)` | `spy.calledWith(y, z).should.be.true` |
| | | (Note that Sinon has its own assertion library, but for our purposes, we'll just continue using Chai to be consistent.) |


### Clock Testing
| syntax | Jasmine | Sinon |
| ------ | ------- | ---- |
| Start | `jasmine.clock().install()` | `let clock = sinon.useFakeTimers()` |
| Stop | `jasmine.clock().uninstall()` | `clock.restore()` |
| Tick | `jasmine.clock().tick(1000)` | `clock.tick(1000)` |


## Testing AJAX/fetch
Perhaps the largest divergence comes in how you test AJAX or fetch calls between the two, as there are some bizarre differences in which libraries do or don't work.

### fetch
If you use React, odds are you don't need to use jQuery since most of its functionality (query selectors, primarily) aren't very useful in the React world. In that case, you'll also be losing `$.ajax`. But in 99% of cases, it'll be much easier to use `fetch` instead.

See [Using Fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch) for details on the API, but it's essentially a promise-based, light-weight alternative to `XMLHTTPRequest` that will work for almost all generic REST-y requests. While the API is fully-implemented in Chrome, you'll likely need a [polyfill](https://github.com/github/fetch) for other browsers.

With that out of the way, in order to test fetch in node, the easiest way is to use the npm libary [Nock](https://www.npmjs.com/package/nock). As you can see in the docs, it has a ton of configuration for how to create your tests. The big thing to note, however, is that it can only intercept requests that use node's `http` library underneath, which the above polyfill will do.

### $.ajax and Mocha
When it comes to using jQuery and `$.ajax` with Mocha, your best bet for testing will be [Mockjax](https://github.com/jakerella/jquery-mockjax). It has most of the same features as Nock, but works with XMLHTTPRequest calls, and I believe it specifically hooks into `$.ajax`.

### $.ajax and Jasmine
For god knows what reason, Mockjax doesn't work inside of Jasmine. I'm sure there's a method to the madness, but I didn't have time to research it.

Fortunately, Jasmine has their own ajax testing plugin, [Jasmine AJAX](https://github.com/jasmine/jasmine-ajax). It works well, but it's unfortunately a bit behind the other two in terms of ease-of-use. You'll have to do a lot of manual setup without the ability to set defaults or anything without baking that all in yourself.


## Reporters
Mocha comes with a [vast array of built-in reporters](http://mochajs.org/#reporters), some more useful than others, but all pretty interesting.

Jasmine, as far as I can tell, just has the dot reporter as its default for node. You have the ability to [create your own custom reporters](http://jasmine.github.io/2.4/custom_reporter.html) (which Mocha also supports), but it doesn't seem like any others are baked in.

## Conclusion
The real conclusion?

`¯\_(ツ)_/¯`

All things considered, the two pretty much live in parity with one another. It ultimately just depends on what your team likes best. Jasmine is an all-in-one package that includes everything out of the box, but Mocha is built to be more of an ecosystem that allows other developers to inject whatever they feel is best.

I personally prefer the syntax of Chai's assertions in a BDD environment as they feel more like real sentences than calling a bunch of functions in Jasmine.
