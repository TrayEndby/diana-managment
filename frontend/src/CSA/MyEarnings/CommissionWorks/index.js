import React from 'react';
import CSABodyContainer from 'CSA/Container';
import Form from 'react-bootstrap/Form';
import { formatNumber } from 'util/helpers';
import { ReactComponent as AstIcon } from 'assets/svg/Astronaut.svg';

import style from './style.module.scss';

class CommissionWorksPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      transactionType: 1,
      accountCount: 1,
      subscriptionYear: 1,
      childCount: 0,
      discountPrice: 0,
    };
  }

  componentDidMount() {
    this.calcDiscount();
  }

  getSubscriptionYearFee = () => {
    const year = parseInt(this.state.subscriptionYear);
    if (year === 0) return 0;
    const fee = year === 1 ? 0 : year === 2 ? 0.05 : 0.1;
    return fee;
  };

  calcDiscount = () => {
    const annualSubscription = 1500;
    const additionalChild = 600;
    const directSale = 0.25;
    const downlineSale = 0.08
    const transactionFee = parseInt(this.state.transactionType) === 1 ? directSale : downlineSale;
    const promotionCodeFee = 0.05;
    const discountPrice =
      (annualSubscription * parseInt(this.state.accountCount) + additionalChild * parseInt(this.state.childCount)) *
      (1 - promotionCodeFee - this.getSubscriptionYearFee()) *
      parseInt(this.state.subscriptionYear) *
      transactionFee;
    this.setState({ discountPrice });
  };

  handleTransactionType = async (e) => {
    await this.setState({ transactionType: e.target.value });
    this.calcDiscount();
  };

  handleAccountCount = async (e) => {
    await this.setState({ accountCount: e.target.value });
    this.calcDiscount();
  };

  handleSubscriptionYear = async (e) => {
    await this.setState({ subscriptionYear: e.target.value });
    this.calcDiscount();
  };

  handleChildCount = async (e) => {
    await this.setState({ childCount: e.target.value });
    this.calcDiscount();
  };

  render() {
    return (
      <CSABodyContainer title="How Commission Works" className={style.commissionWorks}>
        <div className={style.subContainter}>
          <div className={style.itemContainer} style={{ marginTop: '55px' }}>
            <b style={{ fontSize: "17px" }}>As an active College Success Advisor (CSA)</b>, you’ll earn 10-25% commission on your eligible personal monthly sales (list subscription price - discounts) as well as up to 8% on the eligible personal sales (list subscription price - discounts) of CSAs whom you directly mentor. The downline CSA will provide first level customer service and earn commissions from successful renewals.
          </div>
          <div className={style.itemContainer}>
            We offer <b>promotion code</b> (based upon the number of accounts signed up at the same time) and <b>multi-year discount</b> (based on the number of years of subscription paid upon sign up).  These two types of discounts can be used together and the total discount is up to 35%.
          </div>
          <div className={style.secondContainer}>
            <div className={style.rectangleContainer}>
              <div>
                <AstIcon style={{ width: '65px', height: '80px', marginRight: '30px' }} />
              </div>
              <div style={{ fontSize: "14px" }}>
                All commissions are transferred 5-7 business days after the end of the month. Commissions are paid via direct deposit or checks before direct deposit is set up.
              </div>
            </div>
          </div>
          <div className={style.itemContainer}>
            Once a transfer has been initiated by Kyros.ai, it can take 24-48 hours for processing and deposit into your account (check your financial institution for guidelines on their processing times). Checks usually take 3-7 business to reach your mailing address.  Please email <b>ap@kyros.ai</b> if you have any questions on commission amount or missing payment.
          </div>
          <div className={style.itemContainer}>
            <h3>What does "Active CSA" Mean?</h3>
            To be considered an active CSA and eligible to earn commissions on personal sales from CSAs whom you directly mentor, you must make at least 1 eligible personal sale (including split sale) in any given calendar month or recruit at least 1 new CSA into your team.
          </div>
          <div className={style.itemContainer}>
            <h3>What are Eligible Sales?</h3>
            Eligible personal sales are sales made through your personal website or split sale between you and your downline CSAs. Sales are calculated on subtotals before taxes and after all discounts. Refunded purchases will be deducted from commissions.
          </div>
          <div className={style.itemContainer}>
            <h5>Not eligible:</h5>
            <ul style={{ marginTop: "10px" }}>
              <li>College counselling services delivered by a kyros.ai certified consultant(s). </li>
              <li>
                Other services provided by educators (such as Tutoring, application strategy  review etc.) within the Kyros.ai community.
              </li>
            </ul>
          </div>
          <div className={style.itemContainer}>
            <h3>
              How Does Pricing Works?
              <p style={{ color: 'black', fontSize: '18px', display: 'inline' }}>
                &nbsp;&nbsp;(Discount for Customers)
              </p>
            </h3>
            <table className={style.borderTable}>
              <tbody>
                <tr>
                  <td style={{ color: '#f78154', fontWeight: "bolder", backgroundColor: "#f4f4f4" }}>Promotion code</td>
                  <td>5%, if &#60; 10 accounts</td>
                  <td>10%, if 10-24 accounts</td>
                  <td>25%, if &gt;= 25 accounts</td>
                </tr>
                <tr>
                  <td style={{ color: '#f78154', fontWeight: "bolder", backgroundColor: "#f4f4f4" }}>Multi-year discount</td>
                  <td>0%, if 1 year</td>
                  <td>5%, if 2 years</td>
                  <td>10%, if &gt; 2 years</td>
                </tr>
              </tbody>
            </table>
            <ul style={{ marginTop: '28px' }}>
              <li>Each family account includes 1 parent and 1 student as the default.</li>
              <li>Promotion code and multi-year discount can be used together.</li>
              <li>Additional child is eligible for the same discounts as the family account</li>
            </ul>
          </div>
          <div className={style.itemContainer}>
            <h3>
              How Does Commission Works?
              <p style={{ color: 'black', fontSize: '18px', display: 'inline' }}>&nbsp;&nbsp;(Commission for CSAs)</p>
            </h3>
            <table className={style.borderTable}>
              <thead>
                <tr style={{ color: '#f78154', fontWeight: "bolder", backgroundColor: "#f4f4f4" }}>
                  <td>Sales Type</td>
                  <td>Commision Base (List price - discounts) * quantity</td>
                  <td>Commission Payout %</td>
                  <td>Commission Amount</td>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Referral fee
                  <br></br>(Kyros closes the sale)</td>
                  <td className="text-left">E.g. 1 single-year account: <br></br>$1,500 - 5% x $1,500 = $1,425</td>
                  <td>10%</td>
                  <td>$1,425 x 10% = $142.5</td>
                </tr>
                <tr>
                  <td>Close the sales from Kyros’ leads</td>
                  <td className="text-left">E.g. 1 single-year account: <br></br>$1,500 - 5% x $1,500 = $1,425</td>
                  <td>15%</td>
                  <td>$1,425 x 15% = $213.75</td>
                </tr>
                <tr>
                  <td>Direct Sale <br></br>(full cycle = lead gen + sales closure)</td>
                  <td className="text-left">E.g. 1 single-year account: <br></br>$1,500 - 5% x $1,500 = $1,425</td>
                  <td>25%</td>
                  <td>$1,425 x 25% = $356.25</td>
                </tr>
                <tr>
                  <td>Downline Sale</td>
                  <td className="text-left">E.g. 1 single-year account: <br></br>$1,500 - 5% x $1,500 = $1,425
                    <ul className="mt-2">
                      <li>Referral only</li>
                      <li>Close the sales from Kyros’ leads</li>
                      <li>Full sales cycle</li>
                    </ul>
                  </td>
                  <td><ul>
                    <li>8% x 40% = 3.2%</li>
                    <li>8% x 60% = 4.8%</li>
                    <li>8% x 100% = 8%</li>
                  </ul>
                  </td>
                  <td>
                    <ul className="text-left">
                      <li>$1,425 x 3.2% = $45.6</li>
                      <li>$1,425 x 4.8% = $68.4</li>
                      <li>$1,425 x 8%= $114</li>
                    </ul>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className={style.itemContainer} style={{ marginBottom: '150px', marginTop: "70px" }}>
            <h3>Commission Calculator</h3>
            <table className={style.unborderTable}>
              <tbody>
                <tr style={{ color: '#f78154', fontWeight: "bolder" }}>
                  <td>Transaction Type</td>
                  <td>Number of Accounts</td>
                  <td>Years of Subscription</td>
                  <td>Additional Children</td>
                  <td rowSpan="2" style={{ color: 'black', width: '5%', fontSize: '28px' }}>
                    =
                  </td>
                  <td>Your Commission Total</td>
                </tr>
                <tr>
                  <td>
                    <Form.Control
                      required
                      as="select"
                      className={style.comboStyle}
                      onChange={(e) => this.handleTransactionType(e)}
                    >
                      <option value="1">Personal Sales(25%)</option>
                      <option value="2">Downline Sales(8%)</option>
                    </Form.Control>
                  </td>
                  <td>
                    <Form.Control
                      required
                      as="select"
                      className={style.numericComboStyle}
                      value={this.state.accountCount}
                      onChange={(e) => this.handleAccountCount(e)}
                    >
                      {Array(100)
                        .fill(0)
                        .map((x, ind) => (
                          <option key={ind} value={ind + 1}>
                            {ind + 1}
                          </option>
                        ))}
                    </Form.Control>
                  </td>
                  <td>
                    <Form.Control
                      required
                      as="select"
                      className={style.numericComboStyle}
                      value={this.state.subscriptionYear}
                      onChange={(e) => this.handleSubscriptionYear(e)}
                    >
                      {Array(5)
                        .fill(0)
                        .map((x, ind) => (
                          <option key={ind} value={ind + 1}>
                            {ind + 1}
                          </option>
                        ))}
                    </Form.Control>
                  </td>
                  <td>
                    <Form.Control
                      required
                      as="select"
                      className={style.numericComboStyle}
                      value={this.state.childCount}
                      onChange={(e) => this.handleChildCount(e)}
                    >
                      {Array(10)
                        .fill(0)
                        .map((x, ind) => (
                          <option key={ind} value={ind}>
                            {ind}
                          </option>
                        ))}
                    </Form.Control>
                  </td>
                  <td style={{ fontSize: '28px' }}>${formatNumber(this.state.discountPrice)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </CSABodyContainer>
    );
  }
}

export default CommissionWorksPage;
