import React from 'react';
import { Button, ProgressBar } from 'react-bootstrap';
import Popover from 'react-bootstrap/Popover'
import Overlay from 'react-bootstrap/Overlay'
import { Link } from 'react-router-dom';
import * as ROUTES from 'constants/routes';

import './style.scss';

export default React.forwardRef(({ isShowed, planetName, completedMissions, allMissions, planetLink, handleClose }, ref) => {
  return (
    <Overlay target={ref.current} show={isShowed} placement="top" className="planet-popup">
      <Popover id="popover-basic" >
        <Popover.Title as="h3">{planetName}</Popover.Title>
        <button type="button" onClick={handleClose} className="close planet-popup__close" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
        <Popover.Content>
          <ProgressBar now={(completedMissions / allMissions) * 100} />
          <p className="planet-popup__missions-count">
            {completedMissions}/{allMissions} missions
          </p>
          <section className="planet-popup__btns">
            <Link to={ROUTES.PROGRESS_REPORT} className="planet-popup__btns-progress">
              <Button variant="link">See my progress</Button>
            </Link>
            <Link to={planetLink} className="planet-popup__btns-visit">
              <Button variant="primary" >Visit Planet</Button>
            </Link>
          </section>
        </Popover.Content>
      </Popover>
    </Overlay>
  );
});
