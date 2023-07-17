import React from 'react';
import ReactMarkdown from 'react-markdown';
import classNames from 'classnames';

const Markdown = (props) => (
  <ReactMarkdown
    renderers={{
      link: (props) =>
        props.href[0] !== '#' ? (
          <a href={props.href} rel="noopener noreferrer" target="_blank">
            {props.children}
          </a>
        ) : (
          <a href={props.href} target="_self">
            {props.children}
          </a>
        ),
    }}
    {...props}
    className={classNames("react-markdown", props.className)}
  />
);

export default React.memo(Markdown);
