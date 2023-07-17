import React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
};

const DetailText = ({ children, className }) => {
  if (!children) {
    return null;
  }
  // return <div dangerouslySetInnerHTML={{ __html: children }} />
  const ch = String.fromCharCode(10);
  children = children.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
  return (
    <div className={className}>
      {children.split(ch).map((line, index) => (
        <p key={index}>{line}</p>
      ))}
    </div>
  );
};

DetailText.propTypes = propTypes;

export default DetailText;
