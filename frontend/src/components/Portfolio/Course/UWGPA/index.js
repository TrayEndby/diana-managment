import React from 'react';
import PropTypes from 'prop-types';

import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';

import withForwardRef from '../../../../util/HOC/withForwardRef';

const propTypes = {
  validated: PropTypes.bool,
  uwGPA: PropTypes.number,
  onChange: PropTypes.func.isRequired,
};

class UnweightedGPA extends React.PureComponent {
  handleChange = (event) => {
    let uwGPA = event.target.value;
    if (uwGPA) {
      uwGPA = Number(uwGPA);
    } else {
      uwGPA = undefined;
    }
    this.props.onChange({ uwGPA });
  };

  render() {
    const { uwGPA, validated, innerRef } = this.props;
    return (
      <Card>
        <Card.Body>
          <Form ref={innerRef} validated={validated}>
            <Form.Group controlId="uwGPA">
              <Form.Label>Unweighted GPA</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter unweighted GPA"
                value={uwGPA || ''}
                step={0.1}
                min={0}
                onChange={this.handleChange}
                required
              />
              <Form.Control.Feedback type="invalid">Please fill in the unweighted GPA.</Form.Control.Feedback>
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

UnweightedGPA.propTypes = propTypes;

export default withForwardRef(UnweightedGPA);
