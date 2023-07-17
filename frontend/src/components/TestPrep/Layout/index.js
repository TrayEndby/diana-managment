import React from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';

import Button from 'react-bootstrap/Button';

import SearchBar from 'util/SearchBar';
import * as ROUTES from 'constants/routes';

import style from './style.module.scss';

const propTypes = {
  search: PropTypes.string,
  children: PropTypes.element,
};

class Layout extends React.PureComponent {
  handleClick = () => {
    this.props.history.push(`${ROUTES.TEST_PREP_CHANNEL}?home`);
  };

  render() {
    const { history, search, children } = this.props;
    return (
      <div className="App-body">
        <div className={style.topBar}>
          {history.location.pathname !== ROUTES.TEST_PREP_CHANNEL && (
            <Button className={style.navButton} onClick={this.handleClick}>
              Test prep subjects
            </Button>
          )}
          <SearchBar
            title="Search test prep courses"
            search={search}
            searchURL={ROUTES.TEST_PREP}
            className={style.searchBar}
          />
        </div>
        <div className={style.content}>{children}</div>
      </div>
    );
  }
}

Layout.propTypes = propTypes;

export default withRouter(Layout);
