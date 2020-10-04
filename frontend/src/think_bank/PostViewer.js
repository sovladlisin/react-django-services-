import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import ReactLinkify from 'react-linkify';


import { getPostById, getUserByVkId } from '../actions/think_bank/posts'
import { Link } from 'react-router-dom';
import Post from './Post';

export class PostViewer extends Component {

    static propTypes = {
        post: PropTypes.object.isRequired,
        id: PropTypes.number.isRequired,
        getPostById: PropTypes.func.isRequired,
        getUserByVkId: PropTypes.func.isRequired
    }

    state = {
        post: {},
        id: -1,
        user_id: -1
    }

    componentDidUpdate(prevProps, prevState) {
        if (parseInt(this.state.id) === this.props.post.id && prevProps.post != this.props.post) {
            this.setState({ post: this.props.post })
        }
        if (prevState.id != this.state.id) {
            this.props.getPostById(this.state.id)
        }
        if (prevState.user_id != this.state.user_id) {
            this.props.getUserByVkId(this.state.user_id)
        }
    }

    componentDidMount() {
        const id = this.props.match.params.id
        const user_id = this.props.match.params.user
        this.setState({ id: id, user_id: user_id })
    }

    renderPost = () => {
        if (Object.keys(this.state.post).length > 0) {
            return <Post post={this.state.post}></Post>
        }
        return null
    }

    render() {
        return (
            <Fragment>
                <p className='bank-title'>Банк пользователя: {this.props.owner.user_name}</p>
                <div className='post-container'>
                    {this.renderPost()}
                </div>
            </Fragment>
        )
    }
}

const mapDispatchToProps = {
    getPostById,
    getUserByVkId
};

const mapStateToProps = state => ({
    post: state.posts.viewed_post,
    user: state.login.user,
    owner: state.posts.user_by_vk_id
})

export default connect(mapStateToProps, mapDispatchToProps)(PostViewer);
