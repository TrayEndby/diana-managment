import React from 'react';
import { XCircle } from 'react-bootstrap-icons';
import Button from 'react-bootstrap/Button';
import style from './style.module.scss';
import * as ROUTES from 'constants/routes';
import { Link } from 'react-router-dom';

const PaymentDeclined = () => {
  return (
    <div className={style.paymentDeclinedWrapper}>
      <div className={style.container}>
        <div className={style.header}>
          <h1 className={style.headline}>
            Your payment is declined!
          </h1>
        </div>
        <div className={style.content}>
          <XCircle size={150} className={style.xCircle} />
          <p className={style.contentText}>Your payment is declined. Please try again later.</p>
        </div>
        <Link to={ROUTES.PAYMENT}>
          <Button className={style.submit}>Go to Payment page</Button>
        </Link>
      </div>
    </div>
  );
}

export default PaymentDeclined;
