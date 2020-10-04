import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { getUsers, getPermissions } from '../actions/think_bank/posts'

import onClickOutside from "react-onclickoutside";
import User from './User';


export class ControlPanel extends Component {


    state = {
        user_window: false,
        search_input: '',
        selected_user_window: false,
        selected_user: {},
        trusted_users_window: false,

        proccessed_permissions: []
    }


    static propTypes = {
        users: PropTypes.array.isRequired,
        getUsers: PropTypes.func.isRequired,
        getPermissions: PropTypes.func.isRequired
    }

    componentDidMount() {
        this.props.getUsers()
        this.props.getPermissions(this.props.user.id)
    }

    componentDidUpdate(prevProps) {
        if (prevProps.permissions != this.props.permissions) {
            var perms = []
            this.props.permissions.viewers.map(item => perms.push(item.user_id))
            this.setState({ proccessed_permissions: perms })
        }
    }

    handleClickOutside = evt => {
        this.props.toggle()
    };

    onChange = (e) => {
        this.setState({ [e.target.name]: e.target.value })
    }

    renderTrustedUsers = () => {
        const data = this.props.users.filter(item => this.state.proccessed_permissions.includes(item.user_id))

        return data.map(item => {
            if (this.props.user.id != item.user_id)
                return (
                    <div className='user' onClick={() => { this.setUserWindow(item) }}>
                        <img style={{ borderColor: 'white' }} src={item.user_img}></img>
                        <p className='user-name'>{item.user_name}</p>
                    </div>
                )
            return null
        })
    }


    renderUsers = () => {
        const data = this.props.users
        const search_input = this.state.search_input
        var render_data = []



        if (search_input.length != 0) {
            render_data = data.filter(item => item.user_name.startsWith(search_input) || item.user_id.toString().startsWith(search_input))
        }
        else render_data = data

        if (render_data.length === 0) return (<div className='user'><p>Пользователей не найдено</p></div>)
        else {
            return render_data.map(item => {
                const user_style = this.state.proccessed_permissions.includes(item.user_id) ?
                    { borderColor: '#259e60' } :
                    { borderColor: '#d11f1f' }

                if (this.props.user.id != item.user_id)
                    return (
                        <div className='user' onClick={() => { this.setUserWindow(item) }}>
                            <img style={user_style} src={item.user_img}></img>
                            <p className='user-name'>{item.user_name}</p>
                        </div>
                    )
                return null
            })
        }

    }

    setUserWindow = (user) => {
        this.setState({ selected_user_window: true, selected_user: user })
    }

    closeUserWindow = () => {
        this.setState({ selected_user_window: false, selected_user: {} })
    }

    render() {
        return (
            <div className='control-pannel'>
                <p className='title-card'
                    onClick={() => { this.setState({ user_window: !this.state.user_window }) }}>
                    Пользователи системы
                    {this.state.user_window ?
                        <i class="fas fa-long-arrow-alt-down"></i> :
                        <i class="fas fa-long-arrow-alt-right"></i>}
                </p>


                {this.state.user_window ? <Fragment>

                    <div className='users'>
                        <input value={this.state.search_input}
                            name='search_input'
                            onChange={this.onChange}
                            placeholder='Поиск по имени или id'>
                        </input>
                        {this.renderUsers()}
                    </div>
                </Fragment>
                    : null}

                <p className='title-card'
                    onClick={() => { this.setState({ trusted_users_window: !this.state.trusted_users_window }) }}>
                    Одобренные пользователи
                    {this.state.trusted_users_window ?
                        <i class="fas fa-long-arrow-alt-down"></i> :
                        <i class="fas fa-long-arrow-alt-right"></i>}
                </p>

                {this.state.trusted_users_window ? <Fragment>
                    <div className='users'>
                        {this.renderTrustedUsers()}
                    </div>
                </Fragment>
                    : null}

                {this.state.selected_user_window ? <User selected_user={this.state.selected_user} close={this.closeUserWindow} /> : null}
            </div>
        )
    }
}
const mapDispatchToProps = {
    getUsers,
    getPermissions
};

const mapStateToProps = state => ({
    user: state.login.user,
    users: state.posts.users,
    permissions: state.posts.permissions
})

ControlPanel = onClickOutside(ControlPanel);
ControlPanel = connect(mapStateToProps, mapDispatchToProps)(ControlPanel);

export default ControlPanel;