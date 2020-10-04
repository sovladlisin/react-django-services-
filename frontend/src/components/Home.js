import React, { Component } from 'react'
import { Link } from 'react-router-dom'

import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { login } from '../actions/auth/login'
import { URL } from '../actions/types';
import { REGISTER } from 'redux-persist';

import { purge } from '../actions/think_bank/posts'

export class Home extends Component {

    static propTypes = {
        login: PropTypes.func.isRequired,
        user: PropTypes.object.isRequired
    }

    componentDidMount() {
        if (this.props.registered) {
            this.props.purge()
            window.location.replace(URL + 'service-list');
        }
    }

    login = () => {
        this.props.purge()
        this.props.login()
    }

    render() {
        return (
            <div className='home'>
                <button onClick={this.login}>Вход</button>
            </div>
        )
    }
}

const mapDispatchToProps = {
    login,
    purge
};

const mapStateToProps = state => ({
    user: state.login.user,
    registered: state.login.registered
})

export default connect(mapStateToProps, mapDispatchToProps)(Home);
