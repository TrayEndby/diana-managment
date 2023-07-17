import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import cn from 'classnames';

import Accordion from 'util/Accordion';
import { parseSearchParams } from 'util/helpers';

import styles from './style.module.scss';

const propTypes = {
  list: PropTypes.array.isRequired,
};

/**
 * Example of list:
 * [{
  name: 'Homework folders',
  children: [{
    name: 'Q1 Sprint Program',
    children: [{
      id: 1,
      name: 'SAT Test Prep'
    }, {
      id: 2,
      name: 'ACT Test Prep'
    }]
  }, {
    name: 'Q2 Sprint Program',
    children: []
  }]
}, {
  name: 'Submitted homework',
  children: []
}]
 * 
 */
const NavBar = ({ list, location: { search } }) => {
  const { program } = parseSearchParams(search);
  return (
    <div className={styles.navbar}>
      <FoldersList folders={list} selected={program} />
    </div>
  );
};

const FoldersList = ({ folders, selected }) => {
  return (
    <>
      {folders.map((folder, index) => (
        <div key={index}>
          <h5>{folder.name}</h5>
          <SprintsList
            sprints={folder.children}
            path={folder.path}
            selected={selected}
          />
        </div>
      ))}
    </>
  );
};

const SprintsList = ({ sprints, path, selected }) => {
  return (
    <div className={styles.sprints}>
      {sprints.map((sprint, index) => (
        <Accordion key={index} title={sprint.name}>
          <ProgramsList
            programs={sprint.children}
            path={path}
            selected={selected}
          />
        </Accordion>
      ))}
    </div>
  );
};

const ProgramsList = withRouter(({ programs, path, selected, location }) => {
  return (
    <div className={styles.programs}>
      {programs.map((program) => (
        <Link
          key={program.id}
          to={`${path}?program=${program.id}`}
          className={cn({
            [styles.active]:
              location.pathname === path &&
              selected != null &&
              program.id === Number(selected),
          })}
        >
          {program.name}
        </Link>
      ))}
    </div>
  );
});

NavBar.propTypes = propTypes;

export default withRouter(NavBar);
