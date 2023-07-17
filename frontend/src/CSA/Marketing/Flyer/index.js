import React, { useEffect, useState } from 'react';
import classNames from 'classnames';

import FlyerList from './List';
import Container from 'CSA/Container';

import ErrorDialog from 'util/ErrorDialog';
import useErrorHandler from 'util/hooks/useErrorHandler';
import Loading from 'util/Loading';
import markerService from 'service/CSA/MarketService';

import style from '../style.module.scss';

const propTypes = {};

const FlyerSection = () => {
  const [loading, setLoading] = useState(true);
  const [error ,setError] = useErrorHandler();
  const [flyers, setFlyers] = useState([]);

  useEffect(() => {
    markerService.listFlyers()
    .then((res) => {
      setFlyers(res);
    })
    .catch(setError)
    .finally(() => {
      setLoading(false);
    });
  }, [setError]);

  return (
    <Container title="Flyers" className={classNames("App-body", style.container)}>
      <div className="App-grid-list-container">
        <ErrorDialog error={error} />
        <Loading show={loading} />
        <FlyerList flyers={flyers} />
      </div>
    </Container>
  )
};

FlyerSection.propTypes = propTypes;

export default FlyerSection;