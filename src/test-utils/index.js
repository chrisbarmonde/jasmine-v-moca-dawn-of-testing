import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import _ from 'underscore';
import SinonUtils from './sinon';


TestUtils.Sinon = SinonUtils;


/**
 * Unmounts a component rendered with TestUtils.renderIntoDocument. By default,
 * these components are never unmounted and never fire off their unmounting
 * logic since renderIntoDocument renders them into a detached DOM node.
 *
 * This is ABSOLUTELY NECESSARY if you are testing MARTY CONTAINERS. The containers
 * rely on unmounting to dispose their observers. If those observers aren't disposed,
 * you'll be introducing bizarre side-effects down the test line.
 */
TestUtils.unmountComponent = function(component) {
    return ReactDOM.unmountComponentAtNode(ReactDOM.findDOMNode(component).parentNode);
};


/**
 * Returns all the text data from the results of the shallow renderer.
 * This is useful if you just want to assert some text string exists
 * without navigating the murky waters of DOM nodes, especially if
 * there are <strongs> and whatever breaking up the flow of the text.
 *
 * It will strip beginning/trailing white space and also reduce all
 * other spaces down to a max of one at a time.
 */
TestUtils.getTextFromComponent = function(component, isRecursing) {
    var text = '';
    if (component.props && component.props.children) {
        if (_.isArray(component.props.children)) {
            text = _(component.props.children).reduce(function(memo, child) {
                if (child) {
                    if (!_.isObject(child)) {
                        return memo + child;
                    } else if (child.props) {
                        return memo + TestUtils.getTextFromComponent(child, true);
                    }
                }

                return memo;
            }, '').replace(/\s+/g, ' ');
        } else {
            text = TestUtils.getTextFromComponent(component.props.children, true);
        }
    } else if (!_.isObject(component)) {
        text = component;
    }

    return (isRecursing) ? text : text.trim();
};


/**
 * es6-promises allow chaining of promise results. However, if you
 * add a .then or whatever outside of another chain, it will start a
 * new chain. I don't know if this is the actual spec, but what it means
 * is that testing the results of a full promise chain can be difficult
 * because it does a breadth-first traversal of the chains, so your
 * new callback will be called before the other chain finishes.
 *
 * This function will allow you to find the last part of the first
 * chain on a promise and add new test functions to the end to
 * validate results.
 */
TestUtils.tailPromise = function(promise) {
    while (promise._subscribers && promise._subscribers.length) {
        promise = promise._subscribers[0];
    }

    return promise;
};


TestUtils.getComponentInstance = function(component, isWrapped) {
    component = component._reactInternalInstance._renderedComponent;
    if (isWrapped) {
        component = component._renderedComponent;
    }

    return component._instance;
};


export default TestUtils;
