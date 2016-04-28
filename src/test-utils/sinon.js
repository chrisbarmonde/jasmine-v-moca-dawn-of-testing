import sinon from 'sinon';
import _ from 'underscore';


/**
 * Needs to be called like TestUtils.getMochaUtils.call(this)
 * inside of a mocha describe/context block.
 */
export default function() {
    var callbacks = [];
    afterEach(function() {
        _(callbacks).each(function(callback) {
            callback();
        });
    });

    var _sinon = function(func, args) {
        var wrapper = func.apply(sinon, args),
            restored = false;

        callbacks.push(function() {
            if (!restored) {
                wrapper.restore();
                restored = true;
            }
        });

        return wrapper;
    };

    return {
        /**
         * Stubs out a function on a React element. React does a bunch of fancy
         * auto-mocking stuff, so it's a little dumb. Will restore the stub
         * once the current test is finished.
         */
        stubElementFn: function(Element, functionName, stubFunc) {
            // Since this function is auto-bound in componentDidMount, this
            // is apparently how we need to mock it.
            var stub = sinon.stub(Element.prototype, functionName, stubFunc),
                restored = false;

            callbacks.push(function() {
                if (!restored) {
                    stub.restore();
                    restored = true;
                }
            });

            return stub;
        },


        spyElementFn: function(Element, functionName) {
            // Since this function is auto-bound in componentDidMount, this
            // is apparently how we need to mock it.
            var spy = sinon.spy(Element.prototype, functionName),
                restored = false;

            callbacks.push(function() {
                if (!restored) {
                    spy.restore();
                    restored = true;
                }
            });

            return spy;
        },


        /**
         * Stubs out the initial state for a function, allowing you to provide
         * an alternate initial state. Will restore the stub once the current
         * test finishes.
         */
        stubInitialState: function(Element, initialState) {
            Element.prototype._getInitialState = Element.prototype.getInitialState;

            Element.prototype.getInitialState = function() {
                // Even if we discard the data, marty does some fancy initialization crap
                // in getInitialState, so we still need to at least call it.
                if (Element.prototype._getInitialState) {
                    _(initialState).defaults(Element.prototype._getInitialState.call(this));
                }
                return initialState;
            };

            // The things we do for the sake of magic. React will throw
            // warnings if we try to add some functions (like this one)
            // after React.createClass() has already been called.
            Element.prototype.getInitialState.displayName = Element.displayName + '_getInitialState';
            Element.prototype.getInitialState.isReactClassApproved = {};

            var restored = false;
            callbacks.push(function() {
                if (!restored) {
                    Element.prototype.getInitialState = Element.prototype._getInitialState;
                    restored = true;
                }
            });
        },

        /**
         * A wrapper for sinon.stub() that will restore the stub as soon
         * as the current test finishes so you don't have to remember to
         * restore your state yourself.
         */
        stub: function() {
            return _sinon(sinon.stub, arguments);
        },

        spy: function() {
            return _sinon(sinon.spy, arguments);
        },
    };
};
