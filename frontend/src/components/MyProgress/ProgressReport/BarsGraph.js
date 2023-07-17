import React from 'react';
import PropTypes from 'prop-types';

import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';

import { Bar } from 'react-chartjs-2';

const propTypes = {
  data: PropTypes.array.isRequired, // 1st to 4th week data
};

const BarsGraph = React.memo(({ data }) => {
  const barChartData = {
    labels: ['1st week', '2nd week', '3th week', '4th week'],
    datasets: [
      {
        backgroundColor: ['#F78154', '#0E8B30', '#A549FF', '#1495DD'],
        fontColor: '#fff',
        data: [...data],
      },
    ],
  };
  return (
    <div>
      <Container className="graphs-container">
        <Row style={{ width: '80%' }}>
          <Bar
            style={{ width: '50%' }}
            data={barChartData}
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
                    barPercentage: 0.4,
                    ticks: {
                      fontColor: 'white',
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

BarsGraph.propTypes = propTypes;

export default BarsGraph;
