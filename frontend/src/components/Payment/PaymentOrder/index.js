import React, { useState, useEffect, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import Col from 'react-bootstrap/Col';
import cn from 'classnames';
import style from '../style.module.scss';
import FormControl from 'react-bootstrap/FormControl';
import FormCheck from 'react-bootstrap/FormCheck';
import Button from 'react-bootstrap/Button';
import { AddPlusGreen } from 'util/Icon';
import Spinner from 'util/Spinner';
import { loadStripe } from '@stripe/stripe-js';
import { CheckCircle, X } from 'react-bootstrap-icons';
import userProfileSearchService from 'service/UserProfileSearchService';
import paymentService from 'service/PaymentService';
import parentService from 'service/ParentService';
import { formatNumber } from 'util/helpers';
import useErrorHandler from 'util/hooks/useErrorHandler';
import ErrorDialog from 'util/ErrorDialog';
import * as ROUTES from 'constants/routes';
import { Link } from 'react-router-dom';
import DotStepBar from '../../../util/DotStepBar';

const YEARS_COUNT = [1, 2, 3, 4, 5];

const ORDER_TYPE = {
  PRIMARY: 'Primary',
  FREE: 'Free',
  CHILD: 'Child',
};

const PaymentOrder = ({ authedAs }) => {
  const [childList, setChildList] = useState();
  const [restChildList, setRestChildList] = useState();
  const [orderList, setOrderList] = useState();
  const [subtotal, setSubtotal] = useState(0);
  const [paymentSetup, setPaymentSetup] = useState({
    two_year_discount: 0,
    multi_year_discount: 0,
    additional_child_discount: 0,
  });

  const [yearsPercentDiscount, setYearsPercentDiscount] = useState(0);
  const [availableYears, setAvailableYears] = useState([1]);
  const [csaCode, setCsaCode] = useState();
  const [error, setError] = useErrorHandler();

  const history = useHistory();
  const searchString = history.location.search;

  const calculatePrice = useCallback((years, type, primaryYearPrice) => {
    if (!isNaN(+years)) {
      let price;
      if (type === ORDER_TYPE.PRIMARY) {
        price = primaryYearPrice;
      } else {
        price = primaryYearPrice * paymentSetup.additional_child_discount;
      }
      const lastPrice = years * price;
      return [price, lastPrice];
    }
  }, [paymentSetup.additional_child_discount]);

  const calculateYearsDiscount = useCallback((years) => {
    if (!isNaN(+years)) {
      if (years < 2) {
        return paymentSetup.one_year_discount * 100;
      } else if (years === 2) {
        return paymentSetup.two_year_discount * 100;
      } else {
        return paymentSetup.multi_year_discount * 100;
      }
    }
  }, [paymentSetup.one_year_discount, paymentSetup.two_year_discount, paymentSetup.multi_year_discount]);

  const getPaidYears = (email, list) => {
    const paidInfo = list.find((x) => x.user_email === email);
    return paidInfo.num_months / 12;
  };

  useEffect(() => {
    const fetchProfileInfo = async () => {
      const setup = await fetchPaymentSetup();
      if (setup == null) {
        setError('Cannot fetch payment setup.');
        return;
      }
      setPaymentSetup(setup);

      const profile = await userProfileSearchService.getParentProfile();
      const subscriptionList = await fetchPaymentHistory();
      const { firstName, lastName, email, csa_code } = profile.basic;
      setCsaCode(csa_code);

      const type = ORDER_TYPE.PRIMARY;
      let years = 1;
      const isPaid = hasPayed(email, subscriptionList);
      if (isPaid) {
        years = getPaidYears(email, subscriptionList);
        const avYears = [];
        for (let i = 1; i <= years; i++) {
          avYears.push(i);
        }
        setAvailableYears(avYears);
      }
      const [price, lastPrice] = calculatePrice(years, type, setup.annual_subscription_fee);
      const primaryHolder = {
        name: `${firstName} ${lastName}`,
        email,
        type,
        years,
        price,
        lastPrice,
        isPaid,
      };
      const childrenResp = await parentService.getChildren();
      const preparedOrder = [primaryHolder];
      if (childrenResp.length) {
        setChildList(childrenResp);
        const { name, email } = childrenResp[0];
        const isPaid = hasPayed(email, subscriptionList);
        if (isPaid) {
          years = getPaidYears(email, subscriptionList);
        }
        const addChild = {
          name,
          email,
          years,
          type: ORDER_TYPE.FREE,
          price: 0,
          lastPrice: 0,
          isPaid,
        };
        preparedOrder.push(addChild);
        const restChilds = [...childrenResp];
        restChilds.shift();
        setRestChildList(restChilds);
      }
      if (subscriptionList.length > 2) {
        for (let i = 2; i < subscriptionList.length; i++) {
          const selectedChild = childrenResp?.find(
            (x) => x?.email === subscriptionList[i]?.user_email,
          );
          if (selectedChild) {
            const { name, email } = selectedChild;
            const years = getPaidYears(email, subscriptionList);
            const type = ORDER_TYPE.CHILD;
            const [price, lastPrice] = calculatePrice(years, type, setup.annual_subscription_fee);
            const addChild = {
              name,
              email,
              years,
              type,
              price,
              lastPrice,
              isPaid: true,
            };
            preparedOrder.push(addChild);
          }
        }
      }
      setOrderList(preparedOrder);
    };

    const fetchPaymentHistory = async () => {
      const resp = await paymentService.getPaymentHistory();
      if (resp?.payment) {
        const paymentList = resp.payment;
        const subscriptionList2D = paymentList.map((x) => x.subscription);
        const subscriptionList = subscriptionList2D.reduce((prev, next) => [
          ...prev,
          ...next,
        ]);
        return subscriptionList;
      } else {
        return [];
      }
    };

    const hasPayed = (email, list) => {
      return !!list.find((x) => email === x.user_email);
    };

    const fetchPaymentSetup = async () => {
      const resp = await paymentService.setup();
      return resp || null;
    };

    fetchProfileInfo();
  }, [calculatePrice, setError]);

  useEffect(() => {
    if (orderList?.length) {
      const totalPrice = orderList.reduce((a, b) => {
        return !b.isPaid ? a + b.lastPrice : a;
      }, 0);
      const yearsDisc = calculateYearsDiscount(orderList[0].years);
      setYearsPercentDiscount(yearsDisc);
      setSubtotal(totalPrice);
    }
  }, [orderList, calculateYearsDiscount]);

  const handleChange = (type, index, e) => {
    const { name, value } = e.target;
    const updatedOrderList = [...orderList];
    let itemToUpdate;
    if (name === 'years') {
      const years = +value;
      if (type !== ORDER_TYPE.FREE) {
        const [price, lastPrice] = calculatePrice(years, type, paymentSetup.annual_subscription_fee);
        itemToUpdate = { ...updatedOrderList[index], years, price, lastPrice };
      } else {
        itemToUpdate = { ...updatedOrderList[index], years };
      }
      if (type === ORDER_TYPE.PRIMARY) {
        setAvailableYears(resetAvailableYears(years));
      }
    } else {
      const selectedChild = childList.find((x) => x.name === value);
      itemToUpdate = {
        ...updatedOrderList[index],
        [name]: selectedChild?.name,
        email: selectedChild?.email,
      };
    }
    updatedOrderList.splice(index, 1, itemToUpdate);
    if (type === ORDER_TYPE.PRIMARY) {
      setOrderList(updatedOrderList.map((value, index) => {
        value.years = updatedOrderList[0].years;
        return value;
      }));
    } else {
      setOrderList(updatedOrderList);
    }
  };

  const handleSubmit = async (orderTotal, promo_code) => {
    try {
      const unpaidOrders = orderList.filter((x) => !x.isPaid);
      const preparedOrderList = unpaidOrders.map((order) => ({
        user_email: order.email,
        num_years: order.years,
        user_name: order.name,
      }));
      const preparedData = {
        ...promo_code,
        order_total: orderTotal,
        item: preparedOrderList,
      };
      const sessionId = await paymentService.stripeCreateCheckoutSession(
        preparedData,
      );
      const publicKey = await paymentService.stripeGetPublicKey();
      const stripe = await loadStripe(publicKey);
      await stripe.redirectToCheckout({
        sessionId,
      });
    } catch (e) {
      setError(e);
    }
  };

  const childYearPrice = () => {
    return paymentSetup.annual_subscription_fee * (1.0 - paymentSetup.additional_child_discount);
  };

  const handleAddChild = () => {
    if (restChildList?.length) {
      const firstChild = restChildList[0];
      const newChild = {
        name: firstChild?.name,
        email: firstChild?.email,
        type: ORDER_TYPE.CHILD,
        years: 1,
        price: childYearPrice(),
        lastPrice: childYearPrice(),
        isPaid: false,
      };
      restChildList.shift();
      setRestChildList(restChildList);
      setOrderList([...orderList, newChild]);
    }
  };

  const handleRemoveChild = (index) => {
    const updatedOrderList = [...orderList];
    updatedOrderList.splice(index, 1);
    const itemToAdd = childList.find((x) => x.email === orderList[index].email);
    setRestChildList([...restChildList, itemToAdd]);
    setOrderList(updatedOrderList);
  };

  const resetAvailableYears = (year) => {
    const index = YEARS_COUNT.findIndex((x) => x === year);
    return YEARS_COUNT.slice(0, index + 1);
  };

  return (
    <div className={style.wrapper}>
      <ErrorDialog error={error} />
      {searchString.indexOf('signup') > -1 && <DotStepBar steps={[11, 11, 1]}/>}
      <div className={style.container}>
        <Col md={9} className={style.leftContainer}>
          <OrderList
            orderList={orderList}
            childList={childList}
            restChildList={restChildList}
            subtotal={subtotal}
            availableYears={availableYears}
            handleChange={handleChange}
            handleAddChild={handleAddChild}
            handleRemoveChild={handleRemoveChild}
            paymentSetup={paymentSetup}
          />
        </Col>
        <Col md={3} className={style.rightContainer}>
          <OrderSummary
            subtotal={subtotal}
            onSubmit={handleSubmit}
            yearsPercentDiscount={yearsPercentDiscount}
            csaCode={csaCode}
          />
        </Col>
      </div>
    </div>
  );
};

const OrderList = ({
  orderList,
  childList,
  restChildList,
  handleChange,
  subtotal,
  availableYears,
  handleAddChild,
  handleRemoveChild,
  paymentSetup,
}) => {
  const isAddDisabled = !restChildList?.length;
  let isSecondPayment = false;
  return (
    <div className={style.orderListContainer}>
      {orderList ? (
        <>
          <header className={style.header}>
            <span className={cn(style.headerItem, style.subscriber)}>
              Subscriber
            </span>
            <span className={cn(style.headerItem, style.price)}>
              Annual subscription fee
            </span>
            <span className={cn(style.headerItem, style.years)}>
              How many years?
            </span>
            <span className={cn(style.headerItem, style.lastPrice)}>
              List price
            </span>
          </header>
          <div className={style.orderList}>
            {orderList.map((order, index) => {
              const isPrimary = order.type === ORDER_TYPE.PRIMARY;
              const isChild = order.type === ORDER_TYPE.CHILD;
              const isFree = order.type === ORDER_TYPE.FREE;
              if (order.isPaid) {
                isSecondPayment = true;
              }
              const isPaid = order.isPaid;
              return (
                <div
                  key={index}
                  className={cn(
                    style.orderItem,
                    { [style.primaryItem]: isPrimary },
                    { [style.payed]: isPaid },
                  )}
                >
                  <div className={cn(style.orderItemBlock, style.subscriber)}>
                    <div className={style.orderItemNameWrap}>
                      {isPrimary ? (
                        <span className={style.name}>{order.name}</span>
                      ) : (
                        <FormControl
                          as="select"
                          name="name"
                          value={order.name}
                          className={cn(style.name, style.nameSelect)}
                          onChange={(e) => handleChange(order.type, index, e)}
                        >
                          {childList?.map((x, i) => (
                            <option key={i} value={x.name}>
                              {x.name}
                            </option>
                          ))}
                        </FormControl>
                      )}
                      <span className={style.email}>{order.email}</span>
                    </div>
                    {isPrimary ? (
                      <div className={cn(style.hintWrap, style.primary)}>
                        <span className={style.hintPrimaryHolder}>
                          <CheckCircle /> Primary holder
                        </span>
                        <span className={style.hint}>
                          For primary holder 1 child is included for free
                        </span>
                      </div>
                    ) : (
                      <div className={style.hintWrap}>
                        <span className={style.hintPrimaryHolder}>
                          <CheckCircle /> Secondary holder
                        </span>
                      </div>
                    )}
                  </div>
                  <div
                    className={cn(style.orderItemBlock, style.price)}
                  >{`$${formatNumber(order.price)}`}</div>
                  <div className={cn(style.orderItemBlock, style.years)}>
                    <FormControl
                      as="select"
                      name="years"
                      className={style.yearsSelect}
                      value={order.years}
                      onChange={(e) => handleChange(order.type, index, e)}
                    >
                      {isPrimary
                        ? YEARS_COUNT.map((x, i) => (
                            <option key={i} value={x}>
                              {x}
                            </option>
                          ))
                        : availableYears.map((x, i) => (
                            <option key={i} value={x}>
                              {x}
                            </option>
                          ))}
                    </FormControl>
                    {isPrimary && (
                      <div className={style.hintWrap}>
                        <span className={style.hint}>
                          Limited time offers: Pay for 1 year and get {Math.round(paymentSetup.one_year_discount * 10000)/100}% discount.
                        Pay for 2 years and get {Math.round(paymentSetup.two_year_discount * 10000)/100}% discount.
                        Pay for 3 or more years and get {Math.round(paymentSetup.multi_year_discount * 10000)/100}% discount. The discount will be
                          extended to all of your children and is applied during
                          checkout.
                        </span>
                      </div>
                    )}
                    {!isPaid && isSecondPayment && (
                      <div className={style.hintWrap}>
                        <span className={style.hint}>
                          The secondary subscription term will be synced up with
                          the primary subscription term on the primary sign up
                          date, the first year term refers to the remaining
                          months without proration. Any secondary subscriptions
                          can be termanated on the anniversary date of the
                          primary sign up date, but not exceed the primary
                          subscription term.
                        </span>
                      </div>
                    )}
                  </div>

                  <div className={cn(style.orderItemBlock, style.lastPrice)}>
                    {!isFree ? (
                      `$${formatNumber(order.lastPrice)}`
                    ) : (
                      <span className={style.free}>FREE</span>
                    )}
                    {isPaid && order.lastPrice !== 0 && (
                      <span className={cn(style.hint, style.green)}>
                        Already paid
                        (minus discount)
                      </span>
                    )}
                  </div>
                  {isChild && (
                    <div
                      className={style.removeItem}
                      onClick={() => handleRemoveChild(index)}
                    >
                      <X size={20} />
                    </div>
                  )}
                </div>
              );
            })}

            <div
              className={cn(style.addOrderItem, {
                [style.disabled]: isAddDisabled,
              })}
              onClick={handleAddChild}
            >
              <AddPlusGreen />
              <span>Add a child</span>
            </div>
          </div>
          <div className={style.subtotalContainer}>
            <span>
              <div className={style.childInfo}>
              Need to update your child information? <Link to={ROUTES.PARENT_PROFILE}><strong className="legal-link">Go to My Profile</strong></Link>
              </div>
            </span>
            <span className={style.subtotal}>Subtotal</span>
            <span className={style.amount}>{`$${formatNumber(subtotal)}`}</span>
          </div>
        </>
      ) : (
        <Spinner />
      )}
    </div>
  );
};

const OrderSummary = ({
  subtotal,
  onSubmit,
  yearsPercentDiscount,
  csaCode,
}) => {
  const [promoCodeInput, setPromoCodeInput] = useState('');
  const [promoCodeStatus, setPromoCodeStatus] = useState();
  const [acceptedPromoCode, setAcceptedPromoCode] = useState({});
  const [promoDiscRate, setPromoDiscRate] = useState(0);
  const [orderTotal, setOrderTotal] = useState();
  const [useParentCsaCode, setUseParentCsaCode] = useState(true);
  const [csaCodePromo, setCsaCodePromo] = useState({});
  const [promoDiscPercent, setPromoDiscPercent] = useState(0);
  const [isTermsAccepted, setIsTermsAccepted] = useState(false);
  const yearsDiscAmount = Math.round(subtotal * yearsPercentDiscount) / 100;

  useEffect(() => {
    let total = subtotal - yearsDiscAmount;
    // Promo is applied on the top of the year discount.
    setOrderTotal(total - total * promoDiscRate);
  }, [subtotal, yearsDiscAmount, promoDiscRate]);

  useEffect(() => {
    let codeDisc = 0;
    if (Object.keys(csaCodePromo).length) {
      codeDisc = csaCodePromo.promo_discount;
    }
    if (Object.keys(acceptedPromoCode).length) {
      codeDisc += acceptedPromoCode.promo_discount;
    }
    if (codeDisc) {
      setPromoDiscRate(codeDisc);
    }
  }, [subtotal, csaCodePromo, acceptedPromoCode]);

  const handleChangePromo = (e) => {
    const { value } = e.target;
    if (!value) {
      setPromoCodeStatus('');
    }
    setPromoCodeInput(e.target.value);
  };

  const handleRemoveCode = () => {
    setUseParentCsaCode(false);
    setCsaCodePromo({});
    setAcceptedPromoCode({});
    setPromoCodeStatus('');
    setPromoDiscPercent(0);
    setPromoDiscRate(0);
  };

  const handleCheckPromo = useCallback(
    async (promoCode) => {
      if (Object.keys(acceptedPromoCode).length > 0 ||
        Object.keys(csaCodePromo).length > 0) {
        setPromoCodeStatus({
          status: false,
          msg: 'Only one promotional code is accepted',
        });
      } else {
        try {
          const response = await paymentService.checkPromoCode(promoCode);
          const withData = !!response && !!Object.entries(response).length;
          if (withData) {
            let msg;
            const { is_csa, promo_discount } = response;
            if ("error" in response) {
              setPromoCodeStatus({
                status: false,
                msg: response.error,
              });
            } else {
              const discountPercent = promo_discount * 100;
              if (is_csa) {
                msg = `${discountPercent}% off (${response?.csa_name} code)`;
                setCsaCodePromo({
                  code: promoCode,
                  promo_discount,
                  status: true,
                  msg,
                });
              } else {
                msg = `${discountPercent}% off`;
                setAcceptedPromoCode({
                  is_csa,
                  code: promoCode,
                  promo_discount,
                  msg,
                });
              }
              setPromoDiscPercent((prev) => prev + discountPercent);
              setPromoCodeInput('');
            }
          } else {
            setPromoCodeStatus({
              status: false,
              msg: 'Invalid promotional code',
            });
          }
        } catch (error) {
          setPromoCodeStatus({
            status: false,
            msg: 'Invalid promotional code',
          });
        }
      }
    },
    [acceptedPromoCode, csaCodePromo],
  );

  useEffect(() => {
    if (csaCode && useParentCsaCode) {
      handleCheckPromo(csaCode);
    }
  }, [csaCode, handleCheckPromo, useParentCsaCode]);

  useEffect(() => {
    const csaDisc = csaCodePromo?.promo_discount || 0;
    const promoDisc = acceptedPromoCode?.promo_discount || 0;
    const calcPromoDiscPercent = (csaDisc + promoDisc) * 100;
    setPromoDiscPercent(calcPromoDiscPercent);
  }, [csaCodePromo, acceptedPromoCode]);

  return (
    <div className={style.orderSummaryContainer}>
      <h3 className={style.title}>Order Summary</h3>
      <div className={style.promoContainer}>
        <div className={style.formGroup}>
          <FormControl
            value={promoCodeInput}
            onChange={handleChangePromo}
            className={style.promoInput}
            placeholder="Promotional code"
          />
          <Button
            onClick={() => handleCheckPromo(promoCodeInput)}
            className={cn({
              disabled:
                !promoCodeInput || !!Object.keys(acceptedPromoCode).length ||
                !!Object.keys(csaCodePromo).length,
            })}
          >
            Apply
          </Button>
        </div>
        {promoCodeInput.length > 0 && (
          <p
            className={cn(
              style.promoCodeStatus,
              promoCodeStatus?.status ? style.success : style.error,
            )}
          >
            {promoCodeStatus?.msg}
          </p>
        )}
        <div className={style.acceptedContainer}>
          {!!Object.keys(csaCodePromo).length && (
            <div className={style.acceptedCodeBox}>
              <div className={style.acceptedCode}>
                <span>{csaCodePromo.code}</span>
                <X onClick={handleRemoveCode} />
              </div>
              <span className={style.acceptedCodeMsg}>{csaCodePromo?.msg}</span>
            </div>
          )}
          {!!Object.keys(acceptedPromoCode).length && (
            <div className={style.acceptedCodeBox}>
              <div className={style.acceptedCode}>
                <span>{acceptedPromoCode?.code}</span>
                <X onClick={handleRemoveCode} />
              </div>
              <span className={style.acceptedCodeMsg}>
                {acceptedPromoCode?.msg}
              </span>
            </div>
          )}
        </div>
      </div>
      <div className={style.discountContainer}>
        <div className={style.textRow}>
          <span className={style.text}>Subtotal</span>
          <span className={style.amount}>{`$${formatNumber(subtotal)}`}</span>
        </div>
        <div className={style.textRow}>
          <span className={style.text}>
            Multi-year discount ({Math.round(yearsPercentDiscount*100)/100}%)
          </span>
          <span className={style.amountWithPromo}>
            {yearsDiscAmount
              ? `-$${formatNumber(yearsDiscAmount)}`
              : yearsDiscAmount}
          </span>
        </div>
        <div className={style.textRow}>
          <span className={style.text}>
            Promotional code ({promoDiscPercent}%)
          </span>
          <span className={style.amountWithPromo}>
            {promoDiscRate
              ? `-$${formatNumber((subtotal - yearsDiscAmount) * promoDiscRate)}`
              : 0}
          </span>
        </div>
        <div className={cn(style.textRow, style.textBold)}>
          <span className={style.text}>Order total</span>
          <span className={style.amount}>{`$${formatNumber(orderTotal)}`}</span>
        </div>
      </div>
      <div className={style.agreementContainer}>
        <FormCheck>
          <FormCheck.Input
            type="checkbox"
            onClick={() => setIsTermsAccepted((prev) => !prev)}
          />
          <FormCheck.Label className={style.text}>
            I have reviewed the Kyros
            <Link
              to={ROUTES.LEGAL_EULA}
              className={style.link}
              target="__blank"
            >
              {' '}
              EULA Agreement{' '}
            </Link>
            and by checking this box, I hereby agree to the terms of this end
            user license agreement by Kyros.ai.
          </FormCheck.Label>
        </FormCheck>
      </div>
      <Button
        className={cn(style.proceedCheckout, {
          disabled: !(subtotal && isTermsAccepted),
        })}
        onClick={() => onSubmit(orderTotal, {
          csa_code: csaCodePromo?.code,
          promo_code: acceptedPromoCode?.code,
        })}
      >
        Proceed to checkout
      </Button>
    </div>
  );
};

export default PaymentOrder;
