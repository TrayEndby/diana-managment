import React, { useState, useEffect, useRef } from 'react';
import { withRouter } from 'react-router-dom';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import ReactQuill, { Quill } from 'react-quill-2';
import QuillBetterTable from 'quill-better-table';

import { useDebouncedCallback } from 'use-debounce';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

import CustomToolbar, { toolbar } from './CustomToolbar';
import AddCommentButton from './AddCommentButton';
import CommentCard from './Comment';
import ShareWritingModal from './Share';
import CloseButton from 'util/CloseButton';

import {
  initializeQuill,
  restoreFromDelta,
  getComments,
  newComment,
  addComment,
  removeComment,
  getSelectedPosition,
  parseSelectedCommentId,
} from './util';
import ErrorDialog from '../../../util/ErrorDialog';
import useErrorHandler from '../../../util/hooks/useErrorHandler';
import writingService from '../../../service/WritingService';

import 'react-quill-2/dist/quill.snow.css';
import 'quill-better-table/dist/quill-better-table.css';
import style from './style.module.scss';

const modules = initializeQuill(Quill, QuillBetterTable, toolbar);

const propTypes = {
  articleId: PropTypes.number,
  shareTitle: PropTypes.string,
  titleReadOnly: PropTypes.bool,
  contentReadOnly: PropTypes.bool,
  noShare: PropTypes.bool,
  onChange: PropTypes.func,
  onClose: PropTypes.func.isRequired,
};

const ComposePage = ({
  match,
  articleId,
  shareTitle,
  titleReadOnly,
  contentReadOnly,
  noShare,
  onChange,
  onClose,
}) => {
  const [title, setTitle] = useState('');
  const [oldTitle, setOldTitle] = useState('');
  const [oldContents, setOldContents] = useState('');
  const [saving, setSaving] = useState(false);
  const [selectedRange, setSelectedRange] = useState(null);
  const [selectedCommentId, setSelectedCommentId] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentToAdd, setCommentToAdd] = useState(null);
  const [shared, setShared] = useState(false);
  const [user, setUser] = useState('');
  const [showShareModal, setShowShareModal] = useState(false);
  const [error, setError] = useErrorHandler();
  const quillRef = useRef();
  const id = articleId || match.params.id;

  useEffect(() => {
    writingService
      .get(id)
      .then((article) => {
        const { diffs } = article;
        setTitle(article.title);
        setOldTitle(article.title);
        setShared(article.shared);
        setUser(article.user);
        const editor = getEditor();
        // window.editor = editor
        const restored = restoreFromDelta(editor, diffs);
        editor.setContents(restored);
        const oldContents = editor.getContents();
        setOldContents(oldContents);
        setComments(getComments(oldContents));
      })
      .catch(setError);
  }, [id, setError]);

  const getEditor = () => quillRef.current.getEditor();
  const getContents = () => getEditor().getContents();

  const saveChange = async () => {
    try {
      if (saving) {
        console.info('still saving...');
        return;
      }
      setError(null);
      setSaving(true);
      const newContents = getContents();
      const delta = oldContents.diff(newContents);
      if (delta.ops.length > 0 || title !== oldTitle) {
        await writingService.update(id, title, delta.ops);
        setOldContents(newContents);
        setOldTitle(title);

        if (title !== oldTitle && typeof onChange === 'function') {
          onChange('title');
        }
      }
    } catch (e) {
      setError(e);
    } finally {
      setSaving(false);
    }
  };

  const debounced = useDebouncedCallback(
    // function
    saveChange,
    // delay in ms
    2000,
  );

  const handleSetValue = () => {
    debounced.callback();
  };

  const handleSetTitle = (e) => {
    setTitle(e.target.value);
    debounced.callback();
  };

  const handleChangeSelection = (range) => {
    if (!range) {
      return;
    } else if (range.length > 0) {
      const commentId = parseSelectedCommentId(getEditor(), range);
      if (commentId) {
        setSelectedCommentId(commentId);
        setSelectedRange(null);
      } else {
        setSelectedCommentId(null);
        setSelectedRange(range);
      }
    } else {
      handleCloseComment();
    }
  };

  const handleCloseComment = () => {
    // if (selectedRange != null) {
    //   unHighlight(getEditor(), selectedRange);
    // }
    setCommentToAdd(null);
    setSelectedRange(null);
  };

  const handleNewComment = () => {
    // highlight(getEditor(), selectedRange);
    setCommentToAdd(newComment());
    // setTimeout(() => {
    //   setCommentToAdd(newComment());
    // }, 100);
  };

  const handleAddComment = (comment) => {
    addComment(getEditor(), selectedRange, comment);
    setComments(getComments(getContents().ops));
    handleCloseComment();
    saveChange();
  };

  const handleDeleteComment = (comment_id) => {
    const newOps = removeComment(getEditor(), comment_id);
    setComments(getComments(newOps));
    saveChange();
  };

  const handleSelectComment = (comment) => {
    // window.editor = getEditor();
    // document.querySelectorAll('ql')
  };

  return (
    <div id="essay-compose-wrapper" className={classNames(style.wrapper)}>
      <ErrorDialog error={error} />
      <div className={style.header}>
        {shared || titleReadOnly ? (
          <div className={style.title}>{title}</div>
        ) : (
          <Form.Control
            className={style.title}
            placeholder="Add title"
            value={title}
            onChange={handleSetTitle}
          />
        )}
        {saving && <div className={style.status}>Saving...</div>}
        {shared && (
          <div className="ml-auto">
            {user ? `Shared by ${user}` : 'Shared'}{' '}
          </div>
        )}
        {!shared && !noShare && (
          <Button className="ml-auto" onClick={() => setShowShareModal(true)}>
            Share
          </Button>
        )}
        <CloseButton className="ml-2" dark onClick={onClose} />
      </div>
      <div className={style.container}>
        <div id="essay-compose" className={style.writing}>
          <CustomToolbar />
          <ReactQuill
            ref={quillRef}
            theme="snow"
            defaultValue={''}
            modules={modules}
            readOnly={shared || contentReadOnly}
            onChange={handleSetValue}
            onChangeSelection={handleChangeSelection}
            bounds='#essay-compose-wrapper'
          />
          {selectedRange != null && commentToAdd == null && (
            <AddCommentButton
              {...getSelectedPosition(getEditor(), selectedRange)}
              onClick={handleNewComment}
            />
          )}
        </div>
        {(comments.length > 0 || commentToAdd != null) && (
          <div className={style.comments}>
            {commentToAdd != null && (
              <CommentCard
                comment={commentToAdd}
                editable
                onSubmit={handleAddComment}
                onCancel={handleCloseComment}
              />
            )}
            {comments.map((comment, index) => (
              <CommentCard
                key={index}
                comment={comment}
                selected={comment.id === selectedCommentId}
                onClick={handleSelectComment}
                onDelete={handleDeleteComment}
              />
            ))}
          </div>
        )}
      </div>
      {showShareModal && (
        <ShareWritingModal
          article_id={id}
          title={shareTitle}
          onChange={onChange}
          onClose={() => setShowShareModal(false)}
        />
      )}
    </div>
  );
};

ComposePage.propTypes = propTypes;

export default withRouter(ComposePage);
