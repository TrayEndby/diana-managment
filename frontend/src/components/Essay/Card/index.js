import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import Card from 'react-bootstrap/Card';
import { Trash } from 'react-bootstrap-icons';

import FrameCard from '../../../util/FrameCard';

const propTypes = {
  view: PropTypes.string,
  essay: PropTypes.object,
  selected: PropTypes.bool,
  size: PropTypes.string,
  onClick: PropTypes.func,
};

const EssayCard = ({ view, essay, selected, size, shared, onClick, onDelete }) =>
  view === 'grid' ? (
    <EssayGridView essay={essay} selected={selected} onClick={onClick} onDelete={onDelete} />
  ) : (
    <EssayListView essay={essay} selected={selected} size={size} shared={shared} onClick={onClick} onDelete={onDelete} />
  );

const EssayGridView = ({ essay, selected, onClick, onDelete }) => {
  const { title, prompt, text, theme, year, word_count } = essay;
  return (
    <FrameCard
      className={classNames('m-2', { 'bg-warning': selected })}
      onClick={onClick}
      style={{ cursor: 'pointer' }}
      ratio={0.57}
      img={
        <div className={classNames('p-2 bg-secondary text-light')}>
          {prompt && <Card.Text className="App-textOverflow App-text-orange">{prompt}</Card.Text>}
          {text || 'No Preview'}
        </div>
      }
    >
      <h6>{title}</h6>
      <div className="row m-0 p-0">
        {theme && <Card.Text className="App-textOverflow p-0 mb-0 mr-2">{theme}</Card.Text>}
        {year && <Card.Text className="App-textOverflow p-0 mb-0 mr-2">Year {year}</Card.Text>}
        {word_count != null && (
          <Card.Text className="App-textOverflow p-0 mb-0">
            {word_count.toLocaleString()} {word_count > 1 ? 'words' : 'word'}
          </Card.Text>
        )}
        <DeleteIcon essay={essay} onDelete={onDelete} />
      </div>
    </FrameCard>
  );
};

const EssayListView = ({ essay, selected, size, shared, onClick, onDelete }) => {
  const cardStyle = { width: '100%', cursor: 'pointer' };
  const promptStyle = {
    width: 40,
    height: 40,
    fontSize: '5px',
    whiteSpace: 'pre-line',
  };
  const fontStyle = size === 'sm' ? { fontSize: '14px' } : {};
  const cardClass = classNames('flex-row rounded-0 border-0 my-2 p-2 align-items-center', { 'bg-warning': selected });
  const { title, prompt, text, theme, year, college, word_count } = essay;
  return (
    <Card className={cardClass} onClick={onClick} style={cardStyle}>
      <div className="p-1 bg-secondary text-light overflow-hidden" style={promptStyle}>
        {prompt && <Card.Text className="App-textOverflow App-text-orange">{prompt}</Card.Text>}
        {text || 'No Preview'}
      </div>
      <div className="col ml-2 px-0">
        <h6 className="App-textOverflow" style={{ ...fontStyle }}>
          {title}
        </h6>
        {year && (
          <div className="App-textOverflow" style={{ ...fontStyle }}>
            Year {year}
          </div>
        )}
      </div>
      {size !== 'sm' && theme && <ListViewRow>{theme}</ListViewRow>}
      {size !== 'sm' && college && <ListViewRow>{college}</ListViewRow>}
      {word_count != null && (
        <Card.Text className="App-textOverflow p-0 mb-0">
          {word_count.toLocaleString()} {word_count > 1 ? 'words' : 'word'}
        </Card.Text>
      )}
      {shared &&
      <Card.Text className="ml-auto mr-2 mb-0">
        Shared
      </Card.Text>}
      <DeleteIcon essay={essay} onDelete={onDelete} />
    </Card>
  );
};

const DeleteIcon = ({ essay, onDelete }) => {
  if (!onDelete) {
    return null;
  }
  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete(essay);
  };

  return (
    <Card.Text className="ml-auto mr-2 mb-0 hover-darkBg">
      <Trash onClick={handleDelete} />
    </Card.Text>
  );
};

const ListViewRow = ({ children }) => <div className="col ml-2 App-textOverflow px-0">{children}</div>;

EssayCard.propTypes = propTypes;

export default EssayCard;
