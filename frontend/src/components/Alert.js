import React, { Component } from 'react'

import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import onClickOutside from "react-onclickoutside";
import { clearAlerts } from '../actions/alerts/alerts'

export class Alert extends Component {

    static propTypes = {
        clearAlerts: PropTypes.func.isRequired,
        alerts: PropTypes.array.isRequired
    }

    handleClickOutside = evt => {
        this.props.clearAlerts()
    };

    state = {
        alerts: []
    }

    componentDidUpdate(prevProps) {
        if (prevProps.alerts != this.props.alerts) {
            this.setState({ alerts: this.props.alerts })
        }
    }

    renderAlerts = () => {
        if (this.state.alerts.length != 0) {
            return this.state.alerts.map(alert => {
                return (
                    <div className='alert'>
                        <p>{alert}</p>
                    </div>
                )
            })
        }
    }

    render() {
        return (
            <div className='alerts-container'>
                {this.renderAlerts()}
            </div>
        )
    }
}

const mapDispatchToProps = {
    clearAlerts
};

const mapStateToProps = state => ({
    alerts: state.alerts.alerts
})

Alert = onClickOutside(Alert);
Alert = connect(mapStateToProps, mapDispatchToProps)(Alert);

export default Alert;
