import React from 'react';
import { Switch, Route, withRouter } from 'react-router-dom';

import MyCollegeList from './MyList';
import CollegeSearchPage from './Search';
import CollegeDetailPage from './DetailPage';

import * as ROUTES from '../../constants/routes';

class CollegePage extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      collegeSearchResults: null,
      collegeSearchTotalRows: 9,
      collegeSearchPageNumber: 1,
      collegeSerachRowsPerPage: 0,
      collegeSearchTotalPages: 0,
      collegeSerachDataCache: null,
    };
  }

  handleSerachResults = ({ colleges, totalRows, pageNumber, rowsPerPage, totalPages, searchData }) => {
    this.setState({
      collegeSearchResults: colleges,
      collegeSearchTotalRows: totalRows,
      collegeSearchPageNumber: pageNumber,
      collegeSerachRowsPerPage: rowsPerPage,
      collegeSearchTotalPages: totalPages,
      collegeSerachDataCache: searchData
    });
  };

  handleAddCollege = (colleges) => {
    this.setState({
      collegeSearchResults: colleges,
    });
  }

  render() {
    const {
      collegeSearchResults,
      collegeSearchTotalRows,
      collegeSearchPageNumber,
      collegeSerachRowsPerPage,
      collegeSearchTotalPages,
      collegeSerachDataCache
    } = this.state;
    return (
      <Switch>
        <Route path={ROUTES.COLLEGE_SEARCH}>
          <CollegeSearchPage
            colleges={collegeSearchResults}
            totalRows={collegeSearchTotalRows}
            pageNumber={collegeSearchPageNumber}
            rowsPerPage={collegeSerachRowsPerPage}
            totalPages={collegeSearchTotalPages}
            searchDataCache={collegeSerachDataCache}
            onSearch={this.handleSerachResults}
            onAddCollege={this.handleAddCollege}
          />
        </Route>
        <Route path={ROUTES.COLLEGE_DETAIL}>
          <CollegeDetailPage />
        </Route>
        <Route>
          <MyCollegeList />
        </Route>
      </Switch>
    );
  }
}

export default withRouter(CollegePage);
