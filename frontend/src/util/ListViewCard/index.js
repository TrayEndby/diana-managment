import React from 'react';
import PropTypes from 'prop-types';

import Card from 'react-bootstrap/Card';

import Picture from '../Picture';

const propTypes = {
  title: PropTypes.string.isRequired,
  img: PropTypes.string,
  picture_id: PropTypes.any,
  children: PropTypes.node,
  onClick: PropTypes.func,
};

const ListViewCard = ({ title, img, picture_id, children, onClick }) => {
  const size = { width: '168px', height: '94px' };
  return (
    <Card className="flex-row rounded-0 border-0 m-3" onClick={onClick} style={{ cursor: 'pointer' }}>
      <div className="p-0" style={size}>
        {picture_id ? (
          <Picture
            id={picture_id}
            alt={title}
            style={{ objectFit: 'fill', ...size }}
          />
        ) : (
          <img style={size} src={img} alt={title} loading="lazy" />
        )}
      </div>
      <div className="col p-0 pl-1">
        <Card.Title as="h6" className="block-with-text-2 mb-1">
          {title}
        </Card.Title>
        <div className="row m-0 p-0">{children}</div>
      </div>
    </Card>
  );
};

ListViewCard.propTypes = propTypes;

export default ListViewCard;
