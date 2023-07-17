import React from 'react';
import PropTypes from 'prop-types';
import Button from 'react-bootstrap/Button';
import Image from 'react-bootstrap/Image';

import Pagination from 'react-bootstrap/Pagination';

import CollegeImage from '../../../assets/college.jpg';

import CollegeSearchBoard from '../SearchBoard';
import CollegeSearchResult from '../SearchResult';
import BackToMyListButton from '../MyList/BackButton';
import AddCollegeModal from '../MyList/AddModal';
import EditColumnModal from '../SearchResult/EditColumnModal';

import getColumnsToDisplay from '../SearchResult/columnsToDisplay';
import ErrorDialog from '../../../util/ErrorDialog';
import collegeService from '../../../service/CollegeService';
import { LOCAL_STORAGE_COLLEGE_SEARCH_COLUMN } from '../../../constants/localStorageKeys';
import * as ROUTES from '../../../constants/routes';
import { withRouter } from 'react-router-dom';
import SidebarPageLayout from '../../../layout/SidebarPageLayout';
import style from './style.module.scss';
import cn from 'classnames';

const Default_Search_Result_Columns = ['name', 'status_str', 'state', 'evaluation'];

const propTypes = {
  colleges: PropTypes.array,
  totalRows: PropTypes.number.isRequired,
  pageNumber: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  searchData: PropTypes.object,
  onSearch: PropTypes.func.isRequired,
  onAddCollege: PropTypes.func.isRequired,
};

class CollegeSearchPage extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      loading: true,
      searchingMsg: null,
      sportsList: [],
      collegeToAdd: null,
      searchResultColumns: null,
      columnsToDisplay: [],
      showEditColumnModal: false,
    };
    this.collegeToApplyStatusMap = new Map();
  }

  componentDidMount = () => {
    this.initialize();
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
      const promise1 = this.fetchMyList();
      const promise2 = this.fetchSportsList();
      await Promise.all([promise1, promise2]);
      await this.initializeSearchResultColumns(); // wait for sport list to fetched
    } catch (e) {
      this.handleError(e);
    } finally {
      this.setState({ loading: false });
    }
  };

  initializeSearchResultColumns = async () => {
    let columns = [];
    let set = new Set();
    let defaultColumns = Default_Search_Result_Columns;
    try {
      let storedColumns = localStorage.getItem(LOCAL_STORAGE_COLLEGE_SEARCH_COLUMN);
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
      searchResultColumns: columns,
      columnsToDisplay,
    });
  };

  async fetchMyList() {
    let idToApplyStatusMap = await collegeService.getIdToApplyStatusMap(true);
    let myList = await collegeService.getMyList();
    let collegeToApplyStatusMap = new Map();
    myList.forEach(({ college_id, status }) => {
      collegeToApplyStatusMap.set(college_id, idToApplyStatusMap.get(Number(status)));
    });
    this.collegeToApplyStatusMap = collegeToApplyStatusMap;
  }

  async fetchSportsList() {
    const sportsList = await collegeService.listSportsAsync();
    this.setState({
      sportsList,
    });
  }

  searchCollege = async (searchData, newPageNumber = 1) => {
    try {
      let { rowsPerPage, totalRows, totalPages, searchDataCache } = this.props;
      const newSearch = searchData != null;
      if (!newSearch) {
        searchData = searchDataCache;
      }
      this.setState({ searchingMsg: newSearch ? 'Searching' : 'Loading' });
      const startRows = (newPageNumber - 1) * rowsPerPage + 1;
      const [colleges, numOfRows] = await collegeService.searchAndSort(searchData, startRows);
      if (newSearch) {
        totalRows = numOfRows;
        rowsPerPage = colleges.length;
        totalPages = rowsPerPage === 0 ? 1 : Math.ceil(numOfRows / rowsPerPage);
      }
      this.props.onSearch({
        colleges: this.addApplyStatusToColleges(colleges),
        totalRows,
        pageNumber: newPageNumber,
        rowsPerPage,
        totalPages,
        searchData
      });
    } catch (e) {
      this.handleError(e);
    } finally {
      this.setState({ searchingMsg: null });
    }
  };

  openCollegeDetails = (college) => {
    this.props.history.push(`${ROUTES.COLLEGE_DETAIL}?collegeId=${college.id}&from=search`);
  };

  setCollegeToAdd = (college) => {
    this.setState({
      collegeToAdd: college,
    });
  };

  addApplyStatusToColleges = (colleges) => {
    return colleges.map((college) => {
      return {
        ...college,
        status_str: this.collegeToApplyStatusMap.get(college.id),
      };
    });
  };

  handleChangePage = (newPageNumber) => {
    const { pageNumber } = this.props;
    if (pageNumber === newPageNumber) {
      return;
    }
    this.searchCollege(null, newPageNumber);
  };

  handleAddCollegeToMyList = async (ret) => {
    const [college_id, status] = ret;
    const map = await collegeService.getIdToApplyStatusMap(true);
    const status_str = map.get(Number(status));
    this.collegeToApplyStatusMap.set(college_id, status_str);
    const { colleges, onAddCollege } = this.props;
    onAddCollege(this.addApplyStatusToColleges(colleges));
    this.setCollegeToAdd(null);
  };

  toggleShowEditColumnModal = (show) => {
    this.setState({
      showEditColumnModal: show,
    });
  };

  handleEditColumns = async (data) => {
    let searchResultColumns = [];
    let keys = [];
    const { columnsToDisplay } = this.state;
    columnsToDisplay.forEach(({ key, text, category }) => {
      if (data[key]) {
        searchResultColumns.push({
          key,
          text,
          category,
        });
        keys.push(key);
      }
    });
    this.toggleShowEditColumnModal(false);
    this.setState({
      searchResultColumns,
    });
    localStorage.setItem(LOCAL_STORAGE_COLLEGE_SEARCH_COLUMN, JSON.stringify(keys));
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
      sportsList,
      collegeToAdd,
      searchResultColumns,
      columnsToDisplay,
      showEditColumnModal,
    } = this.state;
    const { colleges, totalRows, pageNumber, totalPages } = this.props;
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

    return (
      <SidebarPageLayout
        sideBar={(closeSidebar) => (
          <CollegeSearchBoard
            left={left}
            sportsList={sportsList}
            onSearch={this.searchCollege}
            onError={this.handleError}
            onCloseSidebar={closeSidebar}
          />
        )}
        rightSidebar
        wideSidebar
        noHeader
      >
        <div className=" h-100 App-body d-flex flex-row  overflow-hidden" style={sectionStyle}>
          <div className={cn(style.backButtonStyle, { [style.backButtonStyleSearchRes]: !loading && !searchingMsg && colleges })}>
            <BackToMyListButton />
          </div>
          {loading && (
            <div className="col-sm-12 text-white" style={searchMsgStyle}>
              Loading...
            </div>
          )}
          {searchingMsg && (
            <div className="col-sm-12 text-white" style={searchMsgStyle}>
              {searchingMsg}...
            </div>
          )}
          {!loading && !searchingMsg && !colleges && (
            <div className="col-sm-12">
              <Image src={CollegeImage} fluid style={searchMsgStyle} className="my-3" />
            </div>
          )}
          {!loading && !searchingMsg && colleges && (
            <>
              <div className="h-100 col-sm-12">
                <div className="h-100 d-flex flex-column my-2">
                  <div className={cn("row mx-0 my-1", style.titleStyle)}>
                    <h5 className={style.headline}>{this.getSearchResultTitle()}</h5>
                    <Button
                      size="sm"
                      className={cn("btn-primary ml-auto ml-md-0", style.editColumns)}
                      onClick={() => this.toggleShowEditColumnModal(true)}
                    >
                      Edit columns
                    </Button>
                  </div>
                  <CollegeSearchResult
                    colleges={colleges}
                    columns={searchResultColumns}
                    onSelect={this.openCollegeDetails}
                    onAddCollege={this.setCollegeToAdd}
                  />
                  <Paging
                    totalRows={totalRows}
                    pageNumber={pageNumber}
                    totalPages={totalPages}
                    onClick={this.handleChangePage}
                  />
                </div>
              </div>
            </>
          )}

          <AddCollegeModal
            college={collegeToAdd}
            onSubmit={this.handleAddCollegeToMyList}
            onClose={() => this.setCollegeToAdd(null)}
          />
          {showEditColumnModal && (
            <EditColumnModal
              columnsToDisplay={columnsToDisplay}
              columns={searchResultColumns}
              onSubmit={this.handleEditColumns}
              onClose={() => this.toggleShowEditColumnModal(false)}
            />
          )}
        </div>
      </SidebarPageLayout>
    );
  }
}

const Paging = ({ pageNumber, totalPages, onClick }) => {
  if (totalPages <= 1) {
    return null;
  }
  const isFirstPage = pageNumber === 1;
  const isLastPage = pageNumber === totalPages;
  // show 10 page items based on the current page number
  let startPage = 1;
  let endPage = Math.min(10, totalPages);
  if (totalPages > 10) {
    startPage = Math.max(1, pageNumber - 5);
    endPage = Math.min(startPage + 9, totalPages);
    startPage = Math.min(startPage, endPage - 9);
  }
  const pages = [];
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }
  return (
    <Pagination>
      {!isFirstPage && <Pagination.First onClick={() => onClick(1)} />}
      {!isFirstPage && <Pagination.Prev onClick={() => onClick(pageNumber - 1)} />}
      {pages.map((page) => {
        return (
          <Pagination.Item key={page} active={page === pageNumber} onClick={() => onClick(page)}>
            {page}
          </Pagination.Item>
        );
      })}
      {!isLastPage && <Pagination.Next onClick={() => onClick(pageNumber + 1)} />}
      {!isLastPage && <Pagination.Last onClick={() => onClick(totalPages)} />}
    </Pagination>
  );
};

CollegeSearchPage.propTypes = propTypes;

export default withRouter(CollegeSearchPage);
