import React from 'react';
import PropTypes from 'prop-types';

import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';

import MajorListView from '../MajorListView';
import Circles from '../../../../assets/svg/Circles.svg';

import { StrategyItems, StrategyItem } from '../util';

import style from './style.module.scss';

const propTypes = {
  interests: StrategyItems.isRequired,
  drives: StrategyItems.isRequired,
  personality: StrategyItem.isRequired,
  majors: StrategyItems.isRequired,
  onHelp: PropTypes.func.isRequired,
  onBack: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
};

const MyRecommend = ({ interests, drives, personality, majors, onHelp, onBack, onSave }) => {
  return (
    <Container className={style.container} fluid>
      <div className={style.left}>
        {personality &&
        <>
          <h5>{personality.personality}</h5>
          <h5 className="App-text-orange">{personality.name}</h5>
          <div className="mt-3 mb-2">{personality.description}</div>
        </>
        }
        <img src={Circles} alt="Circles" />
        {[...interests, ...drives].map(({ name }) => (
          <div key={name} className="mt-2">-&nbsp;{name}</div>
        ))}
        <div className="mt-3">
          <Button onClick={onHelp}>Help me to choose again</Button>
          <Button onClick={onBack}>Choose by myself</Button>
        </div>
      </div>
      <div className={style.right}>
        <h5 className="mb-5 text-center">
          Recommended <span className="App-text-green">majors</span> based on your interest and personality:
        </h5>
        <MajorListView majors={majors} />
        <div className="mt-auto ml-auto">
          <Button onClick={() => onSave(majors)}>Accept all</Button>
        </div>
      </div>
    </Container>
  );
};

MyRecommend.propTypes = propTypes;

export default MyRecommend;
