import React, { Component, Fragment } from 'react'

import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { stringify } from 'qs';

import { getPosts, renderPost, deletePost, getPermissions, getPostComments, addComment, deleteComment } from '../actions/think_bank/posts'
import { createAlert } from '../actions/alerts/alerts'
import { checkLogin } from '../actions/auth/login'

import { get } from 'jquery';
import ControlPanel from './ControlPanel';
import { Link } from 'react-router-dom';


import copy from "copy-to-clipboard";
import { URL } from '../actions/types';
import Post from './Post';



export class Workspace_TB extends Component {


    static PropTypes = {
        posts: PropTypes.array.isRequired,
        getPosts: PropTypes.func.isRequired,
        checkLogin: PropTypes.func.isRequired,
        deletePost: PropTypes.func.isRequired,
        getPermissions: PropTypes.func.isRequired,
        createAlert: PropTypes.func.isRequired,
        getPostComments: PropTypes.func.isRequired,
        addComment: PropTypes.func.isRequired,
        deleteComment: PropTypes.func.isRequired,
    }

    state = {
        post_link: '',
        control_panel: false,
    }

    componentDidMount() {
        this.props.checkLogin(this.props.user)
        if (this.props.user != undefined && Object.keys(this.props.user) != 0)
            this.props.getPosts(this.props.user.id)
    }


    onChange = (e) => {
        this.setState({ [e.target.name]: e.target.value })
    }

    toggleControlPanel = () => {
        this.setState({ control_panel: !this.state.control_panel })
    }


    submitPostByLink = () => {
        document.getElementById('post_input').value = "";

        const user_id = this.props.user.id
        var post_link = this.state.post_link

        if (post_link.indexOf('wall') > 0) this.props.renderPost(post_link, user_id)
        else alert('Данная ссылка не ведет на пост')
    }



    renderPosts = () => {
        if (this.props.posts.length === 0) return (<p className='empty-bank'>Банк пуст</p>)
        var data = this.props.posts
        data.sort((a, b) => {
            if (new Date(a.date_added) < new Date(b.date_added)) {
                return 1;
            }
            return -1;
        });

        return data.map(item => {
            return <Post post={item}></Post>
        })
    }

    render() {
        return (
            <Fragment>
                {this.state.control_panel ? <ControlPanel toggle={this.toggleControlPanel} /> : null}
                <div className="add-new-post">
                    <input id="post_input" name="post_link" onChange={this.onChange} placeholder="Введите ссылку на запись"></input>
                    <button id="submit_post" onClick={this.submitPostByLink}>Загрузить запись</button>
                </div>
                <div className="post-container">
                    {this.renderPosts()}
                </div>
                {this.state.control_panel ? null :
                    <button id='open-control-panel' onClick={() => { this.toggleControlPanel() }}><i class="fas fa-compass"></i> </button>
                }

            </Fragment>
        )
    }
}

const mapDispatchToProps = {
    getPosts,
    renderPost,
    checkLogin,
    deletePost,
    getPermissions,
    createAlert,
    getPostComments,
    addComment,
    deleteComment
};

const mapStateToProps = state => ({
    posts: state.posts.all,
    user: state.login.user,
    comments: state.posts.comments
})

export default connect(mapStateToProps, mapDispatchToProps)(Workspace_TB);