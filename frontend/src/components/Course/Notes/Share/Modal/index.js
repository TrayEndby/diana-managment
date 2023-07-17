import React, { useCallback } from 'react';
import PropTypes from 'prop-types';

import ShareItemModal from '../../../../../util/ShareItemModal';

import { validateEmail } from '../../../../../util/helpers';
import notesService from '../../../../../service/NotesService';

const propTypes = {
  noteId: PropTypes.number.isRequired,
  onClose: PropTypes.func.isRequired,
};

const ShareNoteModal = ({ noteId, onClose }) => {
  const handleAddUser = async (val, userId) => {
    if (userId == null) {
      if (!validateEmail(val)) {
        throw new Error('Invalid email address');
      }
      await notesService.shareToEmail(noteId, [val]);
    } else {
      await notesService.shareToUser(noteId, [userId]);
    }
  };

  const handleDeleteUser = async (userToDelete) => {
    return notesService.deleteSharingUser(noteId, userToDelete);
  };

  const fetchList = useCallback(async () => {
    if (noteId == null) {
      return [];
    } else {
      const list = await notesService.listSharingUsers(noteId);
      return list.map(({ user_id, name }) => {
        return {
          user_id,
          user_name: name,
        };
      });
    }
  }, [noteId]);

  return (
    <ShareItemModal
      show={true}
      title="Share note"
      placeholder="Add from contact list or by email address"
      onClose={onClose}
      onFetch={fetchList}
      onAdd={handleAddUser}
      onDelete={handleDeleteUser}
    />
  );
};

ShareNoteModal.propTypes = propTypes;

export default ShareNoteModal;
