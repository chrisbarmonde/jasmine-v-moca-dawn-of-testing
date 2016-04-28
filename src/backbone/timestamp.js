import $ from 'jquery';
import _ from 'underscore';
import Backbone from 'backbone';
import moment from 'moment';
import fetch from 'node-fetch';

var Timestamp = Backbone.Model.extend({
    urlRoot: 'http://chegg-test.com/users/',

    defaults: {
        timestamp: null
    }
});

let TimestampView = Backbone.View.extend({
    events: {
        'click': 'onClick'
    },

    initialize: function(options) {
        this.template = _.template($('#timestamp-template').html());
        this.model = new Timestamp({
            id: 1,
            timestamp: options.timestamp
        });

        this.timestamp = this.formatTimestamp();
        this.updateTimestamp();

        this.listenTo(this.model, 'change', this.updateTimestamp);
    },

    start: function() {
        this.interval = setInterval(this.updateTimestamp.bind(this), 60000);
        this.render();
    },

    stop: function() {
        clearInterval(this.interval);
    },

    render: function() {
        this.$el.html(this.template({
            timestamp: this.timestamp
        }));
        return this;
    },

    onClick: function() {
        this._fetchLatest();
        return false;
    },

    _fetchLatest: function() {
        return this.model.fetch().done((data) => {
            this.setTimestamp(data.name);
        }).fail((error) => {
            this.setTimestamp("What have you done with Shelly?!");
        });
    },

    updateTimestamp: function() {
        this.setTimestamp(this.formatTimestamp());
    },

    setTimestamp: function(timestamp) {
        this.timestamp = timestamp;
        this.render();
    },

    _getNow: function() {
        return moment();
    },

    /**
     * Formats the notification time stamp
     */
    formatTimestamp: function() {
        let dateCreated = moment(this.model.get('timestamp')),
            now = this._getNow(),
            diff = now.diff(dateCreated, 'minutes');

        let timestamp = dateCreated.format('M/D/YY');
        if (diff < 1) {
            timestamp = 'Just now';
        } else if (diff <= 60) {
            timestamp = `${diff} min ago`;
        } else if (now.format('YYYY-MM-DD') === dateCreated.format('YYYY-MM-DD')) {
            timestamp = dateCreated.format('h:mm A');
        } else if (now.year() === dateCreated.year()) {
            timestamp = dateCreated.format('MMM D');
        }

        return timestamp;
    }
});

export default TimestampView;
