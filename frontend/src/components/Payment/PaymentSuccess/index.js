import React from 'react';
import { CheckCircle } from 'react-bootstrap-icons';
import Button from 'react-bootstrap/Button';
import style from './style.module.scss';
import * as ROUTES from 'constants/routes';
import { Link } from 'react-router-dom';

const PaymentSuccess = () => {
  return (
    <div className={style.paymentSuccessWrapper}>
      <div className={style.container}>
        <div className={style.header}>
          <h1 className={style.headline}>
            Your payment is done successfully!
          </h1>
        </div>
        <div className={style.content}>
          <CheckCircle size={150} className={style.checkCircle} />
          <h3 className={style.contentTitle}>Thank you for your purchase with us</h3>
          <p className={style.contentText}>We received your order and payment both successfully. Keep an eye out for our email.</p>
        </div>
        <Link to={ROUTES.PAYMENT}>
          <Button className={style.submit}>Go to Payment page</Button>
        </Link>
      </div>
    </div>
  );
}

export default PaymentSuccess;
