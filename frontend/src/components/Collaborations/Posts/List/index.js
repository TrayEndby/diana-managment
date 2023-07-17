import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import PostContent from '../Post';

const propTypes = {
  posts: PropTypes.array.isRequired,
  onDelete: PropTypes.func.isRequired,
  onReply: PropTypes.func.isRequired,
};

const PostsList = ({ posts, onDelete, onReply }) => {
  const [normalizedPosts, setPosts] = useState([]);
  // XXX TODO: use paging
  useEffect(() => {
    // normalize post
    try {
      const resPosts = [];
      const map = new Map(); // id to post map
      if (posts) {
        posts.forEach((res) => {
          if (res.parent_item) {
            // this is a reply
            const reply = res;
            const post = map.get(reply.parent_item);
            if (post) {
              post.replys.push(reply);
            }
          } else {
            // this is a post
            const post = {
              ...res,
              replys: [],
            };
            resPosts.push(post);
            map.set(post.id, post);
          }
        });
      }
      resPosts.reverse(); // last post comes first
      // resPosts.forEach(({ replys }) => replys.reverse()); // last reply comes first
      setPosts(resPosts);
    } catch (e) {
      console.error(e);
      throw e;
    }
  }, [posts]);

  return (
    <>
      {normalizedPosts.map((post) => (
        <PostContent key={post.id} post={post} onDelete={onDelete} onReply={onReply} />
      ))}
    </>
  );
};

PostsList.propTypes = propTypes;

export default React.memo(PostsList);
