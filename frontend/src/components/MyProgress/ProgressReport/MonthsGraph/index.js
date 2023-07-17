import React, { useState } from 'react';
import cn from 'classnames';
import Container from 'react-bootstrap/Container';
import { CaretRight, CaretLeft } from 'react-bootstrap-icons';

import BarsGraph from '../BarsGraph';
import missionService from 'service/MissionService';
import { MONTHS } from 'util/helpers';

const propTypes = {};

const MonthsGraph = React.memo(() => {
  const [grade] = React.useState(localStorage.getItem('MyEvolution.Grade.id'));
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [data, setData] = useState([]);
  const isLast = month === 12;
  const isFirst = month === 1;
  const handlePrev = React.useCallback(() => setMonth(month - 1), [month]);
  const handleNext = React.useCallback(() => setMonth(month + 1), [month]);

  React.useEffect(() => {
    missionService.getProgressGroupedByWeekInRange(
      grade,
      { month, week: 1 },
      { month, week: 4 },
    ).then(result => {
      setData(
        result
          .map((mission) => mission.done / mission.total)
          .map((i) => Math.max(0.03, i)),
      );
    });
  }, [month, grade]);

  return (
    <>
      <Container className="barchart-label-container text-white">
        <CaretLeft
          className={cn('mr-4', 'App-clickable', { 'App-disabled': isFirst })}
          onClick={handlePrev}
        />
        <h4 className="m-0">{MONTHS[month]}</h4>
        <CaretRight
          className={cn('ml-4', 'App-clickable', { 'App-disabled': isLast })}
          onClick={handleNext}
        />
      </Container>
      <Container className="labels-container text-white text-center">
        <Container className="second-graph">
          <BarsGraph data={data} />
        </Container>
      </Container>
    </>
  );
});

MonthsGraph.propTypes = propTypes;

export default MonthsGraph;
