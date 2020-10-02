import React, { Component, Fragment } from 'react'

import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { logout } from '../actions/auth/login'
import onClickOutside from "react-onclickoutside";


export class UserMenu extends Component {

    state = {
        settings: false
    }

    static propTypes = {
        user: PropTypes.object.isRequired,
        logout: PropTypes.func.isRequired,
    }

    handleClickOutside = evt => {
        this.setState({ setting: false })
    };

    render() {
        if (this.props.user != undefined && Object.keys(this.props.user) != 0)
            return (
                <Fragment>
                    <div className="user-popup" >
                        <img src={this.props.user.img} onClick={() => { this.setState({ settings: !this.state.settings }) }}></img>
                        <p className="user-name">{this.props.user.name}</p>
                    </div>
                    {this.state.settings ?
                        <div className='setting'>
                            <button className="user-exit" onClick={() => { this.props.logout() }}>Выход</button>
                        </div> : null}
                </Fragment>
            )
        else return null
    }
}

const mapDispatchToProps = {
    logout
};

const mapStateToProps = state => ({
    user: state.login.user
})

UserMenu = onClickOutside(UserMenu);
UserMenu = connect(mapStateToProps, mapDispatchToProps)(UserMenu);

export default UserMenu;
