import React, { useEffect, useState } from 'react';
import { useHistory, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

import Picture from '../Picture';

import { isMyProject, filterProjectsByKeyword, getRoleName, getProjectDisplayName } from '../util';
import FrameCard from '../../../util/FrameCard';
import ErrorDialog from '../../../util/ErrorDialog';
import { utcToLocal } from '../../../util/helpers';
import { parseSearchParams } from '../../../util/helpers';
import * as ROUTES from '../../../constants/routes';

import style from './style.module.scss';

const propTypes = {
  projects: PropTypes.array.isRequired,
  roles: PropTypes.object.isRequired,
  myProjectOnly: PropTypes.bool,
  loading: PropTypes.bool,
  error: PropTypes.string,
};

const NUM_TO_SHOW_IN_COLLAPSE = 9;

const ProjectList = ({ projects, roles, myProjectOnly, loading, error, location: { search } }) => {
  const [filteredProjects, setFilteredProjects] = useState([]);
  const { query } = parseSearchParams(search);
  const [isCollapsed, setIsCollapsed] = useState(true);
  const showedProjects = isCollapsed ? filteredProjects.slice(0, NUM_TO_SHOW_IN_COLLAPSE) : filteredProjects;
  const toggleCollapseState = () => {
    setIsCollapsed(!isCollapsed);
  };

  useEffect(() => {
    setFilteredProjects(filterProjectsByKeyword(projects, query));
  }, [query, projects]);

  return (
    <div className='App-grid-list-container'>
      {loading && <div className='text-center'>Loading...</div>}
      {error && <ErrorDialog error={error} />}
      {!loading && showedProjects.length === 0 && (
        <div className='text-center'>{query ? 'No serach results' : 'No projects'}</div>
      )}
      {!loading && showedProjects.length > 0 && (
        <Container className={classNames('App-grid-list', style.container)} fluid>
          {showedProjects.map((project) => (
              <ProjectCard key={project.id} project={project} roleInfo={roles[project.id]} myProjectOnly={myProjectOnly} />
            ))}
            {projects.length > NUM_TO_SHOW_IN_COLLAPSE && (
              <Col className={style.seeMoreButton}>
                <Button variant="link" className={style.link} onClick={toggleCollapseState}>
                  {isCollapsed ? 'Show more' : 'Show less'}
                </Button>
              </Col>
            )}
        </Container>
      )}
    </div>
  );
};

const ProjectCard = React.memo(({ project, roleInfo, myProjectOnly }) => {
  const history = useHistory();
  const { id, name, owner_name, created_ts, picture_id } = project;
  const myProject = isMyProject(project);
  const displayName = myProjectOnly && myProject ? getProjectDisplayName(project) : name;
  const roleName = getRoleName(roleInfo);

  const openWorkSpace = (id) => {
    history.push(`${ROUTES.COLLABORATIONS_WORKSPACE}?id=${id}&my=${myProjectOnly || false}`);
  };

  return (
    <FrameCard onClick={() => openWorkSpace(id)} img={
      <Picture id={picture_id} />
    }>
      <h6 title={displayName}>{displayName}</h6>
      <p>Creator: {myProject ? 'me' : owner_name}</p>
      <p>Create time: {utcToLocal(created_ts)}</p>
      <p>{roleName ? `Role: ${roleName}` : <br />}</p>
    </FrameCard>
  );
});

ProjectList.propTypes = propTypes;

export default withRouter(React.memo(ProjectList));
