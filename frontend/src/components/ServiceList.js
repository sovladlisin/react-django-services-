import React, { Component } from 'react'
import { Link } from 'react-router-dom'

import { checkLogin, extractToken } from '../actions/auth/login'
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

export class ServiceList extends Component {

    componentDidMount() {
        if (this.props.isFetching) {
            this.props.extractToken()
        }
        else this.props.checkLogin(this.props.user)

    }

    static propTypes = {
        checkLogin: PropTypes.func.isRequired,
        extractToken: PropTypes.func.isRequired,
    }

    render() {
        return (
            <div className='service-list'>
                <Link to='/think-bank'><p>Банк креативов</p></Link>
            </div>
        )
    }
}
const mapDispatchToProps = {
    checkLogin,
    extractToken
};

const mapStateToProps = state => ({
    user: state.login.user,
    isFetching: state.login.isFetching
})

export default connect(mapStateToProps, mapDispatchToProps)(ServiceList);
