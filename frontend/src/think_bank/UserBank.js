import React, { Component, Fragment } from 'react'
import Post from './Post'

import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { getUserByVkId, getUserBank } from '../actions/think_bank/posts'

export class UserBank extends Component {


    static propTypes = {
        getUserByVkId: PropTypes.func.isRequired,
        getUserBank: PropTypes.func.isRequired,
        user_bank: PropTypes.array.isRequired,
        owner: PropTypes.object.isRequired
    }

    state = {
        posts: [],
        user_id: -1
    }



    componentDidMount() {
        const user_id = this.props.match.params.user
        this.props.getUserByVkId(user_id)
        this.props.getUserBank(user_id)
        this.setState({ user_id: user_id })
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.user_bank != this.props.user_bank && this.props.user_bank.length != 0) {
            if (this.props.user_bank[0].user_id + '' === this.state.user_id + '')
                this.setState({ posts: this.props.user_bank })
        }
    }

    renderBank = () => {
        if (this.state.posts.length === 0) return (<p className='empty-bank'>Банк пуст</p>)
        var data = this.state.posts
        data.sort((a, b) => {
            if (a.id < b.id) {
                return 1;
            }
            return -1;
        });
        return data.map(item => { return (<Post post={item}></Post>) })
    }


    render() {
        return (
            <Fragment>
                <p className='bank-title'>Банк пользователя: {this.props.owner.user_name}</p>
                <div className='post-container'>
                    {this.renderBank()}
                </div>
            </Fragment>
        )
    }
}

const mapDispatchToProps = {
    getUserByVkId,
    getUserBank
};

const mapStateToProps = state => ({
    user_bank: state.posts.user_bank,
    user: state.login.user,
    owner: state.posts.user_by_vk_id
})

export default connect(mapStateToProps, mapDispatchToProps)(UserBank);
