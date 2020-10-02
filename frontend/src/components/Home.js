import React, { Component } from 'react'
import { Link } from 'react-router-dom'

import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { login } from '../actions/auth/login'
import { URL } from '../actions/types';

export class Home extends Component {

    static propTypes = {
        login: PropTypes.func.isRequired,
        user: PropTypes.object.isRequired
    }

    componentDidMount() {
        if (this.props.user != undefined) {
            if (Object.keys(this.props.user) > 0) window.location.replace(URL + 'service-list');
        }
    }

    login = () => {
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
    login
};

const mapStateToProps = state => ({
    user: state.login.user
})

export default connect(mapStateToProps, mapDispatchToProps)(Home);
