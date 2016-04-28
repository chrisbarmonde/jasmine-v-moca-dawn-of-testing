import jsdom from 'test-utils/jsdom';
import JasmineCore from 'jasmine-core';

jsdom();

// jasmine-ajax need this global varaible
global.getJasmineRequireObj = function() {
  return JasmineCore;
}

require('jasmine-ajax');
