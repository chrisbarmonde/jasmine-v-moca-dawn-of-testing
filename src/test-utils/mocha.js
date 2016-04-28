import chai from 'chai';
import jsdom from './jsdom';
import nock from 'nock'; // disable all http requests

// Include the stack trace
chai.config.includeStack = true;

// Set up global assert methods
global.assert = chai.assert;
global.expect = chai.expect;
global.should = chai.should();


// Set up DOM
jsdom();

// Any other global setup you'd need todo for any vendor
// or other third-party overrides
