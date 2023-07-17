import React from 'react';
import classNames from 'classnames';

import Trajectories from './Trajectories';
import Sun from './Sun';

import PlanetECA from './PlanetECA';
import PlanetAdmissionManagement from './PlanetAdmissionManagement';
import PlanetCollaboration from './PlanetCollaboration';
import PlanetCollegeSearch from './PlanetCollegeSearch';
import PlanetCourses from './PlanetCourses';
import PlanetEssay from './PlanetEssay';
import PlanetFinances from './PlanetFinances';
import PlanetTestPrep from './PlanetTestPrep';

import BackButton from '../utils/BackButton';
import GradeLevel from './GradeLevel';
import ChildLabel from '../utils/ChildLabel';

import { GRADES } from 'constants/myProgress';

import ErrorDialog from 'util/ErrorDialog';
import useErrorHandler from 'util/hooks/useErrorHandler';
import withPuzzlePieces from 'util/HOC/withPuzzlePieces';
import missionService from 'service/MissionService';
import styles from './styles.module.scss';

const defaultGradeId = +localStorage.getItem('MyEvolution.Grade.id');
const defaultGrade = GRADES.find((g) => g.id === defaultGradeId) || GRADES[2];

// const PERCENTS =
const Planets = ({ puzzlePieces }) => {
  const [isAnimated, setIsAnimated] = React.useState(true);
  const [selectedGrade, setSelectedGrade] = React.useState(defaultGrade);
  const [popupCount, setPopupCount] = React.useState(0);
  const [progressByGrade, setProgressByGrade] = React.useState([]);
  const [percents, setPercents] = React.useState([]);
  const [error, setError] = useErrorHandler();

  React.useEffect(() => {
    if (selectedGrade) {
      missionService
        .getProgressGroupedByPuzzle(selectedGrade.id)
        .then(setProgressByGrade)
        .catch(setError);
    }
  }, [selectedGrade, setError]);

  React.useEffect(() => {
    const newPercents = puzzlePieces.map(({ id, text }) => {
      const tasks = progressByGrade[id];
      if (id in progressByGrade) {
        return {
          id,
          text,
          percent: Math.round((tasks.done * 100) / tasks.total),
          ...tasks,
        };
      } else {
        return { id, text, percent: 100, done: 0, total: 0 };
      }
    });
    setPercents(newPercents);
  }, [puzzlePieces, progressByGrade]);

  const svg = React.useRef();

  const setGrade = (grade) => setSelectedGrade(grade);

  React.useEffect(() => {
    if (isAnimated) {
      svg.current.unpauseAnimations();
    } else {
      svg.current.pauseAnimations();
    }
  }, [isAnimated]);

  React.useEffect(() => {
    if (popupCount === 0) {
      setIsAnimated(true);
    } else {
      setIsAnimated(false);
    }
  }, [popupCount]);

  const handlePopupCount = (value) => {
    setPopupCount(value);
  };

  return (
    <div className={styles.starsBg}>
      <ErrorDialog error={error} />
      <div className={classNames(styles.headerContainer)}>
        <div className={classNames(styles.headerContainerLeft)}>
          <BackButton />
          <div className={classNames(styles.title)}>MISSION TRACKING</div>
          <ChildLabel />
        </div>
        <GradeLevel
          selectedGrade={selectedGrade}
          grades={GRADES}
          gradeOnChange={setGrade}
        />
      </div>
      <svg
        ref={svg}
        className={classNames(styles.container, 'my-evolution-planets')}
        viewBox="-80 -80 2147 1250"
      >
        <Trajectories percents={percents} />
        <PlanetECA
          popupCount={popupCount}
          setPopupCount={handlePopupCount}
          tasks={percents.find((p) => p.id === 4)}
        />
        <PlanetAdmissionManagement
          popupCount={popupCount}
          setPopupCount={handlePopupCount}
          tasks={percents.find((p) => p.id === 8)}
        />
        <PlanetCollaboration
          popupCount={popupCount}
          setPopupCount={handlePopupCount}
          tasks={percents.find((p) => p.id === 5)}
        />
        <PlanetCollegeSearch
          popupCount={popupCount}
          setPopupCount={handlePopupCount}
          tasks={percents.find((p) => p.id === 7)}
        />
        <PlanetCourses
          popupCount={popupCount}
          setPopupCount={handlePopupCount}
          tasks={percents.find((p) => p.id === 2)}
        />
        <PlanetEssay
          popupCount={popupCount}
          setPopupCount={handlePopupCount}
          tasks={percents.find((p) => p.id === 6)}
        />
        <PlanetFinances
          popupCount={popupCount}
          setPopupCount={handlePopupCount}
          tasks={percents.find((p) => p.id === 9)}
        />
        <PlanetTestPrep
          popupCount={popupCount}
          setPopupCount={handlePopupCount}
          tasks={percents.find((p) => p.id === 3)}
        />

        <Sun />
      </svg>
    </div>
  );
};

export default React.memo(withPuzzlePieces(Planets));
