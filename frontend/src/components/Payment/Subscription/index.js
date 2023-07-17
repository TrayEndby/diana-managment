import React, { useReducer, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import { CheckCircle } from 'react-bootstrap-icons';
import cn from 'classnames';
import moment from 'moment';
import paymentService from 'service/PaymentService';
import authService from 'service/AuthService';
import style from './style.module.scss';
import Spinner from 'util/Spinner';
import * as ROUTES from 'constants/routes';
import { Link } from 'react-router-dom';
import { formatNumber } from 'util/helpers';
import { useHistory, useLocation } from 'react-router-dom';
import DotStepBar from '../../../util/DotStepBar';

const initialState = {
  isLoading: false,
  holderName: '',
  paymentHistory: [],
  paymentAmount: 0,
  subscribedUsers: 0,
  paidUsers: '',
  paidDate: '',
  renewalDate: '',
  noPayments: false
}

function reducer(state, action) {
  switch (action.type) {
    case 'isLoading':
      return { ...state, isLoading: action.payload };
    case 'name':
      return { ...state, holderName: action.payload };
    case 'email':
      return { ...state, holderEmail: action.payload };
    case 'paymentAmount':
      return { ...state, paymentAmount: action.payload };
    case 'subscribedUsers':
      return { ...state, subscribedUsers: action.payload };
    case 'subscribeYears':
      return { ...state, subscribeYears: action.payload };
    case 'paidDate':
      return { ...state, paidDate: action.payload };
    case 'renewalDate':
      return { ...state, renewalDate: action.payload };
    case 'noPayments':
      return { ...state, noPayments: action.payload };
    case 'paymentHistory':
      return { ...state, paymentHistory: action.payload };
    default:
      throw new Error();
  }
}

const Subscription = ({ authedAs }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const history = useHistory();
  const location = useLocation();

  useEffect(() => {
    const fetchPaymentInfo = async () => {
      dispatch({ type: 'isLoading', payload: true });
      const resp = await paymentService.getPaymentHistory();
      const payment = resp?.payment;
      if (payment && payment.length) {
        const name = authService.getDisplayName();
        const primaryPayment = payment[0];
        const email = primaryPayment.subscription[0]?.user_email;
        const subscribedUsers = primaryPayment?.subscription.length;
        const subscribeYears = primaryPayment.subscription[0]?.num_months / 12;
        const renewalDate = getRenewalDate(primaryPayment?.paid_date, subscribeYears);
        dispatch({ type: 'paymentHistory', payload: payment });
        dispatch({ type: 'name', payload: name });
        dispatch({ type: 'email', payload: email });
        dispatch({ type: 'paymentAmount', payload: primaryPayment.payment_amount });
        dispatch({ type: 'subscribedUsers', payload: subscribedUsers });
        dispatch({ type: 'subscribeYears', payload: subscribeYears });
        dispatch({ type: 'paidDate', payload: primaryPayment?.paid_date });
        dispatch({ type: 'renewalDate', payload: renewalDate });
      } else {
        dispatch({ type: 'noPayments', payload: true })
      }
      dispatch({ type: 'isLoading', payload: false });
    }
    fetchPaymentInfo();
  }, []);

  const getRenewalDate = (date, subscribeYears) => {
    const paidDate = moment(new Date(date));
    const renewalDate = paidDate.add(subscribeYears * 12, 'months');
    return renewalDate.format('YYYY-MM-DD');
  }

  const handleReceipt = (index) => {
    const selectedPayment = paymentHistory[index];

    selectedPayment.holderName = state?.holderName;
    selectedPayment.holderEmail = state?.holderEmail;
    selectedPayment.renewalDate = state?.renewalDate;
    selectedPayment.subscribedUsers = selectedPayment.subscription?.length;

    selectedPayment.csaDiscount = selectedPayment.promo_discount * 100;
    selectedPayment.yearDiscount = selectedPayment.multi_year_discount * 100;
    selectedPayment.yearDiscountAmount = selectedPayment.multi_year_discount * selectedPayment.subtotal;
    selectedPayment.csaDiscountAmount = selectedPayment.promo_discount * selectedPayment.subtotal * (1.0 - selectedPayment.multi_year_discount);
    history.push(ROUTES.RECEIPT, selectedPayment);
  }

  const { paymentHistory, isLoading, holderName, paymentAmount, subscribedUsers, subscribeYears, renewalDate, noPayments } = state;
  return (
    <div className={style.subscriptionWrapper}>
      {location.pathname === "/payment-success" || (
        <Button variant="primary" onClick={() => history.goBack()}>
        Back
        </Button>
      )}
      {history.location.pathname.indexOf('success') > -1 && <DotStepBar steps={[11, 11, 11]}/>}
      <div className={style.container}>
        {isLoading ? <Spinner /> : (
          <>
            {!noPayments ? (
              <>
                <div className={style.header}>
                  <div className={style.section}>
                    <p className={style.status}>
                      <CheckCircle />
                      <span>Primary holder</span>
                    </p>
                    <h3 className={style.sectionTitle}>{holderName}</h3>
                  </div>
                  <div className={style.section}>
                    <p className={style.sectionHeadline}>Subscription Amount</p>
                    <h3 className={style.sectionTitle}>{`$${formatNumber(paymentAmount)}`}</h3>
                    <p className={style.text}>{subscribedUsers} user subscriptions for {subscribeYears} years period of time.</p>
                  </div>
                  <div className={style.section}>
                    <p className={style.sectionHeadline}>Renewal Date</p>
                    <h3 className={style.sectionTitle}>{renewalDate}</h3>
                    <p className={style.text}>All the renewal dates for the children will be synced up with the primary subscription holder</p>
                  </div>
                  <div className={cn(style.section, style.subscription)}>
                    <p className={style.sectionHeadline}>Manage</p>
                    <h3 className={style.sectionTitle}>Subscription</h3>
                    <div className={style.buttonsWrap}>
                      <Link to={ROUTES.PAYMENT}>
                        <Button type="primary">View</Button>
                      </Link>
                {true || // TODO
                  <Button className="btn-secondary">Cancel</Button>
                }
                    </div>
                  </div>
                </div>

                <div className={style.content}>
                  <div className={style.subSection}>
                    <h5 className={style.subSectionTitle}>Subscription</h5>
                    <div className={style.subSectionContent}>
                      <div className={style.subSectionItem}>
                        <span className={style.sectionHeadline}>Subscription amount</span>
                        <span className={cn(style.sectionTitle, style.small)}>{`$${formatNumber(paymentAmount)}`}</span>
                        <span className={style.text}>{subscribedUsers} user subscription included for {subscribeYears} years</span>
                      </div>
                      <div className={style.subSectionItem}>
                        <span className={style.sectionHeadline}>Renewal date</span>
                        <span className={cn(style.sectionTitle, style.small)}>{renewalDate}</span>
                        <span className={style.text}>All the renewal dates for the children will be synced up with the primary subscription holder on</span>
                      </div>
                    {true ||  // TODO
                      <div className={style.buttonsWrap}>
                        <Link to={ROUTES.PAYMENT}>
                          <Button type="primary">Change</Button>
                        </Link>
                        <Button className="btn-secondary">Cancel</Button>
                      </div>
                    }
                    </div>
                  </div>

                  <div className={style.subSection}>
                    <h5 className={style.subSectionTitle}>Billing history</h5>
                    <div className={style.subSectionContent}>
                      <div className={style.billingTable}>
                        <header className={style.billingTableHeader}>
                          <div className={style.td}>
                            Date
                          </div>
                          <div className={style.td}>
                            Total
                          </div>
                          <div className={style.td}>
                            Order Description
                          </div>
                          <div className={style.td}>
                            Receipt
                          </div>
                        </header>
                        {paymentHistory.map((x, i) => {
                          const subscribedUsers = x.subscription?.length;
                          return (
                            <div className={style.billingTableContent} key={i} >
                              <div className={style.td}>
                                <span className={style.text}>
                                  {x?.paid_date}
                                </span>
                              </div>
                              <div className={style.td}>
                                <span className={style.text}>
                                  {`$${formatNumber(x?.payment_amount)}`}
                                </span>
                              </div>
                              <div className={style.td}>
                                <span className={style.text}>
                                  {subscribedUsers} user subscriptions
                              </span>
                              </div>
                              <div className={style.td}>
                                <span className={cn(style.text, style.receipt)} onClick={() => handleReceipt(i)}>
                                  Receipt
                                  </span>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) :
              <div className={style.noSubscriptionsWrap}>
                <h3 className={style.noSubscriptions}>No Subscriptions </h3>
                <Link to={ROUTES.PAYMENT}>
                  <Button>Go to Payment page</Button>
                </Link>
              </div>
            }
          </>
        )}
      </div>
    </div>
  );
}

export default Subscription;
