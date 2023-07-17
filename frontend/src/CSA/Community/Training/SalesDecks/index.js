import React, { useEffect, useState, useCallback } from 'react';

import TrainingContainer from '../Container';
import SalesDecksList from './List';

import marketService from 'service/CSA/MarketService';
import authService from 'service/AuthService';
import ErrorDialog from 'util/ErrorDialog';
import useErrorHandler from 'util/hooks/useErrorHandler';
import Loading from 'util/Loading';

import './style.scss';

const propTypes = {};

const SalesDecks = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useErrorHandler();
  const [decks, setDecks] = useState([]);

  const getSlidesList = useCallback(() => {
    const userId = authService.getUID();
    marketService
      .listSlides(userId)
      .then((res) => {
        setDecks(res);
      })
      .catch(setError)
      .finally(() => {
        setLoading(false);
      });
  }, [setError]);

  useEffect(() => {
    getSlidesList();
  }, [getSlidesList]);

  return (
    <TrainingContainer selectedTab={1}>
      <div className="salesPage">
        <ErrorDialog error={error} />
        <Loading show={loading} />
        <SalesDecksList decks={decks} />
      </div>
    </TrainingContainer>
  );
};

SalesDecks.propTypes = propTypes;

export default SalesDecks;
