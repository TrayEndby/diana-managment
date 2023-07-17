import React from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';

import Card from 'react-bootstrap/Card';
import { Trash } from 'react-bootstrap-icons';

import ListViewCard from '../../../util/ListViewCard';
import FrameCard from '../../../util/FrameCard';
import courseService from '../../../service/CourseService';

const propTypes = {
  course: PropTypes.object,
  view: PropTypes.string,
  onDelete: PropTypes.func,
};

const CourseCard = ({ view, course, onDelete }) => {
  const history = useHistory();
  const handleClick = () => {
    let url = courseService.getWatchURL(course);
    history.push(url);
  };

  return view === 'grid' ? (
    <CourseGridView course={course} onClick={handleClick} onDelete={onDelete} />
  ) : (
    <CourseListView course={course} onClick={handleClick} onDelete={onDelete} />
  );
};

const CourseListView = ({ course, onClick, onDelete }) => {
  const { thumbnail, title, views, duration } = course;
  return (
    <ListViewCard title={title} img={thumbnail} onClick={onClick}>
      <Card.Text className="App-textOverflow p-0 mb-0 text-dark mr-2">{formatView(views)}</Card.Text>
      <Card.Text className="App-textOverflow p-0 mb-0 text-dark">Duration: {toHH_MM_SS(duration)}</Card.Text>
      <DeleteIcon course={course} onDelete={onDelete} />
    </ListViewCard>
  );
};

const CourseGridView = ({ course, onClick, onDelete }) => {
  const { thumbnail, title, views, duration } = course;
  if (!title || !thumbnail) {
    // a quick way to detect invalid
    return null;
  }
  return (
    <FrameCard className="my-4" onClick={onClick} img={<img src={thumbnail} alt={title} />}>
      <h6>{title}</h6>
      <div className="row m-0 p-0">
        <Card.Text className="App-textOverflow p-0 mb-0">{formatView(views)}</Card.Text>
        <Card.Text className="App-textOverflow p-0 mb-0 ml-2">Duration: {toHH_MM_SS(duration)}</Card.Text>
        <DeleteIcon course={course} onDelete={onDelete} />
      </div>
    </FrameCard>
  );
};

const DeleteIcon = ({ course, onDelete }) => {
  if (!onDelete) {
    return null;
  }
  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete(course);
  };

  return (
    <Card.Text className="ml-auto mb-0 App-clickable">
      <Trash onClick={handleDelete} />
    </Card.Text>
  );
};

const toHH_MM_SS = (secs) => {
  if (isNaN(secs)) {
    return 'N/A';
  }
  let sec_num = parseInt(secs, 10);
  let hours = Math.floor(sec_num / 3600);
  let minutes = Math.floor(sec_num / 60) % 60;
  let seconds = sec_num % 60;

  return [hours, minutes, seconds]
    .map((v) => (v < 10 ? '0' + v : v))
    .filter((v, i) => v !== '00' || i > 0)
    .join(':');
};

const formatView = (num) => {
  if (num == null) {
    return '';
  } else if (num < 1) {
    return `${num} view`;
  } else {
    return `${num.toLocaleString()} views`;
  }
};

CourseCard.propTypes = propTypes;

export default CourseCard;
