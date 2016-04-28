import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'test-utils';
import sinon from 'sinon';
import moment from 'moment';
import nock from 'nock';

import Timestamp from 'react/timestamp';


describe('Timestamp', function() {
    // Set up our vars that will be reset on each test
    var renderer, timestamp, sandbox;
    beforeEach(function() {
        // A Sinon sandbox allows you to easily restore
        // any stubs/spies/mocks that are created during tests
        sandbox = sinon.sandbox.create();

        renderer = TestUtils.createRenderer();
        timestamp = new Date();
    });

    // After every test, we'll reset the sinon
    afterEach(function() {
        sandbox.restore();
    });

    it('renders a timestamp', function() {
        renderer.render(<Timestamp timestamp={timestamp} />);
        var result = renderer.getRenderOutput();

        result.type.should.equal('small');
        result.props.className.should.equal('timestamp');
        result.props.children.should.equal('Just now');
    });

    it('updates every 60 seconds', function() {
        var updateTimestamp = sandbox.stub(Timestamp.prototype, 'updateTimestamp');
        var clock = sandbox.useFakeTimers();

        TestUtils.renderIntoDocument(<Timestamp timestamp={timestamp} />);

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

        var _getNow = sandbox.stub(Timestamp.prototype, '_getNow', () => {
            return moment('2014-10-25 10:00:00');
        })

        for (var i = 0; i < map.length; i++) {
            renderer = TestUtils.createRenderer();
            renderer.render(<Timestamp timestamp={map[i][0]} />);
            renderer.getRenderOutput().props.children.should.equal(map[i][1]);
        }
    });

    describe("handles clicks", function() {
        let scope, onClick, component;
        beforeEach(function() {
            scope = nock('http://chegg.com').get('/users/1/');

            onClick = sandbox.spy(Timestamp.prototype, 'onClick');
            component = TestUtils.renderIntoDocument(<Timestamp timestamp={timestamp} />);
        });

        afterEach(function() {
            nock.cleanAll();
        });

        it('and sets an ajax response on success', (done) => {
            scope.reply(200, {
                name: 'Shelly'
            });

            component.state.timestamp.should.equal('Just now');

            TestUtils.Simulate.click(ReactDOM.findDOMNode(component));

            var promise = onClick.returnValues[0];
            promise.then((response) => {
                component.state.timestamp.should.equal("Shelly");
            }).then(done).catch(done);
        });

        it('and demands answers on failure', (done) => {
            scope.reply(404);

            component.state.timestamp.should.equal('Just now');

            TestUtils.Simulate.click(ReactDOM.findDOMNode(component));

            var promise = onClick.returnValues[0];
            promise.then((response) => {
                component.state.timestamp.should.equal("What have you done with Shelly?!");
            }).then(done).catch(done);
        });
    });
});
