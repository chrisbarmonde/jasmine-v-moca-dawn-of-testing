import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'test-utils';
import moment from 'moment';
import nock from 'nock';

import Timestamp from 'react/timestamp';


describe('Timestamp', function() {
    var sinonUtils = TestUtils.Sinon.call(this);

    // Set up our vars that will be reset on each test
    var renderer, timestamp, sandbox;
    beforeEach(function() {
        jasmine.clock().install();

        renderer = TestUtils.createRenderer();
        timestamp = new Date();
    });

    // After every test, we'll reset the sinon
    afterEach(function() {
        jasmine.clock().uninstall();
    });

    it('renders a timestamp', function() {
        renderer.render(<Timestamp timestamp={timestamp} />);
        var result = renderer.getRenderOutput();

        expect(result.type).toEqual('small');
        expect(result.props.className).toEqual('timestamp');
        expect(result.props.children).toEqual('Just now');
    });

    it('updates every 60 seconds', function() {
        var updateTimestamp = spyOn(Timestamp.prototype, 'updateTimestamp');

        TestUtils.renderIntoDocument(<Timestamp timestamp={timestamp} />);

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

        var _getNow = spyOn(Timestamp.prototype, '_getNow')
                        .and.returnValue(moment('2014-10-25 10:00:00'));
        /** OR **/
        // var _getNow = spyOn(Timestamp.prototype, '_getNow').and.callFake(() => {
        //     return moment('2014-10-25 10:00:00')
        // });


        for (var i = 0; i < map.length; i++) {
            renderer = TestUtils.createRenderer();
            renderer.render(<Timestamp timestamp={map[i][0]} />);
            expect(renderer.getRenderOutput().props.children).toEqual(map[i][1]);
        }
    });

    describe("handles clicks", function() {
        let scope, onClick, component;
        beforeEach(function() {
            scope = nock('http://chegg.com').get('/users/1/');

            onClick = spyOn(Timestamp.prototype, 'onClick').and.callThrough();
            component = TestUtils.renderIntoDocument(<Timestamp timestamp={timestamp} />);
        });

        afterEach(function() {
            nock.cleanAll();
        });

        it('and sets an ajax response on success', (done) => {
            scope.reply(200, {
                name: 'Shelly'
            });

            expect(component.state.timestamp).toEqual('Just now');

            TestUtils.Simulate.click(ReactDOM.findDOMNode(component));

            var promise = onClick.calls.first().returnValue;
            promise.then(() => {
                expect(component.state.timestamp).toEqual("Shelly");
            }).then(done).catch(done);
        });

        it('and demands answers on failure', (done) => {
            scope.reply(404);

            expect(component.state.timestamp).toEqual('Just now');

            TestUtils.Simulate.click(ReactDOM.findDOMNode(component));

            var promise = onClick.calls.first().returnValue;
            promise.then((response) => {
                expect(component.state.timestamp).toEqual("What have you done with Shelly?!");
            }).then(done).catch(done);
        });
    });
});
