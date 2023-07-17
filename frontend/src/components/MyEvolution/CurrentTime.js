import React from 'react';
import moment from 'moment';

const CurrentTime = () => {
  const [timeToDisplay, setTimeToDisplay] = React.useState('');

  React.useEffect(() => {
    let timer;

    const startTimer = () =>
      setTimeout(() => {
        timer = startTimer();
        setTimeToDisplay(moment().format('MMMM D[,] LTS'));
      }, 1000 - (Date.now() % 1000)); // Preventing the accumulation of interval delays

    timer = startTimer();

    return () => clearTimeout(timer);
  }, []);

  return timeToDisplay;
};

export default React.memo(CurrentTime);
