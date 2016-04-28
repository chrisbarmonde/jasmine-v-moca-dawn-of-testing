# Jasmine v Mocha: Dawn of Testing

This repo shows some of the differences between Jasmine and Mocha+chai+sinon javascript testing in node, with React or Backbone + underscore.

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


