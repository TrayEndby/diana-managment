import React from 'react';
import PropTypes from 'prop-types';

import Form from 'react-bootstrap/Form';
import ParentService from '../../../../service/ParentService';
import "./style.scss";

const propTypes = {
  validated: PropTypes.bool,
  incomeLevel: PropTypes.number,
  onChange: PropTypes.func.isRequired,
};

class IncomeLevel extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      incomeList: [],
    };
  }

  componentDidMount() {
    this.fetchIncomeList();
  }

  fetchIncomeList = async () => {
    try {
      const incomeList = await ParentService.listParentIncomeLvl();
      if (incomeList.length) {
        this.setState({
          incomeList
        });
      }
    } catch (e) {
      console.error(e);
    }
  };

  handleChange = (e) => {
    this.props.onChange(+e.target.id);
  };

  render() {
    const { incomeLevel } = this.props;
    const { incomeList } = this.state;
    const formStyle = { width: 'fit-content', alignSelf: 'center' };

    return (
      <Form style={formStyle} className="text-left income-level">
        {incomeList.reverse().map((income, i) => (
          <Form.Check
            key={i}
            name="incomeLevel"
            type="radio"
            checked={income.id === incomeLevel}
            id={income.id}
            value={incomeLevel}
            label={income.name}
            onChange={this.handleChange}
          />
        ))}
      </Form>
    );
  }
}

IncomeLevel.propTypes = propTypes;

export default IncomeLevel;
