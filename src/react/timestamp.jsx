import React from 'react';
import ReactDOM from 'react-dom';
import moment from 'moment';
import fetch from 'node-fetch';


export default class Timestamp extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            timestamp: this.formatTimestamp()
        };
    }

    /**
     * Update the timestamp every minute
     */
    componentDidMount() {
        this.interval = setInterval(this.updateTimestamp.bind(this), 60000);
    }

    /**
     * Stop the interval from firing if we've unmounted
     */
    componentWillUnmount() {
        clearInterval(this.interval);
    }

    render() {
        return (
            <small className="timestamp" onClick={this.onClick.bind(this)}>
                {this.state.timestamp}
            </small>
        );
    }

    onClick() {
        return fetch('http://chegg.com/users/1/')
            .then((response) => {
                if (response.ok) {
                    return response.json();
                }

                throw response;
            }).then((response) => {
                this.setState({
                    timestamp: response.name
                });
            }).catch((error) => {
                this.setState({
                    timestamp: "What have you done with Shelly?!"
                });
            });
    }

    updateTimestamp() {
        this.setState({
            timestamp: this.formatTimestamp()
        });
    }

    _getNow() {
        return moment();
    }

    /**
     * Formats the notification time stamp
     */
    formatTimestamp() {
        let dateCreated = moment(this.props.timestamp),
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
}
