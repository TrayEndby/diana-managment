import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import style from './style.module.scss';
import Form from 'react-bootstrap/Form';

const propTypes = {
  testScores: PropTypes.object.isRequired,
  collegeTypes: PropTypes.array.isRequired,
  onTestScoreChange: PropTypes.func.isRequired,
  onCollegeTypeChange: PropTypes.func.isRequired,
};

const General = ({ testScores, collegeTypes, onTestScoreChange, onCollegeTypeChange }) => {
  const SATLists = [
    { key: 'SATMath', name: 'Math' },
    { key: 'SATReadingWriting', name: 'Reading and Writing' },
  ];
  const ACTLists = [
    { key: 'ACTMath', name: 'Math' },
    { key: 'ACTEnglish', name: 'English' },
    { key: 'ACTCompose', name: 'Writing' },
  ];
  return (
    <Form.Group className={style.container}>
      <h3 className="text-white text-center pb-3">General</h3>
      {/* SAT */}
      <TestScores title="SAT" testList={SATLists} testScores={testScores} onChange={onTestScoreChange} />
      {/* ACT */}
      <TestScores title="ACT" testList={ACTLists} testScores={testScores} onChange={onTestScoreChange} />
      {/* college types */}
      <Form.Label className="text-white pb-2 pt-3">College type</Form.Label>
      {collegeTypes.map(({ id, name, selected }) => (
        <Form.Check
          className="text-white"
          id={'General' + id}
          key={'General' + id}
          type="checkbox"
          label={name}
          checked={selected}
          onChange={() => onCollegeTypeChange(id)}
        />
      ))}
    </Form.Group>
  );
};

const TestScores = ({ title, testList, testScores, onChange }) => {
  return testList.map(({ key, name }) => (
    <Fragment key={key}>
      <Form.Label className="text-white">
        {title} {name}
      </Form.Label>
      <Form.Control
        className="mb-1"
        type="number"
        value={testScores[key] || ''}
        placeholder="Optional"
        onChange={(e) => onChange(key, Number(e.target.value))}
      />
    </Fragment>
  ));
};

General.propTypes = propTypes;

export default General;
