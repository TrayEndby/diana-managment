import React from 'react';
import PropTypes from 'prop-types';

import Form from 'react-bootstrap/Form';

const propTypes = {
  year: PropTypes.number,
  onChange: PropTypes.func.isRequired,
};

class Graduation extends React.PureComponent {
  getRecentYears = () => {
    const startYear = new Date().getFullYear();
    const years = [];
    for (let i = 0; i < 6; i++) {
      years.push(startYear + i);
    }
    return years;
  };

  handleChange = (event) => {
    const year = Number(event.target.value) || undefined;
    this.props.onChange({ class: year });
  };

  render() {
    const { year } = this.props;
    return (
      <Form.Group>
        <Form.Label>Graudate Year</Form.Label>
        <Form.Control as="select" value={year} onChange={this.handleChange}>
          <option value="">Select</option>
          {this.getRecentYears().map((classYear) => (
            <option key={classYear} value={classYear}>
              {classYear}
            </option>
          ))}
        </Form.Control>
      </Form.Group>
    );
  }
}

Graduation.propTypes = propTypes;

export default Graduation;
