import React from 'react';
import moment from 'moment';

import { PROFILE_TYPE } from 'constants/profileTypes';
import * as ROUTES from 'constants/routes';
import { GRADES, WEEKS } from 'constants/myProgress';
import missionService from 'service/MissionService';
import userProfileSearchService from 'service/UserProfileSearchService';
import ArrowNavIcon from 'util/ArrowNavIcon';

import PopUp from './PopUp.js';
import ViewForm from './ViewForm';
import CustomSwitch from './CustomSwitch';
import Astronaut from './Astronaut';
import CustomRoute from './CustomRoute';
import EvolutionHeader from './EvolutionHeader';
import SummaryModal from './SummaryModal';
import './style.scss';
import styles from './style.module.scss';

const defaultGradeId = +localStorage.getItem('MyEvolution.Grade.id');
const defaultGrade = GRADES.find((g) => g.id === defaultGradeId) || GRADES[2];
const month = moment().get('month') + 1;
const week = Math.min(parseInt(moment().get('date') / 7) + 1, 4);
const currentWeek = { month, week };
const missions = [...WEEKS, ...WEEKS.slice(0, 3)];
const currentWeekIndex = missions.findIndex(
  ({ week, month }) => currentWeek.month === month && currentWeek.week === week,
);

const MyEvolution = () => {
  const [isEditor, setIsEditor] = React.useState(false);
  const [currentViewPosition, setCurrentViewPositionOrigin] = React.useState(
    currentWeekIndex,
  );
  const [selectedGrade, setSelectedGrade] = React.useState(defaultGrade);
  const [allMissions, setAllMissions] = React.useState({});
  const [stats, setStats] = React.useState(
    Array(3)
      .fill(null)
      .map((_) => {
        return { total: 0, finish: 0 };
      }),
  );
  const [monthStats, setMonthStats] = React.useState([]);
  const [isMsgShow, setMgsShow] = React.useState(true);
  const [goals, setGoals] = React.useState([]);
  const [currentHowToDos, setCurrentHowToDos] = React.useState([null, null]);
  const [currentGoals, setCurrentGoals] = React.useState([]);
  const [monthSummary, setMonthSummary] = React.useState();
  const setCurrentViewPosition = (value) => setCurrentViewPositionOrigin(value);

  React.useEffect(() => {
    const profile = userProfileSearchService.getProfile();
    setIsEditor(profile.basic.type.includes(PROFILE_TYPE.DataAdmin));

    missionService.getConstants().then((result) => {
      const res = [];
      for (let i = 0; i < 12; i += 3) {
        res.push(result.GradeGoals.slice(i, i + 3));
      }
      setGoals(res);
    });
  }, []);

  React.useEffect(() => {
    setCurrentViewPosition(currentWeekIndex);

    if (selectedGrade) {
      missionService
        .getAllMissions(selectedGrade.id)
        .then(([missions, stats, monthStats]) => {
          setAllMissions(missions);
          setStats(stats);
          setMonthStats(monthStats);
        });
    }
  }, [selectedGrade]);

  React.useEffect(() => {
    setCurrentGoals(goals[selectedGrade.id - 9]);
  }, [selectedGrade, goals]);

  const handleCloseHintMsg = () => setMgsShow(false);
  const handleShowHintMsg = () => setMgsShow(true);
  const handleSetHowToDos = (index, howToDo, title, color) => {
    setCurrentHowToDos((howToDos) =>
      howToDos.map((toDo, i) => {
        if (i === index) {
          return howToDo != null ? [howToDo, title, color] : null;
        } else {
          return toDo;
        }
      }),
    );
  };
  const handleUpdateStatus = (goal, statusChange, month) => {
    setStats((stats) => {
      return stats.map((stat, index) => {
        if (index === goal - 1) {
          return {
            ...stat,
            finish: stat.finish + statusChange,
          };
        } else {
          return stat;
        }
      });
    });

    checkMonthProgress(month, goal, statusChange);
  };
  const checkMonthProgress = (month, goal, statusChange) => {
    const updatedMonthStats = monthStats.map((stats, index) => {
      if (index === month) {
        stats[goal - 1].finish += statusChange;
        return stats;
      } else {
        return stats;
      }
    });
    setMonthStats(updatedMonthStats);
    const currentMonthStats = updatedMonthStats[month];
    if (currentMonthStats.every((s) => s.total === s.finish)) {
      setMonthSummary({
        month,
        stats: currentMonthStats,
      });
    }
  };

  return (
    <div className="my-evolution">
      <EvolutionHeader
        title={selectedGrade ? `${selectedGrade.text.toUpperCase()} GOALS` : ''}
        selectedGrade={selectedGrade}
        grades={GRADES}
        gradeOnChange={setSelectedGrade}
        goals={currentGoals}
        stats={stats}
      />
      <Astronaut
        howToDos={currentHowToDos}
        show={isMsgShow}
        onClose={handleCloseHintMsg}
      />
      <ViewForm />
      <div className="popUp-section">
        <PopUp />
      </div>
      <ArrowNavIcon
        className={styles.arrowNav}
        direction="left"
        path={ROUTES.HOME}
        text="Manual Drive"
      />
      <div style={{ display: 'flex' }}>
        <div className="timelinepath"></div>
        <CustomSwitch
          currentViewPosition={currentViewPosition}
          setCurrentViewPosition={setCurrentViewPosition}
        >
          {missions.map(({ week, month }) => (props) => (
            <CustomRoute
              isEditor={isEditor}
              week={week}
              selectedGrade={selectedGrade}
              setCurrentMessage={handleSetHowToDos}
              month={month}
              progress={25}
              frames={allMissions[`${month}-${week}`]}
              handleShowHintMsg={handleShowHintMsg}
              onUpdateStatus={handleUpdateStatus}
              {...props}
            />
          ))}
        </CustomSwitch>
      </div>
      {monthSummary && (
        <SummaryModal
          grade={selectedGrade.text}
          month={monthSummary.month}
          stats={monthSummary.stats}
          goals={currentGoals}
          onClose={() => setMonthSummary(null)}
        />
      )}
    </div>
  );
};

export default React.memo(MyEvolution);
