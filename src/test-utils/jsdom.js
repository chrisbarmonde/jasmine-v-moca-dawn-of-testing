// See: http://www.hammerlab.org/2015/02/14/testing-react-web-apps-with-mocha/
import jsdom from 'jsdom';

export default function(markup) {
    var defaultDOM = '<!DOCTYPE html><html><body></body></html>';

    global.window = jsdom.jsdom(markup || defaultDOM).defaultView;
    global.document = global.window.document;
    global.navigator = {
        userAgent: 'node.js'
    };
};
