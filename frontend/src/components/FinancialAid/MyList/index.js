import React, { Component } from 'react';
import { Link, useHistory } from 'react-router-dom';
import classNames from 'classnames';
import Button from 'react-bootstrap/Button';
import { TypeDropdown } from '../../College/MyList';
import Card from 'react-bootstrap/Card';
import * as admStyle from '../../Admissions/style.module.scss';
import * as tableStyle from '../../Admissions/Table/style.module.scss';
import { getNameFromId } from '../../../util/helpers';
import { DetailHead, DetailIcon } from '../../Admissions/Details';

import * as ROUTES from '../../../constants/routes';
import ErrorDialog from '../../../util/ErrorDialog';
import ConfirmDialog from '../../../util/ConfirmDialog';
import financialAidService from '../../../service/FinancialAidService';

export const defaultColumnsToDisplay = [
  { key: 'name', text: 'Name', category: '' },
  { key: 'status', text: 'Status' },
  { key: 'sponsor', text: 'Sponsor' },
  { key: 'award_type', text: 'Award type' },
  { key: 'max_award_amount', text: 'Max amount' },
  { key: 'deadline', text: 'Deadline' },
];

export const fetchApplyStatus = async () => {
  let applyStatusResponse = await financialAidService.GetFinAidConstants();
  applyStatusResponse = applyStatusResponse.user_finaid_status;
  return normalizeMapList(applyStatusResponse)
}

export const normalizeMapList = (lists) => {
  let ret = [];
  ret = Object.keys(lists).map(key => ({ id: lists[key], name: key }))
  return ret
};

class MyFinAidList extends Component {
  constructor(props) {
    super(props);
    this.idToStatusMap = new Map();
    this.state = {
      error: null,
      loading: true,
      programs: [],
      applyStatus: [],
      programToRemove: null,
      columns: defaultColumnsToDisplay,
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
      const normalizedApplyStatus = await fetchApplyStatus();
      normalizedApplyStatus.push({ id: 0, name: 'Remove from list' })

      this.setState({
        applyStatus: normalizedApplyStatus,
      });

      await this.fetchMyList();
    } catch (e) {
      this.handleError(e);
    } finally {
      this.setState({ loading: false });
    }
  }

  async fetchMyList() {
    const myFinAidList = await financialAidService.GetUserFinAidList();
    if (Object.keys(myFinAidList).length === 0) return

    const requestData = myFinAidList.map(item => ({ 'finaid_id': item.finaid_id }));
    let programsData = await financialAidService.GetFinAidList(requestData);

    const statusedProgramData = programsData.map(item => {
      const status = myFinAidList.find(x => x.finaid_id === item.id)?.status;
      return {
        ...item,
        status
      }
    });

    this.setState({
      programs: statusedProgramData,
    });
  }

  async updateMyList(finaid_id, status) {
    try {
      await financialAidService.UpdateUserFinAid([{
        finaid_id,
        status
      }]);
    } catch (e) {
      this.handleError(e);
    }
  }

  setProgramToRemove = (program) => {
    this.setState({
      programToRemove: program,
    });
  };

  handleDelete = async (id) => {
    try {
      await financialAidService.DeleteUserFinAid(id);
      this.setProgramToRemove(null);
      const filteredPrograms = this.state.programs.filter(x => x.id !== id);
      this.setState({ programs: filteredPrograms });
    } catch (e) {
      this.handleError(e);
    }
  };

  handleUpdateProgram = (finaid_id, status) => {
    const { programs } = this.state;
    const refreshedPrograms = programs.map(program => {
      return (program.id === finaid_id) ? { ...program, ...{ status: +status } } : program
    })

    this.setState({ programs: refreshedPrograms });
    this.updateMyList(finaid_id, +status);
  };

  render() {
    const { error, loading, programs, programToRemove, applyStatus, columns } = this.state;
    const headlineSectionClasses = classNames('row m-0 rounded-0', admStyle.headlineSection);
    const headlineClasses = classNames('text-center col-lg', admStyle.headline);

    return (
      <Card className="App-body rounded-0 border-0">
        <Card.Header className={headlineSectionClasses}>
          <h1 className={headlineClasses}>My aid list</h1>
          <Link to={ROUTES.FIN_AID_SEARCH}>
            <Button size="sm" className="mr-4">
              Financial Aid search
            </Button>
          </Link>
        </Card.Header>
        <Card.Body className={admStyle.cardBody}>
          <ErrorDialog error={error} />
          {loading && <p className="text-white">Loading...</p>}
          {!loading && (
            <List
              programs={programs}
              applyStatus={applyStatus}
              columns={columns}
              onUpdate={this.handleUpdateProgram}
              onRemove={this.setProgramToRemove}
            />
          )}
        </Card.Body>
        <ConfirmDialog
          show={programToRemove != null}
          title="Remove from list"
          onSubmit={() => this.handleDelete(programToRemove)}
          onClose={() => this.setProgramToRemove(null)}
        >
          Are you sure you want to remove the program from the list?
        </ConfirmDialog>
      </Card>
    );
  }
}

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
    const { programs, columns, applyStatus, onUpdate, onRemove } = this.props;
    return (
      <div className={tableStyle.contentWrap}>
        <div className={tableStyle.table}>
          <div ref={this.titleRef} className={tableStyle.thead}>
            <DetailHead>Details</DetailHead>
            {columns.map(({ text, key }) => (
              <div key={key} className={tableStyle.theadTh}>
                {text}
              </div>
            ))}
          </div>
          <div ref={this.contentRef} className={tableStyle.tbody}>
            {programs.map((program) => {
              return (
                <ListRow
                  key={program.id}
                  program={program}
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

const ListRow = ({ program, columns, applyStatus, onUpdate, onRemove }) => {
  const history = useHistory();

  const handleGoToProgramDetail = () => {
    history.push(`${ROUTES.FIN_AID_DETAIL}?programId=${program.id}`);
  };

  return (
    <div className={tableStyle.tbodyRow}>
      <DetailIcon onClick={handleGoToProgramDetail} />
      {columns.map(({ key }) => {
        let val = program[key];

        if (key === 'status') {
          const name = getNameFromId(applyStatus, val)?.name;
          return (
            <div key={key} className={tableStyle.tbodyTd}>
              <TypeDropdown
                value={name}
                options={applyStatus}
                onSelect={(value) => onUpdate(program.id, value)}
                onRemove={() => onRemove(program.id)}
              />
            </div>
          );
        }

        if (key === 'max_award_amount') {
          if (val) {
            return (
              <div key={key} className={tableStyle.tbodyTd}>
                <Cost>{val}</Cost>
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

const Cost = ({ children }) => {
  return children ? <div>{`$${children.toLocaleString()}`}</div> : <div></div>;
};

export default MyFinAidList;
