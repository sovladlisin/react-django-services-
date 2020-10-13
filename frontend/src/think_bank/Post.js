import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { getPosts, renderPost, deletePost, getPermissions, getPostComments, addComment, deleteComment } from '../actions/think_bank/posts'
import { createAlert } from '../actions/alerts/alerts'

import ReactLinkify from 'react-linkify';



import copy from "copy-to-clipboard";
import { URL } from '../actions/types';

export class Post extends Component {

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
        permissions: PropTypes.object.isRequired,
    }

    state = {
        show_full: false,
        show_comments: false,
        comment_input: '',
        comments: [],
        check_comment_perm: false,

        shift: false
    }


    componentDidMount() {
        this.props.getPostComments(this.props.post.id)
        if (this.props.registered) this.props.getPermissions(this.props.user.id)
    }

    onChange = (e) => {
        this.setState({ [e.target.name]: e.target.value })
    }
    copyToClipboard = (text) => {
        copy(URL + text)
        this.props.createAlert('Ссылка скопирована в буфер обмена')
    };

    addComment = () => {
        const comment = this.state.comment_input
        this.props.addComment(comment, this.props.post.id, this.props.user)
    }

    componentDidUpdate(prevProps) {
        if (prevProps.permissions != this.props.permissions) {
            if (this.props.registered) {
                var check_comment_perm = false
                if (this.props.permissions.owners.filter(item => item.user_id === this.props.post.user).length > 0) {
                    check_comment_perm = true
                }
                console.log(this.props.user)
                if (this.props.user.id === this.props.post.user) check_comment_perm = true
            }
            this.setState({ check_comment_perm: check_comment_perm })
        }
    }


    renderPost = () => {
        var item = this.props.post

        const date = new Date(item.date * 1000);
        const text_style = this.state.show_full ? {} : { height: '100px', overflow: 'hidden' }
        const post_custom_id = item.owner_id + "_" + item.post_id
        var post_link = "https://vk.com/wall" + post_custom_id

        var check_comment_perm = this.state.check_comment_perm

        const comment_count = this.props.comments[this.props.post.id] === undefined ? 0 : this.props.comments[this.props.post.id].length
        return (
            <Fragment>
                <div className='post'>
                    <div className='header'>
                        <img className='thumbnail' src={item.owner_img_link}></img>
                        <p className='name'><a target="_blank" rel="noopener noreferrer" href={post_link}>{item.owner_name}</a></p>
                        <p className='date'>Опубликовано: {date.toLocaleDateString('en-GB')}</p>
                    </div>

                    <div className='content'>
                        <div className='text' style={text_style}>
                            <ReactLinkify>{item.text}</ReactLinkify>
                        </div>
                        <p id="show-all" onClick={() => { this.setState({ show_full: !this.state.show_full }) }}>{this.state.show_full ? 'Cкрыть' : 'Показать полностью...'}</p>
                        <div className='attachments'>
                            {this.renderAttachments(item.attachments)}
                        </div>
                    </div>

                    <div className='footer'>
                        <p><i className="fas fa-heart"></i> {item.likes_count}</p>
                        <p><i className="fas fa-comment-alt"></i>{item.comments_count}</p>
                        <p className='footer-right'><i className="fas fa-retweet"></i>{item.reposts_count}</p>
                        <p className='footer-right'><i className="fas fa-eye"></i>{item.views_count}</p>
                    </div>
                    {this.state.show_comments ?
                        <div className='comment-container'>
                            <div className='comments'>
                                {this.renderComments()}
                            </div>
                            {check_comment_perm ? <div className='comment-input-container'>
                                <textarea onKeyDown={this.handleKeyDown} onChange={this.onChange} className='comment-input' name='comment_input' value={this.state.comment_input} placeholder='Оставить комментарий' maxLength='300'></textarea>
                                <button className='add-comment' onClick={this.addComment}><i className="far fa-paper-plane"></i></button>
                            </div> : null}
                        </div>
                        : null
                    }
                    <div className='post-control-bar'>
                        {this.props.user.id === item.user ? <Fragment>
                            <button className='delete-post' title='Удалить пост' onClick={() => this.props.deletePost(item.id)}><i className="fas fa-trash-alt"></i></button>
                            <button className='share-post' title='Поделиться' onClick={() => this.copyToClipboard(`post/${this.props.user.id}/${item.id}`)}><i className="fas fa-share"></i></button>
                        </Fragment> : null}
                        <button className='comments-post' title='Комментарии' onClick={() => this.setState({ show_comments: !this.state.show_comments })}><i className="fas fa-comment"></i><span id='comment-count'>{comment_count}</span></button>
                    </div>
                </div>
            </Fragment>
        )
    }

    handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            if (!this.state.shift) {
                this.addComment()
                this.setState({ comment_input: '', shift: false })
            }
            else {
                this.setState({ shift: false })
            }

        } else
            if (e.key === 'Shift') {
                this.setState({ shift: true })
            } else this.setState({ shift: false })
    }

    renderComments = () => {
        const comments = this.props.comments[this.props.post.id]
        if (comments === undefined) return null
        return comments.map(item => {
            const check_delete_perms = this.props.post.user === this.props.user.id || item.user === this.props.user.id ? true : false
            return (
                <div className='comment'>
                    <div className='comment-image'>
                        <img src={item.user_img}></img>
                    </div>
                    <div className='comment-data'>
                        <p className='comment-name'>{item.user_name}</p>
                        <p className='comment-text'>{item.comment}</p>
                        {check_delete_perms ? <button className='delete-comment' onClick={() => this.props.deleteComment(item.id, this.props.post.id)}>Удалить</button> : null}
                    </div>

                </div>
            )
        })
    }

    renderAttachments = (attachments) => {
        if (attachments != 'Не указано') {
            const data = JSON.parse(attachments)
            return data.map(item => {
                switch (item.type) {
                    case 'doc':
                        return (
                            <div className='doc'>
                                <a href={item.doc.url}><img src={item.doc.preview.photo.sizes[2].src}></img></a>
                            </div>
                        )
                    case 'photo':
                        return (
                            <div className='doc'>
                                <img src={item.photo.sizes[item.photo.sizes.length - 1].url}></img>
                            </div>
                        )

                    default:
                        return null
                }
            })
        }
        return null
    }

    render() {
        return (
            this.renderPost()
        )
    }
}

const mapDispatchToProps = {
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
    comments: state.posts.comments,
    permissions: state.posts.permissions,
    registered: state.login.registered
})

export default connect(mapStateToProps, mapDispatchToProps)(Post);
