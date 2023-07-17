import React, { useCallback } from 'react';
import PropTypes from 'prop-types';

import ShareItemModal from 'util/ShareItemModal';

import writingService, { ShareType } from 'service/WritingService';

const propTypes = {
  article_id: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  onChange: PropTypes.func,
  onClose: PropTypes.func.isRequired,
};

const ShareWritingModal = ({ article_id, title, onChange, onClose }) => {
  const handleAddUser = async (_val, userId) => {
    if (typeof onChange === 'function') {
      onChange('addShareUser');
    }
    return writingService.share(article_id, userId, ShareType.Comment);
  };

  const handleDeleteUser = async (userToDelete) => {
    if (typeof onChange === 'function') {
      onChange('deleteShareUser');
    }
    return writingService.deleteSharedUsers(article_id, userToDelete);
  };

  const fetchList = useCallback(async () => {
    if (article_id == null) {
      return [];
    } else {
      return writingService.listSharedUsers(article_id);
    }
  }, [article_id]);

  return (
    <ShareItemModal
      show={true}
      title={title}
      placeholder="Add from contact list"
      onClose={onClose}
      onFetch={fetchList}
      onAdd={handleAddUser}
      onDelete={handleDeleteUser}
    />
  );
};

ShareWritingModal.propTypes = propTypes;

export default ShareWritingModal;
