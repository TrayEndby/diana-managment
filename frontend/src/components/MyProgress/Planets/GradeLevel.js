import React from 'react';
import cn from 'classnames';

import Form from 'react-bootstrap/Form';

import styles from './styles.module.scss';

const GradeLevel = ({ selectedGrade, grades, gradeOnChange }) => {
  const onChangeGradeHandler = (event) => {
    const grade = grades.find((g) => g.id === +event.target.value);
    gradeOnChange(grade);
    localStorage.setItem('MyEvolution.Grade.id', grade.id);
  };

  return (
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
  );
};

export default GradeLevel;
