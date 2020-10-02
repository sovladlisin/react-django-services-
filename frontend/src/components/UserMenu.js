import React, { Component } from 'react'

import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { logout } from '../actions/auth/login'

export class UserMenu extends Component {

    static propTypes = {
        user: PropTypes.object.isRequired,
        logout: PropTypes.func.isRequired,
    }


    render() {
        if (this.props.user != undefined)
            return (
                <div className="user-popup" >
                    <p className="user-name">{this.props.user.first_name} {this.props.user.last_name}</p>
                    <button className="user-exit" onClick={() => { this.props.logout() }}>Выход</button>
                </div>
            )
        else return null
    }
}

const mapDispatchToProps = {
    logout
};

const mapStateToProps = state => ({
    user: state.login.user.user
})

export default connect(mapStateToProps, mapDispatchToProps)(UserMenu);
