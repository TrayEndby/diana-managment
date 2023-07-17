import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import style from './style.module.scss';
import { useHistory } from 'react-router-dom';
import { formatNumber } from 'util/helpers';

const Receipt = () => {
  const [state, setState] = useState();
  const history = useHistory();

  useEffect(() => {
    if (history.location?.state) {
      setState(history.location.state)
    }
  }, [history])

  const goBack = () => history.goBack();
  const renderNoData = () => <h1>No data for this payment</h1>
  return (
    <div className={style.page}>
      {state ?
        <div className={style.receiptContainer}>
          <header className={style.header}>
            <Button onClick={goBack}  className={style.printNone}>
              Back
          </Button>
          </header>
          <section className={style.headSection}>
            <h1 className={style.headline}>Thank you, {state?.holderName}</h1>
            <div className={style.headSectionCred}>
              <div className={style.headLeft}>
                <h3 className={style.headLeftTitle}>Kyros.ai</h3>
                <p>Email: membership@kyros.ai</p>
              </div>
              <div className={style.headRight}>
                <Button className={style.printNone}
                  onClick={() => {window.print()}}>
                  Print Receipt
                </Button>
              </div>
            </div>
          </section>

          <section className={style.receiptSection}>
            <h2 className={style.headline}>Receipt for {state?.holderName}</h2>
            <div className={style.receiptInfo}>
              <p>Name: {state?.holderName}</p>
              <p>Email: {state?.holderEmail}</p>
              <p>Payment date: {state?.paid_date}</p>
              <p>Renewal date: {state?.renewalDate}</p>
            </div>
          </section>

          <section className={style.descriptionSection}>
            <div className={style.descriptionPart}>
              <h4 className={style.blockTitle}>Description</h4>
              <p>{state?.subscribedUsers} user subscription</p>
            </div>
            <div className={style.pricePart}>
              <h4 className={style.blockTitle}>Price</h4>
              <div className={style.priceRow}>
                <p>Subtotal <span className={style.subtotal}>{`$${formatNumber(state?.subtotal)}`}</span></p>
              </div>
              {!!state?.yearDiscount && <div className={style.priceRow}>
                <p>Multi-year discount ({Math.round(state?.yearDiscount*100)/100}%) <span className={style.discount}>{`-$${formatNumber(Math.round(state?.yearDiscountAmount*100)/100)}`}</span></p>
              </div>}
              {!!state?.csaDiscount && <div className={style.priceRow}>
                <p>Promotional code ({state?.csaDiscount}%) <span className={style.discount}>{`-$${formatNumber(Math.round(state?.csaDiscountAmount*100)/100)}`}</span></p>
              </div>}
            </div>
          </section>
          <section className={style.totalSection}>
            <div className={style.totalWrap}>
              <p>Total Charged</p>
              <p>{`$${formatNumber(state?.payment_amount)}`}</p>
            </div>
          </section>
        </div>
        : renderNoData()}
    </div>
  );
};

export default React.memo(Receipt);
