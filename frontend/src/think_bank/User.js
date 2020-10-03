import React, { Component } from 'react'

import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { addUserPermission, removeUserPermission } from '../actions/think_bank/posts'

export class User extends Component {

    static propTypes = {
        user: PropTypes.object.isRequired,
        selected_user: PropTypes.object.isRequired,
        addUserPermission: PropTypes.func.isRequired,
        removeUserPermission: PropTypes.func.isRequired,
    }

    addPerm = () => {
        console.log('..')
        this.props.addUserPermission(this.props.user.id, this.props.selected_user.user_id, this.props.selected_user)
    }

    removePerm = () => {
        var id = null
        this.props.permissions.viewers.map(item => { if (item.user_id === this.props.selected_user.user_id) id = item.id })
        this.props.removeUserPermission(id)
    }

    renderButton = () => {
        var id = -1
        this.props.permissions.viewers.map(item => { if (item.user_id === this.props.selected_user.user_id) id = item.id })
        if (id === -1) return (<button id='add-restriction' onClick={this.addPerm}>Разрешить комментирование</button>)
        return (<button id='remove-restriction' onClick={this.removePerm}>Запретить комментирование</button>)
    }

    render() {
        var post_link = "https://vk.com/id" + this.props.selected_user.user_id

        return (
            <div className='user-window'>
                <i class="fas fa-times" onClick={() => { this.props.close() }}></i>
                <a target="_blank" rel="noopener noreferrer" href={post_link}><img src={this.props.selected_user.user_img}></img></a>
                <div className='user-info'>
                    <p className='user-window-id'>ID: {this.props.selected_user.user_id}</p>
                    <p className='user-window-name'>{this.props.selected_user.user_name}</p>
                </div>
                <div className='user-actions'>
                    {this.renderButton()}
                </div>
            </div>
        )
    }
}

const mapDispatchToProps = {
    addUserPermission,
    removeUserPermission
};

const mapStateToProps = state => ({
    user: state.login.user,
    permissions: state.posts.permissions
})

export default connect(mapStateToProps, mapDispatchToProps)(User);
