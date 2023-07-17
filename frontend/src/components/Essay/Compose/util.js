import authService from 'service/AuthService';
import moment from 'moment';

const _highlight = (editor, range, color, source) => {
  editor.formatText(range.index, range.length, 'background', color, source);
};

const _addCommentAttribute = (editor, range, value) => {
  editor.formatText(range.index, range.length, 'comment', value, 'api');
};

export const highlight = (editor, range, source = 'silent') =>
  _highlight(editor, range, '#fff72b', source);

export const unHighlight = (editor, range, source = 'silent') =>
  _highlight(editor, range, '', source);

export const newComment = (text) => {
  return {
    id: authService.genId(),
    user_id: authService.getUID(),
    user_name: authService.getDisplayName(),
    time: moment.utc().format(),
    text: text || '',
    type: 'comment',
  };
};

export const addComment = (editor, range, text) => {
  const value = JSON.stringify(newComment(text));
  _addCommentAttribute(editor, range, value);
  highlight(editor, range, 'api');
  return value;
};

export const getComments = (ops) => {
  if (ops == null) {
    return [];
  }
  const comments = [];
  ops.forEach(({ attributes }) => {
    if (attributes != null && attributes.comment != null) {
      try {
        const comment = JSON.parse(attributes.comment);
        if (comment.type === 'comment') {
          comments.push(comment);
        }
      } catch {
        // skip
      }
    }
  });
  return comments;
};

export const removeComment = (editor, comment_id) => {
  const ops = editor.getContents().ops;
  const newOps = ops.map((op) => {
    const { attributes } = op;
    if (attributes != null && attributes.comment != null) {
      try {
        const comment = JSON.parse(attributes.comment);
        if (comment.type === 'comment' && comment.id === comment_id) {
          return {
            ...op,
            attributes: {
              ...attributes,
              background: undefined,
              comment: undefined,
            },
          };
        }
      } catch {
        // skip
      }
    }
    return op;
  });
  editor.setContents(newOps);
  return newOps;
};

export const getSelectedPosition = (editor, range) => {
  try {
    const bounds = editor.getBounds(range.index);

    return bounds;
  } catch (e) {
    console.error(e);
    return {};
  }
};

export const parseSelectedCommentId = (editor, range) => {
  try {
    const node = editor.getLeaf(range.index + 1)[0];
    const attributes = node?.parent?.attributes;
    if (!attributes) {
      return null;
    }

    if (attributes.attributes && attributes.attributes['comment']) {
      const comment = JSON.parse(attributes.domNode.getAttribute('ql-comment'));
      return comment.id;
    } else {
      return null;
    }
  } catch (e) {
    console.error(e);
    return null;
  }
};

export const restoreFromDelta = (editor, diffs) => {
  const Delta = editor.editor.delta.constructor;
  let restored = new Delta();
  for (let diff of diffs) {
    restored = restored.compose(new Delta(diff));
  }
  return restored;
};

export const initializeQuill = (Quill, QuillBetterTable, toolbar) => {
  const Parchment = Quill.import('parchment');
  const CommentAttr = new Parchment.Attributor('comment', 'ql-comment', {
    scope: Parchment.Scope.INLINE,
  });

  Quill.register(
    {
      'modules/better-table': QuillBetterTable,
    },
    true,
  );

  Quill.register(CommentAttr, true);

  const modules = {
    // toolbar: [
    //   [{ header: [1, 2, false] }],
    //   ['bold', 'italic', 'underline', 'strike', 'blockquote'],
    //   [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }, { align: [] }],
    //   [{ color: [] }, { background: [] }],
    //   ['link', 'image'],
    //   ['clean'],
    // ],
    toolbar,
    table: false, // disable table module
    'better-table': {
      operationMenu: {
        items: {
          unmergeCells: {
            text: 'Another unmerge cells name',
          },
        },
      },
    },
    keyboard: {
      bindings: QuillBetterTable.keyboardBindings,
    },
  };

  // rewrite links
  const Link = Quill.import('formats/link');
  const builtInFunc = Link.sanitize;
  Link.sanitize = function customSanitizeLinkInput(linkValueInput) {
    let val = linkValueInput;
    // do nothing, since this implies user's already using a custom protocol
    if (/^\w+:/.test(val));
    else if (!/^https?:/.test(val)) val = 'http://' + val;

    return builtInFunc.call(this, val); // retain the built-in logic
  };

  return modules;
};
