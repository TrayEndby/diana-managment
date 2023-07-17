import React from 'react';
import { Switch, Route, withRouter } from 'react-router-dom';

import MyFinAidList from './MyList';
import FinAidSearchPage from './Search';
import CollegeDetailPage from './DetailPage';

import * as ROUTES from '../../constants/routes';

class FinAidPage extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      programsSearchResults: null,
      programsSearchTotalRows: 9,
      programsSearchFrom: 0,
    };
  }

  handleSearchResults = ({ programs, totalRows, from }) => {
    this.setState({
      programsSearchResults: programs,
      programsSearchTotalRows: totalRows,
      programsSearchFrom: from,
    });
  };

  handleAddProgram = (programs) => {
    this.setState({
      programsSearchResults: programs,
    });
  }

  render() {
    const {
      programsSearchResults,
      programsSearchTotalRows,
      programsSearchFrom
    } = this.state;
    return (
      <Switch>
        <Route path={ROUTES.FIN_AID_SEARCH}>
          <FinAidSearchPage
            programs={programsSearchResults}
            totalRows={programsSearchTotalRows}
            from={programsSearchFrom}
            onSearch={this.handleSearchResults}
            onAddProgram={this.handleAddProgram}
          />
        </Route>
        <Route path={ROUTES.FIN_AID_DETAIL}>
          <CollegeDetailPage />
        </Route>
        <Route>
          <MyFinAidList />
        </Route>
      </Switch>
    );
  }
}

export default withRouter(FinAidPage);
