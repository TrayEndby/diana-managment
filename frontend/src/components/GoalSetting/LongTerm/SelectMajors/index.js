import React from 'react';
import PropTypes from 'prop-types';

import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

import Layout from '../../Layout';
import Card from '../Card';

import { StrategyItems } from '../util';
import SaveButton from '../../../../util/SaveButton';
import style from './style.module.scss';

const propTypes = {
  majors: StrategyItems.isRequired,
  selectedMajors: StrategyItems.isRequired,
  onSelect: PropTypes.func.isRequired,
  onHelp: PropTypes.func,
  onSave: PropTypes.func.isRequired,
};

const SelectMajors = ({ title, subtitle, majors, selectedMajors, onSelect, onHelp, onSave, type }) => {
  const handleSave = async () => {
    return onSave(selectedMajors);
  };

  const topBar = (
    <>
      {onHelp && (
        <Col>
          <Button onClick={onHelp}>Help me to choose</Button>
        </Col>)}
      <Col>
        <h5>{title}</h5>
        <sub>Choose maximum 3</sub>
      </Col>
      <Col>
        <SaveButton disabled={selectedMajors.length === 0} onClick={handleSave}>
          Done
        </SaveButton>
      </Col>
    </>
  );

  const expertiseTopBar = (
    <>
      <div className={style.expertiseTopBar}>
        <h5 className={style.expertiseTitle}>{title}</h5>
        {subtitle && <p>{subtitle}</p>}
        <sub className={style.expertiseSub}>Choose maximum 3</sub>
      </div>
    </>
  );

  return (
    <Layout customTopBar={type === "goals" ? topBar : expertiseTopBar}>
      {majors.map((major) => {
        const selectedIndex = selectedMajors.findIndex(({ id }) => major.id === id);
        return (
          <Card
            key={major.id}
            item={{
              ...major,
              selected: selectedIndex > -1,
              selectText: selectedIndex + 1 + '',
            }}
            onSelect={(selected) => onSelect(major, selected)}
          />
        );
      })}
    </Layout>
  );
};

SelectMajors.propTypes = propTypes;

export default SelectMajors;
