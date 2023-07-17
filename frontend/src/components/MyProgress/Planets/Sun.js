import React, { useEffect } from 'react';
import PlanetPopup from './PlanetPopup';
import * as ROUTES from 'constants/routes';

export default React.memo(() => {
  const [showPopup, setShowPopup] = React.useState(false);
  const sunRef = React.useRef(null);

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  const handleShowPopup = () => {
    setShowPopup(true);
  };

  const togglePopup = () => {
    showPopup ? handleClosePopup() : handleShowPopup()
  }

  useEffect(() => {
    handleShowPopup();
  }, [])

  return (
    <>
      <PlanetPopup
        ref={sunRef}
        isShowed={showPopup}
        handleClose={handleClosePopup}
        planetName="My portfolio"
        planetLink={ROUTES.PORTFOLIO}
        completedMissions={7}
        allMissions={10}
      />
      <filter id="dropshadow" height="130%">
        <feGaussianBlur in="SourceAlpha" stdDeviation="1.9" result="blur" />
        <feOffset in="blur" dx="5" dy="5" result="offsetBlur" />
        <feFlood floodColor="#fcb618" floodOpacity="0.2" result="offsetColor" />
        <feComposite in="offsetColor" in2="offsetBlur" operator="in" result="offsetBlur" />
      </filter>
      <circle cx="1000" cy="370" r="60" fill="#fcb618" />
      <circle cx="995" cy="365" r="70" style={{ filter: 'url(#dropshadow)' }} fill="#fcb618" className="App-clickable" ref={sunRef} onClick={togglePopup} />

    </>
  )
});
