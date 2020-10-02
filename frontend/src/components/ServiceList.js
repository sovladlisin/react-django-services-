import React, { Component } from 'react'
import { Link } from 'react-router-dom'

import { checkLogin } from '../actions/auth/login'
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

export class ServiceList extends Component {

    componentDidMount() {
        this.props.checkLogin()
    }

    static propTypes = {
        checkLogin: PropTypes.func.isRequired
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
    checkLogin
};

const mapStateToProps = state => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(ServiceList);
