import React, { useState } from 'react';
import PropTypes from 'prop-types';

import Badge from 'react-bootstrap/Badge';
import { Plus, X } from 'react-bootstrap-icons';

import AddNameModal from '../../../../util/AddNameModal';

const propTypes = {
  tags: PropTypes.string,
  shared: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
};

const DELIM = ',';

const TagsSection = ({ tags, shared, onChange }) => {
  const [showAddTagModal, setShowAddTagModal] = useState(false);

  const handleAddTag = (tag) => {
    tag = tag.trim();
    if (!/^[A-Za-z0-9_-\s]*$/.test(tag)) {
      throw new Error('Tag can only inlcude letters, numbers, space, _ or -');
    } else if (tags && tags.includes(tag)) {
      throw new Error(`Tag ${tag} already exists`);
    } else {
      const newTags = tags ? tags + DELIM + tag : tag;
      onChange(newTags);
    }
  };

  const handleDeleteTag = (tagToDelete) => {
    const splitTags = tags.split(DELIM).filter((tag) => tag !== tagToDelete);
    onChange(splitTags.join(DELIM));
  };

  return (
    <div className="d-flex flex-wrap my-1 align-items-center">
      {tags && 'Tags'}
      {tags &&
        tags.split(DELIM).map((tag, index) => (
          <Badge key={index} pill variant="primary" className="d-flex align-items-center px-1 mx-1">
            <span className="mx-1">{tag}</span>
            <X className="App-clickable" onClick={() => handleDeleteTag(tag)} />
          </Badge>
        ))}
      {!shared && (
        <div className="ml-1 d-flex align-items-center App-clickable" onClick={() => setShowAddTagModal(true)}>
          <Plus />
          Add tag
        </div>
      )}
      <AddNameModal
        show={showAddTagModal}
        title="Add tag"
        onSubmit={handleAddTag}
        onClose={() => setShowAddTagModal(false)}
      />
    </div>
  );
};

TagsSection.propTypes = propTypes;

export default TagsSection;
