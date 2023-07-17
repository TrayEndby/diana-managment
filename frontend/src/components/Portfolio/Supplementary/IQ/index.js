import React from 'react';
import PropTypes from 'prop-types';

import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';

import withForwardRef from '../../../../util/HOC/withForwardRef';

const propTypes = {
  validated: PropTypes.bool,
  IQ: PropTypes.number,
  onChange: PropTypes.func.isRequired,
};

const KEY = 'IQ';

class IQCard extends React.PureComponent {
  handleChange = (event) => {
    this.props.onChange(KEY, Number(event.target.value));
  };

  render() {
    const { IQ, validated, innerRef } = this.props;
    const value = Number(IQ);
    const formStyle = { width: 'fit-content', alignSelf: 'center' };

    return (
      <Card>
        <Card.Body>
          <Form ref={innerRef} validated={validated} style={formStyle}>
            <Form.Group controlId="IQ-score">
              <Form.Label>IQ score</Form.Label>
              <Form.Control
                required
                value={value || ''}
                type="number"
                min="0"
                placeholder="Enter score"
                onChange={this.handleChange}
              />
            </Form.Group>
          </Form>
        </Card.Body>
      </Card>
    );
  }
}

IQCard.propTypes = propTypes;

export default withForwardRef(IQCard);
