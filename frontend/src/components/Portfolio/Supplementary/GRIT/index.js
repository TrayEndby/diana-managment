import React from 'react';
import PropTypes from 'prop-types';

import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';

import withForwardRef from '../../../../util/HOC/withForwardRef';

const propTypes = {
  validated: PropTypes.bool,
  GRIT: PropTypes.number,
  onChange: PropTypes.func.isRequired,
};

const KEY = 'GRIT';

class GRITCard extends React.PureComponent {
  handleChange = (event) => {
    this.props.onChange(KEY, Number(event.target.value));
  };

  render() {
    const { GRIT, validated, innerRef } = this.props;
    const value = Number(GRIT);
    const formStyle = { width: 'fit-content', alignSelf: 'center' };

    return (
      <Card>
        <Card.Body>
          <Form ref={innerRef} validated={validated} style={formStyle}>
            <Form.Group controlId="grit-score">
              <Form.Label>GRIT score</Form.Label>
              <Form.Control
                required
                value={value || ''}
                type="number"
                min="0"
                step={0.1}
                placeholder="Enter score"
                onChange={this.handleChange}
              />
            </Form.Group>
            <a href="https://angeladuckworth.com/grit-scale/" target="_blank" rel="noopener noreferrer">
              Not sure? Take the test here.
            </a>
          </Form>
        </Card.Body>
      </Card>
    );
  }
}

GRITCard.propTypes = propTypes;

export default withForwardRef(GRITCard);
