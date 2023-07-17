import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import Header from '../Header';
import BackButton from 'util/BackButton';
import CalendarBoard from './Calendar';
import TimesBoard from './Times';
import { getTimeSlots } from '../util';

import styles from './style.module.scss';

const propTypes = {
  owner: PropTypes.string.isRequired,
  duration: PropTypes.number.isRequired,
  freeSlots: PropTypes.object.isRequired,
  busySlots: PropTypes.object.isRequired,
  onNext: PropTypes.func.isRequired,
  onBack: PropTypes.func.isRequired,
};

const TimeCard = ({
  owner,
  duration,
  freeSlots,
  busySlots,
  onNext,
  onBack,
}) => {
  const [selectedDate, setSelectedDate] = useState();
  const [selectedTime, setSelectedTime] = useState();
  const [timeSlots, setTimeSlots] = useState();

  const handleSelectDate = (date) => {
    if (freeSlots.has(date)) {
      setSelectedDate(date);
    }
  };

  useEffect(() => {
    setTimeSlots(
      getTimeSlots(
        freeSlots.get(selectedDate),
        busySlots.get(selectedDate),
        duration,
      ),
    );
  }, [selectedDate, duration, freeSlots, busySlots]);

  return (
    <section>
      <Header owner={owner} duration={duration} />
      <BackButton onClick={onBack} />
      <Row className={styles.times}>
        <Col>
          <div className={styles.title}>Select Date</div>
          <CalendarBoard
            selectedDate={selectedDate}
            freeSlots={freeSlots}
            onSelect={handleSelectDate}
          />
        </Col>
        <Col>
          <div className={styles.title}>Select Time</div>
          <TimesBoard
            slots={timeSlots}
            selectedTime={selectedTime}
            onSelect={setSelectedTime}
          />
        </Col>
      </Row>
      <Button
        className={styles.button}
        disabled={!selectedDate || !selectedTime}
        onClick={() =>
          onNext({
            date: selectedDate,
            time: selectedTime,
          })
        }
      >
        Continue
      </Button>
    </section>
  );
};

TimeCard.propTypes = propTypes;

export default TimeCard;
