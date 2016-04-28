import $ from 'jquery';
import sinon from 'sinon';
import moment from 'moment';
import mockjax from 'jquery-mockjax';
import fs from 'fs';

import TimestampView from 'backbone/timestamp';


describe('Timestamp', function() {
    // Set up our vars that will be reset on each test
    var renderer, timestamp, sandbox, view;
    beforeEach(function() {
        // A Sinon sandbox allows you to easily restore
        // any stubs/spies/mocks that are created during tests
        sandbox = sinon.sandbox.create();

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
        sandbox.restore();
        $(document.body).empty();
    });

    it('renders a timestamp', function() {
        var node = view.render().el.children[0];
        node.tagName.toLowerCase().should.equal('small');
        node.className.should.equal('timestamp');
        node.textContent.should.equal('Just now');
    });

    it('updates every 60 seconds', function() {
        var updateTimestamp = sandbox.stub(view, 'updateTimestamp');
        var clock = sandbox.useFakeTimers();

        view.start();

        clock.tick(59000);
        updateTimestamp.called.should.be.false;

        clock.tick(1000);
        updateTimestamp.calledOnce.should.be.true;
    });

    it('formats timestamps', function() {
        var map = [
            [moment('2014-10-25 10:00:10'), 'Just now'],
            [moment('2014-10-25 09:55:00'), '5 min ago'],
            [moment('2014-10-25 02:00:00'), '2:00 AM'],
            [moment('2014-09-25 12:00:00'), 'Sep 25'],
            [moment('2013-04-11 23:58:00'), '4/11/13']
        ];

        var _getNow = sandbox.stub(view, '_getNow', () => {
            return moment('2014-10-25 10:00:00');
        });

        view.render();

        for (var i = 0; i < map.length; i++) {
            view.model.set('timestamp', map[i][0]);
            view.el.children[0].textContent.should.equal(map[i][1]);
        }
    });

    describe("handles clicks", function() {
        let _fetchLatest;
        beforeEach(function() {
            _fetchLatest = sandbox.spy(view, '_fetchLatest');
        });

        afterEach(function() {
            $.mockjax.clear();
        });

        it('and sets an ajax response on success', (done) => {
            $.mockjax({
                url: 'http://chegg-test.com/users/1',
                responseText: {name: "Shelly"}
            });

            view.render();

            view.el.children[0].textContent.should.equal('Just now');

            view.$el.click();

            var deferred = _fetchLatest.returnValues[0];
            deferred.always(function(data) {
                view.el.children[0].textContent.should.equal("Shelly");
            }).always(() => done());
        });

        it('and demands answers on failure', (done) => {
            $.mockjax({
                url: 'http://chegg-test.com/users/1',
                status: 404
            });

            view.el.children[0].textContent.should.equal('Just now');

            view.$el.click();

            var deferred = _fetchLatest.returnValues[0];
            deferred.always(function(data) {
                view.el.children[0].textContent.should.equal("What have you done with Shelly?!");
            }).always(() => done());
        });
    });
});
