import React from 'react';
import MonthEarningSection from './MonthEarningSection';
import TransactionHistorySection from './TransactionHistorySection';
import style from './style.module.scss';
import CSABodyContainer from 'CSA/Container';
import MyEarningService from 'service/CSA/MyEarningService';

class EarningsPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: null,
      personalAmount: 0,
      downlineAmount: 0,
      totalAmount: 0,
    };
  }

  componentDidMount() {
    this.fetchGetMyEarning();
  }

  fetchGetMyEarning = async () => {
    const history = await MyEarningService.getEarningReport();
    this.setState({ history });
  };

  updatePersonalAmount = (personalAmt) => {
    this.setState({ personalAmount: personalAmt });
  };

  updateDownlineAmount = (downlineAmt) => {
    this.setState({ downlineAmount: downlineAmt });
  };

  updateTotalAmount = (totalAmt) => {
    this.setState({ totalAmount: totalAmt });
  };

  render() {
    return (
      <CSABodyContainer title="My Earnings" className={style.myEarnings}>
        <MonthEarningSection
          personalAmount={this.state.personalAmount}
          downlineAmount={this.state.downlineAmount}
          totalAmount={this.state.personalAmount + this.state.downlineAmount}
        />
        {this.state.history == null && 
          <div className={style.loading}>
            Loading...
          </div>
        }
        {this.state.history != null && (
          <TransactionHistorySection
            history={this.state.history}
            updatePersonalAmount={this.updatePersonalAmount}
            updateDownlineAmount={this.updateDownlineAmount}
            updateTotalAmount={this.updateTotalAmount}
          />
        )}
      </CSABodyContainer>
    );
  }
}

export default EarningsPage;
