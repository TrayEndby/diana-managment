import React from 'react';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';

import NavBar from '../NavBar';

import SidebarPageLayout from '../../../layout/SidebarPageLayout';
import SearchBar from '../../../util/SearchBar';
import * as ROUTES from '../../../constants/routes';

const propTypes = {
  children: PropTypes.node,
  search: PropTypes.string,
  savedEssays: PropTypes.array.isRequired,
  className: PropTypes.string,
};

const EssayPageLayout = ({ children, search, savedEssays, className }) => {
  const history = useHistory();
  const path = history.location.pathname;
  const noSearch = path === ROUTES.ESSAY_MY_ESSAY || path.includes(ROUTES.ESSAY_COMPOSE);
  return (
    <SidebarPageLayout sideBar={() => <NavBar list={savedEssays} />} noHeader contentClassName="d-flex flex-column">
      {!noSearch && (
        <div>
          <SearchBar title="Search essays" className="mx-auto" search={search} searchURL={ROUTES.ESSAY} emptyToClear />
        </div>
      )}
      <div style={{ overflowY: 'auto', height: '100%' }} className={className}>
        {children}
      </div>
    </SidebarPageLayout>
  );
};

EssayPageLayout.propTypes = propTypes;

export default EssayPageLayout;
