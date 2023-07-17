import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter, Link } from 'react-router-dom';
import classNames from 'classnames';

import * as ROUTES from '../../../constants/routes';

const propTypes = {
  list: PropTypes.array.isRequired,
};

// XXX TODO: generalize with Course/PlayList/NavBar
class NavBar extends Component {
  isInSavedList() {
    const path = this.props.location.pathname;
    return path && path.startsWith(ROUTES.ESSAY_SAVED);
  }

  render() {
    const { list } = this.props;
    if (!list) {
      return null;
    }
    const selectedId = this.isInSavedList() ? Number(this.props.match.params.id) : null;
    return (
      <>
        <Link to={ROUTES.ESSAY_PUBLIC}>
          <h5 className="py-1 hover-darkBg">Search essays</h5>
        </Link>
        <Link to={ROUTES.ESSAY_MY_ESSAY}>
          <h5 className="py-1 hover-darkBg">My essays</h5>
        </Link>
        {list.length > 0 && <div>
          <h5>Favorite essays</h5>
          {list.map(({ id, name }) => {
            return (
              <div key={id} className={classNames('py-1', 'px-1', 'hover-darkBg', { 'bg-warning': selectedId === id })}>
                <Link className="App-textOverflow d-flex" to={`${ROUTES.ESSAY_SAVED}/${id}`}>
                  {name}
                </Link>
              </div>
            );
          })}
        </div>
        }
      </>
    );
  }
}

NavBar.propTypes = propTypes;

export default withRouter(NavBar);
