import $ from 'jquery';
import TestUtils from 'test-utils';
import moment from 'moment';
import fs from 'fs';

import TimestampView from 'backbone/timestamp';


describe('Timestamp', function() {
    var sinonUtils = TestUtils.Sinon.call(this);

    // Set up our vars that will be reset on each test
    var renderer, timestamp, sandbox, view;
    beforeEach(function() {
        jasmine.clock().install();
        timestamp = new Date();

        let dom = fs.readFileSync('./src/backbone/index.html');
        $(document.body).html(dom.toString());

        view = new TimestampView({
            el: '#content',
            timestamp: timestamp
        });
    });

    // After every test, we'll reset the sinon
    afterEach(function() {
        jasmine.clock().uninstall();
        $(document.body).empty();
    });

    it('renders a timestamp', function() {
        var node = view.render().el.children[0];
        expect(node.tagName.toLowerCase()).toEqual('small');
        expect(node.className).toEqual('timestamp');
        expect(node.textContent).toEqual('Just now');
    });

    it('updates every 60 seconds', function() {
        var updateTimestamp = spyOn(view, 'updateTimestamp');

        view.start();

        jasmine.clock().tick(59000);
        expect(updateTimestamp).not.toHaveBeenCalled();

        jasmine.clock().tick(1000);
        expect(updateTimestamp).toHaveBeenCalledTimes(1);
    });

    it('formats timestamps', function() {
        var map = [
            [moment('2014-10-25 10:00:10'), 'Just now'],
            [moment('2014-10-25 09:55:00'), '5 min ago'],
            [moment('2014-10-25 02:00:00'), '2:00 AM'],
            [moment('2014-09-25 12:00:00'), 'Sep 25'],
            [moment('2013-04-11 23:58:00'), '4/11/13']
        ];

        var _getNow = spyOn(view, '_getNow').and.callFake(() => {
            return moment('2014-10-25 10:00:00');
        });

        view.render();

        for (var i = 0; i < map.length; i++) {
            view.model.set('timestamp', map[i][0]);
            expect(view.el.children[0].textContent).toEqual(map[i][1]);
        }
    });

    describe("handles clicks", function() {
        let _fetchLatest;
        beforeEach(function() {
            _fetchLatest = spyOn(view, '_fetchLatest').and.callThrough();
            jasmine.Ajax.install();
        });

        afterEach(function() {
            jasmine.Ajax.uninstall();
        });

        it('and sets an ajax response on success', (done) => {
            jasmine.Ajax.stubRequest('http://chegg-test.com/users/1').andReturn({
                status: 200,
                contentType: 'application/json',
                responseText: JSON.stringify({name: "Shelly"})
            });

            view.render();

            expect(view.el.children[0].textContent).toEqual('Just now');

            view.$el.click();

            var deferred = _fetchLatest.calls.first().returnValue;
            deferred.always(function(data) {
                expect(view.el.children[0].textContent).toEqual("Shelly");
            }).always(() => done());
        });

        it('and demands answers on failure', (done) => {
            jasmine.Ajax.stubRequest('http://chegg-test.com/users/1').andReturn({
                status: 404
            });

            expect(view.el.children[0].textContent).toEqual('Just now');

            view.$el.click();

            var deferred = _fetchLatest.calls.first().returnValue;
            deferred.always(function(data) {
                expect(view.el.children[0].textContent).toEqual("What have you done with Shelly?!");
            }).always(() => done());
        });
    });
});
