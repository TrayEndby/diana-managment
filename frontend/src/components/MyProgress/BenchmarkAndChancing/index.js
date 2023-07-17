import React, { useState } from 'react';
import cn from 'classnames';

import SelectWithInput from './SelectWithInput';
import { interpolateColors } from './helper';

import AssessService from 'service/AssessService';

import styles from './styles.module.scss';
import BackButton from '../utils/BackButton';
import ChildLabel from '../utils/ChildLabel';

const axisX = new Array(40).fill(0);
const axisY = new Array(20).fill(0);

const colors = interpolateColors('rgb(205,26,1)', 'rgb(83,165,72)', 100);

const normalizePosition = (minPos, maxPos, pos) => {
  pos = pos * 100;
  const normalizedPos = minPos + (pos / 100) * (maxPos - minPos);
  return `${normalizedPos}%`;
};

const getBottomPosition = (pos, my) => {
  return my ? normalizePosition(0, 91, pos) : normalizePosition(-3, 93, pos);
};

const getLeftPosition = (pos, my) => {
  return my ? normalizePosition(0, 95, pos) : normalizePosition(2, 100, pos);
};

const Point = React.memo(({ item, style, my }) => {
  let { eca_rating, academics_rating, chance } = item;
  const indexOfColor = Math.round(((eca_rating + academics_rating) * 100) / 2);
  eca_rating = Math.min(1, Math.max(0, eca_rating));
  academics_rating = Math.min(1, Math.max(0, academics_rating));
  return (
    <div
      className={styles.point}
      style={{
        bottom: getBottomPosition(academics_rating, my),
        left: getLeftPosition(eca_rating, my),
        backgroundColor: colors[indexOfColor],
        ...(style ? style : {}),
      }}
    >
      <div className={styles.popup}>
        {my && <h5 className={styles.header}>My star system</h5>}
        <p className={styles.chance}>
          Overall chance: {Math.round(chance * 100)}%
        </p>
        <div className={styles.items}>
          <p>Academics rating: {Math.round(academics_rating * 100)}%</p>
          <p>Extracurricular rating: {Math.round(eca_rating * 100)}%</p>
        </div>
      </div>
    </div>
  );
});

const BenchmarkAndChancing = () => {
  const [chance, setChance] = useState([]);
  const [userChance, setUserChance] = useState(null);
  const [collegeId, setCollegeId] = useState(13371);
  const [collegeName, setCollegeName] = useState('Harvard University');

  React.useEffect(() => {
    AssessService.getChance(collegeId)
      .then(({ chance, user_chance: { overall } }) => {
        setChance(chance);
        if (!overall.academics_rating) {
          overall.academics_rating = 0.2;
        }
        if (!overall.eca_rating) {
          overall.eca_rating = 0.2;
        }
        setUserChance(overall);
      })
      .catch((e) => {
        console.error(e);
        alert("This college's data is not available at this moment");
      });
  }, [collegeId, collegeName]);

  return (
    <div className={cn('App-body', styles.benchmarkPage)}>
      <div className={styles.headerContainer}>
        <div className={styles.headerContainerLeft}>
          <BackButton />
          <div className={styles.title}>BENCHMARK & CHANCING</div>
          <ChildLabel />
        </div>
        <SelectWithInput
          collegeId={collegeId}
          setCollegeId={setCollegeId}
          setCollegeName={setCollegeName}
        />
      </div>
      <div className={styles.page}>
        <section style={{ justifySelf: 'center' }}></section>
        <div className={styles.container}>
          <div className={styles.xAxis}>
            {axisX.map((_, i) => (
              <div key={i} className={styles.delimiter} />
            ))}
            <p className={styles.maxValue}>100</p>
            <h4 className={styles.label}>Extracurricular achievements</h4>
          </div>
          <p className={styles.minValue}>0</p>
          <div className={styles.yAxis}>
            <p className={styles.maxValue}>100</p>
            <h4 className={styles.label}>Academics</h4>
            {axisY.map((_, i) => (
              <div key={i} className={styles.delimiter} />
            ))}
          </div>
          <div className={styles.chart}>
            {chance.map((item, index) => (
              <Point key={index} item={item} />
            ))}
            {userChance && (
              <>
                <Point
                  style={{
                    height: '40px',
                    width: '40px',
                    transform: 'initial',
                  }}
                  item={userChance}
                  my
                />
                <div
                  style={{
                    position: 'absolute',
                    backgroundColor: '#1f2c3b',
                    top: 0,
                    left: 0,
                    right: '30%',
                    bottom: '70%',
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    backgroundColor: '#47525e',
                    top: 0,
                    right: 0,
                    left: '70%',
                    bottom: '70%',
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    backgroundColor: '#131b24',
                    bottom: 0,
                    left: 0,
                    right: '30%',
                    top: '30%',
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    backgroundColor: '#1f2c3b',
                    bottom: 0,
                    right: 0,
                    left: '70%',
                    top: '30%',
                  }}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(BenchmarkAndChancing);
