import React from 'react';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';

import { Line } from 'react-chartjs-2';

import { GRADES } from 'constants/myProgress';
import { MONTHS } from 'util/helpers';
import missionService from 'service/MissionService';

import { getCurrentMonth, getMonth, range } from './helper';

const month = getCurrentMonth();

const labelsInitial = {
  '3m': [-1, 0, 1]
    .map((i) => range(4).map(() => getMonth(month + i)))
    .flat()
    .map((m) => MONTHS[m]),
  '6m': [-2, -1, 0, 1, 2, 3]
    .map((i) => range(4).map(() => getMonth(month + i)))
    .flat()
    .map((m) => MONTHS[m]),
  '9m': [-4, -3, -2, -1, 0, 1, 2, 3, 4]
    .map((i) => range(4).map(() => getMonth(month + i)))
    .flat()
    .map((m) => MONTHS[m]),
  ytd: range(12)
    .map((i) => range(4).map(() => getMonth(i + 1)))
    .flat()
    .map((m) => MONTHS[m]),
  '4y': GRADES.map((i) => i.text)
    .map((i) => range(4).map(() => i))
    .flat(),
};

const MonthChart = React.memo(({ startMonth, endMonth, rangeKey }) => {
  const [grade] = React.useState(
    localStorage.getItem('MyEvolution.Grade.id') || 11,
  );
  const [data, setData] = React.useState([]);
  const [labels, setLabels] = React.useState(labelsInitial[rangeKey]);

  React.useEffect(() => {
    if (rangeKey === '4y') {
      Promise.all(GRADES.map(({ id }) => missionService.getProgress(id))).then(
        (result) => {
          const data = result
            .map((i) =>
              i.reduce(
                (acc, item) => {
                  const season = Math.ceil((item.month - 1) / 4);
                  acc[season] = {
                    total: acc[season].total + item.total,
                    done: acc[season].done + item.done,
                  };
                  return acc;
                },
                [
                  { total: 0, done: 0 },
                  { total: 0, done: 0 },
                  { total: 0, done: 0 },
                  { total: 0, done: 0 },
                ],
              ),
            )
            .flat();
          setData(
            data.map((mission, i) => ({
              y: mission.done / mission.total,
              x: i,
            })),
          );
          setLabels(labelsInitial[rangeKey]);
        },
      );
    } else {
      missionService
        .getProgressGroupedByWeekInRange(grade, startMonth, endMonth)
        .then(result => {
          setData(
            result.map((mission, i) => ({
              y: mission.done / mission.total,
              x: i,
            })),
          );
          setLabels(labelsInitial[rangeKey]);
        });
    }
  }, [startMonth, endMonth, rangeKey, grade]);

  const lineChartData = {
    labels,

    datasets: [
      {
        backgroundColor: 'orange',
        borderColor: 'gray',
        borderWidth: 0.5,
        lineTension: 0.4,
        fill: false,
        data,
      },
    ],
  };

  return (
    <div>
      <Container className="graphs-container">
        <Row style={{ width: '85%' }}>
          <Line
            style={{ width: '50%' }}
            data={lineChartData}
            width={50}
            height={15}
            options={{
              legend: {
                display: false,
              },
              label: {
                fontSize: 18,
              },
              scales: {
                xAxes: [
                  {
                    ticks: {
                      fontColor: 'white',
                      callback: function (value, index) {
                        if ((index + 2) % 4 === 0) {
                          // every 4 week show 1 label
                          return value;
                        } else {
                          return null;
                        }
                      },
                    },
                  },
                ],
                yAxes: [
                  {
                    ticks: {
                      fontColor: 'white',
                      min: 0,
                      max: 1,
                      callback: function (value) {
                        return ((value / 1) * 100).toFixed(0) + '%';
                      },
                    },
                    scaleLabel: {
                      display: true,
                      labelString: 'Weekly progress',
                      fontColor: 'white',
                    },
                  },
                ],
              },
            }}
          />
        </Row>
      </Container>
    </div>
  );
});

export default MonthChart;
