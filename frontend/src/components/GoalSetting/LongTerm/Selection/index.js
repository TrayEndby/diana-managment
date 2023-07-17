import React from 'react';
import PropTypes from 'prop-types';

import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

import Layout from '../../Layout';
import Card from '../Card';

import { StrategyItems } from '../util';
import SaveButton from '../../../../util/SaveButton';

const propTypes = {
  title: PropTypes.string.isRequired,
  subTitle: PropTypes.any,
  items: StrategyItems.isRequired,
  selectedItems: StrategyItems.isRequired,
  maxSelection: PropTypes.number.isRequired,
  optional: PropTypes.bool,
  geItemName: PropTypes.func,
  getDescription: PropTypes.func,
  onSelect: PropTypes.func.isRequired,
  onBack: PropTypes.func.isRequired,
  onNext: PropTypes.func.isRequired,
};

const Selection = ({
  title,
  subTitle,
  items,
  selectedItems,
  maxSelection,
  optional,
  geItemName,
  getDescription,
  onSelect,
  onBack,
  onNext,
}) => {
  const handleSave = async () => {
    return onNext(selectedItems);
  };

  const topBar = (
    <>
      <Col>
        <Button onClick={onBack}>Back</Button>
      </Col>
      <Col>
        <h5>{title}</h5>
        {subTitle || (
          <sub>
            Selected {selectedItems.length} of {maxSelection}
          </sub>
        )}
      </Col>
      <Col>
        <SaveButton disabled={!optional && selectedItems.length < maxSelection} onClick={handleSave}>
          Next
        </SaveButton>
      </Col>
    </>
  );
  return (
    <Layout customTopBar={topBar}>
      {items.map((item) => (
        <Card
          key={item.id}
          item={{
            ...item,
            name: geItemName ? geItemName(item) : item.name,
            description: getDescription ? getDescription(item) : item.description,
            selected: selectedItems.findIndex(({ id }) => item.id === id) > -1,
          }}
          onSelect={(selected) => onSelect(item, selected)}
        />
      ))}
    </Layout>
  );
};

Selection.propTypes = propTypes;

export default Selection;
