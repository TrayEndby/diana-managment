import React, { Component, useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import classNames from 'classnames';
import Button from 'react-bootstrap/Button';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown';
import Card from 'react-bootstrap/Card';
import * as admStyle from '../../Admissions/style.module.scss';
import * as tableStyle from '../../Admissions/Table/style.module.scss';

import EditColumnModal from '../SearchResult/EditColumnModal';
import { DetailHead, DetailIcon } from '../../Admissions/Details';

import getColumnsToDisplay from '../SearchResult/columnsToDisplay';
import * as ROUTES from '../../../constants/routes';
import ErrorDialog from '../../../util/ErrorDialog';
import ConfirmDialog from '../../../util/ConfirmDialog';
import collegeService from '../../../service/CollegeService';

import { LOCAL_STORAGE_COLLEGE_LIST_COLUMN } from '../../../constants/localStorageKeys';

const Default_Columns = ['name', 'status_str', 'state', 'evaluation'];

const EvaluationTypes = collegeService.listEvaluationTypes().map((evaluation) => {
  return {
    id: evaluation,
    name: evaluation,
  };
});

const removeFromList = { id: 0, name: 'Remove from list' };

class MyCollegeList extends Component {
  constructor(props) {
    super(props);
    this.idToStatusMap = new Map();
    this.state = {
      error: null,
      loading: true,
      colleges: [],
      applyStatus: [],
      collegeToRemove: null,
      columns: null,
      showEditColumnModal: false,
      columnsToDisplay: [],
    };
  }

  componentDidMount() {
    this.initialize();
  }

  handleError(e) {
    console.error(e);
    this.setState({
      error: e.message,
    });
  }

  async initialize() {
    try {
      this.setState({ loading: true });
      await this.fetchApplyStatus();
      await this.fetchMyList();
      await this.initializeDisplayColumns();
    } catch (e) {
      this.handleError(e);
    } finally {
      this.setState({ loading: false });
    }
  }

  initializeDisplayColumns = async () => {
    let columns = [];
    let set = new Set();
    let defaultColumns = Default_Columns;
    try {
      let storedColumns = localStorage.getItem(LOCAL_STORAGE_COLLEGE_LIST_COLUMN);
      if (storedColumns) {
        defaultColumns = JSON.parse(storedColumns);
      }
    } catch (e) {
      console.error(e);
    }
    defaultColumns.forEach((name) => set.add(name));
    const columnsToDisplay = await getColumnsToDisplay();
    columns = columnsToDisplay.filter(({ key }) => set.has(key));
    this.setState({
      columns,
      columnsToDisplay,
    });
  };

  async fetchMyList() {
    let colleges = await collegeService.getMyList();
    colleges = colleges.map((college) => {
      return {
        ...college,
        status_str: this.getStatusStrFromId(college.status),
        internal: this.parseInternal(college.internal),
      };
    });
    this.setState({
      colleges,
    });
  }

  async updateMyList(college) {
    try {
      await collegeService.updateMyList({
        ...college,
        internal: JSON.stringify(college.internal),
        status_str: undefined,
      });
    } catch (e) {
      this.handleError(e);
    }
  }

  getStatusStrFromId = (status) => {
    // case when from BE comes value that not Consider or Apply
    if (+status !== 6) {
      status = 4;
    }
    return this.idToStatusMap.get(Number(status));
  };

  parseInternal = (internal) => {
    try {
      let ret = JSON.parse(internal);
      return ret;
    } catch (e) {
      console.error(e);
      return {};
    }
  };

  async fetchApplyStatus() {
    let applyStatus = await collegeService.listCollegeApplyStatus(true);
    applyStatus.push(removeFromList);
    this.setState({
      applyStatus,
    });
    // set idToStatusMap
    this.idToStatusMap = await collegeService.getIdToApplyStatusMap(true);
  }

  setCollegeToRemove = (college) => {
    this.setState({
      collegeToRemove: college,
    });
  };

  handleDelete = async (college) => {
    try {
      const { id } = college;
      await collegeService.deleteFromMyList(id);
      this.setCollegeToRemove(null);
      await this.fetchMyList(); // refresh
    } catch (e) {
      this.handleError(e);
    }
  };

  handleUpdateCollege = (collegeToUpdate, key, newVal) => {
    if (key === 'status') {
      collegeToUpdate = {
        ...collegeToUpdate,
        status: newVal,
        status_str: this.getStatusStrFromId(newVal),
      };
    } else if (key === 'evaluation') {
      collegeToUpdate = {
        ...collegeToUpdate,
        internal: {
          ...collegeToUpdate.internal,
          evaluation: newVal,
        },
      };
    } else {
      return; // edge case
    }

    let { colleges } = this.state;
    colleges = colleges.map((college) => {
      if (college.id === collegeToUpdate.id) {
        return collegeToUpdate;
      } else {
        return college;
      }
    });
    this.setState({ colleges });
    this.updateMyList(collegeToUpdate);
  };

  toggleShowEditColumnModal = (show) => {
    this.setState({
      showEditColumnModal: show,
    });
  };

  handleEditColumns = async (data) => {
    let columns = [];
    let keys = [];
    const columnsToDisplay = await getColumnsToDisplay();
    columnsToDisplay.forEach(({ key, text, category }) => {
      if (data[key]) {
        columns.push({
          key,
          text,
          category,
        });
        keys.push(key);
      }
    });
    this.toggleShowEditColumnModal(false);
    this.setState({
      columns,
    });
    localStorage.setItem(LOCAL_STORAGE_COLLEGE_LIST_COLUMN, JSON.stringify(keys));
  };

  render() {
    const { error, loading, colleges, collegeToRemove, applyStatus, columns, showEditColumnModal } = this.state;
    const headlineSectionClasses = classNames('row m-0 rounded-0', admStyle.headlineSection);
    const headlineClasses = classNames('text-center col-lg', admStyle.headline);

    return (
      <Card className="App-body rounded-0 border-0">
        <Card.Header className={headlineSectionClasses}>
          <Link
            to={ROUTES.ADMISSIONS}
            className="ml-auto mr-auto ml-md-4"
          >
            <Button size="sm">
              Go to admissions management
            </Button>
          </Link>
          <h1 className={headlineClasses}>My colleges list</h1>
          <Button size="sm" className="ml-auto mr-4" onClick={() => this.toggleShowEditColumnModal(true)}>
            Edit columns
          </Button>
          <Link to={ROUTES.COLLEGE_SEARCH}>
            <Button size="sm" className="mr-4">
              College search
            </Button>
          </Link>
        </Card.Header>
        <Card.Body className={admStyle.cardBody}>
          <ErrorDialog error={error} />
          {loading && <p className="text-white">Loading...</p>}
          {!loading && (
            <List
              colleges={colleges}
              applyStatus={applyStatus}
              columns={columns}
              onUpdate={this.handleUpdateCollege}
              onRemove={this.setCollegeToRemove}
            />
          )}
        </Card.Body>
        <ConfirmDialog
          show={collegeToRemove != null}
          title="Remove from list"
          onSubmit={() => this.handleDelete(collegeToRemove)}
          onClose={() => this.setCollegeToRemove(null)}
        >
          Are you sure you want to remove the college from the list?
        </ConfirmDialog>
        {showEditColumnModal && (
          <EditColumnModal
            columnsToDisplay={this.state.columnsToDisplay}
            columns={columns}
            onSubmit={this.handleEditColumns}
            onClose={() => this.toggleShowEditColumnModal(false)}
          />
        )}
      </Card>
    );
  }
}

// XXX TODO: generalize it with CollegeSearchResult
class List extends Component {
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
    const { colleges, columns, applyStatus, onUpdate, onRemove } = this.props;
    return (
      <div className={tableStyle.contentWrap}>
        <div className={tableStyle.table}>
          <div ref={this.titleRef} className={tableStyle.thead}>
            <DetailHead>College details</DetailHead>
            {columns.map(({ key, text }) => (
              <div key={key} className={tableStyle.theadTh}>
                {text}
              </div>
            ))}
          </div>
          <div ref={this.contentRef} className={tableStyle.tbody}>
            {colleges.map((college) => {
              return (
                <ListRow
                  key={college.id}
                  college={college}
                  columns={columns}
                  applyStatus={applyStatus}
                  onUpdate={onUpdate}
                  onRemove={onRemove}
                />
              );
            })}
          </div>
        </div>
      </div>
    );
  }
}

const ListRow = ({ college, columns, applyStatus, onUpdate, onRemove }) => {
  const history = useHistory();
  const { internal } = college;
  if (!internal || Object.keys(internal).length === 0) {
    return null;
  }
  const { evaluation } = internal;
  const handleGoToCollegeDetail = () => {
    history.push(`${ROUTES.COLLEGE_DETAIL}?collegeId=${college.college_id}`);
  };

  return (
    <div className={tableStyle.tbodyRow}>
      <DetailIcon onClick={handleGoToCollegeDetail} />
      {columns.map(({ key, category }) => {
        // let val = college[key];
        let val = internal[key];
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
            <div key={key} className={tableStyle.tbodyTd}>
              <TypeDropdown
                value={college[key]}
                options={applyStatus}
                onSelect={(value) => onUpdate(college, 'status', value)}
                onRemove={() => onRemove(college)}
              />
            </div>
          );
        }
        if (key === 'evaluation') {
          return (
            <div key={key} className={tableStyle.tbodyTd}>
              <TypeDropdown
                value={evaluation}
                options={EvaluationTypes}
                onSelect={(value) => onUpdate(college, 'evaluation', value)}
              />
            </div>
          );
        }
        if (key === 'inStateTuition' || key === 'outStateTuition' || key === 'averagePrice') {
          if (val) {
            return (
              <div key={key} className={tableStyle.tbodyTd}>
                ${val.toLocaleString()}/yr
              </div>
            );
          }
        }

        return (
          <div className={tableStyle.tbodyTd} key={key} title={key}>
            {val}
          </div>
        );
      })}
    </div>
  );
};

export const TypeDropdown = ({ value, options, onSelect, onRemove, onClick }) => {
  const [color, setColor] = useState();
  // adding what items and how should be colored;
  const themes = {
    green: ['Applying', 'Target', 'Accepted', 'Restricted Early Action', 'Early Action', 'Complete', 'Recommended'],
    orange: ['Reach', 'Waitlist, Priority waitlist', 'Early Decision', 'Required', 'Not taken', 'Not started'],
  };

  const handleSelect = (value) => {
    fillColor(value);
    onSelect(value);
  };

  const fillColor = (val) => {
    let n, c;
    if (!val) return null;
    if (isNaN(val)) {
      n = options.find((item) => item.name === val).name;
    } else {
      n = options.find((item) => item.id === +val).name;
    }
    c = Object.keys(themes).find((item) => themes[item].includes(n));
    setColor(c);
  };

  useEffect(() => {
    fillColor(value);
  });

  let classNameStr = classNames(
    tableStyle.tDropdown,
    { [tableStyle['tDropdownGreen']]: color === 'green' },
    { [tableStyle['tDropdownOrange']]: color === 'orange' },
  );
  return (
    <DropdownButton className={classNameStr} size="sm" title={value} onClick={onClick}>
      {options.map(({ id, name }) => {
        if (name === value) {
          return null;
        }
        if (id === 0) {
          return (
            <Dropdown.Item key={id} eventKey={id} onSelect={onRemove}>
              {name}
            </Dropdown.Item>
          );
        }
        return (
          <Dropdown.Item key={id} eventKey={id} onSelect={handleSelect}>
            {name}
          </Dropdown.Item>
        );
      })}
    </DropdownButton>
  );
};

export default MyCollegeList;
