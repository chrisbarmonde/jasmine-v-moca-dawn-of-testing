import $ from 'jquery';
import mockjax from 'jquery-mockjax';


// Some jQuery extensions likely require this (mockjax)
global.$ = global.jQuery = $;
$.mockjax = mockjax($, global.window);
$.extend($.mockjaxSettings, {
    logging: false,
    responseTime: 0,
    contentType: 'application/json'
});
