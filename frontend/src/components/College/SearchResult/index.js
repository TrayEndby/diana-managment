import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import style from './style.module.scss';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

import { DetailHead, DetailIcon } from '../../Admissions/Details';

import withInfiniteList from '../../../util/HOC/withInfiniteList';

import * as tableStyle from '../../Admissions/Table/style.module.scss';

const propTypes = {
  colleges: PropTypes.array.isRequired,
  columns: PropTypes.array.isRequired,
  onSelect: PropTypes.func.isRequired,
  onAddCollege: PropTypes.func.isRequired,
};

class CollegeSearchResult extends Component {
  constructor(props) {
    super(props);
    this.titleRef = React.createRef();
    this.contentRef = React.createRef();
  }

  componentDidMount() {
    this.contentRef.current.addEventListener('scroll', () => {
      this.titleRef.current.scrollLeft = this.contentRef.current.scrollLeft;
    });

    this.titleRef.current.addEventListener('scroll', () => {
      this.contentRef.current.scrollLeft = this.titleRef.current.scrollLeft;
    });
  }

  render() {
    const { colleges, columns, onSelect, onAddCollege } = this.props;
    return (
      <div className={classNames(tableStyle.table, style.container)}>
        <div ref={this.titleRef} className={classNames(style.title, tableStyle.thead)}>
          <DetailHead>College details</DetailHead>
          {columns.map(({ key, text }) => (
            <Col key={key} className={tableStyle.theadTh}>
              {text}
            </Col>
          ))}
        </div>
        <div ref={this.contentRef} className={classNames(tableStyle.tbody, style.content)}>
          <List items={colleges} columns={columns} onClickItem={onSelect} onAdd={onAddCollege} />
        </div>
      </div>
    );
  }
}

const SearchResultRow = ({ columns, item, onClick, onAdd }) => {
  const college = item;
  return (
    <Row
      className={classNames(tableStyle.tbodyRow, 'mx-0 App-clickable')}
      title="Click for get more details"
      onClick={onClick}
    >
      <DetailIcon />
      {columns.map(({ key, category }) => {
        let val = college[key];
        if (category === 'Sports') {
          let [sportGender, sportId] = key.split('-');
          sportId = Number(sportId);
          if (college[sportGender]) {
            val = college[sportGender][sportId - 1];
          } else {
            val = '';
          }
        }
        if (key === 'status_str') {
          return (
            <Status
              key={key}
              status={val}
              onClick={(e) => {
                e.stopPropagation();
                onAdd(college);
              }}
            />
          );
        } else {
          return (
            <CollegeColumn key={key} title={key} onClick={onClick}>
              {val}
            </CollegeColumn>
          );
        }
      })}
    </Row>
  );
};

const CollegeColumn = ({ title, children, onClick }) => {
  switch (title) {
    case 'name':
      return <Cell className={classNames('name', tableStyle.tbodyTd)}>{children}</Cell>;
    case 'inStateTuition':
    case 'outStateTuition':
      return <Cost>{children}</Cost>;
    default:
      return <Cell>{children}</Cell>;
  }
};

const Status = ({ status, onClick }) => (
  <Cell>
    {status ? (
      status
    ) : (
      <Button size="sm" className="btn-primary text-white" onClick={onClick}>
        add to list
      </Button>
    )}
  </Cell>
);

const Cost = ({ children }) => {
  return children ? <Cell>{`$${children.toLocaleString()}/yr`}</Cell> : <Cell></Cell>;
};

const Cell = ({ children, className, ...rest }) => (
  <Col className={classNames(className, tableStyle.tbodyTd)} {...rest}>
    {children}
  </Col>
);

const List = withInfiniteList(SearchResultRow);

CollegeSearchResult.propTypes = propTypes;

export default CollegeSearchResult;
