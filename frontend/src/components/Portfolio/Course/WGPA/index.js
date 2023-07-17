import React from 'react';
import PropTypes from 'prop-types';

import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';

import withForwardRef from '../../../../util/HOC/withForwardRef';

const propTypes = {
  validated: PropTypes.bool,
  wGPA: PropTypes.number,
  onChange: PropTypes.func.isRequired,
};

class WeightedGPA extends React.PureComponent {
  handleChange = (event) => {
    let wGPA = event.target.value;
    if (wGPA) {
      wGPA = Number(wGPA);
    } else {
      wGPA = undefined;
    }
    this.props.onChange({ wGPA });
  };

  render() {
    const { wGPA, validated, innerRef } = this.props;
    return (
      <Card>
        <Card.Body>
          <Form ref={innerRef} validated={validated}>
            <Form.Group controlId="wGPA">
              <Form.Label>Weighted GPA</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter weighted GPA"
                value={wGPA || ''}
                min={0}
                step={0.1}
                onChange={this.handleChange}
                required
              />
              <Form.Control.Feedback type="invalid">Please fill in the weighted GPA.</Form.Control.Feedback>
            </Form.Group>
            <a href="https://gpacalculator.net/high-school-gpa-calculator/" target="_blank" rel="noopener noreferrer">
              Not sure? Find out here.
            </a>
          </Form>
        </Card.Body>
      </Card>
    );
  }
}

WeightedGPA.propTypes = propTypes;

export default withForwardRef(WeightedGPA);
