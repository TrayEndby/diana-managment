import React from 'react';
import cn from 'classnames';

import Form from 'react-bootstrap/Form';
import Legends from '../Legends';

import styles from './style.module.scss';

const EvolutionHeader = ({
  title,
  selectedGrade,
  goals,
  stats,
  grades,
  gradeOnChange,
}) => {
  const onChangeGradeHandler = (event) => {
    const grade = grades.find((g) => g.id === +event.target.value);
    gradeOnChange(grade);
    localStorage.setItem('MyEvolution.Grade.id', grade.id);
  };

  return (
    <div className={cn(styles.header, 'evolutionHeader')}>
      <div className="col-sm-2"></div>
      <div className="col-sm-8">
        <div className={styles.title}>{title}</div>
        <div className="d-flex">
          <Legends goals={goals} stats={stats} />
        </div>
      </div>
      <Form.Group className={cn(styles.grade, 'col-sm-2')}>
        <Form.Label>Grade</Form.Label>
        <Form.Control
          as="select"
          value={selectedGrade.id}
          onChange={onChangeGradeHandler}
        >
          {grades.map((item) => (
            <option key={item.id} value={item.id}>
              {item.text}
            </option>
          ))}
        </Form.Control>
      </Form.Group>
    </div>
  );
};

export default EvolutionHeader;
