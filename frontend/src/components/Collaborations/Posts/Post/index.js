import React from 'react';
import PropTypes from 'prop-types';

import Replys from '../Replys';

import { isMyPost } from '../../util';
import { utcToLocal } from '../../../../util/helpers';
import ErrorDialog from '../../../../util/ErrorDialog';

import style from './style.module.scss';

const propTypes = {
  post: PropTypes.object.isRequired,
  onDelete: PropTypes.func.isRequired,
  onReply: PropTypes.func.isRequired,
};

class PostContent extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      showDeletModal: false,
      deleteing: false,
    };
  }

  handleError = (e) => {
    console.error(e);
    this.setState({
      error: e.message,
    });
  };

  handleConfirmDelete = () => {
    this.setState({
      showDeletModal: true,
    });
  };

  handleCancelDelete = () => {
    this.setState({
      showDeletModal: false,
    });
  };

  handleAddReply = async (text) => {
    try {
      await this.props.onReply(this.props.post.id, text);
    } catch (e) {
      this.handleError(e);
    }
  };

  render() {
    const { error } = this.state;
    const { post } = this.props;
    const { creator_name, name, updated_ts, text, replys } = post;
    const myPost = isMyPost(post);
    return (
      <section className={style.container}>
        {error && <ErrorDialog error={error} />}
        <header className={style.header}>
          <div>
            Posted by {myPost ? 'me' : creator_name} on {utcToLocal(updated_ts)}
          </div>
        </header>
        <div className={style.content}>
          <h5>{name}</h5>
          <pre>{text}</pre>
          <Replys replys={replys} onAdd={this.handleAddReply} />
        </div>
      </section>
    );
  }
}

PostContent.propTypes = propTypes;

export default PostContent;
