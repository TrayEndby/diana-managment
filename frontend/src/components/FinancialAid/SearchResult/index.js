import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import style from './style.module.scss';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

import { DetailHead, DetailIcon } from '../../Admissions/Details';

import withInfiniteApiList from '../../../util/HOC/withInfiniteApiList';

import * as tableStyle from '../../Admissions/Table/style.module.scss';

const propTypes = {
  programs: PropTypes.array.isRequired,
  columns: PropTypes.array.isRequired,
  onSelect: PropTypes.func.isRequired,
  onAddProgram: PropTypes.func.isRequired,
};

class ProgramsSearchResult extends Component {
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
    const { programs, columns, onSelect, onAddProgram, onLoadMore, totalResults } = this.props;
    return (
      <div className={classNames(tableStyle.table, style.container)}>
        <div ref={this.titleRef} className={classNames(style.title, tableStyle.thead)}>
          <DetailHead>Details</DetailHead>
          {columns.map(({ key, text }) => (
            <Col key={key} className={tableStyle.theadTh}>
              {text}
            </Col>
          ))}
        </div>
        <div ref={this.contentRef} className={classNames(tableStyle.tbody, style.content)}>
          <ApiList loadMore={onLoadMore} totalResults={totalResults} items={programs} columns={columns} onClickItem={onSelect} onAdd={onAddProgram} />
        </div>
      </div>
    );
  }
}

const SearchResultRow = ({ columns, item, onClick, onAdd }) => {
  const program = item;

  return (
    <Row
      className={classNames(tableStyle.tbodyRow, 'mx-0 App-clickable')}
      title="Click for get more details"
      onClick={onClick}
    >
      <DetailIcon />
      {columns.map(({ key }) => {
        let val = program[key];
        if (key === 'status') {
          return (
            <Status
              key={key}
              status={val}
              onClick={(e) => {
                e.stopPropagation();
                onAdd(program);
              }}
            />
          );
        } else {
          return (
            <ProgramColumn key={key} title={key} onClick={onClick}>
              {val}
            </ProgramColumn>
          );
        }
      })}
    </Row>
  );
};

const ProgramColumn = ({ title, children, onClick }) => {
  switch (title) {
    case 'name':
    case 'sponsor':
      return <Cell className={classNames('name', tableStyle.tbodyTd)}>{children}</Cell>;
    case 'max_award_amount':
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
  return children ? <Cell>{`$${children.toLocaleString()}`}</Cell> : <Cell></Cell>;
};

const Cell = ({ children, className, ...rest }) => (
  <Col className={classNames(className, tableStyle.tbodyTd)} {...rest}>
    {children}
  </Col>
);

const ApiList = withInfiniteApiList(SearchResultRow);

ProgramsSearchResult.propTypes = propTypes;

export default ProgramsSearchResult;
