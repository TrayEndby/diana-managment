import React from 'react';
import PropTypes from 'prop-types';
import Image from 'react-bootstrap/Image';

import FinAidImage from '../../../assets/FinancialAid.jpg';

import FinAidSearchBoard from '../SearchBoard';
import ProgramsSearchResult from '../SearchResult';
import BackToMyListButton from '../MyList/BackButton';
import AddProgramModal from '../MyList/AddModal';

import ErrorDialog from '../../../util/ErrorDialog';
import financialAidService from '../../../service/FinancialAidService';
import * as ROUTES from '../../../constants/routes';
import { withRouter } from 'react-router-dom';
import SidebarPageLayout from '../../../layout/SidebarPageLayout';
import { fetchApplyStatus } from '../MyList';
import { defaultColumnsToDisplay } from '../MyList';
import searchStyles from '../SearchResult/style.module.scss';

const propTypes = {
  programs: PropTypes.array,
  totalRows: PropTypes.number,
  onSearch: PropTypes.func.isRequired,
  onAddProgram: PropTypes.func.isRequired
};

const INC_NUM = 20;
class FinAidSearchPage extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      loading: true,
      searchingMsg: null,
      programToAdd: null,
      searchResultColumns: defaultColumnsToDisplay,
      showEditColumnModal: false,
      applyStatus: null,
      MyList: null,
      searchCriteria: null,
    };
  }

  componentDidMount = async () => {
    const appStatus = await this.initialize();
    if (this.props.history.location.state?.programToChangeStatus) {
      this.handleAddProgramToMyList(this.props.history.location.state?.programToChangeStatus, appStatus)
      this.props.history.replace({ ...this.props.history.location, state: null });
    }
  };

  handleError = (error) => {
    console.error(error);
    this.setState({
      error: error.message,
    });
  };

  initialize = async () => {
    try {
      this.setState({ loading: true });
      const applyStatus = await fetchApplyStatus();
      this.setState({ applyStatus });
    } catch (e) {
      this.handleError(e);
    } finally {
      this.setState({ loading: false });
    }
  };

  searchFinAidPrograms = async (data) => {
    this.setState({ searchingMsg: 'Searching' });
    this.setState({ searchCriteria: data });

    const searchPrograms = await financialAidService.GetFinAidSearch(data);
    const myList = await financialAidService.GetUserFinAidList();
    this.setState({ myList });

    const statusedPrograms = this.addApplyStatusToPrograms(searchPrograms.program, myList)
    const totalResults = searchPrograms.total_results;
    this.setState({ searchingMsg: null })

    this.props.onSearch({
      programs: statusedPrograms,
      totalRows: totalResults,
      from: 0
    })
  }

  loadMore = async () => {
    const { searchCriteria } = this.state;
    const fromNum = this.props.from + INC_NUM;
    const preparedData = { from: fromNum, ...searchCriteria };

    const searchPrograms = await financialAidService.GetFinAidSearch(preparedData);
    const myList = await financialAidService.GetUserFinAidList();
    const statusedPrograms = this.addApplyStatusToPrograms(searchPrograms.program, myList);

    const oldPrograms = this.props.programs;

    if (statusedPrograms) {
      this.props.onSearch({
        programs: [...oldPrograms, ...statusedPrograms],
        totalRows: searchPrograms.total_results,
        from: fromNum
      })
    }
  }

  openCollegeDetails = (program) => {
    const { pathname, search } = this.props.location;
    this.props.history.push({
      pathname: `${ROUTES.FIN_AID_DETAIL}`,
      search: `?programId=${program.id}`,
      state: { prevLocation: { pathname, search } }
    });
  };

  setProgramToAdd = (program) => {
    this.setState({
      programToAdd: program,
    });
  };

  addApplyStatusToPrograms = (programs, myList) => {
    if (!programs) return null
    return programs.map((program) => {
      const status = myList.find(x => x.finaid_id === program.id)?.status;
      const status_str = this.state.applyStatus.find(x => x.id === status)?.name;
      return {
        ...program,
        status: status_str,
      };
    });
  };

  handleAddProgramToMyList = async (ret, appStatus) => {
    const [finaid_id, status] = ret;
    const { programs, onAddProgram } = this.props;
    let statusList;
    if (!this.state.applyStatus) {
      statusList = appStatus
    } else {
      statusList = this.state.applyStatus
    }
    const refreshedPrograms = programs.map(program => {
      if (program.id === finaid_id) {
        const status_str = statusList.find(x => x.id === status)?.name;
        return {
          ...program,
          status: status_str,
        }
      } else {
        return program
      }
    })
    onAddProgram(refreshedPrograms);
    this.setProgramToAdd(null);
  };

  getSearchResultTitle = () => {
    const { totalRows } = this.props;
    return totalRows <= 1 ? `Found ${totalRows} result` : `Found ${totalRows} results`;
  };

  render() {
    const {
      error,
      searchingMsg,
      loading,
      programToAdd,
      searchResultColumns,
    } = this.state;

    const { programs, totalRows } = this.props;

    if (error) {
      return <ErrorDialog error={error}></ErrorDialog>;
    }
    const sectionStyle = { position: 'relative' };
    const backButtonStyle = {
      position: 'absolute',
      top: 8,
      left: 15,
      zIndex: 1,
    };
    const searchMsgStyle = {
      position: 'relative',
      top: backButtonStyle.top + 40,
    };
    const left = backButtonStyle.left + 140;
    const titleStyle = {
      position: 'relative',
      left: left,
      width: `calc(100% - ${left}px)`,
      minHeight: '35px',
    };
    return (
      <SidebarPageLayout
        sideBar={(closeSidebar) => (<FinAidSearchBoard
          left={left}
          onSearch={this.searchFinAidPrograms}
          onError={this.handleError}
          onCloseSidebar={closeSidebar}
        />)}
        rightSidebar
        wideSidebar
        noHeader
      >
        <div className=" h-100 App-body d-flex flex-row  overflow-hidden" style={sectionStyle}>
          <div style={backButtonStyle}>
            <BackToMyListButton />
          </div>
          {loading && (
            <div className="col-sm-12" style={searchMsgStyle}>
              Loading...
            </div>
          )}
          {searchingMsg && (
            <div className="col-sm-12 text-white" style={searchMsgStyle}>
              {searchingMsg}...
            </div>
          )}
          {!loading && !searchingMsg && !programs && (
            <div className="col-sm-12">
              <h4 className={searchStyles.noSearchRes}>No search results</h4>
              <Image src={FinAidImage} fluid style={searchMsgStyle} className="my-3" />
            </div>
          )}
          {!loading && !searchingMsg && programs && (
            <>
              <div className="h-100 col-sm-12">
                <div className="h-100 d-flex flex-column my-2">
                  <div style={titleStyle} className="row mx-0 my-1">
                    <h5 className="mr-0 ml-auto mr-md-auto my-0 text-white">{this.getSearchResultTitle()}</h5>
                  </div>
                  <ProgramsSearchResult
                    programs={programs}
                    columns={searchResultColumns}
                    onSelect={this.openCollegeDetails}
                    onAddProgram={this.setProgramToAdd}
                    onLoadMore={this.loadMore}
                    totalResults={totalRows}
                  />
                </div>
              </div>
            </>
          )}

          <AddProgramModal
            program={programToAdd}
            onSubmit={this.handleAddProgramToMyList}
            onClose={() => this.setProgramToAdd(null)}
          />
        </div>
      </SidebarPageLayout>

    );
  }
}


FinAidSearchPage.propTypes = propTypes;

export default withRouter(FinAidSearchPage);
