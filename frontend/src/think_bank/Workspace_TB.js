import React, { Component, Fragment } from 'react'

import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { stringify } from 'qs';

import { getPosts, renderPost, deletePost } from '../actions/think_bank/posts'
import { checkLogin } from '../actions/auth/login'

import ReactLinkify from 'react-linkify';




export class Workspace_TB extends Component {


    static PropTypes = {
        posts: PropTypes.array.isRequired,
        getPosts: PropTypes.func.isRequired,
        checkLogin: PropTypes.func.isRequired,
        deletePost: PropTypes.func.isRequired,

    }

    state = {
        full_posts: [],
        post_link: '',
    }

    componentDidMount() {
        this.props.checkLogin(this.props.user)
        if (this.props.user != undefined && Object.keys(this.props.user) != 0)
            this.props.getPosts(this.props.user.id)
    }


    onChange = (e) => {
        this.setState({ [e.target.name]: e.target.value })
    }

    submitPostByLink = () => {
        document.getElementById('post_input').value = "";

        const user_id = this.props.user.id
        const token = this.props.user.access_token

        var post_link = this.state.post_link
        if (post_link.indexOf('-') > 0) {
            const post_id = post_link.split('-')[1]
            this.props.renderPost("-" + post_id, user_id, token)
        }
        else {
            if (post_link.indexOf('wall') > 0) {
                var step = post_link.split('wall')[1]
                const post_id = step.split('?')[0]
                this.props.renderPost(post_id, user_id, token)
            }
            else alert('Данная ссылка не ведет на пост')
        }
    }

    show_post = (id) => {
        if (this.state.full_posts.includes(id) === false) this.setState({ full_posts: [...this.state.full_posts, id] })
        else this.setState({ full_posts: this.state.full_posts.filter(index => index != id) })
    }

    renderPosts = () => {
        var data = this.props.posts
        data.sort((a, b) => {
            if (a.id < b.id) {
                return 1;
            }
            return -1;
        });

        return data.map(item => {

            const date = new Date(item.date * 1000);

            var show_check = false
            var text_style = {}
            if (item.text.length > 300) {
                show_check = this.state.full_posts.includes(item.id) ? false : true
                text_style = show_check ? { height: '100px', overflow: 'hidden' } : {}
            }

            const post_custom_id = item.owner_id + "_" + item.post_id
            var post_link = "https://vk.com/wall" + post_custom_id


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
                            {show_check ? <p id="show-all" onClick={() => { this.show_post(item.id) }}>Показать полностью...</p> : null}

                            <div className='attachments'>
                                {this.renderAttachments(item.attachments)}
                            </div>
                        </div>

                        <div className='footer'>
                            <p><i class="fas fa-heart"></i> {item.likes_count}</p>
                            <p><i class="fas fa-comment-alt"></i>{item.comments_count}</p>
                            <p className='footer-right'><i class="fas fa-retweet"></i>{item.reposts_count}</p>
                            <p className='footer-right'><i class="fas fa-eye"></i>{item.views_count}</p>
                        </div>
                        <div className='post-control-bar'>
                            <button className='delete-post' onClick={() => this.props.deletePost(item.id)}><i class="fas fa-trash-alt"></i></button>
                        </div>
                    </div>
                </Fragment>
            )
        })
        return null
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
            <Fragment>
                {/* <div className="background" style={{ backgroundImage: 'url("' + Background + '")' }}></div> */}
                <div className="add-new-post">
                    <input id="post_input" name="post_link" onChange={this.onChange} placeholder="Введите ссылку на запись"></input>
                    <button id="submit_post" onClick={this.submitPostByLink}>Загрузить запись</button>
                </div>
                <div className="post-container">
                    {this.renderPosts()}
                </div>
            </Fragment>
        )
    }
}

const mapDispatchToProps = {
    getPosts,
    renderPost,
    checkLogin,
    deletePost
};

const mapStateToProps = state => ({
    posts: state.posts.all,
    user: state.login.user
})

export default connect(mapStateToProps, mapDispatchToProps)(Workspace_TB);