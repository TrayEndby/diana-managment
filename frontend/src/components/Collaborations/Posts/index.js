import React from 'react';
import PropTypes from 'prop-types';

import WritePostCard from './Write';
import PostsList from './List';

import collabService from '../../../service/CollaborationService';

const propTypes = {
  id: PropTypes.number.isRequired,
  className: PropTypes.string,
  posts: PropTypes.array.isRequired,
  onUpdate: PropTypes.func.isRequired,
  onRefresh: PropTypes.func.isRequired,
};

class PostsSection extends React.PureComponent {
  // XXX TODO: call list to refresh the post
  handleNewPost = async (data) => {
    const { id, onRefresh } = this.props;
    await collabService.newPost(id, data);
    onRefresh();
  };

  handleDeletePost = async (postId) => {
    const { id, onUpdate } = this.props;
    await collabService.deletePost(id, postId);
    onUpdate((posts) => posts.filter(({ id }) => id !== postId));
  };

  handleAddReply = async (postId, text) => {
    const { id, onRefresh } = this.props;
    await collabService.replyPost(id, postId, text);
    onRefresh();
  };

  render() {
    const { className, posts } = this.props;
    return (
      <div className={className}>
        <WritePostCard onPost={this.handleNewPost} />
        <PostsList posts={posts} onDelete={this.handleDeletePost} onReply={this.handleAddReply} />
      </div>
    );
  }
}

PostsSection.propTypes = propTypes;

export default PostsSection;
